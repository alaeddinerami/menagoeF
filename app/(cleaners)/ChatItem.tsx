import React, { useEffect } from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import store, { RootState } from '~/redux/store';
import { fetchUserChats } from '~/redux/slices/chatListSlice';
import { router } from 'expo-router';

const ChatItem = ({ chat, onPress }: { chat: any; onPress: (chat: any) => void }) => {
  return (
    <TouchableOpacity 
      style={styles.chatItem} 
      activeOpacity={0.7}
      onPress={() => onPress(chat)} 
    >
      <Image source={{ uri: chat.otherUser.image }} style={styles.avatar} />
      
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{chat.otherUser.name}</Text>
          <Text style={styles.timestamp}>
            {new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
        
        <View style={styles.chatFooter}>
          <Text 
            style={styles.lastMessage} 
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {chat.lastMessage || 'No messages yet'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ChatListScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch<typeof store.dispatch>();
  const { chats, loading, error } = useSelector((state: RootState) => state.chatList);
  const { user } = useSelector((state: RootState) => state.auth);
  const userId = user?.user?._id || 'nedd id'; 

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserChats(userId));
    }
  }, [dispatch, userId]);

  const handleChatPress = (chat: any) => {
    console.log('Navigating to chat with:', { 
      chatId: chat.chatId, 
      otherUser: chat.otherUser 
    });
    
    const cleanerData = encodeURIComponent(JSON.stringify({
      _id: chat.otherUser.id,
      name: chat.otherUser.name,
      image: chat.otherUser.image,
    }));

    router.push({
      pathname: '/chatScreen/chat',
      params: { 
        cleaner: cleanerData,
        chatId: chat.chatId, 
      },
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading chats...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View className='bg-indigo-500' style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
      </View>
      
      <FlatList
        data={chats}
        keyExtractor={(item) => item.chatId}
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffff',
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
  loadingText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#212529',
  },
  errorText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#DC3545',
  },
});

export default ChatListScreen;