// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./CardPriceFeed.sol";
import "./Card.sol";

struct Parameters {
    uint8 chainCurrencyDecimals;
    uint presalePriceUSD;
    uint publicsalePriceUSD;
    uint maxSupply;
    uint maxMint;
    Token token;
    CardPriceFeed priceFeed;
    Periods periods;
    address payable teamAddress;
}

struct Token {
    string name;
    string symbol;
    string ipfsURI;
}

struct Periods {
    uint startPresalePeriod;
    uint endPresalePeriod;
    uint startPublicsalePeriod;
    uint endPublicsalePeriod;
}

contract CardMinter {
    enum State
    {
        waitingPeriod,
        presalePeriod,
        publicsalePeriod,
        complete
    }

    // Chain info and team wallet
    uint8 public immutable chainTokenDecimals;
    address payable public immutable teamAddress;
    CardToken public immutable token;

    //NFT max supply
    uint public immutable maxSupply;

    //NFT max mint per wallet
    uint public immutable maxMint;

    // NFT price in USD
    uint public immutable presalePriceUSD;
    uint public immutable publicsalePriceUSD;
    uint constant ticketPriceDecimals = 2;

    //Periods
    Periods public periods;

    //Chainlink Price feed
    CardPriceFeed public immutable priceFeed;

    constructor(Parameters memory params) {
        require(params.periods.startPresalePeriod > block.timestamp, "Invalid timestamp: startPresalePeriod");
        require(params.periods.endPresalePeriod > params.periods.startPresalePeriod, "Invalid timestamp: endPresalePeriod");
        require(params.periods.startPublicsalePeriod > params.periods.endPresalePeriod, "Invalid timestamp: startPublicsalePeriod");
        require(params.periods.endPublicsalePeriod > params.periods.startPublicsalePeriod, "Invalid timestamp: endPlubicsalePeriod");

        token = new CardToken(params.token.name, params.token.symbol, params.token.ipfsURI);

        chainTokenDecimals = params.chainCurrencyDecimals;
        presalePriceUSD = params.presalePriceUSD;
        publicsalePriceUSD = params.publicsalePriceUSD;
        maxSupply = params.maxSupply;
        maxMint = params.maxMint;
        priceFeed = params.priceFeed;
        periods = params.periods;

        teamAddress = params.teamAddress;
    }

    function mintNFT() external payable {
        require(getState() == State.presalePeriod || getState() == State.publicsalePeriod, "You can't mint it right now");

        uint entryPrice = getMintPrice();
        require(msg.value >= entryPrice, "Not enough funds to mint YouNFTup. See getMintPrice()");
        require(token.totalSupply() < maxSupply, "Too much NFT minted");
        require(token.balanceOf(msg.sender) < maxMint, "You could mint only 1 YouNFTup");
        token.mint(msg.sender);
        teamAddress.transfer(address(this).balance);
    }

    function getState() public view returns(State) {
        if (block.timestamp < periods.startPresalePeriod) {
            return State.waitingPeriod;
        }
        if (block.timestamp < periods.endPresalePeriod) {
            return State.presalePeriod;
        }
        if (block.timestamp < periods.startPublicsalePeriod) {
            return State.waitingPeriod;
        }
        if (block.timestamp < periods.endPublicsalePeriod) {
            return State.publicsalePeriod;
        }
        return State.complete;
    }
    
    function getMintPrice() public view returns(uint) {
        int latestPrice = priceFeed.getLatestPrice();
        uint256 ticketPriceUSD = publicsalePriceUSD;
        if (getState() == State.presalePeriod) {
            ticketPriceUSD = presalePriceUSD;
        }
        
        uint latestPriceAdjusted = uint(latestPrice) * 10 ** (chainTokenDecimals - priceFeed.decimals());

        uint entryPrice = 10 ** (chainTokenDecimals * 2) * ticketPriceUSD / latestPriceAdjusted / (10 ** ticketPriceDecimals);
        return entryPrice;
    }

    function isComplete() public view returns(bool) {
        return getState() == State.complete;
    }

}