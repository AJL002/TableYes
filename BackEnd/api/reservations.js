
'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');
const { getUserID } = require('../functions/index');
const { getRestaurant, submitRestaurantDB } = require('./restaurant');
const { getUserDB, submitUserDB } = require('./user');
const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,DELETE,PUT',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'
}

AWS.config.setPromisesDependency(require('bluebird'));
const dynamoDb = new AWS.DynamoDB.DocumentClient();

//func to submit reservation to resturant as specific user 
module.exports.submitReservation = async (event, context, callback) => {
    const requestBody = JSON.parse(event.body);
    const restaurantID = requestBody.restaurantID;
    const reserveTime = requestBody.reserveTime;
    const partySize = requestBody.partySize;
    const token = requestBody.token;
    const userID = getUserID(token);


    // get user
    console.log("retrieving user ", userID);

    var user = await getUserDB(userID);
    console.log("user ", user);

    //create reservations field in user, if no field create new 
    const reservation = reservationInfo(userID, restaurantID, reserveTime, partySize);
    var reservations = new Array();
    if (typeof user.reservations != "undefined") {
        console.log("reservations not empty", reservations);
        reservations = user.reservations;
    }
    console.log("reservations:", reservations);

    //push reservation obj to user 
    console.log("adding reservation ", reservation);
    reservations.push(reservation);

    user.reservations = reservations;
    console.log("user ", user);

    //put user back to DynamoDB
    await submitUserDB(user);

    //grab restaurant
    var restaurant = await getRestaurant(restaurantID);
    if(typeof restaurant == "undefined"){
        console.log("invalid restaurant id");
        callback(null, {
            statusCode: 500,
            body: JSON.stringify({
                message: `invalid restaurant id `,
            })});
        return;
    }
    if (typeof restaurant.reservations == "undefined") {
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
                headers: headers
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
    return dynamoDb.put(reservationInfo).promise()
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

var getReservation = module.exports.getReservationDB = async id => {
    const params = {
        TableName: process.env.RESERVATION_TABLE,
        Key: {
            id: id
        }
    };
    console.log('calling dynamoDb');
    const reservation = await dynamoDb.get(params).promise().then(function (reservation) {
        console.log("got something ", reservation);
        return reservation;
    })
        .catch(function (err) {
            console.log(err);
        });
    return reservation.Item;
}


module.exports.updateReservation = async (event, context) => {
    const requestBody = JSON.parse(event.body);
    const token = requestBody.token;
    const userID = getUserID(token);
    const reservationID = requestBody.reservationID;
    const reserveTime = requestBody.reserveTime;
    let body;
    let statusCode = 200;


    try {
        let updateReserv = await updateItemReserv(reservationID, reserveTime);
        let updateRest = await updateItemRestaurant(reservationID, reserveTime);
        let updateUser = await updateItem(userID, reservationID, reserveTime)
        body = {
            updateReserv, updateRest, updateUser,
            message: `succesfully updated Item `,
        };

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


async function updateItem(userID, reservationID, reserveTime) {
    console.log("updateItem");
    let target = 0;
    let user = await getUserDB(userID);
    console.log("user ", user);
    let reservations = user.reservations;
    console.log("reservations:", reservations);

    for (let i = 0; i < reservations.length; i++) {
        if (reservations[i].id == reservationID) {
            target = i;
            console.log(reservations[i].id);
        }
        console.log("else ", reservations[i].id);
    }
    console.log("target: ", target);

    const params = {
        TableName: process.env.USER_TABLE,
        Key: {
            id: userID,
        },
        UpdateExpression: `set reservations[${target.toString()}].reserveTime = :reserveTime`,
        ExpressionAttributeValues: {
            ":reserveTime": reserveTime,
        },
        ReturnValues: "UPDATED_NEW",

    };
    return dynamoDb.update(params).promise();
}

function updateItemReserv(reservationID, reserveTime) {
    console.log("updateItemReserv");
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

async function updateItemRestaurant(reservationID, reserveTime) {
    console.log("updateItemRestaurant");
    let target = 0;
    let reservation = await getReservation(reservationID);
    let restaurantID = reservation.restaurantID;
    let restaurant = await getRestaurant(restaurantID);
    let reservations = restaurant.reservations;



    for (let i = 0; i < reservations.length; i++) {
        if (reservations[i].id == reservationID) {
            target = i;
            console.log(reservations[i].id);
        }
        console.log("else ", reservations[i].id);
    }
    console.log("target: ", target);

    const params = {
        TableName: process.env.RESTAURANTS_TABLE,
        Key: {
            id: restaurantID,
        },
        UpdateExpression: `set reservations[${target.toString()}].reserveTime = :reserveTime`,
        ExpressionAttributeValues: {
            ":reserveTime": reserveTime,
        },
        ReturnValues: "UPDATED_NEW",

    };
    return dynamoDb.update(params).promise();
}