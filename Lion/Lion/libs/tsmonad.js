var TsMonad;
(function (TsMonad) {
    'use strict';

    (function (EitherType) {
        EitherType[EitherType["Left"] = 0] = "Left";
        EitherType[EitherType["Right"] = 1] = "Right";
    })(TsMonad.EitherType || (TsMonad.EitherType = {}));
    var EitherType = TsMonad.EitherType;

    function exists(t) {
        return t !== null && t !== undefined;
    }

    function either(l, r) {
        if (exists(l) && exists(r)) {
            throw new TypeError('Cannot construct an Either with both a left and a right');
        }
        if (!exists(l) && !exists(r)) {
            throw new TypeError('Cannot construct an Either with neither a left nor a right');
        }
        if (exists(l) && !exists(r)) {
            return Either.left(l);
        }
        if (!exists(l) && exists(r)) {
            return Either.right(r);
        }
    }
    TsMonad.either = either;

    var Either = (function () {
        // Constructor for internal use only - use the data constructors below
        function Either(type, l, r) {
            this.type = type;
            this.l = l;
            this.r = r;
            this.of = this.unit;
            this.chain = this.bind;
            this.lift = this.fmap;
            this.map = this.fmap;
        }
        // <Data constructors>
        Either.left = function (l) {
            return new Either(0 /* Left */, l);
        };

        Either.right = function (r) {
            return new Either(1 /* Right */, null, r);
        };

        // </Data constructors>
        // <Monad>
        Either.prototype.unit = function (t) {
            return Either.right(t);
        };

        Either.prototype.bind = function (f) {
            return this.type === 1 /* Right */ ? f(this.r) : Either.left(this.l);
        };

        // </Monad>
        // <Functor>
        Either.prototype.fmap = function (f) {
            var _this = this;
            return this.bind(function (v) {
                return _this.unit(f(v));
            });
        };

        // </Functor>
        Either.prototype.caseOf = function (pattern) {
            return this.type === 1 /* Right */ ? pattern.right(this.r) : pattern.left(this.l);
        };

        Either.prototype.equals = function (other) {
            return other.type === this.type && ((this.type === 0 /* Left */ && other.l === this.l) || (this.type === 1 /* Right */ && other.r === this.r));
        };
        return Either;
    })();
    TsMonad.Either = Either;
})(TsMonad || (TsMonad = {}));
var TsMonad;
(function (TsMonad) {
    'use strict';

    

    

    
})(TsMonad || (TsMonad = {}));
/// <reference path="monad.ts" />
var TsMonad;
(function (TsMonad) {
    'use strict';

    (function (MaybeType) {
        MaybeType[MaybeType["Nothing"] = 0] = "Nothing";
        MaybeType[MaybeType["Just"] = 1] = "Just";
    })(TsMonad.MaybeType || (TsMonad.MaybeType = {}));
    var MaybeType = TsMonad.MaybeType;

    function maybe(t) {
        return Maybe.maybe(t);
    }
    TsMonad.maybe = maybe;

    var Maybe = (function () {
        function Maybe(type, value) {
            this.type = type;
            this.value = value;
            this.of = this.unit;
            this.chain = this.bind;
            this.lift = this.fmap;
            this.map = this.fmap;
        }
        // </Data constructors>
        Maybe.maybe = function (t) {
            return t === null || t === undefined ? new Maybe(0 /* Nothing */) : new Maybe(1 /* Just */, t);
        };

        Maybe.just = function (t) {
            if (t === null || t === undefined) {
                throw new TypeError('Cannot Maybe.just(null)');
            }
            return new Maybe(1 /* Just */, t);
        };

        Maybe.nothing = function () {
            return new Maybe(0 /* Nothing */);
        };

        // </Data constructors>
        // <Monad>
        Maybe.prototype.unit = function (u) {
            return Maybe.maybe(u);
        };

        Maybe.prototype.bind = function (f) {
            return this.type === 1 /* Just */ ? f(this.value) : Maybe.nothing();
        };

        // </Monad>
        // <Functor>
        Maybe.prototype.fmap = function (f) {
            var _this = this;
            return this.bind(function (v) {
                return _this.unit(f(v));
            });
        };

        // </Functor>
        Maybe.prototype.caseOf = function (patterns) {
            return this.type === 1 /* Just */ ? patterns.just(this.value) : patterns.nothing();
        };

        Maybe.prototype.equals = function (other) {
            return other.type === this.type && (this.type === 0 /* Nothing */ || other.value === this.value);
        };
        return Maybe;
    })();
    TsMonad.Maybe = Maybe;
})(TsMonad || (TsMonad = {}));
var TsMonad;
(function (TsMonad) {
    'use strict';

    function writer(story, value) {
        return Writer.writer(story, value);
    }
    TsMonad.writer = writer;

    var Writer = (function () {
        function Writer(story, value) {
            this.story = story;
            this.value = value;
            this.of = this.unit;
            this.chain = this.bind;
            this.lift = this.fmap;
            this.map = this.fmap;
        }
        // <Data constructors>
        Writer.writer = function (story, value) {
            return new Writer(story, value);
        };

        Writer.tell = function (s) {
            return new Writer([s], 0);
        };

        // </Data constructors>
        // <Monad>
        Writer.prototype.unit = function (u) {
            return new Writer([], u);
        };

        Writer.prototype.bind = function (f) {
            var wu = f(this.value), newStory = this.story.concat(wu.story);
            return new Writer(newStory, wu.value);
        };

        // </Monad>
        // <Functor>
        Writer.prototype.fmap = function (f) {
            var _this = this;
            return this.bind(function (v) {
                return _this.unit(f(v));
            });
        };

        // </Functor>
        Writer.prototype.caseOf = function (patterns) {
            return patterns.writer(this.story, this.value);
        };

        Writer.prototype.equals = function (other) {
            var i, sameStory = true;
            for (i = 0; i < this.story.length; i += 1) {
                sameStory = sameStory && this.story[i] === other.story[i];
            }
            return sameStory && this.value === other.value;
        };
        return Writer;
    })();
    TsMonad.Writer = Writer;
})(TsMonad || (TsMonad = {}));
/// <reference path="either.ts" />
/// <reference path="maybe.ts" />
/// <reference path="writer.ts" />

(function () {
    'use strict';

    if (typeof module !== undefined && module.exports) {
        // it's node
        module.exports = TsMonad;
    } else {
        // stick it on the global object
        this.TsMonad = TsMonad;
    }
}).call(this);
//# sourceMappingURL=tsmonad.js.map
