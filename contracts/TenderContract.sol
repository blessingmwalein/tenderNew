// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.9.0;

contract TenderContract {
    //call this function to set dummy tender for testing

    struct Tender {
        uint tenderId;
        string title;
        string description;
        string startDate;
        string endDate;
        string status;
        uint256 numBids;
    }

    struct Bid {
        uint bidId;
        uint tenderId;
        string title;
        string description;
        uint256 amount;
        string status;
        address bidderAddress;
        string company;
    }

    //define tender map and populate with dummy tender
    uint public lastTenderId = 1;
    Tender[] public tenders;

    uint public lastBidId = 1;
    Bid[] public bids;

    // mapping (address => Tender[]) tenders;

    // mapping (address => Tender[]) tenders;

    function setTender(
        string memory _title,
        string memory _description,
        string memory _startDate,
        string memory _endDate,
        string memory _status,
        uint256 _numBids
    ) public {
        Tender memory newTender = Tender(
            lastTenderId,
            _title,
            _description,
            _startDate,
            _endDate,
            _status,
            _numBids
        );

        tenders.push(newTender);
        lastTenderId++;
    }

    function placeBid(
        uint _tenderId,
        string memory _title,
        string memory _description,
        string memory _company,
        uint256 _amount
    ) public {
        Bid memory newBid = Bid(
            lastBidId,
            _tenderId,
            _title,
            _description,
            _amount,
            "Pending",
            msg.sender,
            _company
        );
        bids.push(newBid);
        lastBidId++;
    }

    //get tender bids
    function getBidsForTender(
        uint _tenderId
    ) public view returns (Bid[] memory) {
        Bid[] memory tenderBids = new Bid[](bids.length);
        uint256 tenderBidCount = 0;

        for (uint i = 0; i < bids.length; i++) {
            if (bids[i].tenderId == _tenderId) {
                tenderBids[tenderBidCount] = bids[i];
                tenderBidCount++;
            }
        }

        return tenderBids;
    }
    //get bids for user on a tender
    function getBidsForUserOnTender(
        uint _tenderId,
        address _userAddress
    ) public view returns (Bid[] memory) {
        Bid[] memory tenderBids = new Bid[](bids.length);
        uint256 tenderBidCount = 0;

        for (uint i = 0; i < bids.length; i++) {
            if (
                bids[i].tenderId == _tenderId &&
                bids[i].bidderAddress == _userAddress
            ) {
                tenderBids[tenderBidCount] = bids[i];
                tenderBidCount++;
            }
        }

        return tenderBids;
    }

    //accept bid
    function acceptBid(uint _bidId, string memory status) public {
        for (uint i = 0; i < bids.length; i++) {
            if (bids[i].bidId == _bidId) {
                bids[i].status = status;
            }
        }
    }
    //get sinlge tender
    function getTender(uint _tenderId) public view returns (Tender memory) {
        for (uint i = 0; i < tenders.length; i++) {
            if (tenders[i].tenderId == _tenderId) {
                return tenders[i];
            }
        }
    }

    function getTenders() public view returns (Tender[] memory) {
        return tenders;
    }
    function getBids() public view returns (Bid[] memory) {
        return bids;
    }

    //get only open tenders
    function getOpenTenders() public view returns (Tender[] memory) {
        Tender[] memory openTenders = new Tender[](tenders.length);
        uint256 openTenderCount = 0;

        for (uint i = 0; i < tenders.length; i++) {
            if (
                keccak256(abi.encodePacked(tenders[i].status)) ==
                keccak256(abi.encodePacked("Open"))
            ) {
                openTenders[openTenderCount] = tenders[i];
                openTenderCount++;
            }
        }

        return openTenders;
    }

    // function updateTender(
    //     uint256 _index,
    //     string memory _title,
    //     string memory _description,
    //     string memory _startDate,
    //     string memory _endDate,
    //     string memory _status,
    //     uint256 _numBids
    // ) public {
    //     tenders[msg.sender][_index].title = _title;
    //     tenders[msg.sender][_index].description = _description;
    //     tenders[msg.sender][_index].startDate = _startDate;
    //     tenders[msg.sender][_index].endDate = _endDate;
    //     tenders[msg.sender][_index].status = _status;
    //     tenders[msg.sender][_index].numBids = _numBids;
    // }

    function closeTender(uint _tenderId) public {
        for (uint i = 0; i < tenders.length; i++) {
            if (tenders[i].tenderId == _tenderId) {
                tenders[i].status = "Closed";
            }
        }
    }
}
