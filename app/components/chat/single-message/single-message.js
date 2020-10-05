import Component from '@glimmer/component';
import {inject as service} from '@ember/service';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';


export default class ChatSingleMessageSingleMessageComponent extends Component {
  @service session;
  @service store;

  @tracked messageColor;
  @tracked messageMark = "";
  @tracked isLikeButtonPressed = false;
  @tracked likesCount;

  @action checkIfMessageIsLiked() {
    const myEmail = this.session.data.authenticated.user.email;
    this.store.findRecord('message', this.args.message.id).then((message) => {
      this.isLikeButtonPressed = message.likedBy.includes(myEmail);
      this.likesCount = message.likedBy.length;
    })
  }

  @action checkIfNewMessage() {
    this.checkIfMessageIsLiked();
    // NEXT
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
    const myEmail = this.session.data.authenticated.user.email;
    this.store.findRecord('message', this.args.message.id).then((message) => {
      if (this.isLikeButtonPressed) {
        let newLikedBy = [];
        message.likedBy.map(users => {
          if (users !== myEmail) {
            newLikedBy.push(users);
          }
        })
        message.likedBy = newLikedBy;
      } else {
        message.likedBy = [myEmail, ...message.likedBy];
      }
      message.save();
    });
    this.checkIfMessageIsLiked();
  }
}
