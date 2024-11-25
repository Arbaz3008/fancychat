import { StyleSheet, Text, View, FlatList, Image , TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import { firestore } from "../../firebase"; // Correct import from firebase config
import { collection, getDocs, query, where } from "firebase/firestore"; // Required Firestore functions

const Home = ({ user , navigation }) => {
  const [users, setUsers] = useState([]); // Initialize with an empty array

  const getUsers = async () => {
    try {
      const q = query(collection(firestore, "users"), where("uid", "!=", user.uid));
      const querySnap = await getDocs(q); // Use correct Firestore API

      const allUsers = querySnap.docs.map((docSnap) => {
        const data = docSnap.data();
        //console.log("Fetched user data:", data); // Log fetched user data
        return {
          id: docSnap.id, // Ensure a unique key
          ...data,
        };
      });
      setUsers(allUsers); // Set the users state
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const RenderCard = ({ item }) => (
    <>
    <TouchableOpacity onPress={()=>navigation.navigate("Chat",{name:item.name , uid:item.uid ,  status :typeof(item.status) == "string"? item.status :
    item.status.toDate().toString()})}>
    <View style={styles.card}>
      {item.profilePic ? (
        <Image source={{ uri: item.profilePic }} style={styles.img} />
      ) : (
        <Image source={require("../../assets/whatsapp logo.png")} style={styles.img} />
      )}
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.email}>{item.email}</Text>
      </View>
    </View>
    </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={({ item }) => <RenderCard item={item} />}
        keyExtractor={(item) => item.id} // Use the unique Firestore document ID
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  card: {
    flexDirection: "row",
    padding: 4,
    backgroundColor: "white",
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 15,
  },
  email: {
    fontSize: 16,
    color: "#555",
    marginLeft: 15,
  },
  img: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: "green"
  }
});
