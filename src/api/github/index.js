import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: "TODO_ADD_TOKEN_HERE",
});

export const getPullRequest = (pull_number) => {
  return octokit.rest.pulls.get({
    owner: 'TODO_ADD_OWNER_HERE',
    repo: 'TODO_ADD_REPO_HERE',
    pull_number,
  });
}


export const makeRequest = (url) => {
  return octokit.paginate(
    `GET ${url}`,
    (response) => response.data,
  )
};