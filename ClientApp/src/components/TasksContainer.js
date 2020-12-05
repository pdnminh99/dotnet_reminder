import React, { useState } from 'react'
import { invokeOrElse, isNotUndefined, isUndefined } from './utils'
import { Stack, Checkbox, Icon } from '@fluentui/react'
import './Reminder.css'

export const TasksContainer = ({ groupName, tasks }) => {
  const [isCollapsed, setCollapsed] = useState(true)

  return (
    <Stack align={'stretch'}>
      {isUndefined(groupName) && <TasksList tasks={tasks} />}

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
                <Icon
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
              <TasksList tasks={tasks} />
            </Stack.Item>
          )}
        </>
      )}
    </Stack>
  )
}

const TasksList = ({ tasks }) =>
  tasks.map(
    ({ content, isCompleted, isFlagged, onSelect, onCheck, onFlag }, index) => (
      <Stack.Item
        key={index}
        className={'cursor-pointer bg-gray-300--hover'}
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
          <Stack.Item grow={0} align={'center'} className={'px-3 pt-2'}>
            <span onClick={() => invokeOrElse(onCheck)}>
              <Checkbox checked={isCompleted} />
            </span>
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

          <Stack.Item grow={0} align={'center'} className={'px-3 pt-2'}>
            <span onClick={() => invokeOrElse(onFlag)}>
              <Icon
                iconName='Flag'
                styles={{ root: { fontSize: '16px', fontWeight: '500' } }}
              />
            </span>
          </Stack.Item>
        </Stack>
      </Stack.Item>
    ),
  )
