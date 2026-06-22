import React, { useState } from 'react'
import { SKILLS } from '../config'

export function UserMessage({ text }) {
  return (
    <div style={styles.userRow}>
      <div style={styles.userAvatar}>RR</div>
      <div style={styles.userBubble}>{text}</div>
    </div>
  )
}

export function AgentMessage({ data, isStreaming }) {
  const [reasoningOpen, setReasoningOpen] = useState(false)
  const [crmLogged, setCrmLogged] = useState(false)

  const skill = data?.skill
  const meta = skill ? SKILLS[skill] : null

  if (isStreaming) {
    return (
      <div style={styles.agentRow}>
        <div style={styles.agentAvatar}>SA</div>
        <div style={styles.agentBody}>
          <div style={styles.typingIndicator}>
            <span style={styles.dot} />
            <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
            <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
          </div>
        </div>
      </div>
    )
  }

  if (!data) return null

  return (
    <div style={styles.agentRow}>
      <div style={styles.agentAvatar}>SA</div>
      <div style={styles.agentBody}>
        {meta && (
          <div style={{ ...styles.skillTag, background: meta.bg, border: `1px solid ${meta.border}`, color: meta.color }}>
            <span style={{ fontSize: 11 }}>{meta.icon}</span>
            <span>{skill.toLowerCase()}</span>
          </div>
        )}

{data.reasoning && (
  <div style={styles.reasoningBlock}>
    <button
      style={styles.reasoningHeader}
      onClick={() => setReasoningOpen(o => !o)}
    >
      <span style={{ fontWeight: 600 }}>Decision Trace</span>

      <span
        style={{
          marginLeft: 'auto',
          fontSize: 10,
          opacity: 0.6
        }}
      >
        {reasoningOpen ? '▲' : '▼'}
      </span>
    </button>

    {reasoningOpen && (
      <div style={styles.reasoningBody}>
        {data.reasoning}
      </div>
    )}
  </div>
)}

        <div style={styles.agentBubble}>{data.response}</div>

        {data.compliance_flag && (
          <div style={styles.complianceBlock}>
            <span></span>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>Compliance Flag</div>
              <div style={{ opacity: 0.85 }}>{data.compliance_flag}</div>
            </div>
          </div>
        )}

        {data.crm_action && (
          <div style={styles.crmBlock}>
            <span>🗄️</span>
            <span style={{ flex: 1 }}>{data.crm_action}</span>
            <button
              style={{ ...styles.crmBtn, ...(crmLogged ? styles.crmBtnLogged : {}) }}
              onClick={() => setCrmLogged(true)}
              disabled={crmLogged}
            >
              {crmLogged ? 'Logged ✓' : 'Log to Veeva'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function SystemMessage({ text }) {
  return (
    <div style={styles.agentRow}>
      <div style={styles.agentAvatar}>SA</div>
      <div style={styles.agentBody}>
        <div style={{ ...styles.skillTag, background: 'rgba(139,146,165,0.1)', border: '1px solid rgba(139,146,165,0.2)', color: '#8b92a5' }}>
          <span>⚙️</span>
          <span>system</span>
        </div>
        <div style={styles.agentBubble}>{text}</div>
      </div>
    </div>
  )
}

const styles = {
  userRow: {
    display: 'flex',
    flexDirection: 'row-reverse',
    gap: 10,
    alignItems: 'flex-start',
  },
  userAvatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'var(--accent-blue-bg)',
    border: '1px solid var(--accent-blue-dim)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--accent-blue)',
    flexShrink: 0,
  },
  userBubble: {
    maxWidth: '72%',
    padding: '9px 13px',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--bg-card)',
    border: '1px solid var(--border-light)',
    fontSize: 13,
    lineHeight: 1.6,
    color: 'var(--text-primary)',
  },
  agentRow: {
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
  },
  agentAvatar: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'var(--accent-teal-bg)',
    border: '1px solid var(--accent-teal-dim)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--accent-teal)',
    flexShrink: 0,
  },
  agentBody: {
    maxWidth: '78%',
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  skillTag: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 5,
    padding: '2px 9px',
    borderRadius: 99,
    fontSize: 11,
    fontWeight: 500,
    width: 'fit-content',
  },
  reasoningBlock: {
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--bg-surface)',
    overflow: 'hidden',
  },
  reasoningHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 10px',
    width: '100%',
    background: 'transparent',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: 11,
    cursor: 'pointer',
    textAlign: 'left',
  },
  reasoningBody: {
    padding: '0 10px 8px',
    fontSize: 11.5,
    color: 'var(--text-secondary)',
    lineHeight: 1.55,
    borderTop: '1px solid var(--border)',
    paddingTop: 7,
  },
  agentBubble: {
    padding: '10px 14px',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    fontSize: 13,
    lineHeight: 1.65,
    color: 'var(--text-primary)',
    whiteSpace: 'pre-wrap',
  },
  complianceBlock: {
    display: 'flex',
    gap: 8,
    padding: '9px 12px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--accent-amber-bg)',
    border: '1px solid rgba(240,168,77,0.3)',
    fontSize: 12,
    color: 'var(--accent-amber)',
    lineHeight: 1.5,
  },
  crmBlock: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 11px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--accent-purple-bg)',
    border: '1px solid rgba(155,124,244,0.25)',
    fontSize: 12,
    color: 'var(--accent-purple)',
  },
  crmBtn: {
    marginLeft: 'auto',
    padding: '3px 10px',
    fontSize: 11,
    border: '1px solid rgba(155,124,244,0.5)',
    borderRadius: 'var(--radius-sm)',
    background: 'transparent',
    color: 'var(--accent-purple)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.12s',
  },
  crmBtnLogged: {
    background: 'rgba(155,124,244,0.15)',
    cursor: 'default',
    opacity: 0.7,
  },
  typingIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    padding: '10px 14px',
    borderRadius: 'var(--radius-lg)',
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    width: 'fit-content',
  },
  dot: {
    display: 'inline-block',
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--text-muted)',
    animation: 'blink 1.2s ease-in-out infinite',
  },
}

// Inject keyframe animation
const style = document.createElement('style')
style.textContent = `
  @keyframes blink {
    0%, 80%, 100% { opacity: 0.2; transform: scale(0.85); }
    40% { opacity: 1; transform: scale(1); }
  }
`
document.head.appendChild(style)
