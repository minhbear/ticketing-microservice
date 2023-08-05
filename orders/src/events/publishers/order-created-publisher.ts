import { Publisher, Subject, OrderCreatedEvent } from "@common_v2/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    readonly subject: Subject.OrderCreated = Subject.OrderCreated;
}