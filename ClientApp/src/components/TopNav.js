import { Icon, IconButton, Stack, Text, TextField } from '@fluentui/react'
import React from 'react'
import { useText } from '../custom_hooks'

export const TopNav = ({ onCollapsedClick }) => {
  return (
    <Stack horizontal className='h-100 w-100'>
      <Stack.Item
        align='stretch'
        grow={0}
        className='cursor-pointer px-3 bg-azure-dark--hover'
      >
        <Stack horizontal className='h-100 w-100'>
          <Stack.Item align='center'>
            <Icon iconName={'WaffleOffice365'} />
          </Stack.Item>
        </Stack>
      </Stack.Item>

      <Stack.Item align='stretch' grow={0}>
        <Stack horizontal className='h-100 w-100 px-2'>
          <Stack.Item align='center'>
            <Text variant={'large'}>Reminder</Text>
          </Stack.Item>
        </Stack>
      </Stack.Item>

      <Stack.Item align='stretch' grow={3}>
        <Stack
          className='h-100 w-100'
          verticalAlign='center'
          horizontalAlign='center'
        >
          <Stack.Item align='stretch'>
            <Searchbar />
          </Stack.Item>
        </Stack>
      </Stack.Item>

      <Stack.Item
        align='stretch'
        grow={0}
        className='cursor-pointer px-4 bg-azure-dark--hover'
      >
        <Stack
          horizontal
          className='h-100 w-100'
          tokens={{ childrenGap: 10 }}
          onClick={onCollapsedClick}
        >
          <Stack.Item align='center'>
            <Text variant={'medium'}>hello@gmail.com</Text>
          </Stack.Item>
          <Stack.Item align='center'>
            <Icon iconName={'PlayerSettings'} />
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  )
}

const Searchbar = () => {
  const { value, handleOnChange, isCancelActive, handleCancelClick } = useText(
    '',
  )

  return (
    <Stack horizontal className={'bg-azure-light mx-auto w-50 rounded-sm'}>
      <Stack.Item grow={0} align={'center'} className={'px-2'}>
        <Icon iconName='Search' styles={{ root: { color: '#0078D7' } }} />
      </Stack.Item>
      <Stack.Item grow={1} styles={{ root: { paddingRight: '5px' } }}>
        <TextField
          inputClassName='w-100 bg-azure-light'
          onChange={handleOnChange}
          value={value}
          borderless
        />
      </Stack.Item>
      {isCancelActive && (
        <Stack.Item grow={0} align={'center'} className={'px-2'}>
          <IconButton
            iconProps={{ iconName: 'Cancel' }}
            styles={{ root: { color: '#0078D7', fontSize: '16px' } }}
            onClick={handleCancelClick}
          />
        </Stack.Item>
      )}
    </Stack>
  )
}
