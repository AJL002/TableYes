'use strict';

//https://www.serverless.com/blog/node-rest-api-with-serverless-lambda-and-dynamodb

const uuid = require('uuid');
const AWS = require('aws-sdk'); 
const { sendResponse, getUserID } = require('../functions/index');

const {
  DynamoDBClient, UpdateItemCommand,
} = require('@aws-sdk/client-dynamodb');
const { marshall, unmarshall } = require('@aws-sdk/util-dynamodb');



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
          message: `Sucessfully submitted restaurant with email ${email}`,
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
          message: `Unable to submit restaurant with email ${email}`,
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

//module.exports is for global invoke
module.exports.submitUserDB = user => {
  //for adding a user to database
    console.log('Submitting user ', user);
    const userInfo = {
      TableName: process.env.CANDIDATE_EMAIL_TABLE,
      Item: user,
    };
    //put user with (userinfo) into database
    return dynamoDb.put(userInfo).promise()
      .then(res => user);
  };

  //func to create user object, with parameters for table
  const userInfo = module.exports.userInfo = (id, name, email) => {
    const timestamp = new Date().getTime();
    return {
      id: id,
      name: name,
      email: email,
      reservations: {},
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
    const userID =  getUserID(token);
    const key = {
      email: userID
    };
    
  
  
    submitReservation(reservationInfo(userID, restaurantID, reserveTime, partySize))
      .then(res => {
        const updates = {
          reservations: reservationInfo(userID, restaurantID, reserveTime, partySize)
        };
        updateReserv2User(process.env.CANDIDATE_EMAIL_TABLE, key, updates);
        callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            message: `Sucessfully submitted reservation `,
            reserveID: res.id,
            userID: res.userID,
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

  

  const updateReserv2User = async (tableName, key , item) => {
    const itemKeys = Object.keys(item);

  // When we do updates we need to tell DynamoDB what fields we want updated.
  // If that's not annoying enough, we also need to be careful as some field names
  // are reserved - so DynamoDB won't like them in the UpdateExpressions list.
  // To avoid passing reserved words we prefix each field with "#field" and provide the correct
  // field mapping in ExpressionAttributeNames. The same has to be done with the actual
  // value as well. They are prefixed with ":value" and mapped in ExpressionAttributeValues
  // along witht heir actual value
  const { Attributes } = await dynamoDb.send(new UpdateItemCommand({
    TableName: tableName,
    Key: marshall(key),
    ReturnValues: 'ALL_NEW',
    UpdateExpression: `SET ${itemKeys.map((k, index) => `#field${index} = :value${index}`).join(', ')}`,
    ExpressionAttributeNames: itemKeys.reduce((accumulator, k, index) => ({ ...accumulator, [`#field${index}`]: k }), {}),
    ExpressionAttributeValues: marshall(itemKeys.reduce((accumulator, k, index) => ({ ...accumulator, [`:value${index}`]: item[k] }), {})),
  }));

  return unmarshall(Attributes);
};
  //   const reservation = reservationInfo(userID, restaurantID, reserveTime, partySize);
  
  //   const params = {
  //     TableName: process.env.CANDIDATE_EMAIL_TABLE,
  //     Key: {
  //       "email": userID,
  //     },
  //     UpdateExpression: 'SET reservation = :r',
  //     ExpressionAttributeValues: {
  //       ':r': reservation,
  //     },
  //   };
  
  //   await dynamoDb.update(params).promise();
  // }
  
    
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
  