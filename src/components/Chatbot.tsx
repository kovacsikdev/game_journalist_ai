'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styles from './Chatbot.module.css'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  isStreaming?: boolean
  displayedLines?: number
}

interface ChatbotProps {
  onMenuToggle: () => void
}

const Chatbot = ({ onMenuToggle }: ChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your Video Game Journalist AI assistant. Ask me anything about games! Use the following example prompts to get started:\n\n1. What are the best games of 2024?\n2. Tell me about the latest gaming news\n3. What are the most anticipated upcoming games?\n4. Compare different gaming consoles\n5. What are the best indie games?',
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Create bot message that will be updated with streaming text
    const botMessageId = (Date.now() + 1).toString()
    const botMessage: Message = {
      id: botMessageId,
      text: '',
      sender: 'bot',
      timestamp: new Date(),
      isStreaming: true,
      displayedLines: 0
    }

    setMessages(prev => [...prev, botMessage])
    setIsLoading(false)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let accumulatedText = ''

      if (!reader) {
        throw new Error('No reader available')
      }

      // Read the stream
      while (true) {
        const { done, value } = await reader.read()
        
        if (done) {
          break
        }

        // Decode the chunk
        const chunk = decoder.decode(value, { stream: true })
        
        // Parse Server-Sent Events format
        const lines = chunk.split('\n')
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.text) {
                accumulatedText += data.text
                
                // Update the message with accumulated text
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === botMessageId 
                      ? { 
                          ...msg, 
                          text: accumulatedText,
                          displayedLines: accumulatedText.split('\n').length
                        }
                      : msg
                  )
                )
              }
            } catch (parseError) {
              console.error('Error parsing chunk:', parseError)
            }
          }
        }
      }

      // Mark streaming as complete
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMessageId 
            ? { ...msg, isStreaming: false }
            : msg
        )
      )

    } catch (error) {
      console.error('Error sending message:', error)
      
      // Remove the empty bot message and add error message
      setMessages(prev => prev.filter(msg => msg.id !== botMessageId))
      
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: 'Sorry, there was an error processing your request.',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      setIsLoading(false)
    }
  }

  const fillInput = (text: string) => {
    setInput(text)
  }

  // Expose fillInput to parent via custom event
  useEffect(() => {
    const handleFillInput = (e: CustomEvent) => {
      fillInput(e.detail)
    }
    window.addEventListener('fillChatInput' as any, handleFillInput as any)
    return () => {
      window.removeEventListener('fillChatInput' as any, handleFillInput as any)
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.menuButton}
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <div className={styles.hamburger}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
        <h1 className={styles.title}>Video Game Journalist AI</h1>
      </div>

      <div className={styles.messagesContainer}>
        {messages.map((message) => {
          return (
            <div
              key={message.id}
              className={`${styles.message} ${
                message.sender === 'user' ? styles.userMessage : styles.botMessage
              }`}
            >
              <div className={styles.messageContent}>
                <div className={styles.markdownContent}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {message.text}
                  </ReactMarkdown>
                </div>
                {message.isStreaming && (
                  <span className={styles.streamingIndicator}>●</span>
                )}
                <span className={styles.timestamp}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          )
        })}
        {isLoading && (
          <div className={`${styles.message} ${styles.botMessage}`}>
            <div className={styles.messageContent}>
              <div className={styles.typing}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className={styles.inputForm} onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me about games..."
          className={styles.input}
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className={styles.sendButton}
          disabled={isLoading || !input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default Chatbot
