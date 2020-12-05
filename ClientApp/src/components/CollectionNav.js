import {
  FocusZone,
  FocusZoneDirection,
  Icon,
  IconButton,
  List,
  Stack,
  Text,
} from '@fluentui/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './Reminder.css'
import { InsertField } from './InsertField'
import { isNotUndefined } from '../utils'
import { standardCollections } from '../dummy_data'
import { matchPath } from 'react-router'
import authService from './api-authorization/AuthorizeService'

// These functions are not related to hooks. So I hosted these as module global functions.
const retrieveCollections = async () => {
  const token = await authService.getAccessToken()
  const response = await fetch('/api/v1/Collection', {
    headers: !token ? {} : { Authorization: `Bearer ${token}` },
  })
  if (response.status == 200) return await response.json()
  return undefined
}

const preprocessCollection = ({ collectionId, name }) => ({
  name,
  url: `/collection/${collectionId}`,
  icon: 'BulletedList2',
  color: '#0078d7',
  defaultColor: '#0078d7',
})

export const CollectionNav = ({ pathname }) => {
  const [collapsed, setCollapsed] = useState(false)

  const [defaults, setDefaults] = useState(standardCollections)

  const [collections, setCollections] = useState([])

  useEffect(async () => {
    let collections = await retrieveCollections()

    if (isNotUndefined(collections)) {
      setCollections(collections.map(preprocessCollection))
    }
  }, [])

  const lookAndSetActiveCollection = () => {
    setDefaults(
      defaults.map(c => ({
        ...c,
        isActive: !!matchPath(pathname, c.url),
      })),
    )
    setCollections(
      collections.map(c => ({
        ...c,
        isActive: !!matchPath(pathname, c.url),
      })),
    )
  }

  useEffect(lookAndSetActiveCollection, [pathname])

  const onCollapsedClick = () => setCollapsed(!collapsed)

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
        <Stack align={'stretch'}>
          <Stack.Item>
            <CollapseButton onCollapsedClick={onCollapsedClick} />
          </Stack.Item>

          {/* Default collections */}
          <Stack.Item>
            <List
              items={defaults}
              onRenderCell={props => OnRenderCollection(props)}
              className='py-3'
            />
          </Stack.Item>

          {/* User created collection */}
          <Stack.Item>
            <List
              items={collections}
              onRenderCell={props => OnRenderCollection(props)}
            />
          </Stack.Item>

          <Stack.Item
            className='ms-bgColor-white--hover'
            align={'stretch'}
            styles={{ root: { height: '37px' } }}
          >
            <InsertField isTaskInsertField={false} />
          </Stack.Item>
        </Stack>
      </FocusZone>
    </Stack.Item>
  )
}

const OnRenderCollection = ({
  name,
  icon,
  url,
  // active color
  color,
  // default color when not active
  defaultColor,
  isActive,
}) => {
  let style = 'px-3 cursor-pointer '
  style += isActive ? 'ms-bgColor-gray30' : 'ms-bgColor-white--hover'

  let textStyle = {
    root: { fontSize: '16px', fontWeight: isActive ? '500' : '350' },
  }
  if (isActive) {
    if (isNotUndefined(defaultColor)) textStyle.root.color = color
  } else if (isNotUndefined(defaultColor)) textStyle.root.color = defaultColor
  else textStyle.root.color = '#34373d'

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
            <Text
              nowrap
              variant={'medium'}
              styles={textStyle}
              className='font-sans'
            >
              {name}
            </Text>
          </Stack.Item>
        </Stack>
      </Link>
    </div>
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
              styles: { root: { color: '#000', fontSize: '14px' } },
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
