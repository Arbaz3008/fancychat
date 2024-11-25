import React, { useState } from "react";
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
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker"; 
import { auth, firestore } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [shownext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null); // For storing image URI

  const selectImage = async () => {
    // Request permission to access media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Please allow access to the media library.");
      return;
    }

    // Open image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
      base64: true, // Include Base64 data
    });

    if (!result.canceled) {
      setProfilePic(result.base64); // Store Base64 string
    }
  };

  const userSignup = async () => {
    setLoading(true);
    if (!email || !password || !name) {
      Alert.alert("Error", "Please fill in all fields.");
      setLoading(false);
      return;
    }
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Add user to Firestore, including profilePic
      await setDoc(doc(firestore, "users", result.user.uid), {
        name: name,
        email: result.user.email,
        uid: result.user.uid,
        profilePic: profilePic || "", // Save image or empty if not provided
        status:"online"
      });

      setLoading(false);
      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Login"); // Navigate to login screen after success
    } catch (err) {
      setLoading(false);
      Alert.alert("Error", err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={80}
      style={styles.container}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#00ff00" />
      ) : (
        <>
          <View style={styles.box1}>
            <Text style={styles.text}>Welcome To FancyWhatsapp</Text>
            <Image
              style={styles.img}
              source={require("../../assets/whatsapp logo.png")}
            />
          </View>
          <View style={styles.box2}>
            {!shownext ? (
              <>
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
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setShowNext(true)}
                >
                  <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TextInput
                  placeholder="Name"
                  value={name}
                  onChangeText={(text) => setName(text)}
                  style={styles.input}
                />
                {profilePic ? (
                  <Image
                    source={{ uri: `data:image/png;base64,${profilePic}` }}
                    style={{ width: 100, height: 100, alignSelf: "center", marginBottom: 10 }}
                  />
                ) : null}
                <TouchableOpacity
                  style={styles.button}
                  onPress={selectImage}
                >
                  <Text style={styles.buttonText}>
                    {profilePic ? "Change Profile Pic" : "Select Profile Pic"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={userSignup}>
                  <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={{ textAlign: "center", color: "green" }}>
                Already have an account?
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

export default SignupScreen;

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
