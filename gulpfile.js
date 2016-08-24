/////////////////////////////// COMMANDS

// gulp                      = запуск галпа
// gulp clearCache           = очистка кеша
// gulp build                = сборка билда

'use strict';

/////////////////////////////// VARIABLES

var gulp                      = require('gulp'),
    del                       = require('del'),
    cache                     = require('gulp-cached'),
    sass                      = require('gulp-sass'),
    sassInheritance           = require('gulp-sass-inheritance'),
    autoprefixer              = require('gulp-autoprefixer'),
    cleanCSS                  = require('gulp-clean-css'),
    uglify                    = require('gulp-uglify'),
    imagemin                  = require('gulp-imagemin'),
    spritesmith               = require('gulp.spritesmith'),
    useref                    = require('gulp-useref'),
    gulpif                    = require('gulp-if'),
    plumber                   = require('gulp-plumber'),
    rename                    = require('gulp-rename'),
    runSequence               = require('run-sequence'),
    pug                       = require('gulp-pug'),
    changed                   = require('gulp-changed'),
    filter                    = require('gulp-filter'),
    browserSync               = require('browser-sync'),
    reload                    = browserSync.reload,
    iconfont                  = require('gulp-iconfont'),
    iconfontCss               = require('gulp-iconfont-css'),
    svgstore                  = require('gulp-svgstore'),
    cheerio                   = require('gulp-cheerio'),
    sourcemaps                = require('gulp-sourcemaps');
    
/////////////////////////////// PATHS

var paths = {
  source: 'assets/',
  pug: 'assets/pug/',
  sass: 'assets/sass/',
  css: 'assets/css/',
  js: 'assets/js/',
  images: 'assets/images/',
  sprite: 'assets/images/sprites/',
  iconsfont: 'assets/images/sprites/source_iconsfont_svg/',
  fonts: 'assets/fonts',
  build: 'build/'
};

/////////////////////////////// HTML

gulp.task('pug', function() {
  return gulp.src(paths.pug + '*.pug')
    .pipe(cache('pug'))
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(paths.source))
    .pipe(reload({stream: true}));
});
gulp.task('pugIncludes', function() {
  return gulp.src(paths.pug + '*.pug')
    .pipe(plumber())
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest(paths.source))
    .pipe(reload({stream: true}));
});

/////////////////////////////// SASS

gulp.task('sass', function() {
  return gulp.src(paths.sass + '*.scss')
    .pipe(sourcemaps.init())
    .pipe(cache('sass'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 3 versions', '> 2%', 'ie 8', 'ie 9'],
      cascade: false
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.css))
    .pipe(reload({stream: true}));
});
gulp.task('sassIncludes', function() {
  return gulp.src(paths.sass + '**/*.scss')
    .pipe(changed(paths.css, {
      extension: '.css'
    }))
    .pipe(gulpif(global.isWatching, cache('sassIncludes')))
    .pipe(sassInheritance({
      dir: paths.sass
    }))
    .pipe(filter(function (file) {
      return !/\/_/.test(file.path) || !/^_/.test(file.relative);
    }))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 3 versions', '> 2%', 'ie 8', 'ie 9'],
      cascade: false
    }))
    .pipe(gulp.dest(paths.css));
});
gulp.task('sassIncludesWatch', ['sassIncludes'], reload);

/////////////////////////////// JS

gulp.task('js', function() {
  gulp.src(paths.js)
    .pipe(reload({stream: true}));
});

/////////////////////////////// WATCH

