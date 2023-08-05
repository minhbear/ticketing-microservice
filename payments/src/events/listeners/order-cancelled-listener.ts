import { OrderCancelledEvent, Subject, Listener, OrderStatus } from "@common_v2/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order.model";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subject.OrderCancelled = Subject.OrderCancelled;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        }).exec();

        if(!order) {
            throw new Error('Order not found');
        }

        order.set({ status: OrderStatus.Cancelled });
        await order.save();

        msg.ack();
    }
}