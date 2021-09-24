const github = require('@actions/github');

module.exports = class IssueUtil {

  constructor(token) {
    if (!token) {
      core.error('Failed to provide a GitHub token for accessing the GitHub REST API.');
    }
    this.octokit = github.getOctokit(token);
  }

  getIssueBody(id, repository) {
    console.log(repository)
    const [owner, repo] = repository.split('/');
    const target_repo = repository ? {owner, repo} : github.context.repo;
    console.log('about to start')
    console.log(target_repo)
    return this.octokit.issues.get({
      ...target_repo,
      issue_number: id
    }).then(result => {
      console.log(result.status)
      if (result.status !== 200) {
        throw new Error(`Unexpected status code from retrieving issue: ${result.status}`);
      }
      console.log(result.data.body)
      return result.data.body;
    }).catch(err => {
      throw err;
    });
  }
}
