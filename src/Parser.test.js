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

    it('should parse prem test', () => {
      const parser = new Parser('###', '>>', '<<');
      const payload = parser.parse(loadFileData('prem_test.txt'));

      expect(payload).to.have.property('Location').to.equal('London');
      expect(payload).to.have.property('Partner Organization Name').to.equal('all-your-consult');
      expect(payload).to.have.property('Status').to.equal('🟢 Green - On track to meet goals 🏝️');

      expect(payload).to.have.property('Languages').to.be.instanceOf(Object);
      const languages = payload.Languages;
      expect(Object.keys(languages)).to.have.length(11);
      expect(languages).to.have.property('English').to.be.true;
      expect(languages).to.have.property('French').to.be.true;
      expect(languages).to.have.property('Italian').to.be.true;
      expect(languages).to.have.property('German').to.be.false;
      expect(languages).to.have.property('Korean').to.be.false;
      expect(languages).to.have.property('Spanish').to.be.false
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


    // it('should parse a checkbox that is disabled', () => {
    //   const parser = new Parser('###', '>>>', '<<<');
    //   const results = parser.parse(loadFileData('demo_checkbox_disabled.txt'));

    //   expect(results).to.have.property('demo-repository-owner').to.equal('octodemo');
    //   expect(results).to.have.property('demo-repository-name').to.equal('pm-testing-workflow-004');
    //   expect(results).to.have.property('template').to.equal('octodemo/template-bookstore-v2');
    //   expect(results).to.have.property('template-branch').to.be.undefined;
    //   expect(results).to.have.property('demo-config-create-project').to.be.false;
    // });

    // it('should parse a checkbox that is enabled', () => {
    //   const parser = new Parser('###', '>>>', '<<<');
    //   const results = parser.parse(loadFileData('demo_checkbox_enabled.txt'));

    //   expect(results).to.have.property('demo-repository-owner').to.equal('octodemo');
    //   expect(results).to.have.property('demo-repository-name').to.equal('pm-testing-workflow-003');
    //   expect(results).to.have.property('template').to.equal('octodemo/template-bookstore-v2');
    //   expect(results).to.have.property('template-branch').to.be.undefined;
    //   expect(results).to.have.property('demo-config-create-project').to.be.true;
    // });

    it('should parse a checkbox example', () => {
      const parser = new Parser('###', '>>>', '<<<');
      const results = parser.parse(loadFileData('example_with_checkboxes.txt'));

      expect(results).to.have.property('demo-repository-owner').to.equal('octodemo');
      expect(results).to.have.property('demo-repository-name').to.equal('test');
      expect(results).to.have.property('template').to.equal('octodemo/template-bookstore-v2');
      expect(results).to.have.property('template-branch').to.be.undefined;
      expect(results).to.have.property('Demo custom configuration');

      const config = results['Demo custom configuration'];
      expect(config).to.have.property('testing').to.be.true;
      expect(config).to.have.property('projects_enabled').to.be.false;
      expect(config).to.have.property('issues_enabled').to.be.true;
    });

    it('should parse checkbox example 2', () => {
      const parser = new Parser('###', '>>>', '<<<');
      const results = parser.parse(loadFileData('example_with_checkboxes_2.txt'));

      expect(results).to.have.property('demo-repository-owner').to.equal('octodemo');
      expect(results).to.have.property('demo-repository-name').to.equal('test');
      expect(results).to.have.property('template').to.equal('octodemo/template-bookstore-v2');
      expect(results).to.have.property('template-branch').to.be.undefined;
      expect(results).to.have.property('Demo custom configuration');

      const config = results['Demo custom configuration'];
      expect(config).to.have.property('testing').to.be.false;
      expect(config).to.have.property('projects_enabled').to.be.false;
      expect(config).to.have.property('issues_enabled').to.be.true;
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