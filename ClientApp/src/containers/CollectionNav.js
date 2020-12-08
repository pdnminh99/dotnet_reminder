import {
  FocusZone,
  FocusZoneDirection,
  FontIcon,
  IconButton,
  List,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
} from '@fluentui/react'
import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import '../components/Reminder.css'
import { InsertField } from '../components'
import {
  CollectionUpdateNotifierContext,
  isNotUndefined,
  isUndefined,
} from '../utils'
import { standardCollections } from '../dummy_data'
import { matchPath, useHistory } from 'react-router'
import { createCollection, retrieveCollections } from '../operations'
import { NotifierType } from '../enums'

const preprocessCollection = ({ collectionId, name }) => ({
  collectionId: collectionId,
  name,
  url: isNotUndefined(collectionId) ? `/collection/${collectionId}` : undefined,
  icon: 'BulletedList2',
  color: '#0078d7',
  defaultColor: '#0078d7',
})

export const CollectionNav = ({ pathname }) => {
  // Use Context API to communicate with CustomCollection.
  const { notifier, setNotifier } = useContext(CollectionUpdateNotifierContext)

  const history = useHistory()

  useEffect(() => {
    if (isNotUndefined(notifier)) {
      const { type, collection } = notifier

      if (type === NotifierType.Delete) {
        setCollections(
          collections
            .filter(c => c.collectionId !== collection.collectionId)
            .map(c => ({
              ...c,
              isActive: !!matchPath(pathname, c.url),
            })),
        )
      }

      if (type === NotifierType.Update) {
        setCollections(
          collections.map(c => {
            let result = {
              ...c,
              isActive: !!matchPath(pathname, c.url),
            }

            if (result.collectionId === collection.collectionId) {
              result.name = collection.name
            }

            return result
          }),
        )
      }

      setNotifier(undefined)
    }
  }, [notifier])

  const [collapsed, setCollapsed] = useState(false)

  const [defaults, setDefaults] = useState(standardCollections)

  const [collections, setCollections] = useState([])

  useEffect(() => {
    async function fetchCollections() {
      let collections = await retrieveCollections()

      if (isNotUndefined(collections)) {
        setCollections(
          collections.map(preprocessCollection).map(c => ({
            ...c,
            isActive: !!matchPath(pathname, c.url),
          })),
        )
      }
    }

    fetchCollections()
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

  useEffect(() => {
    lookAndSetActiveCollection()
  }, [pathname])

  const onCollapsedClick = () => setCollapsed(!collapsed)

  const onInsert = v => {
    if (v.trim().length === 0) return

    const creationEpoch = Date.now()

    setCollections(current => [
      ...current,
      {
        name: v,
        color: '#0078d7',
        defaultColor: '#0078d7',
        icon: 'BulletedList2',
        isSyncing: creationEpoch,
        isActive: false,
      },
    ])

    createCollection(v).then(newCollection => {
      if (isUndefined(newCollection)) {
        setCollections(collections.filter(c => c.isSyncing !== creationEpoch))
      } else {
        setCollections(current => {
          return current.map(c => {
            if (c.isSyncing !== creationEpoch) return c
            c.url = `/collection/${newCollection.collectionId}`
            c.isSyncing = undefined
            return c
          })
        })

        history.push(`/collection/${newCollection.collectionId}`)
      }
    })
  }

  return (
    <Stack.Item
      styles={{
        root: {
          color: '#000',
          width: collapsed ? '48px' : '290px',
          overflow: 'auto',
        },
      }}
      align='stretch'
      grow={0}
      className='ms-bgColor-gray10 h-100 py-3'
    >
      <FocusZone direction={FocusZoneDirection.vertical}>
        <Stack align={'stretch'}>
          <CollapseButton onCollapsedClick={onCollapsedClick} grow={0} />

          {/* Default collections */}
          <Stack.Item grow={0}>
            <List
              items={defaults}
              onRenderCell={OnRenderCollection}
              className='py-3'
            />
          </Stack.Item>

          {/* User created collection */}
          <List items={collections} onRenderCell={OnRenderCollection} />

          <Stack.Item
            className='ms-bgColor-white--hover'
            styles={{ root: { height: '37px' } }}
          >
            <InsertField onInsert={onInsert} isTaskInsertField={false} />
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
  isSyncing,
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

  const collectionDisplayContent = (
    <Stack
      horizontal
      styles={{ root: { height: '36px' } }}
      tokens={{ childrenGap: 15 }}
    >
      <Stack.Item horizontal align='center'>
        {isNotUndefined(isSyncing) ? (
          <Spinner size={SpinnerSize.small} />
        ) : (
          <FontIcon iconName={icon} styles={textStyle} />
        )}
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
  )

  return (
    <div className={style}>
      {isNotUndefined(url) ? (
        <Link to={url} style={{ textDecoration: 'none' }}>
          {collectionDisplayContent}
        </Link>
      ) : (
        <>{collectionDisplayContent}</>
      )}
    </div>
  )
}

const CollapseButton = ({ onCollapsedClick }) => {
  return (
    <div className='px-2'>
      <Stack horizontal styles={{ root: { height: '36px' } }}>
        <Stack.Item align='center'>
          <IconButton
            className={'outline-none'}
            iconProps={{ iconName: 'CollapseMenu' }}
            styles={{ root: { color: '#000' } }}
            onClick={onCollapsedClick}
            disabled={false}
            checked={false}
          />
        </Stack.Item>
      </Stack>
    </div>
  )
}
