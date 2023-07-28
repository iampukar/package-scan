import fs from "fs";
import path from "path";
import { getGithubFile } from "./src/check-github-file.js";
import { fetchGithubAdvisory } from "./src/github-advisory.js";
import { getYarnPackagesWithFinalVersion } from "./src/get-yarn-packages.js";
import { parsePackageJson } from "./src/parse-package-json.js";
import { parsePackageLock } from "./src/parse-package-lock.js";
import { checkRepository } from "./src/validate-github.js";

import dotenv from "dotenv";
dotenv.config();

async function handleInitiateScan(orgName, repoName, accessToken) {
  const { org, repo } = await checkRepository(orgName, repoName, accessToken);

  if (org.exists && repo.exists) {
    handleSummary(orgName, repoName, accessToken);
  }
}

async function handleSummary(orgName, repoName, accessToken) {
  // show summary container
  const fileType = "yarn.lock";

  const availableFiles = await getGithubFile(orgName, repoName, accessToken);

  const selectedFile = availableFiles.find((f) => f.name === fileType);

  let getFullPackages = null;

  if (fileType) {
    const yarnFile = availableFiles.find((f) => f.name === "yarn.lock");
    const packageLockFile = availableFiles.find(
      (f) => f.name === "package-lock.json"
    );
    if (yarnFile)
      getFullPackages = () =>
        getYarnPackagesWithFinalVersion(yarnFile.download_url);
    else if (packageLockFile)
      getFullPackages = () => parsePackageLock(packageLockFile.download_url);
  }

  if (selectedFile) {
    handleFileAnalysis(repoName, fileType, selectedFile, getFullPackages, accessToken);
  }
}

const packageFn = {
  "yarn.lock": getYarnPackagesWithFinalVersion,
  "package.json": parsePackageJson,
  "package-lock.json": parsePackageLock,
};

async function handleFileAnalysis(repoName, fileType, file, getFullPackages, accessToken) {
  const packages = await packageFn[fileType](
    file.download_url,
    getFullPackages
  );

  const vulnerablePackages = await fetchGithubAdvisory(
    packages,
    accessToken
  );

  let jsonData = JSON.stringify(vulnerablePackages);
  fs.writeFileSync(`issues/${repoName}.json`, jsonData);

  let potentialIssuePackages = [];

  const flattenedData = [];
  for (
    let i = 0;
    i < vulnerablePackages.length || i < potentialIssuePackages.length;
    i++
  ) {
    const item1 = vulnerablePackages[i];
    const item2 = potentialIssuePackages[i] ?? "";

    const name = item1 ? Object.keys(item1)[0] : "";
    const issueCount = item1 ? item1[name].length : "";

    flattenedData.push({
      name,
      issueCount,
      unstable: item2,
    });
  }
}

// Read orgName and repoNames from a .txt file
const fileName = "GITHUB_ORG_NAME.txt";
const orgName = path.parse(fileName).name;
const content = fs.readFileSync(fileName, 'utf-8');
const repoNames = content.split('\n');

repoNames.forEach(repoName => {
  handleInitiateScan(orgName, repoName, process.env.GITHUB_API);
});
