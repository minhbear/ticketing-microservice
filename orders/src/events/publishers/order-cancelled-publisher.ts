import { Publisher, Subject, OrderCancelledEvent } from "@common_v2/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    readonly subject: Subject.OrderCancelled = Subject.OrderCancelled;
}