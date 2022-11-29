exports.handler = async (event, context, callback) => {
  //  https://github.com/shivangchauhan7/serverless-auth
  const AWS = require('aws-sdk');
  const { sendResponse, validateInput } = require("../functions");
  const { submitUserDB, userInfo } = require('./user');

  const cognito = new AWS.CognitoIdentityServiceProvider();

  //validate request body
  const isValid = validateInput(event.body);
  if (!isValid)
    return sendResponse(400, { message: 'Invalid input' });

  //declaring variables: name,email, password. which are parsed from req body 
  const {
    name,
    email,
    password
  } = JSON.parse(event.body)
  const {
    user_pool_id
  } = process.env

  //params for user in the userpool 
  const params = {
    UserPoolId: user_pool_id,
    Username: email,
    UserAttributes: [{
      Name: 'email',
      Value: email
    },
    {
      Name: 'email_verified',
      Value: 'true'
    }
    ]
  }
  const response = await cognito.adminCreateUser(params).promise();

  if (response.User) {
    const paramsForSetPass = {
      Password: password,
      UserPoolId: user_pool_id,
      Username: email,
      Permanent: true
    };
    delete params.UserAttributes;
    delete params.MessageAction;

    await cognito.adminSetUserPassword(paramsForSetPass).promise();
    const res = await cognito.adminGetUser(params).promise();
    console.log("res ", res);
    await submitUserDB(userInfo(res.UserAttributes[0].Value, name, email, password))

  }
  return sendResponse(200, {
    message: 'User registration successful'
  })
}