import Service, {inject as service} from '@ember/service';
import {tracked} from "@glimmer/tracking";

const LABEL_LOGIN_ERROR_MESSAGE = "Email: Enter a Valid Data";
const LABEL_LOGIN_REGISTRATION_ERROR_MESSAGE = "Email: This email is already in use, Enter a Valid Data";
const LABEL_PASSWORD_ERROR_MESSAGE = "Password: Enter a Valid Data";
const LABEL_LOGIN_DEFAULT_MESSAGE = "Email";
const LABEL_PASSWORD_DEFAULT_MESSAGE = "Password";
const DEFAULT_COLOR = "black";
const ERROR_COLOR = "red";
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default class UserActionsService extends Service {
  @service firebaseApp;
  @service store;
  @service session;
  @tracked myLastLoginTime;
  @tracked isReply = false;
  @tracked replyMessage = '';

  async initUserData(isNotNew) {
    const {uid, email} = this.session.data.authenticated.user;
    const firestore = await this.firebaseApp.firestore();
    if (isNotNew) {
      this.myLastLoginTime = await firestore.collection("users").doc(uid).get();
      this.myLastLoginTime = this.myLastLoginTime.data().lastLogin;
    }
    await firestore.collection('users').doc(uid).set({
      uid,
      email,
      lastLogin: Date.now(),
      isActive: true,
      lastLoginTime: this.getTimeAndDate(),
    }, {merge: true});

    return this.store.findRecord('user', uid);
  }

  getTimeAndDate() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    if (minutes < 10) minutes = '0' + minutes;
    if (hours < 10) hours = '0' + hours;
    return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${hours}:${minutes}`;
  }

  sendMessage(message) {
    const {uid, email} = this.session.data.authenticated.user;
    const messageModel = this.store.createRecord('message', {
      userUid: uid,
      email,
      content: message,
      createdAtUnix: Date.now(),
      dateAndTime: this.getTimeAndDate(),
      more: "",
      likedBy: [],
      isReply: this.isReply,
      replyMessage: this.replyMessage,
    });
    this.isReply = false;
    this.replyMessage = '';
    return messageModel.save();
  }

  validationFunction(hasError, validation, isRegistration) {
    if (hasError) {
      validation.email = "";
      validation.password = "";
      validation.labelMessageLogin = LABEL_LOGIN_DEFAULT_MESSAGE;
      validation.labelMessageRegistration = LABEL_PASSWORD_DEFAULT_MESSAGE;
      validation.isErrorColor = DEFAULT_COLOR;
    } else {
      validation.email = "";
      validation.password = "";
      validation.isErrorColor = ERROR_COLOR;
      if (isRegistration) {
        validation.labelMessageLogin = LABEL_LOGIN_REGISTRATION_ERROR_MESSAGE;
        validation.labelMessageRegistration = LABEL_PASSWORD_ERROR_MESSAGE;
      } else {
        validation.labelMessageLogin = LABEL_LOGIN_ERROR_MESSAGE;;
        validation.labelMessageRegistration = LABEL_PASSWORD_ERROR_MESSAGE;
      }
    }
    return validation;
  }
}
