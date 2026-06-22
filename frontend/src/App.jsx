import React, { useState, useRef, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import { UserMessage, AgentMessage, SystemMessage } from './components/Message'
import { sendMessage } from './hooks/useApi'
import { HCP } from './config'

const WELCOME = "Hi! I'm your SuperAgent for today's call with Dr. Raj. His oncology profile is loaded — 40+ patients/week, strong interest in immunotherapy. FDA 21 CFR Part 11 compliance guardrails are active. What do you need?"

export default function App() {
  const [messages, setMessages] = useState([
    { id: 0, type: 'system', text: WELCOME }
  ])
  const [apiMessages, setApiMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeSkill, setActiveSkill] = useState(null)
  const [tokenCount, setTokenCount] = useState(0)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async (text) => {
    const userText = (text || input).trim()
    if (!userText || loading) return

    setInput('')
    setError(null)

    const userMsg = { id: Date.now(), type: 'user', text: userText }
    setMessages(prev => [...prev, userMsg])

    const newApiMessages = [...apiMessages, { role: 'user', content: userText }]
    setApiMessages(newApiMessages)
    setLoading(true)

    try {
      const result = await sendMessage(newApiMessages)
      const data = result.data

      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'agent', data }])
      setApiMessages(prev => [...prev, {
        role: 'assistant',
        content: JSON.stringify(data)
      }])

      if (data.skill) setActiveSkill(data.skill)
      if (result.usage) {
        setTokenCount(prev => prev + result.usage.input_tokens + result.usage.output_tokens)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={styles.root}>
      <Sidebar
        activeSkill={activeSkill}
        onQuickPrompt={handleSend}
        tokenCount={tokenCount}
      />

      <div style={styles.main}>
        <div style={styles.topBar}>
          <div style={styles.hcpInfo}>
            <div style={styles.hcpAvatar}>{HCP.initials}</div>
            <div>
              <div style={styles.hcpName}>{HCP.name}</div>
              <div style={styles.hcpSpec}>{HCP.specialty} · {HCP.hospital} · {HCP.city}</div>
            </div>
          </div>
          <div style={styles.headerBadges}>
  <div style={styles.demoBadge}>
    Demo
  </div>

  <div style={styles.complianceBadge}>
    FDA 21 CFR Part 11 active
  </div>
</div>
        </div>

        <div style={styles.messages}>
          {messages.map(msg => {
            if (msg.type === 'system') return <SystemMessage key={msg.id} text={msg.text} />
            if (msg.type === 'user') return <UserMessage key={msg.id} text={msg.text} />
            if (msg.type === 'agent') return <AgentMessage key={msg.id} data={msg.data} />
            return null
          })}

          {loading && <AgentMessage isStreaming />}

          {error && (
            <div style={styles.errorBar}>
               {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div style={styles.inputArea}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => {
              setInput(e.target.value)
              e.target.style.height = 'auto'
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about this HCP call..."
            rows={1}
            style={styles.textarea}
            disabled={loading}
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            style={{
              ...styles.sendBtn,
              opacity: loading || !input.trim() ? 0.4 : 1,
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  root: {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    background: 'var(--bg)',
  },
  topBar: {
    padding: '12px 20px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
    background: 'var(--bg-surface)',
  },
  hcpInfo: { display: 'flex', alignItems: 'center', gap: 11 },
  hcpAvatar: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    background: 'var(--accent-blue-bg)',
    border: '1px solid var(--accent-blue-dim)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--accent-blue)',
    flexShrink: 0,
  },
  hcpName: { fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' },
  hcpSpec: { fontSize: 11.5, color: 'var(--text-secondary)' },
  headerBadges: {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
},

demoBadge: {
  fontSize: 11,
  padding: '4px 11px',
  borderRadius: 99,
  background: 'rgba(245,158,11,0.08)',
  border: '1px solid rgba(245,158,11,0.25)',
  color: '#f59e0b',
  cursor: 'pointer',
},
  complianceBadge: {
    fontSize: 11,
    padding: '4px 11px',
    borderRadius: 99,
    background: 'var(--accent-teal-bg)',
    border: '1px solid rgba(14,184,132,0.25)',
    color: 'var(--accent-teal)',
  },
  messages: {
    flex: 1,
    overflow: 'auto',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  inputArea: {
    padding: '12px 20px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    gap: 10,
    alignItems: 'flex-end',
    flexShrink: 0,
    background: 'var(--bg-surface)',
  },
  textarea: {
    flex: 1,
    padding: '9px 13px',
    fontSize: 13,
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-light)',
    background: 'var(--bg-card)',
    color: 'var(--text-primary)',
    resize: 'none',
    minHeight: 38,
    maxHeight: 120,
    lineHeight: 1.55,
    outline: 'none',
    transition: 'border-color 0.15s',
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border-light)',
    background: 'var(--accent-teal)',
    color: '#fff',
    fontSize: 16,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'opacity 0.15s',
  },
  errorBar: {
    padding: '10px 14px',
    borderRadius: 'var(--radius-md)',
    background: 'rgba(240,107,138,0.08)',
    border: '1px solid rgba(240,107,138,0.25)',
    color: 'var(--accent-rose)',
    fontSize: 12,
  },
}
