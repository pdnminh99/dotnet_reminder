import {
  FocusZone,
  FocusZoneDirection,
  Icon,
  IconButton,
  List,
  Stack,
  Text,
} from '@fluentui/react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Reminder.css'

export const CollectionNav = ({ standardCollections, customCollections }) => {
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

const OnRenderCollection = ({ name, icon, url, color, isActive }) => {
  icon = icon || 'AllApps'

  let style = 'px-3 cursor-pointer '
  style += isActive ? 'ms-bgColor-gray30' : 'ms-bgColor-white--hover'

  let textStyle = {
    root: { fontSize: '16px', fontWeight: isActive ? '500' : '350' },
  }
  if (isActive) {
    if (color !== undefined) textStyle.root.color = color
  } else textStyle.root.color = '#34373d'

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
