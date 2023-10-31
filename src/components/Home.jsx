import { ethers } from "ethers";
import { useEffect, useState } from "react";

import WalletBalance from "./WalletBalance";
import PokemonSeries from "./PokemonSeries";
import CardToken from "../artifacts/contracts/CardNFT.sol/CardToken.json";

const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const provider = new ethers.BrowserProvider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, CardToken.abi, signer);

function Home() {
  // const [totalMinted, setTotalMinted] = useState(0);
  // useEffect(() => {
  //   getCount();
  // }, []);

  // const getCount = async () => {
  //   const count = await contract.count();
  //   console.log(parseInt(count));
  //   setTotalMinted(parseInt(count));
  // };

  return (
    // <div>
    <>
      <WalletBalance />
      <PokemonSeries />
    </>
    // <h1>dada</h1>
    // {
    /* {Array(totalMinted + 1)
        .fill(0)
        .map((_, i) => (
          <div key={i}>
            <NFTImage tokenId={i} getCount={getCount} />
          </div>
        ))} */
    // }
    // </div>
  );
}

export default Home;
