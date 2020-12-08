import React from 'react'
import { InsertField, TasksContainer } from '../components'
import { Stack } from '@fluentui/react'
import { EmptyTasksList } from './EmptyTasksList'

export const TasksList = ({ tasksGroup, onInsert, sortType }) => {
  return (
    <Stack>
      {!!onInsert && (
        <Stack.Item align={'stretch'} styles={{ root: { height: '50px' } }}>
          <InsertField onInsert={onInsert} />
        </Stack.Item>
      )}

      <Stack.Item align={'stretch'}>
        {tasksGroup.length > 0 ? (
          tasksGroup.map(({ name, items, shouldCollapsed }, i) => {
            return (
              <TasksContainer
                key={i}
                groupName={name}
                tasks={items}
                sortType={sortType}
                shouldCollapsed={shouldCollapsed}
              />
            )
          })
        ) : (
          <EmptyTasksList />
        )}
      </Stack.Item>
    </Stack>
  )
}
