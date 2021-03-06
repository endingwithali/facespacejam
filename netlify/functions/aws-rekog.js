const AWS = require('aws-sdk');
require('dotenv').config()

exports.handler = async (event, context) => {
    // console.log(event.body)
    const eventBody = JSON.parse(event.body);
    let body;
    let statusCode = '200';
    const headers = {
        'Content-Type': 'application/json',
    };
    // console.log(eventBody)
    var jpg = true;
    var image;
    try {
        console.log(eventBody.image)
      image = atob(eventBody.image.split("data:image/jpeg;base64,")[1]);
      console.log("15")
      console.log(typeof image)
    //   image = eventBody.image.split("data:image/jpeg;base64,")[1]
    // https://eloquentcode.com/base64-encode-and-decode-in-node-js
        // console.log(image)    
        } catch (e) {
      jpg = false;
    }
    if (jpg == false) {
      try {
        image = atob(eventBody.image.split("data:image/png;base64,")[1]);
        console.log("24")
      } catch (e) {
        console.log("Not an image file Rekognition can process");
        console.log(e)
        return {
            statusCode: '405',
            body: JSON.stringify({
                error: "Not an image file type Rekognition can process (JPEG and PNG only)"
            }),
            headers,
        };
      }
    }
    console.log("line 34")

    //unencode image bytes for Rekognition DetectFaces API 
    var length = image.length;
    imageBytes = new ArrayBuffer(length);
    var ua = new Uint8Array(imageBytes);
    for (var i = 0; i < length; i++) {
        ua[i] = image.charCodeAt(i);
    }

    let response;
    try {
        switch (event.httpMethod) {
            case 'POST':
                await imageProcess(imageBytes).then(awsResp => {
                    if (response!=[]) {
                        response = awsResp.FaceDetails
                        statusCode = '200'
                    }
                    else throw new Error(`Issue with Rekognition`);

                });
                break;
            default:
                throw new Error(`Unsupported method "${event.httpMethod}"`);
        }
    } catch (err) {
        statusCode = '400';
        response = err.message
        console.log(body)
    } finally {
        body = JSON.stringify({
            response: response
        })
        console.log('finally')
    }

    console.log(body)
    console.log(statusCode)

    return {
        statusCode,
        body,
        headers,
    };
};

var imageProcess = async function(img){
    AWS.config.update({
        credentials: {
            accessKeyId: process.env.accessBeans,
            secretAccessKey: process.env.secretBeans
        },
        region: "us-east-1",
    });
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
            return []
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




