'use strict';

//https://www.serverless.com/blog/node-rest-api-with-serverless-lambda-and-dynamodb

const uuid = require('uuid');
const AWS = require('aws-sdk'); 
const { sendResponse, getUserID } = require('../functions/index');

const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');



AWS.config.setPromisesDependency(require('bluebird'));
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.submitRestaurant = async (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const fullname = requestBody.fullname;
  const email = requestBody.email;
  const lat = requestBody.lat; 
  const long = requestBody.long;
  const token = requestBody.token;
  //const userType = requestBody.userType; || typeof userType !== 'string'
  const ownerID =  getUserID(token); //event.requestContext.authorizer.claims['cognito:email'];
  //console.log('userID:', userID);

  if (typeof fullname !== 'string' || typeof email !== 'string' || typeof lat !== 'number' || typeof long !== 'number' ) {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit restaurant because of validation errors.'));
    return;
  }
  
   // get user
   console.log("retrieving user ",userID);
   
   var user = await getUser(ownerID);
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
   await putUser(user);

  await submitRestaurant(restaurantInfo(fullname, email, lat, long, ownerID))
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

module.exports.list = (event, context, callback) => {
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

var getUser = async id => {
   const params = {
    TableName: process.env.USER_TABLE,
    Key: {
      id: id
    }
  };
  console.log('calling dynamoDb');
  const user = await dynamoDb.get(params).promise().then(function(user) {
    console.log("got something ", user);
    return user;
  })
  .catch(function(err) {
    console.log(err);
  });
  return user.Item;
}	

var getRestaurant = async id => {
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

  //func to create user object, with parameters for table
   module.exports.userInfo = (id, name, email) => {
    const timestamp = new Date().getTime();
    return {
      id: id,
      name: name,
      email: email,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  };
  
module.exports.get = (event, context, callback) => {
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

//module.exports is for global invoke
var putUser = module.exports.submitUserDB = user => {
  //for adding a user to database
    console.log('Submitting user ', user);
    const userInfo = {
      TableName: process.env.USER_TABLE,
      Item: user,
    };
    //put user with (userinfo) into database
    return dynamoDb.put(userInfo).promise()
      .then(res => user);
  };

  //func to create user object, with parameters for table
   module.exports.userInfo = (id, name, email) => {
    const timestamp = new Date().getTime();
    return {
      id: id,
      name: name,
      email: email,
      createdAt: timestamp,
      updatedAt: timestamp,
    };
  };

  module.exports.submitReservation = async (event, context, callback) => {
    const requestBody = JSON.parse(event.body);
    const restaurantID = requestBody.restaurantID;
    const reserveTime = requestBody.reserveTime;
    const partySize = requestBody.partySize;
    const token = requestBody.token;
    const userID =  getUserID(token);
    
    
   // get user
   console.log("retrieving user ",userID);
   
   var user = await getUser(userID);
   console.log("user ",user);

  //create reservations field in user
   const reservation = reservationInfo(userID, restaurantID, reserveTime, partySize);
   var reservations = new Array();
   if ( typeof user.reservations != "undefined") {
     console.log("reservations not empty", reservations);
     reservations = user.reservations;
   }
   console.log("reservations:", reservations);
    //push reservation obj to user 
   console.log("adding reservation ", reservation);
   reservations.push(reservation);
   
   user.reservations = reservations;
   console.log("user ",user);
  
   //put user back to DynamoDB
   await putUser(user);
  
  //grab restaurant
  var restaurant = await getRestaurant(restaurantID);
  
   if ( typeof restaurant.reservations == "undefined") {
     console.log("reservations empty in restaurant");
     restaurant.reservations = new Array();
   }
  //add reservation obj to restaurant
  restaurant.reservations.push(reservation);
  //update restaurant
  await submitRestaurant(restaurant);
  
   await submitReservation(reservation)
    .then(res => {
      console.log("Inside then");
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitted reservation`,
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submit reservation `,
        })
      });
    });
      
  };

    const submitReservation = async reservation => {
      console.log('Submitting reservation ', reservation);
      const reservationInfo = {
        TableName: process.env.RESERVATION_TABLE,
        Item: reservation,
      };
      return  dynamoDb.put(reservationInfo).promise()
        .then(res => {
          console.log("completed put ");
          reservation
          }).catch(err => {
      console.log(err);
      });
    };
  
    const reservationInfo = (userID, restaurantID, reserveTime, partySize) => {
      const timestamp = new Date().getTime();
      return {
        id: uuid.v1(),
        userID: userID,
        restaurantID: restaurantID,
        reserveTime: reserveTime,
        partySize: partySize,
        submitreservationAt: timestamp,
        updatedAt: timestamp,
      };
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