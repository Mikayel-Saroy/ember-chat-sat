import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';

export default class ApplicationRoute extends Route {
  @service userStatus;
  @service session;

  beforeModel() {
    if (this.session.isAuthenticated) {
      this.userStatus.initUserStatus();
    }
  }
}
