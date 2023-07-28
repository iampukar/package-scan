import { GITHUB_API_BASE } from './constants.js'

async function checkRepository(orgName, repoName, accessToken) {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  if (accessToken) config.headers.Authorization = `Token ${accessToken}`

  const existsFlag = {
    org: {
      exists: true,
      message: ''
    },
    repo: {
      exists: true,
      message: ''
    }
  }

  try {
    const orgResponse = await fetch(
      `${GITHUB_API_BASE}/orgs/${orgName}`,
      config
    )

    if (orgResponse.status !== 200) {
      existsFlag.org = {
        exists: false,
        message: 'Invalid Organization Name'
      }
    }

    if (orgResponse.status === 200) {
      try {
        const repoResponse = await fetch(
          `${GITHUB_API_BASE}/repos/${orgName}/${repoName}`,
          config
        )

        if (repoResponse.status !== 200) {
          existsFlag.repo = {
            exists: false,
            message: 'Invalid Repository Name'
          }
        }
      } catch (error) { }
    }
  } catch (error) { }

  return existsFlag
}

export { checkRepository }