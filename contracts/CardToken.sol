// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "./../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./../node_modules/@openzeppelin/contracts/utils/Strings.sol";

/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/
contract CardToken is ERC721, Ownable {

    uint256 COUNTER;
 
    uint256 fee = 1 ether;

    struct Card {
        string name;
        uint256 id;
        uint256 cardNum; 
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
        _mintCardToken("to_change", cardNum); 
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

    /******************************************************************************************************/
    /**
     * Allows the user to open a booster and win 5 cards randomly 
     * 
     * @param _collection   name of the collection
     * @param _size         size of the collection
     */
    function openBooster(string memory _collection, uint256 _size) public payable {
        Card[] memory res = new Card[](4);
        uint feeToPay = 0; 
        if (keccak256(abi.encodePacked(_collection)) == keccak256(abi.encodePacked("base5"))) {
            feeToPay = 5 ether;
        } else if (keccak256(abi.encodePacked(_collection)) == keccak256(abi.encodePacked("pgo"))) {
            feeToPay = 10 ether;
        } else if (keccak256(abi.encodePacked(_collection)) == keccak256(abi.encodePacked("dp1"))) {
            feeToPay = 25 ether;
        } else {
            feeToPay = 50 ether;
        } 
        
        require(msg.value >= feeToPay, "The amount is not correct!");

        for (uint256 i=0; i<4; i++) {
            uint256 randomNum = _createRandomNum(_size-i);
            string memory randomNumString = Strings.toString(randomNum);
            string memory concat = string.concat(_collection, "-");
            string memory name = string.concat(concat, randomNumString);
            while (isNameInCards(name)) {
                randomNum = _createRandomNum(_size-i);
                randomNumString = Strings.toString(randomNum);
                concat = string.concat(_collection, "-");
                name = string.concat(concat, randomNumString);
            }
            _mintCardToken(name, randomNum);
            res[i] = cards[COUNTER-1];
        }
    }

    /******************************************************************************************************/
    /**
     * Getter of cards that the owner has won
     * 
     * @param _owner Owner address
     */
    // function getOpenBoosterCards(address _owner) public view returns (Card[] memory) {
    //     Card[] memory res = new Card[](5);
    //     uint256 cpt = 0;
    //     for(uint256 i=0; i<2; i++) {
    //         if (ownerOf(COUNTER-i) == _owner) {
    //             res[cpt] = cards[i];
    //             cpt++;
    //         } else { 
    //             return new Card[](5); // if there is a concurrent open
    //         }
    //     }
    //     return res;
    // }

    /******************************************************************************************************/
    /**
     * Contains method.
     * 
     * @param _id Name (id in Pokemon API)
     */
    function isNameInCards(string memory _id) public view returns (bool) {
        for (uint i = 0; i < cards.length; i++) {
            if (keccak256(abi.encodePacked(cards[i].name)) == keccak256(abi.encodePacked(_id))) {
                return true; 
            }
        }
        return false; 
    }
}
/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/