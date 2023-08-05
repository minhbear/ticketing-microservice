import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '@common_v2/common';
import { Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';

it('marks an order as cancelled', async () => {
    const ticket = await Ticket.build({
        price: 10,
        title: 'asdasd',
        id: new mongoose.Types.ObjectId().toHexString()
    }).save();

    const user = global.signin();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    const updateOrder = await Order.findById(order.id).exec();
    expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an order cancelled event', async () => {
    const ticket = await Ticket.build({
        price: 10,
        title: 'asdasd',
        id: new mongoose.Types.ObjectId().toHexString()
    }).save();

    const user = global.signin();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', user)
        .send({
            ticketId: ticket.id
        })
        .expect(201);

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(204);

    const updateOrder = await Order.findById(order.id).exec();
    expect(updateOrder!.status).toEqual(OrderStatus.Cancelled);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});