const fetchPackageJson = async (downloadUrl) => {
  try {
    const res = await fetch(downloadUrl)
    const data = await res.json()
    return data
  } catch (e) {
    console.log('error: ', e)
  }

  return {}
}

const getSimplifiedVersion = versionString => {
  return versionString.replaceAll(/[^\d.]/g, '')
}

const parsePackageJson = async (downloadUrl, getFullPackages) => {
  const data = await fetchPackageJson(downloadUrl)

  const fullPackages = getFullPackages ? await getFullPackages() : undefined
  const packages = []
  if (Object.keys(data).length) {
    const allDependencies = { ...data.dependencies, ...data.devDependencies }

    Object.keys(allDependencies).map(key => {
      let version = getSimplifiedVersion(allDependencies[key])
      if (fullPackages) {
        const _package = fullPackages.find(p => p.name === key)
        if (_package) {
          const [_version] = _package.versions
          version = _version
        }
      }
      packages.push({ name: key, versions: [version] })
      return null
    })
  }

  return packages
}

export { parsePackageJson }