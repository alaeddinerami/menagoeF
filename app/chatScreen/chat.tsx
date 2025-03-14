import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { useState, useEffect } from "react"; // Added useEffect for logging
import { fetchChatHistory, sendChatMessage } from "~/redux/slices/chatSlice";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const ChatScreen = () => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state: RootState) => state.chat);
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [messageText, setMessageText] = useState("");

  const { cleaner } = useLocalSearchParams();
  const cleanerObject = typeof cleaner === "string" ? JSON.parse(decodeURIComponent(cleaner)) : null;

  const senderId = user?.user?._id; 
  const receiverId = cleanerObject?._id;

  useEffect(() => {
    if (senderId && receiverId) {
      dispatch(fetchChatHistory({ userId: senderId, otherUserId: receiverId }));
    }
  }, [senderId, receiverId, dispatch]);

  useEffect(() => {
    console.log("senderId:", senderId);
    console.log("receiverId:", receiverId);
  }, [senderId, receiverId]);

  // Handle sending the message
  const handleSendMessage = () => {
    if (messageText.trim() && senderId && receiverId) {
      dispatch(sendChatMessage({ senderId, receiverId, content: messageText }));
      setMessageText(""); // Clear input after sending
    }
  };

  const imageUrl = cleanerObject?.image
    ? `${BASE_URL}/${cleanerObject.image}`
    : "https://avatar.iran.liara.run/public";

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Image source={{ uri: imageUrl }} style={styles.avatarImage} />
          </View>
          <View>
            <Text style={styles.userName}>{cleanerObject?.name || "Unknown User"}</Text>
            <Text style={styles.userStatus}>Online</Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="ellipsis-vertical" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.chatContainer}>
        <ScrollView contentContainerStyle={styles.messagesList}>
          {loading ? (
            <Text>Loading messages...</Text>
          ) : messages.length > 0 ? (
            messages.map((msg) => (
              <View
                key={msg._id}
                style={msg.senderId === senderId ? styles.sentContainer : styles.receivedContainer}
              >
                <View style={msg.senderId === senderId ? styles.sentBubble : styles.receivedBubble}>
                  <Text style={styles.messageText}>{msg.content}</Text>
                  <View style={styles.messageFooter}>
                    <Text style={styles.messageTime}>
                      {new Date(msg.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                    {msg.senderId === senderId && (
                      <Ionicons
                        name={msg.isRead ? "checkmark-done" : "checkmark"}
                        size={16}
                        color={msg.isRead ? "#6366F1" : "#8696a0"}
                      />
                    )}
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text>No messages yet</Text>
          )}
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.textInputContainer}>
            <TouchableOpacity style={styles.inputIcon}>
              <Ionicons name="happy-outline" size={24} color="#8696a0" />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Message"
              multiline
              value={messageText}
              onChangeText={setMessageText}
            />
          </View>
          <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5ff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366F1",
    paddingVertical: 10,
    paddingHorizontal: 16,
    height: 60,
  },
  backButton: {
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    overflow: "hidden",
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userName: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  userStatus: {
    color: "#c7d2fe",
    fontSize: 12,
  },
  headerActions: {
    flexDirection: "row",
  },
  headerIcon: {
    marginLeft: 16,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "#f5f5ff",
  },
  messagesList: {
    padding: 16,
  },
  receivedContainer: {
    alignSelf: "flex-start",
    marginBottom: 8,
    maxWidth: "80%",
  },
  sentContainer: {
    alignSelf: "flex-end",
    marginBottom: 8,
    maxWidth: "80%",
  },
  receivedBubble: {
    backgroundColor: "white",
    borderRadius: 8,
    borderTopLeftRadius: 0,
    padding: 10,
    minWidth: 80,
  },
  sentBubble: {
    backgroundColor: "#e0e7ff",
    borderRadius: 8,
    borderTopRightRadius: 0,
    padding: 10,
    minWidth: 80,
  },
  messageText: {
    fontSize: 16,
    color: "#000",
  },
  messageFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
  },
  messageTime: {
    fontSize: 11,
    color: "#8696a0",
    marginRight: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#eef2ff",
  },
  textInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 24,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  inputIcon: {
    marginHorizontal: 4,
    padding: 4,
  },
  sendButton: {
    backgroundColor: "#6366F1",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatScreen;