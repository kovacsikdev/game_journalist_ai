'use client'

import { useState, useEffect } from 'react'
import styles from './HamburgerMenu.module.css'

interface PrefilledQuestion {
  id: string
  text: string
}

interface HamburgerMenuProps {
  isOpen: boolean
  onClose: () => void
}

const DEFAULT_QUESTIONS: PrefilledQuestion[] = [
  { id: '1', text: 'What are the best games of 2025?' },
  { id: '2', text: 'Tell me about the latest gaming news' },
  { id: '3', text: 'What are the most anticipated upcoming games?' },
  { id: '4', text: 'Compare different gaming consoles' },
  { id: '5', text: 'What are the best indie games?' },
]

const HamburgerMenu = ({ isOpen, onClose }: HamburgerMenuProps) => {
  const [questions, setQuestions] = useState<PrefilledQuestion[]>(DEFAULT_QUESTIONS)
  const [newQuestion, setNewQuestion] = useState('')
  const [isAddingQuestion, setIsAddingQuestion] = useState(false)

  // Load custom questions from localStorage on mount
  useEffect(() => {
    const savedQuestions = localStorage.getItem('customQuestions')
    if (savedQuestions) {
      try {
        const parsed = JSON.parse(savedQuestions)
        setQuestions([...DEFAULT_QUESTIONS, ...parsed])
      } catch (error) {
        console.error('Error loading custom questions:', error)
      }
    }
  }, [])

  // Save custom questions to localStorage (excluding defaults)
  const saveCustomQuestions = (allQuestions: PrefilledQuestion[]) => {
    const customQuestions = allQuestions.slice(DEFAULT_QUESTIONS.length)
    localStorage.setItem('customQuestions', JSON.stringify(customQuestions))
  }

  const handleQuestionClick = (text: string) => {
    // Dispatch custom event to fill the chat input
    window.dispatchEvent(new CustomEvent('fillChatInput', { detail: text }))
    onClose()
  }

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return

    const newQuestionObj: PrefilledQuestion = {
      id: Date.now().toString(),
      text: newQuestion.trim()
    }

    const updatedQuestions = [...questions, newQuestionObj]
    setQuestions(updatedQuestions)
    saveCustomQuestions(updatedQuestions)
    setNewQuestion('')
    setIsAddingQuestion(false)
  }

  const handleDeleteQuestion = (id: string) => {
    // Don't allow deleting default questions
    const questionIndex = questions.findIndex(q => q.id === id)
    if (questionIndex < DEFAULT_QUESTIONS.length) return

    const updatedQuestions = questions.filter(q => q.id !== id)
    setQuestions(updatedQuestions)
    saveCustomQuestions(updatedQuestions)
  }

  const isDefaultQuestion = (id: string) => {
    return DEFAULT_QUESTIONS.some(q => q.id === id)
  }

  if (!isOpen) return null

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.menu}>
        <div className={styles.header}>
          <h2 className={styles.title}>Quick Questions</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.questionsList}>
            {questions.map((question) => (
              <div key={question.id} className={styles.questionItem}>
                <button
                  className={styles.questionButton}
                  onClick={() => handleQuestionClick(question.text)}
                >
                  {question.text}
                </button>
                {!isDefaultQuestion(question.id) && (
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDeleteQuestion(question.id)}
                    aria-label="Delete question"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {isAddingQuestion ? (
            <div className={styles.addQuestionForm}>
              <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="Enter your custom question..."
                className={styles.input}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddQuestion()
                  } else if (e.key === 'Escape') {
                    setIsAddingQuestion(false)
                    setNewQuestion('')
                  }
                }}
              />
              <div className={styles.formButtons}>
                <button
                  className={styles.saveButton}
                  onClick={handleAddQuestion}
                  disabled={!newQuestion.trim()}
                >
                  Save
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => {
                    setIsAddingQuestion(false)
                    setNewQuestion('')
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              className={styles.addButton}
              onClick={() => setIsAddingQuestion(true)}
            >
              + Add Custom Question
            </button>
          )}
        </div>
      </div>
    </>
  )
}

export default HamburgerMenu
