// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TicketNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _eventIds;

    struct Event {
        uint256 id;
        string name;
        string date;
        string location;
    }

    struct Ticket {
        uint256 id;
        uint256 eventId;
        uint256 price;
        bool isForSale;
    }

    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;

    event EventCreated(uint256 indexed eventId, string name, string date, string location);
    event TicketCreated(uint256 indexed ticketId, uint256 eventId, uint256 price);
    event TicketPurchased(uint256 indexed ticketId, address indexed buyer);

    constructor() ERC721("EventTicket", "ETK") {}

    function createEvent(string memory name, string memory date, string memory location) public onlyOwner {
        _eventIds.increment();
        uint256 newEventId = _eventIds.current();

        events[newEventId] = Event(newEventId, name, date, location);

        emit EventCreated(newEventId, name, date, location);
    }

    function createTicket(uint256 eventId, uint256 price) public onlyOwner {
        require(events[eventId].id != 0, "Event does not exist");

        _tokenIds.increment();
        uint256 newTicketId = _tokenIds.current();

        tickets[newTicketId] = Ticket(newTicketId, eventId, price, true);
        _mint(msg.sender, newTicketId);

        emit TicketCreated(newTicketId, eventId, price);
    }

    function purchaseTicket(uint256 ticketId) public payable {
        Ticket storage ticket = tickets[ticketId];
        require(ticket.isForSale, "Ticket is not for sale");
        require(msg.value >= ticket.price, "Insufficient payment");

        address ticketOwner = ownerOf(ticketId);
        payable(ticketOwner).transfer(msg.value);
        _transfer(ticketOwner, msg.sender, ticketId);

        ticket.isForSale = false;

        emit TicketPurchased(ticketId, msg.sender);
    }

    function setTicketForSale(uint256 ticketId, uint256 price) public {
        require(ownerOf(ticketId) == msg.sender, "Only the owner can set the ticket for sale");
        Ticket storage ticket = tickets[ticketId];
        ticket.price = price;
        ticket.isForSale = true;
    }

    function getEventDetails(uint256 eventId) public view returns (Event memory) {
        return events[eventId];
    }

    function getTicketDetails(uint256 ticketId) public view returns (Ticket memory) {
        return tickets[ticketId];
    }
}
