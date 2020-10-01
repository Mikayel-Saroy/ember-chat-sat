import Model, { attr } from '@ember-data/model';

export default class MessageModel extends Model {
  @attr userUid;
  @attr email;
  @attr content;
  @attr createdAtUnix;
  @attr dateAndTime;
  @attr more;
}
