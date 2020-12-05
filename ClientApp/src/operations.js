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
