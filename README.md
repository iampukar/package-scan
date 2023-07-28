# Package Scan

Package Scan is an automated tool designed to scan repositories on GitHub, specifically analyzing package dependency files (`yarn.lock`, `package-lock.json`, and `package.json`) to identify potentially vulnerable packages. It then generates and writes a JSON file containing the list of vulnerable packages for each repository scanned.

This tool is beneficial for organizations that want to proactively monitor their repositories for supply chain vulnerabilities. It centralizes the process of checking multiple repositories for potential risks, offering a systematic approach to maintaining software security.

## Working

### Environment Setup
- The `dotenv` package is utilized to read environment variables, GitHub API access token.
- Create a `.env` file in the root directory with values with values `GITHUB_API = 'GitHub Access Token'`

### Initiating the Scan
- `handleInitiateScan` function begins the scanning process. It checks if a given organization and its repositories exist on GitHub.
- If they exist, it proceeds to generate a summary using the `handleSummary` function.

### Summary of Files in the Repo
- The script specifically looks for a file named `yarn.lock` in the repository.

### File Analysis
- The `handleFileAnalysis` function is at the core of the operation. It fetches package details depending on the file type from `yarn.lock`.
- The function then cross-references these packages with potential vulnerabilities using the `fetchGithubAdvisory` function.
- Vulnerable packages are saved to a JSON file named after the repository and stored in an "issues" directory.
- There's a placeholder for potential issue packages (possibly packages that aren't necessarily vulnerable but might have other issues), but it isn't fully implemented as of now.

### Batch Processing
- The script is designed to process multiple repositories in a batch.
- It reads the GitHub organization name from a file named `GITHUB_ORG_NAME.txt`.
- It then retrieves a list of repository names to be scanned from the same file, with each repository name separated by a new line.
- The script iterates over this list and initiates the scanning process for each repository.

## Configuration
To run this tool, users should provide:
1. A `GITHUB_ORG_NAME.txt` file, containing the name of the GitHub organization as the file name, followed by repository names on subsequent lines.
2. Environment variables `.env` set up for the GitHub API access token.

## Running the script

- Add a `.env` file with values `GITHUB_API = 'GITHUB Access Token'` in the root directory
- Change the name of `GITHUB_ORG_NAME.txt` to the GitHub Organization Name that you want to monitor.
- Modify the `repository1` and other values inside `GITHUB_ORG_NAME.txt` to the repository of the organization that you wish to scan.
- All packages with issues in `yarn.lock` of that repository will be subsequently shown inside issues folder.
    
        npm i 
        or
        yarn install
        
        node index.js
        or
        yarn check

## License 

MIT