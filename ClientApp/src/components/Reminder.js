import React, { useState } from 'react'
import { Stack, DefaultPalette, Text, Panel } from '@fluentui/react'
import './Reminder.css'
import { useLocation } from 'react-router-dom'
import { CollectionNav } from './CollectionNav'
import { TaskDetail } from './TaskDetail'
import { TopNav } from './TopNav'
import { CollectionHeader } from './CollectionHeader'
import { sampleCollections } from '../dummy_data'
import { InsertField } from './InsertField'
import { TasksContainer } from './TasksContainer'
import { isUndefined, fromEpochToLocalDatetime } from '../utils'

const bodyStyles = {
  root: {
    alignItems: 'center',
    color: DefaultPalette.white,
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
  },
}

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

// Application root
export const Reminder = () => {
  const currentRoute = useLocation()

  const [collapsed, setCollapsed] = useState(true)

  const onCollapsedClick = () => setCollapsed(!collapsed)

  return (
    <>
      <Stack styles={{ root: { height: '100%' } }}>
        {/* Rendering topnav */}
        <Stack.Item
          align='auto'
          grow={0}
          styles={{ root: { height: '50px', color: '#FFF' } }}
          className='bg-azure'
        >
          <TopNav onCollapsedClick={onCollapsedClick} />
        </Stack.Item>

        {/* Rendering body */}
        <Stack.Item grow={1} align='auto' styles={bodyStyles}>
          {/* Rendering left nav (or collections list)*/}
          <CollectionNav pathname={currentRoute.pathname} />

          {/* Rendering main content */}
          <Stack.Item align='stretch' grow={3} className='ms-depth-4 h-100'>
            <Content pathname={currentRoute.pathname} />
          </Stack.Item>
        </Stack.Item>

        {/* Right panel */}
        <Panel
          headerText='Sample panel'
          isOpen={!collapsed}
          onDismiss={onCollapsedClick}
          closeButtonAriaLabel='Close'
        >
          <p>Content goes here.</p>
        </Panel>
      </Stack>
    </>
  )
}

const Content = ({ pathname }) => {
  const [isDetailActive, setDetailActive] = useState(false)
  const [selectedTask, setSelectedTask] = useState(undefined)

  // useEffect(() => {
  //   console.log(pathname)
  // }, [pathname])

  let collection = sampleCollections[pathname]

  if (isUndefined(collection)) return <h1 style={{ color: 'red' }}>Error</h1>

  collection.completedTasks.forEach(task => {
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

  collection.incompletedTasks.forEach(task => {
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

  const tasksGroup = [
    { items: collection.completedTasks },
    { name: 'Completed tasks', items: collection.incompletedTasks },
  ]

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
            <CollectionHeader name={collection.name} />
          </Stack.Item>

          <Stack.Item align='stretch'>
            <Text variant={'small'} className='px-3'>
              {fromEpochToLocalDatetime(collection.creationDate).toUTCString()}
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
