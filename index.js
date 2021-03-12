const core = require('@actions/core')
  , IssueUtil = require('./src/IssueUtil')
  , Parser = require('./src/Parser')
  ;

function getRequiredInputValue(key) {
  return core.getInput(key, { required: true });
}

async function run() {
  try {
    const issueId = getRequiredInputValue('issue_id')
      , githubToken = getRequiredInputValue('github_token')
      , parserSeparator = getRequiredInputValue('separator')
      , parserMarkerStart = getRequiredInputValue('label_marker_start')
      , parserMarkerEnd = getRequiredInputValue('label_marker_end')
      ;

    const issueUtil = new IssueUtil(githubToken)
      , parser = new Parser(parserSeparator, parserMarkerStart, parserMarkerEnd)
      ;

    const issueBody = await issueUtil.getIssueBody(issueId);
    
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
