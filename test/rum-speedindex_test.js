import test from 'tape';
import sinon from 'sinon';

import * as rSI from '../src/rum-speedindex';

let testEl = {};

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
  rSI.__set__('GetElementViewportRect', el => {
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
  rSI.__set__('GetElementViewportRect', el => {
    return expectedRect;
  });

  let actual = rSI.CheckElement(testEl, expectedUrl);

  t.equal(actual.url, expectedUrl);
  t.equal(actual.rect, expectedRect);
  t.equal(actual.area, expectedRect.area);

  rSI.__set__('GetElementViewportRect', sourceGetElementViewportRect);

  t.end();
});
