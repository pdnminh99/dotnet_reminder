import React, { useState, useEffect } from 'react'
import {
  displayDueText,
  invokeOrElse,
  isNotUndefined,
  isUndefined,
  toMDYDateObject,
} from '../utils'
import {
  Stack,
  FontIcon,
  IconButton,
  Spinner,
  SpinnerSize,
  Text,
} from '@fluentui/react'
import './Reminder.css'
import { TaskSortType } from '../enums'
import { Checkbox } from './Checkbox'
import Highlighter from 'react-highlight-words'
import { translatePriority } from '../utils'

export const TasksContainer = ({
  groupName,
  tasks,
  sortType,
  shouldCollapsed,
  highlightKeyword,
}) => {
  const [isCollapsed, setCollapsed] = useState(
    isNotUndefined(shouldCollapsed) ? shouldCollapsed : true,
  )

  useEffect(() => {
    setCollapsed(isNotUndefined(shouldCollapsed) ? shouldCollapsed : true)
  }, [])

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
                styles={{ root: { paddingLeft: '14px', fontWeight: 500 } }}
              >
                <Highlighter
                  highlightStyle={{ backgroundColor: 'yellow' }}
                  searchWords={!!highlightKeyword ? [highlightKeyword] : []}
                  autoEscape={true}
                  textToHighlight={groupName}
                />
              </Stack.Item>
            </Stack>
          </Stack.Item>

          {/* Group content */}
          {!isCollapsed && (
            <Stack.Item>
              <TasksList
                tasks={tasks}
                sortType={sortType}
                highlightKeyword={highlightKeyword}
              />
            </Stack.Item>
          )}
        </>
      )}
    </Stack>
  )
}

const TasksList = ({ tasks, sortType, highlightKeyword }) => {
  function rearrangeTasks(tasks) {
    let result = undefined

    switch (sortType) {
      case TaskSortType.Alphabetically:
        result = tasks.sort(
          (before, after) => -after.content.localeCompare(before.content),
        )
        break
      case TaskSortType.DueDate:
        let today = new Date()
        today.setHours(0)
        today.setMinutes(0)
        today.setSeconds(0)
        today.setMilliseconds(0)

        result = tasks.sort((before, after) => {
          if (!before.dueDate) return 1
          if (!after.dueDate) return -1

          let fromTodayToBefore =
            today.getTime() - toMDYDateObject(before.dueDate)
          let fromTodayToAfter =
            today.getTime() - toMDYDateObject(after.dueDate)

          return fromTodayToAfter - fromTodayToBefore
        })
        break
      case TaskSortType.Default:
      case TaskSortType.CreationDate:
      default:
        result = tasks.sort((before, after) => after.taskId - before.taskId)
        break
    }

    return result
  }

  return rearrangeTasks(tasks).map(function (
    {
      taskId,
      content,
      dueDate,
      note,
      priority,
      isCompleted,
      isFlagged,
      onSelect,
      onCheck,
      onFlag,
    },
    index,
  ) {
    let { color } = translatePriority(priority)

    let { text, type } = displayDueText(toMDYDateObject(dueDate), isCompleted)

    return (
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
              <Checkbox
                onChange={() =>
                  onCheck({ taskId, content, content, note, dueDate })
                }
                checked={isCompleted}
              />
            )}
          </Stack.Item>

          <Stack.Item grow={1} align={'stretch'}>
            <Stack
              verticalAlign={'center'}
              horizontalAlign={'start'}
              onClick={() => invokeOrElse(onSelect)}
              styles={{ root: { height: '100%', fontSize: '14px' } }}
            >
              <Highlighter
                unhighlightStyle={{
                  textDecoration: isCompleted ? 'line-through' : 'none',
                }}
                highlightStyle={{
                  backgroundColor: 'yellow',
                  textDecoration: isCompleted ? 'line-through' : 'none',
                }}
                searchWords={!!highlightKeyword ? [highlightKeyword] : []}
                autoEscape={true}
                textToHighlight={content}
              />
              {!!dueDate && (
                <Text
                  style={{ color: type === 1 ? 'red' : 'gray' }}
                  variant={'smallPlus'}
                >
                  {text}
                </Text>
              )}
            </Stack>
          </Stack.Item>

          {isNotUndefined(priority) && (
            <Stack.Item grow={0} align={'center'} className={'px-3'}>
              <FontIcon iconName={'Tag'} style={{ color, fontWeight: 500 }} />
            </Stack.Item>
          )}

          <Stack.Item grow={0} align={'center'} className={'px-3'}>
            <IconButton
              className={
                isFlagged
                  ? 'outline-none flag-icon'
                  : 'outline-none unflag-icon'
              }
              onClick={() =>
                onFlag({ taskId, content, content, note, dueDate })
              }
              iconProps={{ iconName: 'Flag' }}
            />
          </Stack.Item>
        </Stack>
      </Stack.Item>
    )
  })
}
