import mapping from '../mapping'

export default function finishOp (inner) {
  return function ha (type, size) {
    const str = this.input.slice(this.pos, this.pos + size)
    const converted = Array.from(str).map(s => mapping[s.charCodeAt()]).join('')
    if (converted.length < size) {
      return inner.call(this, type, size)
    }
    this.pos += size
    return this.finishToken(type, converted)
  }
}
