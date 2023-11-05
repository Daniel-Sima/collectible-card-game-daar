import React, { useEffect } from "react";
import pokemon from "pokemontcgsdk";
import { useLocation } from "react-router-dom";

pokemon.configure({ apiKey: "f4be0dd2-ff36-42c2-9a1e-c50c11a36b4d" });

const PokemonCard = (props) => {
  const location = useLocation();

  return (
    <>
      {location.pathname === "/Boosters" ? (
        <div>
          <img
            src={props.card.images.small}
            className="card"
            alt="Pokemon card"
          />
        </div>
      ) : props.buyable ? (
        <div
          className="pokemonCard"
          onClick={() =>
            location.pathname === "/Store" &&
            props.mintCardNFT(props.card.id, props.card.number)
          }
        >
          <img
            src={props.card.images.small}
            className="card"
            alt="Pokemon card"
          />
        </div>
      ) : (
        <div className="cardGrey">
          <img
            src={props.card.images.small}
            className="card-not-buyable"
            alt="Pokemon card"
          />
        </div>
      )}
    </>
  );
};

export default PokemonCard;
