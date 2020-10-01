import Model, { attr } from '@ember-data/model';
import {inject as service} from '@ember/service';
import { get } from '@ember/object';

export default class UserModel extends Model {
  @service userStatus;

  @attr uid;
  @attr lastLogin;
  @attr email;
  @attr lastLoginTime;

  get isActive() {
    const userStatus = this.userStatus.userStatuses[this.uid];
    const status = userStatus && get(userStatus, 'state');
    return status === 'online';
  }
}
