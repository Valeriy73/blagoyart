const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');

// Static server
gulp.task('server', function() {
    browserSync.init({
        server: {
			port: 9000,
            baseDir: "build"
        }
    });
	
	gulp.watch('build/**/*').on('change', browserSync.reload);
});

// Pug compile
/*gulp.task('templates:compile', function buildHTML() {
  return gulp.src('source/template/index.pug')
  .pipe(pug({
    pretty: true 
  }))
  .pipe(gulp.dest('build'))
});*/

// Styles compile
gulp.task('styles:compile', function () {
  return gulp.src('source/scss/style.scss')
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(autoprefixer({
		browsers: ['last 2 versions'],
		cascade: false
	}))
	.pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css'));
});

// JS

gulp.task('js', function () {
  return gulp.src([
  		'source/js/custom.js'
  	])
  .pipe(sourcemaps.init())
	.pipe(concat('main.min.js'))
	.pipe(uglify())
	.pipe(sourcemaps.write())
  .pipe(gulp.dest('build/js'));
});
 
 // Sprite
 gulp.task('sprite', function (cb) {
  const spriteData = gulp.src('source/img/icons/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
	imgPath: '../img/sprite.png',
    cssName: 'sprite.scss'
  }));
  
  spriteData.img.pipe(gulp.dest('build/img/'));
  spriteData.css.pipe(gulp.dest('source/scss/base'));
  cb();
});

//Delete
gulp.task('clean', function del(cb) {
	return rimraf('build', cb);
});

// Copy fonts
gulp.task('copy:fonts', function() {
	return gulp.src('./source/fonts/**/*.*')
		.pipe(gulp.dest('build/fonts'));
});

// Copy images
gulp.task('copy:images', function() {
	return gulp.src('./source/img/**/*.*')
		.pipe(gulp.dest('build/img'));
});

gulp.task('copy:index', function() {
	return gulp.src('./source/template/index.html')
		.pipe(gulp.dest('build'));
});

// Copy
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images', 'copy:index'));

//Watchers
gulp.task('watch', function() {
	gulp.watch('source/template/index.html', gulp.series('copy:index'));
	gulp.watch('source/scss/**/*.scss', gulp.series('styles:compile'));
	gulp.watch('source/js/**/*.js', gulp.series('js'));
});

//Default
gulp.task('default', gulp.series(
	'clean',
	gulp.parallel('styles:compile', 'sprite', 'copy', 'js'),
	gulp.parallel('watch', 'server')
	)
);


