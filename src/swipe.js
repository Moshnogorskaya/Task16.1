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
const close2ClickStream = Observable.fromEvent(closeButton2, 'click');
const close3ClickStream = Observable.fromEvent(closeButton3, 'click');

const requestStream = refreshClickStream.startWith('startup click')
  .map(() => {
    const randomOffset = Math.floor(Math.random() * 500);
    return `https://api.github.com/users?since=${randomOffset}`;
  });

const responseStream = requestStream
  .mergeMap(requestURL => Observable.from($.getJSON(requestURL)));

function createSuggestionStream(closeClickStream) {
  return closeClickStream.startWith('startup click')
    .combineLatest(responseStream, ((click, listUsers) =>
      listUsers[Math.floor(Math.random() * listUsers.length)]));
}

function createSuggestionStreamDetails(suggestionStream) {
  return suggestionStream.mergeMap(suggestedUser => Observable.from($.getJSON(`https://api.github.com/users/${suggestedUser.login}`)));
}

const suggestion1Stream = createSuggestionStream(close1ClickStream);
const suggestion2Stream = createSuggestionStream(close2ClickStream);
const suggestion3Stream = createSuggestionStream(close3ClickStream);

function renderSuggestion(suggestedUser, selector) {
  const person = $(selector);
  if (suggestedUser === null) {
    person.css('visibility', 'hidden');
  } else {
    person.css('visibility', 'visible');
    const name = $(`${selector} .person__name`);
    const avatar = $(`${selector} .avatar__image`);
    const location = $(`${selector} .location__text`);
    const link = $(`${selector} .person__link`);
    name.html(suggestedUser.name);
    location.html(suggestedUser.location);
    link.html(`@${suggestedUser.login}`);
    link.attr('href', suggestedUser.html_url);
    avatar.css({
      background: `url(${suggestedUser.avatar_url}) no-repeat`,
      'background-size': 'contain',
    });
  }
// avatar.css('background', 'url(suggestedUser.avatar_url)');
// address.textContent =
}
createSuggestionStreamDetails(suggestion1Stream).subscribe(suggestedUser => renderSuggestion(suggestedUser, '.suggestion-1'));
createSuggestionStreamDetails(suggestion2Stream).subscribe(suggestedUser => renderSuggestion(suggestedUser, '.suggestion-2'));
createSuggestionStreamDetails(suggestion3Stream).subscribe(suggestedUser => renderSuggestion(suggestedUser, '.suggestion-3'));

console.log(suggestion1Stream);
