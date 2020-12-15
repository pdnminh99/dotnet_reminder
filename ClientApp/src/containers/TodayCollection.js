import React from 'react'
import '../components/Reminder.css'
import { NoContent } from '../components/EmptyTasksList'
import { DefaultCollection } from './DefaultCollection'
import { getAllTasks, getFlaggedTasks, getPlannedTasks } from '../operations'
import { TaskSortType } from '../enums'

export const TodayCollection = _ => {
  return <NoContent width={800} height={450} />
}

export const PlannedCollection = _ => {
  return (
    <DefaultCollection
      fetchAPI={getPlannedTasks}
      collectionName={'Planned tasks'}
      sortType={TaskSortType.DueDate}
    />
  )
}

export const TasksCollection = _ => {
  return (
    <DefaultCollection
      fetchAPI={getAllTasks}
      collectionName={'All Tasks'}
      sortType={TaskSortType.Default}
    />
  )
}

export const FlaggedCollection = _ => {
  return (
    <DefaultCollection
      fetchAPI={getFlaggedTasks}
      collectionName={'Flagged tasks'}
      sortType={TaskSortType.Default}
    />
  )
}
