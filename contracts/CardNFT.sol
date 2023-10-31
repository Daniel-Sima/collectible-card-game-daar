// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract CardToken is ERC721, Ownable {
    uint256 private _nextTokenId;

    constructor(address initialOwner)
        ERC721("CardToken", "CTK")
        Ownable(initialOwner)
    {}

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }
}
