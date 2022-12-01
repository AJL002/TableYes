'use strict';
 
//https://www.serverless.com/blog/node-rest-api-with-serverless-lambda-and-dynamodb

const AWS = require('aws-sdk');
const { getUserID } = require('../functions/index');
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
  'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,DELETE,PUT',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'
}

AWS.config.setPromisesDependency(require('bluebird'));
const dynamoDb = new AWS.DynamoDB.DocumentClient();

// module.export for global invoke
//function to get user from database with id 
module.exports.getUserDB = async id => {
  const params = {
    TableName: process.env.USER_TABLE,
    Key: {
      id: id
    }
  };
  console.log('calling dynamoDb');
  const user = await dynamoDb.get(params).promise().then(function (user) {
    console.log("got something ", user);
    return user;
  })
    .catch(function (err) {
      console.log(err);
    });
  return user.Item;
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

//another get user func but getting id as path param eg: /{id}
module.exports.getUserPar = (event, context, callback) => {
  const params = {
    TableName: process.env.USER_TABLE,
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
      callback(new Error('Couldn\'t fetch user.'));
      return;
    });
};

//another get user restaurants func
module.exports.getUserDetails = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const token = requestBody.token;
  const attribute = requestBody.attribute.toString();
  if(typeof attribute !== 'string'){
    console.error('Validation Failed');
    callback(new Error('Attribute is not of type string. Only accepted values are: reservations or restaurants'));
    return;
  }
  const userID = getUserID(token);
  const params = {
    TableName: process.env.USER_TABLE,
    Key: {
      id: userID
    },
    ProjectionExpression: attribute ,
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
      callback(new Error('Couldn\'t fetch user.'));
      return;
    });
};


// module.exports is for global invoke
module.exports.submitUserDB = user => {

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
