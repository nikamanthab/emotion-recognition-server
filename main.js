const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var fs = require('fs');

const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient({
    keyFilename: 'APIkey.json'
});



app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));
app.use(bodyParser.json({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
}));

app.post('/app', (req, res) => {
    // console.log(req.body.image);
    // callFaceDetect()
    img = req.body.image;
    var base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");

    require("fs").writeFile("out.png", base64Data, 'base64', function (err) {
        if (err) console.log(err);
        client.faceDetection('./out.png')
            .then(res => {
                // console.log(JSON.stringify(res,null, 4));
                var joy = res[0]["faceAnnotations"][0]["joyLikelihood"];
                var anger = res[0]["faceAnnotations"][0]["angerLikelihood"];
                var sorrow = res[0]["faceAnnotations"][0]["sorrowLikelihood"];
                var surprise = res[0]["faceAnnotations"][0]["surpriseLikelihood"];
                console.log("joy:",joy);
                console.log("anger:",anger);
                console.log("sorrow:",sorrow);
                console.log("surprise:",surprise);
                
                let weightjoy = 0;
                if(joy == "VERY_UNLIKELY") weightjoy+=0;
                else if(joy == "UNLIKELY")weightjoy+=1;
                else if(joy == "LIKELY")weightjoy+=3;
                else if(joy == "VERY_LIKELY")weightjoy+=4;
                else weightjoy+=2;



                let weightanger = 0;
                if(anger == "VERY_UNLIKELY") weightanger+=0;
                else if(anger == "UNLIKELY")weightanger+=1;
                else if(anger == "LIKELY")weightanger+=3;
                else if(anger == "VERY_LIKELY")weightanger+=4;
                else weightanger+=2;



                let weightsorrow = 0;
                if(sorrow == "VERY_UNLIKELY") weightsorrow+=0;
                else if(sorrow == "UNLIKELY")weightsorrow+=1;
                else if(sorrow == "LIKELY")weightsorrow+=3;
                else if(sorrow == "VERY_LIKELY")weightsorrow+=4;
                else weightsorrow+=2;

                let weightsurprise = 0;
                if(surprise == "VERY_UNLIKELY") weightsurprise+=0;
                else if(surprise == "UNLIKELY")weightsurprise+=1;
                else if(surprise == "LIKELY")weightsurprise+=3;
                else if(surprise == "VERY_LIKELY")weightsurprise+=4;
                else weightsurprise+=2;

                console.log(weightjoy,weightanger,weightsorrow,weightsurprise);
                let weight = weightjoy-weightanger-weightsorrow+weightsurprise;

                let rating = ((weight+8)/16)*5;

                console.log(rating);
                
                
                
            })
            .catch(err => {
                console.log(err);
            })
            res.send("hi");
    });

})


app.listen(5000, '127.0.0.1', () => console.log('server running'));