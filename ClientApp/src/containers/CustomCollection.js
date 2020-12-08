import React, { useEffect, useState, useContext } from 'react'
import { Stack, Text } from '@fluentui/react'
import '../components/Reminder.css'
import {
  CollectionHeader,
  InsertField,
  TaskDetail,
  TasksContainer,
} from '../components'
import {
  CollectionUpdateNotifierContext,
  fromEpochToLocalDatetime,
  isNotUndefined,
  isUndefined,
} from '../utils'
import { useHistory, useParams } from 'react-router-dom'
import {
  createTask as createTaskCall,
  deleteCollection,
  retrieveTasks,
  updateCollection,
} from '../operations'
import { NotifierType, TaskSortType } from '../enums'

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

  useEffect(() => {
    async function syncTasks() {
      const fetchResults = await retrieveTasks(cid)

      if (isNotUndefined(fetchResults)) {
        incompletedTasks = fetchResults.incompletedTasks
        completedTasks = fetchResults.completedTasks

        setName(fetchResults.name)
        setCreationDate(fetchResults.creationDate)

        // Assign methods.
        completedTasks.forEach(t => assignTaskMethod(t))
        incompletedTasks.forEach(t => assignTaskMethod(t))

        setCompletedTasks(completedTasks)
        setIncompletedTasks(incompletedTasks)
        setTasksByGroups(parseGroups(incompletedTasks, completedTasks))
      }
    }

    syncTasks()
  }, [cid])

  function assignTaskMethod(task) {
    // Task if clicked
    task.onSelect = () => {
      if (isUndefined(task.taskId)) return

      setDetailActive(true)
      setSelectedTask(task)
    }

    // Checkbox is clicked
    task.onCheck = () => {
      if (isUndefined(task.taskId)) return

      if (task.isCompleted) {
        // Move to incompleted tasks list
        task.isCompleted = false
        task.completedAt = undefined

        incompletedTasks.unshift(task)

        // Remove from completed tasks list
        completedTasks = completedTasks.filter(t => t.taskId !== task.taskId)
      } else {
        // Move to completed tasks list
        task.isCompleted = true
        task.completedAt = new Date().getMilliseconds()

        completedTasks.unshift(task)

        // Remove from incompleted tasks list
        incompletedTasks = incompletedTasks.filter(
          t => t.taskId !== task.taskId,
        )
      }

      setCompletedTasks(completedTasks)
      setIncompletedTasks(incompletedTasks)
      setTasksByGroups(parseGroups(incompletedTasks, completedTasks))
    }

    // Flag button is clicked
    task.onFlag = () => {
      if (isUndefined(task.taskId)) return
      console.log(`Task id ${task.taskId}; content: ${task.content} on flag.`)
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
    let tasksByGroups = [{ items: incompletedTasks }]

    if (completedTasks.length > 0) {
      tasksByGroups.push({
        name: 'Completed tasks',
        items: completedTasks,
      })
    }

    return tasksByGroups
  }

  async function handleEditollectionName(value) {
    const oldName = name

    setName(value)
    setIsProcessing(true)

    let result = await updateCollection(cid, value)

    if (isUndefined(result)) setName(oldName)
    else {
      setNotifier({
        collection: {
          collectionId: parseInt(cid),
          name: value,
        },
        type: NotifierType.Update,
      })
    }
    setIsProcessing(false)
  }

  async function handleDeleteCollection() {
    console.log(`Delete collection [${cid}]`)

    setIsProcessing(true)

    let result = await deleteCollection(cid)
    if (isNotUndefined(result)) {
      setNotifier({
        collection: {
          collectionId: parseInt(cid),
          name,
        },
        type: NotifierType.Delete,
      })
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

    isProcessing,
    selectedTask,
  } = useCustomTasks()

  const [sortType, setSortType] = useState(TaskSortType.Default)

  function changeSortType(newSortType) {
    if (newSortType !== sortType) setSortType(newSortType)
  }

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

const TasksList = ({ tasksGroup, onInsert, sortType }) => {
  return (
    <Stack>
      <Stack.Item align={'stretch'} styles={{ root: { height: '50px' } }}>
        <InsertField onInsert={onInsert} />
      </Stack.Item>

      <Stack.Item align={'stretch'}>
        {tasksGroup.map(({ name, items }, i) => {
          return (
            <TasksContainer
              key={i}
              groupName={name}
              tasks={items}
              sortType={sortType}
            />
          )
        })}
      </Stack.Item>
    </Stack>
  )
}
