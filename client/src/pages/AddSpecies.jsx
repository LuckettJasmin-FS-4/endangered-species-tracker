import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddSpecies() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    status: "",
    habitat: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post("http://localhost:8000/api/species", formData);

      setFormData({
        name: "",
        status: "",
        habitat: "",
      });

      navigate("/");
    } catch (error) {
      console.error("Error adding species:", error);
    }
  };

  return (
    <main className="page">
      <div className="page-heading">
        <p className="eyebrow">NEW RECORD</p>
        <h2>Add a Species</h2>
        <p>Add an endangered species to the conservation tracker.</p>
      </div>

      <form className="species-form" onSubmit={handleSubmit}>
        <label>
          Species Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Example: Amur Leopard"
            required
          />
        </label>

        <label>
          Conservation Status
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="">Select a status</option>
            <option value="Vulnerable">Vulnerable</option>
            <option value="Endangered">Endangered</option>
            <option value="Critically Endangered">
              Critically Endangered
            </option>
          </select>
        </label>

        <label>
          Habitat
          <input
            type="text"
            name="habitat"
            value={formData.habitat}
            onChange={handleChange}
            placeholder="Example: Temperate forests"
            required
          />
        </label>

        <button type="submit">Add Species</button>
      </form>
    </main>
  );
}

export default AddSpecies;