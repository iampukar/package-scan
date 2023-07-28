import { GITHUB_API_BASE } from './constants.js'

async function getGithubFile(userName, repoName, accessToken) {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  if (accessToken) config.headers.Authorization = `Token ${accessToken}`

  const fileNames = ['package.json', 'package-lock.json', 'yarn.lock']
  let availableFiles = []

  const BASE_URL = `${GITHUB_API_BASE}/repos/${userName}/${repoName}/contents`

  try {
    const response = await fetch(BASE_URL, config)
    if (response.status === 200) {
      const files = await response.json()
      availableFiles = files.filter(file => (file.type === 'file' && fileNames.includes(file.name)))
    }
  } catch (error) { }

  return availableFiles
}

export { getGithubFile }