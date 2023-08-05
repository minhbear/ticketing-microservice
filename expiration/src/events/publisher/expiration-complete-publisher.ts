import { ExpirationCompleteEvent, Publisher, Subject } from "@common_v2/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject: Subject.ExpirationComplete = Subject.ExpirationComplete;
}