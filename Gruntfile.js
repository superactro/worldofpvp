module.exports = function(grunt) {
	grunt.initConfig({

// running `grunt less` will compile once
less: {
	development: {
		options: {
			paths: ['public/css'],
			yuicompress: true
		},
		files: {
			'public/css/style.css': 'public/less/*.less'
		}
	}
},

// running `grunt watch` will watch for changes
watch: {
	// to use install chrome liveReload 
	options: {
    livereload: true,
  },
  js: {
    files: ['lib/**/*.js'],
    tasks: []
  },
  css: {
    files: ['public/css/style.css'],
    tasks: []
  },
	files: 'public/less/*.less',
	tasks: ['less']
}
});
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
};