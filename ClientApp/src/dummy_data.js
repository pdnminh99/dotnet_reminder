export const standardCollections = [
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

const tasks = [
  {
    taskId: 0,
    content: 'Do homework',
    dueDate: 'yesterday',
    isFlagged: false,
    isCompleted: false,
  },
  {
    taskId: 1,
    content: 'Do chores',
    dueDate: 'yesterday',
    isFlagged: false,
    isCompleted: false,
  },
  {
    taskId: 2,
    content: 'Do Math exams',
    dueDate: 'yesterday',
    isFlagged: true,
    isCompleted: true,
  },
  {
    taskId: 3,
    content: 'Play League of Legends',
    dueDate: 'yesterday',
    isFlagged: false,
    isCompleted: true,
  },
  {
    taskId: 4,
    content: 'Do homework',
    dueDate: 'yesterday',
    isFlagged: false,
    isCompleted: false,
  },
]

export const sampleCollections = {
  '/today': {
    name: 'Today',
    creationDate: 1605733664182,
    completedTasks: tasks,
    incompletedTasks: tasks,
  },
  '/planned': {
    name: 'Planned',
    creationDate: 1605733664182,
    completedTasks: tasks,
    incompletedTasks: tasks,
  },
  '/flagged': {
    name: 'Flags',
    creationDate: 1605733664182,
    completedTasks: tasks,
    incompletedTasks: tasks,
  },
}
