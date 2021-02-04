'use strict';
 
const uuid = require('uuid');
const AWS = require('aws-sdk');
 
AWS.config.setPromisesDependency(require('bluebird'));
 
const dynamoDb = new AWS.DynamoDB.DocumentClient();
 
module.exports.submit = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const fullname = requestBody.fullname;
  const email = requestBody.email;
  const companyname = requestBody.companyname;
 
  if (typeof fullname !== 'string' || typeof email !== 'string' || typeof companyname !== 'string') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit guest because of validation errors.'));
    return;
  }
 
  submitGuestP(guestInfo(fullname, email, companyname))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitted guest with email ${email}`,
          guestId: res.id
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submit guest with email ${email}`
        })
      })
    });
};
 
 
const submitGuestP = guest => {
  console.log('Submitting guest');
  const guestInfo = {
    TableName: process.env.GUEST_TABLE,
    Item: guest,
  };
  return dynamoDb.put(guestInfo).promise()
    .then(res => guest);
};
 
const guestInfo = (fullname, email, companyname) => {
  const timestamp = new Date().getTime();
  return {
    id: uuid.v1(),
    fullname: fullname,
    email: email,
    companyname: companyname,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};

module.exports.list = (event, context, callback) => {
  var params = {
      TableName: process.env.GUEST_TABLE,
      ProjectionExpression: "id, fullname, email"
  };

  console.log("Scanning Guest table.");
  const onScan = (err, data) => {

      if (err) {
          console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
          callback(err);
      } else {
          console.log("Scan succeeded.");
          return callback(null, {
              statusCode: 200,
              body: JSON.stringify({
                  guests: data.Items
              })
          });
      }

  };

  dynamoDb.scan(params, onScan);

};

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.GUEST_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  dynamoDb.get(params).promise()
    .then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
      callback(null, response);
    })
    .catch(error => {
      console.error(error);
      callback(new Error('Couldn\'t fetch guest.'));
      return;
    });
};
