import Component from '@glimmer/component';
import {action} from '@ember/object';
import {inject as service} from '@ember/service';
import {tracked} from '@glimmer/tracking';

export default class ChatChatMessagesComponent extends Component {
  @service firebaseApp;
  @service session;
  @tracked messages = [];

  get orderedMessages() {
    return this.messages;
  }

  get currentUserUid() {
    return this.session.data.authenticated.user.uid;
  }

  @action
  getTime() {
    return 12;
  }

  @action
  async loadMessages() {
    const firestore = await this.firebaseApp.firestore();
    firestore.collection('messages')
      .orderBy('createdAtUnix')
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            this.messages.pushObject(change.doc.data());
            setTimeout(() => {
              // console.log({container});
              const container = document.querySelector(".messages-content");
              container.scrollTo(0, container.scrollHeight);
            });
          }
        });
      });
  }
}
