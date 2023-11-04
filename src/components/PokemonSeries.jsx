import React from "react";
import pokemon from "pokemontcgsdk";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

pokemon.configure({ apiKey: "f4be0dd2-ff36-42c2-9a1e-c50c11a36b4d" });

function PokemonSeries() {
  const [series, setSeries] = useState(null);

  useEffect(() => {
    pokemon.set.find("base1").then((set) => {
      setSeries(set);
      console.log(set);
    });
  }, []);

  return (
    <>
      {series && (
        <div>
          <Link to="/PokemonCards" className="series">
            <img src={series.images.logo} alt="" />
          </Link>
          <p>Cards number: {series.printedTotal}</p>
        </div>
      )}
    </>
  );
}

export default PokemonSeries;
