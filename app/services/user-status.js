import Service, {inject as service} from '@ember/service';
import firebase from 'firebase/app';
import { tracked } from '@glimmer/tracking';



export default class UserStatusService extends Service {
  @service firebaseApp;
  @service session;

  @tracked userStatuses = {};

  async initUserStatus() {

    const auth = await this.firebaseApp.auth();
    const database = await this.firebaseApp.database();

    const uid = auth.currentUser.uid;
    const userStatusDatabaseRef = database.ref('/status/' + uid);
    const isOfflineForDatabase = {
      state: 'offline',
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    const isOnlineForDatabase = {
      state: 'online',
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };


    database.ref('.info/connected').on('value', function (snapshot) {

      // If we're not currently connected, don't do anything.
      if (snapshot.val() === false) {
        return;
      }
      // If we are currently connected, then use the 'onDisconnect()'
      // method to add a set which will only trigger once this
      // client has disconnected by closing the app,
      // losing internet, or any other means.
      userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function () {
        // The promise returned from .onDisconnect().set() will
        // resolve as soon as the server acknowledges the onDisconnect()
        // request, NOT once we've actually disconnected:
        // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

        // We can now safely set ourselves as 'online' knowing that the
        // server will mark us as offline once we lose connection.
        userStatusDatabaseRef.set(isOnlineForDatabase);
      });
    }, this);
  }

  async onLogout() {
    const isOfflineForDatabase = {
      state: 'offline',
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    const auth = await this.firebaseApp.auth();
    const database = await this.firebaseApp.database();

    const uid = auth.currentUser.uid;
    const userStatusDatabaseRef = database.ref('/status/' + uid);
    console.log('on logout');
    userStatusDatabaseRef.set(isOfflineForDatabase);
  }

  async subscribeToUsersStatuses() {
    console.log('subscribe');
    const auth = await this.firebaseApp.auth();
    const database = await this.firebaseApp.database();

    const uid = auth.currentUser.uid;
    const userStatusesDatabaseRef = database.ref('/status/');

    userStatusesDatabaseRef.on('value', (snapshot) => {
      this.userStatuses = snapshot.val();
    });
  }
}
