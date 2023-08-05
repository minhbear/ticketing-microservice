import { Publisher, Subject, TicketUpdatedEvent } from "@common_v2/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject: Subject.TicketUpdated = Subject.TicketUpdated;
}