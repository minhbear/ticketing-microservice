import { Message } from "node-nats-streaming";
import { Subject, Listener, TicketCreatedEvent } from "@common_v2/common";
import { Ticket } from "../../models/ticket";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject: Subject.TicketCreated = Subject.TicketCreated;
    queueGroupName: string = this.queueGroupName;

    async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
        const { title, price, id } = data;
        const ticket = await Ticket.build({ title, price, id }).save();
        
        msg.ack();
    }
}