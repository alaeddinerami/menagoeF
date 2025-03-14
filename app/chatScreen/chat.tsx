import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"

const ChatScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Chat Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}
        onPress={()=>router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Image source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }} style={styles.avatarImage} />
          </View>
          <View>
            <Text style={styles.userName}>John Doe</Text>
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
          {/* Received Message */}
          <View style={styles.receivedContainer}>
            <View style={styles.receivedBubble}>
              <Text style={styles.messageText}>Hey there! How are you doing?</Text>
              <View style={styles.messageFooter}>
                <Text style={styles.messageTime}>10:00 AM</Text>
              </View>
            </View>
          </View>

          {/* Sent Message */}
          <View style={styles.sentContainer}>
            <View style={styles.sentBubble}>
              <Text style={styles.messageText}>I'm good, thanks for asking! How about you?</Text>
              <View style={styles.messageFooter}>
                <Text style={styles.messageTime}>10:02 AM</Text>
                <Ionicons name="checkmark-done" size={16} color="#6366F1" />
              </View>
            </View>
          </View>

          {/* Received Message */}
          <View style={styles.receivedContainer}>
            <View style={styles.receivedBubble}>
              <Text style={styles.messageText}>Doing well! Just working on some React Native code.</Text>
              <View style={styles.messageFooter}>
                <Text style={styles.messageTime}>10:05 AM</Text>
              </View>
            </View>
          </View>

          {/* Sent Message */}
          <View style={styles.sentContainer}>
            <View style={styles.sentBubble}>
              <Text style={styles.messageText}>That sounds interesting! What are you building?</Text>
              <View style={styles.messageFooter}>
                <Text style={styles.messageTime}>10:06 AM</Text>
                <Ionicons name="checkmark-done" size={16} color="#8696a0" />
              </View>
            </View>
          </View>

          {/* Received Message */}
          <View style={styles.receivedContainer}>
            <View style={styles.receivedBubble}>
              <Text style={styles.messageText}>A chat UI. It's coming along nicely!</Text>
              <View style={styles.messageFooter}>
                <Text style={styles.messageTime}>10:08 AM</Text>
              </View>
            </View>
          </View>

          {/* Sent Message with longer text */}
          <View style={styles.sentContainer}>
            <View style={styles.sentBubble}>
              <Text style={styles.messageText}>
                That's awesome! I've been working on something similar. This UI has a lot of nice design elements that
                make for a great user experience. The bubble chat interface is particularly well designed.
              </Text>
              <View style={styles.messageFooter}>
                <Text style={styles.messageTime}>10:10 AM</Text>
                <Ionicons name="checkmark" size={16} color="#8696a0" />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.textInputContainer}>
            <TouchableOpacity style={styles.inputIcon}>
              <Ionicons name="happy-outline" size={24} color="#8696a0" />
              </TouchableOpacity>

            <TextInput style={styles.input} placeholder="Message" multiline />
          </View>

          <TouchableOpacity style={styles.sendButton}>
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

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
    backgroundColor: "#e0e7ff", // Light indigo for sent bubbles
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
    backgroundColor: "#eef2ff", // Light indigo for input area
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
})

export default ChatScreen

