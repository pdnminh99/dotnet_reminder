import React from 'react'

export const CollectionUpdateNotifierContext = React.createContext()

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

export function translatePriority(priority) {
  switch (priority) {
    case 0:
      return { priorityName: 'Priority 1', color: 'green' }
    case 1:
      return { priorityName: 'Priority 2', color: 'blue' }
    case 2:
      return { priorityName: 'Priority 3', color: 'red' }
    case 3:
      return { priorityName: 'Priority 4', color: 'red' }
    default:
      return { priorityName: 'No priority', color: 'black' }
  }
}

export function displayDueText(dueDate, isCompleted) {
  if (!dueDate) return { text: 'Add due date', type: 0 }

  let today = new Date()

  today.setHours(0)
  today.setMinutes(0)
  today.setSeconds(0)
  today.setMilliseconds(0)

  if (today.getTime() > dueDate.getTime() && !isCompleted) {
    return { text: `Overdue: ${dueDate.toDateString()}.`, type: 1 }
  }

  return { text: `Due: ${dueDate.toDateString()}`, type: 0 }
}

export function toMDYDateObject(value) {
  if (!value) return undefined

  let dateParts = value.split(' ')[0].split('/')
  // month is 0-based, that's why we need dataParts[1] - 1
  return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
}

export function toDateMonthYearString(value) {
  if (!value) return undefined
  return `${value.getDate()}/${value.getMonth() + 1}/${value.getFullYear()}`
}
