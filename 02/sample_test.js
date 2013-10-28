'use strict';
/*global describe, it, require*/
var chai = require('chai');

chai.should();

describe('Object.snoop', function () {
    it('exists', function () {
        chai.expect(Object.snoop).to.exist;
    });

    it('checks a condition', function () {
        var pesho = {name: 'Pesho', age: 23};
        Object.snoop(pesho, 'age', function (value) { return value < 20; });

        pesho.age = 25;
        pesho.age.should.eq(23);
        pesho.age = 19;
        pesho.age.should.eq(19);
    });
});
