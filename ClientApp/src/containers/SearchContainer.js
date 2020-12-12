import React, { useEffect, useState } from 'react'
import { Stack, Text } from '@fluentui/react'
import '../components/Reminder.css'
import { TaskDetail } from '../components'
import { deleteTask, search, updateTask } from '../operations'
import { TasksList } from '../components/TasksList'
import { LoadingScreen, NoSearchResults } from '../components/EmptyTasksList'

const taskDetailStyles = {
  root: {
    background: 'red',
    width: '360px',
    borderColor: 'lightgray',
    borderWidth: '1px',
    borderStyle: 'solid',
    padding: '13px',
  },
}

const useSearch = keyword => {
  // Tasks related states
  const [isProcessing, setProcessing] = useState(true)

  let [collections, setCollections] = useState([])
  const [tasksByGroups, setTasksByGroups] = useState([])

  // Right panel states
  const [isDetailActive, setDetailActive] = useState(false)
  const [selectedTask, setSelectedTask] = useState(undefined)

  useEffect(() => {
    async function syncTasks() {
      const fetchResults = await search(keyword)

      console.log(fetchResults)

      if (!!fetchResults) {
        collections = fetchResults

        collections.forEach(c => {
          c.incompletedTasks.forEach(i => assignTaskMethods(i))
          c.completedTasks.forEach(i => assignTaskMethods(i))
        })

        setCollections(collections)

        if (isDetailActive) {
          if (collections.length > 0)
            setSelectedTask(collections[0].incompletedTasks[0])
          else setDetailActive(false)
        }
        setTasksByGroups(parseGroups(collections))
        setTimeout(() => {
          setProcessing(false)
        }, 1000)
      }
    }

    setProcessing(true)
    syncTasks()
  }, [keyword])

  function assignTaskMethods(task) {
    // Task if clicked
    task.onSelect = function () {
      if (!task.taskId) return

      setDetailActive(true)
      setSelectedTask(task)
    }

    // Checkbox is clicked event handler.
    task.onCheck = async function (props) {
      if (!task.taskId || !props) return

      let result, dueDate

      if (!!props.dueDate) {
        dueDate = props.dueDate.split(' ')[0]
      }

      if (task.isCompleted) {
        // Call server api
        result = await updateTask({
          ...props,
          taskId: props.taskId,
          dueDate,
          completedAt: undefined,
        })

        if (!result) return
        assignTaskMethods(result)

        setCollections(cs => {
          cs.forEach(c => {
            c.incompletedTasks.unshift(result)

            c.completedTasks = c.completedTasks.filter(
              t => t.taskId !== task.taskId,
            )
          })

          return cs
        })
      } else {
        let now = new Date().getMilliseconds()

        // Call server api
        result = await updateTask({
          ...props,
          dueDate,
          taskId: props.taskId,
          completedAt: now,
        })

        if (!result) return
        assignTaskMethods(result)

        setCollections(cs => {
          cs.forEach(c => {
            c.incompletedTasks = c.incompletedTasks.filter(
              t => t.taskId !== task.taskId,
            )

            c.completedTasks.unshift(result)
          })

          return cs
        })
      }

      setTasksByGroups(parseGroups(collections))

      setSelectedTask(t => {
        if (!!t && task.taskId === t.taskId) {
          return result
        }
        return t
      })
    }

    // Flag button is clicked
    task.onFlag = async function (props) {
      if (!task.taskId || !props) return

      let result, dueDate

      if (!!props.dueDate) {
        dueDate = props.dueDate.split(' ')[0]
      }

      // Call server api
      result = await updateTask({
        ...props,
        taskId: props.taskId,
        dueDate,
        isFlagged: !task.isFlagged,
      })

      if (!result) return

      // Apply changes
      assignTaskMethods(result)

      collections.forEach(c => {
        c.completedTasks = c.completedTasks.map(t => {
          if (t.taskId === result.taskId) return result
          return t
        })

        c.incompletedTasks = c.incompletedTasks.map(t => {
          if (t.taskId === result.taskId) return result
          return t
        })
      })

      setSelectedTask(t => {
        if (!!t && task.taskId === t.taskId) {
          return result
        }
        return t
      })

      setCollections(collections)
      setTasksByGroups(parseGroups(collections))
    }

    // On Fields changes
    task.onEdit = async function ({ content, dueDate, note, priority }) {
      if (!task.taskId) return

      dueDate = !!dueDate ? dueDate.split(' ')[0] : undefined

      let result = await updateTask({
        ...task,
        content,
        dueDate,
        note,
        priority,
      })

      if (!result) return
      assignTaskMethods(result)

      collections.forEach(c => {
        c.completedTasks = c.completedTasks.map(t => {
          if (t.taskId === result.taskId) return result
          return t
        })

        c.incompletedTasks = c.incompletedTasks.map(t => {
          if (t.taskId === result.taskId) return result
          return t
        })
      })

      setSelectedTask(result)
      setCollections(collections)
      setTasksByGroups(parseGroups(collections))
    }

    // On Delete button clicked
    task.onDelete = async function () {
      let result = await deleteTask(task.taskId)

      if (!result) return false

      collections.forEach(c => {
        c.completedTasks = c.completedTasks.filter(
          t => t.taskId !== task.taskId,
        )

        c.incompletedTasks = c.incompletedTasks.filter(
          t => t.taskId !== task.taskId,
        )
      })

      collections = collections.filter(
        c => c.completedTasks.length > 0 || c.incompletedTasks.length > 0,
      )

      setTasksByGroups(parseGroups(collections))

      if (collections.length > 0) {
        let firstCollection = collections[0]

        if (firstCollection.incompletedTasks.length > 0) {
          setSelectedTask(firstCollection.incompletedTasks[0])
        } else {
          setSelectedTask(firstCollection.completedTasks[0])
        }
      } else {
        setDetailActive(false)
      }

      return true
    }
  }

  function parseGroups(collections) {
    return collections
      .map(({ name, incompletedTasks, completedTasks }) => {
        let items = [...incompletedTasks, ...completedTasks].sort(
          (a, b) => a.taskId - b.taskId,
        )

        return {
          name,
          items,
          shouldCollapsed: false,
        }
      })
      .filter(c => c.items.length > 0)
  }

  return {
    isProcessing,
    tasksByGroups,

    isDetailActive,
    setDetailActive,

    selectedTask,
  }
}

export const SearchContainer = ({ searchValue }) => {
  const {
    isProcessing,
    tasksByGroups,

    // Attributes for right panel.
    isDetailActive,
    setDetailActive,

    selectedTask,
  } = useSearch(searchValue)

  function renderContent() {
    if (isProcessing) return <LoadingScreen />

    if (tasksByGroups.length === 0) return <NoSearchResults />

    return (
      <TasksList tasksGroup={tasksByGroups} highlightKeyword={searchValue} />
    )
  }

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
          <Stack.Item align='stretch' className={'pb-3'}>
            <SearchHeader value={searchValue} />
          </Stack.Item>

          <Stack.Item align='stretch' styles={{ root: { overflow: 'auto' } }}>
            {renderContent()}
          </Stack.Item>
        </Stack>
      </Stack.Item>

      {/* Task detail with editing control */}
      {isDetailActive && (
        <Stack.Item
          align='stretch'
          grow={0}
          className='ms-bgColor-gray10'
          styles={taskDetailStyles}
        >
          <TaskDetail
            selectedTask={selectedTask}
            onCancel={() => setDetailActive(false)}
          />
        </Stack.Item>
      )}
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
    </Stack>
  )
}
