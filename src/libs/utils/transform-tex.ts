import juice from 'juice/client'
import { AssistiveMmlHandler } from 'mathjax-full/js/a11y/assistive-mml.js'
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js'
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js'
import { TeX } from 'mathjax-full/js/input/tex.js'
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js'
import { mathjax } from 'mathjax-full/js/mathjax.js'
import { SVG } from 'mathjax-full/js/output/svg.js'

import { AsciiMath } from 'asciimath-parser'
import { createImageMessage, createTextMessage } from '../types/messages/sent-message'
import { canvasSvgToBase64 } from './u8Tob64'

const am = new AsciiMath()

const documentOptions = {
  InputJax: new TeX({ packages: AllPackages }),
  OutputJax: new SVG({ fontCache: 'none' }),
}
const convertOptions = {
  display: false,
}

function renderMath(content: string): string {
  const adaptor = liteAdaptor()
  const handler = RegisterHTMLHandler(adaptor)
  AssistiveMmlHandler(handler)
  const mathDocument = mathjax.document(content, documentOptions)
  const html = adaptor.outerHTML(mathDocument.convert(content, convertOptions))
  const stylesheet = adaptor.outerHTML(
    documentOptions.OutputJax.styleSheet(mathDocument) as any,
  )
  return juice(html + stylesheet)
}

function msgContentToSvg(msg: string) {
  let tex = ''
  if (msg.startsWith('/tex')) tex = msg.replace('/tex', '').trim()
  else if (msg.startsWith('/am')) tex = am.toTex(msg.replace('/am', '').trim())

  const svg = renderMath(tex)
  return svg
}

async function transformTex(msg: string) {
  let svg = msgContentToSvg(msg)
  svg = svg.match(/<svg(.*)<\/svg>/)![0]
  const b64 = await canvasSvgToBase64(svg, { padding: 20 })
  return [createImageMessage(b64), createTextMessage(msg)]
}

export { transformTex }
