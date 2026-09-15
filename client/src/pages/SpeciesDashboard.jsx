import { useEffect, useState } from "react";
import axios from "axios";

function SpeciesDashboard() {
  const [species, setSpecies] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    status: "",
    habitat: "",
  });

 

  useEffect(() => {
    const loadSpecies = async () => {
      try {
        const response = await axios.get(
          "/api/species"
        );
  
        setSpecies(response.data);
      } catch (error) {
        console.error("Error getting species:", error);
      }
    };
  
    loadSpecies();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `/api/species/${id}`
      );

      setSpecies(species.filter((animal) => animal._id !== id));
    } catch (error) {
      console.error("Error deleting species:", error);
    }
  };

  const startEdit = (animal) => {
    setEditingId(animal._id);

    setEditData({
      name: animal.name,
      status: animal.status,
      habitat: animal.habitat,
    });
  };

  const handleEditChange = (event) => {
    setEditData({
      ...editData,
      [event.target.name]: event.target.value,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.patch(
        `/api/species/${id}`,
        editData
      );

      setSpecies(
        species.map((animal) =>
          animal._id === id ? response.data : animal
        )
      );

      setEditingId(null);
    } catch (error) {
      console.error("Error updating species:", error);
    }
  };

  return (
    <main className="page">
      <div className="page-heading">
        <p className="eyebrow">CONSERVATION DASHBOARD</p>
        <h2>Species at Risk</h2>
        <p>
          View and manage endangered species currently stored in the tracker.
        </p>
      </div>

      {species.length === 0 ? (
        <div className="empty-state">
          <h3>No species added yet</h3>
          <p>Use Add Species to create your first record.</p>
        </div>
      ) : (
        <div className="species-grid">
          {species.map((animal) => (
            <div className="species-card" key={animal._id}>

              {editingId === animal._id ? (
                <div className="edit-form">
                  <input
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                  />

                  <select
                    name="status"
                    value={editData.status}
                    onChange={handleEditChange}
                  >
                    <option value="Vulnerable">Vulnerable</option>
                    <option value="Endangered">Endangered</option>
                    <option value="Critically Endangered">
                      Critically Endangered
                    </option>
                  </select>

                  <input
                    name="habitat"
                    value={editData.habitat}
                    onChange={handleEditChange}
                  />

                  <div className="card-buttons">
                    <button
                      onClick={() => handleUpdate(animal._id)}
                    >
                      Save
                    </button>

                    <button onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3>{animal.name}</h3>

                  <p>
                    <strong>Status:</strong> {animal.status}
                  </p>

                  <p>
                    <strong>Habitat:</strong> {animal.habitat}
                  </p>

                  <p>
                    <strong>Added:</strong>{" "}
                    {new Date(
                      animal.created_at
                    ).toLocaleDateString()}
                  </p>

                  <div className="card-buttons">
                    <button onClick={() => startEdit(animal)}>
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(animal._id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default SpeciesDashboard;