gulp.task('setWatch', function() {
  global.isWatching = true;
});
gulp.task('watch', ['setWatch', 'sassIncludesWatch'], function() {
  browserSync({
    server: paths.source
  });
  gulp.watch(paths.pug + '*.pug', ['pug']);
  gulp.watch(paths.pug + '_includes/*.pug', ['pug', 'pugIncludes',]);
  gulp.watch(paths.sass + '*.scss', ['sass']);
  gulp.watch([paths.sass + '_includes/*.scss', paths.sass + '_modules/*.scss'], ['sassIncludesWatch']);
  gulp.watch(paths.js + '**/*', ['js']);
  gulp.watch(paths.sprite + 'source_sprite/*.png', ['sprite']);
  gulp.watch(paths.iconsfont + '**/*', ['iconsFont']);
  gulp.watch(paths.sprite + 'source_sprite_svg/**/*.svg', ['svgSprite', 'pug']);
});

/////////////////////////////// ICONSFONT

gulp.task('iconsFont', function() {
  gulp.src(paths.iconsfont + '*.svg')
    .pipe(iconfontCss({
      fontName: 'icons-font',
      fontPath: '../fonts/',
      targetPath: '../css/icons-style.css'
    }))
    .pipe(iconfont({
      formats: ['ttf', 'eot', 'woff', 'woff2'],
      fontName: 'icons-font',
      normalize: true
    }))
    .pipe(gulp.dest(paths.fonts))
    .pipe(reload({stream:true}));
});

/////////////////////////////// SVG SPRITE

gulp.task('svgSprite', function () {
  return gulp.src(paths.sprite + 'source_sprite_svg/**/*.svg')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [
        {removeViewBox: false},
        {cleanupIDs: false}
      ]
    }))
    .pipe(svgstore({ fileName: 'icons.svg', inlineSvg: true}))
    .pipe(cheerio({
      run: function ($, file) {
        $('svg').addClass('hide');
        $('[fill]').removeAttr('fill');
      },
      parserOptions: { xmlMode: true }
    }))
    .pipe(rename('sprite_svg.svg'))
    .pipe(gulp.dest(paths.sprite))
    .pipe(reload({stream:true}));
});

/////////////////////////////// SPRITE

gulp.task('sprite', function () {
  var spriteData = gulp.src(paths.sprite + 'source_sprite/**/*.png')
    .pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: '../images/sprites/sprite.png',
      cssName: '_sprite.scss',
      algorithm: 'binary-tree',
      padding: 15
    }));
    spriteData.img.pipe(gulp.dest(paths.sprite));
    spriteData.css.pipe(gulp.dest(paths.sass + '_modules/'))
    .pipe(reload({stream: true}));
});

/////////////////////////////// BUILD

gulp.task('build', function() {
  runSequence('cleanBuild', 'imagemin', 'cleanSource', 'fonts', 'json', 'building');
});

gulp.task('cleanBuild', function() {
  return del(paths.build);
});

gulp.task('imagemin', function() {
  return gulp.src(paths.images + '**/*')
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true,
      multipass: true,
      svgoPlugins: [
        {removeViewBox: false},
        {cleanupIDs: false}
      ]
    }))
    .pipe(gulp.dest(paths.build + 'images/'));
});

gulp.task('cleanSource', function() {
  del(paths.build + 'images/sprites/source_sprite');
  del(paths.build + 'images/sprites/source_iconsfont_svg');
  del(paths.build + 'images/sprites/source_sprite_svg');
});

gulp.task('fonts', function () {
  return gulp.src(paths.fonts + '**/*')
    .pipe(gulp.dest(paths.build));
});

gulp.task('json', function () {
  return gulp.src(paths.js + '**/*.json')
    .pipe(gulp.dest(paths.build + 'js/'));
});

gulp.task('building', function () {
  var assets = useref.assets();

  return gulp.src(paths.source + '*.html')
    .pipe(assets)
    .pipe(gulpif('*.css', cleanCSS()))
    .pipe(gulpif('*.js', uglify()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest(paths.build));
});

/////////////////////////////// CLEAR CACHE

gulp.task('clearCache', function () {
  cache.caches ={};
});

/////////////////////////////// DEFAULT

gulp.task('default', ['clearCache', 'watch', 'sass', 'sassIncludes', 'pug', 'js', 'sprite', 'iconsFont', 'svgSprite']);