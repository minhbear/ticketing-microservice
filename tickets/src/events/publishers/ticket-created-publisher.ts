import { Publisher, Subject, TicketCreatedEvent } from "@common_v2/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject: Subject.TicketCreated = Subject.TicketCreated;
}