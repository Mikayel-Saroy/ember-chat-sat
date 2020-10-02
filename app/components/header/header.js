import Component from '@glimmer/component';
import {action} from '@ember/object';
import {inject as service} from '@ember/service';
import {tracked} from "@glimmer/tracking";


export default class HeaderHeaderComponent extends Component {
  @service session;
  @service router;
  @service firebaseApp;
  @service userStatus;
  @service userActions;

  @tracked currentTime;

  @action currentTimeFunction() {
    setInterval(() => {
      let timeWithMinutes = this.userActions.getTimeAndDate();
      let seconds = new Date().getSeconds();
      if (seconds < 10) seconds = "0" + seconds;
      this.currentTime = timeWithMinutes.concat(`:${seconds}`);
    }, 1000);
  }

  @action logout() {
    this.logoutStep().then(() => {
      this.router.transitionTo("login");
    });
  }

  @action
  async logoutStep() {
    let now = this.userActions.getTimeAndDate();
    const uid = this.session.data.authenticated.user.uid;
    const firestore = await this.firebaseApp.firestore();
    await this.userStatus.onLogout();
    await this.session.invalidate();
    await firestore.collection('users').doc(uid).set({
      lastLogin: Date.now(),
      lastLoginTime: this.userActions.getTimeAndDate(),
    }, {merge: true});

  }
}
