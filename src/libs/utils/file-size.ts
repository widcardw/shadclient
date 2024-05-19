const _2_10 = 1024
const _2_20 = 1048576
const _2_30 = 1073741824

function beautifyFileSize(s?: number) {
  if (!s) return ''

  if (s < _2_10) return `${s} B`
  if (s < _2_20) return `${(s / _2_10).toFixed(2)} KB`
  if (s < _2_30) return `${(s / _2_20).toFixed(2)} MB`
  return `${(s / _2_30).toFixed(2)} GB`
}

export { beautifyFileSize }
