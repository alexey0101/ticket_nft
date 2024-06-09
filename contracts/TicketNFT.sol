// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract TicketNFT is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _eventIds;

    struct Event {
        uint256 id;
        string name;
        string date;
        string location;
        uint256 ticketPrice;
        uint256 ticketsAvailable;
        address creator;
    }

    mapping(uint256 => Event) public events;
    mapping(uint256 => uint256) public ticketToEvent;

    event EventCreated(uint256 indexed eventId, string name, string date, string location, uint256 ticketPrice, uint256 ticketsAvailable, address indexed creator);
    event TicketPurchased(uint256 indexed ticketId, uint256 eventId, address indexed buyer);

    constructor() ERC721("EventTicket", "ETK") {}

    function createEvent(string memory name, string memory date, string memory location, uint256 ticketPrice, uint256 ticketsAvailable) public {
        require(ticketsAvailable > 0, "Tickets available should be greater than 0");
        
        _eventIds.increment();
        uint256 newEventId = _eventIds.current();

        events[newEventId] = Event({
            id: newEventId,
            name: name,
            date: date,
            location: location,
            ticketPrice: ticketPrice,
            ticketsAvailable: ticketsAvailable,
            creator: msg.sender
        });

        emit EventCreated(newEventId, name, date, location, ticketPrice, ticketsAvailable, msg.sender);
    }

    function purchaseTicket(uint256 eventId) public payable {
        Event storage _event = events[eventId];
        require(_event.id != 0, "Event does not exist");
        require(msg.value >= _event.ticketPrice, "Insufficient payment");
        require(_event.ticketsAvailable > 0, "No tickets available");

        _event.ticketsAvailable -= 1;

        _tokenIds.increment();
        uint256 newTicketId = _tokenIds.current();

        _mint(msg.sender, newTicketId);
        ticketToEvent[newTicketId] = eventId;

        payable(_event.creator).transfer(msg.value);

        emit TicketPurchased(newTicketId, eventId, msg.sender);
    }

    function getEventDetails(uint256 eventId) public view returns (Event memory) {
        return events[eventId];
    }

    function getTicketEvent(uint256 ticketId) public view returns (uint256) {
        return ticketToEvent[ticketId];
    }

    function getEventCount() public view returns (uint256) {
        return _eventIds.current();
    }

    function getTicketsByOwner(address owner) public view returns (uint256[] memory) {
        uint256 ticketCount = balanceOf(owner);
        uint256[] memory ticketIds = new uint256[](ticketCount);
        uint256 counter = 0;

        for (uint256 i = 1; i <= _tokenIds.current(); i++) {
            if (ownerOf(i) == owner) {
                ticketIds[counter] = i;
                counter++;
            }
        }

        return ticketIds;
    }
}
