import {
  CommandBarButton,
  Stack,
  TextField,
  FontIcon,
  IconButton,
  Dialog,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
  Text,
  DialogType,
  CommandButton,
} from '@fluentui/react'
import React, { useState, useEffect } from 'react'
import { invokeOrElse } from '../utils'
import { Checkbox } from './Checkbox'
import { CalendarPicker } from './CalendarPicker'
import './Reminder.css'

let syncId = undefined

function toMDYDateObject(value) {
  let dateParts = value.split(' ')[0].split('/')
  // month is 0-based, that's why we need dataParts[1] - 1
  return new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0])
}

function toDateMonthYearString(value) {
  if (!value) return undefined
  return `${value.getDate()}/${value.getMonth() + 1}/${value.getFullYear()}`
}

export const TaskDetail = ({ selectedTask, onCancel }) => {
  const [isProcessing, setProcessing] = useState(false)
  const [dialogHidden, setDialogHidden] = useState(true)

  const [taskId, setTaskId] = useState(
    !!selectedTask ? selectedTask.taskId : undefined,
  )
  const [content, setContent] = useState(
    !!selectedTask ? selectedTask.content : '',
  )
  const [note, setNote] = useState(!!selectedTask ? selectedTask.note : '')

  const [dueDate, setDueDate] = useState(undefined)
  const [isCompleted, setIsCompleted] = useState(
    !!selectedTask ? selectedTask.isCompleted : false,
  )
  const [isFlagged, setFlag] = useState(
    !!selectedTask ? selectedTask.isFlagged : false,
  )

  const [priority, setPriority] = useState(
    !!selectedTask ? selectedTask.priority : undefined,
  )

  const [showCalendarPicker, setShowCalendarPicker] = useState(false)

  useEffect(() => {
    if (!selectedTask) return

    setTaskId(selectedTask.taskId)
    setContent(selectedTask.content)
    setNote(selectedTask.note)

    if (!!selectedTask.dueDate) {
      setDueDate(toMDYDateObject(selectedTask.dueDate))
    } else {
      setDueDate(undefined)
    }

    setIsCompleted(selectedTask.isCompleted)
    setFlag(selectedTask.isFlagged)
    setPriority(selectedTask.priority)
  }, [selectedTask])

  function requestChanges({ content, note, dueDate, priority }) {
    let hasChanges = false

    hasChanges = hasChanges || content !== selectedTask.content
    hasChanges = hasChanges || note !== selectedTask.note
    hasChanges = hasChanges || dueDate !== selectedTask.dueDate
    hasChanges = hasChanges || priority !== selectedTask.priority

    if (hasChanges) {
      selectedTask.onEdit({
        content,
        dueDate: toDateMonthYearString(dueDate),
        note,
        priority,
      })
    }

    clearTimeout(syncId)
    syncId = undefined
  }

  function handleNameChange({ target }) {
    setContent(target.value)
    if (!!syncId) {
      clearTimeout(syncId)
    }
    syncId = setTimeout(
      () => requestChanges({ content: target.value, note, dueDate, priority }),
      1000,
    )
  }

  function handleNoteChange({ target }) {
    setNote(target.value)
    if (!!syncId) {
      clearTimeout(syncId)
    }
    syncId = setTimeout(
      () => requestChanges({ content, note: target.value, dueDate, priority }),
      1000,
    )
  }

  function handleDueDateChange(value) {
    setDueDate(value)
    if (!!syncId) {
      clearTimeout(syncId)
    }
    syncId = setTimeout(
      () => requestChanges({ content, note, priority, dueDate: value }),
      1000,
    )
  }

  function handlePriorityChange(value) {
    setPriority(value)
    if (!!syncId) {
      clearTimeout(syncId)
    }
    syncId = setTimeout(
      () => requestChanges({ content, note, dueDate, priority: value }),
      1000,
    )
  }

  function handleOnCheck() {
    if (!!syncId) {
      clearTimeout(syncId)
      syncId = undefined
    }

    selectedTask.onCheck({
      taskId,
      content,
      note,
      priority,
      dueDate: toDateMonthYearString(dueDate),
    })
  }

  function handleOnFlag() {
    if (!!syncId) {
      clearTimeout(syncId)
      syncId = undefined
    }

    selectedTask.onFlag({
      taskId,
      content,
      note,
      priority,
      dueDate: toDateMonthYearString(dueDate),
    })
  }

  function displayDueText() {
    if (!dueDate) return { text: 'Add due date', type: 0 }

    let today = new Date()

    today.setHours(0)
    today.setMinutes(0)
    today.setSeconds(0)
    today.setMilliseconds(0)

    if (today.getTime() > dueDate.getTime()) {
      return { text: `Overdue: ${dueDate.toDateString()}.`, type: 1 }
    }

    return { text: `Due: ${dueDate.toDateString()}`, type: 0 }
  }

  function translatePriority() {
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

  if (!selectedTask) {
    return <h1>Empty</h1>
  }

  let { text, type } = displayDueText()

  let { priorityName, color } = translatePriority()

  return (
    <Stack tokens={{ childrenGap: 10 }}>
      <Stack.Item align='stretch'>
        <Stack className='ms-bgColor-white ms-depth-4'>
          <Stack.Item align='stretch'>
            <Stack horizontal className={'px-3 py-2'}>
              <Stack.Item align={'center'} grow={0}>
                <Checkbox onChange={handleOnCheck} checked={isCompleted} />
              </Stack.Item>

              <Stack.Item align='stretch' grow={1}>
                <TextField
                  onChange={handleNameChange}
                  disabled={isProcessing}
                  borderless
                  className={'px-2'}
                  placeholder={'Task content...'}
                  value={content}
                  styles={{ root: { border: 'none' } }}
                />
              </Stack.Item>
            </Stack>
          </Stack.Item>
          <Stack.Item>
            <TextField
              onChange={handleNoteChange}
              multiline
              disabled={isProcessing}
              borderless
              className='p-2'
              row={3}
              resizable={true}
              value={note}
              placeholder={'Task note'}
              styles={{ root: { border: 'none' } }}
            />
          </Stack.Item>
        </Stack>
      </Stack.Item>

      <Stack.Item align={'stretch'}>
        <Stack className={'ms-bgColor-white ms-depth-4'}>
          <ControlWrapper>
            <Button
              content={text}
              iconName={'DateTime'}
              hasDivider
              color={type === 1 ? 'red' : 'black'}
              onClick={() => setShowCalendarPicker(!showCalendarPicker)}
            />
          </ControlWrapper>

          {showCalendarPicker && (
            <>
              <ControlWrapper align={'center'}>
                <CalendarPicker
                  selectedDate={dueDate}
                  onPick={handleDueDateChange}
                />
              </ControlWrapper>
              <DefaultButton
                styles={{
                  root: {
                    border: 'none',
                    borderBottomStyle: 'solid',
                    borderBottomColor: 'lightgray',
                    borderBottomWidth: '1px',
                  },
                }}
                onClick={() => handleDueDateChange(undefined)}
                className={'outline-none'}
                disabled={!dueDate}
                text={'Reset due date'}
              />
            </>
          )}

          <ControlWrapper>
            <Button
              content={priorityName}
              color={color}
              iconName={'Tag'}
              items={[
                {
                  key: 'pu',
                  onClick: () => handlePriorityChange(undefined),
                  iconProps: {
                    iconName: 'Tag',
                    style: { color: 'black', fontWeight: '400' },
                  },
                  text: 'No priority',
                  title: '',
                },

                {
                  key: 'p0',
                  onClick: () => handlePriorityChange(0),
                  iconProps: {
                    iconName: 'Tag',
                    style: { color: 'green', fontWeight: '400' },
                  },
                  text: 'Priority 1',
                  title: '',
                },

                {
                  key: 'p1',
                  onClick: () => handlePriorityChange(1),
                  iconProps: {
                    iconName: 'Tag',
                    style: { color: 'blue', fontWeight: '400' },
                  },
                  text: 'Priority 2',
                  title: '',
                },

                {
                  key: 'p2',
                  onClick: () => handlePriorityChange(2),
                  iconProps: {
                    iconName: 'Tag',
                    style: { color: 'red', fontWeight: '400' },
                  },
                  text: 'Priority 3',
                  title: '',
                },
              ]}
            />
          </ControlWrapper>
        </Stack>
      </Stack.Item>

      <ControlWrapper hasDepth>
        <Button
          content={isFlagged ? 'Remove flag' : 'Flag this task'}
          iconName={'Flag'}
          color={isFlagged ? '#0078d7' : 'black'}
          onClick={handleOnFlag}
        />
      </ControlWrapper>

      <Stack.Item align={'stretch'}>
        <Stack horizontal horizontalAlign={'space-between'}>
          <IconButton
            iconProps={{ iconName: 'ClosePane' }}
            className={'outline-none'}
            styles={{
              root: {
                fontSize: '16px',
                fontWeight: '500',
                color: '#000',
              },
            }}
            onClick={() => invokeOrElse(onCancel)}
          />

          <IconButton
            iconProps={{ iconName: 'Delete' }}
            className={'outline-none'}
            styles={{
              root: { fontSize: '16px', fontWeight: '500', color: 'red' },
            }}
            onClick={() => setDialogHidden(false)}
            borderless={true}
          />
        </Stack>
      </Stack.Item>

      <Dialog
        hidden={dialogHidden}
        dialogContentProps={{
          type: DialogType.largeHeader,
          title: 'Delete confirm',
          subText: `Are you sure to delete task "${content}"?`,
        }}
        onDismiss={() => setDialogHidden(true)}
      >
        <DialogFooter>
          <PrimaryButton
            className={'outline-none'}
            onClick={async () => {
              setProcessing(true)
              await selectedTask.onDelete()
              setDialogHidden(true)
              setProcessing(false)
            }}
            text='Save'
          />
          <DefaultButton
            className={'outline-none'}
            onClick={() => setDialogHidden(true)}
            text='Cancel'
          />
        </DialogFooter>
      </Dialog>
    </Stack>
  )
}

const ControlWrapper = ({ children, hasDepth, align }) => {
  if (hasDepth === undefined) hasDepth = false

  return (
    <Stack.Item
      align={align || 'stretch'}
      className={`ms-bgColor-white ${
        hasDepth ? 'ms-depth-4' : ''
      } bg-gray-300--hover:hover`}
    >
      {children}
    </Stack.Item>
  )
}

const Button = ({ content, iconName, hasDivider, onClick, color, items }) => {
  const customStyles = { root: { border: 'none', height: '50px' } }

  if (typeof hasDivider === 'boolean' && hasDivider) {
    customStyles.root.borderBottomStyle = 'solid'
    customStyles.root.borderBottomColor = 'lightgray'
    customStyles.root.borderBottomWidth = '1px'
  }

  return (
    <CommandBarButton
      onClick={onClick}
      borderless
      className={'outline-none w-100 px-2 py-3'}
      allowDisabledFocus={false}
      styles={customStyles}
      onRenderChildren={() => (
        <Stack horizontal verticalAlign={'center'} className={'h-100 w-100'}>
          <Stack.Item className='px-2 h-100'>
            <FontIcon
              iconName={iconName}
              style={{
                color,
                borderRadius: '0.125rem',
                fontSize: '16px',
                fontWeight: '500',
              }}
            />
          </Stack.Item>

          <Stack.Item className='px-2 h-100'>
            <Text styles={{ root: { color } }} variant={'medium'}>
              {content}
            </Text>
          </Stack.Item>
        </Stack>
      )}
      menuProps={
        !!items
          ? {
              onRenderMenuList: props => {
                return (
                  <Stack align={'stretch'}>
                    {props.items.map(p => {
                      let { key, iconProps, text, onClick } = p

                      return (
                        <CommandButton
                          key={key}
                          className={'outline-none hover-still-black'}
                          iconProps={iconProps}
                          text={text}
                          onClick={onClick}
                        />
                      )
                    })}
                  </Stack>
                )
              },
              items,
            }
          : undefined
      }
    />
  )
}
