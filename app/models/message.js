import Model, { attr } from '@ember-data/model';

export default class MessageModel extends Model {
  @attr userId;
  @attr username;
  @attr content;
}
