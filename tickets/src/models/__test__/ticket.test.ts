import { Ticket } from "../ticket";

it('implement optimistic concurrency controll', async () => {
    // create an instance of a ticket
    const ticket = Ticket.build({
        title: "asdasd",
        price: 12,
        userId: '111'
    });

    // save the ticket to the database
    await ticket.save();

    // fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // make two seprate changes to the ticket we fetched
    firstInstance!.set({ price: 20 });
    secondInstance!.set({ price: 15 });

    // save the first fetched ticket
    await firstInstance!.save();

    // save the second fetched ticket
    try {
        await secondInstance!.save();
    } catch (error) {
        return;     
    }
});

it('Increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: "asds",
        price: 20,
        userId: '11'
    });

    await ticket.save();
    expect(ticket.version).toEqual(0);

    
    await ticket.save();
    expect(ticket.version).toEqual(1);
})