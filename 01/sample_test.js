'use strict';
/*globals describe, it*/

if (typeof module !== 'undefined' && module.exports) {
    var chai = require('chai'),
        solution = require('./solution');

    chai.should();
}

Array.prototype.count = function (elem) {
    return this.filter(function (e) {
        return e === elem;
    }).length;
};

Array.prototype.is_set = function () {
    var self = this;
    return this.every(function (elem) {
        return self.count(elem) === 1;
    });
};

describe('function n-time composition', function () {
    it ('works with the assignment example', function () {
        var add_two = function (num) { return num + 2; };
        var add_six = add_two.times(3);
        add_six(2).should.equal(8);
    });
});

describe('array conversion to set', function () {
    it('works with the assignment example', function () {
        var l1 = [1, 2, 3, 4, 5, 5, 5, 4, 6, 4];
        var result = l1.unique();

        result.is_set().should.equal(true);
    });
});

describe('array intersect', function () {
    it('works with the assignment example', function () {
        var some_numbers = [1, 2, 3, 4, 5];
        var some_other_numbers = [5, 4, 7, 10, 12, 2, 1];
        var result = some_other_numbers.intersect(some_numbers);

        result.forEach(function(elem) {
            result.count(elem).should.equal(1);
        });
    });
});
