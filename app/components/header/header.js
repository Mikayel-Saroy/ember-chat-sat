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
    this.userStatus.initUserStatus("logout");
    this.logoutStep().then(() => {
      this.router.transitionTo("login");
    });
  }

  @action
  async logoutStep() {
    const uid = this.session.data.authenticated.user.uid;
    const firestore = await this.firebaseApp.firestore();

    await firestore.collection('users').doc(uid).set({
      isActive: false,
    }, {merge: true});
    await this.session.invalidate();
  }
}
