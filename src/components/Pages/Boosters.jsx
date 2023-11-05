import pokemon from "pokemontcgsdk";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PokemonCard from "../PokemonCard";

const Boosters = ({ openBooster, ownerCards, opened, setOpened }) => {
  const [teamRocket, setTeamRocket] = useState();
  const [diamonPearl, setDiamonPearl] = useState();
  const [pokemonGO, setPokemonGo] = useState();
  const [celebrations, setCelebrations] = useState();
  const [loading, setLoading] = useState(true);
  const [pokemonCards, setPokemonCards] = useState([]);
  const navigate = useNavigate();

  const fetchPokemonCards = async () => {
    const cartesRes = [];
    for (const item of ownerCards.slice(-3)) {
      const card = await pokemon.card.find(item.name);
      cartesRes.push(card);
    }
    setPokemonCards(cartesRes);
  };

  useEffect(() => {
    if (ownerCards) {
      if (opened) {
        fetchPokemonCards();
      }
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
    } else {
      navigate("/Install");
    }
  }, [ownerCards]);

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
                    onClick={() => openBooster(teamRocket.data[0].id, 84n, "5")}
                    alt="Logo of the collection Team Rocket"
                  />
                  <p>5 ETH</p>
                </div>
                <div className="collection">
                  <img
                    src={pokemonGO && pokemonGO.data[0].images.logo}
                    className="logo--collection"
                    onClick={() => openBooster(pokemonGO.data[0].id, 89n, "10")}
                    alt="Logo of the collection Pokemon GO"
                  />
                  <p>10 ETH</p>
                </div>
                <div className="collection">
                  <img
                    src={diamonPearl && diamonPearl.data[0].images.logo}
                    onClick={() =>
                      openBooster(diamonPearl.data[0].id, 131n, "25")
                    }
                    className="logo--collection"
                    alt="Logo of the collection Diamond & Pearl"
                  />
                  <p>25 ETH</p>
                </div>
                <div className="collection">
                  <img
                    src={celebrations && celebrations.data[0].images.logo}
                    onClick={() =>
                      openBooster(celebrations.data[0].id, 26n, "50")
                    }
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
                <div className="grid--3">
                  {pokemonCards &&
                    pokemonCards.map((item) => {
                      return (
                        <div key={item.id}>{<PokemonCard card={item} />}</div>
                      );
                    })}
                </div>
                <div className="container--btn">
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
            </div>
          )}
        </>
      )}
    </>
  );
};

export default Boosters;
