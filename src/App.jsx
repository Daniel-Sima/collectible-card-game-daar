import "./App.css";
import Home from "./components/Home";
import Install from "./components/Install";
import { Route, Routes, BrowserRouter as Router } from "react-router-dom"; // Assurez-vous d'importer BrowserRouter as Router

import PokemonCards from "./components/PokemonCards";

function App() {
  {
    window.ethereum ? console.log("PONG") : console.log("ping");
  }
  return (
    <Router>
      <Routes>
        <Route
          exact
          path="/*"
          element={window.ethereum ? <Home /> : <Install />}
        ></Route>
        <Route path="/PokemonCards" element={<PokemonCards />} />
      </Routes>
    </Router>
  );
  // if (window.ethereum) {
  //   {
  //     console.log("PONG");
  //   }
  //   return <Home />;
  // } else {
  //   {
  //     console.log("ping");
  //   }
  //   return <Install />;
  // }
}

export default App;
