const path = require('path')
  , fs = require('fs')
  , expect = require('chai').expect
  , Parser = require('./Parser')
  ;

describe('Parser', () => {

  describe('parse()', () => {

    it('should parse same open/close tags', () => {
      const parser = new Parser('###', '>>', '>>');
      validateResults(parser.parse(loadFileData('demo_same_open_close.txt')));
    });


    it('should parse different open/close tags', () => {
      const parser = new Parser('###', '>>', '<<');
      validateResults(parser.parse(loadFileData('demo_different_open_close.txt')));
    });


    it('should ignore no response fields', () => {
      const parser = new Parser('###', '>>>', '<<<');
      const results = parser.parse(loadFileData('demo_missing_responses.txt'));

      expect(results).to.have.property('demo-repository-owner').to.equal('octodemo');
      expect(results).to.have.property('demo-repository-name').to.equal('pm-automation-test-001');
      expect(results).to.have.property('template').to.be.undefined;
    });


    it('should parse a checkbox that is disabled', () => {
      const parser = new Parser('###', '>>>', '<<<');
      const results = parser.parse(loadFileData('demo_checkbox_disabled.txt'));

      expect(results).to.have.property('demo-repository-owner').to.equal('octodemo');
      expect(results).to.have.property('demo-repository-name').to.equal('pm-testing-workflow-004');
      expect(results).to.have.property('template').to.equal('octodemo/template-bookstore-v2');
      expect(results).to.have.property('template-branch').to.be.undefined;
      expect(results).to.have.property('demo-config-create-project').to.be.false;
    });

    it('should parse a checkbox that is enabled', () => {
      const parser = new Parser('###', '>>>', '<<<');
      const results = parser.parse(loadFileData('demo_checkbox_enabled.txt'));

      expect(results).to.have.property('demo-repository-owner').to.equal('octodemo');
      expect(results).to.have.property('demo-repository-name').to.equal('pm-testing-workflow-003');
      expect(results).to.have.property('template').to.equal('octodemo/template-bookstore-v2');
      expect(results).to.have.property('template-branch').to.be.undefined;
      expect(results).to.have.property('demo-config-create-project').to.be.true;
    });

  });
});

function validateResults(results) {
  expect(results).to.have.property('demo-repository-owner').to.equal('octodemo');
  expect(results).to.have.property('demo-repository-name').to.equal('pm-automation-test-001');
  expect(results).to.have.property('template').to.equal('octodemo/template-demo-github-user-search');
}

function loadFileData(file) {
  const fileFullPath = path.join(__dirname, 'test_data', file);
  return fs.readFileSync(fileFullPath).toString('utf8');
}