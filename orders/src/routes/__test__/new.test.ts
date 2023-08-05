import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '@common_v2/common';
import { natsWrapper } from '../../nats-wrapper';

it('return an error if the ticket does not exist', async () => {
    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({
            ticketId
        })
        .expect(404);
})

it('return an error if the ticket is already reseved', async () => {
    const ticket = await Ticket.build({
        title: 'asdasd',
        price: 10,
        id: new mongoose.Types.ObjectId().toHexString()
    }).save();

    const order = await Order.build({
        ticket,
        userId: 'asdasd',
        status: OrderStatus.Created,
        expiresAt: new Date()
    }).save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({  
            ticketId: ticket.id
        })
        .expect(400);
})

it('reserved the ticket', async () => {
    const ticket = await Ticket.build({
        title: 'asdasd',
        price: 10,
        id: new mongoose.Types.ObjectId().toHexString()
    }).save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({  
            ticketId: ticket.id
        })
        .expect(201);
})

it('Emit an order event', async () => {
    const ticket = await Ticket.build({
        title: 'asdasd',
        price: 10,
        id: new mongoose.Types.ObjectId().toHexString()
    }).save();

    await request(app)
        .post('/api/orders')
        .set('Cookie', global.signin())
        .send({  
            ticketId: ticket.id
        })
        .expect(201);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});