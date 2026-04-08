export function getClientKey() {
  const a='6e78'
  const b='5f67'
  const c='6174'
  const d='655f'
  const e='3432'
  const hex = `${a}${b}${c}${d}${e}`
  let out = ''
  for (let i = 0; i < hex.length; i += 2) {
    out += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16))
  }
  return out
}

async function sha256Hex(value) {
  const data = new TextEncoder().encode(value)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function buildProof(username, nonce) {
  const key = getClientKey()
  return sha256Hex(`${nonce}:${username}:${key}`)
}

function base64ToBytes(base64) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

function xorBytes(data, key) {
  const out = new Uint8Array(data.length)
  for (let i = 0; i < data.length; i += 1) {
    out[i] = data[i] ^ key[i % key.length]
  }
  return out
}

export function decodeFlagToken(token) {
  const key = new TextEncoder().encode(getClientKey())
  const data = base64ToBytes(token)
  const decoded = xorBytes(data, key)
  return new TextDecoder().decode(decoded)
}
