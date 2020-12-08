import authService from './components/api-authorization/AuthorizeService'

export const retrieveCollections = async () => {
  const token = await authService.getAccessToken()

  if (!token) {
    console.error('Cannot send GET request without being authenticated.')
  } else {
    const response = await fetch('/api/v1/Collection', {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (response.status === 200) return await response.json()
  }

  return undefined
}

export const createCollection = async name => {
  const token = await authService.getAccessToken()

  if (!token) {
    console.error('Cannot send POST request without being authenticated.')
  } else {
    const response = await fetch('/api/v1/Collection', {
      method: 'POST',
      body: JSON.stringify({ name }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (response.status === 200) return await response.json()
  }

  return undefined
}

export const updateCollection = async (collectionId, name) => {
  const token = await authService.getAccessToken()

  if (!token) {
    console.error('Cannot send PATCH request without being authenticated.')
  } else {
    const response = await fetch(`/api/v1/Collection/${collectionId}`, {
      method: 'PATCH',
      body: JSON.stringify({ name }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (response.status === 200) return await response.json()
  }

  return undefined
}

export const deleteCollection = async collectionId => {
  const token = await authService.getAccessToken()

  if (!token) {
    console.error('Cannot send DELETE request without being authenticated.')
  } else {
    const response = await fetch(`/api/v1/Collection/${collectionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (response.status === 200) return await response.json()
  }

  return undefined
}

export const createTask = async (
  collectionId,
  { content, isFlagged, note },
) => {
  const token = await authService.getAccessToken()

  if (!token) {
    console.error('Cannot send POST request without being authenticated.')
  } else {
    const response = await fetch(`/api/v1/Task/${collectionId}`, {
      method: 'POST',
      body: JSON.stringify({ content, isFlagged, note }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (response.status === 200) return await response.json()
    else {
      console.log(response.status)
      console.log(response.text())
    }
  }

  return undefined
}

export const retrieveTasks = async taskId => {
  const token = await authService.getAccessToken()

  if (!token) {
    console.error('Cannot send GET request without being authenticated.')
  } else {
    const response = await fetch(`/api/v1/Task/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (response.status === 200) return await response.json()
  }

  return undefined
}

export const updateTask = async ({
  taskId,
  content,
  isFlagged,
  dueDate,
  completedAt,
}) => {
  const token = await authService.getAccessToken()

  if (!token) {
    console.error('Cannot send PATCH request without being authenticated.')
  } else {
    const response = await fetch(`/api/v1/Task/${taskId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content, isFlagged, dueDate, completedAt }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    if (response.status === 200) return await response.json()
  }

  return undefined
}

export const deleteTask = async taskId => {
  const token = await authService.getAccessToken()

  if (!token) {
    console.error('Cannot send DELETE request without being authenticated.')
  } else {
    const response = await fetch(`/api/v1/Task/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 200) return await response.json()
    else {
      console.log(response.status)
      console.log(await response.text())
    }
  }

  return undefined
}
