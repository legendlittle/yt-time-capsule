module.exports.videosTable = function(videosArray) {

    var AWS = require('aws-sdk');
    // AWS.config.update({
    //     region: "us-east-1",
    //     endpoint: "dynamodb.us-east-1.amazonaws.com"
    // });

    videosArray.forEach(videoItem => {
        var docClient = new AWS.DynamoDB.DocumentClient();
        var currentTimeStamp = new Date().toISOString();
        videoItem.lastUpdated = currentTimeStamp;
        var params = {
            TableName: "Videos",
            Item: videoItem
        };
        console.log("Adding item...");
        docClient.put(params, function (err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
            }
        });
    });

};

