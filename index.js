const core = require('@actions/core')
  , IssueUtil = require('./src/IssueUtil')
  , Parser = require('./src/Parser')
  ;

function getRequiredInputValue(key) {
  return core.getInput(key, { required: true });
}

function getOptionalInputValue(key) {
  return core.getInput(key, { required: false });
}


async function run() {
  try {
    const issueId = '42'// getRequiredInputValue('issue_id')
      , githubToken = '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' // getRequiredInputValue('github_token')
      , parserSeparator = '###'// getRequiredInputValue('separator')
      , parserMarkerStart = '>>'// getRequiredInputValue('label_marker_start')
      , parserMarkerEnd = '>>'// getRequiredInputValue('label_marker_end')
      , repository = "bill-test-org/t-lint"// getOptionalInputValue('repository')
      ;

    const issueUtil = new IssueUtil(githubToken)
      , parser = new Parser(parserSeparator, parserMarkerStart, parserMarkerEnd)
      ;

    const issueBody = await issueUtil.getIssueBody(issueId, repository);
    
    const parsed = parser.parse(issueBody);
    if (parsed !== undefined) {
      core.setOutput('payload', parsed);
    } else {
      core.setFailed(`There was no valid payload found in the issue: ${issueId}.`);
    }
  } catch (err) {
    core.setFailed(err);
  }
}

run();
