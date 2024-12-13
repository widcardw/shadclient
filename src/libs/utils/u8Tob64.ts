function u8toBase64(bytes: Uint8Array) {
  let data = ''
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) data += String.fromCharCode(bytes[i])

  return `base64://${window.btoa(data)}`
}

function encodeBase64(str: string) {
  return window.btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, $1) =>
      String.fromCharCode(Number.parseInt(`0x${$1}`, 16)),
    ),
  )
}

/**
 * Transform SVG string into base64 string with native canvas
 */
async function canvasSvgToBase64(
  svg: string,
  config?: {
    /**
     * add padding to svg
     */
    padding?: number
  },
): Promise<string> {
  const { padding = 0 } = config || { padding: 0 }
  const canvas = document.createElement('canvas')
  console.log('svg', svg)
  const viewBoxMatchObj = svg.match(/viewBox="([^"]+)"/)
  if (!viewBoxMatchObj) {
    throw new Error('SVG must have viewBox attribute')
  }
  const viewBoxMatch = svg.match(/viewBox="([^"]+)"/)![1]
  let [, , w, h] = viewBoxMatch.split(' ').map((i) => Number.parseFloat(i))

  if (w >= 2000 || h >= 2000) {
    const rate = 10
    w /= rate
    h /= rate
  }

  const width = w + padding * 2
  const height = h + padding * 2

  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')!
  context.fillStyle = 'white'
  context.fillRect(0, 0, width, height)
  const image = new Image()
  image.src = `data:image/svg+xml;base64,${encodeBase64(svg)}`
  await new Promise((resolve) => {
    image.onload = () => {
      context.drawImage(image, padding, padding, w, h)
      resolve(undefined)
    }
  })
  const b64 = canvas
    .toDataURL()
    .replace(/^data:image\/png;base64,/, 'base64://')
  return b64
}

export { u8toBase64, canvasSvgToBase64, encodeBase64 }
