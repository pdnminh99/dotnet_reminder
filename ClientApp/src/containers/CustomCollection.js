import React, { useEffect, useState } from 'react'
import { Stack, Text } from '@fluentui/react'
import '../components/Reminder.css'
import { CollectionHeader, InsertField, TaskDetail, TasksContainer } from '../components'
import { fromEpochToLocalDatetime, isUndefined } from '../utils'
import { useParams } from 'react-router-dom'
import { retrieveTasks, updateCollection } from '../operations'
import { TaskSortType } from '../enums'

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

export const CustomCollection = () => {
  const { cid } = useParams()

  const [isDetailActive, setDetailActive] = useState(false)
  const [selectedTask, setSelectedTask] = useState(undefined)

  const [name, setName] = useState('')
  const [creationDate, setCreationDate] = useState(0)
  const [sortType, setSortType] = useState(TaskSortType.Default)
  const [incompletedTasks, setIncompletedTasks] = useState([])
  const [completedTasks, setCompletedTasks] = useState([])

  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    async function syncTasks() {
      const fetchResults = await retrieveTasks(cid)

      if (!fetchResults) {
        console.error(`Error fetching collection data.`)
      } else {
        let {
          name,
          creationDate,
          incompletedTasks,
          completedTasks,
        } = fetchResults

        setName(name)
        setCreationDate(creationDate)
        setIncompletedTasks(incompletedTasks || [])
        setCompletedTasks(completedTasks || [])
      }
    }

    syncTasks()
  }, [cid])

  // let collection = sampleCollections[pathname]

  completedTasks.forEach(task => {
    task.onSelect = () => {
      console.log(`Task id ${task.taskId}; content: ${task.content} on select.`)
      setDetailActive(true)
      setSelectedTask(task)
    }
    task.onCheck = () => {
      console.log(`Task id ${task.taskId}; content: ${task.content} on check.`)
    }
    task.onFlag = () =>
      console.log(`Task id ${task.taskId}; content: ${task.content} on flag.`)
  })

  incompletedTasks.forEach(task => {
    task.onSelect = () => {
      console.log(`Task id ${task.taskId}; content: ${task.content} on select.`)
      setDetailActive(true)
      setSelectedTask(task)
    }
    task.onCheck = () =>
      console.log(`Task id ${task.taskId}; content: ${task.content} on check.`)
    task.onFlag = () =>
      console.log(`Task id ${task.taskId}; content: ${task.content} on flag.`)
  })

  const rearrangeTasks = (tasks) => {
    // TODO implement this
    return tasks
  }

  const tasksGroup = [{ items: rearrangeTasks(incompletedTasks) }]

  if (completedTasks.length > 0) {
    tasksGroup.push({ name: 'Completed tasks', items: rearrangeTasks(completedTasks) })
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
          <Stack.Item align='stretch'>
            <CollectionHeader
              name={name}
              isLoading={isProcessing}
              onEdit={value => {
                const oldName = name

                setName(value)
                setIsProcessing(true)

                updateCollection(cid, value).then(result => {
                  if (isUndefined(result)) {
                    setName(oldName)
                  }
                }).finally(_ => {
                  setIsProcessing(false)
                })
              }}
              onDelete={_ => {
                // TODO implement this
                console.log('Delete invoked')
              }}
              onSort={newSortType => {
                if (newSortType !== sortType) setSortType(newSortType)
              }}
              sortType={sortType}
            />
          </Stack.Item>

          <Stack.Item align='stretch'>
            <Text variant={'small'} className='px-3'>
              {fromEpochToLocalDatetime(creationDate).toUTCString()}
            </Text>
          </Stack.Item>

          <Stack.Item align='stretch' className='py-3'>
            <TasksList tasksGroup={tasksGroup} />
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

const TasksList = ({ tasksGroup }) => {
  return (
    <Stack>
      <Stack.Item align={'stretch'} styles={{ root: { height: '50px' } }}>
        <InsertField onInsert={console.log} />
      </Stack.Item>

      <Stack.Item align={'stretch'}>
        {tasksGroup.map(({ name, items }, i) => {
          return <TasksContainer key={i} groupName={name} tasks={items} />
        })}
      </Stack.Item>
    </Stack>
  )
}
