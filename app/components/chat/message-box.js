import Component from '@glimmer/component';
import {tracked} from "@glimmer/tracking";
import {action} from '@ember/object';
import {inject as service} from '@ember/service';

export default class ChatMessageBoxComponent extends Component {
  @tracked message = '';
  @service userActions;
  @service userStatus;

  @action closeTheReply() {
    this.userActions.isReply = false;
    this.userActions.replyMessage = '';
  }

  @action
  resetNotificationCount() {
    this.userStatus.newNotifications = 0;
  }

  @action
  sendMessage(event) {
    event.preventDefault();
    if (this.message.trim()) {
      this.userActions.sendMessage(this.message);
      this.message = '';
    }
  }
}
