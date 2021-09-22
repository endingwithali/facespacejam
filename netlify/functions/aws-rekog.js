const AWS = require('aws-sdk');
// require('dotenv')
// AWS.config(process.env.AWS)


exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    const eventBody = JSON.parse(event.body)
    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };


    //unencode image bytes for Rekognition DetectFaces API 
    var length = eventBody.image.length;
    imageBytes = new ArrayBuffer(length);
    var ua = new Uint8Array(imageBytes);
    for (var i = 0; i < length; i++) {
        ua[i] = eventBody.image.charCodeAt(i);
    }

    try {
        switch (event.httpMethod) {
            case 'POST':
                body = await process(imageBytes);
                break;
            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    } catch (err) {
        statusCode = '400';
        body = err.message;
    } finally {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
        headers,
    };
};

var process = async function(img){
    // AWS.config.region = 'RegionToUse'; // Region
    // AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    //   IdentityPoolId: 'IdentityPoolIdToUse',
    // });
    // // Make the call to obtain credentials
    // AWS.config.credentials.get(function () {
    //     // Credentials will be available when this function is called.
    //     var accessKeyId = AWS.config.credentials.accessKeyId;
    //     var secretAccessKey = AWS.config.credentials.secretAccessKey;
    //     var sessionToken = AWS.config.credentials.sessionToken;
    //     });
    // }
    var rekognition = new AWS.Rekognition();
    var params = {
        Image: {
            Bytes: img
        },
        Attributes: [
            'DEFAULT',
        ]
    };
    return boundingbox = await rekognition.detectFaces(params, function(err, response){
        if (err){
            console.error(err);
            throw "Sparrow!";
        }
        var faces = []
        response.FaceDetails.forEach(data => {
            var faceInfo = {}
            faceInfo.width = data.BoundingBox.Width
            faceInfo.height = data.BoundingBox.Height
            faceInfo.left = data.BoundingBox.Left
            faceInfo.right = data.BoundingBox.Top
            faces.push(faceInfo)
        })
        return faces
    })
}

