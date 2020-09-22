import Component from '@glimmer/component';
import { action } from '@ember/object';
import firebase from 'firebase/app';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class HeaderHeaderComponent extends Component {
  @service session;
  @service router;

  @action async logout() {
    await this.session.invalidate();
    this.router.transitionTo("login");
  }

  // @action testFunction() {
  //   console.log(this.session);
  // }
}
