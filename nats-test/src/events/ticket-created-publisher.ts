import { Publisher } from "./base-publisher";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subject } from "./subject";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject: Subject.TicketCreated = Subject.TicketCreated;

}