import Application from 'ember-chat-sat/app';
import config from 'ember-chat-sat/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();
