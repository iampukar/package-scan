const parsePackageLock = async (downloadUrl) => {
  try {
    const res = await fetch(downloadUrl, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const content = await res.json()

    const packages = Object.keys(content.packages)
      .map(name => {
        if (!name) return undefined
        const versions = [content.packages[name].version]
        return {
          name,
          versions
        }
      })
      .filter(p => !!p)

    return packages
  } catch (e) {
    console.error(e)
  }

  return []
}

export { parsePackageLock }