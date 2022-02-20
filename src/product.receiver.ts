/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import AWSConfig from './utils/aws.config';
import { ExternalProductService } from './product.external.service';
import { SQSMessageBody } from './model/event/SQSMessageBody';
import { Consumer } from 'sqs-consumer';
import { EventType } from './model/event/EventType';

@Injectable()
export class ProductReceiver implements OnModuleInit {
  private consumer: Consumer;

  constructor(private readonly externalProductService: ExternalProductService) {

    this.consumer = Consumer.create({
      queueUrl: process.env.SQS_QUEUE_URL,
      waitTimeSeconds: parseInt(process.env.SQS_WAIT_TIME_SECONDS),
      sqs: AWSConfig.getSQS(),
      handleMessage: async (message) => {
        const messageBody = JSON.parse(message.Body) as SQSMessageBody;

        console.log(messageBody);
        await this.execute(messageBody.productId, messageBody.type);
      },
    });
  }

  onModuleInit() {
    this.consumer.on('processing_error', (err) => {
      console.error("consumer error", err.message);
    });

    this.consumer.start();
  }

  private async execute(productId: string, type: EventType) {
    await this.externalProductService.execute(productId, type);
  }
}