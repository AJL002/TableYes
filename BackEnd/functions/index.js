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

const getUserID = () => {
    AWS.config.credentials.get(function(err, resp) {
        if (err) {
            console.log('get creds error', err);
            alert('get creds error' + err);
        } else {
            console.log('get creds success', AWS.config.credentials);

            // Credentials will be available when this function is called.
            accessKeyId = AWS.config.credentials.accessKeyId;
            secretAccessKey = AWS.config.credentials.secretAccessKey;
            sessionToken = AWS.config.credentials.sessionToken;

            console.log("in creds.get - accessKeyId: " + accessKeyId);
            console.log("in creds.get - secretyKey: " + secretAccessKey);
            console.log("in creds.get - sessionToken: " + sessionToken);
            // get this Id 
            console.log('UserID: ', AWS.config.credentials.params.IdentityId);
        }  
    });
    return  AWS.config.credentials.params.IdentityId;
}

module.exports = {
    sendResponse, validateInput, getUserID
};