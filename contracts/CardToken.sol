// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract CardToken is ERC721, Ownable {
    uint256 COUNTER;
 
    uint256 fee = 1 ether;

    struct Card {
        string name;
        uint256 id;
        uint256 cardNum; 
        // string url; // AR
    }

    Card[] public cards;

    event NewCard(address indexed owner, uint256 id, string name);

    constructor()
        ERC721("CardToken", "CTK")
        // Ownable(initialOwner)
    {}

    function _mintCardToken(string memory _name, uint256 _cardNum) internal {
        Card memory newCard = Card(_name, COUNTER, _cardNum);
        cards.push(newCard);
        _safeMint(msg.sender, COUNTER);
        emit NewCard(msg.sender, COUNTER, _name);
        COUNTER++;
    }

    function mintCard(string memory _name, uint256 _cardNum) public payable  {
        require(msg.value >= fee, "The amount is not correct!");
        _mintCardToken(_name, _cardNum);
    }

    function getCardTokens() public view returns (Card[] memory) {
        return cards;
    }

    function _createRandomNum(uint256 _mod) internal view returns (uint256) {
        uint256 randomNum = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender)));
        return randomNum % _mod;
    }

    function mintRandomCard(uint256 _collectionCardCount) public {
        uint256 cardNum = _createRandomNum(_collectionCardCount);
        _mintCardToken("to_change", cardNum); // verifier aussi si elle n'est pas deja mint
    }

    function updateFee(uint256 _fee) external onlyOwner() {
        fee = _fee;
    }

    function withdraw() external payable onlyOwner() {
        address payable _owner = payable(owner());
        _owner.transfer(address(this).balance);
    }

    function getOwnerCards(address _owner) public view returns (Card[] memory) {
        Card[] memory res = new Card[](balanceOf(_owner));
        uint256 cpt = 0;
        for(uint256 i=0; i<cards.length; i++) {
            if (ownerOf(i) == _owner) {
                res[cpt] = cards[i];
                cpt++;
            }
        }
        return res;
    }
}