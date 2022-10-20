const { src, dest, parallel, series, watch } = require('gulp');
const autoPrefixer = require('gulp-autoprefixer');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const notify = require('gulp-notify');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-image');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fs = require('fs');
const del = require('del');

const fonts = () => {
  src('./src/fonts/**.ttf')
    .pipe(ttf2woff())
    .pipe(dest('./dist/fonts/'))
  return src('./src/fonts/**.ttf')
    .pipe(ttf2woff2())
    .pipe(dest('./dist/fonts/'))
}

const cb = () => { }

let srcFonts = './src/scss/_fonts.scss';
let distFonts = './dist/fonts/';

const fontsStyle = (done) => {
  let file_content = fs.readFileSync(srcFonts);

  fs.writeFile(srcFonts, '', cb);
  fs.readdir(distFonts, function (err, items) {
    if (items) {
      let c_fontname;
      for (var i = 0; i < items.length; i++) {
        let fontname = items[i].split('.');
        fontname = fontname[0];
        if (c_fontname != fontname) {
          fs.appendFile(srcFonts, '@include font-face("' + fontname + '", "' + fontname + '", 400);\r\n', cb);
        }
        c_fontname = fontname;
      }
    }
  })

  done()
}

const svgSprites = () => {
  return src('./src/img/svg/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      }
    }))
    .pipe(dest('./dist/img'))
}

const styles = () => {
  return src('./src/scss/**/*.scss') // В папке стилей находим все scss файлы
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded'
    }
    ).on('error', notify.onError()))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(autoPrefixer({
      cascade: false,
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./dist/css/')) // Пушим в финальную папку
    .pipe(browserSync.stream());
}
const scripts = () => {
  return src([
    'src/js/components/**/*.js',
    'src/js/main.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('js/app.js'))
    .pipe(uglify({
      toplevel: true // За этой настройкой нужно следить т.к может что-нибудь сломать
    }).on('error', notify.onError()))
    .pipe(sourcemaps.write())
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const htmlInclude = () => {
  return src(['./src/index.html'])
    .pipe(fileinclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(dest('./dist'))
    .pipe(browserSync.stream());
}

const imgToDist = () => {
  return src(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg'])
    .pipe(image())
    .pipe(dest('./dist/img'))
}

const resources = () => {
  return src('./src/resources/**')
    .pipe(dest('./dist'))
}

const clean = () => {
  return del(['dist/*'])
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
}

watch('./src/scss/**/*.scss', styles);
watch('./src/index.html', htmlInclude);
watch('./src/img/**.jpg', imgToDist);
watch('./src/img/**.png', imgToDist);
watch('./src/img/**.jpeg', imgToDist);
watch('./src/img/svg/*.svg', svgSprites);
watch('./src/resources/**', resources);
watch('./src/fonts/**.ttf', fonts);
watch('./src/fonts/**.ttf', fontsStyle);
watch('src/js/**/*.js', scripts);


exports.styles = styles;
exports.watchFiles = watchFiles;
exports.fileinclude = htmlInclude;

exports.default = series(clean, parallel(htmlInclude, fonts, resources, imgToDist, svgSprites), fontsStyle, scripts, styles, watchFiles);

const stylesBuild = () => {
  return src('./src/scss/**/*.scss') // В папке стилей находим все scss файлы
    .pipe(sass({
      outputStyle: 'expanded'
    }
    ).on('error', notify.onError()))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(autoPrefixer({
      cascade: false,
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(dest('./dist/css/')) // Пушим в финальную папку
}
const scriptsBuild = () => {
  return src([
    'src/js/components/**/*.js',
    'src/js/main.js'
  ])
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('js/app.js'))
    .pipe(uglify({
      toplevel: true // За этой настройкой нужно следить т.к может что-нибудь сломать
    }).on('error', notify.onError()))
    .pipe(dest('dist'))
}

exports.build = series(clean, parallel(htmlInclude, fonts, resources, imgToDist, svgSprites), fontsStyle, scriptsBuild, stylesBuild, watchFiles);