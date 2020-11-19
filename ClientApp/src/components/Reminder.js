import React, { useEffect, useState } from 'react'
import {
  Stack,
  DefaultPalette,
  Text,
  DefaultButton,
  Panel,
  Icon,
  FocusZone,
} from '@fluentui/react'
import './Reminder.css'
import { useLocation } from 'react-router-dom'
import { matchPath } from 'react-router'
import authService from './api-authorization/AuthorizeService'
import { CollectionNav } from './CollectionNav'
import { TaskDetail } from './TaskDetail'
import { TopNav } from './TopNav'
import { TaskHeader } from './TaskHeader'
import { customCollections, standardCollections } from './dummy_data'
import { useText } from './custom_hooks'

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

export const Reminder = () => {
  const currentRoute = useLocation()

  const [collections, setCollections] = useState([])

  const [collapsed, setCollapsed] = useState(true)

  function onCollapsedClick() {
    setCollapsed(!collapsed)
  }

  for (let item of standardCollections)
    item.isActive = !!matchPath(currentRoute.pathname, item.url)

  async function retrieveCollections() {
    const token = await authService.getAccessToken()
    const response = await fetch('/api/v1/Collection?includeTasks=true', {
      headers: !token ? {} : { Authorization: `Bearer ${token}` },
    })
    if (response.status === 200) return await response.json()
    return undefined
  }

  useEffect(() => {
    console.log('Use effect run')
    // let collections = await retrieveCollections()
    // if (collections !== undefined) setCollections(collections)
  }, [])

  return (
    <>
      <Stack styles={{ root: { height: '100%' } }}>
        <Stack.Item
          align='auto'
          grow={0}
          styles={{ root: { height: '50px', color: '#FFF' } }}
          className='bg-azure'
        >
          <TopNav onCollapsedClick={onCollapsedClick} />
        </Stack.Item>

        <Stack.Item grow={1} align='auto' styles={bodyStyles}>
          <CollectionNav standardCollections={standardCollections} customCollections={customCollections} />
          <Stack.Item align='stretch' grow={3} className='ms-depth-4 h-100'>
            <TaskContainer pathname={currentRoute.pathname} />
          </Stack.Item>
        </Stack.Item>

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

const TaskContainer = ({ pathname }) => {

  const [isDetailActive, setDetailActive] = useState(false)

  return (
    <Stack horizontal className='h-100 w-100'>
      <Stack.Item
        grow={1}
        align='stretch'
        className='px-2 py-3'
        styles={{ root: { color: '#000', background: '#FFF' } }}
      >
        <Stack>
          <Stack.Item align='stretch'>
            <TaskHeader pathname={pathname} onDetailPanelToggle={() => setDetailActive(!isDetailActive)} />
          </Stack.Item>

          <Stack.Item align='stretch'>
            <Text variant={'small'} className='px-3'>
              Sunday, September 26th, 2020
            </Text>
          </Stack.Item>

          <Stack.Item align='stretch' className='py-3'>
            <TasksList />
          </Stack.Item>
        </Stack>
      </Stack.Item>

      {isDetailActive && <Stack.Item
        align='stretch'
        grow={0}
        className='ms-bgColor-gray10'
        styles={taskDetailStyles}
      >
        <TaskDetail />
      </Stack.Item>}
    </Stack>
  )
}

const TasksList = () => {
  return <Stack>
    <Stack.Item align={'stretch'} className={'px-3'} styles={{ root: { height: '50px' } }}>
      <TaskInsertField />
    </Stack.Item>

    <Stack.Item align={'stretch'}>

    </Stack.Item>
  </Stack>
}

const TaskInsertField = () => {
  const [isFocus, setIsFocus] = useState(false)
  const { value, setValue, handleOnChange, setCancelActive, isCancelActive } = useText('')

  function onInputLoseFocus() {
    setValue('')
    setCancelActive(false)
    setIsFocus(false)
  }

  function handleOnFocus() {
    setIsFocus(true)
  }

  return <FocusZone className={`w-100 h-100 ${isFocus ? 'border-b-azure' : 'border-b-gray'}`}
                    onFocus={handleOnFocus}
                    onBlur={onInputLoseFocus}>
    <Stack horizontal className={'h-100 w-100'}>
      <Stack.Item grow={0} align={'center'} className={'px-2'}>
        <Icon iconName="Add" styles={{ root: { color: '#0078D7', fontSize: '16px' } }} />
      </Stack.Item>

      <Stack.Item grow={1} align={'stretch'} styles={{ root: { paddingRight: '5px' } }}>
        <input
          type='text'
          style={{ border: 'none' }}
          className='w-100 h-100 px-2'
          placeholder={'Add a task'}
          onChange={handleOnChange}
          value={value}
        />
      </Stack.Item>

      {isCancelActive && <Stack.Item grow={0} align={'center'}>
        <DefaultButton text={'Add'} styles={{ root: { border: 'none', color: '#0078D7' } }} />
      </Stack.Item>}
    </Stack>
  </FocusZone>
}
