module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      browserify: {
        files: ['js/*.js', 'templates/*.hbs'],
        tasks: ['browserify'],
      }
    },
    browserify: {
      dist: {
        files: {
          'scream.js': ['js/main.js'],
        },
        options: {
          transform: ['browserify-handlebars'],
          browserifyOptions: {
            debug: true
          }
        }
      }
    }
  });

  grunt.registerTask('default', ['browserify']);
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
};
