const times = (count, callback) => {
  const result = []

  for (let i = 0; i < count; i++) {
    result.push(callback(i))
  }

  return result
}

const reduceTimes = (count, callback, separator = '') => {
  return times(count, callback).join(separator)
}

const escape = (html) => {
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/'/g, '&#39;')
    .replace(/"/g, '&quot;')
}

const capitalize = (str) => {
  if (typeof str !== 'string') return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

const groupBy = (array, property) => {
  return array.reduce((previous, current) => {
    (previous[current[property]] = previous[current[property]] || []).push(current)
    return previous
  }, {})
}

module.exports.times = times
module.exports.reduceTimes = reduceTimes
module.exports.escape = escape
module.exports.capitalize = capitalize
module.exports.groupBy = groupBy
