import React, { useState } from 'react'
import { Stack, DefaultButton, Icon, FocusZone } from '@fluentui/react'
import './Reminder.css'
import { useText } from '../custom_hooks'

export const InsertField = ({ isTaskInsertField }) => {
  if (isTaskInsertField === undefined) isTaskInsertField = true

  const [isFocus, setIsFocus] = useState(false)
  const {
    value,
    setValue,
    handleOnChange,
    setCancelActive,
    isCancelActive,
  } = useText('')

  function onInputLoseFocus() {
    setValue('')
    setCancelActive(false)
    setIsFocus(false)
  }

  function handleOnFocus() {
    setIsFocus(true)
  }

  let fieldClassName = 'w-100 h-100'
  if (isTaskInsertField)
    fieldClassName += isFocus ? ' border-b-azure' : ' border-b-gray'

  return (
    <FocusZone
      className={fieldClassName}
      onFocus={handleOnFocus}
      onBlur={onInputLoseFocus}
    >
      <Stack horizontal className={'h-100 w-100'}>
        <Stack.Item grow={0} align={'center'} className={'px-3'}>
          <Icon
            iconName='Add'
            styles={{ root: { color: '#0078D7', fontSize: '16px' } }}
          />
        </Stack.Item>

        <Stack.Item
          grow={1}
          align={'stretch'}
          styles={{ root: { paddingRight: '8px' } }}
        >
          <input
            type='text'
            style={{
              border: 'none',
              fontSize: isTaskInsertField ? '14px' : '16px',
              paddingLeft: isTaskInsertField ? '12px' : '0',
              color: isTaskInsertField ? '#34373d' : '#000',
              fontWeight: isTaskInsertField ? '400' : '350',
              backgroundColor: 'transparent',
            }}
            className='w-100 h-100'
            placeholder={isTaskInsertField ? 'Add a task' : 'New list'}
            onChange={handleOnChange}
            value={value}
          />
        </Stack.Item>

        {isCancelActive && isTaskInsertField && (
          <Stack.Item grow={0} align={'center'}>
            <DefaultButton
              text={'Add'}
              styles={{ root: { border: 'none', color: '#0078D7' } }}
            />
          </Stack.Item>
        )}
      </Stack>
    </FocusZone>
  )
}
