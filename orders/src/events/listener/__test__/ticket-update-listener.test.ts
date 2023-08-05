import { TicketUpdatedListener } from "../ticket-update-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedEvent } from "@common_v2/common";
import mongoose from "mongoose";

const setup = async () => {
    // create a listener
    const listener = new TicketUpdatedListener(natsWrapper.client);

    // create and save a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 11,
        title: 'asdsad'
    });
    await ticket.save();

    // create a fake data object
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        price: 999,
        title: 'new concert',
        version: ticket.version + 1,
        userId: 'asdasdsadsa'
    }

    // create a fake msg object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn(),
    }

    // return all of this stuff
    return {
        listener,
        ticket,
        data,
        msg,
    }
}

it('find, updates, and save a ticket', async () => {
    const { msg, data, ticket, listener } = await setup();

    await listener.onMessage(data, msg);

    const updateTicket = await Ticket.findById(ticket.id).exec();

    expect(updateTicket!.title).toEqual(data.title);
    expect(updateTicket!.price).toEqual(data.price);
    expect(updateTicket!.version).toEqual(data.version);
});

it('ack message', async () => {
    const { msg, data, listener } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
    const { msg, data, ticket, listener } = await setup();

    data.version = 10;

    try {
        await listener.onMessage(data, msg);
    } catch (error) {
        
    }

    expect(msg.ack).not.toHaveBeenCalled();
});