'use strict';

/////////////////////////////// VARIABLES

var gulp                      = require('gulp'),
    watch                     = require('gulp-watch'),
    del                       = require('del'),
    cache                     = require('gulp-cached'),
    sass                      = require('gulp-sass'),
    autoprefixer              = require('gulp-autoprefixer'),
    cleanCSS                  = require('gulp-clean-css'),
    uglify                    = require('gulp-uglify'),
    imagemin                  = require('gulp-imagemin'),
    spritesmith               = require('gulp.spritesmith'),
    gulpif                    = require('gulp-if'),
    plumber                   = require('gulp-plumber'),
    notify                    = require("gulp-notify"),
    rigger                    = require("gulp-rigger"),
    rename                    = require('gulp-rename'),
    runSequence               = require('run-sequence'),
    pug                       = require('gulp-pug'),
    browserSync               = require('browser-sync').create(),
    iconfont                  = require('gulp-iconfont'),
    iconfontCss               = require('gulp-iconfont-css'),
    svgstore                  = require('gulp-svgstore'),
    svgmin                    = require('gulp-svgmin'),
    inject                    = require('gulp-inject'),
    sourcemaps                = require('gulp-sourcemaps'),
    cachedPug                 = true,
    cachedSass                = true;
    
/////////////////////////////// PATHS

var path = {
  build: {
    html: 'build/',
    js: 'build/js/',
    css: 'build/css/',
    img: 'build/images/',
    sprites: 'build/images/sprites/',
    fonts: 'build/fonts/'
  },
  src: {
    pug: 'src/*.pug',
    mainJs: 'src/js/main.js',
    vendorsJs: 'src/js/vendors.js',
    style: 'src/sass/*.scss',
    img: ['src/images/**/**/**/*.*', '!src/images/sprites/**/**/**/*.*'],
    iconFont: 'src/images/sprites/source_iconsfont/*.svg',
    pngSprite: 'src/images/sprites/source_sprite_png/**/*.png',
    svgSprite: 'src/images/sprites/source_sprite_svg/**/*.svg',
    fonts: 'src/fonts/**/*.*'
  },
  watch: {
    pug: 'src/*.pug',
    pugInclude: 'src/pug/**/**/**/*.pug',
    mainJs: 'src/js/**/*',
    vendorsJs: 'src/js/**/vendors.js',
    style: 'src/sass/*.*',
    styleInclude: ['src/sass/**/**/**/*.*', '!src/sass/*.*'],
    img: ['src/images/**/**/**/*.*', '!src/images/sprites/**/**/**/**/*.*'],
    iconFont: 'src/images/sprites/source_iconsfont/*.svg',
    pngSprite: 'src/images/sprites/source_sprite_png/**/*.png',
    svgSprite: 'src/images/sprites/source_sprite_svg/**/*.svg',
    fonts: 'src/fonts/**/**/**/*.*'
  },
  clean: './build'
};

/////////////////////////////// TASKS

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
    .pipe(gulpif(cachedPug, cache('pug')))
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
    //.pipe(sourcemaps.init())
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(autoprefixer())
    // .pipe(cleanCSS())
    //.pipe(sourcemaps.write())
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream());
});

gulp.task('mainJs:build', function() {
  return gulp.src(path.src.mainJs)
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(rigger())
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());
});

gulp.task('vendorsJs:build', function() {
  return gulp.src(path.src.vendorsJs)
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(rigger())
    .pipe(uglify())
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

///////////////////////////////// ICONFONT
gulp.task('iconFont', function() {
  return gulp.src(path.src.iconFont)
    .pipe(iconfontCss({
      fontName: 'icons-font',
      fontPath: '../fonts/',
      targetPath: '../sass/vendor/icons-font.scss'
    }))
    .pipe(iconfont({
      formats: ['ttf', 'eot', 'woff', 'woff2'],
      fontName: 'icons-font',
      normalize: true
    }))
    .pipe(gulp.dest('src/fonts/'))
    .pipe(browserSync.stream());
});

/////////////////////////////// PNG SPRITE
gulp.task('pngSprite', function () {
  var spriteData = gulp.src(path.src.pngSprite)
    .pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: '../images/sprites/sprite.png',
      cssName: 'sprite_png.scss',
      algorithm: 'binary-tree',
      padding: 15
    }));
    spriteData.img.pipe(gulp.dest(path.build.sprites))
    spriteData.css.pipe(gulp.dest('src/sass/vendor/'))
    .pipe(browserSync.stream());
});

gulp.task('svgSprite', function() {
  var svgs = gulp.src(path.src.svgSprite)
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
  return gulp.src('src/pug/svg-sprite.pug')
    .pipe(inject(svgs, {
      transform: fileContents
    }))
    .pipe(gulp.dest('src/pug'));
});

gulp.task('video:build', function() {
  return gulp.src('src/video/**')
    .pipe(gulp.dest('./build/video/'));
});

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });
});

gulp.task('watch', function() {
  watch(path.watch.pug, function(event, cb) {
    cachedPug = true;
    gulp.start('html:build');
  });
  watch(path.watch.pugInclude, function(event, cb) {
    cachedPug = false;
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
  watch(path.watch.mainJs, function(event, cb) {
    gulp.start('mainJs:build');
  });
  watch(path.watch.vendorsJs, function(event, cb) {
    gulp.start('vendorsJs:build');
  });
  watch(path.watch.img, function(event, cb) {
    gulp.start('image:build');
  });
  watch(path.watch.fonts, function(event, cb) {
    gulp.start('fonts:build');
  });
  watch(path.watch.iconFont, function(event, cb) {
    gulp.start('iconFont');
  });
  watch(path.watch.pngSprite, function(event, cb) {
    gulp.start('pngSprite');
  });
  watch(path.watch.svgSprite, function(event, cb) {
    gulp.start('svgSprite');
  });
});

gulp.task('default', function() {
  runSequence(
    'clearCache',
    'clean:build', 
    'html:build', 
    'style:build', 
    'mainJs:build', 
    'vendorsJs:build', 
    'image:build',
    'iconFont',
    'pngSprite',
    'svgSprite',
    'fonts:build',
    'video:build',
    'browser-sync',
    'watch');
});