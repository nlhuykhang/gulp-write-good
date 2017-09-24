import test from 'ava';
import gulpUtil from 'gulp-util';
import fn from '../';
import vfs from 'vinyl-fs';
import nextback from 'nextback';
import testSuggestions from './testData.js';


const getFiles = function(path, cb) {
  const myCb = nextback(cb);
  const files = [];
  const globber = vfs.src(path);

  globber.once('error', myCb);

  globber.on('data', function(file) {
    files.push(file);
  });

  globber.once('end', function() {
    myCb(null, files);
  });
};

test.cb(t => {
  getFiles('./**/test.md', function(err, files) {
    if (err) {
      console.error(err);
      return t.fail();
    }

    const file = files[0];
    const stream = fn();
    
    stream.once('data', (file) => {
      t.deepEqual(testSuggestions, file.suggestions);
      t.end();
    });
    
    stream.write(file);
    
    stream.end();
  });
});
