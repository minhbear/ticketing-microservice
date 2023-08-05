import { TicketCreatedEvent } from "@common_v2/common";
import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    // created an instance of the listener
    const listener = new TicketCreatedListener(natsWrapper.client);

    // create a fake data event
    const data: TicketCreatedEvent['data'] = {
        version: 0,
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'adsad',
        price: 11,
        userId: new mongoose.Types.ObjectId().toHexString()
    }

    // create a fake message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {
        listener,
        data,
        msg
    }
}

it('creates and saves a ticket', async () => {
    const { listener, data, msg } = await setup();
    
    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertion to make sure ticket was created
    const ticket = await Ticket.findById(data.id).exec();

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
});

it('ack the message', async () => {
    const { data, listener, msg } = await setup();
    
    // call the onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // write assertion to make sure message.ack() call
    expect(msg.ack).toHaveBeenCalled();
});