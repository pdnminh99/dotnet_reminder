import { IconButton, Stack, Text } from '@fluentui/react'
import React from 'react'
import '../components/Reminder.css'

export const CollectionHeader = ({ name }) => {
  return (
    <Stack horizontal>
      <Stack.Item align='stretch' grow={0}>
        <Text variant={'xLarge'} className='px-3'>
          {name}
        </Text>
      </Stack.Item>

      <Stack.Item align='center' grow={0}>
        <IconButton
          className={'outline-none'}
          iconProps={{
            iconName: 'More',
            styles: { root: { color: '#000', fontSize: '16px' } },
          }}
          title='CollapseMenu'
          ariaLabel='CollapseMenu'
          disabled={false}
          borderless={true}
        />
      </Stack.Item>

      <Stack.Item grow={1} horizontalAlign='end'>
        <Stack horizontalAlign='end'>
          <IconButton
            className={'outline-none'}
            iconProps={{
              iconName: 'More',
              styles: { root: { color: '#000', fontSize: '16px' } },
            }}
            title='CollapseMenu'
            ariaLabel='CollapseMenu'
            disabled={false}
            borderless={true}
          />
        </Stack>
      </Stack.Item>
    </Stack>
  )
}
