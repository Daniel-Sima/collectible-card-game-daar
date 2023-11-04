import { useEffect, useState } from "react";
import "./../../App.css";
import pokemon from "pokemontcgsdk";
import PokemonCards from "../PokemonCards";

const Account = ({ account, ownerCards }) => {
  const [pokemonCards, setPokemonCards] = useState([]);

  useEffect(() => {
    if (ownerCards) {
      const fetchPokemonCards = async () => {
        const cartesRes = [];
        for (const item of ownerCards) {
          const card = await pokemon.card.find(item.name);
          cartesRes.push(card);
        }
        setPokemonCards(cartesRes);
      };

      fetchPokemonCards();
    }
  }, [ownerCards]);

  return (
    <div className="account">
      <div className="start-text">
        Welcome back, &nbsp; <strong>{account}</strong> &nbsp; !
      </div>
      <div className="start-text">You have {pokemonCards.length} cards:</div>
      <div className="border-top"></div>
      <div className="cards">
        <PokemonCards pokemonCards={pokemonCards} />
      </div>
    </div>
  );
};

export default Account;
