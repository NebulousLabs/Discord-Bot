const gulp = require('gulp');
const gulp_ts = require('gulp-typescript');
const gulp_tslint = require('gulp-tslint');
const tslint = require('tslint');
const del = require('del');
const nodemon = require('gulp-nodemon');

const project = gulp_ts.createProject('tsconfig.json');
const linter = tslint.Linter.createProgram('tsconfig.json');

gulp.task('tslint', () => {
    gulp.src(['./src/**/*.ts'])
      .pipe(gulp_tslint({
            configuration: 'tslint.json',
            formatter: 'prose',
            program: linter
        }))
        .pipe(gulp_tslint.report());
});

gulp.task('compile', () => {
    gulp.src('./src/**/*.ts')
        .pipe(project())
        .pipe(gulp.dest('bin/'));

    gulp.src('./src/config.json')
        .pipe(gulp.dest('bin/'));

    gulp.src('./src/database.json')
        .pipe(gulp.dest('bin/'));

    gulp.src('./src/img/*.*')
        .pipe(gulp.dest('bin/img/'));
});

gulp.task('watch', ['compile'], () => {
    del.sync(['./bin/**/*.*']);
    gulp.watch(['./src/**/*.ts', './src/config.json', './src/database.json', './src/img/*.*'], ['compile']);
})

gulp.task('default', ['compile'], () => {
    del.sync(['./bin/**/*.*']);
});

gulp.task('serve', function () {
  nodemon({
    script: './bin/sweeper.js'
  , ext: 'ts json'
  , watch: 'src'
  , ignore: ['./bin/**.*']
  // , env: { 'NODE_ENV': 'development' }
  , tasks: ['compile']
  })
});
