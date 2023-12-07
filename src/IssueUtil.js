const github = require('@actions/github');

module.exports = class IssueUtil {

  constructor(token) {
    if (!token) {
      core.error('Failed to provide a GitHub token for accessing the GitHub REST API.');
    }
    this.octokit = github.getOctokit(token);
  }

  async getIssueBody(repository, id) {
    const repo = this.getRepoObject(repository);

    return this.octokit.rest.issues.get({
      ...repo,
      issue_number: id
    }).then(result => {
      if (result.status !== 200) {
        throw new Error(`Unexpected status code from retrieving issue: ${result.status}`);
      }
      return result.data.body;
    }).catch(err => {
      throw err;
    });
  }

  getRepoObject(repository) {
    if (!repository) {
      throw new Error(`Repository must be specified, but was '${repository}'`);
    }

    const [owner, repo] = repository.split('/');
    if (!repo) {
      throw new Error(`The repository reference must be in the form of 'owner/repo', but suppied value was '${repository}'`);
    }

    return {
      owner,
      repo
    }
  }
}