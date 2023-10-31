import { useState, useEffect } from "react";
import pokemon from "pokemontcgsdk";

import WalletBalance from "./WalletBalance";
import PokemonCard from "./PokemonCard";

pokemon.configure({ apiKey: "f4be0dd2-ff36-42c2-9a1e-c50c11a36b4d" });

function PokemonCards() {
  const [pokemonCards, setPokemonCards] = useState(null);

  useEffect(() => {
    pokemon.card.all({ q: "set.id:base1" }).then((cards) => {
      setPokemonCards(cards);
    });
  }, []);

  return (
    <>
      <div className="pokemons-presentation">
        <WalletBalance />
        <h1>Pokemons</h1>
      </div>
      {pokemonCards &&
        pokemonCards.map((item) => <PokemonCard key={item.id} card={item} />)}
    </>
  );
}

export default PokemonCards;
