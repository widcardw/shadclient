import {
  type MultiTypeSentMessage,
  createMessageSegment,
} from '../types/messages/sent-message'

function* _iter_message(msg: string): Generator<[string, string]> {
  let text_begin = 0
  const regex = /\[CQ:([a-zA-Z0-9-_.]+)((?:,[a-zA-Z0-9-_.]+=[^,\]]*)*),?\]/g
  let match: RegExpExecArray | null
  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  while ((match = regex.exec(msg))) {
    yield ['text', msg.substring(text_begin, match.index)]
    text_begin = match.index + match[0].length
    yield [match[1], match[2].replace(/^,/, '')]
  }
  yield ['text', msg.substring(text_begin)]
}

function* _construct(msg: string) {
  for (const [type, data] of _iter_message(msg)) {
    if (type === 'text') {
      if (data) yield createMessageSegment(type, { text: data })
    } else {
      const parsedData: { [key: string]: string } = {}
      const params = data.split(',').map((param) => param.trim())
      for (const param of params) {
        const [key, value] = param.split('=', 2)
        parsedData[key] = decodeURI(value)
      }
      yield createMessageSegment(type, parsedData)
    }
  }
}

function transformBrackets(msg: string) {
  const sent: MultiTypeSentMessage[] = []
  for (const segment of _construct(msg)) sent.push(segment)

  return sent
}

function buildMessage(msg: string) {
  return transformBrackets(msg)
}

export { buildMessage }
