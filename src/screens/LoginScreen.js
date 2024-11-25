import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password.");
      return;
    }

    setLoading(true);
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      Alert.alert("Success", "Logged in successfully!");
      navigation.navigate("Home"); 
    } catch (error) {
      setLoading(false);
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
      style={styles.container}
    >
      <View style={styles.box1}>
        <Text style={styles.text}>Welcome To FancyChat</Text>
        <Image
          style={styles.img}
          source={require("../../assets/whatsapp logo.png")}
        />
      </View>
      <View style={styles.box2}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>
            {loading ? "Logging In..." : "Log In"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={{ textAlign: "center", color: "green" }}>
            Don't have an account? Register
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 23,
    color: "green",
    textAlign: "center",
    marginBottom: 20,
  },
  img: {
    height: 200,
    width: 200,
  },
  box1: {
    alignItems: "center",
    marginTop: 50,
  },
  box2: {
    paddingHorizontal: 40,
    justifyContent: "space-evenly",
    height: "30%",
  },
  input: {
    borderWidth: 1,
    borderColor: "green",
    padding: 15,
    marginBottom: 15,
    borderRadius: 15,
  },
  button: {
    backgroundColor: "green",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
