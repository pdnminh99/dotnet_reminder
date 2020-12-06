import React, { useEffect } from 'react'
import { IconButton, Stack, Text } from '@fluentui/react'

export const SearchContainer = ({ searchValue }) => {

  useEffect(() => {
    console.log(searchValue)
  }, [searchValue])

  return (
    <Stack horizontal className='h-100 w-100'>
      {/* Tasks list display */}
      <Stack.Item
        grow={1}
        align='stretch'
        className='px-2 py-3'
        styles={{ root: { color: '#000', background: '#FFF' } }}
      >
        <Stack>
          <Stack.Item align='stretch'>
            <SearchHeader value={searchValue} />
          </Stack.Item>

          <Stack.Item align='stretch' className='py-3'>
            {/*<TasksList tasksGroup={tasksGroup} />*/}
          </Stack.Item>
        </Stack>
      </Stack.Item>

      {/* Task detail with editing control */}
      {/*{isDetailActive && (*/}
      {/*  <Stack.Item*/}
      {/*    align='stretch'*/}
      {/*    grow={0}*/}
      {/*    className='ms-bgColor-gray10'*/}
      {/*    styles={taskDetailStyles}*/}
      {/*  >*/}
      {/*    <TaskDetail*/}
      {/*      selectedTask={selectedTask}*/}
      {/*      onCancel={() => setDetailActive(false)}*/}
      {/*    />*/}
      {/*  </Stack.Item>*/}
      {/*)}*/}
    </Stack>
  )
}

const SearchHeader = ({ value }) => {
  return (
    <Stack horizontal>
      <Stack.Item align='stretch' grow={0}>
        <Text variant={'xLarge'} className='px-3'>
          Results for: <span style={{ fontStyle: 'italic' }}>{value}</span>
        </Text>
      </Stack.Item>

      <Stack.Item grow={1} horizontalAlign='end'>
        <Stack horizontalAlign='end'>
          <IconButton
            iconProps={{
              iconName: 'Cancel',
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
