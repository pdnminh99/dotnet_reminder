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
} from '@fluentui/react'
import React, { useState } from 'react'
import { invokeOrElse } from '../utils'
import { Checkbox } from './Checkbox'

let syncId = undefined

export const TaskDetail = ({ selectedTask, onCancel }) => {
  const [isProcessing, setProcessing] = useState(false)
  const [dialogHidden, setDialogHidden] = useState(true)

  const [content, setContent] = useState(selectedTask.content)
  const [note, setNote] = useState(selectedTask.note)
  const [dueDate, setDueDate] = useState(selectedTask.dueDate)

  const {
    // Fields
    taskId,
    isCompleted,
    isFlagged,

    // Methods
    onCheck,
    onFlag,
    onEdit,
    onDelete,
  } = selectedTask

  function requestChanges({ content, note, dueDate }) {
    let hasChanges = false

    hasChanges = hasChanges || content !== selectedTask.content
    hasChanges = hasChanges || note !== selectedTask.note
    hasChanges = hasChanges || dueDate !== selectedTask.dueDate

    if (hasChanges) {
      console.log(`Changes detected`)
      onEdit({ content, dueDate, note })
    }

    syncId = undefined
  }

  function handleNameChange({ target }) {
    setContent(target.value)
    if (!!syncId) {
      clearTimeout(syncId)
    }
    syncId = setTimeout(
      () => requestChanges({ content: target.value, note, dueDate }),
      1000,
    )
  }

  function handleNoteChange({ target }) {
    setNote(target.value)
    if (!!syncId) {
      clearTimeout(syncId)
    }
    syncId = setTimeout(
      () => requestChanges({ content, note: target.value, dueDate }),
      1000,
    )
  }

  return (
    <Stack tokens={{ childrenGap: 10 }}>
      <Stack.Item align='stretch'>
        <Stack className='ms-bgColor-white ms-depth-4'>
          <Stack.Item align='stretch'>
            <Stack horizontal className={'px-3 py-2'}>
              <Stack.Item align={'center'} grow={0}>
                <Checkbox onChange={onCheck} checked={isCompleted} />
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
            <Button content={'Add due date'} iconName={'DateTime'} hasDivider />
          </ControlWrapper>
        </Stack>
      </Stack.Item>

      <ControlWrapper hasDepth>
        <Button content={'Flag'} iconName={'Flag'} onClick={onFlag} />
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
            onClick={() => {
              setDialogHidden(true)
              setProcessing(true)
              onDelete()
                .then(_ => {})
                .finally(_ => setProcessing(false))
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

const ControlWrapper = ({ children, hasDepth }) => {
  if (hasDepth === undefined) hasDepth = false

  return (
    <Stack.Item
      align={'stretch'}
      className={`ms-bgColor-white ${
        hasDepth ? 'ms-depth-4' : ''
      } bg-gray-300--hover:hover`}
    >
      {children}
    </Stack.Item>
  )
}

const Button = ({ content, iconName, hasDivider, onClick }) => {
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
        <Stack horizontal className={'h-100 w-100'}>
          <Stack.Item className='px-2 h-100'>
            <FontIcon iconName={iconName} />
          </Stack.Item>

          <Stack.Item className='px-2 h-100'>
            <Text variant={'medium'}>{content}</Text>
          </Stack.Item>
        </Stack>
      )}
    />
  )
}
