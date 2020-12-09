import React from 'react'
import '../components/Reminder.css'
import { NoContent } from '../components/EmptyTasksList'
import { DefaultCollection } from './DefaultCollection'
import { getAllTasks, getFlaggedTasks, getPlannedTasks } from '../operations'

export const TodayCollection = _ => {
  return <NoContent width={800} height={450} />
}

export const PlannedCollection = _ => {
  return (
    <DefaultCollection
      fetchAPI={getPlannedTasks}
      collectionName={'Planned tasks'}
    />
  )
}

export const TasksCollection = _ => {
  return (
    <DefaultCollection fetchAPI={getAllTasks} collectionName={'All Tasks'} />
  )
}

export const FlaggedCollection = _ => {
  return (
    <DefaultCollection
      fetchAPI={getFlaggedTasks}
      collectionName={'Flagged tasks'}
    />
  )
}
