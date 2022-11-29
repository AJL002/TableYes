
const AWS = require('aws-sdk')
const { sendResponse, validateInput } = require("../functions");
const cognito = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event, context, callback) => {

  //declaring variable that are parsed from req body 
  const {
    email,
    password
  } = JSON.parse(event.body)
  const {
    user_pool_id,
    client_id
  } = process.env

  const params = {
    AuthFlow: "ADMIN_NO_SRP_AUTH",
    UserPoolId: user_pool_id,
    ClientId: client_id,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password
    }
  }

  const response = await cognito.adminInitiateAuth(params).promise();
  return sendResponse(200, {
    message: 'Success',
    idToken: response.AuthenticationResult.IdToken,
    accessToken: response.AuthenticationResult.AccessToken,
  })
}