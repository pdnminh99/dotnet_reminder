import {
  CommandBarButton,
  Stack,
  TextField,
  Icon,
  IconButton,
  Dialog,
  DialogFooter,
  PrimaryButton,
  DefaultButton,
  Text,
  DialogType,
} from '@fluentui/react'
import React, { useState } from 'react'
import { invokeOrElse } from './utils'

export const TaskDetail = ({ selectedTask, onCancel, onDelete }) => {
  const [dialogHidden, setDialogHidden] = useState(true)

  const { taskId, content, description, isCompleted, isFlagged } = selectedTask

  return (
    <Stack tokens={{ childrenGap: 10 }}>
      <Stack.Item align='stretch'>
        <Stack className='ms-bgColor-white ms-depth-4'>
          <Stack.Item align='stretch'>
            <Stack horizontal className={'px-3 py-2'}>
              <Stack.Item align='center' grow={0}>
                <input
                  type='checkbox'
                  checked={isCompleted}
                  style={{ borderRadius: '9999px' }}
                />
              </Stack.Item>

              <Stack.Item align='stretch' grow={1}>
                <TextField
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
              multiline
              borderless
              className='p-2'
              row={3}
              resizable={true}
              value={description}
              placeholder={'Task description'}
              styles={{ root: { border: 'none' } }}
            />
          </Stack.Item>
        </Stack>
      </Stack.Item>

      <Stack.Item align={'stretch'}>
        <Stack className={'ms-bgColor-white ms-depth-4'}>
          <ControlWrapper>
            <Button content={'Remind me'} iconName={'Ringer'} hasDivider />
          </ControlWrapper>

          <ControlWrapper>
            <Button content={'Add due date'} iconName={'DateTime'} hasDivider />
          </ControlWrapper>

          <ControlWrapper>
            <Button content={'Repeat'} iconName={'RepeatAll'} />
          </ControlWrapper>
        </Stack>
      </Stack.Item>

      <ControlWrapper hasDepth>
        <Button content={'Flag'} iconName={'Flag'} />
      </ControlWrapper>

      <Stack.Item align={'stretch'}>
        <Stack horizontal horizontalAlign={'space-between'}>
          <IconButton
            iconProps={{
              iconName: 'ClosePane',
              styles: {
                root: {
                  fontSize: '16px',
                  fontWeight: '500',
                  color: '#000',
                },
              },
            }}
            onClick={() => invokeOrElse(onCancel)}
            borderless={true}
          />

          <IconButton
            iconProps={{
              iconName: 'Delete',
              styles: {
                root: { fontSize: '16px', fontWeight: '500', color: 'red' },
              },
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
            onClick={() => {
              setDialogHidden(true)
              invokeOrElse(onDelete)
            }}
            text='Save'
          />
          <DefaultButton onClick={() => setDialogHidden(true)} text='Cancel' />
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

const Button = ({ content, iconName, hasDivider }) => {
  const customStyles = { root: { border: 'none', height: '50px' } }

  if (typeof hasDivider === 'boolean' && hasDivider) {
    customStyles.root.borderBottomStyle = 'solid'
    customStyles.root.borderBottomColor = 'lightgray'
    customStyles.root.borderBottomWidth = '1px'
  }

  return (
    <CommandBarButton
      borderless
      className={'w-100 px-2 py-3'}
      allowDisabledFocus={false}
      styles={customStyles}
      onRenderChildren={() => (
        <Stack horizontal className={'h-100 w-100'}>
          <Stack.Item className='px-2 h-100'>
            <Icon iconName={iconName} />
          </Stack.Item>

          <Stack.Item className='px-2 h-100'>
            <Text variant={'medium'}>{content}</Text>
          </Stack.Item>
        </Stack>
      )}
    />
  )
}
