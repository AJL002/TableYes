'use strict';

//https://www.serverless.com/blog/node-rest-api-with-serverless-lambda-and-dynamodb

const uuid = require('uuid');
const AWS = require('aws-sdk'); 
const { sendResponse } = require('../functions/index')

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.submit = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const fullname = requestBody.fullname;
  const email = requestBody.email;
  const coordinates = requestBody.coordinates;

  if (typeof fullname !== 'string' || typeof email !== 'string' || typeof coordinates !== 'number') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit candidate because of validation errors.'));
    return;
  }

  submitRestaurant(restaurantInfo(fullname, email, coordinates))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitted restaurant with email ${email}`,
          candidateId: res.id
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submit restaurant with email ${email}`
        })
      })
    });
};


const submitRestaurant = restaurant => {
  console.log('Submitting restaurant');
  const candidateInfo = {
    TableName: process.env.CANDIDATE_TABLE,
    Item: restaurant,
  };
  return dynamoDb.put(candidateInfo).promise()
    .then(res => restaurant);
};

const restaurantInfo = (fullname, email, coordinates) => {
  const timestamp = new Date().getTime();
  return {
    id: uuid.v1(),
    fullname: fullname,
    email: email,
    coordinates: coordinates,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};

module.exports.list = (event, context, callback) => {
  var params = {
      TableName: process.env.CANDIDATE_TABLE,
      ProjectionExpression: "id, fullname, email, coordinates"
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