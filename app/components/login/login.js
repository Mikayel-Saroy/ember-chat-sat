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

  @tracked email = '1@mail.ru'
  @tracked password = 'qwerty';


  constructor() {
    super(...arguments);
  }

  async createUser() {
    const uid = this.session.data.authenticated.user.uid;

    const user = this.store.createRecord('user', {
      userId: uid,
      lastLogin: Date.now(),
      isActive: true
    });

    await user.save();
  }

  async updateUser() {
    const uid = this.session.data.authenticated.user.uid;

    const users = await this.store.query('user', {
      where: ['userId', '==', uid],
      limit: 1,
    });
    const currentUser = users.get('firstObject');

    currentUser.set('lastLogin', Date.now());
    await currentUser.save();
  }

  @action
  async onSubmit() {
    const auth = await this.firebaseApp.auth();
    try {
      await auth.signInWithEmailAndPassword(this.email, this.password);

      try {
        await this.updateUser();
      } catch (e) {
        await this.createUser();
      }

      this.router.transitionTo('chat');
      this.email = "";
      this.password = "";
    } catch (error) {
      console.log(error);
    }
  }
}
