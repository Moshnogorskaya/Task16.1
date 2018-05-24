import $ from 'jquery';
import * as Observable from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/merge';

const refreshButton = $('.widget__refresh');
const closeButton1 = $('.delete-button-1');
const closeButton2 = $('.delete-button-2');
const closeButton3 = $('.delete-button-3');

const refreshClickStream = Observable.fromEvent(refreshButton, 'click');
const close1ClickStream = Observable.fromEvent(closeButton1, 'click');
const close2ClickStream = Observable.fromEvent(closeButton1, 'click');
const close3ClickStream = Observable.fromEvent(closeButton1, 'click');

const requestStream = refreshClickStream.startWith('startup click')
  .map(() => {
    const randomOffset = Math.floor(Math.random() * 500);
    return `https://api.github.com/users?since=${randomOffset}`;
  });

const responseStream = requestStream
  .mergeMap(requestURL => Observable.from($.getJSON(requestURL)));

const suggestion1Stream = closeClickStream.startWith('startup click')
  .combineLatest(responseStream, ((click, listUsers) =>
    listUsers[Math.floor(Math.random() * listUsers.length)]))
  .merge(refreshClickStream.map(() => null));

suggestion1Stream.subscribe((suggestion) => {
  if (suggestion === 0) {}
});

const suggestion2Stream = responseStream
  .map(listUsers => listUsers[Math.floor(Math.random() * listUsers.length)]);

const suggestion3Stream = responseStream
  .map(listUsers => listUsers[Math.floor(Math.random() * listUsers.length)]);

refreshClickStream.subscribe(() => {});

console.log(suggestion1Stream);
