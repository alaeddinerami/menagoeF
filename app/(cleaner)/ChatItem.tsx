import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const MOCK_CHATS = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    lastMessage: 'Hey, are we still meeting today?',
    timestamp: '10:30 AM',
    unread: 2,
  },
  {
    id: '2',
    name: 'Michael Chen',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    lastMessage: 'I sent you the documents you requested',
    timestamp: 'Yesterday',
    unread: 0,
  },
  {
    id: '3',
    name: 'Team Alpha',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    lastMessage: 'Alex: Let\'s discuss the new project tomorrow',
    timestamp: 'Yesterday',
    unread: 5,
  },
  {
    id: '4',
    name: 'David Wilson',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    lastMessage: 'Thanks for your help!',
    timestamp: 'Monday',
    unread: 0,
  },
  {
    id: '5',
    name: 'Emma Thompson',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    lastMessage: 'Can you send me the presentation?',
    timestamp: 'Monday',
    unread: 1,
  },
];

// Chat item component
const ChatItem = ({ chat, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.chatItem} 
      onPress={() => onPress(chat)}
      activeOpacity={0.7}
    >
      <Image source={{ uri: chat.avatar }} style={styles.avatar} />
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{chat.name}</Text>
          <Text style={styles.timestamp}>{chat.timestamp}</Text>
        </View>
        
        <View style={styles.chatFooter}>
          <Text 
            style={styles.lastMessage} 
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {chat.lastMessage}
          </Text>
          
          {chat.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{chat.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Main chat list screen
const ChatListScreen = () => {
  const navigation = useNavigation();
  const [chats, setChats] = useState(MOCK_CHATS);

  const handleChatPress = (chat) => {
    // Navigate to chat detail screen
    navigation.navigate('ChatDetail', { chatId: chat.id, name: chat.name });
    
    // Mark as read when navigating to chat
    setChats(prevChats => 
      prevChats.map(c => 
        c.id === chat.id ? { ...c, unread: 0 } : c
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity style={styles.newChatButton}>
          <Text style={styles.newChatButtonText}>New Chat</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatItem chat={item} onPress={handleChatPress} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  newChatButton: {
    backgroundColor: '#4361EE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  newChatButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  listContent: {
    paddingVertical: 8,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  timestamp: {
    fontSize: 12,
    color: '#6C757D',
  },
  chatFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#6C757D',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#4361EE',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ChatListScreen;