// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import './Card.sol';

contract Collection {
  string public name;
  uint256 public cardCount;
  CardToken[] public cards;

  constructor(string memory _name, uint256 _cardCount) {
    name = _name;
    cardCount = _cardCount;
  }

  function addToCollection(CardToken card) public {
    cards[cardCount++] = card;
  }
}
