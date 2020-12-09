import React, { useEffect, useState } from 'react'
import { Stack } from '@fluentui/react'
import '../components/Reminder.css'
import { CollectionHeader, TaskDetail } from '../components'
import { deleteTask, getPlannedTasks, updateTask } from '../operations'
import { TasksList } from '../components/TasksList'
import { EmptyTasksList, LoadingScreen } from '../components/EmptyTasksList'

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

const usePlannedTasks = _ => {
  // Tasks related states
  const [isProcessing, setProcessing] = useState(true)

  let [collections, setCollections] = useState([])
  const [tasksByGroups, setTasksByGroups] = useState([])

  // Right panel states
  const [isDetailActive, setDetailActive] = useState(false)
  const [selectedTask, setSelectedTask] = useState(undefined)

  useEffect(() => {
    async function syncTasks() {
      const fetchResults = await getPlannedTasks()

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
        setTimeout(() => {
          setProcessing(false)
        }, 1000)
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
      let dueDate = !!task.dueDate ? task.dueDate.split(' ')[0] : undefined

      if (task.isCompleted) {
        // Call server api
        result = await updateTask({
          ...task,
          dueDate,
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
          dueDate,
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

      let dueDate = !!task.dueDate ? task.dueDate.split(' ')[0] : undefined

      // Call server api
      let result = await updateTask({
        ...task,
        dueDate,
        isFlagged: !task.isFlagged,
      })

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

      dueDate = !!dueDate ? dueDate.split(' ')[0] : undefined

      let result = await updateTask({ ...task, content, dueDate, note })
      if (!result) return
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

      setCollections(collections)
      setSelectedTask(result)
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
      let items = [...incompletedTasks, ...completedTasks].sort(
        (a, b) => a.taskId - b.taskId,
      )

      return {
        name,
        items,
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

export const PlannedCollection = _ => {
  const {
    isProcessing,
    tasksByGroups,

    // Attributes for right panel.
    isDetailActive,
    setDetailActive,

    selectedTask,
  } = usePlannedTasks()

  if (isProcessing) return <LoadingScreen />

  if (tasksByGroups.length === 0) return <EmptyTasksList />

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
            <CollectionHeader name={'Planned'} />
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
