import * as AWS from 'aws-sdk';

const SQS = new AWS.SQS({
  endpoint: new AWS.Endpoint(process.env.SQS_QUEUE_URL),
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.REGION,
});
const dynamoDb = new AWS.DynamoDB({
  endpoint: new AWS.Endpoint(process.env.DYNAMODB_URL),
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.REGION,
});
const dynamoDBClient = new AWS.DynamoDB.DocumentClient({
  endpoint: new AWS.Endpoint(process.env.DYNAMODB_URL),
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.REGION,
});

export default class AWSConfig {
  static getSQS() {
    return SQS;
  }

  static getDynamoDbClient() {
    return dynamoDBClient;
  }
}
