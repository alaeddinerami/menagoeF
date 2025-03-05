import { TextInput, TextInputProps } from "react-native";

interface InputFieldProps extends TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

export default function InputField({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
}: InputFieldProps) {
  return (
    <TextInput
      className="w-full p-4 mb-4 bg-gray-100 rounded-lg text-gray-800 border border-gray-300 focus:border-blue-500"
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={secureTextEntry}
      placeholderTextColor="#999"
    />
  );
}