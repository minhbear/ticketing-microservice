import { OrderCancelledListener } from "../order-cancelled-listener"
import { natsWrapper } from "../../../nats-wrapper"
import { Order } from "../../../models/order.model";
import mongoose from "mongoose";
import { OrderCancelledEvent, OrderStatus } from "@common_v2/common";

const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        status: OrderStatus.Created,
        price: 10,
        userId: 'asdsad',
        version: 0
    });

    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: 1,
        ticket: {
            id: 'adasd',
        }
    }  
    
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {
        listener,
        data,
        msg,
        order
    }
}

it('Updates the status of the order', async () => {
    const { listener, data, msg, order } = await setup();

    await listener.onMessage(data, msg);

    const updateOrder = await Order.findById(order.id);

    expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
    const { listener, data, msg, order } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})