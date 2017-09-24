const gutil = require('gulp-util');
const through = require('through2');
const writeGood = require('write-good');
const columnify = require('columnify');

function makePipe(...funcs) {
  return function pipeInner(input) {
    return funcs.reduce((acc, func) => func(acc), input);
  }
}

function formatSuggestions(suggestions) {
  return suggestions.reduce(function(acc, suggestion) {
    const position = gutil.colors.gray(`  ${suggestion.line}:${suggestion.col}`);
    const reason = gutil.colors.cyan(suggestion.reason);

    acc[position] = reason;

    return acc;
  }, {});
}

function columnifySuggestions(suggestions) {
  return columnify(suggestions, {
    showHeaders: false,
  }).split('\n');
}

function logSuggestions(formattedSuggestions) {
  return formattedSuggestions.forEach(line => gutil.log(line));
}

module.exports = function gulpWriteGood(opts) {
  opts = opts || {};

  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      return cb(new gutil.PluginError('gulp-write-good', 'Streaming not supported'));
    }

    try {
      const contents = file.contents.toString();
      const suggestions = writeGood(contents, opts);
      file.suggestions = writeGood.annotate(contents, suggestions, true);
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-write-good', err));
    }

    cb(null, file);
  });
};

module.exports.reporter = function gulpWriteGoodReport() {
  return through.obj(function(file, enc, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }
    
    if (file.isStream()) {
      return cb(new gutil.PluginError('gulp-write-good', 'Streaming not supported'));
    }
    
    try {
      if (file.suggestions.length > 0) {
        gutil.log(gutil.colors.yellow(file.path));

        // this is a bit overkill, but it feels good doing so
        makePipe(
          formatSuggestions,
          columnifySuggestions,
          logSuggestions
        )(file.suggestions);
      }
    } catch (err) {
      this.emit('error', new gutil.PluginError('gulp-write-good', err));
    }
    
    cb(null, file);
  });
};
