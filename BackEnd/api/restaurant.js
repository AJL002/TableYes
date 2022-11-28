
const uuid = require('uuid');
const AWS = require('aws-sdk'); 
const { getUserID } = require('../functions/index');
const { submitUserDB, getUserDB } = require('./user');
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true ,
  'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,DELETE,PUT',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'
}


AWS.config.setPromisesDependency(require('bluebird'));
const dynamoDb = new AWS.DynamoDB.DocumentClient();

//func to submit restaurant and add restaurant to owner 
module.exports.submitRestaurant = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const fullname = requestBody.fullname;
  const email = requestBody.email;
  const lat = requestBody.lat; 
  const long = requestBody.long;
  const token = requestBody.token;

  const ownerID =  getUserID(token); 

//check if fullname, email, lat, long are accepted values
  if (typeof fullname !== 'string' || typeof email !== 'string' || typeof lat !== 'number' || typeof long !== 'number' ) {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit restaurant because of validation errors.'));
    return;
  }
  
   // get user
   console.log("retrieving user ",ownerID);
   
   var user = await getUserDB(ownerID);
   console.log("user ",user);

  //create new restaurant obj using func restaurantInfo() template 
   const restaurant = restaurantInfo(fullname, email, lat, long, ownerID);

   //restaurants will be an attribute of type Array for each user that is restaurant owner 
   var restaurants = new Array();
   
   //if user has restaurant attribute set var restaurants to user's previous values 
   if ( typeof user.restaurants != "undefined") {
     console.log("restaurants not empty", restaurants);
     restaurants = user.restaurants;
   }

   //else 
   console.log("restaurants:", restaurants);
   console.log("adding restaurants ", restaurants);

   //update restaurants array with new restaurant id 
   restaurants.push(restaurant.id);
   
   //set user's restuarants attribute to new restaurants array
   user.restaurants = restaurants;
   console.log("user ",user);
  
   //put user back to DynamoDB
   await submitUserDB(user);

   //actually submit restaurant or catch error
  await submitRestaurant(restaurant)
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitted restaurant with email ${email}`,
          restaurantId: res.id,
          ownerID: res.ownerID,
        }),
        headers: headers
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submit restaurant with email ${email}`,
        }),
        headers: headers
      })
    });
};

//const submitRestaurant for local invoke, module.exports for global invoke 
//funct to submit restaurant to database 
const submitRestaurant = module.exports.submitRestaurantDB= async restaurant => {
  console.log('Submitting restaurant');
  const restaurantInfo = {
    TableName: process.env.RESTAURANTS_TABLE,
    Item: restaurant,
  };
  return dynamoDb.put(restaurantInfo).promise()
    .then(res => restaurant);
};

//func to create restaurant obj, with define parameters for database 
const restaurantInfo = (fullname, email, lat, long, ownerID, id) => {
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

//func to list all restaurants in database
module.exports.listRestaurants = (event, context, callback) => {
    var params = {
        //specify name of table you are using
        //process.env variables are globally accessible variables defined in yml 
        TableName: process.env.RESTAURANTS_TABLE,
        //A projection expression is a string that identifies the attributes that you want
        ProjectionExpression: "id, ownerID, fullname, email, lat, long "
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
                }),
                headers: headers
            });
        }
  
    };
  
    dynamoDb.scan(params, onScan);
  
  };

//func to get restaurant with specific id 
module.exports.getRestaurant = async id => {
    const params = {
        //specify name of database
        TableName: process.env.RESTAURANTS_TABLE,
     //specify key type for func to know what to search for 
     Key: {
       id: id
     }
   };
   console.log('calling dynamoDb');

   //rest = restaurant 
   const rest = await dynamoDb.get(params).promise().then(function(rest) {
     console.log("got something ", rest);
     return rest;
   })
   .catch(function(err) {
     console.log(err);
   });
   return rest.Item;
 }	

 //another get restuarant func but getting id as path param eg: /{id}
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
          headers: headers
        };
        callback(null, response);
      })
      .catch(error => {
        console.error(error);
        callback(new Error('Couldn\'t fetch restaurant.'));
        return;
      });
  };
  
  //restuarant delete method with path param eg: /{id}
  //does not delete restuarant obj from user table 
  module.exports.delete = async (event, context) => {
    let body;
    let statusCode = 200;
   
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
 