// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Collection.sol";

contract Main {
  uint private count;
  mapping(uint => Collection) private collections;

  constructor() {
    count = 0;
  }

  function createCollection(string calldata name, int cardCount) external {
    collections[count++] = new Collection(name, cardCount);
  }

  // function payToMint(
  //       address recipient,
  //       uint collectionNb,
  //       uint cardNb
  //   ) public payable  {
  //       require(collections[collectionNb].cardCount == 0, 'Collection not exist!');
  //       Collection collectionRes = collections[collectionNb];
  //       require(collectionRes.cards[cardNb] == 0, 'Card not exist!');
  //       require (msg.value >= 0.05 ether, 'Need to pay up!');

  //   }
}