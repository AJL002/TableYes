
//const AWS = require('aws-jwt-verify');
var jwt = require('jsonwebtoken');
var jwkToPem = require('jwk-to-pem');


const sendResponse = (statusCode, body) => {
    const response = {
        statusCode: statusCode,
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:3000',
            'Access-Control-Allow-Credentials': true
        }
    }
    return response
}

//password restrictions logic, pass must be > 6 characters 
const validateInput = (data) => {
    const body = JSON.parse(data);
    const { email, password } = body
    if (!email || !password || password.length < 6)
        return false
    return true
}


//decodes access token to reveal users id (sub)
function getUserID (token) {
    const decodedToken = jwt.decode(token, {
        complete: true
       });
      
       if (!decodedToken) {
           throw new Error('provided token does not decode as JWT');
       }
      
       return decodedToken.payload.sub;
      };
   
    
module.exports = {
    sendResponse, validateInput, getUserID
};