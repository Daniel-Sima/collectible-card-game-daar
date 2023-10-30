// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CardToken is ERC721Enumerable, Ownable {
    using Strings for uint256;
    
    string public ipfsURI;
    string public ipfsExt = ".json";

    constructor(string memory _name, string memory _symbol, string memory _ipfsURI) ERC721(_name, _symbol) {
        require(bytes(_ipfsURI).length > 0, "No IPFS URI provided");
        ipfsURI = _ipfsURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721URIStorage: URI query for nonexistent token");
        return string("ADD A FUCKING IPFS THERE");
    }

    function mint(address recipient) public onlyOwner returns(uint256) {
        uint256 tokenId = this.totalSupply();
        _safeMint(recipient, tokenId);
        return tokenId;
    }
}