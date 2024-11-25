import { StyleSheet, View } from "react-native";
import React, { useState, useEffect } from "react";
import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import { firestore } from "../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

const ChatScreen = ({ route, navigation }) => {
  const [messages, setMessages] = useState([]);
  const user = route.params.user;
  const { uid } = route.params;

  useEffect(() => {
    if (!user || !uid) return; // Early return if user or uid is undefined

    const docId = uid > user.uid ? `${user.uid}-${uid}` : `${uid}-${user.uid}`;
    const messagesRef = collection(firestore, `chatrooms/${docId}/messages`);

    const q = query(messagesRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          _id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
        };
      });
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [uid, user]);

  const onSend = async (messagesArray) => {
    if (!user || !uid) return;

    const msg = messagesArray[0];
    const myMsg = {
      ...msg,
      sentBy: user.uid,
      sentTo: uid,
      createdAt: serverTimestamp(),
    };

    const docId = uid > user.uid ? `${user.uid}-${uid}` : `${uid}-${user.uid}`;
    const messagesRef = collection(firestore, `chatrooms/${docId}/messages`);
    await addDoc(messagesRef, myMsg);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: user.uid,
        }}
        renderBubble={(props) => {
          return (
            <Bubble
              {...props}
              wrapperStyle={{
                right: {
                  backgroundColor: "green",
                },
              }}
            />
          );
        }}
        renderInputToolbar={(props) => {
          return <InputToolbar {...props} containerStyle={{ borderTopWidth: 1, borderTopColor: "green" }} />;
        }}
      />
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({});
