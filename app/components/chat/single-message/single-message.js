import Component from '@glimmer/component';
// import {inject as service} from '@ember/service';
import {action} from '@ember/object';
import {tracked} from '@glimmer/tracking';

export default class ChatSingleMessageSingleMessageComponent extends Component {
  @tracked isMouseOver = true;

  @action addLike() {

  }
}
