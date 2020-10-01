import Component from '@glimmer/component';
import {tracked} from "@glimmer/tracking";
import {action} from '@ember/object';
import {inject as service} from '@ember/service';

export default class ChatSelfMessageSelfMessageComponent extends Component {
  @service firebaseApp;
  @service store;
  @service session;

  @tracked viewMode = true;
  @tracked editMessage;

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
