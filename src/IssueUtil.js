const github = require('@actions/github');

module.exports = class IssueUtil {

  constructor(token) {
    if (!token) {
      core.error('Failed to provide a GitHub token for accessing the GitHub REST API.');
    }
    this.octokit = github.getOctokit(token);
  }

  getIssueBody(id, repository) {
    const [owner, repo] = repository.split('/');
    const target_repo = repository ? {owner, repo} : github.context.repo;

    throw new Error(`Repository... owner=${owner}, repo=${repo}`);

    // return this.octokit.issues.get({
    //   ...target_repo,
    //   issue_number: id
    // }).then(result => {
    //   if (result.status !== 200) {
    //     throw new Error(`Unexpected status code from retrieving issue: ${result.status}`);
    //   }

    //   return result.data.body;
    // }).catch(err => {
      
    // });
  }
}
