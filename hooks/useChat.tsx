import { useState } from "react"

interface Message {
  id: number
  text: string
  time: string
  isSent: boolean
  readStatus?: "sent" | "read"
}

interface ChatHook {
  messages: Message[]
  message: string
  setMessage: (text: string) => void
  sendMessage: () => void
}

export default function useChat(): ChatHook {
  const [message, setMessage] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hey there! How are you doing?", time: "10:00 AM", isSent: false },
    { id: 2, text: "I'm good, thanks for asking! How about you?", time: "10:02 AM", isSent: true, readStatus: "read" },
    { id: 3, text: "Doing well! Just working on some React Native code.", time: "10:05 AM", isSent: false },
    { id: 4, text: "That sounds interesting! What are you building?", time: "10:06 AM", isSent: true, readStatus: "sent" },
    { id: 5, text: "A chat UI. It's coming along nicely!", time: "10:08 AM", isSent: false },
    { id: 6, text: "That's awesome! I've been working on something similar.", time: "10:10 AM", isSent: true, readStatus: "sent" },
  ])

  const sendMessage = () => {
    if (!message.trim()) return
    
    const newMessage: Message = {
      id: messages.length + 1,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
      readStatus: "sent"
    }
    setMessages([...messages, newMessage])
    setMessage("")
  }

  return { messages, message, setMessage, sendMessage }
}