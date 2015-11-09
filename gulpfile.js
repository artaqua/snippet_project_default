/*================================
=            COMMANDS            =
================================*/

// gulp                      = запуск галпа
// gulp iconFont             = сборка шрифтовых иконок из svg
// gulp sprite               = сборка спрайтов
// gulp sprite2x             = сборка спрайтов для ретины
// gulp size                 = создание картинов для ретины
// gulp build                = сборка билда

/*=================================
=            VARIABLES            =
=================================*/

var gulp                      = require('gulp'),
    del                       = require('del'),
    cache                     = require('gulp-cached'),
    stylus                    = require('gulp-stylus'),
    nib                       = require('nib'),
    rupture                   = require('rupture'),
    autoprefixer              = require('gulp-autoprefixer'),
    minifyCss                 = require('gulp-minify-css'),
    uglify                    = require('gulp-uglify'),
    imagemin                  = require('gulp-imagemin'),
    spritesmith               = require('gulp.spritesmith'),
    useref                    = require('gulp-useref'),
    gulpif                    = require('gulp-if'),
    plumber                   = require('gulp-plumber'),
    imageResize               = require('gulp-image-resize'),
    rename                    = require('gulp-rename'),
    runSequence               = require('run-sequence'),
    jade                      = require('gulp-jade'),
    jadeInheritance           = require('gulp-jade-inheritance'),
    changed                   = require('gulp-changed'),
    filter                    = require('gulp-filter'),
    browserSync               = require('browser-sync'),
    reload                    = browserSync.reload,
    iconfont                  = require('gulp-iconfont'),
    iconfontCss               = require('gulp-iconfont-css');

/*=============================
=            PATHS            =
=============================*/

var path = {
  source: 'source/',
  jade: 'source/jade/',
  stylus: 'source/stylus/',
  css: 'source/css/',
  js: 'source/js/',
  images: 'source/images/',
  sprite: 'source/images/sprites/',
  iconfont: 'source/images/iconfont/',
  fonts: 'source/fonts',
  build: 'build/'
};

/*============================
=            HTML            =
============================*/

gulp.task('jade', function() {
  return gulp.src(path.jade + '**/*.jade')
    .pipe(changed(path.source, {
      extension: '.html'
    }))
    .pipe(gulpif(global.isWatching, cache('jade')))
    .pipe(jadeInheritance({
      basedir: path.jade
    }))
    //filter out partials (folders and files starting with "_" )
    .pipe(filter(function(file) {
      return !/\/_/.test(file.path) && !/^_/.test(file.relative);
    }))
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(path.source));
});
gulp.task('jadeWatch', ['jade'], reload);
gulp.task('setWatch', function() {
  global.isWatching = true;
});

/*==============================
=            STYLUS            =
==============================*/

gulp.task('stylus', function() {
  return gulp.src(path.stylus + '*.styl')
    .pipe(cache('stylus'))
    .pipe(plumber())
    .pipe(stylus({
      use: [
        nib(),
        rupture()
      ]
    }))
    .pipe(autoprefixer({
      browsers: ['last 3 versions', '> 2%', 'ie 8', 'ie 9'],
      cascade: false
    }))
    .pipe(gulp.dest(path.css))
    .pipe(reload({stream: true}));
});
gulp.task('stylusInclude', function() {
  return gulp.src(path.stylus + '*.styl')
    .pipe(plumber())
    .pipe(stylus({
      use: [
        nib(),
        rupture()
      ]
    }))
    .pipe(autoprefixer({
      browsers: ['last 3 versions', '> 2%', 'ie 8', 'ie 9'],
      cascade: false
    }))
    .pipe(gulp.dest(path.css))
    .pipe(reload({stream: true}));
});

/*==========================
=            JS            =
==========================*/

gulp.task('js', function() {
  gulp.src(path.js)
    .pipe(reload({stream: true}));
});

/*=============================
=            WATCH            =
=============================*/

