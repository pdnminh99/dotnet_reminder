import React, { useState } from 'react'
import { DefaultPalette, Panel, PrimaryButton, Stack } from '@fluentui/react'
import '../components/Reminder.css'
import { Link, Redirect, Route, Switch, useLocation } from 'react-router-dom'
import { CollectionNav } from './CollectionNav'
import { TopNav } from '../components'
import { CustomCollection } from './CustomCollection'
import {
  TodayCollection,
  PlannedCollection,
  TasksCollection,
  FlaggedCollection,
} from './TodayCollection'
import { SearchContainer } from './SearchContainer'
import { CollectionUpdateNotifierContext } from '../utils'
import { NoContent } from '../components/EmptyTasksList'
import { ApplicationPaths } from '../components/api-authorization/ApiAuthorizationConstants'

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

  const [searchValue, setSearchValue] = useState('')

  const [notifier, setNotifier] = useState(undefined)

  const onCollapsedClick = () => setCollapsed(!collapsed)

  return (
    <Stack styles={{ root: { height: '100%' } }}>
      {/* Rendering topnav */}
      <Stack.Item
        align='auto'
        grow={0}
        styles={{ root: { height: '50px', color: '#FFF' } }}
        className='bg-azure'
      >
        <TopNav
          onSearchValueChange={setSearchValue}
          onCollapsedClick={onCollapsedClick}
        />
      </Stack.Item>

      {/* Rendering body */}
      <Stack.Item grow={1} align='auto' styles={bodyStyles}>
        <CollectionUpdateNotifierContext.Provider
          value={{ notifier, setNotifier }}
        >
          {/* Rendering left nav (or collections list)*/}
          <CollectionNav pathname={currentRoute.pathname} />

          {/* Rendering main content */}
          <Stack.Item align='stretch' grow={3} className='ms-depth-4 h-100'>
            {searchValue.trim().length > 0 ? (
              <SearchContainer searchValue={searchValue} />
            ) : (
              <Switch>
                <Route exact path={'/'}>
                  <Redirect to='/today' />
                </Route>
                <Route path={'/today'} component={TodayCollection} />
                <Route path={'/planned'} component={PlannedCollection} />
                <Route path={'/flagged'} component={FlaggedCollection} />
                <Route path={'/tasks'} component={TasksCollection} />
                <Route
                  exact
                  path={'/collection/:cid'}
                  component={CustomCollection}
                />
                <Route path={'*'}>
                  <Redirect to='/today' />
                </Route>
              </Switch>
            )}
          </Stack.Item>
        </CollectionUpdateNotifierContext.Provider>
      </Stack.Item>

      {/* Right panel */}
      <Panel
        headerText='Profile'
        isOpen={!collapsed}
        className={'px-2'}
        onDismiss={onCollapsedClick}
        closeButtonAriaLabel='Close'
      >
        <NoContent />

        <Link
          to={{
            pathname: `${ApplicationPaths.LogOut}`,
            state: { local: true },
          }}
        >
          <PrimaryButton className={'w-100 mt-3'} text={'Sign out'} />
        </Link>
      </Panel>
    </Stack>
  )
}
