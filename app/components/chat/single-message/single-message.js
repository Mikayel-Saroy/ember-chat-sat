import Component from '@glimmer/component';
// import {inject as service} from '@ember/service';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';

export default class ChatSingleMessageSingleMessageComponent extends Component {
  @tracked messageColor;
  @tracked messageMark = "";

  @action checkIfNewMessage() {
    console.log(this.args.message.isNewMessage);
    if (this.args.message.isNewMessage) {
      this.messageColor = this.args.newColor;
      this.messageMark = this.args.newMessageMark;
      setTimeout(() => {
        this.messageColor = this.args.defaultColor;
        this.messageMark = "";
      }, 7000);
    } else {
      this.messageColor = this.args.defaultColor;
    }
  }

  @action addLike() {

  }
}
