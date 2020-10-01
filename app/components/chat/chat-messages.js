import Component from '@glimmer/component';
import {action} from '@ember/object';
import {inject as service} from '@ember/service';
import {tracked} from '@glimmer/tracking';

const DEFAULT_COLOR = "white";
const NEW_COLOR = "darkred";

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

  @tracked messages = [];
  @tracked defaultColor = DEFAULT_COLOR;
  @tracked newColor = NEW_COLOR;

  get orderedMessages() {
    return this.messages;
  }

  get currentUserUid() {
    return this.session.data.authenticated.user.uid;
  }


  // @action
  // getTime() {
  //   return 12;
  // }

  @action
  async loadMessages() {
    let myLastLoginTime = this.userActions.myLastLoginTime
    console.log(myLastLoginTime, "MY_LAST_LOGIN_TIME");
    const firestore = await this.firebaseApp.firestore();
    firestore.collection('messages')
      .orderBy('createdAtUnix')
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let isNew;
          let currentMessageUnix = change.doc.data().createdAtUnix;
          console.log(currentMessageUnix, "CURRENT");

          if (currentMessageUnix > myLastLoginTime) {
            console.log("NEW_SHIT");
            isNew = true;
          } else {
            isNew = false;
          }


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
              console.log(change.doc.data())
              message.content = change.doc.data().content;
              message.more = change.doc.data().more;
              console.log('modified message', message);
            }
          }
        });
        setTimeout(() => {
          this.newColor = DEFAULT_COLOR;
        }, 3000);
      });
  }
}
