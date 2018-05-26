import $ from 'jquery';
import * as Observable from 'rxjs';

function options(selector) {
  const profile = $(selector);
  const arrow = $(`${selector} .person__options-arrow`);
  const deleteButton = $(`${selector} .person__delete`);

  const showOptions$ = Observable.fromEvent(arrow, 'mouseenter');
  const navigateOptions$ = Observable.fromEvent(deleteButton, 'mouseenter');
  const hideOptionsWhenLeaveDelete$ = Observable.fromEvent(deleteButton, 'mouseleave');
  const hideOptionsWhenLeaveArrow$ = Observable.fromEvent(arrow, 'mouseleave');

  const showOptions = () => profile.css('margin-left', '-28.912466843%');
  const hideOptions = () => profile.css('margin-left', '0');

  showOptions$.subscribe(() => showOptions());
  navigateOptions$.subscribe(() => showOptions());
  hideOptionsWhenLeaveDelete$.subscribe(() => hideOptions());
  hideOptionsWhenLeaveArrow$.subscribe(() => hideOptions());
}

options('.suggestion-1');
options('.suggestion-2');
options('.suggestion-3');
