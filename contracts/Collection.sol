// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Collection {
  string public name;
  int public cardCount;

  struct Card {
    string name;
    string img;
    uint cardNumber;
  }

  Card[] public cards;

  
  // mapping (address => uint) ownerCardCount;

  constructor(string memory _name, int _cardCount) {
    name = _name;
    cardCount = _cardCount;
  }
}