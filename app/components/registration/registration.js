import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

const DEFAULT_COLOR = "black";
const LABEL_LOGIN_DEFAULT_MESSAGE = "Email";
const LABEL_REGISTRATION_DEFAULT_MESSAGE = "Password";

export default class RegistrationRegistrationComponent extends Component {
  @service session;
  @service firebaseApp;
  @service router;
  @service userActions;
  @service userStatus;

  @tracked validation = {
    @tracked email: '@gmail.com',
    @tracked password: '333333',
    @tracked isErrorColor: DEFAULT_COLOR,
    @tracked labelMessageLogin: LABEL_LOGIN_DEFAULT_MESSAGE,
    @tracked labelMessageRegistration: LABEL_REGISTRATION_DEFAULT_MESSAGE,
  }

  @action
  async onSubmit() {
    const auth = await this.firebaseApp.auth();
    try {
      await auth.createUserWithEmailAndPassword(this.validation.email, this.validation.password);
      await this.userActions.initUserData(false);
      await this.userStatus.initUserStatus();
      this.validation = this.userActions.validationFunction(true, this.validation, true);
      this.router.transitionTo('chat');
    } catch (error) {
      console.log(error);
      this.validation = this.userActions.validationFunction(false, this.validation, true);
    }
  }
}

















