import PokemonCards from "../PokemonCards";
import { useState, useEffect } from "react";
import pokemon from "pokemontcgsdk";

const Store = ({ mintCardNFT, allCards }) => {
  const [pokemonCards, setPokemonCards] = useState(null);

  useEffect(() => {
    pokemon.card.all({ q: "set.id:base1" }).then((pokeCard) => {
      setPokemonCards(pokeCard);
    });
  }, []);

  return (
    <div className="store">
      <div className="start-text">Choose your cards</div>
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
  );
};

export default Store;
