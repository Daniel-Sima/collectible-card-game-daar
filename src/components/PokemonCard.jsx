import { useState, useEffect } from "react";
import pokemon from "pokemontcgsdk";

pokemon.configure({ apiKey: "f4be0dd2-ff36-42c2-9a1e-c50c11a36b4d" });

const PokemonCard = (props) => {
  return (
    <>
      <img src={props.card.images.small} className="card" />
    </>
  );
};

export default PokemonCard;
