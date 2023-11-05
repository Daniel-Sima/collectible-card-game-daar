import { useEffect, useState } from "react";
import "./../../App.css";
import pokemon from "pokemontcgsdk";
import PokemonCards from "../PokemonCards";

const Account = ({ account, ownerCards }) => {
  const [pokemonCards, setPokemonCards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ownerCards) {
      const fetchPokemonCards = async () => {
        const cartesRes = [];
        for (const item of ownerCards) {
          const card = await pokemon.card.find(item.name);
          cartesRes.push(card);
        }
        setPokemonCards(cartesRes);
        setLoading(false);
      };

      fetchPokemonCards();
    }
  }, [ownerCards]);

  return (
    <>
      {loading ? (
        <div className="loading">
          <p>Loading .... </p>
        </div>
      ) : (
        <div className="account">
          <div className="start-text">
            Welcome back, &nbsp; <strong>{account}</strong> &nbsp; !
          </div>
          <div className="start-text">
            You have {pokemonCards.length} cards:
          </div>
          <div className="border-top"></div>
          <div className="cards">
            <PokemonCards pokemonCards={pokemonCards} />
          </div>
        </div>
      )}
    </>
  );
};

export default Account;
