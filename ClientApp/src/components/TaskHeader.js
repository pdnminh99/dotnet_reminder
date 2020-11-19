import { IconButton, Stack, Text } from '@fluentui/react'
import React from 'react'

export const TaskHeader = ({ pathname, onDetailPanelToggle }) => {
  return <Stack horizontal>
    <Stack.Item align='stretch' grow={0}>
      <Text variant={'xLarge'} className='px-3'>
        {pathname}
      </Text>
    </Stack.Item>

    <Stack.Item align='center' grow={0}>
      <IconButton
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
          iconProps={{
            iconName: 'More',
            styles: { root: { color: '#000', fontSize: '16px' } },
          }}
          title='CollapseMenu'
          ariaLabel='CollapseMenu'
          disabled={false}
          borderless={true}
          onClick={onDetailPanelToggle}
        />
      </Stack>
    </Stack.Item>
  </Stack>
}
