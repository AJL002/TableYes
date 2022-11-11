'use strict';

//https://www.serverless.com/blog/node-rest-api-with-serverless-lambda-and-dynamodb

const uuid = require('uuid');
const AWS = require('aws-sdk'); 
const { sendResponse, getUserID } = require('../functions/index');


AWS.config.setPromisesDependency(require('bluebird'));
const cognito = new AWS.CognitoIdentityServiceProvider();
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.submitRestaurant = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const fullname = requestBody.fullname;``
  const email = requestBody.email;
  const lat = requestBody.lat; 
  const long = requestBody.long;
  const token = requestBody.token;
  //const userType = requestBody.userType; || typeof userType !== 'string'
  const userID =  getUserID(token) //event.requestContext.authorizer.claims['cognito:email'];
  //console.log('userID:', userID);

  if (typeof fullname !== 'string' || typeof email !== 'string' || typeof lat !== 'number' || typeof long !== 'number' ) {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit restaurant because of validation errors.'));
    return;
  }

  submitRestaurant(restaurantInfo(fullname, email, lat, long, userID))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitRestaurantted restaurant with email ${email}`,
          restaurantId: res.id,
          userID: res.userID,
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submitRestaurant restaurant with email ${email}`,
        })
      })
    });
};

const submitRestaurant = restaurant => {
  console.log('Submitting restaurant');
  const restaurantInfo = {
    TableName: process.env.CANDIDATE_TABLE,
    Item: restaurant,
  };
  return dynamoDb.put(restaurantInfo).promise()
    .then(res => restaurant);
};

const restaurantInfo = (fullname, email, lat, long, userID) => {
  const timestamp = new Date().getTime();
  return {
    id: uuid.v1(),
    userID: userID,
    fullname: fullname,
    email: email,
    //owner-id: owner-id,
    lat: lat,
    long: long,
    submitRestauranttedAt: timestamp,
    updatedAt: timestamp,
  };
};

module.exports.list = (event, context, callback) => {
  var params = {
      TableName: process.env.CANDIDATE_TABLE,
      ProjectionExpression: "id, fullname, email, coordinate"
  };

  console.log("Scanning Candidate table.");
  const onScan = (err, data) => {

      if (err) {
          console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
          callback(err);
      } else {
          console.log("Scan succeeded.");
          return callback(null, {
              statusCode: 200,
              body: JSON.stringify({
                  candidates: data.Items
              })
          });
      }

  };

  dynamoDb.scan(params, onScan);

};

	
module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.CANDIDATE_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
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

module.exports.submitUser =  (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const fullname = requestBody.fullname;
  const email = requestBody.email;

  if (typeof fullname !== 'string' || typeof email !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit user because of validation errors.'));
    return;
  }

  submitUser(userInfo(fullname, email))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitted user with email ${email}`,
          userId: res.id,
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submitted user with email ${email}`,
        })
      });
    });
};
  
  const submitUser = user => {
    console.log('Submitting user ', user);
    const userInfo = {
      TableName: process.env.CANDIDATE_EMAIL_TABLE,
      Item: user,
    };
    return dynamoDb.put(userInfo).promise()
      .then(res => user);
  };

  const userInfo = (fullname, email) => {
    const timestamp = new Date().getTime();
    return {
      id: uuid.v1(),
      fullname: fullname,
      email: email,
      submitRestauranttedAt: timestamp,
      updatedAt: timestamp,
    };
  };

  module.exports.submitReservation =  (event, context, callback) => {
    const requestBody = JSON.parse(event.body);
    const restaurantID = requestBody.restaurantID;
    const reserveTime = requestBody.reserveTime;
    const partySize = requestBody.partySize;
    const token = requestBody.token;
    const userID =  getUserID(token)
  
  
    submitReservation(reservationInfo(userID, restaurantID, reserveTime, partySize))
      .then(res => {
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            message: `Sucessfully submitted reservation `,
            reserveID: res.id,
          })
        });
      })
      .catch(err => {
        console.log(err);
        callback(null, {
          statusCode: 500,
          body: JSON.stringify({
            message: `Unable to submit reservation`,
          })
        });
      });
  };
    
    const submitReservation = reservation => {
      console.log('Submitting reservation ', reservation);
      const reservationInfo = {
        TableName: process.env.RESERVATION_TABLE,
        Item: reservation,
      };
      return dynamoDb.put(reservationInfo).promise()
        .then(res => reservation);
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
      TableName: process.env.CANDIDATE_TABLE,
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
  