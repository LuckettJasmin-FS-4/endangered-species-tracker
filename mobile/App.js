import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";

const API_URL = "http://localhost:8000/api/species";

export default function App() {
  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [habitat, setHabitat] = useState("");
  const [editingId, setEditingId] = useState(null);

  // READ
  const fetchSpecies = async () => {
    try {
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to load species.");
      }

      const data = await response.json();
      setSpecies(data);
    } catch (err) {
      console.error(err);
      setError("Could not connect to the species API.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpecies();
  }, []);

  const clearForm = () => {
    setName("");
    setStatus("");
    setHabitat("");
    setEditingId(null);
  };

  // CREATE
  const addSpecies = async () => {
    if (!name.trim() || !status.trim() || !habitat.trim()) {
      setError("Please complete all three fields.");
      return;
    }

    try {
      setError("");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          status,
          habitat,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to add species.");
      }

      clearForm();
      await fetchSpecies();
    } catch (err) {
      console.error(err);
      setError("Could not add the species.");
    }
  };

  // Prepare form for editing
  const startEditing = (item) => {
    setEditingId(item._id);
    setName(item.name);
    setStatus(item.status);
    setHabitat(item.habitat);
    setError("");
  };

  // UPDATE
  const updateSpecies = async () => {
    if (!name.trim() || !status.trim() || !habitat.trim()) {
      setError("Please complete all three fields.");
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_URL}/${editingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          status,
          habitat,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to update species.");
      }

      clearForm();
      await fetchSpecies();
    } catch (err) {
      console.error(err);
      setError("Could not update the species.");
    }
  };

  // DELETE
  const deleteSpecies = async (id) => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete species.");
      }

      if (editingId === id) {
        clearForm();
      }

      await fetchSpecies();
    } catch (err) {
      console.error(err);
      setError("Could not delete the species.");
    }
  };

  const renderSpecies = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.speciesName}>{item.name}</Text>

      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>

      <Text style={styles.label}>Habitat</Text>
      <Text style={styles.habitat}>{item.habitat}</Text>

      <View style={styles.buttonRow}>
        <Pressable
          style={styles.editButton}
          onPress={() => startEditing(item)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </Pressable>

        <Pressable
          style={styles.deleteButton}
          onPress={() => deleteSpecies(item._id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.eyebrow}>WILDLIFE CONSERVATION</Text>

        <Text style={styles.title}>
          Endangered Species Tracker
        </Text>

        <Text style={styles.subtitle}>
          Track and manage endangered species records.
        </Text>
      </View>

      <View style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.formTitle}>
            {editingId ? "Edit Species" : "Add a Species"}
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Species name"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="Conservation status"
            value={status}
            onChangeText={setStatus}
          />

          <TextInput
            style={styles.input}
            placeholder="Habitat"
            value={habitat}
            onChangeText={setHabitat}
          />

          <Pressable
            style={styles.addButton}
            onPress={editingId ? updateSpecies : addSpecies}
          >
            <Text style={styles.addButtonText}>
              {editingId ? "Update Species" : "Add Species"}
            </Text>
          </Pressable>

          {editingId && (
            <Pressable
              style={styles.cancelButton}
              onPress={clearForm}
            >
              <Text style={styles.cancelButtonText}>
                Cancel Editing
              </Text>
            </Pressable>
          )}
        </View>

        <View style={styles.listHeader}>
          <Text style={styles.sectionTitle}>Species</Text>
          <Text style={styles.count}>
            {species.length} tracked
          </Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : species.length === 0 ? (
          <Text style={styles.empty}>
            No species have been added yet.
          </Text>
        ) : (
          <FlatList
            data={species}
            keyExtractor={(item) => item._id}
            renderItem={renderSpecies}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#071a13",
  },

  header: {
    backgroundColor: "#0d3324",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 32,
  },

  eyebrow: {
    color: "#8dd7a9",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
  },

  title: {
    color: "#ffffff",
    fontSize: 34,
    fontWeight: "800",
    marginTop: 8,
  },

  subtitle: {
    color: "#c7ded1",
    fontSize: 16,
    lineHeight: 23,
    marginTop: 10,
  },

  content: {
    flex: 1,
    backgroundColor: "#f1f7f3",
    padding: 20,
  },

  form: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#dce9e1",
  },

  formTitle: {
    color: "#153c2b",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 14,
  },

  input: {
    backgroundColor: "#f5f9f6",
    borderWidth: 1,
    borderColor: "#cddfd4",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },

  addButton: {
    backgroundColor: "#176b45",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 2,
  },

  addButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  cancelButton: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: "center",
  },

  cancelButtonText: {
    color: "#547565",
    fontSize: 15,
    fontWeight: "700",
  },

  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  sectionTitle: {
    color: "#153c2b",
    fontSize: 25,
    fontWeight: "800",
  },

  count: {
    color: "#547565",
    fontWeight: "600",
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 20,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#dce9e1",
  },

  speciesName: {
    color: "#153c2b",
    fontSize: 22,
    fontWeight: "800",
  },

  statusBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#e0f2e7",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
    marginBottom: 16,
  },

  statusText: {
    color: "#23633f",
    fontSize: 13,
    fontWeight: "700",
  },

  label: {
    color: "#71867a",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  habitat: {
    color: "#324b3e",
    fontSize: 16,
    marginTop: 4,
  },

  buttonRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },

  editButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#176b45",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },

  editButtonText: {
    color: "#176b45",
    fontSize: 15,
    fontWeight: "700",
  },

  deleteButton: {
    flex: 1,
    backgroundColor: "#b42318",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },

  deleteButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  error: {
    color: "#b42318",
    fontSize: 16,
    marginBottom: 14,
  },

  empty: {
    color: "#547565",
    fontSize: 16,
  },
});