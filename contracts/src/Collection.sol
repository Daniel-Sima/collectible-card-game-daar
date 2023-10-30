// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import './Card.sol';
import "@openzeppelin/contracts/utils/Strings.sol";

contract Collection {
  using Strings for uint64;

  string public name;
  uint64 public cardCount;
  CardToken[] private cards;

  constructor(string memory _name, uint64 _cardCount) {
    name = _name;
    cardCount = _cardCount;
  }

  function addCard(CardToken card) public {
    cards[cardCount++] = card;
  }
}