
# Collectible Card Game - Pokémon version
---
## Installation

> Blockchain part

```bash
# terminal 1
npx hardhat node

# terminal 2
npx hardhat run scripts/deploy.js --network localhost
```
Copies one of the `Private Key` from the `terminal 1` and connect it to Metamask
to see the balance.

Copies the result `Private Key` from the `terminal 1` and paste it in `contractAddress` variable from `App.jsx`.

> Front-end part

```bash
npm install
npm start
```
