var test = require('tape');

var SpeedIndex = require('../src/rum-speedindex');

test('hello says hello', function(t){
  t.plan(1);
  t.equal(SpeedIndex, 'hello world', 'test it');
});
