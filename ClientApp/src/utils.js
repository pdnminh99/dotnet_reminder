export const isNull = value => value === null

export const isNotNull = value => !isNull(value)

export const isUndefined = value => value === undefined

export const isNotUndefined = value => !isUndefined(value)

export const isNullOrUndefined = value => isNull(value) || isUndefined(value)

export const isNeitherNullNorUndefined = value => !isNullOrUndefined(value)

export const fromEpochToLocalDatetime = epochValue => {
  // Ref: https://stackoverflow.com/questions/4631928/convert-utc-epoch-to-local-date
  const d = new Date(0)
  d.setUTCMilliseconds(epochValue)
  return d
}

export const invokeOrElse = (callable, callback) => {
  if (isFunction(callable)) callable()
  else if (isFunction(callback)) callback()
}

const isFunction = functionToCheck =>
  functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
