import { useState, useEffect, useRef } from 'react'

const GROQ_API_KEY = import.meta.env.VITE_GEMINI_API_KEY // Using same env var name
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

// Debug: Check if API key is loaded
console.log('Groq API Key loaded:', GROQ_API_KEY ? 'Yes (length: ' + GROQ_API_KEY.length + ')' : 'No - MISSING!')

// Helper function to get region based on coordinates
const getRegion = (country) => {
  const { lat, lng } = country
  if (lat > 35 && lng > -10 && lng < 50) return 'Europe'
  if (lat > 15 && lat < 35 && lng > -20 && lng < 60) return 'North Africa or Middle East'
  if (lat < 15 && lat > -35 && lng > -20 && lng < 55) return 'Sub-Saharan Africa'
  if (lat > 10 && lng > 60 && lng < 150) return 'Asia'
  if (lat < -10 && lng > 110 && lng < 180) return 'Oceania'
  if (lng < -30 && lng > -120 && lat > 15) return 'North America'
  if (lng < -30 && lng > -85 && lat < 15 && lat > -60) return 'South or Central America'
  return 'a unique part of the world'
}

const getHemisphere = (country) => {
  return country.lat >= 0 ? 'Northern Hemisphere' : 'Southern Hemisphere'
}

// Call Groq API with the user's question
const callGroqAPI = async (country, question) => {
  console.log('Calling Groq API with question:', question)

  const region = getRegion(country)
  const hemisphere = getHemisphere(country)

  const systemPrompt = `You are an intel assistant in a geography guessing game. A player is trying to guess a secret country and has asked you a question.

CRITICAL RULES - FOLLOW STRICTLY:
1. NEVER EVER mention the country's name or any city names from that country
2. For currency questions: Say the currency TYPE (dinar, dollar, peso, pound, etc.) but NEVER add the country name
   - ✅ CORRECT: "The currency here is the dinar"
   - ❌ WRONG: "The currency is the Tunisian dinar" or "Brunei dollar"
3. mention specific landmarks, monuments, or famous places by name
4. Provide helpful answers but keep them SHORT (1-2 sentences max)
5. For single-word questions, give useful info without revealing identity
6. Be vague but helpful - describe characteristics, not specific identifiers

CONTEXT ABOUT THE SECRET LOCATION:
- Coordinates: ${country.lat.toFixed(2)}°, ${country.lng.toFixed(2)}°
- Region: ${region}
- Hemisphere: ${hemisphere}

EXAMPLES OF GOOD ANSWERS:
- Question: "money" → "The currency here is the dinar, reflecting a stable economy."
- Question: "language" → "The primary language arabic."
- Question: "religion" → "The most religion there is islam."


EXAMPLES OF BAD ANSWERS (NEVER DO THIS):
- "The Tunisian dinar is used here" ❌
- "They speak Arabic in Egypt" ❌
- "The Eiffel Tower is located here" ❌

Keep answers SHORT (1-2 sentences) and NEVER reveal the country name!`

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: question
          }
        ],
        temperature: 0.7,
        max_tokens: 120
      })
    })

    console.log('API Response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Error Response:', errorText)
      throw new Error(`API request failed: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    console.log('API Response data:', data)
    return data.choices[0].message.content
  } catch (error) {
    console.error('Groq API Error:', error)
    console.error('Error details:', error.message)
    throw error
  }
}

function ChatBot({ country }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Reset chat when country changes
    setMessages([
      {
        id: Date.now(),
        type: 'bot',
        text: "👋 Hello! I'm your AI intel assistant. Ask me anything about the target location - even single words like 'money', 'language', or 'food'. I'll give you comprehensive answers without revealing the name!",
      },
    ])
  }, [country])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const aiResponse = await callGroqAPI(country, input)

      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: aiResponse,
      }

      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      const errorResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: "⚠️ Sorry, I'm having trouble connecting to my intel network. Please try again in a moment.",
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chatbot">
      <button className="chatbot-toggle" onClick={() => setIsExpanded(!isExpanded)}>
        <span>💬 Intel Assistant</span>
        <span className="chatbot-toggle-icon">{isExpanded ? '−' : '+'}</span>
      </button>

      {isExpanded && (
        <div className="chatbot-panel">
          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chatbot-message chatbot-message--${msg.type}`}>
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div className="chatbot-message chatbot-message--bot chatbot-message--loading">
                <span className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form className="chatbot-form" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything: money, language, food..."
              className="chatbot-input"
              disabled={isLoading}
            />
            <button type="submit" className="chatbot-send" disabled={isLoading}>
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default ChatBot
