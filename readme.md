# gulp-write-good [![Build Status](https://travis-ci.org/nlhuykhang/gulp-write-good.svg?branch=master)](https://travis-ci.org/nlhuykhang/gulp-write-good)

> Gulp plugin wrapper for [write-good](https://github.com/btford/write-good)

## Install

```
$ npm install --save-dev gulp-write-good
```

## Usage

```javascript
const gulp = require('gulp');
const gulpWriteGood  = require('gulp-write-good');

gulp.task('default', () => {
  gulp.src('**/*.md')
    .pipe(gulpWriteGood())
    .pipe(gulpWriteGood.reporter());
);
```

## API

### gulpWriteGood([options])

#### options

options object will be passed directly to write-good, all options properties is described [here](https://github.com/btford/write-good#checks).

### gulpWriteGood.reporter()

This makes and prints a report for all suggestions returned by write-good

## License

MIT
