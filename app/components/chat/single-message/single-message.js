import Component from '@glimmer/component';
import {inject as service} from '@ember/service';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';


export default class ChatSingleMessageSingleMessageComponent extends Component {
  @service session;
  @service store;
  @service userActions;

  @tracked messageColor;
  @tracked messageMark = "";
  @tracked isLikeButtonPressed = false;
  @tracked likesCount;
  @tracked showUsersLiked = false;

  @action showUsersWhoLikedTheMessage(mouseOver) {
    if (this.args.message.likedBy.length !== 0) {
      setTimeout(() => this.showUsersLiked = !!mouseOver, 500);
    }
  }

  @action checkIfMessageIsLiked() {
    const myEmail = this.session.data.authenticated.user.email;
    this.store.findRecord('message', this.args.message.id).then((message) => {
      this.isLikeButtonPressed = message.likedBy.includes(myEmail);
      this.likesCount = message.likedBy.length;
    })
  }

  @action checkIfNewMessage() {
    this.checkIfMessageIsLiked();
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

  @action replyToMessage() {
    this.store.findRecord('message', this.args.message.id).then((message) => {
      console.log(message.content);
      this.userActions.isReply = true;
      this.userActions.replyMessage = message.content;
      document.getElementById('message_box_input').focus();
    });
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
