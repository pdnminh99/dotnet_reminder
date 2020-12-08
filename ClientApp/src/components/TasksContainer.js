import React, { useState } from 'react'
import { invokeOrElse, isNotUndefined, isUndefined } from '../utils'
import {
  Stack,
  FontIcon,
  IconButton,
  Spinner,
  SpinnerSize,
} from '@fluentui/react'
import './Reminder.css'
import { TaskSortType } from '../enums'
import { Checkbox } from './Checkbox'

export const TasksContainer = ({ groupName, tasks, sortType }) => {
  const [isCollapsed, setCollapsed] = useState(true)

  return (
    <Stack align={'stretch'}>
      {isUndefined(groupName) && (
        <TasksList tasks={tasks} sortType={sortType} />
      )}

      {isNotUndefined(groupName) && (
        <>
          {/* Group header */}
          <Stack.Item className={'cursor-pointer'}>
            <Stack
              horizontal
              align='center'
              grow={0}
              styles={{ root: { height: '50px' } }}
              onClick={() => setCollapsed(!isCollapsed)}
            >
              <Stack.Item align={'center'}>
                <FontIcon
                  className={'px-3'}
                  iconName={isCollapsed ? 'ChevronDown' : 'ChevronUp'}
                  styles={{ root: { fontSize: '16px', fontWeight: '500' } }}
                />
              </Stack.Item>

              <Stack.Item
                horizontal
                grow={1}
                align={'center'}
                styles={{ root: { paddingLeft: '11px', fontWeight: 'bold' } }}
              >
                <span>{groupName}</span>
              </Stack.Item>
            </Stack>
          </Stack.Item>

          {/* Group content */}
          {!isCollapsed && (
            <Stack.Item>
              <TasksList tasks={tasks} sortType={sortType} />
            </Stack.Item>
          )}
        </>
      )}
    </Stack>
  )
}

const TasksList = ({ tasks, sortType }) => {
  function rearrangeTasks(tasks) {
    switch (sortType) {
      case TaskSortType.Alphabetically:
        return tasks.sort((before, after) => {
          if (before.content > after.content) return 1
          if (before.content < after.content) return -1
          return 0
        })
      case TaskSortType.CreationDate:
        return tasks.sort((before, after) => {
          if (before.creationDate > after.creationDate) return -1
          if (before.creationDate < after.creationDate) return 1
          return 0
        })
      case TaskSortType.DueDate:
        return tasks.sort((before, after) => {
          if (before.dueDate > after.dueDate) return -1
          if (before.dueDate < after.dueDate) return 1
          return 0
        })
      case TaskSortType.Default:
      default:
        return tasks
    }
  }

  return rearrangeTasks(tasks).map(
    (
      { taskId, content, isCompleted, isFlagged, onSelect, onCheck, onFlag },
      index,
    ) => (
      <Stack.Item
        key={index}
        className={'cursor-pointer ms-bgColor-gray20--hover'}
        styles={{
          root: {
            height: '50px',
            borderBottomColor: 'lightgray',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid',
          },
        }}
      >
        <Stack
          horizontal
          verticalAlign={'center'}
          styles={{ root: { height: '100%' } }}
        >
          <Stack.Item grow={0} align={'center'} className={'px-3'}>
            {!taskId ? (
              <Spinner size={SpinnerSize.medium} />
            ) : (
              <Checkbox onChange={onCheck} checked={isCompleted} />
            )}
          </Stack.Item>

          <Stack.Item grow={1} align={'stretch'}>
            <Stack
              horizontal
              verticalAlign={'center'}
              onClick={() => invokeOrElse(onSelect)}
              styles={{ root: { height: '100%', fontSize: '14px' } }}
            >
              <span>{content}</span>
            </Stack>
          </Stack.Item>

          <Stack.Item grow={0} align={'center'} className={'px-3'}>
            <IconButton
              className={
                isFlagged
                  ? 'outline-none flag-icon'
                  : 'outline-none unflag-icon'
              }
              onClick={onFlag}
              iconProps={{ iconName: 'Flag' }}
            />
          </Stack.Item>
        </Stack>
      </Stack.Item>
    ),
  )
}
