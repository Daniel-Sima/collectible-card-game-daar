import pokemon from "pokemontcgsdk";
import { useState, useEffect } from "react";
import PokemonCards from "../PokemonCards";

const Boosters = ({ openBooster, ownerCards, opened, setOpened }) => {
  const [teamRocket, setTeamRocket] = useState();
  const [diamonPearl, setDiamonPearl] = useState();
  const [pokemonGO, setPokemonGo] = useState();
  const [celebrations, setCelebrations] = useState();
  const [loading, setLoading] = useState(true);
  const [pokemonCards, setPokemonCards] = useState([]);

  const fetchPokemonCards = async () => {
    const cartesRes = [];
    for (const item of ownerCards.slice(-4)) {
      const card = await pokemon.card.find(item.name);
      cartesRes.push(card);
    }
    setPokemonCards(cartesRes);
  };

  useEffect(() => {
    if (opened) {
      fetchPokemonCards();
    }
  }, [ownerCards]);

  useEffect(() => {
    // Team Rocket
    pokemon.set.where({ q: "id:base5" }).then((result) => {
      setTeamRocket(result);
    });

    // Diamond & Pearl
    pokemon.set.where({ q: "id:dp1" }).then((result) => {
      setDiamonPearl(result);
    });

    // Pokemon GO
    pokemon.set.where({ q: "id:pgo" }).then((result) => {
      setPokemonGo(result);
    });

    // Celebrations
    pokemon.set.where({ q: "id:cel25" }).then((result) => {
      setCelebrations(result);
    });

    setTimeout(() => {
      setLoading(false);
    }, 400);
  }, []);

  return (
    <>
      {loading ? (
        <div className="loading">
          <p>Loading .... </p>
        </div>
      ) : (
        <>
          {pokemonCards && pokemonCards.length === 0 && (
            <div className="boosters">
              <div className="start-text">Choose a booster!</div>
              <div className="border-top"></div>
              <div className="collections container">
                <div className="collection margin-top--helper">
                  <img
                    src={teamRocket && teamRocket.data[0].images.logo}
                    className="logo--collection"
                    onClick={() => openBooster(teamRocket.data[0].id, 83n, "5")}
                    alt="Logo of the collection Team Rocket"
                  />
                  <p>5 ETH</p>
                </div>
                <div className="collection">
                  <img
                    src={pokemonGO && pokemonGO.data[0].images.logo}
                    className="logo--collection"
                    alt="Logo of the collection Pokemon GO"
                  />
                  <p>10 ETH</p>
                </div>
                <div className="collection">
                  <img
                    src={diamonPearl && diamonPearl.data[0].images.logo}
                    className="logo--collection"
                    alt="Logo of the collection Diamond & Pearl"
                  />
                  <p>25 ETH</p>
                </div>
                <div className="collection">
                  <img
                    src={celebrations && celebrations.data[0].images.logo}
                    className="logo--collection"
                    alt="Logo of the collection Celebrations"
                  />
                  <p>50 ETH</p>
                </div>
              </div>
            </div>
          )}
          {pokemonCards.length > 0 && (
            <div className="container--OK">
              <div className="pokemon-cards-container animated">
                <PokemonCards pokemonCards={pokemonCards} />
                <button
                  onClick={() => {
                    setPokemonCards([]);
                    setOpened(false);
                  }}
                  className="btn--OK"
                >
                  OK
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Boosters;
