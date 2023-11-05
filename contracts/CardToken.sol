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

    /** Counter of the cards on sale */
    uint256 COUNTER_ON_SALE;
 
    uint256 fee = 1 ether;

    struct Card {
        string name;
        uint256 id; // COUNTER
        uint256 cardNum; 
        uint256 amount; // if != 0 => on sale !
        string url;
    }

    /** All cards minted in the game */
    Card[] public cards;

    /** Minting card event */
    event NewCard(address indexed owner, uint256 id, string name);

    /** Event of the puchase of a card between users */
    event CardPurchased(address indexed buyer, address indexed seller, uint256 cardIndex, uint256 amount);

    constructor()
        ERC721("CardToken", "CTK")
        // Ownable(initialOwner)
    {}

    function _mintCardToken(string memory _name, uint256 _cardNum) internal {
        Card memory newCard = Card(_name, COUNTER, _cardNum, 0, "");
        cards.push(newCard);
        _safeMint(msg.sender, COUNTER);
        emit NewCard(msg.sender, COUNTER, _name);
        COUNTER++;
    }

    function mintCard(string memory _name, uint256 _cardNum) public payable  {
        require(msg.value >= fee, "The amount is not correct!");
        _mintCardToken(_name, _cardNum);
    }

    /******************************************************************************************************/
    /**
     * Returns all the cards minted in game
     */
    function getCardTokens() public view returns (Card[] memory) {
        return cards;
    }

    function _createRandomNum(uint256 _mod) internal view returns (uint256) {
        uint256 randomNum = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender)));
        return randomNum % _mod;
    }

    // function mintRandomCard(uint256 _collectionCardCount) public {
    //     uint256 cardNum = _createRandomNum(_collectionCardCount);
    //     _mintCardToken("to_change", cardNum); 
    // }

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

        for (uint256 i=0; i<3; i++) {
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

    /******************************************************************************************************/
    /**
     * Allows owner to put his card to sell in the Store.
     * 
     * @param _id       Name (id) of de card
     * @param _amount   Price to sell the card
     */
    function putCardOnSale(string memory _id, string memory _images, uint256 _amount) public {
        for (uint i = 0; i < cards.length; i++) {
            if (keccak256(abi.encodePacked(cards[i].name)) == keccak256(abi.encodePacked(_id))) {
                if (_ownerOf(i) == msg.sender){
                    cards[i].amount = _amount;
                    cards[i].url = _images;
                    COUNTER_ON_SALE++;
                }
            }
        }
    }
    
    /******************************************************************************************************/
    /**
     * Returns all the cards that are on sale
     */
    function getCardsOnSale() public view returns(Card[] memory){
        Card[] memory cardOnSale = new Card[](COUNTER_ON_SALE);
        uint256 cpt = 0;

        for (uint i = 0; i < cards.length; i++) {
            if (cards[i].amount > 0) {
               cardOnSale[cpt] = cards[i];
               cpt++;
            }
        }

        return cardOnSale;
    }
    
    /******************************************************************************************************/
    /**
     * Does the echanges between the users
     * 
     * @param _counter COUNTER of the card
     */
    function acceptSale(uint256 _counter, address _buyer) public payable {
        address seller = ownerOf(cards[_counter].id);
        require(seller != msg.sender, "You canno't buy your own card again !");
        require(msg.value >= cards[_counter].amount, "The amount is not correct!");
        
        uint256 price = cards[_counter].amount;

        // Ether transfert
        payable(seller).transfer(msg.value);
        
        // Card transfert
        cards[_counter].amount = 0; // not on sale anymore
        _transfer(seller, msg.sender, _counter);
        COUNTER_ON_SALE--;

        emit CardPurchased(_buyer, seller, _counter, price);
    }

    /******************************************************************************************************/
    /**
     * Removes the card from the market
     * 
     * @param _counter COUNTER of the card
     */
    function noLongerSell(uint256 _counter) public {
        cards[_counter].amount = 0;
        COUNTER_ON_SALE--;
    }
}
/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/