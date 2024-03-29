// Assigning modules to local variables
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');
var ghPages = require('gulp-gh-pages');
var clean = require('gulp-clean');
var gulpCopy = require('gulp-copy');
var runSequence = require('run-sequence');
var nunjucks = require('gulp-nunjucks-html');
var markdown = require('nunjucks-markdown'),
    marked = require('marked');
var imagemin = require('gulp-imagemin');

var pkg = require('./package.json');

// Set the banner content
var banner = ['/*!\n',
    ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
    ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
    ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
    ' */\n',
    ''
].join('');

// Default task
gulp.task('default', ['sass', 'minify-css', 'minify-js', 'optimize-img', 'copy', 'pages', 'copy-to-dist']);

// sass task to compile the sass files and add the banner
gulp.task('sass', function() {
  return gulp.src('scss/agency.scss')
    .pipe(sass())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(gulp.dest('.tmp/css/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Minify CSS
gulp.task('minify-css', function() {
  return gulp.src('.tmp/css/agency.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    // .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Minify JS
gulp.task('minify-js', function() {
  return gulp.src('js/agency.js')
    // .pipe(uglify())
    // .pipe(header(banner, { pkg: pkg }))
    // .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('js'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('optimize-img', function() {
  gulp.src('img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'))
});

// Copy Bootstrap core files from node_modules to vendor directory
gulp.task('bootstrap', function() {
  return gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
    .pipe(gulp.dest('dist/vendor/bootstrap'))
})

// Copy jQuery core files from node_modules to vendor directory
gulp.task('jquery', function() {
  return gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
    .pipe(gulp.dest('dist/vendor/jquery'))
})

// Copy Font Awesome core files from node_modules to vendor directory
gulp.task('fontawesome', function() {
  return gulp.src([
    'node_modules/font-awesome/**',
    '!node_modules/font-awesome/**/*.map',
    '!node_modules/font-awesome/.npmignore',
    '!node_modules/font-awesome/*.txt',
    '!node_modules/font-awesome/*.md',
    '!node_modules/font-awesome/*.json'
  ]).pipe(gulp.dest('dist/vendor/font-awesome'))
})

// Copy all third party dependencies from node_modules to vendor directory
gulp.task('copy', ['bootstrap', 'jquery', 'fontawesome']);

// Configure the browserSync task
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    },
  })
})

// Watch Task that compiles sass and watches for HTML or JS changes and reloads with browserSync
gulp.task('dev', [
    'browserSync', 'pages', 'sass', 'copy',
    'minify-css', 'minify-js', 'optimize-img'
  ], function() {
    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch('.tmp/css/*.css', ['minify-css']);
    gulp.watch('js/*.js', ['minify-js']);
    gulp.watch([
      'includes/**/*.html',
      'pages/**/*.html',
      'templates/**/*.html'
    ], ['pages']);

    // Reloads the browser whenever HTML or JS files change
    gulp.watch('dist/**/*.html', browserSync.reload);
    gulp.watch('js/**/*.js', browserSync.reload);
  }
);

var templates = './templates'; //Set this as the folder that contains your nunjuck files
var pages = './pages';
var includes = './includes';
var nunjucksCtx = [templates, pages, includes];

gulp.task('pages', ['copy-to-dist'], function(){
  return gulp.src(pages + '/**/*.html')
    .pipe(nunjucks({
      searchPaths: nunjucksCtx,
      // setUp: function(env) {
      //   markdown.register(env, marked);
      // }
    }))
    // .pipe(gulpif(env.p, minifyHtml()))
    .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function() {
  gulp.src('dist').pipe(clean({force: true}));
})

gulp.task('copy-to-dist', function() {
  gulp.src([
    'js/**/*', 'CNAME'
  ]).pipe(gulpCopy('dist'));
  return gulp.src([
    'fonts/**/*'
  ]).pipe(gulpCopy('dist/css'));
})

gulp.task('gh-deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('build', function(done) {
  runSequence('default', function() {
    done();
  });
});

gulp.task('deploy', function(done) {
  runSequence('build', 'gh-deploy', function() {
    done();
  });
});
