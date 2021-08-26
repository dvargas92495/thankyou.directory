const aws = require('aws-sdk');
console.log(aws.config.credentials.accessKeyId.slice(-2));
console.log(aws.config.credentials.secretAccessKey.slice(-2));
console.log(aws.config.region);
