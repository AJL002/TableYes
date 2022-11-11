
//const AWS = require('aws-jwt-verify');
var jwt = require('jsonwebtoken');
var jwkToPem = require('jwk-to-pem');


const sendResponse = (statusCode, body) => {
    const response = {
        statusCode: statusCode,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        }
    }
    return response
}

const validateInput = (data) => {
    const body = JSON.parse(data);
    const { email, password } = body
    if (!email || !password || password.length < 6)
        return false
    return true
}

function getHeaderFromToken(token) {
    const decodedToken = jwt.decode(token, {
     complete: true
    });
   
    if (!decodedToken) {
        throw new Error('provided token does not decode as JWT');
    }
   
    return decodedToken;
   }


const getUserID = (token) => {
        const decodedToken = jwt.decode(token, {
         complete: true
        });
    return decodedToken;
};

    
module.exports = {
    sendResponse, validateInput, getUserID
};