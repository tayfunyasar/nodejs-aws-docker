import { EventType } from './EventType';

export class SQSMessageBody {
  productId: string;
  type: EventType;

  constructor(productId: string, type: EventType) {
    this.productId = productId;
    this.type = type;
  }
}
