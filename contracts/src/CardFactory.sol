// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./CardMinter.sol";

contract CardFactory is CardMinter {
  constructor() CardMinter(Parameters({
          chainCurrencyDecimals: 18,
          presalePriceUSD: 100,
          publicsalePriceUSD: 200,
          maxSupply: 42,
          maxMint: 1,
          token: Token({
              name: "YouNFTup",
              symbol: "YNP",
              ipfsURI: "https://ipfs.io/ipfs/bafkreihmkaetjsqkb2cnzdkyhvpattzpj7duuqj4kfvtx3qfcitj2didbu"
          }),
          priceFeed: new PriceFeedMaticUSD(),
          periods: Periods({
              startPresalePeriod: block.timestamp + 1,
              endPresalePeriod: block.timestamp + 3600 * 24 * 30,
              startPublicsalePeriod: block.timestamp + 3600 * 24 * 60,
              endPublicsalePeriod: block.timestamp + 3600 * 24 * 90
          }),
          teamAddress: payable(0xB677dd9Ae9217Fbb4E3d072b9F7F68947C2a4AA6)
      })) {}
}