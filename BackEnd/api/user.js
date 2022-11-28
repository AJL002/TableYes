'use strict';

//https://www.serverless.com/blog/node-rest-api-with-serverless-lambda-and-dynamodb

const uuid = require('uuid');
const AWS = require('aws-sdk'); 
const { getUserID } = require('../functions/index');
const { getRestaurant, submitRestaurantDB } = require('./restaurant');
const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true ,
  'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,DELETE,PUT',
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'
}

AWS.config.setPromisesDependency(require('bluebird'));
const dynamoDb = new AWS.DynamoDB.DocumentClient();

//var getUser for local invoke, module.export for global invoke
//function to get user from database with id 
var getUser = module.exports.getUserDB = async id => {
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
  

//var putUser is for local invoke, module.exports is for global invoke
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

//func to submit reservation to resturant as specific user 
  module.exports.submitReservation = async (event, context, callback) => {
    const requestBody = JSON.parse(event.body);
    const restaurantID = requestBody.restaurantID;
    const reserveTime = requestBody.reserveTime;
    const partySize = requestBody.partySize;
    const token = requestBody.token;
    const userID = getUserID(token);
    
    
   // get user
   console.log("retrieving user ",userID);
   
   var user = await getUser(userID);
   console.log("user ",user);

  //create reservations field in user, if no field create new 
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

  //update restaurant as well 
  await submitRestaurantDB(restaurant);

  //actually submit reservation or catch error
   await submitReservation(reservation)
    .then(res => {
      console.log("Inside then");
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitted reservation`,
          reservationID: reservation.id,
          restuarantID: restaurantID,
          userID: userID,
        }),
        headers: headers
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submit reservation `,
        }),
        headers : headers
      });
    });
      
  };

//func that puts reservation into database 
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

  //func to create reservation object, with defined parameters for database
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
  

    module.exports.updateReservation = async (event, context) => {
      const requestBody = JSON.parse(event.body);
      const reservationID = requestBody.reservationID;
      const reserveTime = requestBody.reserveTime;
      let body;
      let statusCode = 200;

     
      try{
        await updateItem(reservationID, reserveTime);
      body = `succesfully updated`;
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
   





    function updateItem(reservationID, reserveTime) {
      const params = {
          TableName: process.env.RESERVATION_TABLE,
  // this is your DynamoDB Table 
          Key: {
              id: reservationID,
  //find the id in the table that you pull from the event 
          },
          UpdateExpression: "set reserveTime = :reserveTime",
          // This expression is what updates the item attribute 
  ExpressionAttributeValues: {
              ":reserveTime": reserveTime,
  //create an Expression Attribute Value to pass in the expression above
          },
          ReturnValues: "UPDATED_NEW",
  // Return the newly updated values 
      };
      return dynamoDb.update(params).promise();
  // pass in the params above and fire the actual dynamoDB update method
  }