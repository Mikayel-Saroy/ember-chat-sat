import Component from '@glimmer/component';
import {tracked} from "@glimmer/tracking";
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ChatMessageBoxComponent extends Component {
  @tracked message = '';
  @service userActions;

  @action
  async sendMessage(event) {
    event.preventDefault();
    await this.userActions.sendMessage(this.message);
    this.message = '';
  }
}
