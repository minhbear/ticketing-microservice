import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import mongoose from 'mongoose';

const createTicket = async () => {
    return await Ticket.build({
        price: 10,
        title: 'asdasd',
        id: new mongoose.Types.ObjectId().toHexString()
    }).save();
}

it('fetch orders for an particular user', async () => {
    const ticketOne = await createTicket();
    const ticketTwo = await createTicket();
    const ticketThree = await createTicket();

    const userOne = global.signin();
    const userTwo = global.signin();

    await request(app)
        .post('/api/orders')
        .set('Cookie', userOne)
        .send({
            ticketId: ticketOne.id
        })
        .expect(201);

    await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({
            ticketId: ticketTwo.id
        })
        .expect(201)

    await request(app)
        .post('/api/orders')
        .set('Cookie', userTwo)
        .send({
            ticketId: ticketThree.id
        })
        .expect(201)

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwo)
        .expect(200);

    expect(response.body.length).toEqual(2);
})