function u8toBase64(bytes: Uint8Array) {
  let data = ''
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) data += String.fromCharCode(bytes[i])

  return `base64://${window.btoa(data)}`
}

export { u8toBase64 }
