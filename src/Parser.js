// The entry when a user has not provided a value in response
const NO_RESPONSE = '_No response_';

module.exports = class Parser {

  constructor(separator, openTag, closeTag) {
    this._config = {
      separator: separator,
      tag: {
        open: openTag,
        close: closeTag
      }
    }
  }

  get separator() {
    return this._config.separator;
  }

  get tagRegex() {
    const open = this._config.tag.open
      , close = this._config.tag.close
      , regexMatch = `${open}(.*)${close}(?:\\s)+(.*)`
      ;

    return new RegExp(regexMatch);
  }

  get checkBoxRegex() {
    const open = this._config.tag.open
      , close = this._config.tag.close
      , regexMatch = `\\- \\[(\\w|\\s)\\] ${open}(.*)${close}`
      ;

    return new RegExp(regexMatch);
  }

  parse(content) {
    if (!content || content.trim().length === 0) {
      return undefined;
    }

    const parts = content.split(this.separator);

    const result = {};
    if (parts) {
      const tagRegex = this.tagRegex;
      const checkBoxRegex = this.checkBoxRegex;

      parts.forEach(part => {
        const tagMatch = tagRegex.exec(part);

        if (tagMatch) {
          if (tagMatch[2].trim() === NO_RESPONSE) {
            // no reponse provided in the payload, report no value
            result[tagMatch[1]] = undefined;
          } else {
            result[tagMatch[1]] = tagMatch[2];
          }
        } else {
          const checkBoxMatch = checkBoxRegex.exec(part);
          if (checkBoxMatch) {
            result[checkBoxMatch[2]] = checkBoxMatch[1] === 'X'
          }
        }
      });
    }

    return result;
  }
}