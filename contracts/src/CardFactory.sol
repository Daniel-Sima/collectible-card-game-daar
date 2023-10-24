pragma solidity ^0.8;

import "./ownable.sol";
import "./safemath.sol";

contract CardFactory is Ownable {

  using SafeMath for uint256;

  event NewCard(uint cardId, string name, uint dna);

  uint dnaDigits = 16;
  uint dnaModulus = 10 ** dnaDigits;
  uint cooldownTime = 1 days;

  struct Card {
    string name;
    uint dna;
    uint32 level;
    uint32 readyTime;
    uint16 winCount;
    uint16 lossCount;
  }

  Card[] public cards;

  mapping (uint => address) public cardToOwner;
  mapping (address => uint) ownerCardCount;

  function _createCard(string _name, uint _dna) internal {
    uint id = cards.push(Card(_name, _dna, 1, uint32(now + cooldownTime), 0, 0)) - 1;
    cardToOwner[id] = msg.sender;
    ownerCardCount[msg.sender]++;
    NewCard(id, _name, _dna);
  }

  function _generateRandomDna(string _str) private view returns (uint) {
    uint rand = uint(keccak256(_str));
    return rand % dnaModulus;
  }

  function createRandomCard(string _name) public {
    require(ownerCardCount[msg.sender] == 0);
    uint randDna = _generateRandomDna(_name);
    randDna = randDna - randDna % 100;
    _createCard(_name, randDna);
  }

}