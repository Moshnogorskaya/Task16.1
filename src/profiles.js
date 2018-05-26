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

const refreshClick$ = Observable.fromEvent(refreshButton, 'click');
const close1Click$ = Observable.fromEvent(closeButton1, 'click');
const close2Click$ = Observable.fromEvent(closeButton2, 'click');
const close3Click$ = Observable.fromEvent(closeButton3, 'click');

const request$ = refreshClick$.startWith('startup click').map(() => {
  const randomOffset = Math.floor(Math.random() * 500);
  return `https://api.github.com/users?since=${randomOffset}`;
});

const response$ = request$.mergeMap(requestURL =>
  Observable.from($.getJSON(requestURL)));

const createSuggestion$ = closeClick$ =>
  closeClick$
    .startWith('startup click')
    .combineLatest(
      response$,
      (click, listUsers) =>
        listUsers[Math.floor(Math.random() * listUsers.length)],
    );

const createSuggestionDetails$ = suggestion$ =>
  suggestion$.mergeMap(suggestedUser =>
    Observable.from($.getJSON(`https://api.github.com/users/${suggestedUser.login}`)));

const suggestion1$ = createSuggestion$(close1Click$);
const suggestion2$ = createSuggestion$(close2Click$);
const suggestion3$ = createSuggestion$(close3Click$);

const renderSuggestion = (suggestedUser, selector) => {
  const person = $(selector);
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
};

createSuggestionDetails$(suggestion1$).subscribe(suggestedUser =>
  renderSuggestion(suggestedUser, '.suggestion-1'));
createSuggestionDetails$(suggestion2$).subscribe(suggestedUser =>
  renderSuggestion(suggestedUser, '.suggestion-2'));
createSuggestionDetails$(suggestion3$).subscribe(suggestedUser =>
  renderSuggestion(suggestedUser, '.suggestion-3'));
