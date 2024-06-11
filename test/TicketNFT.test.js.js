const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TicketNFT", function () {
  let TicketNFT;
  let ticketNFT;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    TicketNFT = await ethers.getContractFactory("TicketNFT");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    ticketNFT = await TicketNFT.deploy();
    await ticketNFT.waitForDeployment();
  });

  describe("Create Event", function () {
    it("Should create an event", async function () {
      await ticketNFT.createEvent("Concert", "2024-12-31", "Moscow", ethers.parseEther("0.1"), 100);

      const event = await ticketNFT.getEventDetails(1);
      expect(event.name).to.equal("Concert");
      expect(event.date).to.equal("2024-12-31");
      expect(event.location).to.equal("Moscow");
      expect(event.ticketPrice).to.equal(ethers.parseEther("0.1"));
      expect(event.ticketsAvailable).to.equal(100);
      expect(event.creator).to.equal(owner.address);
    });

    it("Should emit EventCreated event", async function () {
      await expect(ticketNFT.createEvent("Concert", "2024-12-31", "Moscow", ethers.parseEther("0.1"), 100))
        .to.emit(ticketNFT, "EventCreated")
        .withArgs(1, "Concert", "2024-12-31", "Moscow", ethers.parseEther("0.1"), 100, owner.address);
    });

    it("Should fail if ticketsAvailable is 0", async function () {
      await expect(ticketNFT.createEvent("Concert", "2024-12-31", "Moscow", ethers.parseEther("0.1"), 0)).to.be.revertedWith(
        "Tickets available should be greater than 0"
      );
    });
  });

  describe("Purchase Ticket", function () {
    beforeEach(async function () {
      await ticketNFT.createEvent("Concert", "2024-12-31", "Moscow", ethers.parseEther("0.1"), 100);
    });

    it("Should purchase a ticket", async function () {
      await ticketNFT.connect(addr1).purchaseTicket(1, { value: ethers.parseEther("0.1") });

      const event = await ticketNFT.getEventDetails(1);
      expect(event.ticketsAvailable).to.equal(99);

      const ticketEventId = await ticketNFT.getTicketEvent(1);
      expect(ticketEventId).to.equal(1);
    });

    it("Should emit TicketPurchased event", async function () {
      await expect(ticketNFT.connect(addr1).purchaseTicket(1, { value: ethers.parseEther("0.1") }))
        .to.emit(ticketNFT, "TicketPurchased")
        .withArgs(1, 1, addr1.address);
    });

    it("Should fail if event does not exist", async function () {
      await expect(ticketNFT.connect(addr1).purchaseTicket(2, { value: ethers.parseEther("0.1") })).to.be.revertedWith("Event does not exist");
    });

    it("Should fail if insufficient payment", async function () {
      await expect(ticketNFT.connect(addr1).purchaseTicket(1, { value: ethers.parseEther("0.05") })).to.be.revertedWith("Insufficient payment");
    });

    it("Should fail if no tickets available", async function () {
      await ticketNFT.createEvent("Limited", "2024-12-31", "Moscow", ethers.parseEther("0.1"), 1);
      await ticketNFT.connect(addr1).purchaseTicket(2, { value: ethers.parseEther("0.1") });

      await expect(ticketNFT.connect(addr2).purchaseTicket(2, { value: ethers.parseEther("0.1") })).to.be.revertedWith("No tickets available");
    });
  });

  describe("Get Event Details", function () {
    it("Should return event details", async function () {
      await ticketNFT.createEvent("Concert", "2024-12-31", "Moscow", ethers.parseEther("0.1"), 100);
      const event = await ticketNFT.getEventDetails(1);
      expect(event.name).to.equal("Concert");
    });
  });

  describe("Get Tickets By Owner", function () {
    it("Should return tickets owned by an address", async function () {
      await ticketNFT.createEvent("Concert", "2024-12-31", "Moscow", ethers.parseEther("0.1"), 100);
      await ticketNFT.connect(addr1).purchaseTicket(1, { value: ethers.parseEther("0.1") });

      const tickets = await ticketNFT.getTicketsByOwner(addr1.address);
      expect(tickets.length).to.equal(1);
      expect(tickets[0]).to.equal(1);
    });
  });

  describe("Verify Ownership", function () {
    it("Should verify ownership of a ticket for an event", async function () {
      await ticketNFT.createEvent("Concert", "2024-12-31", "Moscow", ethers.parseEther("0.1"), 100);
      await ticketNFT.connect(addr1).purchaseTicket(1, { value: ethers.parseEther("0.1") });

      const isOwner = await ticketNFT.verifyOwnership(addr1.address, 1);
      expect(isOwner).to.be.true;
    });

    it("Should return false for non-owner", async function () {
      await ticketNFT.createEvent("Concert", "2024-12-31", "Moscow", ethers.parseEther("0.1"), 100);

      const isOwner = await ticketNFT.verifyOwnership(addr2.address, 1);
      expect(isOwner).to.be.false;
    });
  });
});
