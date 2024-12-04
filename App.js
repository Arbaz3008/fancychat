import { StatusBar } from "expo-status-bar";
import { StyleSheet, View , Text} from "react-native";
import SignupScreen from "./src/screens/SignupScreen";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ChatScreen from "./src/screens/ChatScreen";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { firestore } from "./firebase"; // Ensure you export correctly from firebase.js
import AccountScreen from "./src/screens/AccountScreen";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "green",
  },
};

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unregister = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Update user status in Firestore
        const userDoc = doc(firestore, "users", currentUser.uid);
        await updateDoc(userDoc, { status: "online" });
      }
    });

    return () => unregister(); // Cleanup listener
  }, []);

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userDoc = doc(firestore, "users", currentUser.uid);
        await updateDoc(userDoc, { status: serverTimestamp() });
      }
      await auth.signOut();
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error.message);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: "green",
        }}
      >
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              options={{
                headerRight: () => (
                  <MaterialIcons
                    name="account-circle"
                    size={24}
                    color="green"
                    style={{ marginRight: 10 }}
                    onPress={handleSignOut}
                  />
                ),
                title: "Fancy",
              }}
            >
              {(props) => <HomeScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen
  name="Chat"
  component={ChatScreen}
  options={({ route }) => ({
    headerTitle: () => (
      <View>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "black" }}>
          {route.params?.name}
        </Text>
        {route.params?.status && (
          <Text style={{ fontSize: 14, color: route.params.status === "online" ? "green" : "gray", marginTop: 2 }}>
            {route.params.status}
          </Text>
        )}
      </View>
    ),
  })}
  initialParams={{ user }}
/>

<Stack.Screen  name="Account" options={{ title: "Account" }} >
  {props => <AccountScreen   {...props} user={user}/>}
</Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignupScreen}
              options={{ headerShown: true }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <StatusBar barStyle="light-content" backgroundColor="green" />
      <View style={styles.container}>
        <Navigation />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
