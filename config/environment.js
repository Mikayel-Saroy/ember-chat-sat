'use strict';

module.exports = function(environment) {
  let ENV = {
    firebase: {
      apiKey: "AIzaSyDlmp3hb-798gLMSIZo2MQsO_JbeCjs0TA",
      authDomain: "ember-chat-sat.firebaseapp.com",
      databaseURL: "https://ember-chat-sat.firebaseio.com",
      projectId: "ember-chat-sat",
      storageBucket: "ember-chat-sat.appspot.com",
      messagingSenderId: "775207512644",
      appId: "1:775207512644:web:d4a931269d06d3f58b6a11",
      measurementId: "G-XKRWPE4Y9T",
    },
    modulePrefix: 'ember-chat-sat',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
