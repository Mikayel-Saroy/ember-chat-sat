import Component from '@glimmer/component';
import {tracked} from "@glimmer/tracking";
import {action} from '@ember/object';
import {inject as service} from '@ember/service';

export default class ChatSelfMessageSelfMessageComponent extends Component {
  @service firebaseApp;
  @service store;

  @tracked viewMode = true;
  @tracked editMessage;

  @action changeMode() {
    this.editMessage = this.args.message.content;
    this.viewMode = this.viewMode !== true;
  }

  @action
  async submitEditedMessage() {
    const firestore = await this.firebaseApp.firestore();
    firestore.collection('messages')
      .onSnapshot((snapshot) => {
        // snapshot.docs.map(item => console.log(item.data().userUid));
        // console.log(this.args.message.userUid);
        snapshot.docs.map(item => {
          if (item.data().createdAtUnix === this.args.message.createdAtUnix) {
            // const messageModel = this.store.findAll('message');
            // console.log(messageModel);
            this.store.findRecord("message", item.id).then((data) => {
              data.content = this.editMessage;
              this.viewMode = true;
              return data.save();
            })
          }
        });
      });
  }
}

//const {uid, email} = this.session.data.authenticated.user;
//     const messageModel = this.store.createRecord('message', {
//       userUid: uid,
//       email,
//       content: message,
//       createdAtUnix: Date.now(),
//       dateAndTime: this.getTimeAndDate(),
//     });
//     console.log(this.getTimeAndDate());
//
//     return messageModel.save();

// .onSnapshot((snapshot) => {
//   snapshot.docChanges().forEach((change) => {
//     if (change.type === "added") {
//       this.messages.pushObject(change.doc.data());
//       setTimeout(() => {
//         // console.log({container});
//         const container = document.querySelector(".messages-content");
//         container.scrollTo(0, container.scrollHeight);
//       });
//     }
//   });
// });
