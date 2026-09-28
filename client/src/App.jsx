import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import SpeciesDashboard from "./pages/SpeciesDashboard";
import AddSpecies from "./pages/AddSpecies";
import AuthPage from "./pages/AuthPage";
import "./App.css";

function App() {
  const [token, setToken] = useState(() =>
    localStorage.getItem("endangered_species_token")
  );

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("endangered_species_token");
    setToken(null);
  };

  return (
    <BrowserRouter>
      <div className="app">
        <header className="header">
          <div>
            <h1>Endangered Species Tracker</h1>
            <p>Track and manage species at risk around the world.</p>
          </div>

          {token && (
            <nav>
              <Link to="/">Species</Link>
              <Link to="/add">Add Species</Link>

              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </nav>
          )}
        </header>

        {!token ? (
          <AuthPage onLogin={handleLogin} />
        ) : (
          <Routes>
            <Route path="/" element={<SpeciesDashboard />} />
            <Route path="/add" element={<AddSpecies />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;
