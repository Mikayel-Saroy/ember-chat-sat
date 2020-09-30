import Service, {inject as service} from '@ember/service';

const LABEL_LOGIN_ERROR_MESSAGE = "Email: Enter a Valid Data";
const LABEL_REGISTRATION_ERROR_MESSAGE = "Password: Enter a Valid Data";
const LABEL_LOGIN_DEFAULT_MESSAGE = "Email";
const LABEL_REGISTRATION_DEFAULT_MESSAGE = "Password";
const DEFAULT_COLOR = "black";
const ERROR_COLOR = "red";
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default class UserActionsService extends Service {
  @service session;
  @service store;
  @service firebaseApp;

  async initUserData() {
    const firestore = await this.firebaseApp.firestore();
    const {uid, email} = this.session.data.authenticated.user;
    await firestore.collection('users').doc(uid).set({
      uid,
      email,
      lastLogin: Date.now(),
      isActive: true,
    }, {merge: true});

    return this.store.findRecord('user', uid);
  }

  getTimeAndDate() {
    let date = new Date();
    return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getHours()}:${date.getMinutes()}`;
  }

  async sendMessage(message) {
    const {uid, email} = this.session.data.authenticated.user;
    const messageModel = this.store.createRecord('message', {
      userUid: uid,
      email,
      content: message,
      createdAtUnix: Date.now(),
      dateAndTime: this.getTimeAndDate(),
    });
    console.log(this.getTimeAndDate());

    return messageModel.save();
  }

  validationFunction(hasError, validation) {
    if (hasError) {
      validation.email = "";
      validation.password = "";
      validation.labelMessageLogin = LABEL_LOGIN_DEFAULT_MESSAGE;
      validation.labelMessageRegistration = LABEL_REGISTRATION_DEFAULT_MESSAGE;
      validation.isErrorColor = DEFAULT_COLOR;
    } else {
      validation.email = "";
      validation.password = "";
      validation.labelMessageLogin = LABEL_LOGIN_ERROR_MESSAGE;
      validation.labelMessageRegistration = LABEL_REGISTRATION_ERROR_MESSAGE;
      validation.isErrorColor = ERROR_COLOR;
    }
    return validation;
  }
}
