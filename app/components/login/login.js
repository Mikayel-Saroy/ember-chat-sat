import Component from '@glimmer/component';
import {action} from '@ember/object';
import {inject as service} from '@ember/service';
import {tracked} from '@glimmer/tracking';

const LABEL_LOGIN_DEFAULT_MESSAGE = "Email";
const LABEL_REGISTRATION_DEFAULT_MESSAGE = "Password";
const DEFAULT_COLOR = "black";

export default class LoginLoginComponent extends Component {
  @service session;
  @service firebaseApp;
  @service router;
  @service store;
  @service userActions;
  @service userStatus;

  @tracked validation = {
    @tracked email: 'x@gmail.com',
    @tracked password: '333333',
    @tracked isErrorColor: DEFAULT_COLOR,
    @tracked labelMessageLogin: LABEL_LOGIN_DEFAULT_MESSAGE,
    @tracked labelMessageRegistration: LABEL_REGISTRATION_DEFAULT_MESSAGE,
  }

  constructor() {
    super(...arguments);
  }

  @action
  async onSubmit() {
    const auth = await this.firebaseApp.auth();
    try {
      await auth.signInWithEmailAndPassword(this.validation.email, this.validation.password);
      await this.userActions.initUserData();
      this.validation = this.userActions.validationFunction(true, this.validation);
      await this.userStatus.initUserStatus();
      this.router.transitionTo('chat');
    } catch (error) {
      console.log(error);
      this.validation = this.userActions.validationFunction(false, this.validation);
    }
  }
}
