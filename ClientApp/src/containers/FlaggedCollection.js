import React, { useEffect, useState } from 'react'
import { Stack } from '@fluentui/react'
import '../components/Reminder.css'
import { CollectionHeader, TaskDetail } from '../components'
import { deleteTask, getFlaggedTasks, updateTask } from '../operations'
import { TasksList } from '../components/TasksList'

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

const useFlaggedTasks = _ => {
  // Tasks related states
  const [isProcessing, setProcessing] = useState(true)

  let [collections, setCollections] = useState([])
  const [tasksByGroups, setTasksByGroups] = useState([])

  // Right panel states
  const [isDetailActive, setDetailActive] = useState(false)
  const [selectedTask, setSelectedTask] = useState(undefined)

  useEffect(() => {
    async function syncTasks() {
      const fetchResults = await getFlaggedTasks()

      if (!!fetchResults) {
        collections = fetchResults

        collections.forEach(c => {
          c.incompletedTasks.forEach(i => assignTaskMethod(i))
          c.completedTasks.forEach(i => assignTaskMethod(i))
        })

        setCollections(collections)

        if (isDetailActive) {
          if (collections.length > 0)
            setSelectedTask(collections[0].incompletedTasks[0])
          else setDetailActive(false)
        }
        setTasksByGroups(parseGroups(collections))
        setProcessing(false)
      }
    }

    syncTasks()
  }, [])

  function assignTaskMethod(task) {
    // Task if clicked
    task.onSelect = () => {
      if (!task.taskId) return

      setDetailActive(true)
      setSelectedTask(task)
    }

    // Checkbox is clicked. TODO giant bug here :(
    task.onCheck = async () => {
      console.log(collections)

      if (!task.taskId) return
      let result = undefined

      if (task.isCompleted) {
        // Call server api
        result = await updateTask({
          ...task,
          completedAt: undefined,
        })

        if (!result) return
        assignTaskMethod(result)

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
          ...task,
          completedAt: now,
        })

        if (!result) return
        assignTaskMethod(result)

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
    task.onFlag = async () => {
      if (!task.taskId) return

      // Call server api
      let result = await updateTask({ ...task, isFlagged: !task.isFlagged })

      if (!result) return

      // Apply changes
      assignTaskMethod(result)

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

    task.onEdit = async ({ content, dueDate, note }) => {
      if (!task.taskId) return

      let result = await updateTask({ ...task, content, dueDate, note })
      if (!result) return

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

      setCollections(collections)
      setTasksByGroups(parseGroups(collections))
    }

    task.onDelete = async () => {
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
    return collections.map(({ name, incompletedTasks, completedTasks }) => {
      return {
        name,
        items: [...incompletedTasks, ...completedTasks],
        shouldCollapsed: false,
      }
    })
  }

  return {
    isProcessing,
    tasksByGroups,

    isDetailActive,
    setDetailActive,

    selectedTask,
  }
}

export const FlaggedCollection = _ => {
  const {
    isProcessing,
    tasksByGroups,

    // Attributes for right panel.
    isDetailActive,
    setDetailActive,

    selectedTask,
  } = useFlaggedTasks()

  if (isProcessing) return <h1 style={{ color: 'black' }}>Processing ...</h1>

  return (
    <Stack horizontal className='h-100 w-100'>
      {/* Tasks list display */}
      <Stack.Item
        grow={1}
        align='stretch'
        className='pl-2 pt-3'
        styles={{ root: { color: '#000', background: '#FFF' } }}
      >
        <Stack className='h-100'>
          <Stack.Item align='stretch' className={'pb-3'}>
            <CollectionHeader name={'Flagged'} />
          </Stack.Item>

          <Stack.Item align='stretch' styles={{ root: { overflow: 'auto' } }}>
            {tasksByGroups.length > 0 ? (
              <TasksList tasksGroup={tasksByGroups} />
            ) : (
              <h1>Empty</h1>
            )}
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
