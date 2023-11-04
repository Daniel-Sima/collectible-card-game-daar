import React, { useEffect, useState } from "react";
import pokemon from "pokemontcgsdk";

import PokemonCard from "./PokemonCard";

pokemon.configure({ apiKey: "f4be0dd2-ff36-42c2-9a1e-c50c11a36b4d" });

const PokemonCards = ({ mintCardNFT, pokemonCards, allCards }) => {
  let buyable = true;

  return (
    <>
      <div className="pokemonCards">
        <div className="grid container">
          {pokemonCards &&
            pokemonCards.map((item) => {
              let tabNames = allCards && allCards.map((elem) => elem.name);

              if (allCards && tabNames.includes(item.id)) {
                buyable = false;
              } else {
                buyable = true;
              }
              return (
                <div key={item.id}>
                  {
                    <PokemonCard
                      card={item}
                      mintCardNFT={mintCardNFT}
                      buyable={buyable}
                    />
                  }
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default PokemonCards;
