import $ from 'jquery';
import * as Observable from 'rxjs';

function options(selector) {
    const profile = $(selector);
  const arrow = $(`${selector} .person__options-arrow`);
  const deleteButton = $(`${selector} .person__delete`);

  const showOptionsStream = Observable.fromEvent(arrow, 'mouseenter');

  showOptionsStream.subscribe(() => profile.css('margin-left', '-21.427983539%'));
}

options('.suggestion-1');
options('.suggestion-2');
options('.suggestion-3');
