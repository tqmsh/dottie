"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Send } from "lucide-react"

type Message = {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

type ChatModalProps = {
  isOpen: boolean
  onClose: () => void
  userData?: {
    age?: string
    cycleLength?: string
    periodDuration?: string
    flowHeaviness?: string
    painLevel?: string
    symptoms?: string[]
  }
}

export function ChatModal({ isOpen, onClose, userData }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hi there! I'm Dottie, your menstrual health assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate AI thinking with a delay
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputValue, userData)
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: aiResponse,
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  const generateAIResponse = (userInput: string, userData?: any): string => {
    const userInputLower = userInput.toLowerCase()

    // Check for cycle length related questions
    if (userInputLower.includes("cycle") || userInputLower.includes("how long")) {
      return `Based on your assessment, your cycle length is ${userData?.cycleLength || "within normal range"}. A typical menstrual cycle can range from 21 to 35 days. If your cycle is regular, you can better predict when your next period will start.`
    }

    // Check for period duration related questions
    if (
      userInputLower.includes("period") &&
      (userInputLower.includes("last") || userInputLower.includes("long") || userInputLower.includes("duration"))
    ) {
      return `Your period typically lasts ${userData?.periodDuration || "a few days"}. Most periods last between 3-7 days. If your period consistently lasts longer than 7 days, it might be worth discussing with a healthcare provider.`
    }

    // Check for pain related questions
    if (userInputLower.includes("pain") || userInputLower.includes("cramp")) {
      return `You've reported ${userData?.painLevel || "moderate"} menstrual pain. Some cramping during your period is normal due to uterine contractions. For relief, you might try a heating pad, over-the-counter pain relievers, gentle exercise, or relaxation techniques. If your pain is severe, please consult a healthcare provider.`
    }

    // Check for flow heaviness related questions
    if (userInputLower.includes("flow") || userInputLower.includes("heavy") || userInputLower.includes("bleeding")) {
      return `Your flow heaviness is ${userData?.flowHeaviness || "moderate"}. Flow often varies throughout your period, typically starting lighter, becoming heavier in the middle, and ending with lighter flow. If you're soaking through protection every hour for several consecutive hours, that's considered heavy bleeding and worth discussing with a healthcare provider.`
    }

    // Check for symptom related questions
    if (userInputLower.includes("symptom") || userInputLower.includes("pms")) {
      const symptomsText = userData?.symptoms?.length
        ? `You've reported experiencing ${userData.symptoms.join(", ")}. `
        : "You've reported several common menstrual symptoms. "

      return `${symptomsText}Many people experience physical and emotional symptoms before and during their period due to hormonal changes. Tracking these symptoms can help you prepare for them. Regular exercise, adequate sleep, and a balanced diet may help manage these symptoms.`
    }

    // Check for irregularity questions
    if (userInputLower.includes("irregular") || userInputLower.includes("late") || userInputLower.includes("miss")) {
      return `Some cycle irregularity is normal, especially during adolescence or approaching menopause. Stress, significant weight changes, excessive exercise, and certain medical conditions can also affect cycle regularity. If you're concerned about irregular periods, tracking your cycle can help identify patterns, and consulting with a healthcare provider can help determine if there's an underlying cause.`
    }

    // Default response for other questions
    return `Thank you for your question. Based on your assessment results, your menstrual cycle appears to be developing normally. Remember that everyone's body is different, and what's "normal" varies from person to person. If you have specific concerns about your menstrual health, I recommend discussing them with a healthcare provider.`
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md h-[80vh] flex flex-col bg-white rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Image src="/chatb.png" alt="Dottie Logo" width={32} height={32} />
            <span className="font-semibold text-pink-500">Ask Dottie</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user" ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex gap-2"
          >
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question here..."
              className="flex-1"
            />
            <Button
              type="submit"
              size="icon"
              disabled={!inputValue.trim()}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  )
}