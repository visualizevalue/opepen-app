const config: RequestInit = {
  headers: {
    'Content-Type': 'application/json',
  },
  mode: 'cors',
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
  const response = await fetch(url, {
    method: 'post',
    body: JSON.stringify(data),
    ...config,
  })
  return await response.json()
}
