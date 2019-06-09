const vision = require('@google-cloud/vision');

const client = new vision.ImageAnnotatorClient({
    keyFilename: 'APIkey.json'
});


var callFaceDetect = () => {
    client.faceDetection('./out.png')
        .then(res => {
            // console.log(JSON.stringify(res,null, 4));
            var joy = res[0]["faceAnnotations"][0]["joyLikelihood"];
            var anger = res[0]["faceAnnotations"][0]["angerLikelihood"];
            var sorrow = res[0]["faceAnnotations"][0]["sorrowLikelihood"];
            var surprise = res[0]["faceAnnotations"][0]["surpriseLikelihood"];
            console.log("joy:", joy);
            console.log("anger:", anger);
            console.log("sorrow:", sorrow);
            console.log("surprise:", surprise);
            // const labels = res[0].labelAnnotations;

            // console.log('labels:');
            // labels.forEach(label=>console.log(label.description));
        })
        .catch(err => {
            console.log(err);
        })
}

module.export ={callFaceDetect};