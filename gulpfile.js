/*=================================
=            VARIABLES            =
=================================*/

var gulp 						    			= require('gulp'),
		del 						    			= require('del'),
		stylus 					    			= require('gulp-stylus'),
		nib 						    			= require('nib'),
		rupture 				    			= require('rupture'),
		autoprefixer 		    			= require('gulp-autoprefixer'),
		minifyCss 			    			= require('gulp-minify-css'),
		uglify 					    			= require('gulp-uglify'),
		imagemin 									= require('gulp-imagemin'),
		spritesmith 							= require('gulp.spritesmith'),
		connect 				    			= require('gulp-connect'),
		wiredep 				    			= require('wiredep').stream,
		useref 					    			= require('gulp-useref'),
		gulpif 					    			= require('gulp-if'),
		plumber 									= require('gulp-plumber'),
		imageResize 							= require('gulp-image-resize'),
		rename 										= require('gulp-rename'),
		runSequence 							= require('run-sequence');

/*===============================
=            SOURCES            =
===============================*/

var	htmlSources 							= 'source/*.html',
		stylusSources 						= 'source/stylus/*.styl',
		jsSources 								= 'source/js/*.js',
		imageSources 							= 'source/images/**/*',
		spriteSources 						= 'source/images/sprites/';

/*=============================
=            BUILD            =
=============================*/

gulp.task('build', function() {
	runSequence('clean-sprite', 'imagemin', 'clean-source', 'building');
});

gulp.task('clean-build', function() {
	return del(['build/']);
});

gulp.task('imagemin', function() {
	return gulp.src(imageSources)
		.pipe(imagemin({
			optimizationLevel: 3,
			progressive: true,
			interlaced: true,
			multipass: true,
			svgoPlugins: [{removeViewBox: false}]
		}))
		.pipe(gulp.dest('build/images/'));
});

gulp.task('clean-source', function() {
	return del(['build/images/sprites/source_sprite']);
});

gulp.task('building', function () {
	var assets = useref.assets();

	return gulp.src(htmlSources)
		.pipe(assets)
		.pipe(gulpif('*.css', minifyCss()))
		.pipe(gulpif('*.js', uglify()))
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(gulp.dest('build/'));
});

/*=============================
=            BOWER            =
=============================*/

gulp.task('bower', function () {
	gulp.src(htmlSources)
		.pipe(wiredep({
			directory: 'source/bower_components/'
		}))
		.pipe(gulp.dest('source/'))
		.pipe(connect.reload());
});

/*============================
=            HTML            =
============================*/

gulp.task('html', function() {
	gulp.src(htmlSources)
		.pipe(connect.reload());
});

/*==============================
=            STYLUS            =
==============================*/

gulp.task('stylus', function() {
	gulp.src(stylusSources)
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
		.pipe(gulp.dest('source/css/'))
		.pipe(connect.reload());
});

/*==========================
=            JS            =
==========================*/

gulp.task('js', function() {
	gulp.src(jsSources)
		.pipe(connect.reload());
});

/*==============================
=            SPRITE            =
==============================*/

// for normal images
gulp.task('sprite', function () {
	var spriteData = gulp.src(spriteSources + 'source_sprite/**/*.png')

		.pipe(spritesmith({
			imgName: 'sprite.png',
			imgPath: '../images/sprites/sprite.png',
			cssName: '_sprite.styl',
	    algorithm: 'binary-tree',
	    padding: 15
		}))
  	spriteData.img.pipe(gulp.dest(spriteSources))
   	spriteData.css.pipe(gulp.dest('source/stylus/packages/'));
});

// for 2x images
gulp.task('sprite-2x', function () {
  runSequence('clean-sprite', 'sprite-size', 'sprite-style-2x');
});

gulp.task('clean-sprite', function() {
	return del([spriteSources + 'source_sprite/2x/']);
});

gulp.task('sprite-size', function () {
  return gulp.src(spriteSources + 'source_sprite/*.png')
    .pipe(imageResize({
      width : '200%',
      height : '200%'
    }))
    .pipe(rename({ suffix: "_2x" }))
    .pipe(gulp.dest(spriteSources + 'source_sprite/2x/'));
});

gulp.task('sprite-style-2x', function () {
	var spriteData = gulp.src(spriteSources + 'source_sprite/**/*.png')

		.pipe(spritesmith({
			imgName: 'sprite.png',
			imgPath: '../images/sprites/sprite.png',
			retinaSrcFilter: spriteSources + 'source_sprite/**/*_2x.png',
			retinaImgName: 'sprite_2x.png',
			retinaImgPath: '../images/sprites/sprite_2x.png',
			cssName: '_sprite.styl',
	    algorithm: 'binary-tree',
	    padding: 15
		}))
  	spriteData.img.pipe(gulp.dest(spriteSources))
   	spriteData.css.pipe(gulp.dest('source/stylus/packages/'));
});

/*====================================
=            SIZED IMG 2x            =
====================================*/

gulp.task('size', function () {
  runSequence('clean-size', 'size-2x');
});

gulp.task('clean-size', function() {
	return del(['source/images/2x/']);
});

gulp.task('size-2x', function () {
  gulp.src('source/images/1x/**/*.{jpg,png}')
    .pipe(imageResize({
      width : '200%',
      height : '200%'
    }))
    .pipe(rename({ suffix: "_2x" }))
    .pipe(gulp.dest('source/images/2x/'));
});

/*==============================
=            SERVER            =
==============================*/

gulp.task('connect', function() {
	connect.server({
		root: 'source/',
		livereload: true
	});
});

/*=============================
=            WATCH            =
=============================*/

gulp.task('watch', function() {
	gulp.watch(htmlSources, ['html']);
	gulp.watch(stylusSources, ['stylus']);
	gulp.watch(jsSources, ['js']);
	gulp.watch('bower.json', ['bower']);
	gulp.watch(spriteSources, ['sprite']);
});

/*===============================
=            DEFAULT            =
===============================*/

gulp.task('default', ['html', 'stylus', 'js', 'connect', 'bower', 'watch']);