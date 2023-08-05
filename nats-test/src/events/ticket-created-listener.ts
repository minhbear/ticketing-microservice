import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subject } from "./subject";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    readonly subject = Subject.TicketCreated;
    queueGroupName: string = 'payment-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event data!', data);
        msg.ack();
    }
}