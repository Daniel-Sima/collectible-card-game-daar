// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";

contract Main {
  uint private count;
  mapping(uint => Collection) private collections;

  constructor() {
    count = 0;
  }

  function createCollection(string calldata name, uint256 cardCount) external {
    collections[count++] = new Collection(name, cardCount);
  }
}
