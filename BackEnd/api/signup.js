exports.handler = async(event, context, callback) => {
  //  https://github.com/shivangchauhan7/serverless-auth
  const AWS = require('aws-sdk');
  const { sendResponse, validateInput } = require("../functions");
  const { submitUserDB, userInfo } = require('./candidate');

  
  const cognito = new AWS.CognitoIdentityServiceProvider();

  
  //validate request body
  const isValid = validateInput(event.body);
  if (!isValid)
  return sendResponse(400, { message: 'Invalid input' });
  
  const {
      name,
      email,
      password
      } = JSON.parse(event.body)
     const {
      user_pool_id
      } = process.env
     
     const params = {
       ClientId: user_pool_id,
       Username: email,
       Password : password,
       UserAttributes: [{
           Name: 'email',
           Value: email
         },
         {
           Name: 'email_verified',
           Value: 'true'
         }
       ],
       MessageAction: 'SUPPRESS'
     }
     const response = await cognito.signup(params).promise();
     
     if (response.UserSub) {
      submitUserDB(userInfo(response.UserSub,name, email, password))
      // const paramsForSetPass = {
      //   Password: password,
      //   UserPoolId: user_pool_id,
      //   Username: email,
      //   Permanent: true
      // };
    
    
     // await cognito.adminSetUserPassword(paramsForSetPass).promise();
      
    }
    return sendResponse(200, {
      message: 'User registration successful'
    })
  }