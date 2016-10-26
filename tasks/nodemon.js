import nodemon from 'gulp-nodemon';

import { bs } from './browser-sync';

// const reload = bs.reload;

export default function () {
  return cb => {
    let called = false;

    return nodemon({
      script: '../build/server.js',
      execMap: {
        "js": "node --harmony"
      },
      ignore: ['gulpfile.babel.js', '.babelrc', '/node_modules/'],
      tasks: ['node-babel'],
      watch: ['./lib']
    })
    .on('start', function () {
      if ( !called ) {
        cb();
        called = true;
      }
    });
  };
}