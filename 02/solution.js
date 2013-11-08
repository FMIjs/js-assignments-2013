'use strict';

Object.snoop = function(obj, prop, predicate) {
    var old_descriptor,
        is_accessor,
        descriptor,
        exists;

    old_descriptor =
    Object.getOwnPropertyDescriptor(obj, prop) ||
    Object.getOwnPropertyDescriptor(obj.constructor.prototype, prop);

    exists = Boolean(old_descriptor);

    is_accessor = exists && (old_descriptor.get || old_descriptor.set);

    if (!exists) { old_descriptor = {}; }

    delete obj[prop];

    if (is_accessor) {
        descriptor = {
            get: old_descriptor.get,
            set: old_descriptor.set ? function (value) {
                if (predicate(value)) {
                    old_descriptor.set(value);
                }
            }: undefined,
            configurable: true,
        };
    } else {
        descriptor = {
            get: function () { return old_descriptor.value; },
            set: function (value) {
                if (predicate(value)) {
                    old_descriptor.value = value;
                }
            },
            configurable: true,

        };
    }

    Object.defineProperty(obj, prop, descriptor);
};
