import Model, { attr } from '@ember-data/model';

export default class UserModel extends Model {
  @attr userId;
  @attr lastLogin;
  @attr isActive;
}
