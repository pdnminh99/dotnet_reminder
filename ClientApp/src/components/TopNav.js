import { Icon, Stack, Text, TextField } from '@fluentui/react'
import React from 'react'

export const TopNav = ({ onCollapsedClick }) => {
  return <Stack horizontal className='h-100 w-100'>
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
          <TextField
            className='mx-auto w-50 rounded'
            inputClassName='bg-azure-light'
            borderless={true}
            styles={{ root: { borderRadius: '10px' } }}
            iconProps={{
              iconName: 'Search',
              styles: { root: { color: '#0078D7' } },
            }}
          />
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
}
