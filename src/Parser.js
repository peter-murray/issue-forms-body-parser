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

  parse(content) {
    if (!content || content.trim().length === 0) {
      return undefined;
    }

    const parts = content.split(this.separator);

    const result = {};
    if (parts) {
      const tagRegex = this.tagRegex;

      parts.forEach(part => {
        const match = tagRegex.exec(part);

        if (match) {
          if (match[2].trim() === NO_RESPONSE) {
            // no reponse provided in the payload, report no value
            result[match[1]] = undefined;
          } else {
            result[match[1]] = match[2];
          }
        }
      });
    }

    return result;
  }
}