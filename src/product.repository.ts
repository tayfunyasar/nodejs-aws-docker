import { Injectable, InternalServerErrorException } from '@nestjs/common';

import AWSConfig from './utils/aws.config';
import { Product } from './entity/Product';
import { SQSMessageBody } from './model/event/SQSMessageBody';
import { EventType } from './model/event/EventType';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ProductRepository {
  public async save(product: Product): Promise<Product> {
    const productEntity = { id: uuid(), ...product } as Product;

    try {
      await AWSConfig.getDynamoDbClient()
        .put(
          {
            TableName: 'product',
            Item: productEntity,
          },
          (err, data) => {
            if (err == null) {
              // send to SQS
              // simple outbox pattern
              this.sendMessageSQS(
                new SQSMessageBody(productEntity.id, EventType.SAVE),
              );
            } else {
              throw err;
            }
          },
        )
        .promise();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return productEntity;
  }

  public async update(product: Product): Promise<Product> {
    try {
      await AWSConfig.getDynamoDbClient()
        .put(
          {
            TableName: 'product',
            Item: product,
          },
          (err, data) => {
            if (err == null) {
              // send to SQS
              // simple outbox pattern
              this.sendMessageSQS(
                new SQSMessageBody(product.id, EventType.UPDATE),
              );
            } else {
              throw err;
            }
          },
        )
        .promise();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return product;
  }

  public async delete(productId: string) {
    try {
      await AWSConfig.getDynamoDbClient()
        .delete(
          {
            TableName: 'product',
            Key: {
              id: productId,
            },
          },
          (err, data) => {
            if (err == null) {
              // send to SQS
              // simple outbox pattern
              this.sendMessageSQS(
                new SQSMessageBody(productId, EventType.DELETE),
              );
            } else {
              throw err;
            }
          },
        )
        .promise();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async get(productId: string): Promise<Product> {
    try {
      const response = await AWSConfig.getDynamoDbClient()
        .get({
          TableName: 'product',
          Key: {
            id: productId,
          },
        })
        .promise();

      return response.Item as Product;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private async sendMessageSQS(message: SQSMessageBody) {
    const params = {
      MessageBody: JSON.stringify(message),
      QueueUrl: process.env.SQS_QUEUE_URL,
    };
    try {
      await AWSConfig.getSQS().sendMessage(params).promise();
    } catch (error) {
      console.log(`error sending message to sqs ${error}`);
    }
  }
}
