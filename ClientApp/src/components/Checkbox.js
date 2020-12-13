import React from 'react'
import { FontIcon, Stack } from '@fluentui/react'
import './Checkbox.css'
import './Reminder.css'

export const Checkbox = ({ checked, onChange }) => {
  return (
    <Stack
      className={'circle cursor-pointer'}
      onClick={onChange}
      verticalAlign={'center'}
      styles={{
        root: {
          width: '20px',
          backgroundColor: checked ? '#0078d7' : 'transparent',
          height: '20px',
          borderRadius: '9999px',
          border: '1px #0078d7 solid',
        },
      }}
    >
      <FontIcon
        className={checked ? 'checkmark-checked' : 'checkmark-blank'}
        iconName='CheckMark'
        style={{
          fontSize: 10,
          textAlign: 'center',
          fontWeight: '600',
        }}
      />
    </Stack>
  )
}
