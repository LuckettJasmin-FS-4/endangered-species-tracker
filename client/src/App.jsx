import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SpeciesDashboard from "./pages/SpeciesDashboard";
import AddSpecies from "./pages/AddSpecies";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <div>
            <h1>Endangered Species Tracker</h1>
            <p>Track and manage species at risk around the world.</p>
          </div>

          <nav>
            <Link to="/">Species</Link>
            <Link to="/add">Add Species</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<SpeciesDashboard />} />
          <Route path="/add" element={<AddSpecies />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;