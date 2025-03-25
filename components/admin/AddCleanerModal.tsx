import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import { AppDispatch, RootState } from '~/redux/store';
import { createCleaner } from '~/redux/slices/cleanersSlice';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

interface AddCleanerModalProps {
  visible: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  location: string;
  phone: string;
}

export const AddCleanerModal: React.FC<AddCleanerModalProps> = ({ visible, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.cleaners);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    location: '',
    phone: '',
  });
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const requiredFields: (keyof FormData)[] = ['name', 'email', 'password', 'location', 'phone'];
    if (requiredFields.some((field) => !formData[field])) {
      alert('Please fill in all required fields.');
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value) data.append(key, value);
    });

    if (image) {
      data.append('image', {
        uri: image,
        type: 'image/jpeg',
        name: `cleaner_${Date.now()}.jpg`,
      } as any);
    }

    try {
      await dispatch(createCleaner(data)).unwrap();
      onClose();
    } catch (err) {
      alert(error || 'Failed to add cleaner. Please try again.');
    }
  };

  

  const inputFields = [
    { key: 'name', placeholder: 'Name', autoCapitalize: 'words' as const },
    {
      key: 'email',
      placeholder: 'Email',
      keyboardType: 'email-address' as const,
      autoCapitalize: 'none' as const,
    },
    {
      key: 'password',
      placeholder: 'Password',
      secureTextEntry: true,
      autoCapitalize: 'none' as const,
    },
    { key: 'location', placeholder: 'Location', autoCapitalize: 'words' as const },
    { key: 'phone', placeholder: 'Phone', keyboardType: 'phone-pad' as const },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Add New Cleaner</Text>

          {inputFields.map(({ key, ...props }) => (
            <TextInput
              key={key}
              style={styles.input}
              value={formData[key as keyof FormData]}
              onChangeText={(text) => setFormData({ ...formData, [key]: text })}
              editable={!loading}
              {...props}
            />
          ))}

          <TouchableOpacity style={styles.imageButton} onPress={pickImage} disabled={loading}>
            <Text style={styles.imageButtonText}>{image ? 'Change Image' : 'Pick an Image'}</Text>
          </TouchableOpacity>

          {image && <Image source={{ uri: image }} style={styles.previewImage} />}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.cancelButton,]} onPress={onClose} disabled={loading}>
              <Text style={styles.buttonText}>Cancel</Text>
              <MaterialIcons name="cancel" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}>
              <Text style={styles.submitButtonText}>{loading ? 'Adding...' : 'Add Cleaner'}</Text>
              <AntDesign name="checkcircle" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#111827',
  },
  imageButton: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#F3F4F6',
    marginBottom: 12,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#111827',
    fontSize: 16,
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
    alignSelf: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    marginRight: 8,
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row-reverse',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row-reverse',
   
  },
  disabledButton: {
    backgroundColor: '#93C5FD',
    opacity: 0.7,
  },
  buttonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 14,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  errorText: {
    color: '#EF4444',
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
  },
});
