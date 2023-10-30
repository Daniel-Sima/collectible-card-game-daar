// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Collection.sol";

import "@openzeppelin/contracts/utils/Strings.sol";

contract Main {
  using Strings for uint64;

  int private count;
  mapping(int => Collection) private collections;

  constructor() {
    count = 0;
  }

  function createCollection(string calldata name, uint64 cardCount) external {
    collections[count++] = new Collection(name, cardCount);
  }
}