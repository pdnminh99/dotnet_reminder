import React, { useEffect, useState } from 'react'
import {
  Stack,
  DefaultPalette,
  Text,
  Icon,
  TextField,
  List,
  IconButton,
  Panel,
  FocusZone,
  FocusZoneDirection,
  ContextualMenuItemType,
} from '@fluentui/react'
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

const standardCollections = [
  {
    name: 'Today',
    icon: 'Brightness',
    url: '/today',
  },
  {
    name: 'Planned',
    icon: 'Calendar',
    color: 'green',
    url: '/planned',
  },
  {
    name: 'Flagged',
    icon: 'Flag',
    url: '/flagged',
  },
  {
    name: 'Tasks',
    icon: 'TaskLogo',
    url: '/tasks',
  },
]

const customCollections = [
  {
    name: 'HSU',
    url: '/collection/1',
  },
  {
    name: 'Personal',
    color: 'green',
    url: '/collection/2',
  },
  {
    name: 'Shopping',
    url: '/collection/3',
  },
  {
    name: 'Study',
    url: '/collection/4',
  },
]

const TaskContainer = ({ pathname }) => {
  const menuProps = () => ({
    shouldFocusOnMount: true,
    items: [
      {
        key: 'Actions',
        itemType: ContextualMenuItemType.Header,
        text: 'Actions',
        itemProps: { lang: 'en-us' },
      },
      {
        key: 'upload',
        iconProps: { iconName: 'Upload', style: { color: 'salmon' } },
        text: 'Upload',
        title: 'Upload a file',
      },
      { key: 'rename', text: 'Rename' },
      {
        key: 'navigation',
        itemType: ContextualMenuItemType.Header,
        text: 'Navigation',
      },
      { key: 'properties', text: 'Properties' },
      { key: 'print', iconProps: { iconName: 'Print' }, text: 'Print' },
      {
        key: 'Bing',
        text: 'Go to Bing',
        href: 'http://www.bing.com',
        target: '_blank',
      },
    ],
  })

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
            <Stack horizontal>
              <Stack.Item align='stretch'>
                <Text variant={'xLarge'} className='px-3'>
                  {pathname}
                </Text>
              </Stack.Item>

              <Stack.Item align='stretch'>
                <IconButton
                  iconProps={{
                    iconName: 'More',
                    styles: { root: { color: '#000', fontSize: '16px' } },
                  }}
                  title='CollapseMenu'
                  ariaLabel='CollapseMenu'
                  disabled={false}
                  borderless={true}
                  menuProps={menuProps}
                />
              </Stack.Item>
            </Stack>
          </Stack.Item>

          <Stack.Item align='stretch'>
            <Text variant={'small'} className='px-3'>
              Sunday, September 26th, 2020
            </Text>
          </Stack.Item>

          <Stack.Item align='stretch' className='py-3'>
            Collection goes here
          </Stack.Item>
        </Stack>
      </Stack.Item>
      <Stack.Item
        align='stretch'
        grow={0}
        className='ms-bgColor-gray10'
        styles={{
          root: {
            background: 'red',
            width: '360px',
            borderColor: 'lightgray',
            borderWidth: '1px',
            borderStyle: 'solid',
          },
        }}
      >
        <div>This is the right nav</div>
      </Stack.Item>
    </Stack>
  )
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

  useEffect(async () => {
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
          <Stack horizontal className='h-100 w-100'>
            <Stack.Item
              align='stretch'
              grow={0}
              className='cursor-pointer px-3 bg-azure-dark--hover'
            >
              <Stack horizontal className='h-100 w-100'>
                <Stack.Item align='center'>
                  <Icon iconName={'WaffleOffice365'} />
                </Stack.Item>
              </Stack>
            </Stack.Item>

            <Stack.Item align='stretch' grow={0}>
              <Stack horizontal className='h-100 w-100 px-2'>
                <Stack.Item align='center'>
                  <Text variant={'large'}>Reminder</Text>
                </Stack.Item>
              </Stack>
            </Stack.Item>

            <Stack.Item align='stretch' grow={3}>
              <Stack
                className='h-100 w-100'
                verticalAlign='center'
                horizontalAlign='center'
              >
                <Stack.Item align='stretch'>
                  <TextField
                    className='mx-auto w-50 rounded'
                    inputClassName='bg-azure-light'
                    borderless={true}
                    styles={{ root: { borderRadius: '10px' } }}
                    iconProps={{
                      iconName: 'Search',
                      styles: { root: { color: '#0078D7' } },
                    }}
                  />
                </Stack.Item>
              </Stack>
            </Stack.Item>

            <Stack.Item
              align='stretch'
              grow={0}
              className='cursor-pointer px-4 bg-azure-dark--hover'
            >
              <Stack
                horizontal
                className='h-100 w-100'
                tokens={{ childrenGap: 10 }}
                onClick={onCollapsedClick}
              >
                <Stack.Item align='center'>
                  <Text variant={'medium'}>hello@gmail.com</Text>
                </Stack.Item>
                <Stack.Item align='center'>
                  <Icon iconName={'PlayerSettings'} />
                </Stack.Item>
              </Stack>
            </Stack.Item>
          </Stack>
        </Stack.Item>

        <Stack.Item grow={1} align='auto' styles={bodyStyles}>
          <CollectionNav />
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

const CollectionNav = () => {
  const [collapsed, setCollapsed] = useState(false)

  function onCollapsedClick() {
    setCollapsed(!collapsed)
  }

  return (
    <Stack.Item
      styles={{
        root: {
          color: '#000',
          width: collapsed ? '48px' : '290px',
          overflow: 'hidden',
        },
      }}
      align='stretch'
      grow={0}
      className='ms-bgColor-gray10 h-100 py-3'
    >
      <FocusZone direction={FocusZoneDirection.vertical}>
        <CollapseButton onCollapsedClick={onCollapsedClick} />
        <List
          items={standardCollections}
          onRenderCell={OnRenderCollection}
          className='py-3'
        />
        <List items={customCollections} onRenderCell={OnRenderCollection} />
      </FocusZone>
    </Stack.Item>
  )
}

const CollapseButton = ({ onCollapsedClick }) => {
  return (
    <div className='px-2'>
      <Stack horizontal styles={{ root: { height: '36px' } }}>
        <Stack.Item align='center'>
          <IconButton
            iconProps={{
              iconName: 'CollapseMenu',
              styles: { root: { color: '#000', fontSize: '16px' } },
            }}
            title='CollapseMenu'
            secondaryText='collapsed'
            ariaLabel='CollapseMenu'
            onClick={onCollapsedClick}
            disabled={false}
            borderless={true}
            checked={false}
          />
        </Stack.Item>
      </Stack>
    </div>
  )
}

const OnRenderCollection = ({ name, icon, url, color, isActive }) => {
  icon = icon || 'AllApps'

  let style = 'px-3 cursor-pointer '
  style += isActive ? 'ms-bgColor-gray30' : 'ms-bgColor-white--hover'

  let textStyle = {
    root: { fontSize: '16px', fontWeight: isActive ? '500' : '350' },
  }
  if (isActive) {
    if (color !== undefined) textStyle.root.color = color
  } else textStyle.root.color = '#000'

  return (
    <div className={style}>
      <Link to={url} style={{ textDecoration: 'none' }}>
        <Stack
          horizontal
          styles={{ root: { height: '36px' } }}
          tokens={{ childrenGap: 15 }}
        >
          <Stack.Item horizontal align='center'>
            <Icon iconName={icon} styles={textStyle} />
          </Stack.Item>

          <Stack.Item horizontal align='center'>
            <Text nowrap variant={'medium'} styles={textStyle}>
              {name}
            </Text>
          </Stack.Item>
        </Stack>
      </Link>
    </div>
  )
}
