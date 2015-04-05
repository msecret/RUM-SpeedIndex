import test from 'tape';
import sinon from 'sinon';

import * as rSI from '../src/rum-speedindex';

let testEl = {};
let fakeWindow = {
  innerHeight: 600,
  innerWidth: 800,
  document: {}
}

test('it exists', t => {
  t.ok(rSI, 'Speed Index exists');
  t.end();
});

// CheckElement
test('checkElement exists', t => {
  t.ok(rSI.CheckElement, 'it exists');
  t.end();
});

test('checkElement returns null if no url passed', t => {
  let actual = rSI.CheckElement({});
  t.ok(!actual, 'returns null or undefined');
  t.end();
});

test('checkElement returns null if GetElementViewportRect returns false', t => {
  let sourceGetElementViewportRect = rSI.__get__('GetElementViewportRect');
  rSI.__set__('GetElementViewportRect', () => {
    return false;
  });

  let actual = rSI.CheckElement(testEl, 'http://url.com');
  t.ok(!actual, 'returns null or undefined');

  rSI.__set__('GetElementViewportRect', sourceGetElementViewportRect);

  t.end();
});

test('checkElement gives back object with url passed in and area/rect from '+
    'successful GetElementViewportRect call', t => {
  let expectedRect = {
    area: 100,
    w: 100,
    h: 200
  },
      expectedUrl = 'http://test.gov';

  let sourceGetElementViewportRect = rSI.__get__('GetElementViewportRect');
  rSI.__set__('GetElementViewportRect', () => {
    return expectedRect;
  });

  let actual = rSI.CheckElement(testEl, expectedUrl);

  t.equal(actual.url, expectedUrl);
  t.equal(actual.rect, expectedRect);
  t.equal(actual.area, expectedRect.area);

  rSI.__set__('GetElementViewportRect', sourceGetElementViewportRect);

  t.end();
});

test('getElementViewportRect returns false if can\'t get el bounding rect', t => {
  var testEl = {},
      actual;

  actual = rSI.GetElementViewportRect(testEl);

  t.ok(!actual, 'return false');

  t.end();
});

test('getElementViewportRect returns false if the top or right of element are ' +
    'not signifigant', t => {
  var testEl = {},
    actual;

  testEl.getBoundingClientRect = function() {
    return {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0
    }
  };

  rSI.setWindow(fakeWindow);
  actual = rSI.GetElementViewportRect(testEl);

  t.ok(!actual, 'returns false');
  t.end();
});

test('getElementViewportRect returns false if the top or right of element are ' +
'out of the screens dimensions', t => {
  var testEl = {},
    testWin = {},
    actual;

  testEl.getBoundingClientRect = function() {
    return {
      bottom: 50,
      left: 10,
      right: 30,
      top: 40
    }
  };
  testWin.document = {};
  testWin.innerHeight = 30;
  testWin.innerWidth = 400;
  rSI.setWindow(testWin);

  actual = rSI.GetElementViewportRect(testEl);

  t.ok(!actual, 'returns false');
  t.end();
});

test('getElementViewportRect returns an object with top, bottom, right, ' +
    'left properties for the intersection with the window', t => {
  var testEl = {},
      actual;

  testEl.getBoundingClientRect = function() {
    return {
      bottom: 80,
      left: 10,
      right: 100,
      top: 10
    }
  };
  rSI.setWindow(fakeWindow);

  actual = rSI.GetElementViewportRect(testEl);

  t.equal(actual.top, 10, 'top equals what getBoundingClientRect returns');
  t.equal(actual.left, 10, 'left equals what getBoundingClientRect returns');
  t.equal(actual.bottom, 80, 'bottom equals what getBoundingClientRect returns');
  t.equal(actual.right, 100, 'right equals what getBoundingClientRect returns');
  t.end();
});

test('getElementViewportRect returns object with area', t => {
  var testEl = {},
    actual;

  testEl.getBoundingClientRect = function() {
    return {
      bottom: 30,
      left: 10,
      right: 50,
      top: 10
    }
  };
  rSI.setWindow(fakeWindow);

  actual = rSI.GetElementViewportRect(testEl);

  t.equal(actual.area, 800, 'area equal to height times width');
  t.end();
})