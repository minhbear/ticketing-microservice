import { Listener, Subject, OrderCreatedEvent } from "@common_v2/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher"; 

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    readonly subject: Subject.OrderCreated = Subject.OrderCreated;
    
    queueGroupName: string = queueGroupName;
    
    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        // find the ticket that the order is reserving
        const existTicket = await Ticket.findById(data.ticket.id).exec();

        // If no ticket, throw error
        if(!existTicket) {
            throw new Error('Ticketing not found');
        }

        // Mark the ticket as being reserved by setting its orderId property
        existTicket.set({ orderId: data.id });

        // save the ticket
        await existTicket.save();

        // emit event ticket update
        await new TicketUpdatedPublisher(this.client).publish({
            id: existTicket.id,
            price: existTicket.price,
            title: existTicket.title,
            userId: existTicket.userId,
            version: existTicket.version,
            orderId: existTicket.orderId
        })

        // ack the message
        msg.ack();
    }
}