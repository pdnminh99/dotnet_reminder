import {
  FontIcon,
  IconButton,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
  TextField,
} from '@fluentui/react'
import React, { useEffect, useState } from 'react'
import { useText } from '../custom_hooks'
import authService from './api-authorization/AuthorizeService'
import '../components/Reminder.css'

export const TopNav = ({ onCollapsedClick, onSearchValueChange }) => {
  const [name, setName] = useState(undefined)

  useEffect(() => {
    async function syncUser() {
      const { name } = await authService.getUser()
      setName(name)
    }

    syncUser()
  })

  return (
    <Stack horizontal className='h-100 w-100'>
      <Stack.Item
        align='stretch'
        grow={0}
        className='cursor-pointer px-3 bg-azure-dark--hover'
      >
        <Stack horizontal className='h-100 w-100'>
          <Stack.Item align='center'>
            <FontIcon iconName={'WaffleOffice365'} />
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
            <Searchbar onSearchValueChange={onSearchValueChange} />
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
            <Text variant={'medium'}>{name || 'Loading...'}</Text>
          </Stack.Item>
          <Stack.Item align='center'>
            {!name ? (
              <Spinner size={SpinnerSize.large} />
            ) : (
              <FontIcon
                iconName={'PlayerSettings'}
                iconProps={{ shouldFadeIn: true }}
              />
            )}
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  )
}

const Searchbar = ({ onSearchValueChange }) => {
  const {
    value,
    handleOnKeyUp,
    handleOnChange,
    isCancelActive,
    handleCancelClick,
  } = useText('', onSearchValueChange, false)

  return (
    <Stack horizontal className={'bg-azure-light mx-auto w-50 rounded-sm'}>
      <Stack.Item grow={0} align={'center'} className={'px-2'}>
        <FontIcon
          iconName='Search'
          style={{ color: '#0078D7', fontWeight: 500 }}
        />
      </Stack.Item>
      <Stack.Item grow={1} styles={{ root: { paddingRight: '5px' } }}>
        <TextField
          inputClassName='w-100 bg-azure-light'
          onChange={handleOnChange}
          onKeyUp={handleOnKeyUp}
          value={value}
          borderless
        />
      </Stack.Item>
      {isCancelActive && (
        <Stack.Item grow={0} align={'center'} className={'px-2'}>
          <IconButton
            className={'outline-none'}
            iconProps={{ iconName: 'Cancel' }}
            styles={{ root: { color: '#0078D7', fontSize: '16px' } }}
            onClick={handleCancelClick}
          />
        </Stack.Item>
      )}
    </Stack>
  )
}
