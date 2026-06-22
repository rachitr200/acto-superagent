
const API_BASE = 'https://acto-superagent-api.onrender.com'
export async function sendMessage(messages) {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  const text = await response.text()

  if (!response.ok) {
    let detail = 'API request failed'
    try { detail = JSON.parse(text).detail || detail } catch {}
    throw new Error(detail)
  }

  try {
    return JSON.parse(text)
  } catch {
    throw new Error('Server error: ' + text.slice(0, 150))
  }
}