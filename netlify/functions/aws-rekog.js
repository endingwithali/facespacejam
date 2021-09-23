const AWS = require('aws-sdk');
// require('dotenv')
// AWS.config(process.env.AWS)



/*
 const credentials = new AWS.SharedIniFileCredentials({
    profile: process.env.SLS_PROFILE,
  })

  AWS.config.credentials = credentials

  const rekognitionPromise = rekognition.indexFaces(params).promise()
  const data = await rekognitionPromise.catch((error) => {
    console.error("ERROR: unable to initialize user into REKOGNITION")
    console.error(error)
    const msg = error.message || "Error: initialization error"
    throw new FaceError(400, msg)
  })
*/
exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));
    const eventBody = JSON.parse(event.body);
    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };

    var jpg = true;
    var image;
    try {
      image = atob(eventBody.image.split("data:image/jpeg;base64,")[1]);
        // image = atob(eventBody.split("data:image/jpeg;base64,")[1]);

    } catch (e) {
      jpg = false;
    }
    if (jpg == false) {
      try {
        image = atob(e.target.result.split("data:image/png;base64,")[1]);
      } catch (e) {
        // alert("Not an image file Rekognition can process");
        return {
            statusCode: '400',
            body: JSON.stringify({
                error: "Not an image file type Rekognition can process (JPEG and PNG only)"
            }),
            headers,
        };
      }
    }

    //unencode image bytes for Rekognition DetectFaces API 
    var length = image.length;
    imageBytes = new ArrayBuffer(length);
    var ua = new Uint8Array(imageBytes);
    for (var i = 0; i < length; i++) {
        ua[i] = image.charCodeAt(i);
    }
    // console.log("Image info")
    // console.log(imageBytes)
    try {
        switch (event.httpMethod) {
            case 'POST':
                await process(imageBytes).then(hello => {
                    console.log(hello)
                });
                console.log("catch err 29")
                break;
            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    } catch (err) {
        console.log("catch err 34")
        statusCode = '400';
        body = err.message;
        console.log(body)
    } finally {
        console.log("catch err 39")
        body = JSON.stringify(body);
        console.log(body)
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
    return rekognition.detectFaces(params, function(err, response){
        if (err){
            console.log("rekognition failed")
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
    }).promise()
}




