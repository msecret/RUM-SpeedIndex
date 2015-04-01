var expect = require('expect');

var SpeedIndex = require('../src/rum-speedindex');

describe('SpeedIndex', function() {
  describe('()', function() {
    it('should be defined', function() {
      expect(SpeedIndex).toExist('It exists')
    });
  });
});
