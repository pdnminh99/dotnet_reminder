import { IconButton, Stack, Text } from '@fluentui/react'
import React from 'react'

export const TaskHeader = ({ pathname, menuProps }) => {
  return <Stack horizontal>
    <Stack.Item align='stretch'>
      <Text variant={'xLarge'} className='px-3'>
        {pathname}
      </Text>
    </Stack.Item>

    <Stack.Item align='stretch'>
      <IconButton
        iconProps={{
          iconName: 'More',
          styles: { root: { color: '#000', fontSize: '16px' } },
        }}
        title='CollapseMenu'
        ariaLabel='CollapseMenu'
        disabled={false}
        borderless={true}
        menuProps={menuProps}
      />
    </Stack.Item>
  </Stack>
}
