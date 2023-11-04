import React from "react";
import Web3 from "web3";
import "./App.css";
import Install from "./components/Install";
import { Route, Routes, BrowserRouter as Router, Link } from "react-router-dom"; // Assurez-vous d'importer BrowserRouter as Router
import { useEffect, useState } from "react";
import CardToken from "./contracts/contracts/CardToken.sol/CardToken.json";
import { ethers } from "ethers";
import Account from "./components/Pages/Account";
import Boosters from "./components/Pages/Boosters";
import Store from "./components/Pages/Store";
import { GiHamburgerMenu } from "react-icons/gi";
import SideBar from "./components/SideBar";
import logo_TCG from "./assets/pokemon_TCG.png";

function App() {
  const [showNav, setShowNav] = useState(false);
  const [account, setAccount] = useState(null); // Vous devez gérer l'état du compte
  const [ownerCards, setOwnerCards] = useState();

  // const [cardToken, setCardToken] = useState();
  const [allCards, setAllCards] = useState(null);
  const [state, setState] = useState(false);

  const web3 = new Web3(window.ethereum);
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

  useEffect(() => {
    console.log("PONG");
    // getAccount();
    getOwnerCards();

    // getAllCards();

    const handleAccountsChanged = (accounts) => {
      setAccount(accounts[0]);
      setState(!state);
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, [state]);

  // const getAccount = async () => {
  //   if (window.ethereum) {
  //     try {
  //       await window.ethereum.request({ method: "eth_requestAccounts" });
  //       const account = await web3.eth.getAccounts();
  //       const from = account[0];
  //       setAccount(from);
  //     } catch (err) {
  //       console.error("Failed to connect to MetaMask:", err);
  //       return false;
  //     }
  //   } else {
  //     console.error("MetaMask not found");
  //     return false;
  //   }
  // };

  /**
   * Returns owner's cards from the blockchain.
   */
  const getOwnerCards = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    // get the end user
    // const signer = provider.getSigner();
    // get the smart contract
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
        const ownerCards = await contract.getOwnerCards(acc);
        const cardArray = ownerCards.map((item) => {
          return {
            name: item.name,
            id: parseInt(item.id),
            cardNum: parseInt(item.id),
          };
        });
        setOwnerCards(cardArray);

        const cards = await contract.getCardTokens();
        const cardArray2 = cards.map((item) => {
          return {
            name: item.name,
            id: parseInt(item.id),
            cardNum: parseInt(item.id),
          };
        });
        console.log("=> allCards: ", cardArray2);
        setAllCards(cardArray2);
      }
    } catch (error) {
      console.error("Function error: ", error);
    }
  };

  // /**
  //  * Returns all cards present in the blockchain.
  //  */
  // const getAllCards = async () => {
  //   const provider = new ethers.BrowserProvider(window.ethereum);
  //   // get the end user
  //   // const signer = provider.getSigner();
  //   // get the smart contract
  //   const contract = new ethers.Contract(
  //     contractAddress,
  //     CardToken.abi,
  //     provider
  //   );
  //   try {
  //   } catch (error) {
  //     console.error("Erreur lors de l'appel à la fonction :", error);
  //   }
  // };

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
            window.ethereum ? (
              <Account account={account} ownerCards={ownerCards} />
            ) : (
              <Install />
            )
          }
        ></Route>
        {/* <Route
          path="/Account"
          exact={true}
          element={<Account account={account} ownerCards={ownerCards} />}
        /> */}
        <Route path="/Boosters" exact={true} element={<Boosters />} />
        <Route
          path="/Store"
          exact={true}
          element={<Store mintCardNFT={mintCardNFT} allCards={allCards} />}
        />
        <Route path="/Install" exact={true} element={<Install />} />
      </Routes>
    </Router>
  );
}

export default App;
