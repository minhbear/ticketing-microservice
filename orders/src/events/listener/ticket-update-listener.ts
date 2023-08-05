import { Message } from "node-nats-streaming";
import { Subject, Listener, TicketUpdatedEvent } from "@common_v2/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";
import { version } from "mongoose";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
    readonly subject: Subject.TicketUpdated = Subject.TicketUpdated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const ticket = await Ticket.findByEvent({ version: data.version, id: data.id });

        if(!ticket) {
            throw new Error('Ticket not found');
        }

        const { title, price } = data;

        ticket.set({ title, price })
        await ticket.save();

        msg.ack();
    }
}