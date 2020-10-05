import Component from '@glimmer/component';
import {tracked} from "@glimmer/tracking";
import {action} from '@ember/object';
import {inject as service} from '@ember/service';

export default class ChatSelfMessageSelfMessageComponent extends Component {
  @service firebaseApp;
  @service store;
  @service session;
  @service userActions;

  @tracked viewMode = true;
  @tracked editMessage;
  @tracked isLikeButtonPressed = false;

  @action replyToMessage() {
    this.store.findRecord('message', this.args.message.id).then((message) => {
      this.userActions.isReply = true;
      this.userActions.replyMessage = message.content;
      document.getElementById('message_box_input').focus();
    });
  }

  @action
  async changeMode() {
    this.editMessage = this.args.message.content;
    this.viewMode = !this.viewMode;
  }

  @action
  submitEditedMessage() {
    this.args.message.content = this.editMessage;
    this.store.findRecord('message', this.args.message.id).then((message) => {
      message.content = this.editMessage;
      message.more = "Edited"
      message.save();
    }).then(() => {
      this.viewMode = true;
    });
  }
}
