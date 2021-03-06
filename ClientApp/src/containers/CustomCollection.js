import React, { useEffect, useState, useContext } from 'react'
import { Stack, Text } from '@fluentui/react'
import '../components/Reminder.css'
import { CollectionHeader, TaskDetail } from '../components'
import {
  CollectionUpdateNotifierContext,
  fromEpochToLocalDatetime,
  isUndefined,
} from '../utils'
import { useHistory, useParams } from 'react-router-dom'
import {
  createTask as createTaskCall,
  deleteCollection,
  deleteTask,
  retrieveTasks,
  updateCollection,
  updateTask,
} from '../operations'
import { TaskSortType } from '../enums'
import { TasksList } from '../components/TasksList'
import { Error, LoadingScreen } from '../components/EmptyTasksList'

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

const useCustomTasks = _ => {
  const { setNotifier } = useContext(CollectionUpdateNotifierContext)

  const { cid } = useParams()

  const history = useHistory()

  const [name, setName] = useState('')
  const [creationDate, setCreationDate] = useState(0)

  // Tasks related states
  let [incompletedTasks, setIncompletedTasks] = useState([])
  let [completedTasks, setCompletedTasks] = useState([])
  const [tasksByGroups, setTasksByGroups] = useState([])

  // Right panel states
  const [isDetailActive, setDetailActive] = useState(false)
  const [selectedTask, setSelectedTask] = useState(undefined)

  const [isProcessing, setIsProcessing] = useState(false)

  const [isFetching, setFetchingState] = useState(true)

  const [isError, setError] = useState(false)

  useEffect(() => {
    async function syncTasks() {
      setFetchingState(true)

      const fetchResults = await retrieveTasks(cid)

      if (!!fetchResults) {
        incompletedTasks = fetchResults.incompletedTasks
        completedTasks = fetchResults.completedTasks

        setName(fetchResults.name)
        setCreationDate(fetchResults.creationDate)

        // Assign methods.
        completedTasks.forEach(t => assignTaskMethod(t))
        incompletedTasks.forEach(t => assignTaskMethod(t))

        setCompletedTasks(completedTasks)
        setIncompletedTasks(incompletedTasks)

        if (isDetailActive) {
          if (incompletedTasks.length > 0) setSelectedTask(incompletedTasks[0])
          else if (completedTasks.length > 0) setSelectedTask(completedTasks[0])
          else setDetailActive(false)
        }

        setTimeout(() => {
          setFetchingState(false)
        }, 1000)

        setTasksByGroups(parseGroups(incompletedTasks, completedTasks))
      } else {
        setFetchingState(false)
        setError(true)
      }
    }

    setError(false)
    syncTasks()
  }, [cid])

  function assignTaskMethod(task) {
    // Task if clicked
    task.onSelect = () => {
      if (isUndefined(task.taskId)) return

      setDetailActive(true)
      setSelectedTask(task)
    }

    // Checkbox is clicked.
    task.onCheck = async props => {
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
        assignTaskMethod(result)

        // -- Apply changes to virtual DOM tree --
        // Move to incompleted tasks list
        incompletedTasks.unshift(result)

        // Remove from completed tasks list
        completedTasks = completedTasks.filter(t => t.taskId !== task.taskId)
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
        assignTaskMethod(result)

        // Move to completed tasks list
        completedTasks.unshift(result)

        // Remove from incompleted tasks list
        incompletedTasks = incompletedTasks.filter(
          t => t.taskId !== task.taskId,
        )
      }

      setCompletedTasks(completedTasks)
      setIncompletedTasks(incompletedTasks)
      setTasksByGroups(parseGroups(incompletedTasks, completedTasks))

      setSelectedTask(t => {
        if (!!t && task.taskId === t.taskId) {
          return result
        }
        return t
      })
    }

    // Flag button is clicked
    task.onFlag = async props => {
      if (!task.taskId || !props) return

      let dueDate

      if (!!props.dueDate) {
        dueDate = props.dueDate.split(' ')[0]
      }

      // Call server api
      let result = await updateTask({
        ...props,
        taskId: props.taskId,
        dueDate,
        isFlagged: !task.isFlagged,
      })

      if (!result) return

      // Apply changes
      assignTaskMethod(result)

      if (task.isCompleted) {
        completedTasks = completedTasks.map(c => {
          if (c.taskId === task.taskId) {
            return result
          }
          return c
        })
        setCompletedTasks(completedTasks)
      } else {
        incompletedTasks = incompletedTasks.map(c => {
          if (c.taskId === task.taskId) {
            return result
          }
          return c
        })

        setIncompletedTasks(incompletedTasks)
      }

      setSelectedTask(result)
      setTasksByGroups(parseGroups(incompletedTasks, completedTasks))
    }

    task.onEdit = async ({ content, dueDate, note, priority }) => {
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
      assignTaskMethod(result)

      if (task.isCompleted) {
        completedTasks = completedTasks.map(c => {
          if (c.taskId === task.taskId) {
            return result
          }
          return c
        })
        setCompletedTasks(completedTasks)
      } else {
        incompletedTasks = incompletedTasks.map(c => {
          if (c.taskId === task.taskId) {
            return result
          }
          return c
        })

        setIncompletedTasks(incompletedTasks)
      }

      setSelectedTask(result)
      setTasksByGroups(parseGroups(incompletedTasks, completedTasks))
    }

    task.onDelete = async () => {
      let result = await deleteTask(task.taskId)

      if (!result) return false
      if (task.isCompleted) {
        completedTasks = completedTasks.filter(t => t.taskId !== task.taskId)
        setCompletedTasks(completedTasks)
      } else {
        incompletedTasks = incompletedTasks.filter(
          t => t.taskId !== task.taskId,
        )
        setIncompletedTasks(incompletedTasks)
      }

      setTasksByGroups(parseGroups(incompletedTasks, completedTasks))

      if (incompletedTasks.length > 0) setSelectedTask(incompletedTasks[0])
      else if (completedTasks.length > 0) setSelectedTask(completedTasks[0])
      else setDetailActive(false)

      return true
    }
  }

  async function createTask(content) {
    if (content.trim().length === 0) return

    const syncTimestamp = new Date().getMilliseconds()

    let newTask = {
      taskId: undefined,
      content,
      isFlagged: true,
      isCompleted: false,
      note: '',
      syncTimestamp,
    }

    assignTaskMethod(newTask)

    incompletedTasks.unshift(newTask)

    setIncompletedTasks(incompletedTasks)
    setTasksByGroups(parseGroups(incompletedTasks, completedTasks))

    let createdTask = await createTaskCall(cid, { content })

    if (!createdTask) {
      setTimeout(() => {
        incompletedTasks = incompletedTasks.filter(
          t => t.syncTimestamp !== syncTimestamp,
        )

        setIncompletedTasks(incompletedTasks)
        setTasksByGroups(parseGroups(incompletedTasks, completedTasks))
      }, 2000)
    } else {
      setTimeout(() => {
        incompletedTasks = incompletedTasks.map(t => {
          if (t.syncTimestamp === syncTimestamp) {
            assignTaskMethod(createdTask)
            return createdTask
          }
          return t
        })

        setIncompletedTasks(incompletedTasks)
        setTasksByGroups(parseGroups(incompletedTasks, completedTasks))
      }, 2000)
    }
  }

  function parseGroups(incompletedTasks, completedTasks) {
    let tasksByGroups = []

    if (incompletedTasks.length > 0) {
      tasksByGroups.push({ items: incompletedTasks })
    }

    if (completedTasks.length > 0) {
      tasksByGroups.push({
        name: 'Completed tasks',
        items: completedTasks,
        shouldCollapsed: incompletedTasks.length < 5 ? false : true,
      })
    }

    return tasksByGroups
  }

  async function handleEditollectionName(value) {
    const oldName = name

    setName(value)
    setIsProcessing(true)

    if (!(await updateCollection(cid, value))) setName(oldName)
    else setNotifier(true)

    setIsProcessing(false)
  }

  async function handleDeleteCollection() {
    setIsProcessing(true)

    if (!!(await deleteCollection(cid))) {
      setNotifier(true)
      setSelectedTask(undefined)
      setDetailActive(false)
      history.push('/today')
    }

    setIsProcessing(false)
  }

  return {
    name,
    creationDate,
    tasksByGroups,
    createTask,

    isDetailActive,
    setDetailActive,

    handleEditollectionName,
    handleDeleteCollection,

    isError,
    isFetching,
    isProcessing,
    selectedTask,
  }
}

