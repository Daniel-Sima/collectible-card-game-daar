import PokemonCards from "../PokemonCards";
import { useState, useEffect } from "react";
import pokemon from "pokemontcgsdk";

const Store = ({ mintCardNFT, allCards }) => {
  const [pokemonCards, setPokemonCards] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pokemon.card.all({ q: "set.id:base1" }).then((pokeCard) => {
      setPokemonCards(pokeCard);
      setLoading(false);
    });
  }, []);

  return (
    <>
      {loading ? (
        <div className="loading">
          <p>Loading .... </p>
        </div>
      ) : (
        <div className="store">
          <div className="start-text">Choose your cards for 1 ETH !</div>
          <div className="border-top"></div>
          <div className="cards">
            {pokemonCards && allCards && (
              <PokemonCards
                pokemonCards={pokemonCards}
                allCards={allCards}
                mintCardNFT={mintCardNFT}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Store;
