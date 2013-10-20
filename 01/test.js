'use strict';
/*globals describe, it*/

if (typeof module !== 'undefined' && module.exports) {
    var chai = require('chai');
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
    var add_two = function (num) { return num + 2; };
    it ('works with the assignment example', function () {
        var add_six = add_two.times(3);
        add_six(2).should.equal(8);
    });

    it('works for one', function () {
        var add_two_once = add_two.times(1);
        add_two_once(1).should.equal(3);
        add_two_once(5).should.equal(7);
    });

    it('works with less than one', function () {
        var zero_times = add_two.times(0);
        zero_times(4).should.equal(6);
        zero_times('∫').should.equal('∫2');
    });
});

describe('array conversion to set', function () {
    it('works with the assignment example', function () {
        var list = [1, 2, 3, 4, 5, 5, 5, 4, 6, 4];
        var result = list.unique();

        result.is_set().should.equal(true);
    });

    it('tests with ==, not ===', function () {
        var list = [1, 2, 3, '1', '1', 1.0, '3', '3', '2'];
        list.unique().should.deep.equal([1, 2, 3]);
    });

    it('works with strings', function () {
        var list = ['larodi', 'baba', 'larodi', 'baba', 'spam', 'larodi', 'baba', 'spam', 'spam'];

        list.unique().should.deep.equal(['larodi', 'baba', 'spam']);
    });
});

describe('array intersect', function () {
    it('works with the assignment example', function () {
        var some_numbers = [1, 2, 3, 4, 5];
        var some_other_numbers = [5, 4, 7, 10, 12, 2, 1];
        var result = some_other_numbers.intersect(some_numbers);

        result.sort().should.eql([1, 2, 4, 5]);
    });

    it('is symmetric', function () {
        var l1 = [1, 2, 3, 4],
            l2 = [3, 5, 4, 2, 9, 10];
        l1.intersect(l2).sort()
            .should.eql(l2.intersect(l1).sort());
    });

    describe('with no common objects', function () {
        it('returns an empty array', function () {
            [].intersect([1, 2, 3]).should.eql([]);
            [1, 2, 3].intersect([]).should.eql([]);
        });
    });

    it('works with non-numbers', function () {
        var l1 = [1, 2, 3, 5, 2.0, 'spam', 2.0, 3.0],
            l2 = [3, 5, 2.0, 'baba', 'spam'];

        l1.intersect(l2).sort().should.eql([2, 3, 5, 'spam']);
    });
});
