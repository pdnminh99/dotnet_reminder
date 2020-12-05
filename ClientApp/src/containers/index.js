import React, { useState } from 'react'
import { Stack, DefaultPalette, Panel } from '@fluentui/react'
import '../components/Reminder.css'
import { Route, Switch, Redirect, useLocation } from 'react-router-dom'
import { CollectionNav } from './CollectionNav'
import { TopNav } from '../components/TopNav'
import { CustomCollection } from './CustomCollection'
import { FlaggedCollection } from './FlaggedCollection'
import { PlannedCollection } from './PlannedCollection'
import { TasksCollection } from './TasksCollection'
import { TodayCollection } from './TodayCollection'

const bodyStyles = {
  root: {
    alignItems: 'center',
    color: DefaultPalette.white,
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
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
            <Switch>
              <Route exact path={'/'}>
                <Redirect to='/today' />
              </Route>
              <Route exact path={'/today'} component={TodayCollection} />
              <Route exact path={'/planned'} component={PlannedCollection} />
              <Route exact path={'/flagged'} component={FlaggedCollection} />
              <Route exact path={'/tasks'} component={TasksCollection} />
              <Route
                exact
                path={'/collection/:cid'}
                component={CustomCollection}
              />
            </Switch>
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