export const CustomCollection = () => {
  const {
    name,
    creationDate,

    tasksByGroups,
    createTask,

    // Attributes for right panel.
    isDetailActive,
    setDetailActive,

    handleEditollectionName,
    handleDeleteCollection,

    isError,
    isProcessing,
    isFetching,
    selectedTask,
  } = useCustomTasks()

  const [sortType, setSortType] = useState(TaskSortType.Default)

  function changeSortType(newSortType) {
    if (newSortType !== sortType) setSortType(newSortType)
  }

  if (isFetching) return <LoadingScreen />

  if (isError) return <Error />

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
          <Stack.Item align='stretch'>
            <CollectionHeader
              name={name}
              isLoading={isProcessing}
              onEdit={handleEditollectionName}
              onDelete={handleDeleteCollection}
              onSort={changeSortType}
              sortType={sortType}
            />
          </Stack.Item>

          <Stack.Item align='stretch' className={'pb-3'}>
            <Text variant={'small'} className='px-3'>
              {fromEpochToLocalDatetime(creationDate).toUTCString()}
            </Text>
          </Stack.Item>

          <Stack.Item align='stretch' styles={{ root: { overflow: 'auto' } }}>
            <TasksList
              tasksGroup={tasksByGroups}
              onInsert={createTask}
              sortType={sortType}
            />
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
