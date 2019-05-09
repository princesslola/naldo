module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      connect: {
        server: {
          options: {},
        }
      },
      less: {
        dist: {
          options: {
            style: 'compressed'
          },
          files: {
            'assets/css/main.css': 'assets/css/main.less',
          }
        }
      },
      jshint: {
        files: ['js/*.js'],
      },
      watch: {
        options: {
          livereload: true,
        },
        html: {
          files: ['index.html'],
        },
        js: {
          files: ['js/**/*.js'],
          tasks: ['jshint'],
        },
        less: {
          options: {
            // Monitor Less files for changes and compile them, but don't reload the browser.
            livereload: false,
          },
          files: ['css/**/*.less'],
          tasks: ['less'],
        },
        css: {
          // LiveReload on the CSS files instead of their Less source files and you get
          // the style to refresh without reloading the page in the browser.
          files: ['css/**/*.css'],
        },
      },
    });
  
    // Actually running things.
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-notify');
  
    // Default task(s).
    grunt.registerTask('default', ['connect', 'watch']);
  
  };