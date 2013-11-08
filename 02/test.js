'use strict';
/*global describe, it, require*/

if (typeof module !== 'undefined' && module.exports) {
    var chai = require('chai'),
        should = chai.should();
}

describe('Object.snoop', function () {
    describe('given a literal object', function () {
        describe('and an existing property', function () {
            var obj = {name: 'Pencho'};
            it('snoops it', function () {
                Object.snoop(obj, 'name', function () { return true; });

                obj.name.should.eq('Pencho');
                obj.name = 'Stamat';
                obj.name.should.eq('Stamat');
            });
        });

        describe('and a new property', function () {
            var obj = {name: 'Pencho'};
            it('snoops it', function () {
                should.not.exist(obj.last_name);
                Object.snoop(obj, 'last_name', function () { return true;});

                obj.last_name = 'Stanchev';
                obj.last_name.should.eq('Stanchev');
            });
        });

        it('calls the callback for each assignment', function () {
                var obj = {name: 'Pencho'};
                var counter = 0;

                Object.snoop(obj, 'name', function () { counter++; return true; });
                obj.name = 'Stamat';
                counter.should.eq(1);
                obj.name = 'Stamat';
                counter.should.eq(2);
        });

        it('does not call the callback before assignment', function () {
                var obj = {name: 'Pencho'};
                var counter = 0;

                Object.snoop(obj, 'name', function () { counter++; return true; });
                counter.should.eq(0);
                obj.name = 'Stamat';
        });
    });

    describe('given a non-literal object', function () {
        var Person = function (name, age) {
            this.name = name;
            this.age = age;
        };

        Object.defineProperty(Person.prototype, 'full_info', {
            get: function () { return this.name + ' ' + this.age; },
            set: function () { console.log('NO!'); },
            configurable: true,
        });

        Person.prototype.get_names = function () { return this.name.split(' '); };

        var pencho = new Person('Pencho Stanchev', 23);

        describe('and an accessor descriptor', function () {
            it('snoops it', function () {
                Object.snoop(pencho, 'full_info', function(){return true;});
                pencho.full_info.should.eq('Pencho Stanchev 23');
            });
        });

        describe('and a method defined in the prototype', function () {
            it('snoops it', function () {
                pencho.get_names().should.eql(['Pencho', 'Stanchev']);
                Object.snoop(pencho, 'get_names', function (new_getter) {
                    return typeof new_getter === 'function';
                });
                (typeof pencho.get_names).should.eq('function');
                pencho.get_names().should.eql(['Pencho', 'Stanchev']);
            });
        });
    });

    describe('when the callback returns false', function () {
        var Person = function (name, age) {
            this.name = name;
            this.age = age;
        };

        var pencho = new Person('Pencho', 23);

        it('does not set the property', function () {
            Object.snoop(pencho, 'age', function (value) { return value > 20; });
            pencho.age = 19;
            pencho.age.should.eq(23);
            pencho.age = 42;
            pencho.age.should.eq(42);
        });
    });

    describe('when reapplied', function () {
        var Person = function (name, age) {
            this.name = name;
            this.age = age;
        };

        it('layers the properties', function () {
            var counter1 = 0;
            var counter2 = 0;
            var counter3 = 0;
            var pencho = new Person('Pencho', 23);
            
            Object.snoop(pencho, 'age', function () { counter1++; return true; });
            Object.snoop(pencho, 'age', function () { counter2++; return true; });
            Object.snoop(pencho, 'age', function () { counter3++; return true; });

            pencho.age += 1;
            [counter1, counter2, counter3].should.deep.eql([1, 1, 1]);
        });
    });

    it('uses the new value as the callback\'s first argument', function () {
        var obj = {},
            last_val;
        Object.snoop(obj, 'property', function (value) { last_val = value; });
        obj.property = 'King Jeremy';
        last_val.should.eq('King Jeremy');
        obj.property = 'the wicked';
    });

    it('does not alter the object\'s prototype', function () {
        var obj = {};
    });
});
