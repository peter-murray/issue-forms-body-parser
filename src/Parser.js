
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
    // console.log(JSON.stringify(parts, null, 2));

    const result = {};
    if (parts) {
      const tagRegex = this.tagRegex;

      parts.forEach(part => {
        const match = tagRegex.exec(part);

        // console.log(`Match on ${part}:`);
        // console.log(JSON.stringify(match, null, 2));

        if (match) {
          result[match[1]] = match[2];
        }
      });
    }

    return result;
  }
}