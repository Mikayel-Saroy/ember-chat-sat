import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class RegistrationRegistrationComponent extends Component {
  @service session;
  @service firebaseApp;
  @service router;
  @service userActions;

  @tracked email;
  @tracked password;


  @action
  async onSubmit() {
    const auth = await this.firebaseApp.auth();
    try {
      await auth.createUserWithEmailAndPassword(this.email, this.password);
      await this.userActions.initUserData();
      this.router.transitionTo('chat');
      this.email = "";
      this.password = "";
    } catch (error) {
      console.log(error);
    }
  }
}
