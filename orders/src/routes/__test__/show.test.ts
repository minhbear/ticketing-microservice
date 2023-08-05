import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from 'mongoose'

it('fetche the order', async () => {
    const ticket = await Ticket.build({
        price: 10,
        title: "asdsad",
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
    
    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie', user)
        .send()
        .expect(200);

    expect(fetchedOrder.id).toEqual(order.id);
})
