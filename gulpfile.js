var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var utilities = require('gulp-util');
var buildProduction = utilities.env.production;
var del = require('del');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var lib = require('bower-files')({
  "overrides":{
    "bootstrap" : {
      "main": [
        "less/bootstrap.less",
        "dist/css/bootstrap.css",
        "dist/js/bootstrap.js"
      ]
    }
  }
});

gulp.task("minifyScripts", function() {
  return gulp.src("./js/*.js")
  .pipe(uglify())
  .pipe(gulp.dest("./_site/assets/js"));
});

gulp.task("build", ['clean'], function() {
  if(buildProduction) {
    gulp.start('minifyScripts');
  }
  gulp.start('bower');
  gulp.start('cssBuild');
});

gulp.task("clean", function() {
  return del(['./_site/assets/js']);
});

gulp.task('jshint', function() {
  return gulp.src(['./js/*.js'])
  .pipe(jshint())
  .pipe(jshint.reporter('default'));
});

gulp.task('bowerJS', function() {
  return gulp.src(lib.ext('js').files)
  .pipe(concat('vendor.min.js'))
  .pipe(uglify())
  .pipe(gulp.dest('./_site/assets/js'));
});

gulp.task('bowerCSS', function() {
  return gulp.src(lib.ext('css').files)
  .pipe(concat('vendor.css'))
  .pipe(gulp.dest('./_site/assets/css'));
});

gulp.task('cssBuild', function() {
  return gulp.src(['./sass/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./_site/assets/css'))
    .pipe(browserSync.stream());
});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "./_site/",
      index: "index.html"
    }
  });

  gulp.watch(['./js/*.js'], ['jsBuild']);
  gulp.watch(['bower.json'], ['bowerBuild']);
  gulp.watch(['*.html'], ['htmlBuild']);
  gulp.watch(["./assets/sass/*.scss"], ['cssBuild']);
});

gulp.task('jsBuild', ['jsBrowserify', 'jshint'], function(){
  browserSync.reload();
});

gulp.task('bowerBuild', ['bower'], function(){
  browserSync.reload();
});

gulp.task('htmlBuild', function() {
  browserSync.reload();
});

gulp.task('bower', ['bowerJS', 'bowerCSS']);
