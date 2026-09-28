import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL = "http://localhost:8000/api";
const TOKEN_KEY = "endangered_species_token";

export default function App() {
  const [token, setToken] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authScreen, setAuthScreen] = useState("login");
  const [authError, setAuthError] = useState("");

  const [registerName, setRegisterName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [species, setSpecies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [habitat, setHabitat] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    restoreSession();
  }, []);

  useEffect(() => {
    if (token) {
      fetchSpecies();
    }
  }, [token]);

  const saveToken = async (newToken) => {
    if (Platform.OS === "web") {
      localStorage.setItem(TOKEN_KEY, newToken);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, newToken);
    }

    setToken(newToken);
  };

  const restoreSession = async () => {
    try {
      const savedToken =
        Platform.OS === "web"
          ? localStorage.getItem(TOKEN_KEY)
          : await SecureStore.getItemAsync(TOKEN_KEY);

      if (savedToken) {
        setToken(savedToken);
      }
    } catch (err) {
      console.error("Unable to restore session:", err);
    } finally {
      setCheckingAuth(false);
    }
  };

  const logout = async () => {
    if (Platform.OS === "web") {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }

    setToken(null);
    setSpecies([]);
    setEmail("");
    setPassword("");
    setAuthError("");
    clearForm();
  };

  const register = async () => {
    if (!registerName.trim() || !email.trim() || !password.trim()) {
      setAuthError("Please complete all fields.");
      return;
    }

    try {
      setAuthError("");

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: registerName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to register.");
      }

      await saveToken(data.token);
      setRegisterName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const login = async () => {
    if (!email.trim() || !password.trim()) {
      setAuthError("Please enter your email and password.");
      return;
    }

    try {
      setAuthError("");

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to login.");
      }

      await saveToken(data.token);
      setEmail("");
      setPassword("");
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  });

  const fetchSpecies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/species`, {
        headers: authHeaders(),
      });

      if (response.status === 401) {
        await logout();
        setAuthError("Your session expired. Please log in again.");
        return;
      }

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

  const clearForm = () => {
    setName("");
    setStatus("");
    setHabitat("");
    setEditingId(null);
  };

  const addSpecies = async () => {
    if (!name.trim() || !status.trim() || !habitat.trim()) {
      setError("Please complete all three fields.");
      return;
    }

    try {
      setError("");

      const response = await fetch(`${API_BASE_URL}/species`, {
        method: "POST",
        headers: authHeaders(),
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

  const startEditing = (item) => {
    setEditingId(item._id);
    setName(item.name);
    setStatus(item.status);
    setHabitat(item.habitat);
    setError("");
  };

  const updateSpecies = async () => {
    if (!name.trim() || !status.trim() || !habitat.trim()) {
      setError("Please complete all three fields.");
      return;
    }

    try {
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/species/${editingId}`,
        {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify({
            name,
            status,
            habitat,
          }),
        }
      );

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

  const deleteSpecies = async (id) => {
    try {
      setError("");

      const response = await fetch(`${API_BASE_URL}/species/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
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

  if (checkingAuth) {
    return (
      <View style={styles.loadingScreen}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Checking your session...</Text>
      </View>
    );
  }

  if (!token) {
    return (
      <View style={styles.authContainer}>
        <StatusBar style="light" />

        <ScrollView
          contentContainerStyle={styles.authScroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.authBrand}>
            <Text style={styles.eyebrow}>WILDLIFE CONSERVATION</Text>
            <Text style={styles.authTitle}>
              Endangered Species Tracker
            </Text>
            <Text style={styles.authSubtitle}>
              Sign in to securely manage endangered species records.
            </Text>
          </View>

          <View style={styles.authCard}>
            <Text style={styles.formTitle}>
              {authScreen === "login"
                ? "Welcome Back"
                : "Create Account"}
            </Text>

            {authScreen === "register" && (
              <TextInput
                style={styles.input}
                placeholder="Name"
                value={registerName}
                onChangeText={setRegisterName}
                autoCapitalize="words"
              />
            )}

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {authError ? (
              <Text style={styles.error}>{authError}</Text>
            ) : null}

            <Pressable
              style={styles.addButton}
              onPress={authScreen === "login" ? login : register}
            >
              <Text style={styles.addButtonText}>
                {authScreen === "login" ? "Sign In" : "Register"}
              </Text>
            </Pressable>

            <Pressable
              style={styles.switchButton}
              onPress={() => {
                setAuthError("");
                setAuthScreen(
                  authScreen === "login" ? "register" : "login"
                );
              }}
            >
              <Text style={styles.switchText}>
                {authScreen === "login"
                  ? "Need an account? Register"
                  : "Already have an account? Sign In"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

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
        <View style={styles.headerTop}>
          <Text style={styles.eyebrow}>WILDLIFE CONSERVATION</Text>

          <Pressable style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </Pressable>
        </View>

        <Text style={styles.title}>Endangered Species Tracker</Text>

        <Text style={styles.subtitle}>
          Authenticated access to protected wildlife records.
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
          <Text style={styles.count}>{species.length} tracked</Text>
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

  loadingScreen: {
    flex: 1,
    backgroundColor: "#071a13",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#ffffff",
    marginTop: 14,
    fontSize: 16,
  },

  authContainer: {
    flex: 1,
    backgroundColor: "#071a13",
  },

  authScroll: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  authBrand: {
    marginBottom: 28,
  },

  authTitle: {
    color: "#ffffff",
    fontSize: 36,
    fontWeight: "800",
    marginTop: 8,
  },

  authSubtitle: {
    color: "#c7ded1",
    fontSize: 16,
    lineHeight: 23,
    marginTop: 10,
  },

  authCard: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 22,
  },

  header: {
    backgroundColor: "#0d3324",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 32,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  logoutButton: {
    borderWidth: 1,
    borderColor: "#8dd7a9",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },

  logoutText: {
    color: "#ffffff",
    fontWeight: "700",
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

  switchButton: {
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 6,
  },

  switchText: {
    color: "#176b45",
    fontSize: 15,
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
    fontSize: 15,
    marginBottom: 12,
  },

  empty: {
    color: "#547565",
    fontSize: 16,
  },
});
