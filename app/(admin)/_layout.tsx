import { Tabs } from "expo-router"
import { Animated, Dimensions, StyleSheet, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { Entypo, Ionicons } from "@expo/vector-icons"
import { useEffect, useRef } from "react"
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const { width } = Dimensions.get("window")

export default function TabLayout() {
  const insets = useSafeAreaInsets()

  const tabAnimations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ]

  const animateTab = (index: number) => {
    tabAnimations.forEach((anim, i) => {
      Animated.spring(anim, {
        toValue: i === index ? 1 : 0,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }).start()
    })
  }

  useEffect(() => {
    animateTab(0)
  }, [])
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          ...styles.tabBar,
          height: 60, 
          marginBottom: insets.bottom + 15, 
          marginHorizontal: 20,
          width: width - 40, 
          left: 20, 
        },
        tabBarActiveTintColor: "#6366F1",
        tabBarInactiveTintColor: "#94A3B8",
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
      }}
      screenListeners={({ route }) => ({
        focus: () => {
          const index = ["index", "chatItem", "profile"].indexOf(route.name)
          if (index !== -1) {
            animateTab(index)
          }
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Animated.View
                style={[
                  styles.iconBackground,
                  {
                    opacity: tabAnimations[0],
                    transform: [
                      {
                        scale: tabAnimations[0].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <Animated.View
                style={{
                  transform: [
                    {
                      translateY: tabAnimations[0].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -3], 
                      }),
                    },
                    {
                      scale: tabAnimations[0].interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.15], 
                      }),
                    },
                  ],
                }}
              >
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={22} 
                  color={color}
                />

              </Animated.View>
            </View>
          ),
        }}
      />
     
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.iconContainer}>
              <Animated.View
                style={[
                  styles.iconBackground,
                  {
                    opacity: tabAnimations[0],
                    transform: [
                      {
                        scale: tabAnimations[0].interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, 1],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <Animated.View
                style={{
                  transform: [
                    {
                      translateY: tabAnimations[0].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -3], 
                      }),
                    },
                    {
                      scale: tabAnimations[0].interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.15], 
                      }),
                    },
                  ],
                }}
              >
               
               <Entypo name="user" size={24} color={color} />

              </Animated.View>
            </View>
          ),
        }}
      />

    </Tabs>
  )
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 0,
    borderRadius: 25, 
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    paddingTop: 3, 
    paddingBottom: 8, 
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  tabBarLabel: {
    fontSize: 11, 
    fontWeight: "600",
    paddingBottom: 0, 
  },
  tabBarItem: {
    paddingTop: 0, 
  },
  iconContainer: {
    width: 36, 
    height: 36, 
    justifyContent: "center",
    alignItems: "center",
  },
  iconBackground: {
    position: "absolute",
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: "rgba(99, 102, 241, 0.1)",
  },
})

