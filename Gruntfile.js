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
        files: ['assets/js/*.js'],
      },
      watch: {
        options: {
          livereload: false,
        },
        html: {
          files: ['index.php'],
        },
        js: {
          files: ['assets/js/**/*.js'],
          tasks: ['jshint'],
        },
        less: {
          options: {
            // Monitor Less files for changes and compile them, but don't reload the browser.
            livereload: false,
          },
          files: ['assets/css/**/*.less'],
          tasks: ['less'],
        },
        css: {
          // LiveReload on the CSS files instead of their Less source files and you get
          // the style to refresh without reloading the page in the browser.
          files: ['assets/css/**/*.css'],
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