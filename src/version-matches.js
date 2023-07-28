const versionMatches = (versionArray, versionRangeString) => {
  const affectedVersions = versionArray.filter((v) =>
    isWithinRange(v, versionRangeString)
  );
  return affectedVersions;
};

function compareVersions(version1, version2) {
  let v1parts = version1.split(".");
  let v2parts = version2.split(".");

  while (v1parts.length < v2parts.length) v1parts.push("0");
  while (v2parts.length < v1parts.length) v2parts.push("0");

  for (let i = 0; i < v1parts.length; ++i) {
    if (+v1parts[i] === +v2parts[i]) {
      continue;
    } else if (+v1parts[i] > +v2parts[i]) {
      return 1;
    } else {
      return -1;
    }
  }

  return 0;
}

function isWithinRange(version, range) {
  let ranges = range.split(",");
  let isMatch = false;

  for (let i = 0; i < ranges.length; i++) {
    let condition = ranges[i].trim();
    let onlyEqual =
      condition[0] === "=" && condition[1] !== "=" && condition[1] !== ">";
    let operator =
      condition[0] === ">" ? ">" : condition[0] === "<" ? "<" : "=";
    let equal = condition[1] === "=";
    let rangeVersion;

    if (onlyEqual) rangeVersion = condition.split("=")[1].trim();
    else if (equal) rangeVersion = condition.split(operator + "=")[1].trim();
    else rangeVersion = condition.split(operator)[1].trim();

    let comparison = compareVersions(version, rangeVersion);

    if (
      operator === ">" &&
      ((equal && comparison >= 0) || (!equal && comparison > 0))
    ) {
      isMatch = true;
    } else if (
      operator === "<" &&
      ((equal && comparison <= 0) || (!equal && comparison < 0))
    ) {
      isMatch = true;
    } else if (operator === "=" && comparison === 0) {
      isMatch = true;
    } else {
      return false;
    }
  }
  return isMatch;
}

export { versionMatches, isWithinRange };