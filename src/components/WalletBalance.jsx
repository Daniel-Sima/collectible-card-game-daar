import React from "react";
import { useState } from "react";
import { ethers } from "ethers";

const WalletBalance = (props) => {
  const [balance, setBalance] = useState();
  // const [account, setAccount] = useState()

  const getBalance = async () => {
    const [account] = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(account);
    setBalance(ethers.formatEther(balance));
  };

  // const getAddress = async () => {
  //   const [account] = await window.ethereum.request({
  //     method: 'eth_requestAccounts',
  //   })
  //   setAccount(account)
  // }

  return (
    <div className="balance">
      <h5>Your Balance: {balance}</h5>
      <button onClick={() => getBalance()}>Show My Balance</button>
      <h5>Your address: {props.account}</h5>
      <button onClick={() => props.getAddress()}>Show My Address</button>
    </div>
  );
};

export default WalletBalance;
