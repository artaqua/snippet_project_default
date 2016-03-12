/////////////////////////////// COMMANDS

// gulp                      = запуск галпа
// gulp sprite               = сборка спрайтов
// gulp sprite2x             = сборка спрайтов для ретины
// gulp size                 = создание картинов для ретины
// gulp build                = сборка билда

/////////////////////////////// VARIABLES

var gulp                      = require('gulp'),
    del                       = require('del'),
    cache                     = require('gulp-cached'),
    sass                      = require('gulp-sass'),
    sassInheritance           = require('gulp-sass-inheritance'),
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
    iconfontCss               = require('gulp-iconfont-css'),
    svgstore                  = require('gulp-svgstore'),
    cheerio                   = require('gulp-cheerio');
    
/////////////////////////////// PATHS

var paths = {
  source: 'source/',
  jade: 'source/jade/',
  sass: 'source/sass/',
  css: 'source/css/',
  js: 'source/js/',
  images: 'source/images/',
  sprite: 'source/images/sprites/',
  iconsfont: 'source/images/sprites/source_iconsfont_svg/',
  fonts: 'source/fonts',
  build: 'build/'
};

/////////////////////////////// HTML

gulp.task('jade', function() {
  return gulp.src(paths.jade + '**/*.jade')
    .pipe(changed(paths.source, {
      extension: '.html'
    }))
    .pipe(gulpif(global.isWatching, cache('jade')))
    .pipe(jadeInheritance({
      basedir: paths.jade
    }))
    //filter out partials (folders and files starting with "_" )
    .pipe(filter(function(file) {
      return !/\/_/.test(file.path) && !/^_/.test(file.relative);
    }))
    .pipe(plumber())
    .pipe(jade({
      pretty: true
    }))
    .pipe(gulp.dest(paths.source));
});
gulp.task('jadeWatch', ['jade'], reload);

/////////////////////////////// SASS

gulp.task('sass', function() {
  return gulp.src(paths.sass + '*.scss')
    .pipe(cache('sass'))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 3 versions', '> 2%', 'ie 8', 'ie 9'],
      cascade: false
    }))
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
gulp.task('watch', ['setWatch', 'jade', 'sassIncludesWatch'], function() {
  browserSync({
    server: paths.source
  });
  gulp.watch(paths.jade + '**/*.jade', ['jadeWatch']);
  gulp.watch(paths.sass + '*.scss', ['sass']);
  gulp.watch([paths.sass + '_includes/*.scss', paths.sass + '_modules/*.scss'], ['sassIncludesWatch']);
  gulp.watch(paths.js + '**/*', ['js']);
  gulp.watch(paths.sprite + 'source_sprite/*.png', ['sprite']);
  gulp.watch(paths.iconsfont + '**/*', ['iconFont']);
  gulp.watch(paths.sprite + 'sourse_sprite_svg/**/*.svg', ['svgSprite']);
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
      fontName: 'icons-font',
      normalize: true
    }))
    .pipe(gulp.dest(paths.fonts));
});

/////////////////////////////// SVG SPRITE

gulp.task('svgSprite', function () {
  return gulp.src(paths.sprite + 'source_sprite_svg/**/*.svg')
    .pipe(cache('svg'))
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

// for normal images
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

// for 2x images
gulp.task('sprite2x', function () {
  runSequence('cleanSprite', 'spriteSize', 'spriteStyle2x');
});
gulp.task('cleanSprite', function() {
  return del(paths.sprite + 'source_sprite/2x/');
});
gulp.task('spriteSize', function () {
  return gulp.src(paths.sprite + 'source_sprite/*.png')
    .pipe(imageResize({
      width : '200%',
      height : '200%'
    }))
    .pipe(rename({ suffix: "_2x" }))
    .pipe(gulp.dest(paths.sprite + 'source_sprite/2x/'));
});
gulp.task('spriteStyle2x', function () {
  var spriteData = gulp.src(paths.sprite + 'source_sprite/**/*.png')
    .pipe(spritesmith({
      imgName: 'sprite.png',
      imgPath: '../images/sprites/sprite.png',
      retinaSrcFilter: paths.sprite + 'source_sprite/**/*_2x.png',
      retinaImgName: 'sprite_2x.png',
      retinaImgPath: '../images/sprites/sprite_2x.png',
      cssName: '_sprite.scss',
      algorithm: 'binary-tree',
      padding: 15
    }));
    spriteData.img.pipe(gulp.dest(paths.sprite));
    spriteData.css.pipe(gulp.dest(paths.sass + '_modules/'))
    .pipe(reload({stream: true}));
});

/////////////////////////////// SIZED IMG 2x

gulp.task('size', function () {
  runSequence('cleanSize', 'size2x');
});
gulp.task('cleanSize', function() {
  return del(paths.images + '2x/');
});
gulp.task('size2x', function () {
  gulp.src(paths.images + '1x/**/*.{jpg,png}')
    .pipe(imageResize({
      width : '200%',
      height : '200%'
    }))
    .pipe(rename({ suffix: "_2x" }))
    .pipe(gulp.dest(paths.images + '2x/'));
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
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulpif('*.js', uglify()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest(paths.build));
});

/////////////////////////////// DEFAULT

gulp.task('default', ['watch', 'sass', 'sassIncludes', 'jade', 'js', 'sprite', 'iconsFont', 'svgSprite']);