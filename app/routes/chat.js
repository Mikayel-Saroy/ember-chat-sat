import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';

export default class ChatRoute extends Route {

  @service session;

  beforeModel(transition) {
    if (!this.session.isAuthenticated) {
      this.transitionTo("login");
    }
  }

  model() {
    return this.store.query('user', { orderBy: { lastLogin: 'desc' } });
  };
};
