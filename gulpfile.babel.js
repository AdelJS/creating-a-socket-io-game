import "babel-polyfill";

import gulp from 'gulp';
import runSequence from 'run-sequence';

import bundle from './tasks/bundle';
import nodeBabel from './tasks/node-babel';
import browserSync from './tasks/browser-sync';
import nodemon from './tasks/nodemon';
import testBrowser from './tasks/test-browser';
import testNode from './tasks/test-node';
import clean from './tasks/clean';
import htmlMin from './tasks/html-min';
import cssMin from './tasks/css-min';
import imageMin from './tasks/image-min';

gulp.task('bundle', bundle());
gulp.task('node-babel', nodeBabel());
gulp.task('nodemon', ['node-babel'], nodemon());
// gulp.task('browser-sync', ['nodemon'], browserSync());
gulp.task('test-node', testNode());
gulp.task('test-browser', testBrowser());
gulp.task('clean', clean());
gulp.task('html-min', htmlMin());
gulp.task('css-min', cssMin());
gulp.task('image-min', imageMin());

gulp.task('watch', ['html-min', 'css-min'], function () {
  gulp.watch('public/*.html', ['html-min']);
  gulp.watch('public/stylesheets/**/*.css', ['css-min']);
});

gulp.task('default', cb => {
  runSequence('clean', ['watch', 'nodemon', 'bundle', 'image-min'], cb);
});