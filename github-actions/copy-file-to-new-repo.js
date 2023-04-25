const { Octokit } = require("@octokit/rest");

const token = process.env.token;
const octokit = new Octokit({ auth: token });

// Copies contents of code of conduct source file and copies them over to a target repo
// Needs arguments repo: 'name of target repo', path: 'path of file to copy contents into'
async function updateCodeOfConduct(repos) {
    const owner = 'bootcamp-brian';
    const codeOfConductSource = await octokit.request(`GET /repos/${owner}/github-actions-testing-2/contents/README.md`);

    const { content } = codeOfConductSource.data;

    for (let repo of repos) {
        const { name, path } = repo;
        let currentCodeOfConduct = false;

        try {
            currentCodeOfConduct = await octokit.request(`GET /repos/${owner}/${name}/contents/${path}`);
        } catch (error) {
            console.log(`${error.response.url} not found`)
        }

        if (currentCodeOfConduct) {
            const { sha } = currentCodeOfConduct.data;
            const response = await octokit.request(`PUT /repos/${owner}/${name}/contents/${path}`, {
                sha,
                message: 'Updating code of conduct',
                content
            });
        } else {
            const response = await octokit.request(`PUT /repos/${owner}/${name}/contents/${path}`, {
                message: 'Updating code of conduct',
                content
            });
        }
    }
}

const repos = [
    {
        name: 'github-actions-testing1',
        path: '_includes/code-of-conduct-page/CODEOFCONDUCT.md'
    },
    {
        name: 'github-actions-testing-2',
        path: '_includes/code-of-conduct-page/CODEOFCONDUCT.md'
    },
]

// Run updateCodeofConduct() for all repos that need a copy of the code of conduct
updateCodeOfConduct(repos);