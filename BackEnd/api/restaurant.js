
const uuid = require('uuid');
const AWS = require('aws-sdk'); 
const { getUserID } = require('../functions/index');
const { submitUserDB, getUserDB } = require('./user');



AWS.config.setPromisesDependency(require('bluebird'));
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.submitRestaurant = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const fullname = requestBody.fullname;
  const email = requestBody.email;
  const lat = requestBody.lat; 
  const long = requestBody.long;
  const token = requestBody.token;

  const ownerID =  getUserID(token); 


  if (typeof fullname !== 'string' || typeof email !== 'string' || typeof lat !== 'number' || typeof long !== 'number' ) {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit restaurant because of validation errors.'));
    return;
  }
  
   // get user
   console.log("retrieving user ",ownerID);
   
   var user = await getUserDB(ownerID);
   console.log("user ",user);
  
   const restaurant = restaurantInfo(fullname, email, lat, long, ownerID);
   var restaurants = new Array();
   
   if ( typeof user.restaurants != "undefined") {
     console.log("restaurants not empty", restaurants);
     restaurants = user.restaurants;
   }
   console.log("restaurants:", restaurants);
    
   console.log("adding restaurants ", restaurants);
   restaurants.push(restaurant.id);
   
   user.restaurants = restaurants;
   console.log("user ",user);
  
   //put user back to DynamoDB
   await submitUserDB(user);

  await submitRestaurant(restaurant)
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitted restaurant with email ${email}`,
          restaurantId: res.id,
          ownerID: res.ownerID,
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submit restaurant with email ${email}`,
        })
      })
    });
};

const submitRestaurant = async restaurant => {
  console.log('Submitting restaurant');
  const restaurantInfo = {
    TableName: process.env.RESTAURANTS_TABLE,
    Item: restaurant,
  };
  return dynamoDb.put(restaurantInfo).promise()
    .then(res => restaurant);
};

const restaurantInfo = (fullname, email, lat, long, ownerID) => {
  const timestamp = new Date().getTime();
  return {
    id: uuid.v1(),
    ownerID: ownerID,
    fullname: fullname,
    email: email,
    lat: lat,
    long: long,
    submitRestauranttedAt: timestamp,
    updatedAt: timestamp,
  };
};


module.exports.listRestaurants = (event, context, callback) => {
    var params = {
        TableName: process.env.RESTAURANTS_TABLE,
        ProjectionExpression: "id, fullname, email, coordinate"
    };
  
    console.log("Scanning restaurant table.");
    const onScan = (err, data) => {
  
        if (err) {
            console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
            callback(err);
        } else {
            console.log("Scan succeeded.");
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    restaurants: data.Items
                })
            });
        }
  
    };
  
    dynamoDb.scan(params, onScan);
  
  };

  var getRestaurant = module.exports.getRestaurant = async id => {
    const params = {
     TableName: process.env.RESTAURANTS_TABLE,
     Key: {
       id: id
     }
   };
   console.log('calling dynamoDb');
   const rest = await dynamoDb.get(params).promise().then(function(rest) {
     console.log("got something ", rest);
     return rest;
   })
   .catch(function(err) {
     console.log(err);
   });
   return rest.Item;
 }	

 module.exports.getRest = (event, context, callback) => {
    const params = {
      TableName: process.env.RESTAURANTS_TABLE,
      Key: {
        id: event.pathParameters.id
      }
    };
   
    dynamoDb.get(params).promise()
      .then(result => {
        const response = {
          statusCode: 200,
          body: JSON.stringify(result.Item),
        };
        callback(null, response);
      })
      .catch(error => {
        console.error(error);
        callback(new Error('Couldn\'t fetch restaurant.'));
        return;
      });
  };
  
  module.exports.delete = async (event, context) => {
    let body;
    let statusCode = 200;
    const headers = {
      "Content-Type": "application/json"
    };
    try{
      await dynamoDb.delete({
        TableName: process.env.RESTAURANTS_TABLE,
        Key: {
          id: event.pathParameters.id
        }
      })
      .promise();
    body = `Deleted item ${event.pathParameters.id}`;
    }
    catch (err) {
      statusCode = 400;
      body = err.message;
    } finally {
      body = JSON.stringify(body);
    }
    return {
      statusCode,
      body,
      headers
    };
    };
 