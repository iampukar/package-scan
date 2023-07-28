const GITHUB_API_BASE = 'https://api.github.com'

const NPM_PUBLISHED_DATE_API = (packageName) => 'https://registry.npmjs.org/:packageName'
  .replace(':packageName', encodeURIComponent(packageName))

const NPM_DOWNLOADS_API = (packageName) => 'https://api.npmjs.org/versions/:packageName/last-week'
  .replace(':packageName', encodeURIComponent(packageName))

const GREATER_THAN_50K = '>50K'
const GREATER_THAN_MILLION = '>1M'

export { GITHUB_API_BASE, NPM_PUBLISHED_DATE_API, NPM_DOWNLOADS_API, GREATER_THAN_50K, GREATER_THAN_MILLION }