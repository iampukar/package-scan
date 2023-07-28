import { isWithinRange } from "./version-matches.js";

const getQuery = (packages) => {
  const queries = packages
    .map(
      (packageName, index) => `
  package${index + 1
        }: securityVulnerabilities(ecosystem: NPM, first: 10, package: "${packageName}") {
    nodes {
      advisory {
        description
        severity
      }
      package {
        name
        ecosystem
      }
      vulnerableVersionRange
    }
  }
`
    )
    .join("\n");

  const queryString = `
query {
  ${queries}
}
`;

  return queryString;
};

const fetchGithubAdvisory = async (packages, accessToken) => {
  const packagesNames = packages.map((p) => p.name);

  const vulnerablePackages = [];
  try {
    const url = "https://api.github.com/graphql";
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: getQuery(packagesNames),
      }),
    });
    const json = await res.json();

    if (json.data) {
      const data = json.data;
      Object.values(data).map((res, i) => {
        if (res.nodes && res.nodes.length) {
          const packageName = res.nodes[0].package.name;
          const providedPackage = packages[i];
          const matchedVersions = res.nodes.filter((node) => {
            try {
              return isWithinRange(
                providedPackage.version,
                node.vulnerableVersionRange
              );
            } catch (error) {
              console.log(error);
            }
          });
          if (matchedVersions.length) {
            vulnerablePackages.push({ [packageName]: matchedVersions });
          }
        }

        return null;
      });
    }
  } catch (e) {
    console.error("error in github repo advisory fetching:", e);
  }

  return vulnerablePackages;
};

export { fetchGithubAdvisory };