import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ActivityIndicator } from 'react-native-paper';
import { firestore } from "../../firebase";
import Feather from 'react-native-vector-icons/Feather';
import { getAuth } from "firebase/auth";

const AccountScreen = ({ user }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching profile:", error.message);
      }
    };

    fetchProfile();
  }, [user]);

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

  if (!profile) {
    return <ActivityIndicator size="large" color='#00ff00' />;
  }

  return (
    <View style={styles.container}>
      <Image style={styles.img} source={{ uri: profile.pic }} />
      <Text style={styles.detail}>Name: {profile.name}</Text>
      <View style={styles.row}>
        <Feather name='mail' size={30} color="white" />
        <Text style={[styles.detail, styles.emailText]}>Email: {profile.email}</Text>
      </View>
      <TouchableOpacity 
        style={styles.button}
        onPress={handleSignOut}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  detail: {
    fontSize: 18,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  emailText: {
    marginLeft: 10,
  },
  img: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: 'green',
    marginBottom: 20,
  },
  button: {
    backgroundColor: "green",
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
    width: '100%',
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
