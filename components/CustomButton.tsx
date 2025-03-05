import { TouchableOpacity, Text, TouchableOpacityProps } from "react-native";

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  style?: string;
  disabled?: boolean;
}

export default function CustomButton({
  title,
  onPress,
  style,
  disabled,
}: CustomButtonProps) {
  return (
    <TouchableOpacity
      className={`w-full p-4 rounded-lg ${style}`}
      onPress={onPress}
      disabled={disabled}
    >
      <Text className="text-white text-center text-lg font-semibold">{title}</Text>
    </TouchableOpacity>
  );
}