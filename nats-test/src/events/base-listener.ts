import { Message, Stan } from "node-nats-streaming";
import { Subject } from "./subject";

interface Event {
    subject: Subject;
    data: any;
}

export abstract class Listener<T extends Event> {
    abstract subject: T['subject'];
    abstract queueGroupName: string;
    abstract onMessage(data: T['data'], msg: Message): void;

    private client: Stan;
    protected ackWait: number = 5 * 1000;

    constructor(client: Stan) {
        this.client = client;
    }

    subcriptionOptions() {
        return this.client
            .subscriptionOptions()
            .setDeliverAllAvailable()
            .setManualAckMode(true)
            .setAckWait(this.ackWait)
            .setDurableName(this.queueGroupName);
    }

    listen() {
        const subcription = this.client.subscribe(
            this.subject,
            this.queueGroupName,
            this.subcriptionOptions()
        )

        subcription.on('message', (msg: Message) => {
            console.log(
                `Message received: ${this.subject} / ${this.queueGroupName}`
            );

            const parsedData = this.parseMessage(msg);
            this.onMessage(parsedData, msg);
        })
    }

    parseMessage(msg: Message) {
        const data = msg.getData();

        return typeof data === 'string'
            ? JSON.parse(data)
            : JSON.parse(data.toString('utf8'));
    }
}