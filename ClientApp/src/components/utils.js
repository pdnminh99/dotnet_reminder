export const isNull = value => value === null

export const isNotNull = value => !isNull(value)

export const isUndefined = value => value === undefined

export const isNotUndefined = value => !isUndefined(value)

export const isNullOrUndefined = value => isNull(value) || isUndefined(value)

export const isNeitherNullNorUndefined = value => !isNullOrUndefined(value)

export const invokeOrElse = (callable, callback) => {
  if (isFunction(callable)) callable()
  else if (isFunction(callback)) callback()
  else console.error(`Neither params are functions.`)
}

const isFunction = functionToCheck =>
  functionToCheck && {}.toString.call(functionToCheck) === '[object Function]'
