import EmberRouter from '@ember/routing/router';
import config from 'ember-chat-sat/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('login');
  this.route('registration');
  this.route('chat');
  this.route('not-found', {path: '/*path'});
});
