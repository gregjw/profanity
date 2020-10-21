const corpus = require('./abuse.json').words;

class Filter {
  constructor(options = {}) {
    Object.assign(this, {
      list:
        (options.emptyList && []) ||
        Array.prototype.concat.apply(corpus, [options.list || []]),
      exclude: options.exclude || [],
      placeHolder: options.placeHolder || '*',
      regex: options.regex || /[^a-zA-Z0-9|\$|\@]|\^/g,
      replaceRegex: options.replaceRegex || /\w/g,
    });
  }

  isProfane(string) {
    return (
      this.list.filter(word => {
        if (string.includes(word)){
          return true; 
        }
        
        const wordExp = new RegExp(
          `\\b${word.replace(/(\W)/g, '\\$1')}\\b`,
          'gi',
        );
        return !this.exclude.includes(word) && wordExp.test(string);
      }).length > 0 || false
    );
  }

  replaceWord(string) {
    return string
      .replace(this.regex, '')
      .replace(this.replaceRegex, this.placeHolder);
  }

  clean(string) {
    return string
      .split(/\b/)
      .map(word => {
        return this.isProfane(word) ? this.replaceWord(word) : word;
      })
      .join('');
  }

  addWords() {
    let words = Array.from(arguments);

    this.list.push(...words);

    words.forEach(word => {
      if (this.exclude.includes(word)) {
        this.exclude.splice(this.exclude.indexOf(word), 1);
      }
    });
  }

  removeWords() {
    this.exclude.push(...Array.from(arguments));
  }
}

module.exports = Filter;
