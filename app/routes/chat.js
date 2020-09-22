import Route from '@ember/routing/route';
import RealtimeRouteMixin from 'emberfire/mixins/realtime-route';
import { hash } from 'rsvp';

export default Route.extend(RealtimeRouteMixin, {
  model() {
    return this.store.query('user', { orderBy: { lastLogin: 'desc' } });
  }
});
