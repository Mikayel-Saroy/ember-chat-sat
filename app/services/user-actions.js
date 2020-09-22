import Service, {inject as service} from '@ember/service';

export default class UserActionsService extends Service {
  @service session;
  @service store;
  @service firebaseApp;

  async initUserData() {
    const firestore = await this.firebaseApp.firestore();
    const { uid, email } = this.session.data.authenticated.user;
    await firestore.collection('users').doc(uid).set({
      uid,
      email,
      lastLogin: Date.now(),
      isActive: true,
    }, { merge: true });

    return this.store.findRecord('user', uid);
  }

  async sendMessage(message) {
    const { uid, email } = this.session.data.authenticated.user;
    const messageModel = this.store.createRecord('message', {
      userUid: uid,
      email,
      content: message,
      createdAtUnix: Date.now()
    });

    return messageModel.save();
  }

}
