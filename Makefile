
bundle.js: main.js
	browserify -t [ babelify --presets [ react ] ] $< -o $@
