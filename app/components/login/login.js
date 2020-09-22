import Component from '@glimmer/component';
import { action } from '@ember/object';
import firebase from 'firebase/app';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class LoginLoginComponent extends Component {
  @service session;
  @service firebaseApp;
  @service router;
  @service store;
  @service userActions;

  @tracked email = '1@mail.ru'
  @tracked password = 'qwerty';


  constructor() {
    super(...arguments);
  }

  @action
  async onSubmit() {
    const auth = await this.firebaseApp.auth();

    try {
      await auth.signInWithEmailAndPassword(this.email, this.password);
      await this.userActions.initUserData();

      this.router.transitionTo('chat');
      this.email = "";
      this.password = "";
    } catch (error) {
      console.log(error);
    }
  }
}
