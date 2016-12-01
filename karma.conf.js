// Karma configuration
module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    basePath: '',
    files: [ //ordering of files matters apparently. spent like an hour wondering why everything was broken
      'node_modules/angular/angular.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'node_modules/angular-ui-bootstrap/dist/*',
      'app/controllers/Checkers.js',
      'app/controllers/*',
      'app/services/*',
      'node_modules/angular-route/angular-route.min.js',
      'node_modules/jquery/dist/jquery.min.js',
      'tests/*',
    ],
    frameworks: ['mocha', 'chai-spies', 'chai', 'sinon'],

    preprocessors : {
      'app/controllers/*.js': 'coverage',
      'app/services/*.js': 'coverage'
    },

    reporters: ['progress', 'coverage'],

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },

    singleRun: true,
    phantomjsLauncher: {
      // Have phantomjs exit if a ResourceError is encountered (useful if karma exits without killing phantom)
      exitOnResourceError: true
    }
  });
};
