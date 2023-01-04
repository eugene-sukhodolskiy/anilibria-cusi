const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const watch = require("gulp-watch");
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");

gulp.task("sass-build", () => {
	return gulp.src("./scss/index.scss")
	.pipe(sourcemaps.init())
	.pipe(sass().on("error", sass.logError))
	.pipe(concat("style.min.css"))
	.pipe(cleanCSS())
	.pipe(sourcemaps.write("./"))
	.pipe(gulp.dest("./css/"));
});

gulp.task("watch", () => {
	return gulp.watch("./scss/**/*.scss", gulp.series("sass-build"));
});