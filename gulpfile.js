/*=================================
=            VARIABLES            =
=================================*/

var 	gulp 						   = require('gulp'),
		del 						   = require('del'),
		stylus 					   = require('gulp-stylus'),
		nib 						   = require('nib'),
		rupture 				      = require('rupture'),
		autoprefixer 		      = require('gulp-autoprefixer'),
		minifyCss 			      = require('gulp-minify-css'),
		uglify 					   = require('gulp-uglify'),
		imagemin 				   = require('gulp-imagemin'),
		spritesmith 				= require('gulp.spritesmith'),
		connect 				      = require('gulp-connect'),
		wiredep 				      = require('wiredep').stream,
		useref 					   = require('gulp-useref'),
		gulpif 					   = require('gulp-if'),
		plumber 						= require('gulp-plumber');

/*===============================
=            SOURCES            =
===============================*/

var	htmlSources 				= 'source/*.html',
		stylusSources 				= 'source/stylus/*.styl',
		jsSources 					= 'source/js/*.js',
		imageSources 				= 'source/images/**/*',
		spriteSources				= 'source/images/sprites/source_sprite/*';

/*=============================
=            BUILD            =
=============================*/

gulp.task('clean:build', function() {
	del.sync(['build']);
});

gulp.task('img', ['clean:build'], function() {
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

gulp.task('clean:source', ['img'], function() {
	del(['build/images/sprites/source_sprite']);
});

gulp.task('build', ['clean:source'], function () {
	var assets = useref.assets();

	gulp.src(htmlSources)
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

gulp.task('sprite', function () {
	var spriteData = gulp.src(spriteSources)
			.pipe(spritesmith({
				imgName: 'sprite.png',
				imgPath: '../images/sprites/sprite.png',
				cssName: '_sprite.styl',
		      cssFormat: 'stylus',
		      algorithm: 'binary-tree'
			}));
  	spriteData.img.pipe(gulp.dest('source/images/sprites/'));
   spriteData.css.pipe(gulp.dest('source/stylus/packages/'));
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

gulp.task('default', ['html', 'stylus', 'js', 'connect', 'bower', 'sprite', 'watch']);