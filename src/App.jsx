import React from "react";
import Web3 from "web3";
import "./App.css";
import Install from "./components/Install";
import { Route, Routes, BrowserRouter as Router, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import CardToken from "./contracts/contracts/CardToken.sol/CardToken.json";
import { ethers } from "ethers";
import Account from "./components/Pages/Account";
import Boosters from "./components/Pages/Boosters";
import Store from "./components/Pages/Store";
import { GiHamburgerMenu } from "react-icons/gi";
import SideBar from "./components/SideBar";
import logo_TCG from "./assets/pokemon_TCG.png";

/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/
function App() {
  const [showNav, setShowNav] = useState(false);
  const [account, setAccount] = useState(null);
  const [ownerCards, setOwnerCards] = useState();
  const [cardOnSale, setCardOnSale] = useState([]);
  const [allCards, setAllCards] = useState(null);
  const [state, setState] = useState(false);
  const [opened, setOpened] = useState(false);

  const web3 = new Web3(window.ethereum);
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  /******************************************************************************************************/
  useEffect(() => {
    getOwnerCards();
    get_cards_on_sale();

    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        setAccount(accounts[0]);
        setState(!state);
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, [state]);

  /******************************************************************************************************/
  /**
   * Returns owner's cards from the blockchain.
   */
  const getOwnerCards = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress,
      CardToken.abi,
      provider
    );
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        const acc = accounts[0];
        setAccount(acc);
        const ownerCardss = await contract.getOwnerCards(acc);
        const cardArray = ownerCardss.map((item) => {
          return {
            name: item.name,
            id: parseInt(item.id),
            cardNum: parseInt(item.id),
            amount: parseInt(item.amount),
          };
        });
        setOwnerCards(cardArray);
        console.log("=> ownerCardss: ", cardArray);

        const cards = await contract.getCardTokens();
        const cardArray2 = cards.map((item) => {
          return {
            name: item.name,
            id: parseInt(item.id),
            cardNum: parseInt(item.id),
            amount: parseInt(item.amount),
          };
        });
        setAllCards(cardArray2);
      }
    } catch (error) {
      console.error("Function error: ", error);
    }
  };

  /******************************************************************************************************/
  /**
   * Mint a card not already minted
   *
   * @param {*} _cardName Name of the Card (id in API)
   * @param {*} _cardNum  Number of the Card in its set
   */
  async function mintCardNFT(_cardName, _cardNum) {
    const web3 = new Web3(window.ethereum);
    const acc = await web3.eth.getAccounts();
    const from = acc[0];
    const contract = new web3.eth.Contract(CardToken.abi, contractAddress);
    try {
      const result = await contract.methods
        .mintCard(_cardName, _cardNum)
        .send({ from: from, value: ethers.parseEther("1") });
      console.log(result);
      setState(!state);
    } catch (error) {
      console.log(error);
    }
  }

  /******************************************************************************************************/
  /**
   * Open a Booster collection to retrieve 5 cards.
   *
   * @param {*} _collection Collection name
   * @param {*} _size       Size of the collection
   * @param {*} _eths       Price in ETH to open
   * @returns
   */
  async function openBooster(_collection, _size, _eths) {
    console.log("OPENNNNNNNNNNNNNNNNNNNNNNNNNNNN");
    const web3 = new Web3(window.ethereum);
    const acc = await web3.eth.getAccounts();
    const from = acc[0];
    const contract = new web3.eth.Contract(CardToken.abi, contractAddress);
    try {
      const result = await contract.methods
        .openBooster(_collection, _size)
        .send({ from: from, value: ethers.parseEther(_eths) });
      console.log(result);
      setState(!state);
      setOpened(true);
    } catch (error) {
      console.log(error);
    }
  }

  /******************************************************************************************************/
  /**
   * Put card on sale
   *
   * @param {*} _id     Name (id) of the card
   * @param {*} _amount Price to sell
   */
  async function put_card_on_sale(_id, _images, _amount) {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(CardToken.abi, contractAddress);
    const acc = await web3.eth.getAccounts();
    const from = acc[0];
    try {
      const result = await contract.methods
        .putCardOnSale(_id, _images, _amount)
        .send({ from: from });
      console.log(result);
      get_cards_on_sale();
    } catch (error) {
      console.error("Function error: ", error);
    }
  }

  /******************************************************************************************************/
  /**
   * Reemoves the card of the market
   *
   * @param {*} _counter  COUNTER of the card
   */
  async function remove_card_on_sale(_counter) {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(CardToken.abi, contractAddress);
    const acc = await web3.eth.getAccounts();
    const from = acc[0];
    try {
      const result = await contract.methods
        .noLongerSell(_counter)
        .send({ from: from });
      console.log(result);
      get_cards_on_sale();
    } catch (error) {
      console.error("Function error: ", error);
    }
  }

  /******************************************************************************************************/
  /**
   * Get all the cards on sale
   */
  async function get_cards_on_sale() {
    console.log("get_cards_on_sale");
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      contractAddress,
      CardToken.abi,
      provider
    );
    try {
      if (window.ethereum) {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const cards = await contract.getCardsOnSale();
        const cardArray = cards.map((item) => {
          return {
            name: item.name,
            id: parseInt(item.id),
            cardNum: parseInt(item.id),
            amount: parseInt(item.amount),
            url: item.url,
          };
        });
        setCardOnSale(cardArray);
        console.log("cardsOnSale: ", cardArray);
      }
    } catch (error) {
      console.error("Function error: ", error);
    }
  }

  /******************************************************************************************************/
  /**
   * Accepts the card exchange
   *
   * @param {*} _id     COUNTER of the card
   * @param {*} _amount Price to sell
   */
  async function accept_card_on_sale(_id, _amount) {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(CardToken.abi, contractAddress);
    const acc = await web3.eth.getAccounts();
    const from = acc[0];
    try {
      const result = await contract.methods
        .acceptSale(_id, from)
        .send({ from: from, value: ethers.parseEther(_amount) });
      console.log(result);
      get_cards_on_sale();
      setState(!state);
    } catch (error) {
      console.error("Function error: ", error);
    }
  }

  /******************************************************************************************************/
  return (
    <Router>
      <header>
        <GiHamburgerMenu onClick={() => setShowNav(!showNav)} />
        <picture className="centre--helper">
          <Link to="/Account">
            <img src={logo_TCG} className="logo--TCG" alt="Pokemon TCG logo" />
          </Link>
        </picture>
      </header>
      <SideBar show={showNav} account={account} />
      <Routes>
        <Route
          exact
          path="/*"
          element={
            <Account
              account={account}
              ownerCards={ownerCards}
              cardOnSale={cardOnSale}
              put_card_on_sale={put_card_on_sale}
              get_cards_on_sale={get_cards_on_sale}
              remove_card_on_sale={remove_card_on_sale}
            />
          }
        ></Route>
        <Route
          path="/Boosters"
          exact={true}
          element={
            <Boosters
              openBooster={openBooster}
              ownerCards={ownerCards}
              opened={opened}
              setOpened={setOpened}
            />
          }
        />
        <Route
          path="/Store"
          exact={true}
          element={
            <Store
              mintCardNFT={mintCardNFT}
              allCards={allCards}
              cardOnSale={cardOnSale}
              accept_card_on_sale={accept_card_on_sale}
            />
          }
        />
        <Route
          path="/Install"
          exact={true}
          element={<Install ownerCards={ownerCards} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
/******************************************************************************************************/
/******************************************************************************************************/
/******************************************************************************************************/
