'use strict';

//https://www.serverless.com/blog/node-rest-api-with-serverless-lambda-and-dynamodb

const uuid = require('uuid');
const AWS = require('aws-sdk'); 
const { getUserID } = require('../functions/index');
const { getRestaurant, submitRestaurantDB } = require('./restaurant');


AWS.config.setPromisesDependency(require('bluebird'));
const dynamoDb = new AWS.DynamoDB.DocumentClient();

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
  await submitRestaurantDB(restaurant);
  
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
  
  

