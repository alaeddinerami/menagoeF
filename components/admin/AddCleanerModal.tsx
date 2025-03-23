import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "~/redux/store"; // Adjust path

interface AddCleanerModalProps {
  visible: boolean;
  onClose: () => void;
}

// Define the Cleaner type based on your schema
interface Cleaner {
  name: string;
  email: string;
  password: string;
  location: string;
  phone: string;
  image?: string;
  service?: string; 
}

export const AddCleanerModal = ({ visible, onClose }: AddCleanerModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [phone, setPhone] = useState("");
  const [image, setImage] = useState("");
  const [service, setService] = useState("");

  const handleSubmit = () => {
    if (!name || !email || !password || !location || !phone) {
      alert("Please fill in all required fields.");
      return;
    }

    const newCleaner: Cleaner = {
      name,
      email,
      password,
      location,
      phone,
      image: image || undefined,
      service: service || undefined,
    };

    dispatch(addCleaner(newCleaner))
      .unwrap()
      .then(() => {
        resetForm();
        onClose();
      })
      .catch((error) => {
        console.error("Failed to add cleaner:", error);
        alert("Failed to add cleaner. Please try again.");
      });
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setLocation("");
    setPhone("");
    setImage("");
    setService("");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalContainer}
      >
        <View className="bg-white rounded-2xl p-6 w-11/12 max-w-md shadow-lg">
          <Text className="text-2xl font-bold text-indigo-600 mb-4 text-center">
            Add New Cleaner
          </Text>

          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4 text-gray-900"
            placeholder="Name"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />

          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4 text-gray-900"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4 text-gray-900"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4 text-gray-900"
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
            autoCapitalize="words"
          />

          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4 text-gray-900"
            placeholder="Phone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4 text-gray-900"
            placeholder="Image URL (optional)"
            value={image}
            onChangeText={setImage}
            autoCapitalize="none"
          />

          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-6 text-gray-900"
            placeholder="Service (optional)"
            value={service}
            onChangeText={setService}
            autoCapitalize="sentences"
          />

          <View className="flex-row justify-between">
            <TouchableOpacity
              className="bg-gray-300 rounded-lg py-3 px-6"
              onPress={onClose}
            >
              <Text className="text-gray-800 font-semibold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-indigo-600 rounded-lg py-3 px-6"
              onPress={handleSubmit}
            >
              <Text className="text-white font-semibold">Add Cleaner</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});