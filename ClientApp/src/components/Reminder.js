import React, { useEffect, useState } from 'react'
import { Stack, DefaultPalette, Text, Icon, TextField, List, FocusZone, FocusZoneDirection } from '@fluentui/react'
import './Reminder.css'
import { Link, useLocation } from 'react-router-dom'
import { matchPath } from 'react-router'
import authService from './api-authorization/AuthorizeService'

const bodyStyles = {
  root: {
    alignItems: 'center',
    color: DefaultPalette.white,
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
  },
}

const standardCollections = [{
  name: 'Today',
  icon: 'Brightness',
  url: '/today',
}, {
  name: 'Planned',
  icon: 'Calendar',
  color: 'green',
  url: '/planned',
}, {
  name: 'Flagged',
  icon: 'Flag',
  url: '/flagged',
}, {
  name: 'Tasks',
  icon: 'TaskLogo',
  url: '/tasks',
}]

const customCollections = [{
  name: 'HSU',
  url: '/collection/1',
}, {
  name: 'Personal',
  color: 'green',
  url: '/collection/2',
}, {
  name: 'Shopping',
  url: '/collection/3',
}, {
  name: 'Study',
  url: '/collection/4',
}]

const TaskContainer = ({ pathname }) => {
  return <h1>Hello, you are currently at {pathname}</h1>
}

export const Reminder = () => {
  const currentRoute = useLocation()
  const [collections, setCollections] = useState([])

  for (let item of standardCollections)
    item.isActive = !!matchPath(currentRoute.pathname, item.url)

  async function retrieveCollections() {
    const token = await authService.getAccessToken()
    const response = await fetch('/api/v1/Collection?includeTasks=true', {
      headers: !token ? {} : { 'Authorization': `Bearer ${token}` },
    })
    return await response.json()
  }

  useEffect(async () => {
    let collections = await retrieveCollections()
    console.log(collections)
    setCollections(collections)
  }, [])

  return <>
    <Stack styles={{ root: { height: '100%' } }}>
      <Stack.Item align="auto" grow={0} styles={{ root: { height: '50px', color: '#FFF' } }} className='bg-azure'>

        <Stack horizontal className='h-100 w-100'>
          <Stack.Item align='stretch' grow={0} className='cursor-pointer px-4'>
            <Stack horizontal className='h-100 w-100'>
              <Stack.Item align='center'>
                <Icon iconName={'WaffleOffice365'} />
              </Stack.Item>
            </Stack>
          </Stack.Item>

          <Stack.Item align='stretch' grow={1}>
            <Stack horizontal className='h-100 w-100'>
              <Stack.Item align="center">
                <Text variant={'large'}>Reminder</Text>
              </Stack.Item>
            </Stack>
          </Stack.Item>

          <Stack.Item align='stretch' grow={3}>
            <Stack className='h-100 w-100' verticalAlign='center' horizontalAlign='center'>
              <Stack.Item align='stretch'>
                <TextField className='mx-auto w-50' iconProps={{ iconName: 'Calendar' }} />
              </Stack.Item>
            </Stack>
          </Stack.Item>

          <Stack.Item align='stretch' grow={1}>
            <Stack horizontal className='h-100 w-100'>
              <Stack.Item align="center">
                <Text variant={'large'}>Reminder</Text>
              </Stack.Item>
            </Stack>
          </Stack.Item>
        </Stack>

      </Stack.Item>

      <Stack.Item grow={1} align="auto" styles={bodyStyles}>
        <Stack.Item styles={{ root: { color: '#000', width: '290px' } }}
                    align='stretch'
                    grow={0}
                    className='ms-bgColor-gray10 h-100 py-2'>
          <FocusZone direction={FocusZoneDirection.vertical}>
            <List items={standardCollections} onRenderCell={OnRenderCollection} className='py-3' />
            <List items={customCollections} onRenderCell={OnRenderCollection} />
          </FocusZone>
        </Stack.Item>

        <Stack.Item align='stretch' grow={3} className='ms-depth-4 ms-fontWeight-bold ms-fontColor-alert p-3 h-100'>
          <TaskContainer pathname={currentRoute.pathname} />
        </Stack.Item>

      </Stack.Item>
    </Stack>
  </>
}

const OnRenderCollection = ({ name, icon, url, color, isActive }) => {
  icon = icon || 'AllApps'

  let style = 'px-4 cursor-pointer '
  style += isActive ? 'ms-bgColor-gray30' : 'ms-bgColor-white--hover'

  let textStyle = { root: { fontWeight: isActive ? '500' : '350' } }
  if (isActive) {
    if (color !== undefined) textStyle.root.color = color
  } else textStyle.root.color = '#000'

  return <div className={style}>
    <Link to={url} style={{ textDecoration: 'none' }}>
      <Stack horizontal styles={{ root: { height: '36px' } }} tokens={{ childrenGap: 13 }}>
        <Stack.Item horizontal align="center">
          <Icon iconName={icon} styles={textStyle} />
        </Stack.Item>

        <Stack.Item horizontal align="center">
          <Text nowrap variant={'medium'} styles={textStyle}>{name}</Text>
        </Stack.Item>
      </Stack>
    </Link>
  </div>
}
