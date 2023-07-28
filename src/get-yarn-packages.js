import lockfile from "@yarnpkg/lockfile";
import { rsplit } from "./rsplit.js";

async function loadYarn(url) {
    try {
        const res = await fetch(url)
        const text = await res.text()
        return lockfile.parse(text);
    } catch (e) {
        throw new Error("Could not find the file url ");
    }
}

async function getYarnPackagesWithFinalVersion(url) {
    const allParsedPackagesObject = await loadYarn(url)

    const allPackages = []
    Object.keys(allParsedPackagesObject?.object).map((key) => {
        const packageName = key
        const splittedPackageName = rsplit(packageName, '@', 1)[0]
        const version = allParsedPackagesObject?.object[key].version

        allPackages.push({ name: splittedPackageName, version })
        return null
    })

    const uniqueArray = allPackages.reduce((acc, curr) => {
        const samePackage = acc.find(o => o.name === curr.name && o.version === curr.version);
        if (!samePackage) {
            acc.push(curr);
        }
        return acc;
    }, []);

    return uniqueArray
}

export { getYarnPackagesWithFinalVersion }


