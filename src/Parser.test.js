const path = require('path')
  , fs = require('fs')
  , expect = require('chai').expect
  , Parser = require('./Parser')
  ;

describe('Parser', () => {

  describe('parse()', () => {

    it('should parse valid payload', () => {
      const parser = new Parser('###', '>>', '>>');

      const results = parser.parse(loadFileData('demo_same_open_close.txt'));
      expect(results).to.have.property('demo-repository-owner').to.equal('octodemo');
      expect(results).to.have.property('demo-repository-name').to.equal('pm-automation-test-001');
      expect(results).to.have.property('template').to.equal('octodemo/template-demo-github-user-search');
    });
  });
});

function loadFileData(file) {
  const fileFullPath = path.join(__dirname, 'test_data', file);
  return fs.readFileSync(fileFullPath).toString('utf8');
}