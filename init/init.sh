#!/bin/sh
sleep 15

aws dynamodb create-table --endpoint-url http://localstack:4566 --cli-input-json file://init.dynamodb.json
aws dynamodb list-tables --endpoint-url http://localstack:4566

aws sqs create-queue --queue-name product-persist-queue --endpoint-url http://localstack:4566