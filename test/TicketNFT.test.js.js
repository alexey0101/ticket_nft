const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TicketNFT", function () {
    let TicketNFT, ticketNFT, owner, addr1, addr2;

    beforeEach(async function () {
        TicketNFT = await ethers.getContractFactory("TicketNFT");
        [owner, addr1, addr2] = await ethers.getSigners();
        ticketNFT = await TicketNFT.deploy();
    });

    it("Should create an event and a ticket", async function () {
        const eventName = "Concert";
        const eventDate = "2023-07-01";
        const eventLocation = "New York";

        await ticketNFT.createEvent(eventName, eventDate, eventLocation);

        const eventId = 1;
        const eventDetails = await ticketNFT.getEventDetails(eventId);
        expect(eventDetails.name).to.equal(eventName);
        expect(eventDetails.date).to.equal(eventDate);
        expect(eventDetails.location).to.equal(eventLocation);

        const ticketPrice = ethers.parseEther("1.0");
        await ticketNFT.createTicket(eventId, ticketPrice);

        const ticketId = 1;
        const ticket = await ticketNFT.getTicketDetails(ticketId);
        expect(ticket.eventId).to.equal(eventId);
        expect(ticket.price).to.equal(ticketPrice);
        expect(ticket.isForSale).to.equal(true);
    });

    it("Should purchase a ticket", async function () {
        const eventName = "Concert";
        const eventDate = "2023-07-01";
        const eventLocation = "New York";

        await ticketNFT.createEvent(eventName, eventDate, eventLocation);
        const eventId = 1;
        const ticketPrice = ethers.parseEther("1.0");
        await ticketNFT.createTicket(eventId, ticketPrice);

        const ticketId = 1;
        await ticketNFT.connect(addr1).purchaseTicket(ticketId, { value: ticketPrice });

        const newOwner = await ticketNFT.ownerOf(ticketId);
        expect(newOwner).to.equal(addr1.address);

        const updatedTicket = await ticketNFT.getTicketDetails(ticketId);
        expect(updatedTicket.isForSale).to.equal(false);
    });

    it("Should set ticket for sale", async function () {
        const eventName = "Concert";
        const eventDate = "2023-07-01";
        const eventLocation = "New York";

        await ticketNFT.createEvent(eventName, eventDate, eventLocation);
        const eventId = 1;
        const ticketPrice = ethers.parseEther("1.0");
        await ticketNFT.createTicket(eventId, ticketPrice);

        const ticketId = 1;
        await ticketNFT.connect(owner).setTicketForSale(ticketId, ticketPrice);
        const ticket = await ticketNFT.getTicketDetails(ticketId);
        expect(ticket.isForSale).to.equal(true);
    });
});
