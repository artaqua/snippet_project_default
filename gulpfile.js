'use strict';

// /////////////////////////////// VARIABLES
var gulp                      = require('gulp'),
    watch                     = require('gulp-watch'),
    del                       = require('del'),
    cache                     = require('gulp-cached'),
    sass                      = require('gulp-sass'),
    moduleImporter            = require('sass-module-importer'),
    autoprefixer              = require('gulp-autoprefixer'),
    cleanCSS                  = require('gulp-clean-css'),
    imagemin                  = require('gulp-imagemin'),
    spritesmith               = require('gulp.spritesmith'),
    gulpif                    = require('gulp-if'),
    plumber                   = require('gulp-plumber'),
    notify                    = require("gulp-notify"),
    rename                    = require('gulp-rename'),
    runSequence               = require('run-sequence'),
    pug                       = require('gulp-pug'),
    browserSync               = require('browser-sync').create(),
    svgstore                  = require('gulp-svgstore'),
    svgmin                    = require('gulp-svgmin'),
    inject                    = require('gulp-inject'),
    webpack                   = require('webpack'),
    webpackStream             = require('webpack-stream'),
    webpackConfig             = require('./webpack.config.js'),
    cachedPug                 = true,
    cachedSass                = true;

    
// /////////////////////////////// PATHS
var path = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/images/',
    sprites: 'build/images/sprites/',
    fonts: 'build/fonts/',
    video: 'build/video/'
  },
  src: {
    pug: 'assets/*.pug',
    mainJs: 'assets/js/main.js',
    vendorsJs: 'assets/js/vendors.js',
    style: 'assets/sass/*.scss',
    img: ['assets/images/**/**/**/*.*', '!assets/images/sprites/**/**/**/*.*'],
    pngSprite: 'assets/images/sprites/source_sprite_png/**/*.png',
    sassComponents: 'assets/sass/_components/',
    sourceSvgSprite: 'assets/images/sprites/source_sprite_svg/**/*.svg',
    svgSprite: 'assets/pug/svg-sprite.pug',
    svgPugDest: 'assets/pug',
    fonts: 'assets/fonts/**/*.*',
    video: 'assets/video/**/*.*'
  },
  watch: {
    pug: 'assets/*.pug',
    pugInclude: 'assets/pug/**/**/**/*.pug',
    js: 'assets/js/**/*',
    style: 'assets/sass/*.*',
    styleInclude: ['assets/sass/**/**/**/*.*', '!assets/sass/*.*'],
    img: ['assets/images/**/**/**/*.*', '!assets/images/sprites/**/**/**/**/*.*'],
    pngSprite: 'assets/images/sprites/source_sprite_png/**/*.png',
    svgSprite: 'assets/images/sprites/source_sprite_svg/**/*.svg',
    fonts: 'assets/fonts/**/**/**/*.*',
    video: 'assets/video/**/**/**/*.*'
  },
  clean: './build',
  LiveReloadPath: './build'
};

// /////////////////////////////// TASKS
gulp.task('clearCache', function () {
  cache.caches = {};
});

gulp.task('clean:build', function() {
  return del.sync(path.build.html);
});

gulp.task('html:build',  function() {
  return gulp.src(path.src.pug)
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(cache('pug'))
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(path.build.html))
    .pipe(browserSync.stream());
});

gulp.task('style:build', function() {
  return gulp.src(path.src.style)
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(gulpif(cachedSass, cache('sass')))
    .pipe(sass({
      errLogToConsole: true,
      importer: moduleImporter()
    }))
    .pipe(autoprefixer())
    // .pipe(cleanCSS())
    .pipe(rename({
      basename: 'bundle'
    }))
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream());
});

gulp.task('js:build', function() {
  return gulp.src('src/entry.js')
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());
});

gulp.task('image:build', function() {
  return gulp.src(path.src.img)
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(cache('images'))
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      multipass: true,
      svgoPlugins: [
        {removeViewBox: false},
        {cleanupIDs: false}
      ]
    }))
    .pipe(gulp.dest(path.build.img))
    .pipe(browserSync.stream());
});

gulp.task('fonts:build', function() {
  return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts))
    .pipe(browserSync.stream());
});
gulp.task('video:build', function() {
  return gulp.src(path.src.video)
    .pipe(gulp.dest(path.build.video));
});

gulp.task('pngSprite', function () {
  var spriteData = gulp.src(path.src.pngSprite)
    .pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: '../images/sprites/sprite.png',
      cssName: 'png-sprite.scss',
      algorithm: 'binary-tree',
      padding: 15
    }));
    spriteData.img.pipe(gulp.dest(path.build.sprites))
    spriteData.css.pipe(gulp.dest(path.src.sassComponents))
    .pipe(browserSync.stream());
});

gulp.task('svgSprite', function() {
  var svgs = gulp.src(path.src.sourceSvgSprite)
    .pipe(rename({
      prefix: 'svg-icon-'
    }))
    .pipe(svgmin())
    .pipe(svgstore({
      inlineSvg: true
    }))

  function fileContents(filePath, file) {
    return file.contents.toString();
  }
  return gulp.src(path.src.svgSprite)
    .pipe(inject(svgs, {
      transform: fileContents
    }))
    .pipe(gulp.dest(path.src.svgPugDest));
});

/////////////////////////////// LIVERELOAD
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: path.LiveReloadPath
    }
  });
});

/////////////////////////////// WATCH
gulp.task('watch', function() {
  watch(path.watch.pug, function(event, cb) {
    gulp.start('html:build');
  });
  watch(path.watch.pugInclude, function(event, cb) {
    gulp.start('html:build');
  });
  watch(path.watch.style, function(event, cb) {
    cachedSass = true;
    gulp.start('style:build');
  });
  watch(path.watch.styleInclude, function(event, cb) {
    cachedSass = false;
    gulp.start('style:build');
  });
  watch(path.watch.js, function(event, cb) {
    gulp.start('js:build');
  });
  watch(path.watch.img, function(event, cb) {
    gulp.start('image:build');
  });
  watch(path.watch.fonts, function(event, cb) {
    gulp.start('fonts:build');
  });
  watch(path.watch.pngSprite, function(event, cb) {
    gulp.start('pngSprite');
  });
  watch(path.watch.svgSprite, function(event, cb) {
    gulp.start('svgSprite');
  });
});

/////////////////////////////// DEFAULT
gulp.task('default', function() {
  runSequence(
    'clearCache',
    'clean:build', 
    'html:build',
    'style:build',
    'js:build',
    'image:build',
    'pngSprite',
    'svgSprite',
    'fonts:build',
    'video:build',
    'browser-sync',
    'watch'
  )
});