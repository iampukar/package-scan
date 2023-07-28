const rsplit = (_string, sep, maxsplit) => {
  const split = _string.split(sep)
  return (typeof maxsplit !== 'undefined' && maxsplit > 0)
    ? [split.slice(0, -maxsplit).join(sep)].concat(split.slice(-maxsplit))
    : split
}

export { rsplit }