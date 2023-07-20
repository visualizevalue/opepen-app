const config: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
  mode: 'cors',
  credentials: 'include',
}

export const get = async (url: string) => {
  const response = await fetch(url, {
    method: 'get',
    ...config,
  })
  if (response.status !== 200) throw Error()
  return await response.json()
}

export const post = async (url: string, data: object) => {
  try {
    const response = await fetch(url, {
      method: 'post',
      body: JSON.stringify(data),
      ...config,
    })

    const responseData = await response.json()

    if (response.status !== 200) {
      const message = responseData.error || 'Fetch failed'
      alert(message)
      throw new Error(message)
    }

    return responseData
  } catch (e) {
    console.log(e)
  }

  return null
}
