import Component from '@glimmer/component';
import {action} from '@ember/object';
import {inject as service} from '@ember/service';
import {tracked} from '@glimmer/tracking';

const DEFAULT_COLOR = 'white';
const NEW_COLOR = 'rgb(194, 255, 255)';
const NEW_MESSAGE_MARK = "New Message";

class Message {
  @tracked userUid;
  @tracked email;
  @tracked content;
  @tracked createdAtUnix;
  @tracked dateAndTime;
  @tracked more;

  constructor(params) {
    Object.assign(this, params);
    return this;
  }
}

export default class ChatChatMessagesComponent extends Component {
  @service firebaseApp;
  @service session;
  @service userActions;
  @service userStatus;

  @tracked messages = [];
  @tracked defaultColor = DEFAULT_COLOR;
  @tracked newColor = NEW_COLOR;
  @tracked newMessageMark = NEW_MESSAGE_MARK;
  @tracked newMessagesCount = 0;
  @tracked isMouseOver = false;

  get orderedMessages() {
    return this.messages;
  }

  get currentUserUid() {
    return this.session.data.authenticated.user.uid;
  }

  @action
  mouseOverFunction() {
    this.isMouseOver = true;
  }

  @action
  async loadMessages() {
    let myLastLoginTime = this.userActions.myLastLoginTime
    const firestore = await this.firebaseApp.firestore();
    firestore.collection('messages')
      .orderBy('createdAtUnix')
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let isNew;
          let currentMessageUnix = change.doc.data().createdAtUnix;

          isNew = currentMessageUnix > myLastLoginTime;
          this.newMessagesCount += isNew;
          if (change.type === "added") {
            const message = new Message({
              id: change.doc.id,
              isNewMessage: isNew,
              ...change.doc.data()
            });
            this.messages.pushObject(message);
            setTimeout(() => {
              const container = document.querySelector(".messages-content");
              container.scrollTo(0, container.scrollHeight);
            });
          }
          if (change.type === 'modified') {
            const message = this.messages.find(message => message.id === change.doc.id);
            if (message) {
              message.content = change.doc.data().content;
              message.more = change.doc.data().more;
            }
          }
        });
        this.userStatus.newNotifications = this.newMessagesCount;
        this.newMessagesCount = 0;

        setTimeout(() => {
          this.newColor = DEFAULT_COLOR;
          this.newMessageMark = '';
        }, 5000);
      });
  }
}
