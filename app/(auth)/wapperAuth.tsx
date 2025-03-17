import React from "react"
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native"
import { useRouter } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { LinearGradient } from "expo-linear-gradient"
import { Feather } from "@expo/vector-icons"
import { useEffect, useRef } from "react"

const COLORS = {
  primary: "#6366F1",
  white: "#FFFFFF",
  gradientStart: "#f8fafc",
  gradientMid: "#dbeafe",
  gradientEnd: "#dbeafe",
  indigoDark: "#3730a3",
  indigoLight: "#c7d2fe",
  indigoBorder: "#a5b4fc",
}

const AnimatedButton = ({ title, onPress, isPrimary = true }: { title: string; onPress: () => void; isPrimary?: boolean }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start()
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.button,
          isPrimary
            ? { backgroundColor: COLORS.primary }
            : { borderColor: COLORS.primary, borderWidth: 2, backgroundColor: COLORS.white },
        ]}
        activeOpacity={1}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <Text
          style={[
            styles.buttonText,
            isPrimary ? { color: COLORS.white } : { color: COLORS.primary },
          ]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default function IndexScreen() {
  const router = useRouter()
  const fadeAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  transform: [
                    {
                      scale: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Feather name="droplet" size={56} color={COLORS.primary} />
            </Animated.View>
            <Text style={styles.title}>Sparkle Clean</Text>
            <Text style={styles.subtitle}>
              Your trusted cleaning service partner
            </Text>
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
          </View>

          <View style={styles.buttonContainer}>
            <AnimatedButton
              title="Login"
              onPress={() => router.push("/(auth)/login")}
              isPrimary={true}
            />
            <AnimatedButton
              title="Sign Up"
              onPress={() => router.push("/(auth)/register")}
              isPrimary={false}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Making your home sparkle, one clean at a time
            </Text>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingVertical: 48,
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    backgroundColor: COLORS.white,
    padding: 24,
    borderRadius: 9999,
    shadowColor: COLORS.indigoDark,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: COLORS.indigoBorder,
    marginBottom: 24,
  },
  title: {
    fontSize: 52,
    fontWeight: "900",
    color: COLORS.indigoDark,
    letterSpacing: -1.5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 19,
    color: COLORS.indigoDark,
    opacity: 0.85,
    textAlign: "center",
    marginTop: 16,
    maxWidth: 320,
    fontWeight: "500",
    lineHeight: 24,
  },
  dividerContainer: {
    alignItems: "center",
    marginVertical: 28,
  },
  divider: {
    width: 90,
    height: 2,
    backgroundColor: COLORS.indigoLight,
    borderRadius: 9999,
  },
  buttonContainer: {
    width: "100%",
    gap: 18,
    marginBottom: 48,
  },
  button: {
    paddingVertical: 18,
    borderRadius: 14,
    shadowColor: COLORS.indigoDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  footer: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 15,
    color: COLORS.indigoDark,
    opacity: 0.75,
    textAlign: "center",
    maxWidth: 300,
    fontWeight: "500",
    lineHeight: 20,
  },
})