gulp.task('watch', ['setWatch', 'jade'], function() {
  browserSync({
    server: path.source
  });
  gulp.watch(path.jade + '**/*.jade', ['jadeWatch']);
  gulp.watch(path.stylus + '*.styl', ['stylus']);
  gulp.watch(path.stylus + '_includes/*.styl', ['stylusInclude']);
  gulp.watch(path.js + '*.js', ['js']);
  gulp.watch(path.sprite + 'source_sprite/*.png', ['sprite']);
  gulp.watch(path.iconfont + '**/*', ['iconFont']);
});

/*================================
=            ICONFONT            =
================================*/

gulp.task('iconFont', function() {
  gulp.src(path.iconfont + '*.svg')
    .pipe(iconfontCss({
      fontName: 'icon-font',
      fontPath: '../fonts/',
      targetPath: '../css/icons-style.css'
    }))
    .pipe(iconfont({
      fontName: 'icon-font',
      normalize: true
    }))
    .pipe(gulp.dest(path.fonts));
});

/*==============================
=            SPRITE            =
==============================*/

// for normal images
gulp.task('sprite', function () {
  var spriteData = gulp.src(path.sprite + 'source_sprite/**/*.png')
    .pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: '../images/sprites/sprite.png',
      cssName: '_sprite.styl',
      algorithm: 'binary-tree',
      padding: 15
    }));
    spriteData.img.pipe(gulp.dest(path.sprite));
    spriteData.css.pipe(gulp.dest(path.stylus + 'modules/'))
    .pipe(reload({stream: true}));
});

// for 2x images
gulp.task('sprite2x', function () {
  runSequence('cleanSprite', 'spriteSize', 'spriteStyle2x');
});
gulp.task('cleanSprite', function() {
  return del(path.sprite + 'source_sprite/2x/');
});
gulp.task('spriteSize', function () {
  return gulp.src(path.sprite + 'source_sprite/*.png')
    .pipe(imageResize({
      width : '200%',
      height : '200%'
    }))
    .pipe(rename({ suffix: "_2x" }))
    .pipe(gulp.dest(path.sprite + 'source_sprite/2x/'));
});
gulp.task('spriteStyle2x', function () {
  var spriteData = gulp.src(path.sprite + 'source_sprite/**/*.png')
    .pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: '../images/sprites/sprite.png',
      retinaSrcFilter: path.sprite + 'source_sprite/**/*_2x.png',
      retinaImgName: 'sprite_2x.png',
      retinaImgPath: '../images/sprites/sprite_2x.png',
      cssName: '_sprite.styl',
      algorithm: 'binary-tree',
      padding: 15
    }));
    spriteData.img.pipe(gulp.dest(path.sprite));
    spriteData.css.pipe(gulp.dest(path.stylus + 'modules/'))
    .pipe(reload({stream: true}));
});

/*====================================
=            SIZED IMG 2x            =
====================================*/

gulp.task('size', function () {
  runSequence('cleanSize', 'size2x');
});
gulp.task('cleanSize', function() {
  return del(path.images + '2x/');
});
gulp.task('size2x', function () {
  gulp.src(path.images + '1x/**/*.{jpg,png}')
    .pipe(imageResize({
      width : '200%',
      height : '200%'
    }))
    .pipe(rename({ suffix: "_2x" }))
    .pipe(gulp.dest(path.images + '2x/'));
});

/*=============================
=            BUILD            =
=============================*/

gulp.task('build', function() {
  runSequence('cleanBuild', 'imagemin', 'cleanSource', 'fonts', 'building');
});

gulp.task('cleanBuild', function() {
  return del(path.build);
});

gulp.task('imagemin', function() {
  return gulp.src(path.images + '**/*')
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true,
      multipass: true,
      svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(gulp.dest(path.build + 'images/'));
});

gulp.task('cleanSource', function() {
  del(path.build + 'images/sprites/source_sprite');
  del(path.build + 'images/iconfont');
});

gulp.task('fonts', function () {
  return gulp.src(path.fonts + '**/*')
    .pipe(gulp.dest(path.build));
});

gulp.task('building', function () {
  var assets = useref.assets();

  return gulp.src(path.source + '*.html')
    .pipe(assets)
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulpif('*.js', uglify()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest(path.build));
});

/*===============================
=            DEFAULT            =
===============================*/

gulp.task('default', ['watch', 'jade', 'stylus', 'js', 'sprite', 'iconFont']);