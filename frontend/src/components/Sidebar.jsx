import React from 'react'
import { SKILLS, QUICK_PROMPTS, HCP } from '../config'

export default function Sidebar({ activeSkill, onQuickPrompt, tokenCount }) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.header}>
        <div style={styles.statusDot} />
        <div>
          <div style={styles.agentName}>SuperAgent</div>
          <div style={styles.agentRole}>MSL / Sales Rep Assistant</div>
        </div>
      </div>

      <div style={styles.hcpCard}>
        <div style={styles.hcpAvatar}>{HCP.initials}</div>
        <div>
          <div style={styles.hcpName}>{HCP.name}</div>
          <div style={styles.hcpSpec}>{HCP.specialty} · {HCP.hospital}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 5 }}>
            <span style={styles.pill}>{HCP.tier}</span>
            <span style={styles.pill}>{HCP.patients}</span>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionLabel}>Active Skills</div>
        {Object.entries(SKILLS).map(([name, meta]) => (
          <div
            key={name}
            style={{
              ...styles.skillItem,
              ...(activeSkill === name ? {
                background: meta.bg,
                borderColor: meta.border,
                color: meta.color,
              } : {})
            }}
          >
            <span style={{ fontSize: 13 }}>{meta.icon}</span>
            <span>{name}</span>
            {activeSkill === name && (
              <span style={{ ...styles.activeDot, background: meta.color }} />
            )}
          </div>
        ))}
      </div>

      <div style={styles.section}>
        <div style={styles.sectionLabel}>Quick Prompts</div>
        {QUICK_PROMPTS.map((q) => (
          <button
            key={q.label}
            style={styles.quickBtn}
            onClick={() => onQuickPrompt(q.prompt)}
          >
            {q.label}
          </button>
        ))}
      </div>

      {tokenCount > 0 && (
        <div style={styles.tokenBar}>
          <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>Tokens used</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
            {tokenCount.toLocaleString()}
          </span>
        </div>
      )}
    </aside>
  )
}

const styles = {
  sidebar: {
    width: 230,
    minWidth: 230,
    background: 'var(--bg-surface)',
    borderRight: '1px solid var(--border)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    padding: '16px 14px',
    borderBottom: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--accent-teal)',
    flexShrink: 0,
    boxShadow: '0 0 6px var(--accent-teal)',
  },
  agentName: { fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' },
  agentRole: { fontSize: 11, color: 'var(--text-muted)', marginTop: 1 },
  hcpCard: {
    margin: 10,
    padding: '10px 12px',
    background: 'var(--bg-card)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--border)',
    display: 'flex',
    gap: 10,
    alignItems: 'flex-start',
  },
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
    fontWeight: 600,
    color: 'var(--accent-blue)',
    flexShrink: 0,
  },
  hcpName: { fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' },
  hcpSpec: { fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 },
  pill: {
    fontSize: 10,
    padding: '2px 7px',
    borderRadius: 99,
    background: 'var(--bg-hover)',
    border: '1px solid var(--border)',
    color: 'var(--text-muted)',
  },
  section: {
    padding: '10px 10px 4px',
    borderTop: '1px solid var(--border)',
  },
  sectionLabel: {
    fontSize: 10,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
    marginBottom: 7,
    paddingLeft: 4,
  },
  skillItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 7,
    padding: '6px 9px',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid transparent',
    fontSize: 12,
    color: 'var(--text-secondary)',
    marginBottom: 2,
    position: 'relative',
    transition: 'all 0.15s',
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: '50%',
    marginLeft: 'auto',
  },
  quickBtn: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '6px 9px',
    fontSize: 11.5,
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
    background: 'transparent',
    color: 'var(--text-secondary)',
    marginBottom: 4,
    transition: 'all 0.12s',
  },
  tokenBar: {
    marginTop: 'auto',
    padding: '10px 14px',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}
