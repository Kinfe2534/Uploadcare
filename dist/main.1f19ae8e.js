// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"node_modules/jquery/dist/jquery.js":[function(require,module,exports) {
var global = arguments[3];
var process = require("process");
var define;
/*!
 * jQuery JavaScript Library v3.6.0
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2021-03-02T17:08Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

		// Support: Chrome <=57, Firefox <=52
		// In some browsers, typeof returns "function" for HTML <object> elements
		// (i.e., `typeof document.createElement( "object" ) === "function"`).
		// We don't want to classify *any* DOM node as a function.
		// Support: QtWeb <=3.8.5, WebKit <=534.34, wkhtmltopdf tool <=0.12.5
		// Plus for old WebKit, typeof returns "function" for HTML collections
		// (e.g., `typeof document.getElementsByTagName("div") === "function"`). (gh-4756)
		return typeof obj === "function" && typeof obj.nodeType !== "number" &&
			typeof obj.item !== "function";
	};


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.6.0",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
						[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( _i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.6
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2021-02-16
 */
( function( window ) {
var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ( {} ).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	pushNative = arr.push,
	push = arr.push,
	slice = arr.slice,

	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[ i ] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
		"ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5]
		// or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
		whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
		"*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
			whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
			whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rhtml = /HTML$/i,
	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		return nonHex ?

			// Strip the backslash prefix from a non-hex escape sequence
			nonHex :

			// Replace a hexadecimal escape sequence with the encoded Unicode code point
			// Support: IE <=11+
			// For values outside the Basic Multilingual Plane (BMP), manually construct a
			// surrogate pair
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" +
				ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);

	// Support: Android<4.0
	// Detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;

			// Can't trust NodeList.length
			while ( ( target[ j++ ] = els[ i++ ] ) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&

				// Support: IE 8 only
				// Exclude object elements
				( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rcombinators.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					if ( newContext !== context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = nid.replace( rcssescape, fcssescape );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split( "|" ),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[ i ] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( ( cur = cur.nextSibling ) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return ( name === "input" || name === "button" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
					inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	var namespace = elem && elem.namespaceURI,
		docElem = elem && ( elem.ownerDocument || elem ).documentElement;

	// Support: IE <=8
	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
	// https://bugs.jquery.com/ticket/4833
	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
	// Safari 4 - 5 only, Opera <=11.6 - 12.x only
	// IE/Edge & older browsers don't support the :scope pseudo-class.
	// Support: Safari 6.0 only
	// Safari 6.0 supports :scope but it's an alias of :root there.
	support.scope = assert( function( el ) {
		docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
		return typeof el.querySelectorAll !== "undefined" &&
			!el.querySelectorAll( ":scope fieldset div" ).length;
	} );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert( function( el ) {
		el.className = "i";
		return !el.getAttribute( "className" );
	} );

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert( function( el ) {
		el.appendChild( document.createComment( "" ) );
		return !el.getElementsByTagName( "*" ).length;
	} );

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter[ "ID" ] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter[ "ID" ] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find[ "TAG" ] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,

				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( ( elem = results[ i++ ] ) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert( function( el ) {

			var input;

			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll( "[selected]" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push( "~=" );
			}

			// Support: IE 11+, Edge 15 - 18+
			// IE 11/Edge don't find elements on a `[name='']` query in some cases.
			// Adding a temporary attribute to the document before the selection works
			// around the issue.
			// Interestingly, IE 10 & older don't seem to have the issue.
			input = document.createElement( "input" );
			input.setAttribute( "name", "" );
			el.appendChild( input );
			if ( !el.querySelectorAll( "[name='']" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
					whitespace + "*(?:''|\"\")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll( ":checked" ).length ) {
				rbuggyQSA.push( ":checked" );
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push( ".#.+[+~]" );
			}

			// Support: Firefox <=3.6 - 5 only
			// Old Firefox doesn't throw on a badly-escaped identifier.
			el.querySelectorAll( "\\\f" );
			rbuggyQSA.push( "[\\r\\n\\f]" );
		} );

		assert( function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement( "input" );
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll( "[name=d]" ).length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: Opera 10 - 11 only
			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll( "*,:x" );
			rbuggyQSA.push( ",.*:" );
		} );
	}

	if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector ) ) ) ) {

		assert( function( el ) {

			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		} );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			) );
		} :
		function( a, b ) {
			if ( b ) {
				while ( ( b = b.parentNode ) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a == document || a.ownerDocument == preferredDoc &&
				contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b == document || b.ownerDocument == preferredDoc &&
				contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			return a == document ? -1 :
				b == document ? 1 :
				/* eslint-enable eqeqeq */
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( ( cur = cur.parentNode ) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( ( cur = cur.parentNode ) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[ i ] === bp[ i ] ) {
			i++;
		}

		return i ?

			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[ i ], bp[ i ] ) :

			// Otherwise nodes in our document sort first
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			ap[ i ] == preferredDoc ? -1 :
			bp[ i ] == preferredDoc ? 1 :
			/* eslint-enable eqeqeq */
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( support.matchesSelector && documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

				// As well, disconnected nodes are said to be in a document
				// fragment in IE 9
				elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			( val = elem.getAttributeNode( name ) ) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {

		// If no nodeType, this is expected to be an array
		while ( ( node = elem[ i++ ] ) ) {

			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {

			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}

	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
				match[ 5 ] || "" ).replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					Sizzle.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

				// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				Sizzle.error( match[ 0 ] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace +
					")" + className + "(" + whitespace + "|$)" ) ) && classCache(
						className, function( elem ) {
							return pattern.test(
								typeof elem.className === "string" && elem.className ||
								typeof elem.getAttribute !== "undefined" &&
									elem.getAttribute( "class" ) ||
								""
							);
				} );
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				/* eslint-disable max-len */

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
				/* eslint-enable max-len */

			};
		},

		"CHILD": function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || ( node[ expando ] = {} );

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								( outerCache[ node.uniqueID ] = {} );

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {

								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || ( node[ expando ] = {} );

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									( outerCache[ node.uniqueID ] = {} );

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												( outerCache[ node.uniqueID ] = {} );

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		"not": markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element (issue #299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		"has": markFunction( function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		} ),

		"contains": markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement &&
				( !document.hasFocus || document.hasFocus() ) &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return ( nodeName === "input" && !!elem.checked ) ||
				( nodeName === "option" && !!elem.selected );
		},

		"selected": function( elem ) {

			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {

			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos[ "empty" ]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		"last": createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		"even": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"odd": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ?
				argument + length :
				argument > length ?
					length :
					argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rcombinators.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :

			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] ||
							( outerCache[ elem.uniqueID ] = {} );

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = uniqueCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts(
				selector || "*",
				context.nodeType ? [ context ] : context,
				[]
			),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?

				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

					// If the preceding token was a descendant combinator, insert an implicit any-element `*`
					tokens
						.slice( 0, i - 1 )
						.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache(
			selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers )
		);

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
			context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
				.replace( runescape, funescape ), context ) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
						context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert( function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute( "href" ) === "#";
} ) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	} );
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert( function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
} ) ) {
	addHandle( "value", function( elem, _name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	} );
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert( function( el ) {
	return el.getAttribute( "disabled" ) == null;
} ) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
				( val = elem.getAttributeNode( name ) ) && val.specified ?
					val.value :
					null;
		}
	} );
}

return Sizzle;

} )( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

	return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

}
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the primary Deferred
			primary = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						primary.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, primary.done( updateFunc( i ) ).resolve, primary.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( primary.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return primary.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), primary.reject );
		}

		return primary.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 - 11+
// focus() and blur() are asynchronous, except when they are no-op.
// So expect focus to be synchronous when the element is already active,
// and blur to be synchronous when the element is not already active.
// (focus and blur are always synchronous in other supported browsers,
// this just defines when we can count on it).
function expectSync( elem, type ) {
	return ( elem === safeActiveElement() ) === ( type === "focus" );
}

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
				dataPriv.get( this, "events" ) || Object.create( null )
			)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
						return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
						return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", returnTrue );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, expectSync ) {

	// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
	if ( !expectSync ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var notAsync, result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				// Saved data should be false in such cases, but might be a leftover capture object
				// from an async native handler (gh-4350)
				if ( !saved.length ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					// Support: IE <=9 - 11+
					// focus() and blur() are asynchronous
					notAsync = expectSync( this, type );
					this[ type ]();
					result = dataPriv.get( this, type );
					if ( saved !== result || notAsync ) {
						dataPriv.set( this, type, false );
					} else {
						result = {};
					}
					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();

						// Support: Chrome 86+
						// In Chrome, if an element having a focusout handler is blurred by
						// clicking outside of it, it invokes the handler synchronously. If
						// that handler calls `.remove()` on the element, the data is cleared,
						// leaving `result` undefined. We need to guard against this.
						return result && result.value;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering the
				// native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved.length ) {

				// ...and capture the result
				dataPriv.set( this, type, {
					value: jQuery.event.trigger(

						// Support: IE <=9 - 11+
						// Extend with the prototype to reset the above stopImmediatePropagation()
						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
						saved.slice( 1 ),
						this
					)
				} );

				// Abort handling of the native event
				event.stopImmediatePropagation();
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,
	which: true
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, expectSync );

			// Return false to allow normal processing in the caller
			return false;
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		// Suppress native focus or blur as it's already being fired
		// in leverageNative.
		_default: function() {
			return true;
		},

		delegateType: delegateType
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		//
		// Support: Firefox 70+
		// Only Firefox includes border widths
		// in computed dimensions. (gh-4529)
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
				tr.style.cssText = "border:1px solid";

				// Support: Chrome 86+
				// Height set through cssText does not get applied.
				// Computed height then comes back as 0.
				tr.style.height = "1px";
				trChild.style.height = "9px";

				// Support: Android 8 Chrome 86+
				// In our bodyBackground.html iframe,
				// display for all div elements is set to "inline",
				// which causes a problem only in Android 8 Chrome 86.
				// Ensuring the div is display: block
				// gets around this issue.
				trChild.style.display = "block";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = ( parseInt( trStyle.height, 10 ) +
					parseInt( trStyle.borderTopWidth, 10 ) +
					parseInt( trStyle.borderBottomWidth, 10 ) ) === tr.offsetHeight;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"gridArea": true,
		"gridColumn": true,
		"gridColumnEnd": true,
		"gridColumnStart": true,
		"gridRow": true,
		"gridRowEnd": true,
		"gridRowStart": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
					swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, dimension, extra );
					} ) :
					getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
				jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

				/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
					animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};

		doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || Object.create( null ) )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {

				// Handle: regular nodes (via `this.ownerDocument`), window
				// (via `this.document`) & document (via `this`).
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = { guid: Date.now() };

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, parserErrorElem;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {}

	parserErrorElem = xml && xml.getElementsByTagName( "parsererror" )[ 0 ];
	if ( !xml || parserErrorElem ) {
		jQuery.error( "Invalid XML: " + (
			parserErrorElem ?
				jQuery.map( parserErrorElem.childNodes, function( el ) {
					return el.textContent;
				} ).join( "\n" ) :
				data
		) );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} ).filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} ).map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );

originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Use a noop converter for missing script but not if jsonp
			if ( !isSuccess &&
				jQuery.inArray( "script", s.dataTypes ) > -1 &&
				jQuery.inArray( "json", s.dataTypes ) < 0 ) {
				s.converters[ "text script" ] = function() {};
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( _i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

jQuery.ajaxPrefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.toLowerCase() === "content-type" ) {
			s.contentType = s.headers[ i ] || "";
		}
	}
} );


jQuery._evalUrl = function( url, options, doc ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options, doc );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( {
		padding: "inner" + name,
		content: type,
		"": "outer" + name
	}, function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( _i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );

jQuery.each(
	( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	}
);




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "" );
};



// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

},{"process":"node_modules/process/browser.js"}],"node_modules/uploadcare-widget/uploadcare.js":[function(require,module,exports) {
var define;
var global = arguments[3];
/**
 * @license uploadcare-widget v3.16.0
 *
 * Copyright (c) 2020 Uploadcare, Inc.
 *
 * This source code is licensed under the BSD 2-Clause License
 * found in the LICENSE file in the root directory of this source tree.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery')) : typeof define === 'function' && define.amd ? define(['jquery'], factory) : (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.uploadcare = factory(global.$));
})(this, function ($) {
  'use strict';

  function _interopDefaultLegacy(e) {
    return e && typeof e === 'object' && 'default' in e ? e : {
      'default': e
    };
  }

  var $__default = /*#__PURE__*/_interopDefaultLegacy($);

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    if (superClass) _setPrototypeOf(subClass, superClass);
  }

  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
      return o.__proto__ || Object.getPrototypeOf(o);
    };
    return _getPrototypeOf(o);
  }

  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };

    return _setPrototypeOf(o, p);
  }

  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;

    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
      return true;
    } catch (e) {
      return false;
    }
  }

  function _assertThisInitialized(self) {
    if (self === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return self;
  }

  function _possibleConstructorReturn(self, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    }

    return _assertThisInitialized(self);
  }

  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();

    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived),
          result;

      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;

        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }

      return _possibleConstructorReturn(this, result);
    };
  }

  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null) break;
    }

    return object;
  }

  function _get(target, property, receiver) {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get;
    } else {
      _get = function _get(target, property, receiver) {
        var base = _superPropBase(target, property);

        if (!base) return;
        var desc = Object.getOwnPropertyDescriptor(base, property);

        if (desc.get) {
          return desc.get.call(receiver);
        }

        return desc.value;
      };
    }

    return _get(target, property, receiver || target);
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it;

    if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = o[Symbol.iterator]();
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

  var isWindowDefined = function isWindowDefined() {
    return (typeof window === "undefined" ? "undefined" : _typeof(window)) === 'object';
  };

  var isWindowDefined$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    isWindowDefined: isWindowDefined
  });

  if (isWindowDefined() && window.XDomainRequest) {
    $__default['default'].ajaxTransport(function (s) {
      if (s.crossDomain && s.async) {
        if (s.timeout) {
          s.xdrTimeout = s.timeout;
          delete s.timeout;
        }

        var xdr;
        return {
          send: function send(_, complete) {
            function callback(status, statusText, responses, responseHeaders) {
              xdr.onload = xdr.onerror = xdr.ontimeout = function () {};

              xdr = undefined;
              complete(status, statusText, responses, responseHeaders);
            }

            xdr = new XDomainRequest();

            xdr.onload = function () {
              callback(200, "OK", {
                text: xdr.responseText
              }, "Content-Type: " + xdr.contentType);
            };

            xdr.onerror = function () {
              callback(404, "Not Found");
            };

            xdr.onprogress = function () {};

            xdr.ontimeout = function () {
              callback(0, "timeout");
            };

            xdr.timeout = s.xdrTimeout || Number.MAX_VALUE;
            xdr.open(s.type, s.url.replace(/^https?:/, ''));
            xdr.send(s.hasContent && s.data || null);
          },
          abort: function abort() {
            if (xdr) {
              xdr.onerror = function () {};

              xdr.abort();
            }
          }
        };
      }
    });
  }

  var version = "3.16.0";
  var fileAPI = isWindowDefined() && !!(window.File && window.FileList && window.FileReader);
  var sendFileAPI = isWindowDefined() && !!(window.FormData && fileAPI); // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/draganddrop.js

  var dragAndDrop = isWindowDefined() && function () {
    var el;
    el = document.createElement('div');
    return 'draggable' in el || 'ondragstart' in el && 'ondrop' in el;
  }(); // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/canvas.js


  var canvas = isWindowDefined() && function () {
    var el;
    el = document.createElement('canvas');
    return !!(el.getContext && el.getContext('2d'));
  }();

  var fileDragAndDrop = fileAPI && dragAndDrop;
  var iOSVersion = null; // TODO: don't access to navigator in module scope (NODE don't have navigator)

  var ios = isWindowDefined() && /^[^(]+\(iP(?:hone|od|ad);\s*(.+?)\)/.exec(navigator.userAgent);

  if (ios) {
    var ver = /OS (\d*)_(\d*)/.exec(ios[1]);

    if (ver) {
      iOSVersion = +ver[1] + ver[2] / 10;
    }
  } // There is no a guaranteed way to detect iPadOs, cause it mimics the desktop safari.
  // So we're checkin for multitouch support and `navigator.platform` value.
  // Since no desktop macs with multitouch exists, this check will work. For now at least.
  // Workaround source: https://stackoverflow.com/questions/57776001/how-to-detect-ipad-pro-as-ipad-using-javascript


  var isIpadOs = isWindowDefined() && navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform);
  var Blob = false;

  try {
    if (isWindowDefined() && new window.Blob()) {
      Blob = window.Blob;
    }
  } catch (error) {}

  var url = isWindowDefined() && (window.URL || window.webkitURL || false);
  var URL = url && url.createObjectURL && url;
  var FileReader = isWindowDefined() && (window.FileReader != null ? window.FileReader.prototype.readAsArrayBuffer : undefined) && window.FileReader; // utils

  var log = function log() {
    var ref;

    try {
      var _ref;

      return (ref = window.console) != null ? typeof ref.log === 'function' ? (_ref = ref).log.apply(_ref, arguments) : undefined : undefined;
    } catch (error) {}
  };

  var debug = function debug() {
    var ref;

    if ((ref = window.console) != null ? ref.debug : undefined) {
      try {
        var _window$console;

        return (_window$console = window.console).debug.apply(_window$console, arguments);
      } catch (error) {}
    } else {
      return log.apply(void 0, ['Debug:'].concat(Array.prototype.slice.call(arguments)));
    }
  };

  var warn = function warn() {
    var ref;

    if ((ref = window.console) != null ? ref.warn : undefined) {
      try {
        var _window$console2;

        return (_window$console2 = window.console).warn.apply(_window$console2, arguments);
      } catch (error) {}
    } else {
      return log.apply(void 0, ['Warning:'].concat(Array.prototype.slice.call(arguments)));
    }
  };

  var messages = {};

  var warnOnce = function warnOnce(msg) {
    if (messages[msg] == null) {
      messages[msg] = true;
      return warn(msg);
    }
  };

  var indexOf$2 = [].indexOf; // utils

  var unique = function unique(arr) {
    var item, j, len, result;
    result = [];

    for (j = 0, len = arr.length; j < len; j++) {
      item = arr[j];

      if (indexOf$2.call(result, item) < 0) {
        result.push(item);
      }
    }

    return result;
  };

  var defer = function defer(fn) {
    return setTimeout(fn, 0);
  };

  var gcd = function gcd(a, b) {
    var c;

    while (b) {
      c = a % b;
      a = b;
      b = c;
    }

    return a;
  };

  var once = function once(fn) {
    var called, result;
    called = false;
    result = null;
    return function () {
      if (!called) {
        result = fn.apply(this, arguments);
        called = true;
      }

      return result;
    };
  };

  var wrapToPromise = function wrapToPromise(value) {
    return $__default['default'].Deferred().resolve(value).promise();
  }; // same as promise.then(), but if filter returns promise
  // it will be just passed forward without any special behavior


  var then = function then(pr, doneFilter, failFilter, progressFilter) {
    var compose, df;
    df = $__default['default'].Deferred();

    compose = function compose(fn1, fn2) {
      if (fn1 && fn2) {
        return function () {
          return fn2.call(this, fn1.apply(this, arguments));
        };
      } else {
        return fn1 || fn2;
      }
    };

    pr.then(compose(doneFilter, df.resolve), compose(failFilter, df.reject), compose(progressFilter, df.notify));
    return df.promise();
  }; // Build copy of source with only specified methods.
  // Handles chaining correctly.


  var bindAll = function bindAll(source, methods) {
    var target;
    target = {};
    $__default['default'].each(methods, function (i, method) {
      var fn = source[method];

      if ($__default['default'].isFunction(fn)) {
        target[method] = function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          var result = fn.apply(source, args); // Fix chaining

          if (result === source) {
            return target;
          } else {
            return result;
          }
        };
      } else {
        target[method] = fn;
      }
    });
    return target;
  };

  var upperCase = function upperCase(s) {
    return s.replace(/([A-Z])/g, '_$1').toUpperCase();
  };

  var publicCallbacks = function publicCallbacks(callbacks) {
    var result;
    result = callbacks.add;
    result.add = callbacks.add;
    result.remove = callbacks.remove;
    return result;
  };

  var uuid = function uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0;
      var v = c === 'x' ? r : r & 3 | 8;
      return v.toString(16);
    });
  }; // splitUrlRegex("url") => ["url", "scheme", "host", "path", "query", "fragment"]


  var splitUrlRegex = /^(?:([^:/?#]+):)?(?:\/\/([^/?#]*))?([^?#]*)\??([^#]*)#?(.*)$/;
  var uuidRegex = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i;
  var groupIdRegex = new RegExp("".concat(uuidRegex.source, "~[0-9]+"), 'i');
  var cdnUrlRegex = new RegExp("^/?(".concat(uuidRegex.source, ")(?:/(-/(?:[^/]+/)+)?([^/]*))?$"), 'i');

  var splitCdnUrl = function splitCdnUrl(url) {
    return cdnUrlRegex.exec(splitUrlRegex.exec(url)[3]);
  };

  var escapeRegExp = function escapeRegExp(str) {
    return str.replace(/[\\-\\[]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
  };

  var globRegexp = function globRegexp(str) {
    var flags = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'i';
    var parts;
    parts = $__default['default'].map(str.split('*'), escapeRegExp);
    return new RegExp('^' + parts.join('.+') + '$', flags);
  };

  var normalizeUrl = function normalizeUrl(url) {
    var scheme; // google.com/ → google.com
    // /google.com/ → /google.com
    // //google.com/ → http://google.com
    // http://google.com/ → http://google.com

    scheme = document.location.protocol;

    if (scheme !== 'http:') {
      scheme = 'https:';
    }

    return url.replace(/^\/\//, scheme + '//').replace(/\/+$/, '');
  };

  var fitText = function fitText(text, max) {
    if (text.length > max) {
      var head = Math.ceil((max - 3) / 2);
      var tail = Math.floor((max - 3) / 2);
      return text.slice(0, head) + '...' + text.slice(-tail);
    } else {
      return text;
    }
  };

  var fitSizeInCdnLimit = function fitSizeInCdnLimit(objSize) {
    return fitSize(objSize, [2048, 2048]);
  };

  var fitSize = function fitSize(objSize, boxSize, upscale) {
    var heightRation, widthRatio;

    if (objSize[0] > boxSize[0] || objSize[1] > boxSize[1] || upscale) {
      widthRatio = boxSize[0] / objSize[0];
      heightRation = boxSize[1] / objSize[1];

      if (!boxSize[0] || boxSize[1] && widthRatio > heightRation) {
        return [Math.round(heightRation * objSize[0]), boxSize[1]];
      } else {
        return [boxSize[0], Math.round(widthRatio * objSize[1])];
      }
    } else {
      return objSize.slice();
    }
  };

  var applyCropCoordsToInfo = function applyCropCoordsToInfo(info, crop, size, coords) {
    var downscale, h, modifiers, prefered, upscale, w, wholeImage;
    w = coords.width;
    h = coords.height;
    prefered = crop.preferedSize;
    modifiers = '';
    wholeImage = w === size[0] && h === size[1];

    if (!wholeImage) {
      modifiers += "-/crop/".concat(w, "x").concat(h, "/").concat(coords.left, ",").concat(coords.top, "/");
    }

    downscale = crop.downscale && (w > prefered[0] || h > prefered[1]);
    upscale = crop.upscale && (w < prefered[0] || h < prefered[1]);

    if (downscale || upscale) {
      var _prefered = prefered;

      var _prefered2 = _slicedToArray(_prefered, 2);

      coords.sw = _prefered2[0];
      coords.sh = _prefered2[1];
      modifiers += "-/resize/".concat(prefered.join('x'), "/");
    } else if (!wholeImage) {
      modifiers += '-/preview/';
    }

    info = $__default['default'].extend({}, info);
    info.cdnUrlModifiers = modifiers;
    info.cdnUrl = "".concat(info.originalUrl).concat(modifiers || '');
    info.crop = coords;
    return info;
  };

  var imagesOnlyAcceptTypes = ['image/*', 'image/heif', 'image/heif-sequence', 'image/heic', 'image/heic-sequence', 'image/avif', 'image/avif-sequence', '.heif', '.heifs', '.heic', '.heics', '.avif', '.avifs'].join(',');

  var fileInput = function fileInput(container, settings, fn) {
    var accept, input, _run;

    input = null;
    accept = settings.inputAcceptTypes;

    if (accept === '') {
      accept = settings.imagesOnly ? imagesOnlyAcceptTypes : null;
    }

    (_run = function run() {
      input = (settings.multiple ? $__default['default']('<input type="file" multiple>') : $__default['default']('<input type="file">')).attr('accept', accept).css({
        position: 'absolute',
        top: 0,
        opacity: 0,
        margin: 0,
        padding: 0,
        width: 'auto',
        height: 'auto',
        cursor: container.css('cursor')
      }).on('change', function () {
        fn(this);
        $__default['default'](this).hide();
        return _run();
      });
      return container.append(input);
    })();

    return container.css({
      position: 'relative',
      overflow: 'hidden' // to make it posible to set `cursor:pointer` on button
      // http://stackoverflow.com/a/9182787/478603

    }).mousemove(function (e) {
      var left, top, width;

      var _$$offset = $__default['default'](this).offset();

      left = _$$offset.left;
      top = _$$offset.top;
      width = input.width();
      return input.css({
        left: e.pageX - left - width + 10,
        top: e.pageY - top - 10
      });
    });
  };

  var fileSelectDialog = function fileSelectDialog(container, settings, fn) {
    var attributes = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    var accept;
    accept = settings.inputAcceptTypes;

    if (accept === '') {
      accept = settings.imagesOnly ? imagesOnlyAcceptTypes : null;
    }

    return $__default['default'](settings.multiple ? '<input type="file" multiple>' : '<input type="file">').attr('accept', accept).attr(attributes).css({
      position: 'fixed',
      bottom: 0,
      opacity: 0
    }).on('change', function () {
      fn(this);
      return $__default['default'](this).remove();
    }).appendTo(container).focus().click().hide();
  };

  var fileSizeLabels = 'B KB MB GB TB PB EB ZB YB'.split(' ');

  var readableFileSize = function readableFileSize(value) {
    var onNaN = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var prefix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
    var postfix = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
    var digits, fixedTo, i, threshold;
    value = parseInt(value, 10);

    if (isNaN(value)) {
      return onNaN;
    }

    digits = 2;
    i = 0;
    threshold = 1000 - 5 * Math.pow(10, 2 - Math.max(digits, 3));

    while (value > threshold && i < fileSizeLabels.length - 1) {
      i++;
      value /= 1024;
    }

    value += 0.000000000000001;
    fixedTo = Math.max(0, digits - Math.floor(value).toFixed(0).length); // fixed → number → string, to trim trailing zeroes

    value = Number(value.toFixed(fixedTo)); // eslint-disable-next-line no-irregular-whitespace

    return "".concat(prefix).concat(value, "\xA0").concat(fileSizeLabels[i]).concat(postfix);
  };

  var ajaxDefaults = {
    dataType: 'json',
    crossDomain: true,
    cache: false
  };

  var jsonp = function jsonp(url, type, data) {
    var settings = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
    return $__default['default'].ajax($__default['default'].extend({
      url: url,
      type: type,
      data: data
    }, settings, ajaxDefaults)).then(function (data) {
      if (data.error) {
        var message, code;

        if (typeof data.error === 'string') {
          // /from_url/state/ case
          message = data.error;
          code = data.error_code;
        } else {
          // other cases (direct/multipart/group)
          message = data.error.content;
          code = data.error.error_code;
        }

        return $__default['default'].Deferred().reject({
          message: message,
          code: code
        });
      }

      return data;
    }, function (_, textStatus, errorThrown) {
      var text;
      text = "".concat(textStatus, " (").concat(errorThrown, ")");
      warn("JSONP unexpected error: ".concat(text, " while loading ").concat(url));
      return text;
    });
  };

  var canvasToBlob = function canvasToBlob(canvas, type, quality, callback) {
    var arr, binStr, dataURL, i, j, ref;

    if (window.HTMLCanvasElement.prototype.toBlob) {
      return canvas.toBlob(callback, type, quality);
    }

    dataURL = canvas.toDataURL(type, quality);
    dataURL = dataURL.split(',');
    binStr = window.atob(dataURL[1]);
    arr = new Uint8Array(binStr.length);

    for (i = j = 0, ref = binStr.length; j < ref; i = j += 1) {
      arr[i] = binStr.charCodeAt(i);
    }

    return callback(new window.Blob([arr], {
      type: /:(.+\/.+);/.exec(dataURL[0])[1]
    }));
  };

  var taskRunner = function taskRunner(capacity) {
    var queue, _release, run, running;

    running = 0;
    queue = [];

    _release = function release() {
      var task;

      if (queue.length) {
        task = queue.shift();
        return defer(function () {
          return task(_release);
        });
      } else {
        running -= 1;
        return running;
      }
    };

    run = function run(task) {
      if (!capacity || running < capacity) {
        running += 1;
        return defer(function () {
          return task(_release);
        });
      } else {
        return queue.push(task);
      }
    };

    return run;
  }; // This is work around bug in jquery https://github.com/jquery/jquery/issues/2013
  // action, add listener, callbacks,
  // ... .then handlers, argument index, [final state]


  var pipeTuples = [['notify', 'progress', 2], ['resolve', 'done', 0], ['reject', 'fail', 1]];

  var fixedPipe = function fixedPipe(promise) {
    for (var _len2 = arguments.length, fns = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      fns[_key2 - 1] = arguments[_key2];
    }

    return $__default['default'].Deferred(function (newDefer) {
      return $__default['default'].each(pipeTuples, function (i, tuple) {
        var fn; // Map tuples (progress, done, fail) to arguments (done, fail, progress)

        fn = $__default['default'].isFunction(fns[tuple[2]]) && fns[tuple[2]];
        return promise[tuple[1]](function () {
          var returned;
          returned = fn && fn.apply(this, arguments);

          if (returned && $__default['default'].isFunction(returned.promise)) {
            return returned.promise().progress(newDefer.notify).done(newDefer.resolve).fail(newDefer.reject);
          } else {
            return newDefer[tuple[0] + 'With'](this === promise ? newDefer.promise() : this, fn ? [returned] : arguments);
          }
        });
      });
    }).promise();
  };

  var TestPixel = {
    R: 55,
    G: 110,
    B: 165,
    A: 255
  };
  var FILL_STYLE = "rgba(".concat(TestPixel.R, ", ").concat(TestPixel.G, ", ").concat(TestPixel.B, ", ").concat(TestPixel.A / 255, ")");

  function canvasTest(width, height) {
    // Wrapped into try/catch because memory alloction errors can be thrown due to insufficient RAM
    try {
      var fill = [width - 1, height - 1, 1, 1]; // x, y, width, height

      var cropCvs = document.createElement('canvas');
      cropCvs.width = 1;
      cropCvs.height = 1;
      var testCvs = document.createElement('canvas');
      testCvs.width = width;
      testCvs.height = height;
      var cropCtx = cropCvs.getContext('2d');
      var testCtx = testCvs.getContext('2d');

      if (testCtx) {
        testCtx.fillStyle = FILL_STYLE;
        testCtx.fillRect.apply(testCtx, fill); // Render the test pixel in the bottom-right corner of the
        // test canvas in the top-left of the 1x1 crop canvas. This
        // dramatically reducing the time for getImageData to complete.

        cropCtx.drawImage(testCvs, width - 1, height - 1, 1, 1, 0, 0, 1, 1);
      }

      var imageData = cropCtx && cropCtx.getImageData(0, 0, 1, 1).data;
      var isTestPass = false;

      if (imageData) {
        // On IE10, imageData have type CanvasPixelArray, not Uint8ClampedArray.
        // CanvasPixelArray supports index access operations only.
        // Array buffers can't be destructuredd and compared with JSON.stringify
        isTestPass = imageData[0] === TestPixel.R && imageData[1] === TestPixel.G && imageData[2] === TestPixel.B && imageData[3] === TestPixel.A;
      }

      testCvs.width = testCvs.height = 1;
      return isTestPass;
    } catch (e) {
      log("Failed to test for max canvas size of ".concat(width, "x").concat(height, "."), e);
      return false;
    }
  }

  function memoize(fn, serializer) {
    var cache = {};
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var key = serializer(args, cache);
      return key in cache ? cache[key] : cache[key] = fn.apply(void 0, args);
    };
  }

  var sizes = {
    squareSide: [// Safari (iOS < 9, ram >= 256)
    // We are supported mobile safari < 9 since widget v2, by 5 Mpx limit
    // so it's better to continue support despite the absence of this browser in the support table
    Math.floor(Math.sqrt(5 * 1000 * 1000)), // IE Mobile (Windows Phone 8.x)
    // Safari (iOS >= 9)
    4096, // IE 9 (Win)
    8192, // Firefox 63 (Mac, Win)
    11180, // Chrome 68 (Android 6)
    10836, // Chrome 68 (Android 5)
    11402, // Chrome 68 (Android 7.1-9)
    14188, // Chrome 70 (Mac, Win)
    // Chrome 68 (Android 4.4)
    // Edge 17 (Win)
    // Safari 7-12 (Mac)
    16384],
    dimension: [// IE Mobile (Windows Phone 8.x)
    4096, // IE 9 (Win)
    8192, // Edge 17 (Win)
    // IE11 (Win)
    16384, // Chrome 70 (Mac, Win)
    // Chrome 68 (Android 4.4-9)
    // Firefox 63 (Mac, Win)
    32767, // Chrome 83 (Mac, Win)
    // Safari 7-12 (Mac)
    // Safari (iOS 9-12)
    // Actually Safari has a much bigger limits - 4194303 of width and 8388607 of height,
    // but we will not use them
    65535]
  };
  var MAX_SQUARE_SIDE = sizes.squareSide[sizes.squareSide.length - 1];

  function wrapAsync(fn) {
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var df = $__default['default'].Deferred();
      defer(function () {
        var passed = fn.apply(void 0, args);
        df.resolve(passed);
      });
      return df.promise();
    };
  }
  /**
   * Memoization key serealizer, that prevents unnecessary canvas tests.
   * No need to make test if we know that:
   * - browser supports higher canvas size
   * - browser doesn't support lower canvas size
   */


  function memoKeySerializer(args, cache) {
    var _args = _slicedToArray(args, 1),
        w = _args[0];

    var cachedWidths = Object.keys(cache).map(function (val) {
      return parseInt(val, 10);
    }).sort(function (a, b) {
      return a - b;
    });

    for (var i = 0; i < cachedWidths.length; i++) {
      var cachedWidth = cachedWidths[i];
      var isSupported = !!cache[cachedWidth]; // higher supported canvas size, return it

      if (cachedWidth > w && isSupported) {
        return cachedWidth;
      } // lower unsupported canvas size, return it


      if (cachedWidth < w && !isSupported) {
        return cachedWidth;
      }
    } // use canvas width as the key,
    // because we're doing dimension test by width - [dimension, 1]


    return w;
  } // separate memoization for square and dimension tests


  var squareTest = wrapAsync(memoize(canvasTest, memoKeySerializer));
  var dimensionTest = wrapAsync(memoize(canvasTest, memoKeySerializer));

  function testCanvasSize(w, h) {
    var df = $__default['default'].Deferred();
    var testSquareSide = sizes.squareSide.find(function (side) {
      return side * side >= w * h;
    });
    var testDimension = sizes.dimension.find(function (side) {
      return side >= w && side >= h;
    });

    if (!testSquareSide || !testDimension) {
      return df.reject();
    }

    var tasks = [squareTest(testSquareSide, testSquareSide), dimensionTest(testDimension, 1)];
    $__default['default'].when.apply($__default['default'], tasks).done(function (squareSupported, dimensionSupported) {
      if (squareSupported && dimensionSupported) {
        df.resolve();
      } else {
        df.reject();
      }
    });
    return df.promise();
  }

  var indexOf$1 = [].indexOf; // settings

  var arrayOptions, constrainOptions, constraints, defaultPreviewUrlCallback, defaults$1, flagOptions, intOptions, integration, integrationToUserAgent, normalize, parseCrop, parseShrink, presets, script, str2arr, transformOptions, transforms, urlOptions;
  defaults$1 = {
    // developer hooks
    live: true,
    manualStart: false,
    locale: null,
    localePluralize: null,
    localeTranslations: null,
    // widget & dialog settings
    systemDialog: false,
    crop: false,
    previewStep: false,
    imagesOnly: false,
    clearable: false,
    multiple: false,
    multipleMax: 1000,
    multipleMin: 1,
    multipleMaxStrict: false,
    imageShrink: false,
    pathValue: true,
    tabs: 'file camera url facebook gdrive gphotos dropbox instagram evernote flickr onedrive',
    preferredTypes: '',
    inputAcceptTypes: '',
    // '' means default, null means "disable accept"
    // upload settings
    doNotStore: false,
    publicKey: null,
    secureSignature: '',
    secureExpire: '',
    pusherKey: '79ae88bd931ea68464d9',
    cdnBase: 'https://ucarecdn.com',
    urlBase: 'https://upload.uploadcare.com',
    socialBase: 'https://social.uploadcare.com',
    previewProxy: null,
    previewUrlCallback: null,
    // fine tuning
    imagePreviewMaxSize: 25 * 1024 * 1024,
    multipartMinSize: 10 * 1024 * 1024,
    multipartPartSize: 5 * 1024 * 1024,
    multipartMinLastPartSize: 1024 * 1024,
    multipartConcurrency: 4,
    multipartMaxAttempts: 3,
    parallelDirectUploads: 10,
    passWindowOpen: false,
    // camera
    cameraMirrorDefault: true,
    // camera recording
    enableAudioRecording: true,
    enableVideoRecording: true,
    videoPreferredMimeTypes: null,
    audioBitsPerSecond: null,
    videoBitsPerSecond: null,
    // maintain settings
    scriptBase: "//ucarecdn.com/widget/".concat(version, "/uploadcare/"),
    debugUploads: false,
    integration: ''
  };
  transforms = {
    multipleMax: {
      from: 0,
      to: 1000
    }
  };
  constraints = {
    multipleMax: {
      min: 1,
      max: 1000
    }
  };
  presets = {
    tabs: {
      all: 'file camera url facebook gdrive gphotos dropbox instagram evernote flickr onedrive box vk huddle',
      default: defaults$1.tabs
    }
  }; // integration setting from data attributes of script tag

  script = isWindowDefined() && (document.currentScript || function () {
    var scripts;
    scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  }());

  integration = isWindowDefined() && $__default['default'](script).data('integration');

  if (integration && integration != null) {
    defaults$1 = $__default['default'].extend(defaults$1, {
      integration: integration
    });
  }

  str2arr = function str2arr(value) {
    if (!$__default['default'].isArray(value)) {
      value = $__default['default'].trim(value);
      value = value ? value.split(' ') : [];
    }

    return value;
  };

  arrayOptions = function arrayOptions(settings, keys) {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var i, item, j, key, len, len1, source, value;

    for (i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      value = source = str2arr(settings[key]);

      if (hasOwnProperty.apply(presets, [key])) {
        value = [];

        for (j = 0, len1 = source.length; j < len1; j++) {
          item = source[j];

          if (hasOwnProperty.apply(presets[key], [item])) {
            value = value.concat(str2arr(presets[key][item]));
          } else {
            value.push(item);
          }
        }
      }

      settings[key] = unique(value);
    }

    return settings;
  };

  urlOptions = function urlOptions(settings, keys) {
    var i, key, len;

    for (i = 0, len = keys.length; i < len; i++) {
      key = keys[i];

      if (settings[key] != null) {
        settings[key] = normalizeUrl(settings[key]);
      }
    }

    return settings;
  };

  flagOptions = function flagOptions(settings, keys) {
    var i, key, len, value;

    for (i = 0, len = keys.length; i < len; i++) {
      key = keys[i];

      if (!(settings[key] != null)) {
        continue;
      }

      value = settings[key];

      if (typeof value === 'string') {
        // "", "..." -> true
        // "false", "disabled" -> false
        value = $__default['default'].trim(value).toLowerCase();
        settings[key] = !(value === 'false' || value === 'disabled');
      } else {
        settings[key] = !!value;
      }
    }

    return settings;
  };

  intOptions = function intOptions(settings, keys) {
    var i, key, len;

    for (i = 0, len = keys.length; i < len; i++) {
      key = keys[i];

      if (settings[key] != null) {
        settings[key] = parseInt(settings[key]);
      }
    }

    return settings;
  };

  integrationToUserAgent = function integrationToUserAgent(settings) {
    settings._userAgent = "UploadcareWidget/".concat(version, "/").concat(settings.publicKey, " (JavaScript").concat(settings.integration ? "; ".concat(settings.integration) : '', ")");
    return settings;
  };

  transformOptions = function transformOptions(settings, transforms) {
    var key, transform;

    for (key in transforms) {
      transform = transforms[key];

      if (settings[key] != null) {
        if (settings[key] === transform.from) {
          settings[key] = transform.to;
        }
      }
    }

    return settings;
  };

  constrainOptions = function constrainOptions(settings, constraints) {
    var key, max, min;

    for (key in constraints) {
      var _constraints$key = constraints[key];
      min = _constraints$key.min;
      max = _constraints$key.max;

      if (settings[key] != null) {
        settings[key] = Math.min(Math.max(settings[key], min), max);
      }
    }

    return settings;
  };

  parseCrop = function parseCrop(val) {
    var ratio, reRatio;
    reRatio = /^([0-9]+)([x:])([0-9]+)\s*(|upscale|minimum)$/i;
    ratio = reRatio.exec($__default['default'].trim(val.toLowerCase())) || [];
    return {
      downscale: ratio[2] === 'x',
      upscale: !!ratio[4],
      notLess: ratio[4] === 'minimum',
      preferedSize: ratio.length ? [+ratio[1], +ratio[3]] : undefined
    };
  };

  parseShrink = function parseShrink(val) {
    var reShrink = /^([0-9]+)x([0-9]+)(?:\s+(\d{1,2}|100)%)?$/i;
    var shrink = reShrink.exec($__default['default'].trim(val.toLowerCase())) || [];

    if (!shrink.length) {
      return false;
    }

    var size = shrink[1] * shrink[2];
    var maxSize = MAX_SQUARE_SIDE * MAX_SQUARE_SIDE;

    if (size > maxSize) {
      warnOnce("Shrinked size can not be larger than ".concat(Math.floor(maxSize / 1000 / 1000), "MP. ") + "You have set ".concat(shrink[1], "x").concat(shrink[2], " (") + "".concat(Math.ceil(size / 1000 / 100) / 10, "MP)."));
      return false;
    }

    return {
      quality: shrink[3] ? shrink[3] / 100 : undefined,
      size: size
    };
  };

  defaultPreviewUrlCallback = function defaultPreviewUrlCallback(url, info) {
    var addAmpersand, addName, addQuery, queryPart;

    if (!this.previewProxy) {
      return url;
    }

    addQuery = !/\?/.test(this.previewProxy);
    addName = addQuery || !/=$/.test(this.previewProxy);
    addAmpersand = !addQuery && !/[&?=]$/.test(this.previewProxy);
    queryPart = encodeURIComponent(url);

    if (addName) {
      queryPart = 'url=' + queryPart;
    }

    if (addAmpersand) {
      queryPart = '&' + queryPart;
    }

    if (addQuery) {
      queryPart = '?' + queryPart;
    }

    return this.previewProxy + queryPart;
  };

  normalize = function normalize(settings) {
    var skydriveIndex;
    arrayOptions(settings, ['tabs', 'preferredTypes', 'videoPreferredMimeTypes']);
    urlOptions(settings, ['cdnBase', 'socialBase', 'urlBase', 'scriptBase']);
    flagOptions(settings, ['doNotStore', 'imagesOnly', 'multiple', 'clearable', 'pathValue', 'previewStep', 'systemDialog', 'debugUploads', 'multipleMaxStrict', 'cameraMirrorDefault']);
    intOptions(settings, ['multipleMax', 'multipleMin', 'multipartMinSize', 'multipartPartSize', 'multipartMinLastPartSize', 'multipartConcurrency', 'multipartMaxAttempts', 'parallelDirectUploads']);
    transformOptions(settings, transforms);
    constrainOptions(settings, constraints);
    integrationToUserAgent(settings);

    if (settings.crop !== false && !$__default['default'].isArray(settings.crop)) {
      if (/^(disabled?|false|null)$/i.test(settings.crop)) {
        settings.crop = false;
      } else if ($__default['default'].isPlainObject(settings.crop)) {
        // old format
        settings.crop = [settings.crop];
      } else {
        settings.crop = $__default['default'].map(('' + settings.crop).split(','), parseCrop);
      }
    }

    if (settings.imageShrink && !$__default['default'].isPlainObject(settings.imageShrink)) {
      settings.imageShrink = parseShrink(settings.imageShrink);
    }

    if (settings.crop || settings.multiple) {
      settings.previewStep = true;
    }

    if (!sendFileAPI) {
      settings.systemDialog = false;
    }

    if (settings.validators) {
      settings.validators = settings.validators.slice();
    }

    if (settings.previewProxy && !settings.previewUrlCallback) {
      settings.previewUrlCallback = defaultPreviewUrlCallback;
    }

    skydriveIndex = settings.tabs.indexOf('skydrive');

    if (skydriveIndex !== -1) {
      settings.tabs[skydriveIndex] = 'onedrive';
    }

    return settings;
  }; // global variables only


  var globals = function globals() {
    var key, scriptSettings, value;
    scriptSettings = {};

    for (key in defaults$1) {
      value = window["UPLOADCARE_".concat(upperCase(key))];

      if (value != null) {
        scriptSettings[key] = value;
      }
    }

    return scriptSettings;
  }; // Defaults + global variables + global overrides (once from uploadcare.start)
  // Not publicly-accessible


  var common = once(function (settings, ignoreGlobals) {
    var result;

    if (!ignoreGlobals) {
      defaults$1 = $__default['default'].extend(defaults$1, globals());
    }

    result = normalize($__default['default'].extend(defaults$1, settings || {}));
    waitForSettings.fire(result);
    return result;
  }); // Defaults + global variables + global overrides + local overrides

  var build = function build(settings) {
    var result;
    result = $__default['default'].extend({}, common());

    if (!$__default['default'].isEmptyObject(settings)) {
      result = normalize($__default['default'].extend(result, settings));
    }

    return result;
  };

  var waitForSettings = isWindowDefined() && $__default['default'].Callbacks('once memory');

  var CssCollector = /*#__PURE__*/function () {
    function CssCollector() {
      _classCallCheck(this, CssCollector);

      this.urls = [];
      this.styles = [];
    }

    _createClass(CssCollector, [{
      key: "addUrl",
      value: function addUrl(url) {
        if (!/^https?:\/\//i.test(url)) {
          throw new Error('Embedded urls should be absolute. ' + url);
        }

        if (!(indexOf$1.call(this.urls, url) >= 0)) {
          return this.urls.push(url);
        }
      }
    }, {
      key: "addStyle",
      value: function addStyle(style) {
        return this.styles.push(style);
      }
    }]);

    return CssCollector;
  }();

  var emptyKeyText = '<div class="uploadcare--tab__content">\n<div class="uploadcare--text uploadcare--text_size_large uploadcare--tab__title">Hello!</div>\n<div class="uploadcare--text">Your <a class="uploadcare--link" href="https://uploadcare.com/dashboard/">public key</a> is not set.</div>\n<div class="uploadcare--text">Add this to the &lt;head&gt; tag to start uploading files:</div>\n<div class="uploadcare--text uploadcare--text_pre">&lt;script&gt;\nUPLOADCARE_PUBLIC_KEY = \'your_public_key\';\n&lt;/script&gt;</div>\n</div>';

  var trackLoading = function trackLoading(image, src) {
    var def;
    def = $__default['default'].Deferred();

    if (src) {
      image.src = src;
    }

    if (image.complete) {
      def.resolve(image);
    } else {
      $__default['default'](image).one('load', function () {
        return def.resolve(image);
      });
      $__default['default'](image).one('error', function () {
        return def.reject(image);
      });
    }

    return def.promise();
  };

  var imageLoader = function imageLoader(image) {
    // if argument is an array, treat as
    // load(['1.jpg', '2.jpg'])
    if ($__default['default'].isArray(image)) {
      return $__default['default'].when.apply(null, $__default['default'].map(image, imageLoader));
    }

    if (image.src) {
      return trackLoading(image);
    } else {
      return trackLoading(new window.Image(), image);
    }
  };

  var videoLoader = function videoLoader(src) {
    var def = $__default['default'].Deferred();
    $__default['default']('<video></video>').on('loadeddata', def.resolve).on('error', def.reject).attr('src', src).get(0).load();
    return def.promise();
  };

  var testImageSrc = 'data:image/jpg;base64,' + '/9j/4AAQSkZJRgABAQEASABIAAD/4QA6RXhpZgAATU0AKgAAAAgAAwESAAMAAAABAAYAAAEo' + 'AAMAAAABAAIAAAITAAMAAAABAAEAAAAAAAD/2wBDAP//////////////////////////////' + '////////////////////////////////////////////////////////wAALCAABAAIBASIA' + '/8QAJgABAAAAAAAAAAAAAAAAAAAAAxABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQAAPwBH/9k=';
  var isApplied;

  var isBrowserApplyExif = function isBrowserApplyExif() {
    var df = $__default['default'].Deferred();

    if (isApplied !== undefined) {
      df.resolve(isApplied);
    } else {
      var image = new window.Image();

      image.onload = function () {
        isApplied = image.naturalWidth < image.naturalHeight;
        image.src = '//:0';
        df.resolve(isApplied);
      };

      image.src = testImageSrc;
    }

    return df.promise();
  };

  var resizeCanvas = function resizeCanvas(img, w, h) {
    var df = $__default['default'].Deferred();
    defer(function () {
      try {
        var canvas = document.createElement('canvas');
        var cx = canvas.getContext('2d');
        canvas.width = w;
        canvas.height = h;
        cx.imageSmoothingQuality = 'high';
        cx.drawImage(img, 0, 0, w, h);
        img.src = '//:0'; // for image

        img.width = img.height = 1; // for canvas

        df.resolve(canvas);
      } catch (e) {
        log("Failed to shrink image to size ".concat(w, "x").concat(h, "."), e);
        df.reject(e);
      }
    });
    return df.promise();
  };
  /**
   * Goes from target to source by step, the last incomplete step is dropped.
   * Always returns at least one step - target. Source step is not included.
   * Sorted descending.
   *
   * Example with step = 0.71, source = 2000, target = 400
   * 400 (target) <- 563 <- 793 <- 1117 <- 1574 (dropped) <- [2000 (source)]
   */


  var calcShrinkSteps = function calcShrinkSteps(sourceW, targetW, targetH, step) {
    var steps = [];
    var sW = targetW;
    var sH = targetH; // result should include at least one target step,
    // even if abs(source - target) < step * source
    // just to be sure nothing will break
    // if the original resolution / target resolution condition changes

    do {
      steps.push([sW, sH]);
      sW = Math.round(sW / step);
      sH = Math.round(sH / step);
    } while (sW < sourceW * step);

    return steps.reverse();
  };
  /**
   * Fallback resampling algorithm
   *
   * Reduces dimensions by step until reaches target dimensions,
   * this gives a better output quality than one-step method
   *
   * Target dimensions expected to be supported by browser,
   * unsupported steps will be dropped.
   */


  var runFallback = function runFallback(img, sourceW, targetW, targetH, step) {
    var steps = calcShrinkSteps(sourceW, targetW, targetH, step);
    var seriesDf = $__default['default'].Deferred();
    var chainedDf = $__default['default'].Deferred();
    chainedDf.resolve(img);

    var _iterator = _createForOfIteratorHelper(steps),
        _step;

    try {
      var _loop = function _loop() {
        var _step$value = _slicedToArray(_step.value, 2),
            w = _step$value[0],
            h = _step$value[1];

        chainedDf = chainedDf.then(function (canvas) {
          var df = $__default['default'].Deferred();
          testCanvasSize(w, h).then(function () {
            return df.resolve(canvas, false);
          }).fail(function () {
            return df.resolve(canvas, true);
          });
          return df.promise();
        }).then(function (canvas, skip) {
          return skip ? canvas : resizeCanvas(canvas, w, h);
        }).then(function (canvas) {
          seriesDf.notify((sourceW - w) / (sourceW - targetW));
          return canvas;
        });
      };

      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        _loop();
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }

    chainedDf.done(function (canvas) {
      seriesDf.resolve(canvas);
    });
    chainedDf.fail(function (error) {
      seriesDf.reject(error);
    });
    return seriesDf.promise();
  };
  /**
   * Native high-quality canvas resampling
   *
   * Browser support: https://caniuse.com/mdn-api_canvasrenderingcontext2d_imagesmoothingenabled
   * Target dimensions expected to be supported by browser.
   */


  var runNative = function runNative(img, targetW, targetH) {
    return resizeCanvas(img, targetW, targetH);
  };

  var shrinkImage = function shrinkImage(img, settings) {
    // in -> image
    // out <- canvas
    var df = $__default['default'].Deferred(); // do not shrink image if original resolution / target resolution ratio falls behind 2.0

    var STEP = 0.71; // should be > sqrt(0.5)

    if (img.width * STEP * img.height * STEP < settings.size) {
      return df.reject('not required');
    }

    var sourceW = img.width;
    var sourceH = img.height;
    var ratio = sourceW / sourceH; // target size shouldn't be greater than settings.size in any case

    var targetW = Math.floor(Math.sqrt(settings.size * ratio));
    var targetH = Math.floor(settings.size / Math.sqrt(settings.size * ratio)); // we test the last step because we can skip all intermediate steps

    testCanvasSize(targetW, targetH).fail(function () {
      df.reject('not supported');
    }).then(function () {
      var cx = document.createElement('canvas').getContext('2d');
      var supportNative = ('imageSmoothingQuality' in cx); // native scaling on ios gives blurry results

      var useNativeScaling = supportNative && !iOSVersion && !isIpadOs;
      var task = useNativeScaling ? runNative(img, targetW, targetH) : runFallback(img, sourceW, targetW, targetH, STEP);
      task.done(function (canvas) {
        return df.resolve(canvas);
      }).progress(function (progress) {
        return df.notify(progress);
      }).fail(function () {
        return df.reject('not supported');
      });
    });
    return df.promise();
  };

  var DataView = isWindowDefined() && window.DataView;
  var runner = taskRunner(1);

  var shrinkFile = function shrinkFile(file, settings) {
    var df; // in -> file
    // out <- blob

    df = $__default['default'].Deferred();

    if (!(URL && DataView && Blob)) {
      return df.reject('support');
    } // start = new Date()


    runner(function (release) {
      var op; // console.log('delayed: ' + (new Date() - start))

      df.always(release); // start = new Date()

      op = imageLoader(URL.createObjectURL(file));
      op.always(function (img) {
        return URL.revokeObjectURL(img.src);
      });
      op.fail(function () {
        return df.reject('not image');
      });
      return op.done(function (img) {
        // console.log('load: ' + (new Date() - start))
        df.notify(0.1);
        var exifOp = $__default['default'].when(getExif(file), isBrowserApplyExif()).always(function (exif, isExifApplied) {
          var e, isJPEG;
          df.notify(0.2);
          isJPEG = exifOp.state() === 'resolved'; // start = new Date()

          op = shrinkImage(img, settings);
          op.progress(function (progress) {
            return df.notify(0.2 + progress * 0.6);
          });
          op.fail(df.reject);
          op.done(function (canvas) {
            var format, quality; // console.log('shrink: ' + (new Date() - start))
            // start = new Date()

            format = 'image/jpeg';
            quality = settings.quality || 0.8;

            if (!isJPEG && hasTransparency(canvas)) {
              format = 'image/png';
              quality = undefined;
            }

            return canvasToBlob(canvas, format, quality, function (blob) {
              canvas.width = canvas.height = 1;
              df.notify(0.9); // console.log('to blob: ' + (new Date() - start))

              if (exif) {
                if (isExifApplied) {
                  setExifOrientation(exif, 1);
                }

                op = replaceJpegChunk(blob, 0xe1, [exif.buffer]);
                op.done(df.resolve);
                return op.fail(function () {
                  return df.resolve(blob);
                });
              } else {
                return df.resolve(blob);
              }
            });
          });
          e = null; // free reference

          return e;
        });
        return exifOp;
      });
    });
    return df.promise();
  };

  var drawFileToCanvas = function drawFileToCanvas(file, mW, mH, bg, maxSource) {
    var df, op; // in -> file
    // out <- canvas

    df = $__default['default'].Deferred();

    if (!URL) {
      return df.reject('support');
    }

    op = imageLoader(URL.createObjectURL(file));
    op.always(function (img) {
      return URL.revokeObjectURL(img.src);
    });
    op.fail(function () {
      return df.reject('not image');
    });
    op.done(function (img) {
      df.always(function () {
        img.src = '//:0';
      });

      if (maxSource && img.width * img.height > maxSource) {
        return df.reject('max source');
      }

      return $__default['default'].when(getExif(file), isBrowserApplyExif()).always(function (exif, isExifApplied) {
        var orientation = isExifApplied ? 1 : parseExifOrientation(exif) || 1;
        var swap = orientation > 4;
        var sSize = swap ? [img.height, img.width] : [img.width, img.height];

        var _fitSize = fitSize(sSize, [mW, mH]),
            _fitSize2 = _slicedToArray(_fitSize, 2),
            dW = _fitSize2[0],
            dH = _fitSize2[1];

        var trns = [[1, 0, 0, 1, 0, 0], [-1, 0, 0, 1, dW, 0], [-1, 0, 0, -1, dW, dH], [1, 0, 0, -1, 0, dH], [0, 1, 1, 0, 0, 0], [0, 1, -1, 0, dW, 0], [0, -1, -1, 0, dW, dH], [0, -1, 1, 0, 0, dH]][orientation - 1];

        if (!trns) {
          return df.reject('bad image');
        }

        var canvas = document.createElement('canvas');
        canvas.width = dW;
        canvas.height = dH;
        var ctx = canvas.getContext('2d');
        ctx.transform.apply(ctx, trns);

        if (swap) {
          var _ref = [dH, dW];
          dW = _ref[0];
          dH = _ref[1];
        }

        if (bg) {
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, dW, dH);
        }

        ctx.drawImage(img, 0, 0, dW, dH);
        return df.resolve(canvas, sSize);
      });
    });
    return df.promise();
  }; // Util functions


  var readJpegChunks = function readJpegChunks(file) {
    var df, pos, readNext, readNextChunk, readToView;

    readToView = function readToView(file, cb) {
      var reader;
      reader = new FileReader();

      reader.onload = function () {
        return cb(new DataView(reader.result));
      };

      reader.onerror = function (e) {
        return df.reject('reader', e);
      };

      return reader.readAsArrayBuffer(file);
    };

    readNext = function readNext() {
      return readToView(file.slice(pos, pos + 128), function (view) {
        var i, j, ref;

        for (i = j = 0, ref = view.byteLength; ref >= 0 ? j < ref : j > ref; i = ref >= 0 ? ++j : --j) {
          if (view.getUint8(i) === 0xff) {
            pos += i;
            break;
          }
        }

        return readNextChunk();
      });
    };

    readNextChunk = function readNextChunk() {
      var startPos;
      startPos = pos; // todo fix
      // eslint-disable-next-line no-return-assign

      return readToView(file.slice(pos, pos += 4), function (view) {
        var length, marker;

        if (view.byteLength !== 4 || view.getUint8(0) !== 0xff) {
          return df.reject('corrupted');
        }

        marker = view.getUint8(1);

        if (marker === 0xda) {
          // Start Of Scan
          // console.log('read jpeg chunks: ' + (new Date() - start))
          return df.resolve();
        }

        length = view.getUint16(2) - 2; // eslint-disable-next-line no-return-assign

        return readToView(file.slice(pos, pos += length), function (view) {
          if (view.byteLength !== length) {
            return df.reject('corrupted');
          }

          df.notify(startPos, length, marker, view);
          return readNext();
        });
      });
    };

    df = $__default['default'].Deferred();

    if (!(FileReader && DataView)) {
      return df.reject('support');
    } // start = new Date()


    pos = 2;
    readToView(file.slice(0, 2), function (view) {
      if (view.getUint16(0) !== 0xffd8) {
        return df.reject('not jpeg');
      }

      return readNext();
    });
    return df.promise();
  };

  var replaceJpegChunk = function replaceJpegChunk(blob, marker, chunks) {
    var df, oldChunkLength, oldChunkPos, op;
    df = $__default['default'].Deferred();
    oldChunkPos = [];
    oldChunkLength = [];
    op = readJpegChunks(blob);
    op.fail(df.reject);
    op.progress(function (pos, length, oldMarker) {
      if (oldMarker === marker) {
        oldChunkPos.push(pos);
        return oldChunkLength.push(length);
      }
    });
    op.done(function () {
      var chunk, i, intro, j, k, len, newChunks, pos, ref;
      newChunks = [blob.slice(0, 2)];

      for (j = 0, len = chunks.length; j < len; j++) {
        chunk = chunks[j];
        intro = new DataView(new ArrayBuffer(4));
        intro.setUint16(0, 0xff00 + marker);
        intro.setUint16(2, chunk.byteLength + 2);
        newChunks.push(intro.buffer);
        newChunks.push(chunk);
      }

      pos = 2;

      for (i = k = 0, ref = oldChunkPos.length; ref >= 0 ? k < ref : k > ref; i = ref >= 0 ? ++k : --k) {
        if (oldChunkPos[i] > pos) {
          newChunks.push(blob.slice(pos, oldChunkPos[i]));
        }

        pos = oldChunkPos[i] + oldChunkLength[i] + 4;
      }

      newChunks.push(blob.slice(pos, blob.size));
      return df.resolve(new Blob(newChunks, {
        type: blob.type
      }));
    });
    return df.promise();
  };

  var getExif = function getExif(file) {
    var exif, op;
    exif = null;
    op = readJpegChunks(file);
    op.progress(function (pos, l, marker, view) {
      if (!exif && marker === 0xe1) {
        if (view.byteLength >= 14) {
          if (view.getUint32(0) === 0x45786966 && view.getUint16(4) === 0) {
            exif = view;
            return exif;
          }
        }
      }
    });
    return op.then(function () {
      return exif;
    }, function (reason) {
      return $__default['default'].Deferred().reject(exif, reason);
    });
  };

  var setExifOrientation = function setExifOrientation(exif, orientation) {
    findExifOrientation(exif, function (offset, little) {
      return exif.setUint16(offset, orientation, little);
    });
  };

  var parseExifOrientation = function parseExifOrientation(exif) {
    return findExifOrientation(exif, function (offset, little) {
      return exif.getUint16(offset, little);
    });
  };

  var findExifOrientation = function findExifOrientation(exif, exifCallback) {
    var count, j, little, offset, ref;

    if (!exif || exif.byteLength < 14 || exif.getUint32(0) !== 0x45786966 || exif.getUint16(4) !== 0) {
      return null;
    }

    if (exif.getUint16(6) === 0x4949) {
      little = true;
    } else if (exif.getUint16(6) === 0x4d4d) {
      little = false;
    } else {
      return null;
    }

    if (exif.getUint16(8, little) !== 0x002a) {
      return null;
    }

    offset = 8 + exif.getUint32(10, little);
    count = exif.getUint16(offset - 2, little);

    for (j = 0, ref = count; ref >= 0 ? j < ref : j > ref; ref >= 0 ? ++j : --j) {
      if (exif.byteLength < offset + 10) {
        return null;
      }

      if (exif.getUint16(offset, little) === 0x0112) {
        return exifCallback(offset + 8, little);
      }

      offset += 12;
    }

    return null;
  };

  var hasTransparency = function hasTransparency(img) {
    var canvas, ctx, data, i, j, pcsn, ref;
    pcsn = 50;
    canvas = document.createElement('canvas');
    canvas.width = canvas.height = pcsn;
    ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, pcsn, pcsn);
    data = ctx.getImageData(0, 0, pcsn, pcsn).data;
    canvas.width = canvas.height = 1;

    for (i = j = 3, ref = data.length; j < ref; i = j += 4) {
      if (data[i] < 254) {
        return true;
      }
    }

    return false;
  }; // progressState: one of 'error', 'ready', 'uploading', 'uploaded'
  // internal api
  //   __notifyApi: file upload in progress
  //   __resolveApi: file is ready
  //   __rejectApi: file failed on any stage
  //   __completeUpload: file uploaded, info required


  var BaseFile = /*#__PURE__*/function () {
    function BaseFile(param, settings1) {
      var sourceInfo = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _classCallCheck(this, BaseFile);

      var base;
      this.settings = settings1;
      this.sourceInfo = sourceInfo;
      this.fileId = null;
      this.fileName = null;
      this.sanitizedName = null;
      this.fileSize = null;
      this.isStored = null;
      this.cdnUrlModifiers = null;
      this.isImage = null;
      this.imageInfo = null;
      this.mimeType = null;
      this.s3Bucket = null;
      (base = this.sourceInfo).source || (base.source = this.sourceName);

      this.__setupValidation();

      this.__initApi();
    }

    _createClass(BaseFile, [{
      key: "__startUpload",
      value: function __startUpload() {
        return $__default['default'].Deferred().resolve();
      }
    }, {
      key: "__completeUpload",
      value: function __completeUpload() {
        var _this = this;

        var _check, logger, ncalls, timeout; // Update info until @apiDeferred resolved.


        ncalls = 0;

        if (this.settings.debugUploads) {
          debug('Load file info.', this.fileId, this.settings.publicKey);
          logger = setInterval(function () {
            return debug('Still waiting for file ready.', ncalls, _this.fileId, _this.settings.publicKey);
          }, 5000);
          this.apiDeferred.done(function () {
            return debug('File uploaded.', ncalls, _this.fileId, _this.settings.publicKey);
          }).always(function () {
            return clearInterval(logger);
          });
        }

        timeout = 100;
        return (_check = function check() {
          if (_this.apiDeferred.state() === 'pending') {
            ncalls += 1;
            return _this.__updateInfo().done(function () {
              setTimeout(_check, timeout);
              timeout += 50;
              return timeout;
            });
          }
        })();
      }
    }, {
      key: "__updateInfo",
      value: function __updateInfo() {
        var _this2 = this;

        return jsonp("".concat(this.settings.urlBase, "/info/"), 'GET', {
          jsonerrors: 1,
          file_id: this.fileId,
          pub_key: this.settings.publicKey,
          // Assume that we have all other info if isImage is set to something
          // other than null and we only waiting for is_ready flag.
          wait_is_ready: +(this.isImage === null)
        }, {
          headers: {
            'X-UC-User-Agent': this.settings._userAgent
          }
        }).fail(function (error) {
          if (_this2.settings.debugUploads) {
            log("Can't load file info. Probably removed.", _this2.fileId, _this2.settings.publicKey, error.message);
          }

          return _this2.__rejectApi('info', error);
        }).done(this.__handleFileData.bind(this));
      }
    }, {
      key: "__handleFileData",
      value: function __handleFileData(data) {
        this.fileName = data.original_filename;
        this.sanitizedName = data.filename;
        this.fileSize = data.size;
        this.isImage = data.is_image;
        this.imageInfo = data.image_info;
        this.mimeType = data.mime_type;
        this.isStored = data.is_stored;
        this.s3Bucket = data.s3_bucket;

        if (data.default_effects) {
          this.cdnUrlModifiers = '-/' + data.default_effects;
        }

        if (this.s3Bucket && this.cdnUrlModifiers) {
          this.__rejectApi('baddata');
        }

        this.__runValidators();

        if (data.is_ready) {
          return this.__resolveApi();
        }
      } // Retrieve info

    }, {
      key: "__progressInfo",
      value: function __progressInfo() {
        var ref;
        return {
          state: this.__progressState,
          uploadProgress: this.__progress,
          progress: (ref = this.__progressState) === 'ready' || ref === 'error' ? 1 : this.__progress * 0.9,
          incompleteFileInfo: this.__fileInfo()
        };
      }
    }, {
      key: "__fileInfo",
      value: function __fileInfo() {
        var urlBase;

        if (this.s3Bucket) {
          urlBase = "https://".concat(this.s3Bucket, ".s3.amazonaws.com/").concat(this.fileId, "/").concat(this.sanitizedName);
        } else {
          urlBase = "".concat(this.settings.cdnBase, "/").concat(this.fileId, "/");
        }

        return {
          uuid: this.fileId,
          name: this.fileName,
          size: this.fileSize,
          isStored: this.isStored,
          isImage: !this.s3Bucket && this.isImage,
          originalImageInfo: this.imageInfo,
          mimeType: this.mimeType,
          originalUrl: this.fileId ? urlBase : null,
          cdnUrl: this.fileId ? "".concat(urlBase).concat(this.cdnUrlModifiers || '') : null,
          cdnUrlModifiers: this.cdnUrlModifiers,
          sourceInfo: this.sourceInfo
        };
      } // Validators

    }, {
      key: "__setupValidation",
      value: function __setupValidation() {
        this.validators = this.settings.validators || this.settings.__validators || [];

        if (this.settings.imagesOnly) {
          return this.validators.push(function (info) {
            if (info.isImage === false) {
              throw new Error('image');
            }
          });
        }
      }
    }, {
      key: "__runValidators",
      value: function __runValidators() {
        var err, i, info, len, ref, results, v;
        info = this.__fileInfo();

        try {
          ref = this.validators;
          results = [];

          for (i = 0, len = ref.length; i < len; i++) {
            v = ref[i];
            results.push(v(info));
          }

          return results;
        } catch (error) {
          err = error;
          return this.__rejectApi(err.message);
        }
      } // Internal API control

    }, {
      key: "__initApi",
      value: function __initApi() {
        this.apiDeferred = $__default['default'].Deferred();
        this.__progressState = 'uploading';
        this.__progress = 0;
        return this.__notifyApi();
      }
    }, {
      key: "__notifyApi",
      value: function __notifyApi() {
        return this.apiDeferred.notify(this.__progressInfo());
      }
    }, {
      key: "__rejectApi",
      value: function __rejectApi(errorType, err) {
        this.__progressState = 'error';

        this.__notifyApi();

        return this.apiDeferred.reject(errorType, this.__fileInfo(), err);
      }
    }, {
      key: "__resolveApi",
      value: function __resolveApi() {
        this.__progressState = 'ready';

        this.__notifyApi();

        return this.apiDeferred.resolve(this.__fileInfo());
      }
    }, {
      key: "__cancel",
      value: function __cancel() {
        return this.__rejectApi('user');
      }
    }, {
      key: "__extendApi",
      value: function __extendApi(api) {
        var _this3 = this;

        api.cancel = this.__cancel.bind(this);

        api.pipe = api.then = function () {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          } // 'pipe' is alias to 'then' from jQuery 1.8


          return _this3.__extendApi(fixedPipe.apply(void 0, [api].concat(args)));
        };

        return api; // extended promise
      }
    }, {
      key: "promise",
      value: function promise() {
        var _this4 = this;

        var op;

        if (!this.__apiPromise) {
          this.__apiPromise = this.__extendApi(this.apiDeferred.promise());

          this.__runValidators();

          if (this.apiDeferred.state() === 'pending') {
            op = this.__startUpload();
            op.done(function () {
              _this4.__progressState = 'uploaded';
              _this4.__progress = 1;

              _this4.__notifyApi();

              return _this4.__completeUpload();
            });
            op.progress(function (progress) {
              if (progress > _this4.__progress) {
                _this4.__progress = progress;
                return _this4.__notifyApi();
              }
            });
            op.fail(function (error) {
              return _this4.__rejectApi('upload', error);
            });
            this.apiDeferred.always(op.reject);
          }
        }

        return this.__apiPromise;
      }
    }]);

    return BaseFile;
  }();

  var _directRunner = null;

  var ObjectFile = /*#__PURE__*/function (_BaseFile) {
    _inherits(ObjectFile, _BaseFile);

    var _super = _createSuper(ObjectFile);

    function ObjectFile(__file) {
      var _this;

      _classCallCheck(this, ObjectFile);

      _this = _super.apply(this, arguments);
      _this.__file = __file;
      _this.fileName = _this.__file.name || 'original';

      _this.__notifyApi();

      return _this;
    }

    _createClass(ObjectFile, [{
      key: "setFile",
      value: function setFile(file) {
        if (file) {
          this.__file = file;
        }

        this.sourceInfo.file = this.__file;

        if (!this.__file) {
          return;
        }

        this.fileSize = this.__file.size;
        this.fileType = this.__file.type || 'application/octet-stream';

        if (this.settings.debugUploads) {
          debug('Use local file.', this.fileName, this.fileType, this.fileSize);
        }

        this.__runValidators();

        return this.__notifyApi();
      }
    }, {
      key: "__startUpload",
      value: function __startUpload() {
        var _this2 = this;

        var df, ios, resizeShare;
        this.apiDeferred.always(function () {
          _this2.__file = null;
          return _this2.__file;
        });

        if (this.__file.size >= this.settings.multipartMinSize && Blob) {
          this.setFile();
          return this.multipartUpload();
        }

        ios = iOSVersion;

        if (!this.settings.imageShrink || ios && ios < 8) {
          this.setFile();
          return this.directUpload();
        } // if @settings.imageShrink


        df = $__default['default'].Deferred();
        resizeShare = 0.4;
        shrinkFile(this.__file, this.settings.imageShrink).progress(function (progress) {
          return df.notify(progress * resizeShare);
        }).done(this.setFile.bind(this)).fail(function () {
          _this2.setFile();

          resizeShare = resizeShare * 0.1;
          return resizeShare;
        }).always(function () {
          df.notify(resizeShare);
          return _this2.directUpload().done(df.resolve).fail(df.reject).progress(function (progress) {
            return df.notify(resizeShare + progress * (1 - resizeShare));
          });
        });
        return df;
      }
    }, {
      key: "__autoAbort",
      value: function __autoAbort(xhr) {
        this.apiDeferred.fail(xhr.abort);
        return xhr;
      }
    }, {
      key: "directRunner",
      value: function directRunner(task) {
        if (!_directRunner) {
          _directRunner = taskRunner(this.settings.parallelDirectUploads);
        }

        return _directRunner(task);
      }
    }, {
      key: "directUpload",
      value: function directUpload() {
        var _this3 = this;

        var df;
        df = $__default['default'].Deferred();

        if (!this.__file) {
          this.__rejectApi('baddata');

          return df;
        }

        if (this.fileSize > 100 * 1024 * 1024) {
          this.__rejectApi('size');

          return df;
        }

        this.directRunner(function (release) {
          var formData;
          df.always(release);

          if (_this3.apiDeferred.state() !== 'pending') {
            return;
          }

          formData = new window.FormData();
          formData.append('UPLOADCARE_PUB_KEY', _this3.settings.publicKey);
          formData.append('signature', _this3.settings.secureSignature);
          formData.append('expire', _this3.settings.secureExpire);
          formData.append('UPLOADCARE_STORE', _this3.settings.doNotStore ? '' : 'auto');
          formData.append('file', _this3.__file, _this3.fileName);
          formData.append('file_name', _this3.fileName);
          formData.append('source', _this3.sourceInfo.source);
          return _this3.__autoAbort($__default['default'].ajax({
            xhr: function xhr() {
              var xhr; // Naked XHR for progress tracking

              xhr = $__default['default'].ajaxSettings.xhr();

              if (xhr.upload) {
                xhr.upload.addEventListener('progress', function (e) {
                  return df.notify(e.loaded / e.total);
                }, false);
              }

              return xhr;
            },
            crossDomain: true,
            type: 'POST',
            url: "".concat(_this3.settings.urlBase, "/base/?jsonerrors=1"),
            headers: {
              'X-UC-User-Agent': _this3.settings._userAgent
            },
            contentType: false,
            // For correct boundary string
            processData: false,
            data: formData,
            dataType: 'json',
            error: df.reject,
            success: function success(data) {
              if (data != null ? data.file : undefined) {
                _this3.fileId = data.file;
                return df.resolve();
              } else if (data.error) {
                var _data$error = data.error,
                    message = _data$error.content,
                    code = _data$error.error_code;
                return df.reject({
                  message: message,
                  code: code
                });
              } else {
                return df.reject();
              }
            }
          }));
        });
        return df;
      }
    }, {
      key: "multipartUpload",
      value: function multipartUpload() {
        var _this4 = this;

        var df;
        df = $__default['default'].Deferred();

        if (!this.__file) {
          return df;
        }

        this.multipartStart().done(function (data) {
          return _this4.uploadParts(data.parts, data.uuid).done(function () {
            return _this4.multipartComplete(data.uuid).done(function (data) {
              _this4.fileId = data.uuid;

              _this4.__handleFileData(data);

              return df.resolve();
            }).fail(df.reject);
          }).progress(df.notify).fail(df.reject);
        }).fail(df.reject);
        return df;
      }
    }, {
      key: "multipartStart",
      value: function multipartStart() {
        var _this5 = this;

        var data;
        data = {
          UPLOADCARE_PUB_KEY: this.settings.publicKey,
          signature: this.settings.secureSignature,
          expire: this.settings.secureExpire,
          filename: this.fileName,
          source: this.sourceInfo.source,
          size: this.fileSize,
          content_type: this.fileType,
          part_size: this.settings.multipartPartSize,
          UPLOADCARE_STORE: this.settings.doNotStore ? '' : 'auto'
        };
        return this.__autoAbort(jsonp("".concat(this.settings.urlBase, "/multipart/start/?jsonerrors=1"), 'POST', data, {
          headers: {
            'X-UC-User-Agent': this.settings._userAgent
          }
        })).fail(function (error) {
          if (_this5.settings.debugUploads) {
            return log("Can't start multipart upload.", error.message, data);
          }
        });
      }
    }, {
      key: "uploadParts",
      value: function uploadParts(parts, uuid) {
        var _this6 = this;

        var df, inProgress, j, lastUpdate, progress, ref1, _submit, submittedBytes, submittedParts, updateProgress;

        progress = [];
        lastUpdate = Date.now();

        updateProgress = function updateProgress(i, loaded) {
          var j, len, total;
          progress[i] = loaded;

          if (Date.now() - lastUpdate < 250) {
            return;
          }

          lastUpdate = Date.now();
          total = 0;

          for (j = 0, len = progress.length; j < len; j++) {
            loaded = progress[j];
            total += loaded;
          }

          return df.notify(total / _this6.fileSize);
        };

        df = $__default['default'].Deferred();
        inProgress = 0;
        submittedParts = 0;
        submittedBytes = 0;

        _submit = function submit() {
          var attempts, blob, bytesToSubmit, partNo, _retry;

          if (submittedBytes >= _this6.fileSize) {
            return;
          }

          bytesToSubmit = submittedBytes + _this6.settings.multipartPartSize;

          if (_this6.fileSize < bytesToSubmit + _this6.settings.multipartMinLastPartSize) {
            bytesToSubmit = _this6.fileSize;
          }

          blob = _this6.__file.slice(submittedBytes, bytesToSubmit);
          submittedBytes = bytesToSubmit;
          partNo = submittedParts;
          inProgress += 1;
          submittedParts += 1;
          attempts = 0;
          return (_retry = function retry() {
            if (_this6.apiDeferred.state() !== 'pending') {
              return;
            }

            progress[partNo] = 0;
            return _this6.__autoAbort($__default['default'].ajax({
              xhr: function xhr() {
                var xhr; // Naked XHR for progress tracking

                xhr = $__default['default'].ajaxSettings.xhr();
                xhr.responseType = 'text';

                if (xhr.upload) {
                  xhr.upload.addEventListener('progress', function (e) {
                    return updateProgress(partNo, e.loaded);
                  }, false);
                }

                return xhr;
              },
              url: parts[partNo],
              crossDomain: true,
              type: 'PUT',
              processData: false,
              contentType: _this6.fileType,
              data: blob,
              error: function error() {
                attempts += 1;

                if (attempts > _this6.settings.multipartMaxAttempts) {
                  if (_this6.settings.debugUploads) {
                    log("Part #".concat(partNo, " and file upload is failed."), uuid);
                  }

                  return df.reject();
                } else {
                  if (_this6.settings.debugUploads) {
                    debug("Part #".concat(partNo, "(").concat(attempts, ") upload is failed."), uuid);
                  }

                  return _retry();
                }
              },
              success: function success() {
                inProgress -= 1;

                _submit();

                if (!inProgress) {
                  return df.resolve();
                }
              }
            }));
          })();
        };

        for (j = 0, ref1 = this.settings.multipartConcurrency; ref1 >= 0 ? j < ref1 : j > ref1; ref1 >= 0 ? ++j : --j) {
          _submit();
        }

        return df;
      }
    }, {
      key: "multipartComplete",
      value: function multipartComplete(uuid) {
        var _this7 = this;

        var data;
        data = {
          UPLOADCARE_PUB_KEY: this.settings.publicKey,
          uuid: uuid
        };
        return this.__autoAbort(jsonp("".concat(this.settings.urlBase, "/multipart/complete/?jsonerrors=1"), 'POST', data, {
          headers: {
            'X-UC-User-Agent': this.settings._userAgent
          }
        })).fail(function (error) {
          if (_this7.settings.debugUploads) {
            return log("Can't complete multipart upload.", uuid, _this7.settings.publicKey, error.message);
          }
        });
      }
    }]);

    return ObjectFile;
  }(BaseFile);

  ObjectFile.prototype.sourceName = 'local';

  var InputFile = /*#__PURE__*/function (_BaseFile) {
    _inherits(InputFile, _BaseFile);

    var _super = _createSuper(InputFile);

    function InputFile(__input) {
      var _this;

      _classCallCheck(this, InputFile);

      _this = _super.apply(this, arguments);
      _this.__input = __input;
      _this.fileId = uuid();
      _this.fileName = $__default['default'](_this.__input).val().split('\\').pop();

      _this.__notifyApi();

      return _this;
    }

    _createClass(InputFile, [{
      key: "__startUpload",
      value: function __startUpload() {
        var df, formParam, iframeId, targetUrl;
        df = $__default['default'].Deferred();
        targetUrl = "".concat(this.settings.urlBase, "/iframe/");
        iframeId = "uploadcare--iframe-".concat(this.fileId);
        this.__iframe = $__default['default']('<iframe>').attr({
          id: iframeId,
          name: iframeId
        }).css('display', 'none').appendTo('body').on('load', df.resolve).on('error', df.reject);

        formParam = function formParam(name, value) {
          return $__default['default']('<input/>', {
            type: 'hidden',
            name: name,
            value: value
          });
        };

        $__default['default'](this.__input).attr('name', 'file');
        this.__iframeForm = $__default['default']('<form>').attr({
          method: 'POST',
          action: targetUrl,
          enctype: 'multipart/form-data',
          target: iframeId
        }).append(formParam('UPLOADCARE_PUB_KEY', this.settings.publicKey)).append(formParam('UPLOADCARE_SIGNATURE', this.settings.secureSignature)).append(formParam('UPLOADCARE_EXPIRE', this.settings.secureExpire)).append(formParam('UPLOADCARE_FILE_ID', this.fileId)).append(formParam('UPLOADCARE_STORE', this.settings.doNotStore ? '' : 'auto')).append(formParam('UPLOADCARE_SOURCE', this.sourceInfo.source)).append(this.__input).css('display', 'none').appendTo('body').submit();
        return df.always(this.__cleanUp.bind(this));
      }
    }, {
      key: "__cleanUp",
      value: function __cleanUp() {
        var ref1, ref2;

        if ((ref1 = this.__iframe) != null) {
          ref1.off('load error').remove();
        }

        if ((ref2 = this.__iframeForm) != null) {
          ref2.remove();
        }

        this.__iframe = null;
        this.__iframeForm = null;
        return this.__iframeForm;
      }
    }]);

    return InputFile;
  }(BaseFile);

  InputFile.prototype.sourceName = 'local-compat';

  function createCommonjsModule(fn, module) {
    return module = {
      exports: {}
    }, fn(module, module.exports), module.exports;
  }

  var pusher = createCommonjsModule(function (module, exports) {
    // changed:
    //   Pusher.dependency_suffix = '.min'; (was '')
    //   window.WEB_SOCKET_SWF_LOCATION = "https://s3.amazonaws.com/uploadcare-static/WebSocketMainInsecure.swf"

    /*!
     * Pusher JavaScript Library v1.12.2
     * http://pusherapp.com/
     *
     * Copyright 2011, Pusher
     * Released under the MIT licence.
     */
    var isWindowDefined = isWindowDefined$1.isWindowDefined;
    (function () {
      var _Pusher, _require;

      (function () {
        _Pusher = function Pusher(app_key, options) {
          this.options = options || {};
          this.key = app_key;
          this.channels = new _Pusher.Channels();
          this.global_emitter = new _Pusher.EventsDispatcher();
          var self = this;
          this.checkAppKey();
          this.connection = new _Pusher.Connection(this.key, this.options); // Setup / teardown connection

          this.connection.bind('connected', function () {
            self.subscribeAll();
          }).bind('message', function (params) {
            var internal = params.event.indexOf('pusher_internal:') === 0;

            if (params.channel) {
              var channel;

              if (channel = self.channel(params.channel)) {
                channel.emit(params.event, params.data);
              }
            } // Emit globaly [deprecated]


            if (!internal) self.global_emitter.emit(params.event, params.data);
          }).bind('disconnected', function () {
            self.channels.disconnect();
          }).bind('error', function (err) {
            _Pusher.warn('Error', err);
          });

          _Pusher.instances.push(this);

          if (_Pusher.isReady) self.connect();
        };

        _Pusher.instances = [];
        _Pusher.prototype = {
          channel: function channel(name) {
            return this.channels.find(name);
          },
          connect: function connect() {
            this.connection.connect();
          },
          disconnect: function disconnect() {
            this.connection.disconnect();
          },
          bind: function bind(event_name, callback) {
            this.global_emitter.bind(event_name, callback);
            return this;
          },
          bind_all: function bind_all(callback) {
            this.global_emitter.bind_all(callback);
            return this;
          },
          subscribeAll: function subscribeAll() {
            var channelName;

            for (channelName in this.channels.channels) {
              if (this.channels.channels.hasOwnProperty(channelName)) {
                this.subscribe(channelName);
              }
            }
          },
          subscribe: function subscribe(channel_name) {
            var self = this;
            var channel = this.channels.add(channel_name, this);

            if (this.connection.state === 'connected') {
              channel.authorize(this.connection.socket_id, this.options, function (err, data) {
                if (err) {
                  channel.emit('pusher:subscription_error', data);
                } else {
                  self.send_event('pusher:subscribe', {
                    channel: channel_name,
                    auth: data.auth,
                    channel_data: data.channel_data
                  });
                }
              });
            }

            return channel;
          },
          unsubscribe: function unsubscribe(channel_name) {
            this.channels.remove(channel_name);

            if (this.connection.state === 'connected') {
              this.send_event('pusher:unsubscribe', {
                channel: channel_name
              });
            }
          },
          send_event: function send_event(event_name, data, channel) {
            return this.connection.send_event(event_name, data, channel);
          },
          checkAppKey: function checkAppKey() {
            if (this.key === null || this.key === undefined) {
              _Pusher.warn('Warning', 'You must pass your app key when you instantiate Pusher.');
            }
          }
        };
        _Pusher.Util = {
          extend: function extend(target, extensions) {
            for (var property in extensions) {
              if (extensions[property] && extensions[property].constructor && extensions[property].constructor === Object) {
                target[property] = extend(target[property] || {}, extensions[property]);
              } else {
                target[property] = extensions[property];
              }
            }

            return target;
          },
          stringify: function stringify() {
            var m = ["Pusher"];

            for (var i = 0; i < arguments.length; i++) {
              if (typeof arguments[i] === "string") {
                m.push(arguments[i]);
              } else {
                if (window['JSON'] == undefined) {
                  m.push(arguments[i].toString());
                } else {
                  m.push(JSON.stringify(arguments[i]));
                }
              }
            }

            return m.join(" : ");
          },
          arrayIndexOf: function arrayIndexOf(array, item) {
            // MSIE doesn't have array.indexOf
            var nativeIndexOf = Array.prototype.indexOf;
            if (array == null) return -1;
            if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item);

            for (i = 0, l = array.length; i < l; i++) {
              if (array[i] === item) return i;
            }

            return -1;
          }
        }; // To receive log output provide a Pusher.log function, for example
        // Pusher.log = function(m){console.log(m)}

        _Pusher.debug = function () {
          if (!_Pusher.log) return;

          _Pusher.log(_Pusher.Util.stringify.apply(this, arguments));
        };

        _Pusher.warn = function () {
          if (window.console && window.console.warn) {
            window.console.warn(_Pusher.Util.stringify.apply(this, arguments));
          } else {
            if (!_Pusher.log) return;

            _Pusher.log(_Pusher.Util.stringify.apply(this, arguments));
          }
        }; // Pusher defaults


        _Pusher.VERSION = '1.12.2';
        _Pusher.host = 'ws.pusherapp.com';
        _Pusher.ws_port = 80;
        _Pusher.wss_port = 443;
        _Pusher.channel_auth_endpoint = '/pusher/auth';
        _Pusher.cdn_http = 'http://js.pusher.com/';
        _Pusher.cdn_https = 'https://d3dy5gmtp8yhk7.cloudfront.net/';
        _Pusher.dependency_suffix = '.min';
        _Pusher.channel_auth_transport = 'ajax';
        _Pusher.activity_timeout = 120000;
        _Pusher.pong_timeout = 30000;
        _Pusher.isReady = false;

        _Pusher.ready = function () {
          _Pusher.isReady = true;

          for (var i = 0, l = _Pusher.instances.length; i < l; i++) {
            _Pusher.instances[i].connect();
          }
        };
      })();

      (function () {
        /* Abstract event binding
        Example:
        
            var MyEventEmitter = function(){};
            MyEventEmitter.prototype = new Pusher.EventsDispatcher;
        
            var emitter = new MyEventEmitter();
        
            // Bind to single event
            emitter.bind('foo_event', function(data){ alert(data)} );
        
            // Bind to all
            emitter.bind_all(function(eventName, data){ alert(data) });
        
        --------------------------------------------------------*/
        function CallbackRegistry() {
          this._callbacks = {};
        }

        CallbackRegistry.prototype.get = function (eventName) {
          return this._callbacks[this._prefix(eventName)];
        };

        CallbackRegistry.prototype.add = function (eventName, callback) {
          var prefixedEventName = this._prefix(eventName);

          this._callbacks[prefixedEventName] = this._callbacks[prefixedEventName] || [];

          this._callbacks[prefixedEventName].push(callback);
        };

        CallbackRegistry.prototype.remove = function (eventName, callback) {
          if (this.get(eventName)) {
            var index = _Pusher.Util.arrayIndexOf(this.get(eventName), callback);

            this._callbacks[this._prefix(eventName)].splice(index, 1);
          }
        };

        CallbackRegistry.prototype._prefix = function (eventName) {
          return "_" + eventName;
        };

        function EventsDispatcher(failThrough) {
          this.callbacks = new CallbackRegistry();
          this.global_callbacks = []; // Run this function when dispatching an event when no callbacks defined

          this.failThrough = failThrough;
        }

        EventsDispatcher.prototype.bind = function (eventName, callback) {
          this.callbacks.add(eventName, callback);
          return this; // chainable
        };

        EventsDispatcher.prototype.unbind = function (eventName, callback) {
          this.callbacks.remove(eventName, callback);
          return this;
        };

        EventsDispatcher.prototype.emit = function (eventName, data) {
          // Global callbacks
          for (var i = 0; i < this.global_callbacks.length; i++) {
            this.global_callbacks[i](eventName, data);
          } // Event callbacks


          var callbacks = this.callbacks.get(eventName);

          if (callbacks) {
            for (var i = 0; i < callbacks.length; i++) {
              callbacks[i](data);
            }
          } else if (this.failThrough) {
            this.failThrough(eventName, data);
          }

          return this;
        };

        EventsDispatcher.prototype.bind_all = function (callback) {
          this.global_callbacks.push(callback);
          return this;
        };

        _Pusher.EventsDispatcher = EventsDispatcher;
      })();

      (function () {
        /*-----------------------------------------------
          Helpers:
        -----------------------------------------------*/
        function capitalize(str) {
          return str.substr(0, 1).toUpperCase() + str.substr(1);
        }

        function safeCall(method, obj, data) {
          if (obj[method] !== undefined) {
            obj[method](data);
          }
        }
        /*-----------------------------------------------
          The State Machine
        -----------------------------------------------*/


        function Machine(initialState, transitions, stateActions) {
          _Pusher.EventsDispatcher.call(this);

          this.state = undefined;
          this.errors = []; // functions for each state

          this.stateActions = stateActions; // set up the transitions

          this.transitions = transitions;
          this.transition(initialState);
        }

        Machine.prototype.transition = function (nextState, data) {
          var prevState = this.state;
          var stateCallbacks = this.stateActions;

          if (prevState && _Pusher.Util.arrayIndexOf(this.transitions[prevState], nextState) == -1) {
            this.emit('invalid_transition_attempt', {
              oldState: prevState,
              newState: nextState
            });
            throw new Error('Invalid transition [' + prevState + ' to ' + nextState + ']');
          } // exit


          safeCall(prevState + 'Exit', stateCallbacks, data); // tween

          safeCall(prevState + 'To' + capitalize(nextState), stateCallbacks, data); // pre

          safeCall(nextState + 'Pre', stateCallbacks, data); // change state:

          this.state = nextState; // handy to bind to

          this.emit('state_change', {
            oldState: prevState,
            newState: nextState
          }); // Post:

          safeCall(nextState + 'Post', stateCallbacks, data);
        };

        Machine.prototype.is = function (state) {
          return this.state === state;
        };

        Machine.prototype.isNot = function (state) {
          return this.state !== state;
        };

        _Pusher.Util.extend(Machine.prototype, _Pusher.EventsDispatcher.prototype);

        _Pusher.Machine = Machine;
      })();

      (function () {
        /*
          A little bauble to interface with window.navigator.onLine,
          window.ononline and window.onoffline.  Easier to mock.
        */
        var NetInfo = function NetInfo() {
          var self = this;

          _Pusher.EventsDispatcher.call(this); // This is okay, as IE doesn't support this stuff anyway.


          if (window.addEventListener !== undefined) {
            window.addEventListener("online", function () {
              self.emit('online', null);
            }, false);
            window.addEventListener("offline", function () {
              self.emit('offline', null);
            }, false);
          }
        }; // Offline means definitely offline (no connection to router).
        // Inverse does NOT mean definitely online (only currently supported in Safari
        // and even there only means the device has a connection to the router).


        NetInfo.prototype.isOnLine = function () {
          if (window.navigator.onLine === undefined) {
            return true;
          } else {
            return window.navigator.onLine;
          }
        };

        _Pusher.Util.extend(NetInfo.prototype, _Pusher.EventsDispatcher.prototype);

        _Pusher.NetInfo = NetInfo;
      })();

      (function () {
        var machineTransitions = {
          'initialized': ['waiting', 'failed'],
          'waiting': ['connecting', 'permanentlyClosed'],
          'connecting': ['open', 'permanentlyClosing', 'impermanentlyClosing', 'waiting'],
          'open': ['connected', 'permanentlyClosing', 'impermanentlyClosing', 'waiting'],
          'connected': ['permanentlyClosing', 'waiting'],
          'impermanentlyClosing': ['waiting', 'permanentlyClosing'],
          'permanentlyClosing': ['permanentlyClosed'],
          'permanentlyClosed': ['waiting', 'failed'],
          'failed': ['permanentlyClosed']
        }; // Amount to add to time between connection attemtpts per failed attempt.

        var UNSUCCESSFUL_CONNECTION_ATTEMPT_ADDITIONAL_WAIT = 2000;
        var UNSUCCESSFUL_OPEN_ATTEMPT_ADDITIONAL_TIMEOUT = 2000;
        var UNSUCCESSFUL_CONNECTED_ATTEMPT_ADDITIONAL_TIMEOUT = 2000;
        var MAX_CONNECTION_ATTEMPT_WAIT = 5 * UNSUCCESSFUL_CONNECTION_ATTEMPT_ADDITIONAL_WAIT;
        var MAX_OPEN_ATTEMPT_TIMEOUT = 5 * UNSUCCESSFUL_OPEN_ATTEMPT_ADDITIONAL_TIMEOUT;
        var MAX_CONNECTED_ATTEMPT_TIMEOUT = 5 * UNSUCCESSFUL_CONNECTED_ATTEMPT_ADDITIONAL_TIMEOUT;

        function resetConnectionParameters(connection) {
          connection.connectionWait = 0;

          if (_Pusher.TransportType === 'flash') {
            // Flash needs a bit more time
            connection.openTimeout = 5000;
          } else {
            connection.openTimeout = 2000;
          }

          connection.connectedTimeout = 2000;
          connection.connectionSecure = connection.compulsorySecure;
          connection.connectionAttempts = 0;
        }

        function Connection(key, options) {
          var self = this;

          _Pusher.EventsDispatcher.call(this);

          this.options = _Pusher.Util.extend({
            encrypted: false
          }, options);
          this.netInfo = new _Pusher.NetInfo();
          this.netInfo.bind('online', function () {
            if (self._machine.is('waiting')) {
              self._machine.transition('connecting');

              updateState('connecting');
            }
          });
          this.netInfo.bind('offline', function () {
            if (self._machine.is('connected')) {
              // These are for Chrome 15, which ends up
              // having two sockets hanging around.
              self.socket.onclose = undefined;
              self.socket.onmessage = undefined;
              self.socket.onerror = undefined;
              self.socket.onopen = undefined;
              self.socket.close();
              self.socket = undefined;

              self._machine.transition('waiting');
            }
          }); // define the state machine that runs the connection

          this._machine = new _Pusher.Machine('initialized', machineTransitions, {
            initializedPre: function initializedPre() {
              self.compulsorySecure = self.options.encrypted;
              self.key = key;
              self.socket = null;
              self.socket_id = null;
              self.state = 'initialized';
            },
            waitingPre: function waitingPre() {
              if (self.connectionWait > 0) {
                self.emit('connecting_in', self.connectionWait);
              }

              if (self.netInfo.isOnLine() && self.connectionAttempts <= 4) {
                updateState('connecting');
              } else {
                updateState('unavailable');
              } // When in the unavailable state we attempt to connect, but don't
              // broadcast that fact


              if (self.netInfo.isOnLine()) {
                self._waitingTimer = setTimeout(function () {
                  self._machine.transition('connecting');
                }, connectionDelay());
              }
            },
            waitingExit: function waitingExit() {
              clearTimeout(self._waitingTimer);
            },
            connectingPre: function connectingPre() {
              // Case that a user manages to get to the connecting
              // state even when offline.
              if (self.netInfo.isOnLine() === false) {
                self._machine.transition('waiting');

                updateState('unavailable');
                return;
              }

              var url = formatURL(self.key, self.connectionSecure);

              _Pusher.debug('Connecting', url);

              self.socket = new _Pusher.Transport(url); // now that the socket connection attempt has been started,
              // set up the callbacks fired by the socket for different outcomes

              self.socket.onopen = ws_onopen;
              self.socket.onclose = transitionToWaiting;
              self.socket.onerror = ws_onError; // allow time to get ws_onOpen, otherwise close socket and try again

              self._connectingTimer = setTimeout(TransitionToImpermanentlyClosing, self.openTimeout);
            },
            connectingExit: function connectingExit() {
              clearTimeout(self._connectingTimer);
              self.socket.onopen = undefined; // unbind to avoid open events that are no longer relevant
            },
            connectingToWaiting: function connectingToWaiting() {
              updateConnectionParameters(); // FUTURE: update only ssl
            },
            connectingToImpermanentlyClosing: function connectingToImpermanentlyClosing() {
              updateConnectionParameters(); // FUTURE: update only timeout
            },
            openPre: function openPre() {
              self.socket.onmessage = ws_onMessageOpen;
              self.socket.onerror = ws_onError;
              self.socket.onclose = transitionToWaiting; // allow time to get connected-to-Pusher message, otherwise close socket, try again

              self._openTimer = setTimeout(TransitionToImpermanentlyClosing, self.connectedTimeout);
            },
            openExit: function openExit() {
              clearTimeout(self._openTimer);
              self.socket.onmessage = undefined; // unbind to avoid messages that are no longer relevant
            },
            openToWaiting: function openToWaiting() {
              updateConnectionParameters();
            },
            openToImpermanentlyClosing: function openToImpermanentlyClosing() {
              updateConnectionParameters();
            },
            connectedPre: function connectedPre(socket_id) {
              self.socket_id = socket_id;
              self.socket.onmessage = ws_onMessageConnected;
              self.socket.onerror = ws_onError;
              self.socket.onclose = transitionToWaiting;
              resetConnectionParameters(self);
              self.connectedAt = new Date().getTime();
              resetActivityCheck();
            },
            connectedPost: function connectedPost() {
              updateState('connected');
            },
            connectedExit: function connectedExit() {
              stopActivityCheck();
              updateState('disconnected');
            },
            impermanentlyClosingPost: function impermanentlyClosingPost() {
              if (self.socket) {
                self.socket.onclose = transitionToWaiting;
                self.socket.close();
              }
            },
            permanentlyClosingPost: function permanentlyClosingPost() {
              if (self.socket) {
                self.socket.onclose = function () {
                  resetConnectionParameters(self);

                  self._machine.transition('permanentlyClosed');
                };

                self.socket.close();
              } else {
                resetConnectionParameters(self);

                self._machine.transition('permanentlyClosed');
              }
            },
            failedPre: function failedPre() {
              updateState('failed');

              _Pusher.debug('WebSockets are not available in this browser.');
            },
            permanentlyClosedPost: function permanentlyClosedPost() {
              updateState('disconnected');
            }
          });
          /*-----------------------------------------------
            -----------------------------------------------*/

          function updateConnectionParameters() {
            if (self.connectionWait < MAX_CONNECTION_ATTEMPT_WAIT) {
              self.connectionWait += UNSUCCESSFUL_CONNECTION_ATTEMPT_ADDITIONAL_WAIT;
            }

            if (self.openTimeout < MAX_OPEN_ATTEMPT_TIMEOUT) {
              self.openTimeout += UNSUCCESSFUL_OPEN_ATTEMPT_ADDITIONAL_TIMEOUT;
            }

            if (self.connectedTimeout < MAX_CONNECTED_ATTEMPT_TIMEOUT) {
              self.connectedTimeout += UNSUCCESSFUL_CONNECTED_ATTEMPT_ADDITIONAL_TIMEOUT;
            }

            if (self.compulsorySecure !== true) {
              self.connectionSecure = !self.connectionSecure;
            }

            self.connectionAttempts++;
          }

          function formatURL(key, isSecure) {
            var port = _Pusher.ws_port;
            var protocol = 'ws://'; // Always connect with SSL if the current page has
            // been loaded via HTTPS.
            //
            // FUTURE: Always connect using SSL.
            //

            if (isSecure || document.location.protocol === 'https:') {
              port = _Pusher.wss_port;
              protocol = 'wss://';
            }

            var flash = _Pusher.TransportType === "flash" ? "true" : "false";
            return protocol + _Pusher.host + ':' + port + '/app/' + key + '?protocol=5&client=js' + '&version=' + _Pusher.VERSION + '&flash=' + flash;
          } // callback for close and retry.  Used on timeouts.


          function TransitionToImpermanentlyClosing() {
            self._machine.transition('impermanentlyClosing');
          }

          function resetActivityCheck() {
            if (self._activityTimer) {
              clearTimeout(self._activityTimer);
            } // Send ping after inactivity


            self._activityTimer = setTimeout(function () {
              self.send_event('pusher:ping', {}); // Wait for pong response

              self._activityTimer = setTimeout(function () {
                self.socket.close();
              }, self.options.pong_timeout || _Pusher.pong_timeout);
            }, self.options.activity_timeout || _Pusher.activity_timeout);
          }

          function stopActivityCheck() {
            if (self._activityTimer) {
              clearTimeout(self._activityTimer);
            }
          } // Returns the delay before the next connection attempt should be made
          //
          // This function guards against attempting to connect more frequently than
          // once every second
          //


          function connectionDelay() {
            var delay = self.connectionWait;

            if (delay === 0) {
              if (self.connectedAt) {
                var t = 1000;
                var connectedFor = new Date().getTime() - self.connectedAt;

                if (connectedFor < t) {
                  delay = t - connectedFor;
                }
              }
            }

            return delay;
          }
          /*-----------------------------------------------
            WebSocket Callbacks
            -----------------------------------------------*/
          // no-op, as we only care when we get pusher:connection_established


          function ws_onopen() {
            self._machine.transition('open');
          }

          function handleCloseCode(code, message) {
            // first inform the end-developer of this error
            self.emit('error', {
              type: 'PusherError',
              data: {
                code: code,
                message: message
              }
            });

            if (code === 4000) {
              // SSL only app
              self.compulsorySecure = true;
              self.connectionSecure = true;
              self.options.encrypted = true;
              TransitionToImpermanentlyClosing();
            } else if (code < 4100) {
              // Permentently close connection
              self._machine.transition('permanentlyClosing');
            } else if (code < 4200) {
              // Backoff before reconnecting
              self.connectionWait = 1000;

              self._machine.transition('waiting');
            } else if (code < 4300) {
              // Reconnect immediately
              TransitionToImpermanentlyClosing();
            } else {
              // Unknown error
              self._machine.transition('permanentlyClosing');
            }
          }

          function ws_onMessageOpen(event) {
            var params = parseWebSocketEvent(event);

            if (params !== undefined) {
              if (params.event === 'pusher:connection_established') {
                self._machine.transition('connected', params.data.socket_id);
              } else if (params.event === 'pusher:error') {
                handleCloseCode(params.data.code, params.data.message);
              }
            }
          }

          function ws_onMessageConnected(event) {
            resetActivityCheck();
            var params = parseWebSocketEvent(event);

            if (params !== undefined) {
              _Pusher.debug('Event recd', params);

              switch (params.event) {
                case 'pusher:error':
                  self.emit('error', {
                    type: 'PusherError',
                    data: params.data
                  });
                  break;

                case 'pusher:ping':
                  self.send_event('pusher:pong', {});
                  break;
              }

              self.emit('message', params);
            }
          }
          /**
           * Parses an event from the WebSocket to get
           * the JSON payload that we require
           *
           * @param {MessageEvent} event  The event from the WebSocket.onmessage handler.
          **/


          function parseWebSocketEvent(event) {
            try {
              var params = JSON.parse(event.data);

              if (typeof params.data === 'string') {
                try {
                  params.data = JSON.parse(params.data);
                } catch (e) {
                  if (!(e instanceof SyntaxError)) {
                    throw e;
                  }
                }
              }

              return params;
            } catch (e) {
              self.emit('error', {
                type: 'MessageParseError',
                error: e,
                data: event.data
              });
            }
          }

          function transitionToWaiting() {
            self._machine.transition('waiting');
          }

          function ws_onError(error) {
            // just emit error to user - socket will already be closed by browser
            self.emit('error', {
              type: 'WebSocketError',
              error: error
            });
          } // Updates the public state information exposed by connection
          //
          // This is distinct from the internal state information used by _machine
          // to manage the connection
          //


          function updateState(newState, data) {
            var prevState = self.state;
            self.state = newState; // Only emit when the state changes

            if (prevState !== newState) {
              _Pusher.debug('State changed', prevState + ' -> ' + newState);

              self.emit('state_change', {
                previous: prevState,
                current: newState
              });
              self.emit(newState, data);
            }
          }
        }

        Connection.prototype.connect = function () {
          // no WebSockets
          if (!this._machine.is('failed') && !_Pusher.Transport) {
            this._machine.transition('failed');
          } // initial open of connection
          else if (this._machine.is('initialized')) {
            resetConnectionParameters(this);

            this._machine.transition('waiting');
          } // user skipping connection wait
          else if (this._machine.is('waiting') && this.netInfo.isOnLine() === true) {
            this._machine.transition('connecting');
          } // user re-opening connection after closing it
          else if (this._machine.is("permanentlyClosed")) {
            resetConnectionParameters(this);

            this._machine.transition('waiting');
          }
        };

        Connection.prototype.send = function (data) {
          if (this._machine.is('connected')) {
            // Workaround for MobileSafari bug (see https://gist.github.com/2052006)
            var self = this;
            setTimeout(function () {
              self.socket.send(data);
            }, 0);
            return true;
          } else {
            return false;
          }
        };

        Connection.prototype.send_event = function (event_name, data, channel) {
          var payload = {
            event: event_name,
            data: data
          };
          if (channel) payload['channel'] = channel;

          _Pusher.debug('Event sent', payload);

          return this.send(JSON.stringify(payload));
        };

        Connection.prototype.disconnect = function () {
          if (this._machine.is('permanentlyClosed')) return;

          if (this._machine.is('waiting') || this._machine.is('failed')) {
            this._machine.transition('permanentlyClosed');
          } else {
            this._machine.transition('permanentlyClosing');
          }
        };

        _Pusher.Util.extend(Connection.prototype, _Pusher.EventsDispatcher.prototype);

        _Pusher.Connection = Connection;
      })();

      (function () {
        _Pusher.Channels = function () {
          this.channels = {};
        };

        _Pusher.Channels.prototype = {
          add: function add(channel_name, pusher) {
            var existing_channel = this.find(channel_name);

            if (!existing_channel) {
              var channel = _Pusher.Channel.factory(channel_name, pusher);

              this.channels[channel_name] = channel;
              return channel;
            } else {
              return existing_channel;
            }
          },
          find: function find(channel_name) {
            return this.channels[channel_name];
          },
          remove: function remove(channel_name) {
            delete this.channels[channel_name];
          },
          disconnect: function disconnect() {
            for (var channel_name in this.channels) {
              this.channels[channel_name].disconnect();
            }
          }
        };

        _Pusher.Channel = function (channel_name, pusher) {
          var self = this;

          _Pusher.EventsDispatcher.call(this, function (event_name, event_data) {
            _Pusher.debug('No callbacks on ' + channel_name + ' for ' + event_name);
          });

          this.pusher = pusher;
          this.name = channel_name;
          this.subscribed = false;
          this.bind('pusher_internal:subscription_succeeded', function (data) {
            self.onSubscriptionSucceeded(data);
          });
        };

        _Pusher.Channel.prototype = {
          // inheritable constructor
          init: function init() {},
          disconnect: function disconnect() {
            this.subscribed = false;
            this.emit("pusher_internal:disconnected");
          },
          onSubscriptionSucceeded: function onSubscriptionSucceeded(data) {
            this.subscribed = true;
            this.emit('pusher:subscription_succeeded');
          },
          authorize: function authorize(socketId, options, callback) {
            return callback(false, {}); // normal channels don't require auth
          },
          trigger: function trigger(event, data) {
            return this.pusher.send_event(event, data, this.name);
          }
        };

        _Pusher.Util.extend(_Pusher.Channel.prototype, _Pusher.EventsDispatcher.prototype);

        _Pusher.Channel.PrivateChannel = {
          authorize: function authorize(socketId, options, callback) {
            var self = this;
            var authorizer = new _Pusher.Channel.Authorizer(this, _Pusher.channel_auth_transport, options);
            return authorizer.authorize(socketId, function (err, authData) {
              if (!err) {
                self.emit('pusher_internal:authorized', authData);
              }

              callback(err, authData);
            });
          }
        };
        _Pusher.Channel.PresenceChannel = {
          init: function init() {
            this.members = new Members(this); // leeches off channel events
          },
          onSubscriptionSucceeded: function onSubscriptionSucceeded(data) {
            this.subscribed = true; // We override this because we want the Members obj to be responsible for
            // emitting the pusher:subscription_succeeded.  It will do this after it has done its work.
          }
        };

        var Members = function Members(channel) {
          var self = this;

          var reset = function reset() {
            this._members_map = {};
            this.count = 0;
            this.me = null;
          };

          reset.call(this);
          channel.bind('pusher_internal:authorized', function (authorizedData) {
            var channelData = JSON.parse(authorizedData.channel_data);
            channel.bind("pusher_internal:subscription_succeeded", function (subscriptionData) {
              self._members_map = subscriptionData.presence.hash;
              self.count = subscriptionData.presence.count;
              self.me = self.get(channelData.user_id);
              channel.emit('pusher:subscription_succeeded', self);
            });
          });
          channel.bind('pusher_internal:member_added', function (data) {
            if (self.get(data.user_id) === null) {
              // only incr if user_id does not already exist
              self.count++;
            }

            self._members_map[data.user_id] = data.user_info;
            channel.emit('pusher:member_added', self.get(data.user_id));
          });
          channel.bind('pusher_internal:member_removed', function (data) {
            var member = self.get(data.user_id);

            if (member) {
              delete self._members_map[data.user_id];
              self.count--;
              channel.emit('pusher:member_removed', member);
            }
          });
          channel.bind('pusher_internal:disconnected', function () {
            reset.call(self);
          });
        };

        Members.prototype = {
          each: function each(callback) {
            for (var i in this._members_map) {
              callback(this.get(i));
            }
          },
          get: function get(user_id) {
            if (this._members_map.hasOwnProperty(user_id)) {
              // have heard of this user user_id
              return {
                id: user_id,
                info: this._members_map[user_id]
              };
            } else {
              // have never heard of this user
              return null;
            }
          }
        };

        _Pusher.Channel.factory = function (channel_name, pusher) {
          var channel = new _Pusher.Channel(channel_name, pusher);

          if (channel_name.indexOf('private-') === 0) {
            _Pusher.Util.extend(channel, _Pusher.Channel.PrivateChannel);
          } else if (channel_name.indexOf('presence-') === 0) {
            _Pusher.Util.extend(channel, _Pusher.Channel.PrivateChannel);

            _Pusher.Util.extend(channel, _Pusher.Channel.PresenceChannel);
          }

          channel.init();
          return channel;
        };
      })();

      (function () {
        _Pusher.Channel.Authorizer = function (channel, type, options) {
          this.channel = channel;
          this.type = type;
          this.authOptions = (options || {}).auth || {};
        };

        _Pusher.Channel.Authorizer.prototype = {
          composeQuery: function composeQuery(socketId) {
            var query = '&socket_id=' + encodeURIComponent(socketId) + '&channel_name=' + encodeURIComponent(this.channel.name);

            for (var i in this.authOptions.params) {
              query += "&" + encodeURIComponent(i) + "=" + encodeURIComponent(this.authOptions.params[i]);
            }

            return query;
          },
          authorize: function authorize(socketId, callback) {
            return _Pusher.authorizers[this.type].call(this, socketId, callback);
          }
        };
        _Pusher.auth_callbacks = {};
        _Pusher.authorizers = {
          ajax: function ajax(socketId, callback) {
            var xhr;

            if (_Pusher.XHR) {
              xhr = new _Pusher.XHR();
            } else {
              xhr = window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
            }

            xhr.open("POST", _Pusher.channel_auth_endpoint, true); // add request headers

            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

            for (var headerName in this.authOptions.headers) {
              xhr.setRequestHeader(headerName, this.authOptions.headers[headerName]);
            }

            xhr.onreadystatechange = function () {
              if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                  var data,
                      parsed = false;

                  try {
                    data = JSON.parse(xhr.responseText);
                    parsed = true;
                  } catch (e) {
                    callback(true, 'JSON returned from webapp was invalid, yet status code was 200. Data was: ' + xhr.responseText);
                  }

                  if (parsed) {
                    // prevents double execution.
                    callback(false, data);
                  }
                } else {
                  _Pusher.warn("Couldn't get auth info from your webapp", xhr.status);

                  callback(true, xhr.status);
                }
              }
            };

            xhr.send(this.composeQuery(socketId));
            return xhr;
          },
          jsonp: function jsonp(socketId, callback) {
            if (this.authOptions.headers !== undefined) {
              _Pusher.warn("Warn", "To send headers with the auth request, you must use AJAX, rather than JSONP.");
            }

            var script = document.createElement("script"); // Hacked wrapper.

            _Pusher.auth_callbacks[this.channel.name] = function (data) {
              callback(false, data);
            };

            var callback_name = "Pusher.auth_callbacks['" + this.channel.name + "']";
            script.src = _Pusher.channel_auth_endpoint + '?callback=' + encodeURIComponent(callback_name) + this.composeQuery(socketId);
            var head = document.getElementsByTagName("head")[0] || document.documentElement;
            head.insertBefore(script, head.firstChild);
          }
        };
      })(); // _require(dependencies, callback) takes an array of dependency urls and a
      // callback to call when all the dependecies have finished loading


      var _require = function () {
        function handleScriptLoaded(elem, callback) {
          if (document.addEventListener) {
            elem.addEventListener('load', callback, false);
          } else {
            elem.attachEvent('onreadystatechange', function () {
              if (elem.readyState == 'loaded' || elem.readyState == 'complete') {
                callback();
              }
            });
          }
        }

        function addScript(src, callback) {
          var head = document.getElementsByTagName('head')[0];
          var script = document.createElement('script');
          script.setAttribute('src', src);
          script.setAttribute("type", "text/javascript");
          script.setAttribute('async', true);
          handleScriptLoaded(script, function () {
            callback();
          });
          head.appendChild(script);
        }

        return function (deps, callback) {
          var deps_loaded = 0;

          for (var i = 0; i < deps.length; i++) {
            addScript(deps[i], function () {
              if (deps.length == ++deps_loaded) {
                // This setTimeout is a workaround for an Opera issue
                setTimeout(callback, 0);
              }
            });
          }
        };
      }();

      (function () {
        // Support Firefox versions which prefix WebSocket
        if (isWindowDefined() && !window['WebSocket'] && window['MozWebSocket']) {
          window['WebSocket'] = window['MozWebSocket'];
        }

        if (isWindowDefined() && window['WebSocket']) {
          _Pusher.Transport = window['WebSocket'];
          _Pusher.TransportType = 'native';
        }

        var cdn = isWindowDefined() && (document.location.protocol == 'http:' ? _Pusher.cdn_http : _Pusher.cdn_https);
        var root = cdn + _Pusher.VERSION;
        var deps = [];

        if (isWindowDefined() && !window['JSON']) {
          deps.push(root + '/json2' + _Pusher.dependency_suffix + '.js');
        }

        if (isWindowDefined() && !window['WebSocket']) {
          // We manually initialize web-socket-js to iron out cross browser issues
          window.WEB_SOCKET_DISABLE_AUTO_INITIALIZATION = true;
          deps.push(root + '/flashfallback' + _Pusher.dependency_suffix + '.js');
        }

        var initialize = function () {
          if (isWindowDefined() && window['WebSocket']) {
            // Initialize function in the case that we have native WebSocket support
            return function () {
              _Pusher.ready();
            };
          } else {
            // Initialize function for fallback case
            return function () {
              if (window['WebSocket']) {
                // window['WebSocket'] is a flash emulation of WebSocket
                _Pusher.Transport = window['WebSocket'];
                _Pusher.TransportType = 'flash'; // window.WEB_SOCKET_SWF_LOCATION = root + "/WebSocketMain.swf";

                window.WEB_SOCKET_SWF_LOCATION = "https://s3.amazonaws.com/uploadcare-static/WebSocketMainInsecure.swf";

                WebSocket.__addTask(function () {
                  _Pusher.ready();
                });

                WebSocket.__initialize();
              } else {
                // Flash must not be installed
                _Pusher.Transport = null;
                _Pusher.TransportType = 'none';

                _Pusher.ready();
              }
            };
          }
        }(); // Allows calling a function when the document body is available


        var ondocumentbody = function ondocumentbody(callback) {
          var load_body = function load_body() {
            isWindowDefined() && (document.body ? callback() : setTimeout(load_body, 0));
          };

          load_body();
        };

        var initializeOnDocumentBody = function initializeOnDocumentBody() {
          ondocumentbody(initialize);
        };

        if (deps.length > 0) {
          _require(deps, initializeOnDocumentBody);
        } else {
          initializeOnDocumentBody();
        }
      })();

      this.Pusher = _Pusher;
    }).call(exports);
  });
  var pusher_1 = pusher.Pusher;
  var pushers = {}; // This fixes Pusher's prototype. Because Pusher replaces it:
  // Pusher.prototype = {method: ...}
  // instead of extending:
  // Pusher.prototype.method = ...

  pusher_1.prototype.constructor = pusher_1;

  var ManagedPusher = /*#__PURE__*/function (_Pusher) {
    _inherits(ManagedPusher, _Pusher);

    var _super = _createSuper(ManagedPusher);

    function ManagedPusher() {
      _classCallCheck(this, ManagedPusher);

      return _super.apply(this, arguments);
    }

    _createClass(ManagedPusher, [{
      key: "subscribe",
      value: function subscribe(name) {
        // Ensure we are connected when subscribing.
        if (this.disconnectTimeout) {
          clearTimeout(this.disconnectTimeout);
          this.disconnectTimeout = null;
        }

        this.connect();
        return _get(_getPrototypeOf(ManagedPusher.prototype), "subscribe", this).apply(this, arguments);
      }
    }, {
      key: "unsubscribe",
      value: function unsubscribe(name) {
        var _this = this;

        _get(_getPrototypeOf(ManagedPusher.prototype), "unsubscribe", this).apply(this, arguments); // Schedule disconnect if no channels left.


        if ($__default['default'].isEmptyObject(this.channels.channels)) {
          this.disconnectTimeout = setTimeout(function () {
            _this.disconnectTimeout = null;
            return _this.disconnect();
          }, 5000);
        }
      }
    }]);

    return ManagedPusher;
  }(pusher_1);

  var getPusher = function getPusher(key) {
    if (pushers[key] == null) {
      pushers[key] = new ManagedPusher(key);
    } // Preconnect before we actually need channel.


    pushers[key].connect();
    return pushers[key];
  };

  var UrlFile = /*#__PURE__*/function (_BaseFile) {
    _inherits(UrlFile, _BaseFile);

    var _super = _createSuper(UrlFile);

    function UrlFile(__url) {
      var _this;

      _classCallCheck(this, UrlFile);

      var filename;
      _this = _super.apply(this, arguments);
      _this.__url = __url;
      filename = splitUrlRegex.exec(_this.__url)[3].split('/').pop();

      if (filename) {
        try {
          _this.fileName = decodeURIComponent(filename);
        } catch (error) {
          _this.fileName = filename;
        }
      }

      _this.__notifyApi();

      return _this;
    }

    _createClass(UrlFile, [{
      key: "setName",
      value: function setName(fileName) {
        this.fileName = fileName;
        this.__realFileName = fileName;
        return this.__notifyApi();
      }
    }, {
      key: "setIsImage",
      value: function setIsImage(isImage) {
        this.isImage = isImage;
        return this.__notifyApi();
      }
    }, {
      key: "__startUpload",
      value: function __startUpload() {
        var _this2 = this;

        var data, df, pollWatcher, pusherWatcher;
        df = $__default['default'].Deferred();
        pusherWatcher = new PusherWatcher(this.settings);
        pollWatcher = new PollWatcher(this.settings);
        data = {
          pub_key: this.settings.publicKey,
          signature: this.settings.secureSignature,
          expire: this.settings.secureExpire,
          source_url: this.__url,
          filename: this.__realFileName || '',
          source: this.sourceInfo.source,
          store: this.settings.doNotStore ? '' : 'auto',
          jsonerrors: 1
        };
        defer(function () {
          if (_this2.apiDeferred.state() !== 'pending') {
            return;
          }

          return jsonp("".concat(_this2.settings.urlBase, "/from_url/"), 'GET', data, {
            headers: {
              'X-UC-User-Agent': _this2.settings._userAgent
            }
          }).fail(function (error) {
            if (_this2.settings.debugUploads) {
              debug("Can't start upload from URL.", error.message, data);
            }

            return df.reject(error);
          }).done(function (data) {
            var logger;

            if (_this2.apiDeferred.state() !== 'pending') {
              return;
            }

            if (_this2.settings.debugUploads) {
              debug('Start watchers.', data.token);
              logger = setInterval(function () {
                return debug('Still watching.', data.token);
              }, 5000);
              df.done(function () {
                return debug('Stop watchers.', data.token);
              }).always(function () {
                return clearInterval(logger);
              });
            }

            _this2.__listenWatcher(df, $__default['default']([pusherWatcher, pollWatcher]));

            df.always(function () {
              $__default['default']([pusherWatcher, pollWatcher]).off(_this2.allEvents);
              pusherWatcher.stopWatching();
              return pollWatcher.stopWatching();
            }); // turn off pollWatcher if we receive any message from pusher

            $__default['default'](pusherWatcher).one(_this2.allEvents, function () {
              if (!pollWatcher.interval) {
                return;
              }

              if (_this2.settings.debugUploads) {
                debug('Start using pusher.', data.token);
              }

              return pollWatcher.stopWatching();
            });
            pusherWatcher.watch(data.token);
            return pollWatcher.watch(data.token);
          });
        });
        return df;
      }
    }, {
      key: "__listenWatcher",
      value: function __listenWatcher(df, watcher) {
        var _this3 = this;

        return watcher.on('progress', function (e, data) {
          _this3.fileSize = data.total;
          return df.notify(data.done / data.total);
        }).on('success', function (e, data) {
          $__default['default'](e.target).trigger('progress', data);
          _this3.fileId = data.uuid;

          _this3.__handleFileData(data);

          return df.resolve();
        }).on('error fail', function (e, error) {
          if (error.error_code) {
            // error from our pusher backend
            var code = error.error_code,
                message = error.msg;
            df.reject({
              code: code,
              message: message
            });
          } else {
            // some other error
            df.reject(error);
          }
        });
      }
    }]);

    return UrlFile;
  }(BaseFile);

  UrlFile.prototype.sourceName = 'url';
  UrlFile.prototype.allEvents = 'progress success error fail';

  var PusherWatcher = /*#__PURE__*/function () {
    function PusherWatcher(settings) {
      _classCallCheck(this, PusherWatcher);

      this.settings = settings;

      try {
        this.pusher = getPusher(this.settings.pusherKey);
      } catch (error) {
        this.pusher = null;
      }
    }

    _createClass(PusherWatcher, [{
      key: "watch",
      value: function watch(token) {
        var _this4 = this;

        var channel;
        this.token = token;

        if (!this.pusher) {
          return;
        }

        channel = this.pusher.subscribe("task-status-".concat(this.token));
        return channel.bind_all(function (ev, data) {
          return $__default['default'](_this4).trigger(ev, data);
        });
      }
    }, {
      key: "stopWatching",
      value: function stopWatching() {
        if (!this.pusher) {
          return;
        }

        return this.pusher.unsubscribe("task-status-".concat(this.token));
      }
    }]);

    return PusherWatcher;
  }();

  var PollWatcher = /*#__PURE__*/function () {
    function PollWatcher(settings) {
      _classCallCheck(this, PollWatcher);

      this.settings = settings;
      this.poolUrl = "".concat(this.settings.urlBase, "/from_url/status/");
    }

    _createClass(PollWatcher, [{
      key: "watch",
      value: function watch(token) {
        var _this5 = this;

        this.token = token;

        var bind = function bind() {
          _this5.interval = setTimeout(function () {
            _this5.__updateStatus().done(function () {
              if (_this5.interval) {
                // Do not schedule next request if watcher stopped.
                bind();
              }
            });
          }, 333);
          return _this5.interval;
        };

        return bind();
      }
    }, {
      key: "stopWatching",
      value: function stopWatching() {
        if (this.interval) {
          clearTimeout(this.interval);
        }

        this.interval = null;
        return this.interval;
      }
    }, {
      key: "__updateStatus",
      value: function __updateStatus() {
        var _this6 = this;

        return jsonp(this.poolUrl, 'GET', {
          token: this.token
        }, {
          headers: {
            'X-UC-User-Agent': this.settings._userAgent
          }
        }).fail(function (error) {
          return $__default['default'](_this6).trigger('error', error);
        }).done(function (data) {
          return $__default['default'](_this6).trigger(data.status, data);
        });
      }
    }]);

    return PollWatcher;
  }();

  var UploadedFile = /*#__PURE__*/function (_BaseFile) {
    _inherits(UploadedFile, _BaseFile);

    var _super = _createSuper(UploadedFile);

    function UploadedFile(fileIdOrUrl) {
      var _this;

      _classCallCheck(this, UploadedFile);

      var cdnUrl;
      _this = _super.apply(this, arguments);
      cdnUrl = splitCdnUrl(fileIdOrUrl);

      if (cdnUrl) {
        _this.fileId = cdnUrl[1];

        if (cdnUrl[2]) {
          _this.cdnUrlModifiers = cdnUrl[2];
        }
      } else {
        _this.__rejectApi('baddata');
      }

      return _this;
    }

    return UploadedFile;
  }(BaseFile);

  UploadedFile.prototype.sourceName = 'uploaded';

  var ReadyFile = /*#__PURE__*/function (_BaseFile2) {
    _inherits(ReadyFile, _BaseFile2);

    var _super2 = _createSuper(ReadyFile);

    function ReadyFile(data) {
      var _this2;

      _classCallCheck(this, ReadyFile);

      _this2 = _super2.apply(this, arguments);

      if (!data) {
        _this2.__rejectApi('deleted');
      } else {
        _this2.fileId = data.uuid;

        _this2.__handleFileData(data);
      }

      return _this2;
    }

    return ReadyFile;
  }(BaseFile);

  ReadyFile.prototype.sourceName = 'uploaded';
  var converters = {
    object: ObjectFile,
    input: InputFile,
    url: UrlFile,
    uploaded: UploadedFile,
    ready: ReadyFile
  };

  var fileFrom = function fileFrom(type, data, s) {
    return filesFrom(type, [data], s)[0];
  };

  var filesFrom = function filesFrom(type, data, s) {
    var i, info, len, param, results;
    s = build(s || {});
    results = [];

    for (i = 0, len = data.length; i < len; i++) {
      param = data[i];
      info = undefined;

      if ($__default['default'].isArray(param)) {
        info = param[1];
        param = param[0];
      }

      results.push(new converters[type](param, s, info).promise());
    }

    return results;
  };

  var isFile = function isFile(obj) {
    return obj && obj.done && obj.fail && obj.cancel;
  }; // Converts user-given value to File object.


  var valueToFile = function valueToFile(value, settings) {
    if (value && !isFile(value)) {
      value = fileFrom('uploaded', value, settings);
    }

    return value || null;
  };

  var isFileGroup = function isFileGroup(obj) {
    return obj && obj.files && obj.promise;
  }; // Converts user-given value to FileGroup object.


  var valueToGroup = function valueToGroup(value, settings) {
    var files, item;

    if (value) {
      if ($__default['default'].isArray(value)) {
        files = function () {
          var j, len, results;
          results = [];

          for (j = 0, len = value.length; j < len; j++) {
            item = value[j];
            results.push(valueToFile(item, settings));
          }

          return results;
        }();

        value = FileGroup(files, settings);
      } else {
        if (!isFileGroup(value)) {
          return loadFileGroup(value, settings);
        }
      }
    }

    return wrapToPromise(value || null);
  }; // check if two groups contains same files in same order


  var isFileGroupsEqual = function isFileGroupsEqual(group1, group2) {
    var file, files1, files2, i, j, len;

    if (group1 === group2) {
      return true;
    }

    if (!(isFileGroup(group1) && isFileGroup(group2))) {
      return false;
    }

    files1 = group1.files();
    files2 = group2.files();

    if (files1.length !== files2.length) {
      return false;
    }

    for (i = j = 0, len = files1.length; j < len; i = ++j) {
      file = files1[i];

      if (file !== files2[i]) {
        return false;
      }
    }

    return true;
  };

  var indexOf = [].indexOf; // utils

  var Collection = /*#__PURE__*/function () {
    function Collection() {
      var items = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      var after = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      _classCallCheck(this, Collection);

      this.onAdd = $__default['default'].Callbacks();
      this.onRemove = $__default['default'].Callbacks();
      this.onSort = $__default['default'].Callbacks();
      this.onReplace = $__default['default'].Callbacks();
      this.__items = [];

      if (!after) {
        this.init(items);
      }
    }

    _createClass(Collection, [{
      key: "init",
      value: function init(items) {
        var item, j, len;

        for (j = 0, len = items.length; j < len; j++) {
          item = items[j];
          this.add(item);
        }
      }
    }, {
      key: "add",
      value: function add(item) {
        return this.__add(item, this.__items.length);
      }
    }, {
      key: "__add",
      value: function __add(item, i) {
        this.__items.splice(i, 0, item);

        return this.onAdd.fire(item, i);
      }
    }, {
      key: "remove",
      value: function remove(item) {
        var i;
        i = $__default['default'].inArray(item, this.__items);

        if (i !== -1) {
          return this.__remove(item, i);
        }
      }
    }, {
      key: "__remove",
      value: function __remove(item, i) {
        this.__items.splice(i, 1);

        return this.onRemove.fire(item, i);
      }
    }, {
      key: "clear",
      value: function clear() {
        var i, item, items, j, len, results;
        items = this.get();
        this.__items.length = 0;
        results = [];

        for (i = j = 0, len = items.length; j < len; i = ++j) {
          item = items[i];
          results.push(this.onRemove.fire(item, i));
        }

        return results;
      }
    }, {
      key: "replace",
      value: function replace(oldItem, newItem) {
        var i;

        if (oldItem !== newItem) {
          i = $__default['default'].inArray(oldItem, this.__items);

          if (i !== -1) {
            return this.__replace(oldItem, newItem, i);
          }
        }
      }
    }, {
      key: "__replace",
      value: function __replace(oldItem, newItem, i) {
        this.__items[i] = newItem;
        return this.onReplace.fire(oldItem, newItem, i);
      }
    }, {
      key: "sort",
      value: function sort(comparator) {
        this.__items.sort(comparator);

        return this.onSort.fire();
      }
    }, {
      key: "get",
      value: function get(index) {
        if (index != null) {
          return this.__items[index];
        } else {
          return this.__items.slice(0);
        }
      }
    }, {
      key: "length",
      value: function length() {
        return this.__items.length;
      }
    }]);

    return Collection;
  }();

  var UniqCollection = /*#__PURE__*/function (_Collection) {
    _inherits(UniqCollection, _Collection);

    var _super = _createSuper(UniqCollection);

    function UniqCollection() {
      _classCallCheck(this, UniqCollection);

      return _super.apply(this, arguments);
    }

    _createClass(UniqCollection, [{
      key: "add",
      value: function add(item) {
        if (indexOf.call(this.__items, item) >= 0) {
          return;
        }

        return _get(_getPrototypeOf(UniqCollection.prototype), "add", this).apply(this, arguments);
      }
    }, {
      key: "__replace",
      value: function __replace(oldItem, newItem, i) {
        if (indexOf.call(this.__items, newItem) >= 0) {
          return this.remove(oldItem);
        } else {
          return _get(_getPrototypeOf(UniqCollection.prototype), "__replace", this).apply(this, arguments);
        }
      }
    }]);

    return UniqCollection;
  }(Collection);

  var CollectionOfPromises = /*#__PURE__*/function (_UniqCollection) {
    _inherits(CollectionOfPromises, _UniqCollection);

    var _super2 = _createSuper(CollectionOfPromises);

    function CollectionOfPromises() {
      var _thisSuper, _this;

      _classCallCheck(this, CollectionOfPromises);

      _this = _super2.call.apply(_super2, [this].concat(Array.prototype.slice.call(arguments), [true]));
      _this.anyDoneList = $__default['default'].Callbacks();
      _this.anyFailList = $__default['default'].Callbacks();
      _this.anyProgressList = $__default['default'].Callbacks();
      _this._thenArgs = null;

      _this.anyProgressList.add(function (item, firstArgument) {
        return $__default['default'](item).data('lastProgress', firstArgument);
      });

      _get((_thisSuper = _assertThisInitialized(_this), _getPrototypeOf(CollectionOfPromises.prototype)), "init", _thisSuper).call(_thisSuper, arguments[0]);

      return _this;
    }

    _createClass(CollectionOfPromises, [{
      key: "onAnyDone",
      value: function onAnyDone(cb) {
        var file, j, len, ref1, results;
        this.anyDoneList.add(cb);
        ref1 = this.__items;
        results = [];

        for (j = 0, len = ref1.length; j < len; j++) {
          file = ref1[j];

          if (file.state() === 'resolved') {
            results.push(file.done(function () {
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              return cb.apply(void 0, [file].concat(args));
            }));
          } else {
            results.push(undefined);
          }
        }

        return results;
      }
    }, {
      key: "onAnyFail",
      value: function onAnyFail(cb) {
        var file, j, len, ref1, results;
        this.anyFailList.add(cb);
        ref1 = this.__items;
        results = [];

        for (j = 0, len = ref1.length; j < len; j++) {
          file = ref1[j];

          if (file.state() === 'rejected') {
            results.push(file.fail(function () {
              for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                args[_key2] = arguments[_key2];
              }

              return cb.apply(void 0, [file].concat(args));
            }));
          } else {
            results.push(undefined);
          }
        }

        return results;
      }
    }, {
      key: "onAnyProgress",
      value: function onAnyProgress(cb) {
        var file, j, len, ref1, results;
        this.anyProgressList.add(cb);
        ref1 = this.__items;
        results = [];

        for (j = 0, len = ref1.length; j < len; j++) {
          file = ref1[j];
          results.push(cb(file, $__default['default'](file).data('lastProgress')));
        }

        return results;
      }
    }, {
      key: "lastProgresses",
      value: function lastProgresses() {
        var item, j, len, ref1, results;
        ref1 = this.__items;
        results = [];

        for (j = 0, len = ref1.length; j < len; j++) {
          item = ref1[j];
          results.push($__default['default'](item).data('lastProgress'));
        }

        return results;
      }
    }, {
      key: "add",
      value: function add(item) {
        if (!(item && item.then)) {
          return;
        }

        if (this._thenArgs) {
          var _item;

          item = (_item = item).then.apply(_item, _toConsumableArray(this._thenArgs));
        }

        _get(_getPrototypeOf(CollectionOfPromises.prototype), "add", this).call(this, item);

        return this.__watchItem(item);
      }
    }, {
      key: "__replace",
      value: function __replace(oldItem, newItem, i) {
        if (!(newItem && newItem.then)) {
          return this.remove(oldItem);
        } else {
          _get(_getPrototypeOf(CollectionOfPromises.prototype), "__replace", this).apply(this, arguments);

          return this.__watchItem(newItem);
        }
      }
    }, {
      key: "__watchItem",
      value: function __watchItem(item) {
        var _this2 = this;

        var handler = function handler(callbacks) {
          return function () {
            if (indexOf.call(_this2.__items, item) >= 0) {
              for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                args[_key3] = arguments[_key3];
              }

              return callbacks.fire.apply(callbacks, [item].concat(args));
            }
          };
        };

        return item.then(handler(this.anyDoneList), handler(this.anyFailList), handler(this.anyProgressList));
      }
    }, {
      key: "autoThen",
      value: function autoThen() {
        var i, item, j, len, ref1, results;

        if (this._thenArgs) {
          throw new Error('CollectionOfPromises.then() could be used only once');
        }

        for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
          args[_key4] = arguments[_key4];
        }

        this._thenArgs = args;
        ref1 = this.__items;
        results = [];

        for (i = j = 0, len = ref1.length; j < len; i = ++j) {
          var _item2;

          item = ref1[i];
          results.push(this.__replace(item, (_item2 = item).then.apply(_item2, _toConsumableArray(this._thenArgs)), i));
        }

        return results;
      }
    }]);

    return CollectionOfPromises;
  }(UniqCollection); // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #


  var translations$u = {
    uploading: 'جاري الرفع... الرجاء الانتظار',
    loadingInfo: 'جار تحميل المعلومات ...',
    errors: {
      default: 'خطأ',
      baddata: 'قيمة غير صحيحة',
      size: 'ملف كبير جداً',
      upload: 'يتعذر الرفع',
      user: 'تم إلغاء الرفع',
      info: 'يتعذر تحميل المعلومات',
      image: 'يسمح بالصور فقط',
      createGroup: 'لا يمكن إنشاء مجموعة ملفات',
      deleted: 'تم حذف الملف'
    },
    draghere: 'أسقط ملف هنا',
    file: {
      one: '%1 ملف',
      other: '%1 ملفات'
    },
    buttons: {
      cancel: 'إلغاء',
      remove: 'إزالة',
      choose: {
        files: {
          one: 'اختر ملف',
          other: 'اختر ملفات'
        },
        images: {
          one: 'اختر صورة',
          other: 'اختر صور'
        }
      }
    },
    dialog: {
      close: 'أغلق',
      openMenu: 'افتح القائمة',
      done: 'موافق',
      showFiles: 'اظهار الملفات',
      tabs: {
        names: {
          'empty-pubkey': 'مرحبا!',
          preview: 'معاينة',
          file: 'ملفات محلية',
          url: 'رابط مباشر',
          camera: 'كاميرا',
          facebook: 'فيس بوك',
          dropbox: 'دروب بوكس',
          gdrive: 'جوجل دريف',
          gphotos: 'صور غوغل',
          instagram: 'إينستجرام',
          vk: 'في كي',
          evernote: 'إيفرنوت',
          box: 'بوكس',
          onedrive: 'ون درايف',
          flickr: 'فليكر',
          huddle: 'هادل'
        },
        file: {
          drag: 'سحب وإفلات<br>أي ملف',
          nodrop: 'رفع ملفات من&nbsp;الحاسوب',
          cloudsTip: 'مخازن على السحابة<br>والشبكات الاجتماعية',
          or: 'أو',
          button: 'اختر ملف محلي',
          also: 'أو اختر من'
        },
        url: {
          title: 'ملفات من شبكة الإنترنت',
          line1: 'التقاط أي ملف من على شبكة الإنترنت',
          line2: 'فقط قم بتوفير الرابط',
          input: 'الصق الرابط هنا...',
          button: 'رفع'
        },
        camera: {
          title: 'ملف من كاميرا الويب',
          capture: 'التقاط صورة',
          mirror: 'عكس الصورة',
          startRecord: 'سجل فيديو',
          stopRecord: 'توقف',
          cancelRecord: 'إلغاء',
          retry: 'طلب الإذن مرة أخرى',
          pleaseAllow: {
            title: 'يرجى السماح بالوصول إلى الكاميرا',
            text: 'تمت مطالبتك بالسماح بالدخول إلى الكاميرا من هذا الموقع<br>' + 'من أجل التقاط الصور من الكاميرا يجب عليك الموافقة على هذا الطلب'
          },
          notFound: {
            title: 'لم يتم اكتشاف أي كاميرا',
            text: 'يبدو أنه ليس لديك كاميرا متصلة بهذا الجهاز'
          }
        },
        preview: {
          unknownName: 'غير معروف',
          change: 'إلغاء',
          back: 'الرجوع',
          done: 'إضافة',
          unknown: {
            title: 'جار الرفع ... يرجى الانتظار للحصول على معاينة',
            done: 'تخطي المعاينة والقبول'
          },
          regular: {
            title: 'إضافة هذا الملف؟',
            line1: 'أنت على وشك إضافة الملف أعلاه',
            line2: 'يرجى التأكيد'
          },
          image: {
            title: 'إضافة هذة الصورة',
            change: 'إلغاء'
          },
          crop: {
            title: 'قص وإضافة هذه الصورة',
            done: 'موافق',
            free: 'حر'
          },
          video: {
            title: 'إضافة هذا الفيديو',
            change: 'إلغاء'
          },
          error: {
            default: {
              title: 'عفوا آسف',
              text: 'حدث خطأ أثناء الرفع',
              back: 'حاول مرة اخرى'
            },
            image: {
              title: 'يتم قبول ملفات الصور فقط',
              text: 'الرجاء إعادة المحاولة باستخدام ملف آخر',
              back: 'اختر صورة'
            },
            size: {
              title: 'الملف الذي حددتة يتجاوز الحد المسموح بة',
              text: 'الرجاء إعادة المحاولة باستخدام ملف آخر'
            },
            loadImage: {
              title: 'خطأ',
              text: 'لا يمكن تحميل الصورة'
            }
          },
          multiple: {
            title: 'لقد اخترت %files%',
            question: 'إضافة %files%?',
            tooManyFiles: 'لقد اخترت عددا كبيرا جدا من الملفات %max% هو الحد الأقصى',
            tooFewFiles: 'لقد اخترت %files%. على الأقل %min% مطلوب',
            clear: 'حذف الكل',
            done: 'إضافة',
            file: {
              preview: 'معاينة %file%',
              remove: 'حذف %file%'
            }
          }
        }
      },
      footer: {
        text: 'مدعوم بواسطة',
        link: 'ابلود كير'
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$u = function pluralize(n) {
    var mod;

    if (n === 0) {
      return 'zero';
    }

    if (n === 1) {
      return 'one';
    }

    if (n === 2) {
      return 'two';
    }

    mod = n % 100;

    if (mod >= 3 && mod <= 10) {
      return 'few';
    }

    if (mod >= 11 && mod <= 99) {
      return 'many';
    }

    return 'other';
  };

  var ar = {
    translations: translations$u,
    pluralize: pluralize$u
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$t = {
    uploading: 'Yüklənilir... Lütfən, gözləyin.',
    loadingInfo: 'İnfo yüklənilir...',
    errors: {
      default: 'Xəta',
      baddata: 'Yanlış dəyər',
      size: 'Fayl çox böyükdür',
      upload: 'Yüklənilə bilmədi',
      user: 'Yükləmə ləğv edildi',
      info: 'İnfo yüklənə bilmədi',
      image: 'Yalnız təsvirlərə icazə verilir',
      createGroup: 'Fayl qrupu yaradıla bilmir',
      deleted: 'Fayl silindi'
    },
    draghere: 'Faylı bura atın',
    file: {
      one: '%1 fayl',
      other: '%1 fayl'
    },
    buttons: {
      cancel: 'Ləğv edin',
      remove: 'Silin',
      choose: {
        files: {
          one: 'Fayl seçin',
          other: 'Fayllar seçin'
        },
        images: {
          one: 'Təsvir seçin',
          other: 'Təsvirlər seçin'
        }
      }
    },
    dialog: {
      done: 'Hazırdır',
      showFiles: 'Faylları göstərin',
      tabs: {
        names: {
          'empty-pubkey': 'Xoş gəlmisiniz',
          preview: 'Önbaxış',
          file: 'Lokal Fayllar',
          url: 'İxtiyari linklər',
          camera: 'Kamera',
          gdrive: 'Google Disk'
        },
        file: {
          drag: 'Faylı bura atın',
          nodrop: 'Kompüterinizdən faylları yükləyin',
          cloudsTip: 'Bulud yaddaşlar <br>və sosial xidmətlər',
          or: 'or',
          button: 'Lokal fayl seçin',
          also: 'Həmçinin, buradan seçə bilərsiniz'
        },
        url: {
          title: 'Vebdən fayllar',
          line1: 'Vebdən istənilən faylı götürün.',
          line2: 'Sadəcə, link verin.',
          input: 'Linkinizi bura yerləşdirin...',
          button: 'Yükləyin'
        },
        camera: {
          capture: 'Şəkil çəkin',
          mirror: 'Güzgü',
          retry: 'Yenidən icazə sorğusu göndərin.',
          pleaseAllow: {
            title: 'Lütfən, kameranıza giriş hüququ verin',
            text: 'Bu saytdan kameranıza daxil olmaq icazəsi verildi. ' + 'Kameranız ilə şəkil çəkmək üçün bu sorğunu təsdiq etməlisiniz.'
          },
          notFound: {
            title: 'Kamera aşkar edilmədi',
            text: 'Görünür, bu cihaza kamera qoşulmayıb.'
          }
        },
        preview: {
          unknownName: 'naməlum',
          change: 'Ləğv edin',
          back: 'Geri',
          done: 'Əlavə edin',
          unknown: {
            title: 'Yüklənilir... Lütfən, önbaxış üçün gözləyin.',
            done: 'Önbaxışı ötürün və qəbul edin'
          },
          regular: {
            title: 'Bu fayl əlavə edilsin?',
            line1: 'Yuxarıdakı faylı əlavə etmək üzrəsiniz.',
            line2: 'Lütfən, təsdiq edin.'
          },
          image: {
            title: 'Bu təsvir əlavə edilsin?',
            change: 'Ləğv edin'
          },
          crop: {
            title: 'Bu təsviri kəsin və əlavə edin',
            done: 'Hazırdır',
            free: 'pulsuz'
          },
          error: {
            default: {
              title: 'Ups!',
              text: 'Yükləmə zamanı nəsə xəta baş verdi.',
              back: 'Lütfən, y enidən cəhd edin.'
            },
            image: {
              title: 'Yaınız təsvir faylları qəbul olunur.',
              text: 'Lütfən, başqa fayl ilə cəhd edin.',
              back: 'Təsvir seçin'
            },
            size: {
              title: 'Seçdiyiniz fayl limiti keçir.',
              text: 'Lütfən, başqa fayl ilə cəhd edin.'
            },
            loadImage: {
              title: 'Xəta',
              text: 'Təsvir yüklənilə bilmir'
            }
          },
          multiple: {
            title: '%files% fayl seçdiniz.',
            question: 'Bütün bu faylları əlavə etmək istəyirsiniz?',
            tooManyFiles: 'Həddindən çox fayl seçdiniz. %max% maksimumdur.',
            tooFewFiles: '%files% fayl seçdiniz. Ən azı %min% tələb olunur.',
            clear: 'Hamısını silin',
            done: 'Hazırdır'
          }
        }
      }
    }
  };

  var pluralize$t = function pluralize(n) {
    return 'other';
  };

  var az = {
    translations: translations$t,
    pluralize: pluralize$t
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$s = {
    uploading: 'Carregant... Si us plau esperi.',
    loadingInfo: 'Carregant informació...',
    errors: {
      default: 'Error',
      baddata: 'Valor incorrecte',
      size: 'Massa gran',
      upload: "No s'ha pogut carregar",
      user: 'Carrega cancel·lada',
      info: "No s'ha pogut carregar la informació",
      image: 'Només es permeten imatges',
      createGroup: "No es pot crear el grup d'arxius",
      deleted: 'Fitxer eliminat'
    },
    draghere: 'Arrossega els fitxers fins aquí',
    file: {
      one: '%1 fitxer',
      other: '%1 fitxers'
    },
    buttons: {
      cancel: 'Cancel·lar',
      remove: 'Eliminar',
      choose: {
        files: {
          one: 'Escull un fitxer',
          other: 'Escull fitxers'
        },
        images: {
          one: 'Escull una imatge',
          other: 'Escull imatges'
        }
      }
    },
    dialog: {
      done: 'Fet',
      showFiles: 'Mostra fitxers',
      tabs: {
        names: {
          'empty-pubkey': 'Benvingut',
          preview: 'Avanci',
          file: 'Ordinador',
          url: 'Enllaços arbitraris',
          camera: 'Càmera'
        },
        file: {
          drag: 'Arrossega un fitxer aquí',
          nodrop: 'Carrega fitxers des del teu ordinador',
          cloudsTip: 'Emmagatzematge al núvol<br>i xarxes socials',
          or: 'o',
          button: 'Escull un fitxer des del teu ordinador',
          also: 'També pots seleccionar-lo de'
        },
        url: {
          title: 'Fitxers de la web',
          line1: 'Selecciona qualsevol fitxer de la web.',
          line2: 'Només proporcioni el link.',
          input: 'Copiï el link aquí...',
          button: 'Pujar'
        },
        camera: {
          capture: 'Realitza una foto',
          mirror: 'Mirall',
          retry: 'Demanar permisos una altra vegada',
          pleaseAllow: {
            title: 'Si us plau, permet accés a la teva càmera',
            text: "Aquest lloc t'ha demanat de permetre accés a la càmera. " + "Per tal de realitzar imatges amb la teva càmera has d'acceptar aquesta petició."
          },
          notFound: {
            title: "No s'ha detectat cap càmera",
            text: 'Sembla que no tens cap càmera connectada a aquest dispositiu.'
          }
        },
        preview: {
          unknownName: 'desconegut',
          change: 'Cancel·lar',
          back: 'Endarrere',
          done: 'Pujar',
          unknown: {
            title: 'Carregant. Si us plau esperi per la visualització prèvia.',
            done: 'Saltar visualització prèvia i acceptar'
          },
          regular: {
            title: 'Vols pujar aquest fitxer?',
            line1: 'Estàs a punt de pujar el fitxer superior.',
            line2: 'Confirmi, si us plau.'
          },
          image: {
            title: 'Vols pujar aquesta imatge?',
            change: 'Cancel·lar'
          },
          crop: {
            title: 'Tallar i pujar aquesta imatge',
            done: 'Fet',
            free: 'lliure'
          },
          error: {
            default: {
              title: 'La pujada ha fallat!',
              text: "S'ha produït un error durant la pujada.",
              back: 'Si us plau, provi-ho de nou.'
            },
            image: {
              title: "Només s'accepten fitxers d'imatges.",
              text: 'Si us plau, provi-ho de nou amb un altre fitxer.',
              back: 'Escull imatge'
            },
            size: {
              title: 'La mida del fitxer que has seleccionat sobrepassa el límit.',
              text: 'Si us plau, provi-ho de nou amb un altre fitxer.'
            },
            loadImage: {
              title: 'Error',
              text: "No s'ha pogut carregar la imatge"
            }
          },
          multiple: {
            title: "N'has escollit %files%",
            question: 'Vols afegir tots aquests fitxers?',
            tooManyFiles: 'Has escollit massa fitxers. %max% és el màxim.',
            tooFewFiles: 'Has escollit %files%. Com a mínim en calen %min%.',
            clear: 'Eliminar-los tots',
            done: 'Fet'
          }
        }
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$s = function pluralize(n) {
    if (n === 1) {
      return 'one';
    }

    return 'other';
  };

  var ca = {
    translations: translations$s,
    pluralize: pluralize$s
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$r = {
    uploading: 'Nahrávám... Malý moment.',
    loadingInfo: 'Nahrávám informace...',
    errors: {
      default: 'Chyba',
      baddata: 'Neplatná hodnota',
      size: 'Soubor je příliš velký',
      upload: 'Nelze nahrát',
      user: 'Nahrávání zrušeno',
      info: 'Nelze nahrát informace',
      image: 'Lze nahrát pouze obrázky',
      createGroup: 'Nelze vytvořit adresář',
      deleted: 'Soubor byl smazán'
    },
    draghere: 'Přetáhněte soubor sem',
    file: {
      one: '%1 soubor',
      few: '%1 soubory',
      many: '%1 souborů'
    },
    buttons: {
      cancel: 'Zrušit',
      remove: 'Odstranit',
      choose: {
        files: {
          one: 'Vyberte soubor',
          other: 'Vyberte soubory'
        },
        images: {
          one: 'Vyberte obrázek',
          other: 'Vyberte obrázky'
        }
      }
    },
    dialog: {
      done: 'Hotovo',
      showFiles: 'Zobrazit soubory',
      tabs: {
        names: {
          'empty-pubkey': 'Vítejte',
          preview: 'Náhled',
          file: 'Soubor z počítače',
          url: 'Soubor z internetu',
          camera: 'Webkamera',
          facebook: 'Facebook',
          dropbox: 'Dropbox',
          gdrive: 'Google Drive',
          instagram: 'Instagram',
          vk: 'VK',
          evernote: 'Evernote',
          box: 'Box',
          onedrive: 'OneDrive',
          flickr: 'Flickr',
          huddle: 'Huddle'
        },
        file: {
          drag: 'Přetáhněte soubor sem',
          nodrop: 'Nahrajte soubory z vašeho počítače',
          cloudsTip: 'Cloudové úložiště<br>a sociální sítě',
          or: 'nebo',
          button: 'Vyberte soubor z počítače',
          also: 'Můžete také nahrát soubor z'
        },
        url: {
          title: 'Soubory z internetu',
          line1: 'Nahrajte jakýkoliv soubor z internetu.',
          line2: 'Stačí vložit odkaz.',
          input: 'Odkaz vložte zde...',
          button: 'Nahrát'
        },
        camera: {
          capture: 'Pořídit fotografii',
          mirror: 'Zrcadlo',
          retry: 'Znovu požádat o povolení',
          pleaseAllow: {
            title: 'Prosím povolte přístup k webkameře',
            text: 'Byl(a) jste požádán(a) o přístup k webkameře. ' + 'Abyste mohl(a) pořídit fotografii, musíte přístup povolit.'
          },
          notFound: {
            title: 'Nebyla nalezena webkamera',
            text: 'Zdá se, že k tomuto zařízení není připojena žádná webkamera.'
          }
        },
        preview: {
          unknownName: 'neznámý',
          change: 'Zrušit',
          back: 'Zpět',
          done: 'Přidat',
          unknown: {
            title: 'Nahrávám... Prosím vyčkejte na náhled.',
            done: 'Přeskočit náhled a odeslat'
          },
          regular: {
            title: 'Přidat tento soubor?',
            line1: 'Tímto přidáte výše vybraný soubor.',
            line2: 'Prosím potvrďte.'
          },
          image: {
            title: 'Přidat tento obrázek?',
            change: 'Zrušit'
          },
          crop: {
            title: 'Oříznout a přidat tento obrázek',
            done: 'Hotovo',
            free: 'zdarma'
          },
          error: {
            default: {
              title: 'Jejda!',
              text: 'Něco se v průběhu nahrávání nepodařilo.',
              back: 'Zkuste to prosím znovu.'
            },
            image: {
              title: 'Lze nahrávat pouze obrázky.',
              text: 'Zkuste to prosím s jiným souborem.',
              back: 'Vyberte obrázek'
            },
            size: {
              title: 'Soubor přesahuje povolenou velikost.',
              text: 'Prosím zkuste to s jiným souborem.'
            },
            loadImage: {
              title: 'Chyba',
              text: 'Nelze nahrát obrázek'
            }
          },
          multiple: {
            title: 'Bylo vybráno %files% souborů',
            question: 'Chcete přidat všechny tyto soubory?',
            tooManyFiles: 'Bylo vybráno moc souborů. Maximum je %max%',
            tooFewFiles: 'Bylo vybráno %files% souborů. Musíte vybrat minimálně %min%',
            clear: 'Odstranit vše',
            done: 'Hotovo'
          }
        }
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$r = function pluralize(n) {
    if (n === 1) {
      return 'one';
    } else if (n >= 2 && n <= 4) {
      return 'few';
    } else {
      return 'many';
    }
  };

  var cs = {
    translations: translations$r,
    pluralize: pluralize$r
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$q = {
    uploading: 'Uploader... Vent venligst.',
    loadingInfo: 'Henter information...',
    errors: {
      default: 'Fejl',
      baddata: 'Forkert værdi',
      size: 'Filen er for stor',
      upload: 'Kan ikke uploade / sende fil',
      user: 'Upload fortrudt',
      info: 'Kan ikke hente information',
      image: 'Kun billeder er tilladt',
      createGroup: 'Kan ikke oprette fil gruppe',
      deleted: 'Filen blev slettet'
    },
    draghere: 'Drop en fil her',
    file: {
      one: '%1 fil',
      other: '%1 filer'
    },
    buttons: {
      cancel: 'Annuller',
      remove: 'Fjern',
      choose: {
        files: {
          one: 'Vælg en fil',
          other: 'Vælg filer'
        },
        images: {
          one: 'Vælg et billede',
          other: 'Vælg billeder'
        }
      }
    },
    dialog: {
      done: 'Færdig',
      showFiles: 'Vis filer',
      tabs: {
        names: {
          preview: 'Vis',
          file: 'Computer',
          gdrive: 'Google Drev',
          url: 'Direkte link'
        },
        file: {
          drag: 'Drop en fil her',
          nodrop: 'Hent filer fra din computer',
          or: 'eller',
          button: 'Hent fil fra din computer',
          also: 'Du kan også hente fra'
        },
        url: {
          title: 'Filer fra en Web adresse',
          line1: 'Vælg en fil fra en web adresse.',
          line2: 'Skriv bare linket til filen.',
          input: 'Indsæt link her...',
          button: 'Upload / Send'
        },
        preview: {
          unknownName: 'ukendt',
          change: 'Annuller',
          back: 'Tilbage',
          done: 'Fortsæt',
          unknown: {
            title: 'Uploader / sender... Vent for at se mere.',
            done: 'Fortsæt uden at vente på resultat'
          },
          regular: {
            title: 'Tilføje fil?',
            line1: 'Du er ved at tilføje filen ovenfor.',
            line2: 'Venligst accepter.'
          },
          image: {
            title: 'Tilføj billede?',
            change: 'Annuller'
          },
          crop: {
            title: 'Beskær og tilføj dette billede',
            done: 'Udfør'
          },
          error: {
            default: {
              title: 'Hov!',
              text: 'Noget gik galt under upload.',
              back: 'Venligst prøv igen'
            },
            image: {
              title: 'Du kan kun vælge billeder.',
              text: 'Prøv igen med en billedfil.',
              back: 'Vælg billede'
            },
            size: {
              title: 'Den fil du valgte, er desværre større end tilladt.',
              text: 'Venligst prøv med en mindre fil.'
            },
            loadImage: {
              title: 'Fejl',
              text: 'Kan ikke åbne billede'
            }
          },
          multiple: {
            title: 'Du har valgt %files% filer',
            question: 'Vil du tilføje alle disse filer?',
            tooManyFiles: 'Du har valgt for mange filer. %max% er maximum.',
            tooFewFiles: 'Du har valgt %files% filer. Men du skal vælge mindst %min%.',
            clear: 'Fjern alle',
            done: 'Fortsæt'
          }
        }
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$q = function pluralize(n) {
    if (n === 1) {
      return 'one';
    }

    return 'other';
  };

  var da = {
    translations: translations$q,
    pluralize: pluralize$q
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$p = {
    uploading: 'Upload läuft… Bitte warten…',
    loadingInfo: 'Informationen werden geladen…',
    errors: {
      default: 'Fehler',
      baddata: 'Falscher Wert',
      size: 'Datei zu groß',
      upload: 'Kann nicht hochgeladen werden',
      user: 'Hochladen abgebrochen',
      info: 'Informationen können nicht geladen werden',
      image: 'Nur Bilder sind erlaubt',
      createGroup: 'Datei-Gruppe kann nicht erstellt werden',
      deleted: 'Datei wurde gelöscht'
    },
    draghere: 'Ziehen Sie eine Datei hierhin',
    file: {
      one: '%1 Datei',
      other: '%1 Dateien'
    },
    buttons: {
      cancel: 'Abbrechen',
      remove: 'Löschen',
      choose: {
        files: {
          one: 'Datei auswählen',
          other: 'Dateien auswählen'
        },
        images: {
          one: 'Bild auswählen',
          other: 'Bilder auswählen'
        }
      }
    },
    dialog: {
      close: 'Schließen',
      openMenu: 'Menü öffnen',
      done: 'Fertig',
      showFiles: 'Dateien anzeigen',
      tabs: {
        names: {
          'empty-pubkey': 'Willkommen',
          preview: 'Vorschau',
          file: 'Lokale Dateien',
          url: 'Web-Links',
          camera: 'Kamera'
        },
        file: {
          drag: 'Ziehen Sie eine Datei hierhin',
          nodrop: 'Laden Sie Dateien von Ihrem PC hoch',
          cloudsTip: 'Cloud-Speicher<br>und soziale Dienste',
          or: 'oder',
          button: 'Wählen Sie eine Datei',
          also: 'Sie können sie auch Dateien wählen aus'
        },
        url: {
          title: 'Eine Datei aus dem Web hochladen',
          line1: 'Sie können eine Datei aus dem Internet hochladen.',
          line2: 'Geben Sie hier einfach den Link ein.',
          input: 'Bitte geben Sie hier den Link ein…',
          button: 'Hochladen'
        },
        camera: {
          title: 'Foto mit Webcam aufnehmen',
          capture: 'Machen Sie ein Foto',
          mirror: 'Andere Kamera',
          retry: 'Berechtigungen erneut anfordern',
          pleaseAllow: {
            title: 'Bitte erlauben Sie den Zugriff auf Ihre Kamera',
            text: 'Sie wurden gebeten, dieser Website den Zugriff auf Ihre Kamera zu erlauben. Um mit Ihrer Kamera Fotos machen zu können, müssen Sie diese Erlaubnis erteilen.'
          },
          notFound: {
            title: 'Keine Kamera gefunden',
            text: 'Es sieht so aus, als hätten Sie keine Kamera an dieses Gerät angeschlossen.'
          }
        },
        preview: {
          unknownName: 'nicht bekannt',
          change: 'Abbrechen',
          back: 'Zurück',
          done: 'Hinzufügen',
          unknown: {
            title: 'Upload läuft… Bitte warten Sie auf die Vorschau.',
            done: 'Vorschau überspringen und Datei annehmen'
          },
          regular: {
            title: 'Diese Datei hinzufügen?',
            line1: 'Diese Datei wird nun hinzugefügt.',
            line2: 'Bitte bestätigen Sie.'
          },
          image: {
            title: 'Nur Bilder sind akzeptiert.',
            text: 'Bitte veruschen Sie es erneut mit einer anderen Datei.',
            back: 'Bild wählen'
          },
          error: {
            default: {
              title: 'Oops!',
              text: 'Etwas ist während dem Hochladen schief gelaufen.',
              back: 'Bitte versuchen Sie es erneut'
            },
            image: {
              title: 'Nur Bilder sind akzeptiert.',
              text: 'Bitte veruschen Sie es erneut mit einer anderen Datei.',
              back: 'Bild wählen'
            },
            size: {
              title: 'Die gewählte Datei ist zu groß.',
              text: 'Bitte versuchen Sie es erneut mit einer anderen Datei.'
            },
            loadImage: {
              title: 'Fehler',
              text: 'Das Bild kann nicht geladen werden'
            }
          },
          multiple: {
            title: 'Sie haben %files% Dateien gewählt',
            question: 'Möchten Sie all diese Dateien hinzufügen?',
            tooManyFiles: 'Sie haben zu viele Dateien gewählt. %max% ist das Maximum.',
            tooFewFiles: 'Sie haben %files% Dateien gewählt. Es sind mindestens %min% nötig.',
            clear: 'Alle löschen',
            done: 'Fertig',
            file: {
              preview: 'Vorschau: %file%',
              remove: 'Datei löschen: %file%'
            }
          }
        }
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$p = function pluralize(n) {
    if (n === 1) {
      return 'one';
    }

    return 'other';
  };

  var de = {
    translations: translations$p,
    pluralize: pluralize$p
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$o = {
    loadingInfo: 'Φόρτωση πληροφοριών...',
    errors: {
      default: 'Σφάλμα',
      baddata: 'Λανθασμένη αξία',
      size: 'Πολύ μεγάλο αρχείο',
      upload: 'Δεν μπορεί να γίνει φόρτωση',
      user: 'Η φόρτωση ακυρώθηκε',
      info: 'Δεν μπορούν να φορτωθούν πληροφορίες',
      image: 'Μόνο εικόνες επιτρέπονται',
      createGroup: 'Δεν μπορεί να δημιουργηθεί ομάδα αρχείων',
      deleted: 'Το αρχείο διαγράφηκε'
    },
    uploading: 'Φόρτωση... Παρακαλούμε περιμένετε.',
    draghere: 'Αποθέστε ένα αρχείο εδώ',
    file: {
      one: '%1 αρχείο',
      other: '%1 αρχεία'
    },
    buttons: {
      cancel: 'Ακύρωση',
      remove: 'Κατάργηση',
      choose: {
        files: {
          one: 'Επιλέξτε ένα αρχείο',
          other: 'Επιλέξτε αρχεία'
        },
        images: {
          one: 'Επιλέξτε μία εικόνα',
          other: 'Επιλέξτε εικόνες'
        }
      }
    },
    dialog: {
      close: 'Κλείσιμο',
      openMenu: 'Άνοιγμα μενού',
      done: 'Εντάξει',
      showFiles: 'Προβολή αρχείων',
      tabs: {
        names: {
          'empty-pubkey': 'Καλώς ήρθατε',
          preview: 'Προεπισκόπηση',
          file: 'Τοπικά αρχεία',
          url: 'Απευθείας σύνδεσμος',
          camera: 'Κάμερα',
          facebook: 'Facebook',
          dropbox: 'Dropbox',
          gdrive: 'Google Drive',
          instagram: 'Instagram',
          gphotos: 'Google Photos',
          vk: 'VK',
          evernote: 'Evernote',
          box: 'Box',
          onedrive: 'OneDrive',
          flickr: 'Flickr',
          huddle: 'Huddle'
        },
        file: {
          drag: 'σύρετε & αποθέστε<br>οποιαδήποτε αρχεία',
          nodrop: 'Φορτώστε αρχεία από τον&nbsp;υπολογιστή σας',
          cloudsTip: 'Αποθήκευση νέφους<br>και κοινωνικά δίκτυα',
          or: 'ή',
          button: 'Επιλέξτε ένα τοπικό αρχείο',
          also: 'ή επιλέξτε από'
        },
        url: {
          title: 'Αρχεία από τον Ιστό',
          line1: 'Πάρτε οποιοδήποτε αρχείο από το διαδίκτυο.',
          line2: 'Γράψτε απλώς τον σύνδεσμο.',
          input: 'Επικολλήστε τον σύνδεσμό σας εδώ...',
          button: 'Φόρτωση'
        },
        camera: {
          title: 'Αρχείο από κάμερα web',
          capture: 'Τραβήξτε μια φωτογραφία',
          mirror: 'Καθρέφτης',
          startRecord: 'Εγγραφή βίντεο',
          cancelRecord: 'Ακύρωση',
          stopRecord: 'Διακοπή',
          retry: 'Νέο αίτημα για άδεια',
          pleaseAllow: {
            text: 'Έχετε δεχτεί υπόδειξη να επιτρέψετε την πρόσβαση στην κάμερα από αυτόν τον ιστότοπο.<br>Για να τραβήξετε φωτογραφίες με την κάμερά σας πρέπει να εγκρίνετε αυτό το αίτημα.',
            title: 'Παρακαλούμε επιτρέψτε την πρόσβαση στην κάμερά σας'
          },
          notFound: {
            title: 'Δεν εντοπίστηκε κάμερα',
            text: 'Φαίνεται ότι δεν έχετε κάμερα συνδεδεμένη με αυτή τη συσκευή.'
          }
        },
        preview: {
          unknownName: 'άγνωστο',
          change: 'Ακύρωση',
          back: 'Πίσω',
          done: 'Προσθήκη',
          unknown: {
            title: 'Φόρτωση... Παρακαλούμε περιμένετε για προεπισκόπηση.',
            done: 'Παράλειψη επισκόπησης και αποδοχή'
          },
          regular: {
            title: 'Να προστεθεί αυτό το αρχείο;',
            line1: 'Πρόκειται να προσθέσετε το παραπάνω αρχείο.',
            line2: 'Παρακαλούμε επιβεβαιώστε.'
          },
          image: {
            title: 'Να προστεθεί αυτή η εικόνα;',
            change: 'Ακύρωση'
          },
          crop: {
            title: 'Περικοπή και προσθήκη αυτής της εικόνας',
            done: 'Εντάξει',
            free: 'δωρεάν'
          },
          video: {
            title: 'Να προστεθεί αυτό το βίντεο;',
            change: 'Ακύρωση'
          },
          error: {
            default: {
              title: 'Ουπς!',
              back: 'Παρακαλούμε προσπαθήστε ξανά',
              text: 'Κάτι πήγε στραβά κατά τη φόρτωση.'
            },
            image: {
              title: 'Μόνο αρχεία εικόνων γίνονται δεκτά.',
              text: 'Δοκιμάστε ξανά με άλλο αρχείο.',
              back: 'Επιλέξτε εικόνα'
            },
            size: {
              title: 'Το αρχείο που επιλέξατε υπερβαίνει το όριο.',
              text: 'Δοκιμάστε ξανά με άλλο αρχείο.'
            },
            loadImage: {
              title: 'Σφάλμα',
              text: 'Δεν μπορεί να φορτωθεί η εικόνα'
            }
          },
          multiple: {
            title: 'Έχετε επιλέξει %files%',
            question: 'Προσθήκη %files%;',
            tooManyFiles: 'Έχετε επιλέξει πάρα πολλά αρχεία. Το μέγιστο είναι %max%.',
            tooFewFiles: 'Έχετε επιλέξει %files%. Απαιτούνται τουλάχιστον %min%.',
            clear: 'Κατάργηση όλων',
            file: {
              preview: 'Προεπισκόπηση %file%',
              remove: 'Αφαίρεση %file%'
            },
            done: 'Προσθήκη'
          }
        }
      },
      footer: {
        text: 'παρέχεται από',
        link: 'uploadcare'
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$o = function pluralize(n) {
    if (n === 1) {
      return 'one';
    }

    return 'other';
  };

  var el = {
    translations: translations$o,
    pluralize: pluralize$o
  }; // #
  // # English locale is the default and used as a fallback.
  // #

  var translations$n = {
    uploading: 'Uploading... Please wait.',
    loadingInfo: 'Loading info...',
    errors: {
      default: 'Error',
      baddata: 'Incorrect value',
      size: 'File too big',
      upload: 'Can’t upload',
      user: 'Upload canceled',
      info: 'Can’t load info',
      image: 'Only images allowed',
      createGroup: 'Can’t create file group',
      deleted: 'File was deleted'
    },
    draghere: 'Drop a file here',
    file: {
      one: '%1 file',
      other: '%1 files'
    },
    buttons: {
      cancel: 'Cancel',
      remove: 'Remove',
      choose: {
        files: {
          one: 'Choose a file',
          other: 'Choose files'
        },
        images: {
          one: 'Choose an image',
          other: 'Choose images'
        }
      }
    },
    dialog: {
      close: 'Close',
      openMenu: 'Open menu',
      done: 'Done',
      showFiles: 'Show files',
      tabs: {
        names: {
          'empty-pubkey': 'Welcome',
          preview: 'Preview',
          file: 'Local Files',
          url: 'Direct Link',
          camera: 'Camera',
          facebook: 'Facebook',
          dropbox: 'Dropbox',
          gdrive: 'Google Drive',
          gphotos: 'Google Photos',
          instagram: 'Instagram',
          vk: 'VK',
          evernote: 'Evernote',
          box: 'Box',
          onedrive: 'OneDrive',
          flickr: 'Flickr',
          huddle: 'Huddle',
          nft: 'NFT'
        },
        file: {
          drag: 'drag & drop<br>any files',
          nodrop: 'Upload files from your&nbsp;computer',
          cloudsTip: 'Cloud storages<br>and social networks',
          or: 'or',
          button: 'Choose a local file',
          also: 'or choose from'
        },
        url: {
          title: 'Files from the Web',
          line1: 'Grab any file off the web.',
          line2: 'Just provide the link.',
          input: 'Paste your link here...',
          button: 'Upload'
        },
        camera: {
          title: 'File from web camera',
          capture: 'Take a photo',
          mirror: 'Mirror',
          startRecord: 'Record a video',
          stopRecord: 'Stop',
          cancelRecord: 'Cancel',
          retry: 'Request permissions again',
          pleaseAllow: {
            title: 'Please allow access to your camera',
            text: 'You have been prompted to allow camera access from this site.<br>' + 'In order to take pictures with your camera you must approve this request.'
          },
          notFound: {
            title: 'No camera detected',
            text: 'Looks like you have no camera connected to this device.'
          }
        },
        preview: {
          unknownName: 'unknown',
          change: 'Cancel',
          back: 'Back',
          done: 'Add',
          unknown: {
            title: 'Uploading... Please wait for a preview.',
            done: 'Skip preview and accept'
          },
          regular: {
            title: 'Add this file?',
            line1: 'You are about to add the file above.',
            line2: 'Please confirm.'
          },
          image: {
            title: 'Add this image?',
            change: 'Cancel'
          },
          crop: {
            title: 'Crop and add this image',
            done: 'Done',
            free: 'free'
          },
          video: {
            title: 'Add this video?',
            change: 'Cancel'
          },
          error: {
            default: {
              title: 'Oops!',
              text: 'Something went wrong during the upload.',
              back: 'Please try again'
            },
            image: {
              title: 'Only image files are accepted.',
              text: 'Please try again with another file.',
              back: 'Choose image'
            },
            size: {
              title: 'The file you selected exceeds the limit.',
              text: 'Please try again with another file.'
            },
            loadImage: {
              title: 'Error',
              text: 'Can’t load image'
            }
          },
          multiple: {
            title: 'You’ve chosen %files%.',
            question: 'Add %files%?',
            tooManyFiles: 'You’ve chosen too many files. %max% is maximum.',
            tooFewFiles: 'You’ve chosen %files%. At least %min% required.',
            clear: 'Remove all',
            done: 'Add',
            file: {
              preview: 'Preview %file%',
              remove: 'Remove %file%'
            }
          }
        }
      },
      footer: {
        text: 'powered by',
        link: 'uploadcare'
      }
    },
    serverErrors: {
      AccountBlockedError: "Administrator's account has been blocked. Please, contact support.",
      AccountUnpaidError: "Administrator's account has been blocked. Please, contact support.",
      AccountLimitsExceededError: "Administrator's account has reached its limits. Please, contact support.",
      FileSizeLimitExceededError: 'File is too large.',
      MultipartFileSizeLimitExceededError: 'File is too large.',
      FileTypeForbiddenOnCurrentPlanError: 'Uploading of these files types is not allowed.',
      DownloadFileSizeLimitExceededError: 'Downloaded file is too big.'
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$n = function pluralize(n) {
    if (n === 1) {
      return 'one';
    }

    return 'other';
  };

  var en = {
    pluralize: pluralize$n,
    translations: translations$n
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$m = {
    uploading: 'Subiendo... Por favor espere.',
    loadingInfo: 'Cargando información...',
    errors: {
      default: 'Error',
      baddata: 'Valor incorrecto',
      size: 'Archivo demasiado grande',
      upload: 'No se puede subir',
      user: 'Subida cancelada',
      info: 'No se puede cargar la información',
      image: 'Solo se permiten imágenes',
      createGroup: 'No se puede crear el grupo de archivos',
      deleted: 'El archivo fue eliminado'
    },
    draghere: 'Arrastra un archivo aquí',
    file: {
      one: '%1 archivo',
      other: '%1 archivos'
    },
    buttons: {
      cancel: 'Cancelar',
      remove: 'Eliminar',
      choose: {
        files: {
          one: 'Escoge un archivo',
          other: 'Escoge archivos'
        },
        images: {
          one: 'Escoge una imagen',
          other: 'Escoge imágenes'
        }
      }
    },
    dialog: {
      close: 'Cerrar',
      openMenu: 'Menú abierto',
      done: 'Hecho',
      showFiles: 'Mostrar archivos',
      tabs: {
        names: {
          'empty-pubkey': 'Bienvenido',
          preview: 'Previsualización',
          file: 'Archivos locales',
          url: 'Enlaces arbitrarios',
          camera: 'Cámara'
        },
        file: {
          drag: 'Arrastra un archivo aquí',
          nodrop: 'Sube fotos desde tu dispositivo',
          cloudsTip: 'Almacenamiento en la nube<br>y redes sociales',
          or: 'o',
          button: 'Elige un archivo de tu dispositivo',
          also: 'Tambien puedes seleccionarlo de'
        },
        url: {
          title: 'Archivos de la Web',
          line1: 'Coge cualquier archivo de la web.',
          line2: 'Solo danos el link.',
          input: 'Pega tu link aquí...',
          button: 'Subir'
        },
        camera: {
          title: 'Archivo desde la cámara web',
          capture: 'Hacer una foto',
          mirror: 'Espejo',
          startRecord: 'Grabar un video',
          stopRecord: 'Detener',
          cancelRecord: 'Cancelar',
          retry: 'Solicitar permisos de nuevo',
          pleaseAllow: {
            title: 'Por favor, permite el acceso a tu cámara',
            text: 'Este sitio ha pedido permiso para acceder a la cámara. ' + 'Para tomar imágenes con tu cámara debes aceptar esta petición.'
          },
          notFound: {
            title: 'No se ha detectado ninguna cámara',
            text: 'Parece que no tienes ninguna cámara conectada a este dispositivo.'
          }
        },
        preview: {
          unknownName: 'desconocido',
          change: 'Cancelar',
          back: 'Atrás',
          done: 'Añadir',
          unknown: {
            title: 'Subiendo. Por favor espera para una vista previa.',
            done: 'Saltar vista previa y aceptar'
          },
          regular: {
            title: '¿Quieres subir este archivo?',
            line1: 'Estás a punto de subir el archivo de arriba.',
            line2: 'Confírmalo por favor.'
          },
          image: {
            title: '¿Quieres subir esta imagen?',
            change: 'Cancelar'
          },
          crop: {
            title: 'Cortar y añadir esta imagen',
            done: 'Listo',
            free: 'libre'
          },
          video: {
            title: '¿Añadir este video?',
            change: 'Cancelar'
          },
          error: {
            default: {
              title: 'Ups!',
              text: 'Algo salió mal durante la subida.',
              back: 'Por favor, inténtalo de nuevo.'
            },
            image: {
              title: 'Solo se aceptan archivos de imagen.',
              text: 'Por favor, inténtalo de nuevo con otro archivo.',
              back: 'Escoger imagen'
            },
            size: {
              title: 'El archivo que has seleccinado excede el límite.',
              text: 'Por favor, inténtalo de nuevo con otro archivo.'
            },
            loadImage: {
              title: 'Error',
              text: 'No puede cargar la imagen'
            }
          },
          multiple: {
            title: 'Has escogido %files%',
            question: '¿Quieres añadir todos estos archivos?',
            tooManyFiles: 'Has escogido demasiados archivos. %max% es el máximo.',
            tooFewFiles: 'Has escogido %files%. Hacen falta al menos %min%.',
            clear: 'Eliminar todo',
            done: 'Hecho',
            file: {
              preview: 'Vista previa %file%',
              remove: 'Quitar %file%'
            }
          }
        }
      },
      footer: {
        text: 'alimentado por'
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$m = function pluralize(n) {
    if (n === 1) {
      return 'one';
    }

    return 'other';
  };

  var es = {
    translations: translations$m,
    pluralize: pluralize$m
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$l = {
    uploading: 'Üleslaadimine… Palun oota.',
    loadingInfo: 'Info laadimine...',
    errors: {
      default: 'Viga',
      baddata: 'Incorrect value',
      size: 'Fail on liiga suur',
      upload: 'Ei saa üles laadida',
      user: 'Üleslaadimine tühistatud',
      info: 'Ei saa infot laadida',
      image: 'Ainult pildid lubatud',
      createGroup: 'Ei saa luua failigruppi',
      deleted: 'Fail on kustutatud'
    },
    draghere: 'Tiri fail siia',
    file: {
      one: '%1 fail',
      other: '%1 failid'
    },
    buttons: {
      cancel: 'Tühista',
      remove: 'Kustuta',
      choose: {
        files: {
          one: 'Vali fail',
          other: 'Vali failid'
        },
        images: {
          one: 'Vali pilt',
          other: 'Vali pildid'
        }
      }
    },
    dialog: {
      done: 'Valmis',
      showFiles: 'Näita faile',
      tabs: {
        names: {
          'empty-pubkey': 'Tere',
          preview: 'Eelvaade',
          file: 'Failid Kõvakettalt',
          url: 'Veebilink',
          camera: 'Kaamera'
        },
        file: {
          drag: 'Tiri failid siia',
          nodrop: 'Lae failid arvutist',
          cloudsTip: 'Pilv<br>ja sotsiaalmeedia',
          or: 'või',
          button: 'Vali fail kõvakettalt',
          also: 'Saad samuti valida'
        },
        url: {
          title: 'Failid veebist',
          line1: 'Ükskõik mis fail otse veebist.',
          line2: 'Lihtsalt sisesta URL.',
          input: 'Kleebi link siia...',
          button: 'Lae üles'
        },
        camera: {
          capture: 'Take a photo',
          mirror: 'Mirror',
          startRecord: 'Record a video',
          stopRecord: 'Stop',
          cancelRecord: 'Cancel',
          retry: 'Request permissions again',
          pleaseAllow: {
            title: 'Please allow access to your camera',
            text: 'You have been prompted to allow camera access from this site. ' + 'In order to take pictures with your camera you must approve this request.'
          },
          notFound: {
            title: 'No camera detected',
            text: 'Looks like you have no camera connected to this device.'
          }
        },
        preview: {
          unknownName: 'teadmata',
          change: 'Tühista',
          back: 'Tagasi',
          done: 'Lisa',
          unknown: {
            title: 'Üleslaadimine... Palun oota eelvaadet.',
            done: 'Jäta eelvaade vahele ja nõustu'
          },
          regular: {
            title: 'Lisa see fail?',
            line1: 'Oled lisamas ülaltoodud faili.',
            line2: 'Palun kinnita.'
          },
          image: {
            title: 'Lisa pilt?',
            change: 'Tühista'
          },
          crop: {
            title: 'Lõika ja lisa pilt',
            done: 'Valmis',
            free: 'vaba'
          },
          video: {
            title: 'Lisa video?',
            change: 'Tühista'
          },
          error: {
            default: {
              title: 'Oihh!',
              text: 'Midagi läks üleslaadimisel valesti.',
              back: 'Palun proovi uuesti'
            },
            image: {
              title: 'Ainult pildifailid on lubatud.',
              text: 'Palun proovi uuesti teise failiga.',
              back: 'Vali pilt'
            },
            size: {
              title: 'Valitud fail ületab maksimaalse suuruse.',
              text: 'Palun proovi uuesti teise failiga.'
            },
            loadImage: {
              title: 'Viga',
              text: 'Ei saa pilti laadida'
            }
          },
          multiple: {
            title: 'Oled valinud %files%',
            question: 'Kas sa soovid lisada kõik failid?',
            tooManyFiles: 'Oled valinud liiga suure hulga faile. %max% on maksimaalne.',
            tooFewFiles: 'Oled valinud %files%. Vähemalt %min% nõutud.',
            clear: 'Eemalda kõik',
            done: 'Valmis'
          }
        }
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$l = function pluralize(n) {
    if (n === 1) {
      return 'one';
    }

    return 'other';
  };

  var et = {
    translations: translations$l,
    pluralize: pluralize$l
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$k = {
    uploading: 'Envoi en cours... Merci de patienter.',
    loadingInfo: 'Chargement des informations...',
    errors: {
      default: 'Erreur',
      baddata: 'Valeur incorrecte',
      size: 'Fichier trop volumineux',
      upload: 'Envoi impossible',
      user: 'Envoi annulé',
      info: 'Impossible de charger les informations',
      image: 'Seules les images sont autorisées',
      createGroup: "Création d'1 groupe impossible",
      deleted: 'Le fichier a été supprimé'
    },
    draghere: 'Glissez-déposez un fichier ici',
    file: {
      one: '%1 fichier',
      other: '%1 fichiers'
    },
    buttons: {
      cancel: 'Annuler',
      remove: 'Supprimer',
      choose: {
        files: {
          one: 'Sélectionner un fichier',
          other: 'Sélectionner des fichiers'
        },
        images: {
          one: 'Sélectionner une image',
          other: 'Sélectionner des images'
        }
      }
    },
    dialog: {
      close: 'Fermer',
      openMenu: 'Ouvrir le menu',
      done: 'Terminer',
      showFiles: 'Voir les fichiers',
      tabs: {
        names: {
          'empty-pubkey': 'Bienvenue',
          preview: 'Avant-première',
          file: 'Fichier en local',
          url: 'Une adresse web',
          camera: 'Caméra',
          facebook: 'Facebook',
          dropbox: 'Dropbox',
          gdrive: 'Google Drive',
          gphotos: 'Google Photos',
          instagram: 'Instagram',
          vk: 'VK',
          evernote: 'Evernote',
          box: 'Box',
          onedrive: 'OneDrive',
          flickr: 'Flickr',
          huddle: 'Huddle'
        },
        file: {
          drag: 'Glissez-déposez un fichier ici',
          nodrop: 'Envoyez des fichiers depuis votre ordinateur',
          cloudsTip: 'Stockage sur le cloud<br>et réseaux sociaux',
          or: 'ou',
          button: 'Choisir un fichier local',
          also: 'Vous pouvez également le sélectionner depuis'
        },
        url: {
          title: 'Fichiers depuis le Web',
          line1: "Prenez n'importe quel fichier depuis un site web.",
          line2: 'Saisissez simplement son adresse.',
          input: 'Collez le lien ici...',
          button: 'Envoi'
        },
        camera: {
          title: 'Fichier depuis la caméra',
          capture: 'Prendre une photo',
          mirror: 'Miroir',
          startRecord: 'Enregistrer une vidéo',
          stopRecord: 'Arrêter',
          cancelRecord: 'Annuler',
          retry: 'Envoyer une nouvelle demande de permission',
          pleaseAllow: {
            title: "Autorisez l'accès à votre appareil photo",
            text: "Vous avez été invité à autoriser l'accès à votre appareil photo. Pour prendre des photos avec votre caméra vous devez approuver cette demande."
          },
          notFound: {
            title: 'Aucun appareil photo détecté',
            text: "Il semblerait que vous n'ayez pas d'appareil photo connecté à cet appareil."
          }
        },
        preview: {
          unknownName: 'inconnu',
          change: 'Annuler',
          back: 'Retour',
          done: 'Ajouter',
          unknown: {
            title: 'Envoi en cours... Merci de patienter pour prévisualiser.',
            done: 'Passer la prévisualisation et accepter'
          },
          regular: {
            title: 'Ajouter ce fichier ?',
            line1: "Vous êtes sur le point d'ajouter le fichier ci-dessus.",
            line2: 'Merci de confirmer.'
          },
          image: {
            title: 'Ajouter cette image ?',
            change: 'Annuler'
          },
          crop: {
            title: 'Recadrer et ajouter cette image',
            done: 'Terminer',
            free: 'libre'
          },
          video: {
            title: 'Ajouter cette vidéo ?',
            change: 'Annuler'
          },
          error: {
            default: {
              title: 'Oups!',
              text: "Quelque chose n'a pas fonctionné pendant l'envoi.",
              back: 'Merci de bien vouloir recommencer'
            },
            image: {
              title: 'Seules les images sont acceptées.',
              text: 'Merci de bien vouloir recommencer avec un autre fichier.',
              back: 'Choisir une image'
            },
            size: {
              title: 'Le fichier sélectionné est trop volumineux.',
              text: 'Merci de bien vouloir recommencer avec un autre fichier.'
            },
            loadImage: {
              title: 'Erreur',
              text: "Impossible de charger l'image"
            }
          },
          multiple: {
            title: 'Vous avez choisi %files%',
            question: 'Voulez vous ajouter tous ces fichiers ?',
            tooManyFiles: 'Vous avez choisi trop de fichiers. %max% est le maximum.',
            tooFewFiles: 'Vous avez choisi %fichiers%. %min% est le minimum.',
            clear: 'Tout retirer',
            done: 'Terminer',
            file: {
              preview: 'Prévisualiser %file%',
              remove: 'Supprimer %file%'
            }
          }
        }
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$k = function pluralize(n) {
    if (n === 1) {
      return 'one';
    }

    return 'other';
  };

  var fr = {
    translations: translations$k,
    pluralize: pluralize$k
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$j = {
    uploading: 'טוען... אנא המתן.',
    loadingInfo: 'טוען מידע...',
    errors: {
      default: 'שגיאה',
      baddata: 'ערך שגוי',
      size: 'קובץ גדול מידי',
      upload: 'לא ניתן להעלות',
      user: 'העלאה בוטלה',
      info: 'לא ניתן לטעון מידע',
      image: 'ניתן להעלות רק תמונות',
      createGroup: 'לא ניתן ליצור קבוצה',
      deleted: 'הקובץ נמחק'
    },
    draghere: 'שחרר כאן קובץ',
    file: {
      one: 'קובץ %1',
      other: '%1 קבצים'
    },
    buttons: {
      cancel: 'ביטול',
      remove: 'הסר',
      choose: {
        files: {
          one: 'בחר קובץ',
          other: 'בחר קבצים'
        },
        images: {
          one: 'בחר תמונה',
          other: 'בחר תמונות'
        }
      }
    },
    dialog: {
      done: 'סיום',
      showFiles: 'הצג קבצים',
      tabs: {
        names: {
          facebook: 'פייסבוק',
          dropbox: 'דרופבוקס',
          gdrive: 'כונן גוגל',
          instagram: 'אינסטגרם',
          url: 'לינק מהאינטרנט'
        },
        file: {
          drag: 'שחרר כאן קובץ',
          nodrop: 'העלה קבצים מהמחשב',
          or: 'או',
          button: 'בחר קובץ מהמחשב',
          also: 'ניתן לבחור גם מ'
        },
        url: {
          title: 'קובץ מהאינטרנט',
          line1: 'גרור קובץ מהאינטרנט',
          line2: 'ספק את כתובת הקובץ',
          input: 'הדבק את כתובת הקובץ...',
          button: 'העלה'
        },
        preview: {
          unknownName: 'לא ידוע',
          change: 'ביטול',
          back: 'חזרה',
          done: 'הוסף',
          unknown: {
            title: 'מעלה... נא המתן לתצוגה מקדימה.',
            done: 'דלג על תצוגה מקדימה'
          },
          regular: {
            title: 'להוסיף קובץ זה?',
            line1: 'קובץ זה יועלה',
            line2: 'נא אשר.'
          },
          image: {
            title: 'להוסיף תמונה זו?',
            change: 'ביטול'
          },
          crop: {
            title: 'חתוך והוסף תמונה זו',
            done: 'סיום'
          },
          error: {
            default: {
              title: 'אופס!',
              text: 'משהו השתבש בזמן ההעלאה.',
              back: 'נא נסה שוב'
            },
            image: {
              title: 'ניתן לקבל רק קבצי תמונות.',
              text: 'נא נסה שוב עם קובץ אחר.',
              back: 'בחר תמונה'
            },
            size: {
              title: 'הקובץ שבחרת חורג מהגבול.',
              text: 'נא נסה שוב עם קובץ אחר.'
            },
            loadImage: {
              title: 'שגיאה',
              text: 'טעינת התמונה נכשלה'
            }
          },
          multiple: {
            title: 'בחרת %files%',
            question: 'אתה מעוניין להוסיף את כל הקבצים האלו?',
            tooManyFiles: 'בחרת יותר מידי קבצים. יש לבחור מקסימום %max% קבצים.',
            tooFewFiles: 'בחרת %files%. יש לבחור לפחות %min%.',
            clear: 'הסר הכל',
            done: 'סיום'
          }
        }
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$j = function pluralize(n) {
    if (n === 1) {
      return 'one';
    }

    return 'other';
  };

  var he = {
    translations: translations$j,
    pluralize: pluralize$j
  }; // #
  // # Icelandic translations
  // #

  var translations$i = {
    uploading: 'Hleð upp... Vinsamlegast bíðið.',
    loadingInfo: 'Hleð upp upplýsingum...',
    errors: {
      default: 'Villa',
      baddata: 'Rangt gildi',
      size: 'Skráin er of stór',
      upload: 'Ekki tókst að hlaða upp skrá',
      user: 'Hætt var við',
      info: 'Ekki tókst að sækja upplýsingar',
      image: 'Myndir eru einungis leyfðar',
      createGroup: 'Ekki tókst að búa til hóp',
      deleted: 'Skrá hefur verið eytt'
    },
    draghere: 'Dragðu skrá hingað',
    file: {
      one: '%1 skrá',
      other: '%1 skráa'
    },
    buttons: {
      cancel: 'Hætta við',
      remove: 'Fjarlægja',
      choose: {
        files: {
          one: 'Veldu skrá',
          other: 'Veldu skrár'
        },
        images: {
          one: 'Veldu mynd',
          other: 'Veldu myndir'
        }
      }
    },
    dialog: {
      close: 'Loka',
      openMenu: 'Opna valmynd',
      done: 'Búið',
      showFiles: 'Sjá skrár',
      tabs: {
        names: {
          'empty-pubkey': 'Velkomin/n/ð',
          preview: 'Forskoðun',
          file: 'Staðbundnar skrár',
          url: 'Beinn hlekkur',
          camera: 'Myndavél',
          facebook: 'Facebook',
          dropbox: 'Dropbox',
          gdrive: 'Google Drive',
          gphotos: 'Google Photos',
          instagram: 'Instagram',
          vk: 'VK',
          evernote: 'Evernote',
          box: 'Box',
          onedrive: 'OneDrive',
          flickr: 'Flickr',
          huddle: 'Huddle'
        },
        file: {
          drag: 'dragðu & slepptu<br>skrám',
          nodrop: 'Hlaða upp þínum skrám',
          cloudsTip: 'Skýjaþjónustur<br>og samfélagsmiðlar',
          or: 'eða',
          button: 'Veldu staðbundna skrá',
          also: 'eða veldu'
        },
        url: {
          title: 'Skrár af netinu',
          line1: 'Sæktu hvaða skrá sem er frá netinu',
          line2: 'Settu bara inn hlekk',
          input: 'Límdu hlekkinn hér...',
          button: 'Hlaða upp'
        },
        camera: {
          title: 'Skrá frá myndavél',
          capture: 'Taktu mynd',
          mirror: 'Spegill',
          startRecord: 'Taktu upp myndband',
          stopRecord: 'Stopp',
          cancelRecord: 'Hætta við',
          retry: 'Biðja aftur um heimild',
          pleaseAllow: {
            title: 'Vinsamlegast gefðu heimild til þess að nota myndavélina',
            text: 'Þú hefur verið beðin/n/ð um að gefa heimild til myndavélanotkunar frá þessari síðu<br>' + 'Til þess að geta tekið myndir er nauðsynlegt að gefa heimild.'
          },
          notFound: {
            title: 'Engin myndavél fannst.',
            text: 'Það lítur út fyrir að það sé engin myndavél tengd.'
          }
        },
        preview: {
          unknownName: 'óþekkt',
          change: 'Hætta við',
          back: 'Bakka',
          done: 'Bæta við',
          unknown: {
            title: 'Hleð upp ... vinsamlegast bíðið eftir forskoðun. ',
            done: 'Sleppa forskoðun og samþykkja'
          },
          regular: {
            title: 'Bæta þessari skrá við?',
            line1: 'Þú ert að fara bæta þessari skrá við.',
            line2: 'Vinsamlegast staðfestið.'
          },
          image: {
            title: 'Bæta þessari mynd við?',
            change: 'Hætta við'
          },
          crop: {
            title: 'Kroppa og bæta þessari mynd við?',
            done: 'Búið',
            free: 'frítt'
          },
          video: {
            title: 'Bæta þessu myndbandi við?',
            change: 'Hætta við'
          },
          error: {
            default: {
              title: 'Úps!',
              text: 'Eitthvað fór úrskeiðis.',
              back: 'Vinsamlegast reyndu aftur'
            },
            image: {
              title: 'Myndir eru einungis leyfðar.',
              text: 'Vinsamlegast reyndu aftur.',
              back: 'Velja mynd'
            },
            size: {
              title: 'Skráin er of stór.',
              text: 'Vinsamlegast reyndu aftur.'
            },
            loadImage: {
              title: 'Villa',
              text: 'Gat ekki hlaðið upp mynd.'
            }
          },
          multiple: {
            title: 'Þú hefur valið %files%.',
            question: 'Bæta við %files%?',
            tooManyFiles: 'Þú hefur valið of margar skrár. %max% er hámarkið.',
            tooFewFiles: 'Þú hefur valið %files%. Að minnsta kosti %min% er lágmarkið.',
            clear: 'Fjarlægja allar skrár',
            done: 'Bæta við',
            file: {
              preview: 'Forskoða %file%',
              remove: 'Fjarlægja %file%'
            }
          }
        }
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$i = function pluralize(n) {
    if (n === 1) {
      return 'one';
    }

    return 'other';
  };

  var is = {
    pluralize: pluralize$i,
    translations: translations$i
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$h = {
    uploading: 'Caricamento in corso... Si prega di attendere.',
    loadingInfo: 'Caricamento informazioni in corso...',
    errors: {
      default: 'Errore',
      baddata: 'Valore errato',
      size: 'Il file è troppo grande',
      upload: 'Impossibile fare l’upload',
      user: 'Upload cancellato',
      info: 'Impossibile caricare le informazioni',
      image: 'Sono ammesse solo immagini',
      createGroup: 'Impossibile creare gruppo di file',
      deleted: 'Il file è stato eliminato'
    },
    draghere: 'Trascina un file qui',
    file: {
      one: 'file %1',
      other: 'file %1'
    },
    buttons: {
      cancel: 'Cancella',
      remove: 'Rimuovi',
      choose: {
        files: {
          one: 'Seleziona un file',
          other: 'Seleziona file'
        },
        images: {
          one: 'Seleziona un’immagine',
          other: 'Seleziona immagini'
        }
      }
    },
    dialog: {
      done: 'Fatto',
      showFiles: 'Mostra file',
      tabs: {
        names: {
          'empty-pubkey': 'Benvenuto',
          preview: 'Anteprima',
          file: 'File locali',
          url: 'Link arbitrari',
          camera: 'Fotocamera'
        },
        file: {
          drag: 'Trascina un file qui',
          nodrop: 'Carica file dal tuo computer',
          cloudsTip: 'Salvataggi nel cloud<br>e servizi sociali',
          or: 'o',
          button: 'Seleziona un file locale',
          also: 'Puoi anche scegliere da'
        },
        url: {
          title: 'File dal web',
          line1: 'Preleva un file dal web.',
          line2: 'È sufficiente fornire il link.',
          input: 'Incolla il tuo link qui...',
          button: 'Carica'
        },
        camera: {
          capture: 'Scatta una foto',
          mirror: 'Specchio',
          retry: 'Richiedi di nuovo le autorizzazioni',
          pleaseAllow: {
            title: 'Consenti l’accesso alla tua fotocamera',
            text: 'Ti è stato richiesto di consentire l’accesso alla fotocamera da questo sito. Per scattare le foto con la tua fotocamera devi accettare questa richiesta.'
          },
          notFound: {
            title: 'Nessuna fotocamera rilevata',
            text: 'Non risulta che tu non abbia una fotocamera collegata a questo dispositivo.'
          }
        },
        preview: {
          unknownName: 'sconosciuto',
          change: 'Cancella',
          back: 'Indietro',
          done: 'Aggiungi',
          unknown: {
            title: 'Caricamento in corso... Attendi l’anteprima.',
            done: 'Salta l’anteprima e accetta'
          },
          regular: {
            title: 'Vuoi aggiungere questo file?',
            line1: 'Stai per aggiungere il file sopra.',
            line2: 'Conferma.'
          },
          image: {
            title: 'Vuoi aggiungere questa immagine?',
            change: 'Cancella'
          },
          crop: {
            title: 'Ritaglia e aggiungi questa immagine',
            done: 'Fatto',
            free: 'gratis'
          },
          error: {
            default: {
              title: 'Ops!',
              text: 'Si è verificato un problema durante l’upload.',
              back: 'Si prega di riprovare'
            },
            image: {
              title: 'Sono accettati solo file immagine.',
              text: 'Riprova con un altro file.',
              back: 'Scegli immagine'
            },
            size: {
              title: 'Il file selezionato supera il limite.',
              text: 'Riprova con un altro file.'
            },
            loadImage: {
              title: 'Errore',
              text: 'Impossibile caricare l’immagine'
            }
          },
          multiple: {
            title: 'Hai selezionato %files%',
            question: 'Vuoi aggiungere tutti questi file?',
            tooManyFiles: 'Hai selezionato troppi file. %max% è il massimo.',
            tooFewFiles: 'Hai selezionato %files%. È richiesto almeno %min%.',
            clear: 'Rimuovi tutto',
            done: 'Fatto'
          }
        }
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$h = function pluralize(n) {
    if (n === 1) {
      return 'one';
    }

    return 'other';
  };

  var it = {
    translations: translations$h,
    pluralize: pluralize$h
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$g = {
    uploading: 'アップロードしています… 完了までお待ち下さい。',
    loadingInfo: '読み込み中…',
    errors: {
      default: 'エラー',
      baddata: '間違った値',
      size: 'ファイルが大きすぎます',
      upload: 'アップロードできませんでした',
      user: 'アップロードがキャンセルされました',
      info: '読み込みに失敗しました',
      image: 'アップロードできるのは画像ファイルのみです',
      createGroup: 'グループの作成に失敗しました',
      deleted: '削除されたファイルです'
    },
    draghere: 'ここにファイルをドロップ',
    file: {
      other: '%1ファイル'
    },
    buttons: {
      cancel: 'キャンセル',
      remove: '削除',
      choose: {
        files: {
          one: 'ファイルを選択',
          other: 'ファイルを選択'
        },
        images: {
          one: '画像を選択',
          other: '画像を選択'
        }
      }
    },
    dialog: {
      done: '完了',
      showFiles: 'ファイルを表示',
      tabs: {
        names: {
          preview: 'プレビュー',
          file: 'ローカルファイル',
          url: 'URLを直接入力'
        },
        file: {
          drag: 'ここにファイルをドロップ',
          nodrop: 'ファイルを選択してアップロード',
          cloudsTip: 'クラウドストレージ<br>およびソーシャルサービス',
          or: 'もしくは',
          button: 'ローカルのファイルを選択',
          also: '次からも選択可能です：'
        },
        url: {
          title: 'ウェブ上のファイル',
          line1: 'ウェブ上からファイルを取得します。',
          line2: 'URLを入力してください。',
          input: 'ここにURLを貼り付けしてください…',
          button: 'アップロード'
        },
        preview: {
          unknownName: '不明なファイル',
          change: 'キャンセル',
          back: '戻る',
          done: '追加',
          unknown: {
            title: 'アップロードしています… プレビューの表示をお待ちください。',
            done: 'プレビューの確認をスキップして完了'
          },
          regular: {
            title: 'このファイルを追加しますか？',
            line1: 'こちらのファイルを追加しようとしています。',
            line2: '確認してください。'
          },
          image: {
            title: 'この画像を追加しますか？',
            change: 'キャンセル'
          },
          crop: {
            title: '画像の切り取りと追加',
            done: '完了',
            free: 'リセット'
          },
          error: {
            default: {
              title: '失敗しました',
              text: 'アップロード中に不明なエラーが発生しました。',
              back: 'もう一度お試し下さい'
            },
            image: {
              title: '画像ファイルのみ許可されています',
              text: '他のファイルで再度お試し下さい。',
              back: '画像を選択'
            },
            size: {
              title: 'ファイルサイズが大きすぎます。',
              text: '他のファイルで再度お試し下さい。'
            },
            loadImage: {
              title: 'エラー',
              text: '画像のロードに失敗しました。'
            }
          },
          multiple: {
            title: '%files%つのファイルを選択中',
            question: 'これら全てのファイルを追加しますか？',
            tooManyFiles: '選択ファイルが多すぎます。%max%つ以下にしてください。',
            tooFewFiles: '選択ファイルが少なすぎます。%files%つ選択中です。少なくとも%min%つ選択してください。',
            clear: '全て削除',
            done: '完了'
          }
        }
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$g = function pluralize(n) {
    return 'other';
  };

  var ja = {
    translations: translations$g,
    pluralize: pluralize$g
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$f = {
    uploading: '업로드중 기다려주세요',
    loadingInfo: '정보 로드중...',
    errors: {
      default: '오류',
      baddata: '잘못된 값',
      size: '파일용량 초과',
      upload: '업로드 실패',
      user: '업로드 취소됨',
      info: '정보를 불러올 수 없습니다',
      image: '허용된 이미지만 가능',
      createGroup: '파일 그룹 만들기 실패',
      deleted: '파일이 삭제되었습니다'
    },
    draghere: '여기에 끌어다 놓기',
    file: {
      one: '%1 파일',
      other: '%1 파일'
    },
    buttons: {
      cancel: '취소',
      remove: '삭제',
      choose: {
        files: {
          one: '파일 첨부',
          other: '파일 첨부'
        },
        images: {
          one: '이미지 첨부',
          other: '이미지 첨부'
        }
      }
    },
    dialog: {
      close: '닫기',
      openMenu: '메뉴 열기',
      done: '완료',
      showFiles: '파일 표시',
      tabs: {
        names: {
          'empty-pubkey': '반갑습니다',
          preview: '미리보기',
          file: '파일 첨부',
          url: '링크 연결',
          camera: '카메라',
          facebook: '페이스북',
          dropbox: '드롭박스',
          gdrive: '구글 드라이브',
          gphotos: '구글 포토',
          instagram: '인스타그램',
          evernote: '에버노트',
          box: '박스',
          onedrive: '스카이드라이브',
          flickr: '플리커'
        },
        file: {
          drag: '모든 파일을<br>드래그 & 드롭',
          nodrop: '파일 업로드',
          cloudsTip: '클라우드 스토리지 및 소셜',
          or: '또는',
          button: '파일 선택',
          also: '또는 선택하십시오'
        },
        url: {
          title: '웹에서 파일 링크 연결',
          line1: '웹에서 모든파일을 가져옵니다',
          line2: '링크만 연결합니다.',
          input: '링크 붙여 넣기...',
          button: '업로드'
        },
        camera: {
          title: '카메라 연결',
          capture: '사진 찍기',
          mirror: '거울',
          startRecord: '비디오 녹화',
          stopRecord: '정지',
          cancelRecord: '취소',
          retry: '재 시도',
          pleaseAllow: {
            title: '카메라 접근 허용',
            text: '카메라 접근을 허용하시겠습니까?<br>' + '승인 요청을 해주셔야 합니다'
          },
          notFound: {
            title: '카메라가 없습니다',
            text: '이 기기에 연결된 카메라가 없습니다'
          }
        },
        preview: {
          unknownName: '알수없음',
          change: '취소',
          back: '뒤로',
          done: '추가',
          unknown: {
            title: '업로드중, 기다려주세요',
            done: '미리보기 건너뛰기'
          },
          regular: {
            title: '이 파일을 추가하시겠습니까?',
            line1: '위 파일을 추가하려고 합니다',
            line2: '확인 하십시오'
          },
          image: {
            title: '이미지를 추가하시겠습니까?',
            change: '취소'
          },
          crop: {
            title: '이미지 자르기 및 추가',
            done: '완료',
            free: '무료'
          },
          video: {
            title: '비디오를 추가하시겠습니까?',
            change: '취소'
          },
          error: {
            default: {
              title: '죄송합니다',
              text: '업로드에 문제가 있습니다',
              back: '다시 시도해 주세요'
            },
            image: {
              title: '이미지 파일만 허용됩니다',
              text: '다른 파일로 다시 시도하세요',
              back: '이미지 선택'
            },
            size: {
              title: '선택한 파일이 한도 초과하였습니다',
              text: '다른 파일로 다시 시도하세요'
            },
            loadImage: {
              title: '오류',
              text: '이미지를 불러올 수 없습니다'
            }
          },
          multiple: {
            title: '%files%을(를) 선택하였습니다',
            question: '%files%을 추가하시겠습니까?',
            tooManyFiles: '너무 많은 파일을 추가하셨습니다. %max%가 최대 한도입니다',
            tooFewFiles: '%files%을(를) 선택하였습니다 최소 %min%이상 필요합니다',
            clear: '모두 삭제',
            done: '추가',
            file: {
              preview: '%file% 미리보기',
              remove: '%file% 삭제'
            }
          }
        }
      },
      footer: {
        text: 'powered by',
        link: 'uploadcare'
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$f = function pluralize(n) {
    if (n === 1) {
      return 'one';
    }

    return 'other';
  };

  var ko = {
    translations: translations$f,
    pluralize: pluralize$f
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$e = {
    uploading: 'Augšupielādē... Lūdzu, gaidiet.',
    errors: {
      default: 'Kļūda',
      image: 'Atļauti tikai attēli'
    },
    draghere: 'Velciet failus šeit',
    file: {
      zero: '%1 failu',
      one: '%1 fails',
      other: '%1 faili'
    },
    buttons: {
      cancel: 'Atcelt',
      remove: 'Dzēst'
    },
    dialog: {
      title: 'Ielādēt jebko no jebkurienes',
      poweredby: 'Darbināts ar',
      support: {
        images: 'Attēli',
        audio: 'Audio',
        video: 'Video',
        documents: 'Dokumenti'
      },
      tabs: {
        file: {
          title: 'Mans dators',
          line1: 'Paņemiet jebkuru failu no jūsu datora.',
          line2: 'Izvēlēties ar dialogu vai ievelciet iekšā.',
          button: 'Meklēt failus'
        },
        url: {
          title: 'Faili no tīmekļa',
          line1: 'Paņemiet jebkuru failu no tīmekļa.',
          line2: 'Tikai uzrādiet linku.',
          input: 'Ielīmējiet linku šeit...',
          button: 'Ielādēt'
        }
      }
    }
  };

  var pluralize$e = function pluralize(n) {
    if (n === 0) {
      return 'zero';
    }

    if (n % 10 === 1 && n % 100 !== 11) {
      return 'one';
    }

    return 'other';
  };

  var lv = {
    translations: translations$e,
    pluralize: pluralize$e
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$d = {
    uploading: 'Laster opp... Vennligst vent.',
    loadingInfo: 'Laster inn info...',
    errors: {
      default: 'Feil',
      baddata: 'Ugyldig verdi',
      size: 'Filen er for stor',
      upload: 'Kan ikke laste opp',
      user: 'Opplasting avbrutt',
      info: 'Kan ikke laste inn info',
      image: 'Kun bilder er tillatt',
      createGroup: 'Kan ikke opprette filgruppe',
      deleted: 'Filen er slettet'
    },
    draghere: 'Dra en fil hit',
    file: {
      one: '%1 fil',
      other: '%1 filer'
    },
    buttons: {
      cancel: 'Avbryt',
      remove: 'Fjern',
      choose: {
        files: {
          one: 'Velg en fil',
          other: 'Velg filer'
        },
        images: {
          one: 'Velg et bilde',
          other: 'Velg bilder'
        }
      }
    },
    dialog: {
      done: 'Ferdig',
      showFiles: 'Vis filer',
      tabs: {
        names: {
          preview: 'Forhåndsvising',
          file: 'Lokale filer',
          url: 'Direktelink'
        },
        file: {
          drag: 'Dra og slipp en fil her',
          nodrop: 'Last opp filer fra datamaskinen',
          cloudsTip: 'Skylagring<br>og sosiale tjenester',
          or: 'eller',
          button: 'Velg en lokal fil',
          also: 'Du kan også velge det fra'
        },
        url: {
          title: 'Filer fra internett',
          line1: 'Velg hvilken som helst fil fra internett.',
          line2: 'Bare gi oss linken.',
          input: 'Lim inn linken her...',
          button: 'Last opp'
        },
        preview: {
          unknownName: 'ukjent',
          change: 'Avbryt',
          back: 'Tilbake',
          done: 'Legg til',
          unknown: {
            title: 'Laster opp... Vennligst vent på forhåndsvisning.',
            done: 'Hopp over forhåndsvisning og godkjenn'
          },
          regular: {
            title: 'Legge til denne filen?',
            line1: 'Filen legges nå til.',
            line2: 'Vennligst bekreft.'
          },
          image: {
            title: 'Legge til dette bildet?',
            change: 'Avbryt'
          },
          crop: {
            title: 'Kutt og legg til dette bildet',
            done: 'Ferdig',
            free: 'frigjør'
          },
          error: {
            default: {
              title: 'Ops!',
              text: 'Noe gikk galt under opplastingen.',
              back: 'Vennligst prøv igjen'
            },
            image: {
              title: 'Kun bilder er akseptert.',
              text: 'Prøv igjen med en annen fil.',
              back: 'Velg bilde'
            },
            size: {
              title: 'Den valgte filen overskrider tilatt størrelse.',
              text: 'Vennligst prøv igjen med en annen fil.'
            },
            loadImage: {
              title: 'Feil',
              text: 'Kan ikke laste bildet'
            }
          },
          multiple: {
            title: 'Du har valgt %files%',
            question: 'Ønsker du å legge til alle filene?',
            tooManyFiles: 'Du har valgt for mange filer. %max% er maksimum.',
            tooFewFiles: 'Du har valgt %files%. Minimum %min% er påkrevd.',
            clear: 'Fjern alle',
            done: 'Ferdig'
          }
        }
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$d = function pluralize(n) {
    if (n === 1) {
      return 'one';
    }

    return 'other';
  };

  var nb = {
    translations: translations$d,
    pluralize: pluralize$d
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$c = {
    uploading: 'Uploaden... Even geduld.',
    loadingInfo: 'Laden informatie...',
    errors: {
      default: 'Fout',
      baddata: 'Ongeldige waarde',
      size: 'Bestand is te groot',
      upload: 'Kan niet uploaden',
      user: 'Upload geannuleerd',
      info: 'Kan informatie niet laden',
      image: 'Alleen afbeeldingen toegestaan',
      createGroup: 'Kan bestandsgroep niet maken',
      deleted: 'Bestand is verwijderd'
    },
    draghere: 'Drop hier een bestand',
    file: {
      one: '%1 bestand',
      other: '%1 bestanden'
    },
    buttons: {
      cancel: 'Annuleren',
      remove: 'Verwijderen',
      choose: {
        files: {
          one: 'Kies een bestand',
          other: 'Kies bestanden'
        },
        images: {
          one: 'Kies een afbeelding',
          other: 'Kies afbeeldingen'
        }
      }
    },
    dialog: {
      done: 'Klaar',
      showFiles: 'Toon bestanden',
      tabs: {
        names: {
          preview: 'Voorvertoning',
          file: 'Computer',
          url: 'Directe links'
        },
        file: {
          drag: 'Drop hier een bestand',
          nodrop: 'Upload bestanden van je computer',
          or: 'of',
          button: 'Selecteer een bestand op je computer',
          also: 'Je kan ook selecteren van'
        },
        camera: {
          title: 'Bestand van webcamera',
          retry: 'Opnieuw toegang aanvragen'
        },
        url: {
          title: 'Bestanden op het web',
          line1: 'Selecteer een bestand op het web.',
          line2: 'Voer de link in.',
          input: 'Plak de link hier...',
          button: 'Upload'
        },
        preview: {
          unknownName: 'onbekend',
          change: 'Annuleren',
          back: 'Terug',
          done: 'Toevoegen',
          unknown: {
            title: 'Uploaden... Wacht op de voorvertoning.',
            done: 'Voorvertoning overslaan an accepteren'
          },
          regular: {
            title: 'Dit bestand toevoegen?',
            line1: 'Je staat op het punt bovenstaand bestand toe te voegen.',
            line2: 'Bevestig'
          },
          image: {
            title: 'Voeg deze afbeelding toe?',
            change: 'Annuleren'
          },
          crop: {
            title: 'Afbeelding bijknippen en toevoegen',
            done: 'Klaar'
          },
          error: {
            default: {
              title: 'Oeps!',
              text: 'Er is een fout opgetreden tijdens het uploaden.',
              back: 'Probeer opnieuw'
            },
            image: {
              title: 'Alleen afbeeldingen worden geaccepteerd.',
              text: 'Probeer opnieuw met een andere bestand.',
              back: 'Selecteer afbeelding'
            },
            size: {
              title: 'Het geselecteerd bestand is groter dan de limiet.',
              text: 'Probeer opnieuw met een andere bestand.'
            },
            loadImage: {
              title: 'Fout',
              text: 'Kan afbeelding niet laden'
            }
          },
          multiple: {
            title: 'Je hebt de volgende bestanden geselecteerd %files%',
            question: 'Wil je al deze bestanden toevoegen?',
            tooManyFiles: 'Je hebt teveel bestanden geselecteerd. %max% is het maximum.',
            tooFewFiles: 'Je hebt de volgende bestanden geselecteerd %files%. Minimaal %min% is verplicht.',
            clear: 'Verwijder alle bestanden',
            done: 'Klaar'
          }
        }
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$c = function pluralize(n) {
    if (n === 1) {
      return 'one';
    }

    return 'other';
  };

  var nl = {
    translations: translations$c,
    pluralize: pluralize$c
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$b = {
    uploading: 'Przesyłanie... Proszę czekać.',
    loadingInfo: 'Ładowanie...',
    errors: {
      default: 'Błąd',
      baddata: 'Niepoprawna wartość',
      size: 'Plik zbyt duży',
      upload: 'Nie udało się przesłać',
      user: 'Przesyłanie anulowane',
      info: 'Nie udało się załadować informacji',
      image: 'Dozwolone są tylko obrazy',
      createGroup: 'Nie udało się utworzyć grupy plików',
      deleted: 'Plik został usunięty'
    },
    draghere: 'Upuść plik tutaj',
    file: {
      one: '%1 plik',
      few: '%1 pliki',
      many: '%1 plików'
    },
    buttons: {
      cancel: 'Anuluj',
      remove: 'Usuń',
      choose: {
        files: {
          one: 'Wybierz plik',
          other: 'Wybierz pliki'
        },
        images: {
          one: 'Wybierz obraz',
          other: 'Wybierz obrazy'
        }
      }
    },
    dialog: {
      close: 'Zamknij',
      openMenu: 'Otwórz menu',
      done: 'Wykonano',
      showFiles: 'Pokaż pliki',
      tabs: {
        names: {
          'empty-pubkey': 'Witaj',
          preview: 'Podgląd',
          file: 'Pliki lokalne',
          url: 'Plik z Sieci',
          camera: 'Aparat'
        },
        file: {
          drag: 'Upuść plik tutaj',
          nodrop: 'Prześlij pliki z Twojego komputera',
          cloudsTip: 'Dane w chmurze<br>i sieci społecznościowe',
          or: 'lub',
          button: 'Wybierz plik lokalny',
          also: 'Możesz również wybrać z'
        },
        url: {
          title: 'Pliki z Sieci',
          line1: 'Złap jakikolwiej plik z sieci.',
          line2: 'Podaj adres.',
          input: 'Wklej link...',
          button: 'Prześlij'
        },
        camera: {
          title: 'Plik z kamery internetowej',
          capture: 'Zrób zdjęcie',
          mirror: 'Odbicie lustrzane',
          startRecord: 'Nagraj film',
          stopRecord: 'Zakończ',
          cancelRecord: 'Anuluj',
          retry: 'Poproś ponownie o dostęp',
          pleaseAllow: {
            title: 'Prośba o udostępnienie aparatu',
            text: 'Zostałeś poproszony przez tę stronę o dostęp do aparatu. ' + 'Aby robić zdjecia, musisz zaakceptować tę prośbę.'
          },
          notFound: {
            title: 'Nie wykryto aparatu.',
            text: 'Wygląda na to, że nie masz podłączonego aparatu do tego urządzenia.'
          }
        },
        preview: {
          unknownName: 'nieznany',
          change: 'Anuluj',
          back: 'Wstecz',
          done: 'Dodaj',
          unknown: {
            title: 'Przesyłanie... Proszę czekać na podgląd.',
            done: 'Omiń podgląd i zaakceptuj.'
          },
          regular: {
            title: 'Dodać ten plik?',
            line1: 'Zamierzasz dodać nowy plik.',
            line2: 'Potwierdź, proszę.'
          },
          image: {
            title: 'Dodać ten obraz?',
            change: 'Anuluj'
          },
          crop: {
            title: 'Przytnij i dodaj ten obraz',
            done: 'Wykonano',
            free: 'wolny'
          },
          video: {
            title: 'Dodać ten film?',
            change: 'Anuluj'
          },
          error: {
            default: {
              title: 'Oops!',
              text: 'Coś poszło nie tak podczas przesyłania.',
              back: 'Spróbuj ponownie'
            },
            image: {
              title: 'Akceptowane są tylko obrazy.',
              text: 'Spróbuj ponownie z innym plikiem.',
              back: 'Wybierz obraz'
            },
            size: {
              title: 'Plik, który wybrałeś, przekracza dopuszczalny rozmiar',
              text: 'Spróbuj ponownie z innym plikiem.'
            },
            loadImage: {
              title: 'Błąd',
              text: 'Nie udało się załadować obrazu'
            }
          },
          multiple: {
            title: 'Wybrałeś %files%',
            question: 'Czy chcesz dodać wszystkie te pliki?',
            tooManyFiles: 'Wybrałeś zbyt wiele plików. Maksimum to %max%.',
            tooFewFiles: 'Wybrałeś %files%. Wymagane jest co najmniej %min%.',
            clear: 'Usuń wszystkie',
            done: 'Wykonano',
            file: {
              preview: 'Zobacz %file%',
              remove: 'Usuń %file%'
            }
          }
        }
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$b = function pluralize(n) {
    var ref;

    if (n === 1) {
      return 'one';
    } else if ((ref = n % 10) >= 2 && ref <= 4 && (n / 10 % 10 | 0) !== 1) {
      return 'few';
    } else {
      return 'many';
    }
  };

  var pl = {
    translations: translations$b,
    pluralize: pluralize$b
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$a = {
    uploading: 'Fazendo upload... Aguarde.',
    loadingInfo: 'Carregando informações...',
    errors: {
      default: 'Erro',
      baddata: 'Valor incorreto',
      size: 'Arquivo muito grande',
      upload: 'Não foi possível fazer o upload',
      user: 'Upload cancelado',
      info: 'Não foi possível carregar as informações',
      image: 'Apenas imagens são permitidas',
      createGroup: 'Não foi possível criar o grupo de arquivos',
      deleted: 'O arquivo foi excluído'
    },
    draghere: 'Arraste um arquivo aqui',
    file: {
      one: '%1 arquivo',
      other: '%1 arquivos'
    },
    buttons: {
      cancel: 'Cancelar',
      remove: 'Excluir',
      choose: {
        files: {
          one: 'Escolha um arquivo',
          other: 'Escolha arquivos'
        },
        images: {
          one: 'Escolha uma imagem',
          other: 'Escolha imagens'
        }
      }
    },
    dialog: {
      done: 'OK',
      showFiles: 'Mostrar arquivos',
      tabs: {
        names: {
          preview: 'Visualizar',
          file: 'Computador',
          url: 'Link da web'
        },
        file: {
          drag: 'Arraste um arquivo aqui',
          nodrop: 'Faça upload de arquivos do seu computador',
          or: 'ou',
          button: 'Escolha um arquivo do computador',
          also: 'Você também pode escolher arquivos de'
        },
        url: {
          title: 'Arquivos da web',
          line1: 'Faça upload de qualquer arquivo da web.',
          line2: 'Apenas informe o link.',
          input: 'Cole seu link aqui...',
          button: 'Upload'
        },
        camera: {
          capture: 'Tirar uma foto',
          mirror: 'Espelhar',
          startRecord: 'Gravar um vídeo',
          stopRecord: 'Parar',
          cancelRecord: 'Cancelar',
          retry: 'Requisitar permissão novamente',
          pleaseAllow: {
            title: 'Por favor permita o acesso a sua câmera',
            text: 'Você foi solicitado a permitir o acesso à câmera a partir deste site. ' + 'Para tirar fotos com sua câmera, você deve aprovar este pedido.'
          },
          notFoud: {
            title: 'Câmera não detectada',
            text: 'Parece que você não tem uma câmera conectada a este dispositivo'
          }
        },
        preview: {
          unknownName: 'desconhecido',
          change: 'Cancelar',
          back: 'Voltar',
          done: 'Adicionar',
          unknown: {
            title: 'Fazendo upload... Aguarde a visualização.',
            done: 'Pular visualização e aceitar'
          },
          regular: {
            title: 'Adicionar esse arquivo?',
            line1: 'Você está prestes a adicionar o arquivo acima.',
            line2: 'Por favor, confirme.'
          },
          image: {
            title: 'Adicionar essa imagem?',
            change: 'Cancelar'
          },
          crop: {
            title: 'Cortar e adicionar essa imagem',
            done: 'OK',
            free: 'livre'
          },
          error: {
            default: {
              title: 'Oops!',
              text: 'Alguma coisa deu errado durante o upload.',
              back: 'Por favor, tente novamente'
            },
            image: {
              title: 'Apenas arquivos de imagem são aceitos.',
              text: 'Por favor, tente novamente com outro arquivo.',
              back: 'Escolher a imagem'
            },
            size: {
              title: 'O arquivo que você escolheu excede o limite.',
              text: 'Por favor, tente novamente com outro arquivo.'
            },
            loadImage: {
              title: 'Erro',
              text: 'Não foi possível carregar a imagem'
            }
          },
          multiple: {
            title: 'Você escolheu',
            question: 'Você quer adicionar todos esses arquivos?',
            clear: 'Excluir todos',
            done: 'OK'
          }
        }
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$a = function pluralize(n) {
    if (n === 1) {
      return 'one';
    }

    return 'other';
  };

  var pt = {
    translations: translations$a,
    pluralize: pluralize$a
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$9 = {
    uploading: 'Se încarcă... Răbdare.',
    loadingInfo: 'Info încărcare...',
    errors: {
      default: 'Eroare',
      baddata: 'Valoare incorectă',
      size: 'Fișier prea mare',
      upload: 'Nu pot încărca',
      user: 'Încărcare anulată',
      info: 'Nu pot încărca info',
      image: 'Doar imagini, vă rog',
      createGroup: 'Nu pot crea grup de fișiere',
      deleted: 'Fișierul a fost șters'
    },
    draghere: 'Trage un fișier aici',
    file: {
      one: '%1 fișier',
      other: '%1 fișiere'
    },
    buttons: {
      cancel: 'Anulare',
      remove: 'Șterge',
      choose: {
        files: {
          one: 'Alege un fișier',
          other: 'Alege fișiere'
        },
        images: {
          one: 'Alege o imagine',
          other: 'Alege imagini'
        }
      }
    },
    dialog: {
      close: 'Închide',
      openMenu: 'Deschide meniu',
      done: 'Gata',
      showFiles: 'Arată fișiere',
      tabs: {
        names: {
          'empty-pubkey': 'Bine ai venit',
          preview: 'Previzualizare',
          file: 'Fișiere locale',
          url: 'Link direct',
          camera: 'Camera',
          facebook: 'Facebook',
          dropbox: 'Dropbox',
          gdrive: 'Google Drive',
          gphotos: 'Google Photos',
          instagram: 'Instagram',
          vk: 'VK',
          evernote: 'Evernote',
          box: 'Box',
          onedrive: 'OneDrive',
          flickr: 'Flickr',
          huddle: 'Huddle'
        },
        file: {
          drag: 'trage aici<br>fișierele',
          nodrop: 'Încarcă fișiere din computer',
          cloudsTip: 'Cloud <br>și rețle sociale',
          or: 'sau',
          button: 'Alege un fișier local',
          also: 'sau alege din'
        },
        url: {
          title: 'Fișiere din Web',
          line1: 'Ia orice fișier din Web.',
          line2: 'Trebuie să ai doar linkul.',
          input: 'Lipește linkul aici...',
          button: 'Încarcă'
        },
        camera: {
          title: 'Fișier din camera web',
          capture: 'Fă o fotografie',
          mirror: 'Mirror',
          startRecord: 'Înregistrează un video',
          stopRecord: 'Stop',
          cancelRecord: 'Anulează',
          retry: 'Cere permisiune din nou',
          pleaseAllow: {
            title: 'Te rog sa-mi dai acces la cameră',
            text: 'Ai fost rugat să dai acces la cameră de acest site.<br>' + 'Pentru a putea face fotografii cu camera, trebuie să aprobi această cerere.'
          },
          notFound: {
            title: 'Nicio cameră detectată',
            text: 'Se pare că nu ai nicio cameră atașată acestui device.'
          }
        },
        preview: {
          unknownName: 'necunoscut',
          change: 'Anulează',
          back: 'Înapoi',
          done: 'Adaugă',
          unknown: {
            title: 'Se încarcă... Te rog așteaptă previzualizarea.',
            done: 'Sari peste previzualizare și acceptă'
          },
          regular: {
            title: 'Adaug acest fișier?',
            line1: 'Ești pe punctul de a adăuga fișierul de mai sus.',
            line2: 'Te rog confirmă.'
          },
          image: {
            title: 'Adaug această imagine?',
            change: 'Anulează'
          },
          crop: {
            title: 'Decupează și adaugă aceasta imagine',
            done: 'Gata',
            free: 'gratis'
          },
          video: {
            title: 'Adaug acest video?',
            change: 'anulează'
          },
          error: {
            default: {
              title: 'Oops!',
              text: 'A intervenit o problemă la încărcare.',
              back: 'te rog încearcă din nou'
            },
            image: {
              title: 'Sunt acceptate doar imagini.',
              text: 'Te rog încearcă din nou cu un alt fișier.',
              back: 'Alege imagine'
            },
            size: {
              title: 'Fișierul selectat de tine este prea mare.',
              text: 'Te rog să încerci cu alt fișier.'
            },
            loadImage: {
              title: 'Eroare',
              text: 'Nu pot încărca imaginea'
            }
          },
          multiple: {
            title: 'Ai ales %files%.',
            question: 'Adaug %files%?',
            tooManyFiles: 'Ai ales prea multe fișiere. %max% is maximum.',
            tooFewFiles: 'Ai ales %files%. Minimul este %min% .',
            clear: 'Șterge toate',
            done: 'Adaugă',
            file: {
              preview: 'Previzualizare %file%',
              remove: 'Șterge %file%'
            }
          }
        }
      },
      footer: {
        text: 'powered by',
        link: 'uploadcare'
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$9 = function pluralize(n) {
    if (n === 1) {
      return 'one';
    }

    return 'other';
  };

  var ro = {
    translations: translations$9,
    pluralize: pluralize$9
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$8 = {
    uploading: 'Идет загрузка',
    loadingInfo: 'Загрузка информации...',
    errors: {
      default: 'Ошибка',
      baddata: 'Некорректные данные',
      size: 'Слишком большой файл',
      upload: 'Ошибка при загрузке',
      user: 'Загрузка прервана',
      info: 'Ошибка при загрузке информации',
      image: 'Разрешены только изображения',
      createGroup: 'Не удалось создать группу файлов',
      deleted: 'Файл удалён'
    },
    draghere: 'Перетащите файл сюда',
    file: {
      one: '%1 файл',
      few: '%1 файла',
      many: '%1 файлов'
    },
    buttons: {
      cancel: 'Отмена',
      remove: 'Удалить',
      choose: {
        files: {
          one: 'Выбрать файл',
          other: 'Выбрать файлы'
        },
        images: {
          one: 'Выбрать изображение',
          other: 'Выбрать изображения'
        }
      }
    },
    dialog: {
      done: 'Готово',
      showFiles: 'Показать файлы',
      tabs: {
        names: {
          preview: 'Предпросмотр',
          'empty-pubkey': 'Приветствие',
          file: 'Локальные файлы',
          vk: 'ВКонтакте',
          url: 'Ссылка',
          camera: 'Камера'
        },
        file: {
          drag: 'Перетащите файл сюда',
          nodrop: 'Загрузка файлов с вашего компьютера',
          cloudsTip: 'Облачные хранилища<br>и социальные сети',
          or: 'или',
          button: 'Выберите локальный файл',
          also: 'Вы также можете загрузить файлы, используя:'
        },
        url: {
          title: 'Файлы с других сайтов',
          line1: 'Загрузите любой файл из сети.',
          line2: '',
          input: 'Укажите здесь ссылку...',
          button: 'Загрузить'
        },
        camera: {
          title: 'Файл из видеокамеры',
          capture: 'Сделать снимок',
          mirror: 'Отразить',
          retry: 'Повторно запросить разрешение',
          pleaseAllow: {
            title: 'Пожалуйста, разрешите доступ к камере',
            text: 'Для того, чтобы сделать снимок, мы запросили разрешение ' + 'на доступ к камере с этого сайта.'
          },
          notFound: {
            title: 'Камера не найдена',
            text: 'Скорее всего камера не подключена или не настроена.'
          }
        },
        preview: {
          unknownName: 'неизвестно',
          change: 'Отмена',
          back: 'Назад',
          done: 'Добавить',
          unknown: {
            title: 'Загрузка... Пожалуйста подождите.',
            done: 'Пропустить предварительный просмотр'
          },
          regular: {
            title: 'Загрузить этот файл?',
            line1: 'Вы собираетесь добавить этот файл:',
            line2: 'Пожалуйста, подтвердите.'
          },
          image: {
            title: 'Добавить это изображение?',
            change: 'Отмена'
          },
          video: {
            title: 'Добавить это видео?',
            change: 'Отмена'
          },
          crop: {
            title: 'Обрезать и добавить это изображение',
            done: 'Готово',
            free: 'произв.'
          },
          error: {
            default: {
              title: 'Ой!',
              text: 'Что-то пошло не так во время загрузки.',
              back: 'Пожалуйста, попробуйте ещё раз'
            },
            image: {
              title: 'Можно загружать только изображения.',
              text: 'Попробуйте загрузить другой файл.',
              back: 'Выберите изображение'
            },
            size: {
              title: 'Размер выбранного файла превышает лимит.',
              text: 'Попробуйте загрузить другой файл.'
            },
            loadImage: {
              title: 'Ошибка',
              text: 'Изображение не удалось загрузить'
            }
          },
          multiple: {
            title: 'Вы выбрали %files%',
            question: 'Добавить все эти файлы?',
            tooManyFiles: 'Вы выбрали слишком много файлов. %max% максимум.',
            tooFewFiles: 'Вы выбрали %files%. Нужно не меньше %min%.',
            clear: 'Удалить все',
            done: 'Добавить',
            file: {
              preview: 'Предпросмотр %file%',
              remove: 'Удалить %file%'
            }
          }
        }
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$8 = function pluralize(n) {
    if ((n / 10 % 10 | 0) === 1 || n % 10 === 0 || n % 10 > 4) {
      return 'many';
    } else if (n % 10 === 1) {
      return 'one';
    } else {
      return 'few';
    }
  };

  var ru = {
    translations: translations$8,
    pluralize: pluralize$8
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$7 = {
    uploading: 'Nahrávam... Prosím počkajte.',
    loadingInfo: 'Nahrávam informácie...',
    errors: {
      default: 'Chyba',
      baddata: 'Nesprávna hodnota',
      size: 'Súbor je príliš veľký',
      upload: 'Nedá sa nahrať',
      user: 'Nahrávanie bolo zrušené',
      info: 'Informácie sa nedajú nahrať',
      image: 'Povolené sú len obrázky',
      createGroup: 'Nie je možné vytvoriť priečinok',
      deleted: 'Súbor bol odstránený'
    },
    draghere: 'Sem presuňte súbor',
    file: {
      one: '%1 súbor',
      few: '%1 súbory',
      other: '%1 súborov'
    },
    buttons: {
      cancel: 'Zrušiť',
      remove: 'Odstrániť',
      choose: {
        files: {
          one: 'Vyberte súbor',
          other: 'Vyberte súbory'
        },
        images: {
          one: 'Vyberte obrázok',
          other: 'Vyberte obrázky'
        }
      }
    },
    dialog: {
      close: 'Zavrieť',
      openMenu: 'Otvoriť menu',
      done: 'Hotovo',
      showFiles: 'Ukázať súbory',
      tabs: {
        names: {
          'empty-pubkey': 'Vitajte',
          preview: 'Náhľad',
          file: 'Z počítača',
          url: 'Z internetu',
          camera: 'Kamera',
          facebook: 'Facebook',
          dropbox: 'Dropbox',
          gdrive: 'Disk Google',
          gphotos: 'Google Obrázky',
          instagram: 'Instagram',
          vk: 'VK',
          evernote: 'Evernote',
          box: 'Box',
          onedrive: 'OneDrive',
          flickr: 'Flickr',
          huddle: 'Huddle'
        },
        file: {
          drag: 'presuňte a vložte<br>akékoľvek súbory',
          nodrop: 'Nahrajte súbory z vášho&nbsp;počítača',
          cloudsTip: 'Cloud úložiská<br>a sociálne siete',
          or: 'alebo',
          button: 'Vyberte súbor z počítača',
          also: 'alebo vyberte z'
        },
        url: {
          title: 'Súbory z internetu',
          line1: 'Uložte akýkoľvek súbor z internetu.',
          line2: 'Stačí pridať odkaz na neho.',
          input: 'Vložte svoj odkaz sem...',
          button: 'Nahrať'
        },
        camera: {
          title: 'Súbor z webkamery',
          capture: 'Odfotiť',
          mirror: 'Zrkadliť',
          startRecord: 'Natočte video',
          stopRecord: 'Prestať natáčať',
          cancelRecord: 'Zrušiť',
          retry: 'Znovu požiadať o prístup',
          pleaseAllow: {
            title: 'Prosím povoľte prístup k vašej kamere',
            text: 'Boli ste vyzvaní aby ste umožnili tejto stránke prístup ku kamere.<br>' + 'Prístup musíte povolit aby ste mohli fotiť s vašou kamerou.'
          },
          notFound: {
            title: 'Kamera nebola nájdená',
            text: 'Zdá sa, že k tomuto zariadeniu nemáte pripojenú kameru.'
          }
        },
        preview: {
          unknownName: 'neznámy',
          change: 'Zrušiť',
          back: 'Späť',
          done: 'Pridať',
          unknown: {
            title: 'Nahráva sa... Prosím počkajte na náhľad.',
            done: 'Preskočiť náhľad a nahrať'
          },
          regular: {
            title: 'Pridať tento súbor?',
            line1: 'Chystáte sa pridať vyššie uvedený súbor.',
            line2: 'Prosím potvrďte váš výber.'
          },
          image: {
            title: 'Pridať tento obrázok?',
            change: 'Zrušiť'
          },
          crop: {
            title: 'Orezať a pridať túto fotku',
            done: 'Hotovo',
            free: 'obnoviť'
          },
          video: {
            title: 'Pridať toto video?',
            change: 'Zrušiť'
          },
          error: {
            default: {
              title: 'Ejha!',
              text: 'Pri nahrávaní sa vyskytla chyba.',
              back: 'Skúste to znovu'
            },
            image: {
              title: 'Je možné nahrávať len obrázky',
              text: 'Skúste to znovu s iným súborom.',
              back: 'Vybrať obrázok'
            },
            size: {
              title: 'Súbor, ktorý ste vybrali presahuje povolenú veľkosť.',
              text: 'Skúste to znovu s iným súborom.'
            },
            loadImage: {
              title: 'Chyba',
              text: 'Obrázok nie je možné vyhľadať'
            }
          },
          multiple: {
            title: 'Vybrali ste %files%.',
            question: 'Pridať %files%?',
            tooManyFiles: 'Vybrali ste príliš veľa súborov. Maximum je %max%.',
            tooFewFiles: 'Vybrali ste %files%. Potrebných je aspoň %min%.',
            clear: 'Odstrániť všetky',
            done: 'Pridať',
            file: {
              preview: 'Nahliadnuť na %file%',
              remove: 'Odstrániť %file%'
            }
          }
        }
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$7 = function pluralize(n) {
    if (n === 1) {
      return 'one';
    } else if (n >= 2 && n <= 4) {
      return 'few';
    } else {
      return 'many';
    }
  };

  var sk = {
    translations: translations$7,
    pluralize: pluralize$7
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$6 = {
    uploading: 'Шаљем... Молимо сачекајте.',
    loadingInfo: 'Учитавам информације...',
    errors: {
      default: 'Грешка',
      baddata: 'Погрешна вредност',
      size: 'Фајл је сувише велик',
      upload: 'Не могу да пошаљем',
      user: 'Слање прекинуто',
      info: 'Не могу да учитам информације',
      image: 'Дозвољене су само слике',
      createGroup: 'Не могу да направим групу фајлова',
      deleted: 'Фајл је обрисан'
    },
    draghere: 'Убаците фајл овде',
    file: {
      one: '%1 фајл',
      other: '%1 фајлова'
    },
    buttons: {
      cancel: 'Поништи',
      remove: 'Избаци',
      choose: {
        files: {
          one: 'Изабери фајл',
          other: 'Изабери фајлове'
        },
        images: {
          one: 'Изабери слику',
          other: 'Изабери слике'
        }
      }
    },
    dialog: {
      close: 'Затвори',
      openMenu: 'Отвори мени',
      done: 'Готово',
      showFiles: 'Покажи фајлове',
      tabs: {
        names: {
          'empty-pubkey': 'Добродошли',
          preview: 'Погледај',
          file: 'Локални фајлови',
          url: 'Директан линк',
          camera: 'Камера',
          facebook: 'Фејсбук',
          dropbox: 'Dropbox',
          gdrive: 'Google Drive',
          gphotos: 'Google Photos',
          instagram: 'Инстаграм',
          vk: 'VK',
          evernote: 'Evernote',
          box: 'Box',
          onedrive: 'OneDrive',
          flickr: 'Flickr',
          huddle: 'Huddle'
        },
        file: {
          drag: 'превуци<br>било које фајлове',
          nodrop: 'Пошаљи фајлове са твог&nbsp;компјутера',
          cloudsTip: 'Клауд<br>и социјалне мреже',
          or: 'или',
          button: 'Изабери локални фајл',
          also: 'или изабери'
        },
        url: {
          title: 'Фајлове са Интернета',
          line1: 'Изабери било који фајл са Интернета.',
          line2: 'Само убаци линк.',
          input: 'Убаци линк овде...',
          button: 'Пошаљи'
        },
        camera: {
          title: 'Фајл са камере',
          capture: 'Усликај',
          mirror: 'Огледало',
          startRecord: 'Сними видео',
          stopRecord: 'Заустави',
          cancelRecord: 'Поништи',
          retry: 'Тражи дозволу поново',
          pleaseAllow: {
            title: 'Молимо вас да дозволите приступ вашој камери',
            text: 'Упитани сте да дозволите приступ вашој камери са овог сајта.<br>' + 'Уколико желите да сликате, морате одобрити овај захтев.'
          },
          notFound: {
            title: 'Камера није препозната',
            text: 'Изгледа да немате камеру на овом уређају.'
          }
        },
        preview: {
          unknownName: 'непознато',
          change: 'Поништи',
          back: 'Назад',
          done: 'Додај',
          unknown: {
            title: 'Шаљем... Сачекајте за приказ.',
            done: 'Прескочи приказ и прихвати'
          },
          regular: {
            title: 'Додај овај фајл?',
            line1: 'Управо ћете додати овај фајл изнад.',
            line2: 'Молимо потврдите.'
          },
          image: {
            title: 'Додај ову слику?',
            change: 'Поништи'
          },
          crop: {
            title: 'Кропуј и додај ову слику',
            done: 'Урађено',
            free: 'слободно'
          },
          video: {
            title: 'Додај овај видео?',
            change: 'Поништи'
          },
          error: {
            default: {
              title: 'Ооопс!',
              text: 'Нешто је искрсло у току слања.',
              back: 'Молимо покушајте поново'
            },
            image: {
              title: 'Дозвљене су само слике.',
              text: 'Молимо покушајте са другим фајлом.',
              back: 'Изабери слику'
            },
            size: {
              title: 'Фајл који сте изабрали премашује лимит.',
              text: 'Молимо покушајте са другим фајлом.'
            },
            loadImage: {
              title: 'Грешка',
              text: 'Не могу да учитам слику'
            }
          },
          multiple: {
            title: 'Изабрали сте %files%.',
            question: 'Додај %files%?',
            tooManyFiles: 'Изабрали сте превише фајлова. %max% је максимално.',
            tooFewFiles: 'Изабрали сте %files%. Морате најмање %min% фајла.',
            clear: 'Избаци све',
            done: 'Додај',
            file: {
              preview: 'Прегледај %file%',
              remove: 'Избаци %file%'
            }
          }
        }
      },
      footer: {
        text: 'направио',
        link: 'uploadcare'
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$6 = function pluralize(n) {
    if (n === 1) {
      return 'one';
    }

    return 'other';
  };

  var sr = {
    translations: translations$6,
    pluralize: pluralize$6
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$5 = {
    uploading: 'Laddar... Var god vänta.',
    loadingInfo: 'Laddar info...',
    errors: {
      default: 'Fel',
      baddata: 'Felaktigt värde',
      size: 'Filen är för stor',
      upload: 'Kan inte ladda upp',
      user: 'Uppladdning avbruten',
      info: 'Kan inte ladda informationen',
      image: 'Endast bilder tillåtna',
      createGroup: 'Kan inte skapa filgrupp',
      deleted: 'Fil raderad'
    },
    draghere: 'Dra filen hit',
    file: {
      one: '%1 fil',
      other: '%1 filer'
    },
    buttons: {
      cancel: 'Avbryt',
      remove: 'Ta bort',
      choose: {
        files: {
          one: 'Välj fil',
          other: 'Välj filer'
        },
        images: {
          one: 'Välj en bild',
          other: 'Välj bilder'
        }
      }
    },
    dialog: {
      done: 'Klar',
      showFiles: 'Visa filer',
      tabs: {
        names: {
          'empty-pubkey': 'Välkommen',
          preview: 'Förhandsgranskning',
          file: 'Lokala filer',
          url: 'Direkta länkar',
          camera: 'Kamera'
        },
        file: {
          drag: 'Släpp filen här',
          nodrop: 'Ladda upp filer från din dator',
          cloudsTip: 'Molnlagring<br>och sociala nätverk',
          or: 'eller',
          button: 'Välj en lokal fil',
          also: 'Du kan också välja den från'
        },
        url: {
          title: 'Filer från webben',
          line1: 'Välj en fil från en webbadress.',
          line2: 'Ange bara länken till filen.',
          input: 'Klistra in din länk här...',
          button: 'Ladda upp'
        },
        camera: {
          capture: 'Ta ett foto',
          mirror: 'Spegel',
          retry: 'Begär tillstånd igen',
          pleaseAllow: {
            title: 'Vänligen ge tillgång till din kamera',
            text: 'Du har uppmanats att tillåta att denna webbplats får tillgång till din kamera.' + 'För att ta bilder med din kamera måste du godkänna denna begäran.'
          },
          notFound: {
            title: 'Ingen kamera hittades',
            text: 'Det verkar som att du inte har någon kamera ansluten till denna enheten.'
          }
        },
        preview: {
          unknownName: 'okänd',
          change: 'Avbryt',
          back: 'Tillbaka',
          done: 'Lägg till',
          unknown: {
            title: 'Laddar... Vänligen vänta på förhandsgranskning.',
            done: 'Skippa förhandsgranskning och acceptera'
          },
          regular: {
            title: 'Lägg till denna filen?',
            line1: 'Du håller på att lägga till filen ovan.',
            line2: 'Vänligen bekräfta.'
          },
          image: {
            title: 'Lägg till denna bilden?',
            change: 'Avbryt'
          },
          crop: {
            title: 'Beskär och lägg till denna bild',
            done: 'Klar',
            free: 'fri'
          },
          error: {
            default: {
              title: 'Oops!',
              text: 'Någonting gick fel under uppladdningen.',
              back: 'Vänligen försök igen'
            },
            image: {
              title: 'Endast bildfiler accepteras.',
              text: 'Vänligen försök igen med en annan fil.',
              back: 'Välj bild'
            },
            size: {
              title: 'Filen du har valt är för stor.',
              text: 'Vänligen försök igen med en annan fil.'
            },
            loadImage: {
              title: 'Fel',
              text: 'Kan inte ladda bild'
            }
          },
          multiple: {
            title: 'Du har valt %files%',
            question: 'Vill du lägga till alla dessa filer?',
            tooManyFiles: 'Du har valt för många filer. %max% är max.',
            tooFewFiles: 'Du har valt %files%. Minst %min% krävs.',
            clear: 'Ta bort alla',
            done: 'Klar'
          }
        }
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$5 = function pluralize(n) {
    if (n === 1) {
      return 'one';
    }

    return 'other';
  };

  var sv = {
    translations: translations$5,
    pluralize: pluralize$5
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$4 = {
    uploading: 'Yükleniyor... Lütfen bekleyin.',
    loadingInfo: 'Bilgiler yükleniyor...',
    errors: {
      default: 'Hata',
      baddata: 'Geçersiz değer',
      size: 'Dosya çok büyük',
      upload: 'Yüklenemedi',
      user: 'Yükleme iptal edildi',
      info: 'Bilgiler getirilemedi',
      image: 'Sadece resim dosyası yüklenebilir',
      createGroup: 'Dosya grubu yaratılamıyor',
      deleted: 'Dosya silinmiş'
    },
    draghere: 'Buraya bir dosya bırakın',
    file: {
      other: '%1 dosya'
    },
    buttons: {
      cancel: 'İptal',
      remove: 'Kaldır',
      choose: {
        files: {
          one: 'Dosya Seçin',
          other: 'Dosya Seçin'
        },
        images: {
          one: 'Resim Dosyası Seçin',
          other: 'Resim Dosyası Seçin'
        }
      }
    },
    dialog: {
      done: 'Bitti',
      showFiles: 'Dosyaları Göster',
      tabs: {
        names: {
          'empty-pubkey': 'Hoş geldiniz',
          preview: 'Önizleme',
          file: 'Bilgisayar',
          url: 'Dış Bağlantılar',
          camera: 'Kamera'
        },
        file: {
          drag: 'Buraya bir dosya bırakın',
          nodrop: 'Bilgisayarınızdan dosya yükleyin',
          or: 'ya da',
          button: 'Bilgisayardan bir dosya seç',
          also: 'Diğer yükleme seçenekleri',
          cloudsTip: 'Bulut depolamalar<br>ve sosyal hizmetler'
        },
        url: {
          title: 'Webden dosyalar',
          line1: 'Webden herhangi bir dosya seçin.',
          line2: 'Dosya bağlantısını sağlayın.',
          input: 'Bağlantınızı buraya yapıştırın...',
          button: 'Yükle'
        },
        camera: {
          capture: 'Fotoğraf çek',
          mirror: 'Ayna',
          retry: 'Tekrar izin iste',
          pleaseAllow: {
            title: 'Lütfen kameranıza erişilmesine izin verin',
            text: 'Bu siteden kamera erişimine izin vermeniz talep ediliyor. Kameranızla fotoğraf çekmek için bu isteği onaylamanız gerekmektedir.'
          },
          notFound: {
            title: 'Kamera algılanamadı',
            text: 'Bu cihaza kamera bağlantısının olmadığı görünüyor.'
          }
        },
        preview: {
          unknownName: 'bilinmeyen',
          change: 'İptal',
          back: 'Geri',
          done: 'Ekle',
          unknown: {
            title: 'Yükleniyor... Önizleme için lütfen bekleyin.',
            done: 'Önizlemeyi geç ve kabul et'
          },
          regular: {
            title: 'Bu dosya eklensin mi?',
            line1: 'Yukarıdaki dosyayı eklemek üzeresiniz.',
            line2: 'Lütfen onaylayın.'
          },
          image: {
            title: 'Bu görsel eklensin mi?',
            change: 'İptal'
          },
          crop: {
            title: 'Bu görseli kes ve ekle',
            done: 'Bitti'
          },
          error: {
            default: {
              title: 'Aman!',
              text: 'Yükleme sırasında bir hata oluştu.',
              back: 'Lütfen tekrar deneyin.'
            },
            image: {
              title: 'Sadece resim dosyaları kabul edilmektedir.',
              text: 'Lütfen başka bir dosya ile tekrar deneyin.',
              back: 'Resim dosyası seç'
            },
            size: {
              title: 'Seçtiğiniz dosya limitleri aşıyor.',
              text: 'Lütfen başka bir dosya ile tekrar deneyin.'
            },
            loadImage: {
              title: 'Hata',
              text: 'Resim dosyası yüklenemedi'
            }
          },
          multiple: {
            title: '%files% dosya seçtiniz',
            question: 'Bu dosyaların hepsini eklemek istiyor musunuz?',
            tooManyFiles: 'Fazla sayıda dosya seçtiniz, en fazla %max% dosya olabilir.',
            tooFewFiles: '%files% dosya seçtiniz, en az %min% dosya olmalıdır.',
            clear: 'Hepsini kaldır',
            done: 'Bitti'
          }
        }
      }
    }
  };

  var pluralize$4 = function pluralize(n) {
    return 'other';
  };

  var tr = {
    translations: translations$4,
    pluralize: pluralize$4
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$3 = {
    uploading: 'Завантаження... Зачекайте.',
    loadingInfo: 'Завантаження інформації...',
    errors: {
      default: 'Помилка',
      baddata: 'Неправильне значення',
      size: 'Завеликий файл',
      upload: 'Помилка завантаження',
      user: 'Завантаження скасовано',
      info: 'Помилка завантаження інформації',
      image: 'Дозволені лише зображення',
      createGroup: 'Неможливо створити групу файлів',
      deleted: 'Файл видалено'
    },
    draghere: 'Перетягніть файл сюди',
    file: {
      one: '%1 файл',
      few: '%1 файли',
      many: '%1 файлів'
    },
    buttons: {
      cancel: 'Скасувати',
      remove: 'Видалити',
      choose: {
        files: {
          one: 'Вибрати файл',
          other: 'Вибрати файли'
        },
        images: {
          one: 'Вибрати зображення',
          other: 'Вибрати зображення'
        }
      }
    },
    dialog: {
      close: 'Закрити',
      openMenu: 'Відкрити меню',
      done: 'Готово',
      showFiles: 'Показати файли',
      tabs: {
        names: {
          'empty-pubkey': 'Вітання',
          preview: 'Попередній перегляд',
          file: 'Локальні файли',
          url: 'Пряме посилання',
          camera: 'Камера'
        },
        file: {
          drag: 'Перетягніть<br>будь-які файли',
          nodrop: "Завантаження файлів з вашого комп'ютера",
          cloudsTip: 'Хмарні сховища<br>та соціальні мережі',
          or: 'або',
          button: 'Обрати локальний файл',
          also: 'або обрати з'
        },
        url: {
          title: 'Файли з інших сайтів',
          line1: 'Візьміть будь-який файл з Інтернету..',
          line2: 'Вкажіть тут посилання.',
          input: 'Вставте ваше посилання тут...',
          button: 'Завантажити'
        },
        camera: {
          title: 'Файл із відеокамери',
          capture: 'Зробити знімок',
          mirror: 'Віддзеркалити',
          startRecord: 'Записати відео',
          stopRecord: 'Стоп',
          cancelRecord: 'Скасувати',
          retry: 'Повторний запит дозволу',
          pleaseAllow: {
            title: 'Будь ласка, надайте доступ до вашої камери',
            text: 'Вам буде запропоновано дозволити доступ до камери з цього сайту.<br>' + 'Для того, щоб фотографувати за допомогою камери, ви повинні схвалити цей запит.'
          },
          notFound: {
            title: 'Камера не виявлена',
            text: 'Схоже, у вас немає камери, підключеної до цього пристрою.'
          }
        },
        preview: {
          unknownName: 'невідомо',
          change: 'Скасувати',
          back: 'Назад',
          done: 'Додати',
          unknown: {
            title: 'Завантаження... Зачекайте на попередній перегляд.',
            done: 'Пропустити перегляд і прийняти'
          },
          regular: {
            title: 'Додати цей файл?',
            line1: 'Ви збираєтеся додати файл вище.',
            line2: 'Будь ласка, підтвердіть.'
          },
          image: {
            title: 'Додати це зображення?',
            change: 'Скасувати'
          },
          crop: {
            title: 'Обрізати та додати це зображення',
            done: 'Готово',
            free: 'довільно'
          },
          video: {
            title: 'Додати це відео?',
            change: 'Скасувати'
          },
          error: {
            default: {
              title: 'Ой!',
              text: 'Під час завантаження сталася помилка.',
              back: 'Будь ласка, спробуйте ще раз'
            },
            image: {
              title: 'Приймаються лише файли зображень.',
              text: 'Повторіть спробу з іншим файлом.',
              back: 'Виберіть зображення'
            },
            size: {
              title: 'Розмір вибраного файлу перевищує ліміт.',
              text: 'Повторіть спробу з іншим файлом.'
            },
            loadImage: {
              title: 'Помилка',
              text: 'Помилка завантаження зображення'
            }
          },
          multiple: {
            title: 'Ви вибрали %files%.',
            question: 'Додати %files%?',
            tooManyFiles: 'Ви вибрали забагато файлів. Максимальна кількість %max%.',
            tooFewFiles: 'Ви вибрали %files%. Мінімальна кількість %min%.',
            clear: 'Видалити все',
            done: 'Додати',
            file: {
              preview: 'Попередній перегляд %file%',
              remove: 'Видалити %file%'
            }
          }
        }
      },
      footer: {
        text: 'працює на',
        link: 'uploadcare'
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$3 = function pluralize(n) {
    if ((n / 10 % 10 | 0) === 1 || n % 10 === 0 || n % 10 > 4) {
      return 'many';
    } else if (n % 10 === 1) {
      return 'one';
    } else {
      return 'few';
    }
  };

  var uk = {
    translations: translations$3,
    pluralize: pluralize$3
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$2 = {
    loadingInfo: 'Đang tải thông tin...',
    errors: {
      default: 'Lỗi',
      baddata: 'Giá trị không đúng',
      size: 'Tệp quá lớn',
      upload: 'Không thể tải lên',
      user: 'Tải lên bị hủy',
      info: 'Không thể nạp thông tin',
      image: 'Chỉ cho phép các hình ảnh',
      createGroup: 'Không thể tạo nhóm tệp',
      deleted: 'Tệp đã bị xóa'
    },
    uploading: 'Đang tải lên... Vui lòng chờ đợi.',
    draghere: 'Thả một tệp vào đây',
    file: {
      other: '%1 tệp'
    },
    buttons: {
      cancel: 'Hủy',
      remove: 'Xóa',
      choose: {
        files: {
          other: 'Lựa chọn các tệp'
        },
        images: {
          other: 'Lựa chọn hình ảnh'
        }
      }
    },
    dialog: {
      close: 'Đóng',
      openMenu: 'Mở menu',
      done: 'Xong',
      showFiles: 'Hiển thị tệp',
      tabs: {
        names: {
          'empty-pubkey': 'Chào mừng',
          preview: 'Xem trước',
          file: 'Các tệp trên máy',
          url: 'Liên kết tr.tiếp',
          camera: 'Máy ảnh',
          facebook: 'Facebook',
          dropbox: 'Dropbox',
          gdrive: 'Google Drive',
          instagram: 'Instagram',
          gphotos: 'Google Photos',
          vk: 'VK',
          evernote: 'Evernote',
          box: 'Box',
          onedrive: 'OneDrive',
          flickr: 'Flickr',
          huddle: 'Huddle'
        },
        file: {
          drag: 'kéo & thả<br>bất kỳ tệp nào',
          nodrop: 'Tải lên các tệp từ &nbsp;máy tính của bạn',
          cloudsTip: 'Lưu trữ Đám mây<br>và các mạng xã hội',
          or: 'hoặc',
          button: 'Lựa chọn một tệp trên máy',
          also: 'hoặc lựa chọn từ'
        },
        url: {
          title: 'Các tệp trên Web',
          line1: 'Chọn bất từ tệp nào từ web.',
          line2: 'Chỉ cần cung cấp liên kết.',
          input: 'Dán liên kết của bạn xuống đây...',
          button: 'Tải lên'
        },
        camera: {
          title: 'Tệp từ web cam',
          capture: 'Chụp một bức ảnh',
          mirror: 'Gương',
          startRecord: 'Quay một video',
          cancelRecord: 'Hủy',
          stopRecord: 'Dừng',
          retry: 'Yêu cầu cấp phép lần nữa',
          pleaseAllow: {
            text: 'Bạn đã được nhắc nhở để cho phép truy cập vào camera từ trang này.<br>Để có thể chụp ảnh với camera, bạn phải chấp thuận yêu cầu này.',
            title: 'Vui lòng cho phép truy cập tới camera của bạn'
          },
          notFound: {
            title: 'Không tìm thấy camera nào',
            text: 'Có vẻ như bạn không có camera nào nối với thiết bị này.'
          }
        },
        preview: {
          unknownName: 'vô danh',
          change: 'Hủy',
          back: 'Quay lại',
          done: 'Thêm',
          unknown: {
            title: 'Đang tải lên...Vui lòng đợi để xem trước.',
            done: 'Bỏ qua và chấp nhận'
          },
          regular: {
            title: 'Thêm tệp này?',
            line1: 'Bạn dự định thêm tệp ở trên.',
            line2: 'Vui lòng chấp thuận.'
          },
          image: {
            title: 'Thêm hình ảnh này?',
            change: 'Hủy'
          },
          crop: {
            title: 'Cắt và thêm ảnh này',
            done: 'Xong',
            free: 'miễn phí'
          },
          video: {
            title: 'Thêm video này?',
            change: 'Hủy'
          },
          error: {
            default: {
              title: 'Ồ!',
              back: 'Vui lòng thử lại',
              text: 'Có lỗi gì đó trong quá trình tải lên.'
            },
            image: {
              title: 'Chỉ chấp thuận các tệp hình ảnh.',
              text: 'Vui lòng thử lại với một tệp mới.',
              back: 'Lựa chọn hình ảnh'
            },
            size: {
              title: 'Tệp bạn đã lựa chọn vượt quá giới hạn',
              text: 'Vui lòng thử lại với một tệp khác.'
            },
            loadImage: {
              title: 'Lỗi',
              text: 'Không thể tải hình ảnh'
            }
          },
          multiple: {
            title: 'Bạn đã lựa chọn %files%',
            question: 'Thêm %files%?',
            tooManyFiles: 'Bạn đã lựa chọn quá nhiều tệp. %max% là tối đa.',
            tooFewFiles: 'Bạn đã lựa chọn %files%. Ít nhất cần %min%',
            clear: 'Xoá Tất cả',
            file: {
              preview: 'Xem trước %file%',
              remove: 'Xóa %file%'
            },
            done: 'Thêm'
          }
        }
      },
      footer: {
        text: 'được hỗ trợ bởi',
        link: 'uploadcare'
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$2 = function pluralize(n) {
    return 'other';
  };

  var vi = {
    translations: translations$2,
    pluralize: pluralize$2
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations$1 = {
    uploading: '上傳中...請等待',
    loadingInfo: '正在讀取資訊...',
    errors: {
      default: '錯誤',
      baddata: '錯誤資料',
      size: '檔案太大',
      upload: '無法上傳',
      user: '上傳被取消',
      info: '無法讀取資訊',
      image: '只允許圖片檔案',
      createGroup: '無法建立檔案群組',
      deleted: '檔案已被刪除'
    },
    draghere: '拖放檔案到這裡',
    file: {
      other: '%1 個檔案'
    },
    buttons: {
      cancel: '取消',
      remove: '刪除',
      choose: {
        files: {
          one: '選擇檔案',
          other: '選擇檔案'
        },
        images: {
          one: '選擇圖片',
          other: '選擇圖片'
        }
      }
    },
    dialog: {
      done: '完成',
      showFiles: '顯示檔案',
      tabs: {
        names: {
          'empty-pubkey': '歡迎',
          preview: '預覽',
          file: '從本機上傳',
          url: '任意圖片連結',
          camera: '相機'
        },
        file: {
          drag: '拖放檔案到這裡',
          nodrop: '從你的本機中上傳',
          cloudsTip: '雲端硬碟<br>與社群網站',
          or: '或者',
          button: '從本機中選取檔案',
          also: '你也可以選自'
        },
        url: {
          title: '來自網際網路的檔案',
          line1: '從網際網路選取檔案',
          line2: '只需提供連結',
          input: '將連結複製至此...',
          button: '上傳'
        },
        camera: {
          capture: '拍照',
          mirror: '鏡像',
          retry: '重新取得相機權限',
          pleaseAllow: {
            title: '請允許使存取您的相機',
            text: '你一直在提示允許來自這個網站的訪問攝像頭。' + '為了拍照用你的相機，你必須批准這一請求。'
          },
          notFound: {
            title: '沒有找到相機',
            text: '看起來你有沒有將連接相機。'
          }
        },
        preview: {
          unknownName: '未知',
          change: '取消',
          back: '返回',
          done: '加入',
          unknown: {
            title: '上傳中...請等待預覽',
            done: '跳過預覽，直接接受'
          },
          regular: {
            title: '加入這個檔案？',
            line1: '你將加入上面的檔案。',
            line2: '請確認。'
          },
          image: {
            title: '加入這個圖片？',
            change: '取消'
          },
          crop: {
            title: '裁切並加入這個圖片',
            done: '完成',
            free: '自由裁切'
          },
          error: {
            default: {
              title: '錯誤！',
              text: '上傳過程中出錯。',
              back: '請重試'
            },
            image: {
              title: '只允許上傳圖片檔案。',
              text: '請選擇其他檔案重新上傳。',
              back: '選擇圖片'
            },
            size: {
              title: '你選取的檔案超過了100MB的上限',
              text: '請用另一個檔案再試一次。'
            },
            loadImage: {
              title: '錯誤',
              text: '無法讀取圖片'
            }
          },
          multiple: {
            title: '你已經選擇 %files%',
            question: '你要加入所有檔案嗎？',
            tooManyFiles: '你選了太多的檔案. 最多可選擇%max%. 請刪除一些。',
            tooFewFiles: '你所選擇的檔案 %files%. 至少要 %min% .',
            clear: '清空',
            done: '完成'
          }
        }
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize$1 = function pluralize(n) {
    return 'other';
  };

  var zhTW = {
    translations: translations$1,
    pluralize: pluralize$1
  }; // #
  // # Please, do not use this locale as a reference for new translations.
  // # It could be outdated or incomplete. Always use the latest English versions:
  // # https://github.com/uploadcare/uploadcare-widget/blob/master/app/assets/javascripts/uploadcare/locale/en.js
  // #
  // # Any fixes are welcome.
  // #

  var translations = {
    uploading: '上传中...请等待',
    loadingInfo: '正在读取信息...',
    errors: {
      default: '错误',
      baddata: '错误数据',
      size: '文件太大',
      upload: '无法上传',
      user: '上传被取消',
      info: '无法读取信息',
      image: '只允许图形文件',
      createGroup: '无法建立文件组',
      deleted: '文件已被删除'
    },
    draghere: '拖放文件到这里',
    file: {
      other: '%1 个文件'
    },
    buttons: {
      cancel: '取消',
      remove: '删除'
    },
    dialog: {
      done: '完成',
      showFiles: '显示文件',
      tabs: {
        names: {
          url: '任意图片链接'
        },
        file: {
          drag: '拖放文件到这里',
          nodrop: '从你的电脑中上传',
          or: '或者',
          button: '从电脑中选取文件',
          also: '你也可以选自'
        },
        url: {
          title: '来自互联网的文件',
          line1: '从互联网选取文件',
          line2: '只需提供链接',
          input: '将链接拷贝至此...',
          button: '上传'
        },
        preview: {
          unknownName: '未知',
          change: '取消',
          back: '返回',
          done: '添加',
          unknown: {
            title: '上传中...请等待预览',
            done: '跳过预览，直接接受'
          },
          regular: {
            title: '添加这个文件?',
            line1: '你将添加上面的文件。',
            line2: '请确认。'
          },
          image: {
            title: '添加这个图片?',
            change: '取消'
          },
          crop: {
            title: '剪裁并添加这个图片',
            done: '完成'
          },
          error: {
            default: {
              title: '错误!',
              text: '上传过程中出错。',
              back: '请重试'
            },
            image: {
              title: '只允许上传图片文件。',
              text: '请选择其他文件重新上传。',
              back: '选择图片'
            },
            size: {
              title: '你选取的文件超过了100MB的上限',
              text: '请用另一个文件再试一次。'
            },
            loadImage: {
              title: '错误',
              text: '无法读取图片'
            }
          },
          multiple: {
            title: '你已经选择 %files%',
            question: '你要添加所有文件吗？',
            tooManyFiles: '你选了太多的文件. 最多可选择%max%. 请删除一些。',
            clear: '清空',
            done: '完成'
          }
        }
      }
    }
  }; // Pluralization rules taken from:
  // https://unicode.org/cldr/charts/34/supplemental/language_plural_rules.html

  var pluralize = function pluralize(n) {
    return 'other';
  };

  var zh = {
    translations: translations,
    pluralize: pluralize
  };
  var locales = {
    ar: ar,
    az: az,
    ca: ca,
    cs: cs,
    da: da,
    de: de,
    el: el,
    en: en,
    es: es,
    et: et,
    fr: fr,
    he: he,
    is: is,
    it: it,
    ja: ja,
    ko: ko,
    lv: lv,
    nb: nb,
    nl: nl,
    pl: pl,
    pt: pt,
    ro: ro,
    ru: ru,
    sk: sk,
    sr: sr,
    sv: sv,
    tr: tr,
    uk: uk,
    vi: vi,
    zhTW: zhTW,
    zh: zh
  };
  var currentLocale = null;
  var locale = {
    translations: Object.keys(locales).reduce(function (translations, lang) {
      translations[lang] = locales[lang].translations;
      return translations;
    }, {}),
    pluralize: Object.keys(locales).reduce(function (pluralize, lang) {
      pluralize[lang] = locales[lang].pluralize;
      return pluralize;
    }, {}),
    // Backdoor for widget constructor
    rebuild: function rebuild(settings) {
      currentLocale = null;
      return _build(settings);
    },
    t: function t(key, n) {
      var locale, ref, value;
      locale = _build();
      value = translate(key, locale.translations);

      if (value == null && locale.lang !== defaults.lang) {
        locale = defaults;
        value = translate(key, locale.translations);
      }

      if (n != null) {
        if (locale.pluralize != null) {
          value = ((ref = value[locale.pluralize(n)]) != null ? ref.replace('%1', n) : undefined) || n;
        } else {
          value = '';
        }
      }

      return value || '';
    }
  };
  var defaultLang = 'en';
  var defaults = {
    lang: defaultLang,
    translations: locales[defaultLang].translations,
    pluralize: locales[defaultLang].pluralize
  };

  var _build = function _build(stgs) {
    if (!currentLocale) {
      var settings = build(stgs);
      var lang = settings.locale || defaults.lang;
      var translations = $__default['default'].extend(true, {}, locale.translations[lang], settings.localeTranslations);
      var pluralize = $__default['default'].isFunction(settings.localePluralize) ? settings.localePluralize : locale.pluralize[lang];
      currentLocale = {
        lang: lang,
        translations: translations,
        pluralize: pluralize
      };
    }

    return currentLocale;
  };

  var translate = function translate(key, node) {
    var path = key.split('.');

    for (var i = 0, len = path.length; i < len; i++) {
      var subkey = path[i];

      if (node == null) {
        return null;
      }

      node = node[subkey];
    }

    return node;
  };

  var FileGroup$1 = /*#__PURE__*/function () {
    function FileGroup(files, settings) {
      var _this = this;

      _classCallCheck(this, FileGroup);

      this.__uuid = null;
      this.settings = build(settings);
      this.__fileColl = new CollectionOfPromises(files);
      this.__allFilesDf = $__default['default'].when.apply($__default['default'], _toConsumableArray(this.files()));

      this.__fileInfosDf = function () {
        var file;

        files = function () {
          var j, len, ref, results;
          ref = this.files();
          results = [];

          for (j = 0, len = ref.length; j < len; j++) {
            file = ref[j];
            results.push( // eslint-disable-next-line handle-callback-err
            file.then(null, function (err, info) {
              return $__default['default'].when(info);
            }));
          }

          return results;
        }.call(_this);

        return $__default['default'].when.apply($__default['default'], _toConsumableArray(files));
      }();

      this.__createGroupDf = $__default['default'].Deferred();

      this.__initApiDeferred();
    }

    _createClass(FileGroup, [{
      key: "files",
      value: function files() {
        return this.__fileColl.get();
      }
    }, {
      key: "__save",
      value: function __save() {
        var _this2 = this;

        if (!this.__saved) {
          this.__saved = true;
          return this.__allFilesDf.done(function () {
            return _this2.__createGroup().done(function (groupInfo) {
              _this2.__uuid = groupInfo.id;
              return _this2.__buildInfo(function (info) {
                if (_this2.settings.imagesOnly && !info.isImage) {
                  return _this2.__createGroupDf.reject('image', info);
                } else {
                  return _this2.__createGroupDf.resolve(info);
                }
              });
            }).fail(function (error) {
              return _this2.__createGroupDf.reject('createGroup', error);
            });
          });
        }
      } // returns object similar to File object

    }, {
      key: "promise",
      value: function promise() {
        this.__save();

        return this.__apiDf.promise();
      }
    }, {
      key: "__initApiDeferred",
      value: function __initApiDeferred() {
        var _this3 = this;

        var notify, reject, resolve;
        this.__apiDf = $__default['default'].Deferred();
        this.__progressState = 'uploading';

        reject = function reject(err) {
          return _this3.__buildInfo(function (info) {
            return _this3.__apiDf.reject(err, info);
          });
        };

        resolve = function resolve(info) {
          return _this3.__apiDf.resolve(info);
        };

        notify = function notify() {
          return _this3.__apiDf.notify(_this3.__progressInfo());
        };

        notify();

        this.__fileColl.onAnyProgress(notify);

        this.__allFilesDf.done(function () {
          _this3.__progressState = 'uploaded';
          return notify();
        }).fail(reject);

        return this.__createGroupDf.done(function (info) {
          _this3.__progressState = 'ready';
          notify();
          return resolve(info);
        }).fail(reject);
      }
    }, {
      key: "__progressInfo",
      value: function __progressInfo() {
        var j, len, progress, progressInfo, progressInfos;
        progress = 0;
        progressInfos = this.__fileColl.lastProgresses();

        for (j = 0, len = progressInfos.length; j < len; j++) {
          progressInfo = progressInfos[j];
          progress += ((progressInfo != null ? progressInfo.progress : undefined) || 0) / progressInfos.length;
        }

        return {
          state: this.__progressState,
          uploadProgress: progress,
          progress: this.__progressState === 'ready' ? 1 : progress * 0.9
        };
      }
    }, {
      key: "__buildInfo",
      value: function __buildInfo(cb) {
        var info;
        info = {
          uuid: this.__uuid,
          cdnUrl: this.__uuid ? "".concat(this.settings.cdnBase, "/").concat(this.__uuid, "/") : null,
          name: locale.t('file', this.__fileColl.length()),
          count: this.__fileColl.length(),
          size: 0,
          isImage: true,
          isStored: true
        };
        return this.__fileInfosDf.done(function () {
          var _info, j, len;

          for (var _len = arguments.length, infos = new Array(_len), _key = 0; _key < _len; _key++) {
            infos[_key] = arguments[_key];
          }

          for (j = 0, len = infos.length; j < len; j++) {
            _info = infos[j];
            info.size += _info.size;

            if (!_info.isImage) {
              info.isImage = false;
            }

            if (!_info.isStored) {
              info.isStored = false;
            }
          }

          return cb(info);
        });
      }
    }, {
      key: "__createGroup",
      value: function __createGroup() {
        var _this4 = this;

        var df;
        df = $__default['default'].Deferred();

        if (this.__fileColl.length()) {
          this.__fileInfosDf.done(function () {
            for (var _len2 = arguments.length, infos = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
              infos[_key2] = arguments[_key2];
            }

            var info;
            return jsonp("".concat(_this4.settings.urlBase, "/group/?jsonerrors=1"), 'POST', {
              pub_key: _this4.settings.publicKey,
              signature: _this4.settings.secureSignature,
              expire: _this4.settings.secureExpire,
              files: function () {
                var j, len, results;
                results = [];

                for (j = 0, len = infos.length; j < len; j++) {
                  info = infos[j];
                  results.push("/".concat(info.uuid, "/").concat(info.cdnUrlModifiers || ''));
                }

                return results;
              }()
            }, {
              headers: {
                'X-UC-User-Agent': _this4.settings._userAgent
              }
            }).fail(function (error) {
              if (_this4.settings.debugUploads) {
                log("Can't create group.", _this4.settings.publicKey, error.message);
              }

              return df.reject(error);
            }).done(df.resolve);
          });
        } else {
          df.reject();
        }

        return df.promise();
      }
    }, {
      key: "api",
      value: function api() {
        if (!this.__api) {
          this.__api = bindAll(this, ['promise', 'files']);
        }

        return this.__api;
      }
    }]);

    return FileGroup;
  }();

  var SavedFileGroup = /*#__PURE__*/function (_FileGroup) {
    _inherits(SavedFileGroup, _FileGroup);

    var _super = _createSuper(SavedFileGroup);

    function SavedFileGroup(data, settings) {
      var _this5;

      _classCallCheck(this, SavedFileGroup);

      var files;
      files = filesFrom('ready', data.files, settings);
      _this5 = _super.call(this, files, settings);
      _this5.__data = data;
      return _this5;
    }

    _createClass(SavedFileGroup, [{
      key: "__createGroup",
      value: function __createGroup() {
        return wrapToPromise(this.__data);
      }
    }]);

    return SavedFileGroup;
  }(FileGroup$1);

  var FileGroup = function FileGroup() {
    var filesAndGroups = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var settings = arguments.length > 1 ? arguments[1] : undefined;
    var file, files, item, j, k, len, len1, ref;
    files = [];

    for (j = 0, len = filesAndGroups.length; j < len; j++) {
      item = filesAndGroups[j];

      if (isFile(item)) {
        files.push(item);
      } else if (isFileGroup(item)) {
        ref = item.files();

        for (k = 0, len1 = ref.length; k < len1; k++) {
          file = ref[k];
          files.push(file);
        }
      }
    }

    return new FileGroup$1(files, settings).api();
  };

  var loadFileGroup = function loadFileGroup(groupIdOrUrl, settings) {
    var df, id;
    settings = build(settings);
    df = $__default['default'].Deferred();
    id = groupIdRegex.exec(groupIdOrUrl);

    if (id) {
      jsonp("".concat(settings.urlBase, "/group/info/"), 'GET', {
        jsonerrors: 1,
        pub_key: settings.publicKey,
        group_id: id[0]
      }, {
        headers: {
          'X-UC-User-Agent': settings._userAgent
        }
      }).fail(function (error) {
        if (settings.debugUploads) {
          log("Can't load group info. Probably removed.", id[0], settings.publicKey, error.message);
        }

        return df.reject(error);
      }).done(function (data) {
        var group;
        group = new SavedFileGroup(data, settings);
        return df.resolve(group.api());
      });
    } else {
      df.reject();
    }

    return df.promise();
  };

  var callbacks = {};
  isWindowDefined() && $__default['default'](window).on('message', function (_ref) {
    var e = _ref.originalEvent;
    var i, item, len, message, ref, results;

    try {
      message = JSON.parse(e.data);
    } catch (error) {
      return;
    }

    if ((message != null ? message.type : undefined) && message.type in callbacks) {
      ref = callbacks[message.type];
      results = [];

      for (i = 0, len = ref.length; i < len; i++) {
        item = ref[i];

        if (e.source === item[0]) {
          results.push(item[1](message));
        } else {
          results.push(undefined);
        }
      }

      return results;
    }
  });

  var registerMessage = function registerMessage(type, sender, callback) {
    if (!(type in callbacks)) {
      callbacks[type] = [];
    }

    return callbacks[type].push([sender, callback]);
  };

  var unregisterMessage = function unregisterMessage(type, sender) {
    if (type in callbacks) {
      callbacks[type] = $__default['default'].grep(callbacks[type], function (item) {
        return item[0] !== sender;
      });
      return callbacks[type];
    }
  };

  var tabsCss = new CssCollector();

  var RemoteTab = /*#__PURE__*/function () {
    function RemoteTab(container, tabButton, dialogApi, settings, name1) {
      var _this = this;

      _classCallCheck(this, RemoteTab);

      this.__createIframe = this.__createIframe.bind(this);
      this.container = container;
      this.tabButton = tabButton;
      this.dialogApi = dialogApi;
      this.settings = settings;
      this.name = name1;
      this.dialogApi.progress(function (name) {
        if (name === _this.name) {
          _this.__createIframe();

          _this.container.find('.uploadcare--tab__iframe').focus();
        }

        return _this.__sendMessage({
          type: 'visibility-changed',
          visible: name === _this.name
        });
      });
    }

    _createClass(RemoteTab, [{
      key: "remoteUrl",
      value: function remoteUrl() {
        return "".concat(this.settings.socialBase, "/window3/").concat(this.name, "?") + $__default['default'].param({
          lang: this.settings.locale,
          public_key: this.settings.publicKey,
          widget_version: version,
          images_only: this.settings.imagesOnly,
          pass_window_open: this.settings.passWindowOpen
        });
      }
    }, {
      key: "__sendMessage",
      value: function __sendMessage(messageObj) {
        var ref, ref1;
        return (ref = this.iframe) != null ? (ref1 = ref[0].contentWindow) != null ? ref1.postMessage(JSON.stringify(messageObj), '*') : undefined : undefined;
      }
    }, {
      key: "__createIframe",
      value: function __createIframe() {
        var _this2 = this;

        var iframe;

        if (this.iframe) {
          return;
        }

        this.iframe = $__default['default']('<iframe>', {
          src: this.remoteUrl(),
          marginheight: 0,
          marginwidth: 0,
          frameborder: 0,
          allowTransparency: 'true'
        }).addClass('uploadcare--tab__iframe').appendTo(this.container).on('load', function () {
          var i, j, len, len1, ref, ref1, style, url;

          _this2.iframe.css('opacity', '1');

          ref = tabsCss.urls;

          for (i = 0, len = ref.length; i < len; i++) {
            url = ref[i];

            _this2.__sendMessage({
              type: 'embed-css',
              url: url
            });
          }

          ref1 = tabsCss.styles;

          for (j = 0, len1 = ref1.length; j < len1; j++) {
            style = ref1[j];

            _this2.__sendMessage({
              type: 'embed-css',
              style: style
            });
          }
        });
        this.container.addClass('uploadcare--tab_remote');
        iframe = this.iframe[0].contentWindow;
        registerMessage('file-selected', iframe, function (message) {
          var file, sourceInfo, url;

          url = function () {
            var i, key, len, ref, type;

            if (message.alternatives) {
              ref = _this2.settings.preferredTypes;

              for (i = 0, len = ref.length; i < len; i++) {
                type = ref[i];
                type = globRegexp(type);

                for (key in message.alternatives) {
                  if (type.test(key)) {
                    return message.alternatives[key];
                  }
                }
              }
            }

            return message.url;
          }();

          sourceInfo = $__default['default'].extend({
            source: _this2.name
          }, message.info || {});
          file = new UrlFile(url, _this2.settings, sourceInfo);

          if (message.filename) {
            file.setName(message.filename);
          }

          if (message.is_image != null) {
            file.setIsImage(message.is_image);
          }

          return _this2.dialogApi.addFiles([file.promise()]);
        });
        registerMessage('open-new-window', iframe, function (message) {
          var interval, popup, resolve;

          if (_this2.settings.debugUploads) {
            debug('Open new window message.', _this2.name);
          }

          popup = window.open(message.url, '_blank');

          if (!popup) {
            warn("Can't open new window. Possible blocked.", _this2.name);
            return;
          }

          resolve = function resolve() {
            if (_this2.settings.debugUploads) {
              debug('Window is closed.', _this2.name);
            }

            return _this2.__sendMessage({
              type: 'navigate',
              fragment: ''
            });
          }; // Detect is window supports "closed".
          // In browsers we have only "closed" property.
          // In Cordova addEventListener('exit') does work.


          if ('closed' in popup) {
            interval = setInterval(function () {
              if (popup.closed) {
                clearInterval(interval);
                return resolve();
              }
            }, 100);
            return interval;
          } else {
            return popup.addEventListener('exit', resolve);
          }
        });
        return this.dialogApi.done(function () {
          unregisterMessage('file-selected', iframe);
          return unregisterMessage('open-new-window', iframe);
        });
      }
    }]);

    return RemoteTab;
  }();

  var _namespace = {
    version: version,
    jQuery: $__default['default'],
    utils: {
      abilities: {
        fileAPI: fileAPI,
        sendFileAPI: sendFileAPI,
        dragAndDrop: dragAndDrop,
        canvas: canvas,
        fileDragAndDrop: fileDragAndDrop,
        iOSVersion: iOSVersion,
        Blob: Blob,
        URL: URL,
        FileReader: FileReader
      },
      Collection: Collection,
      UniqCollection: UniqCollection,
      CollectionOfPromises: CollectionOfPromises,
      imageLoader: imageLoader,
      videoLoader: videoLoader,
      log: log,
      debug: debug,
      warn: warn,
      warnOnce: warnOnce,
      //   commonWarning
      registerMessage: registerMessage,
      unregisterMessage: unregisterMessage,
      unique: unique,
      defer: defer,
      gcd: gcd,
      once: once,
      wrapToPromise: wrapToPromise,
      then: then,
      bindAll: bindAll,
      upperCase: upperCase,
      publicCallbacks: publicCallbacks,
      uuid: uuid,
      splitUrlRegex: splitUrlRegex,
      uuidRegex: uuidRegex,
      groupIdRegex: groupIdRegex,
      cdnUrlRegex: cdnUrlRegex,
      splitCdnUrl: splitCdnUrl,
      escapeRegExp: escapeRegExp,
      globRegexp: globRegexp,
      normalizeUrl: normalizeUrl,
      fitText: fitText,
      fitSizeInCdnLimit: fitSizeInCdnLimit,
      fitSize: fitSize,
      applyCropCoordsToInfo: applyCropCoordsToInfo,
      fileInput: fileInput,
      fileSelectDialog: fileSelectDialog,
      fileSizeLabels: fileSizeLabels,
      readableFileSize: readableFileSize,
      ajaxDefaults: ajaxDefaults,
      jsonp: jsonp,
      canvasToBlob: canvasToBlob,
      taskRunner: taskRunner,
      fixedPipe: fixedPipe,
      isFile: isFile,
      valueToFile: valueToFile,
      image: {
        shrinkFile: shrinkFile,
        shrinkImage: shrinkImage,
        drawFileToCanvas: drawFileToCanvas,
        readJpegChunks: readJpegChunks,
        replaceJpegChunk: replaceJpegChunk,
        getExif: getExif,
        parseExifOrientation: parseExifOrientation,
        hasTransparency: hasTransparency
      },
      pusher: {
        getPusher: getPusher
      },
      isFileGroup: isFileGroup,
      valueToGroup: valueToGroup,
      isFileGroupsEqual: isFileGroupsEqual
    },
    settings: {
      globals: globals,
      build: build,
      common: common,
      waitForSettings: waitForSettings,
      CssCollector: CssCollector
    },
    locale: locale,
    tabsCss: tabsCss,
    files: {
      BaseFile: BaseFile,
      ObjectFile: ObjectFile,
      InputFile: InputFile,
      UrlFile: UrlFile,
      UploadedFile: UploadedFile,
      ReadyFile: ReadyFile,
      FileGroup: FileGroup$1,
      SavedFileGroup: SavedFileGroup
    },
    Pusher: pusher_1,
    FileGroup: FileGroup,
    loadFileGroup: loadFileGroup,
    fileFrom: fileFrom,
    filesFrom: filesFrom,
    __exports: {},
    namespace: function namespace(path, fn) {
      var target = _namespace;

      if (path) {
        var ref = path.split('.');

        for (var i = 0, len = ref.length; i < len; i++) {
          var part = ref[i];

          if (!target[part]) {
            target[part] = {};
          }

          target = target[part];
        }
      }

      return fn(target);
    },
    expose: function expose(key, value) {
      var parts = key.split('.');
      var last = parts.pop();
      var target = _namespace.__exports;
      var source = _namespace;

      for (var i = 0, len = parts.length; i < len; i++) {
        var part = parts[i];

        if (!target[part]) {
          target[part] = {};
        }

        target = target[part];
        source = source != null ? source[part] : undefined;
      }

      target[last] = value || source[last];
    }
  };

  function createPlugin(ns) {
    return function (fn) {
      return fn(ns);
    };
  }

  var plugin$2 = createPlugin(_namespace);
  var uploadcare$2 = {
    plugin: plugin$2,
    version: version,
    jQuery: $__default['default'],
    // Defaults (not normalized)
    defaults: _objectSpread2(_objectSpread2({}, defaults$1), {}, {
      allTabs: presets.tabs.all
    }),
    globals: common,
    start: common,
    fileFrom: fileFrom,
    filesFrom: filesFrom,
    FileGroup: FileGroup,
    loadFileGroup: loadFileGroup,
    locales: ['en']
  };

  var dialog = function dialog() {
    return "<div class=\"uploadcare--dialog\"><div class=\"uploadcare--dialog__container\"><button type=\"button\" title=\"".concat(locale.t('dialog.close'), "\" aria-label=\"").concat(locale.t('dialog.close'), "\" class=\"uploadcare--button uploadcare--button_icon uploadcare--button_muted uploadcare--dialog__close\"><svg role=\"presentation\" width=\"32\" height=\"32\" class=\"uploadcare--icon\"><use xlink:href=\"#uploadcare--icon-close\"></use></svg></button><div class=\"uploadcare--dialog__placeholder\"></div></div><div class=\"uploadcare--powered-by uploadcare--dialog__powered-by\">").concat(locale.t('dialog.footer.text'), " <a class=\"uploadcare--link uploadcare--powered-by__link\" href=\"https://uploadcare.com/uploader/").concat(version, "/\" target=\"_blank\"><svg width=\"32\" height=\"32\" role=\"presentation\" class=\"uploadcare--icon uploadcare--powered-by__logo\"><use xlink:href=\"#uploadcare--icon-uploadcare\"></use></svg> ").concat(locale.t('dialog.footer.link'), "</a></div></div>");
  };

  var dialogPanel = function dialogPanel() {
    return "<div class=\"uploadcare--panel\"><div class=\"uploadcare--menu uploadcare--panel__menu\"><button type=\"button\" title=\"".concat(locale.t('dialog.openMenu'), "\" aria-label=\"").concat(locale.t('dialog.openMenu'), "\" class=\"uploadcare--button uploadcare--button_icon uploadcare--button_muted uploadcare--menu__toggle\"><svg role=\"presentation\" width=\"32\" height=\"32\" class=\"uploadcare--icon uploadcare--menu__toggle-icon uploadcare--menu__toggle-icon_menu\"><use xlink:href=\"#uploadcare--icon-menu\"></use></svg> <svg role=\"presentation\" width=\"32\" height=\"32\" class=\"uploadcare--icon uploadcare--menu__toggle-icon uploadcare--menu__toggle-icon_back\"><use xlink:href=\"#uploadcare--icon-back\"></use></svg></button><div class=\"uploadcare--menu__items\"></div></div><div class=\"uploadcare--panel__content\"><div class=\"uploadcare--footer uploadcare--panel__footer\"><div class=\"uploadcare--footer__additions uploadcare--panel__message\"></div><button type=\"button\" class=\"uploadcare--button uploadcare--footer__button uploadcare--panel__show-files\">").concat(locale.t('dialog.showFiles'), "<div class=\"uploadcare--panel__file-counter\"></div></button> <button type=\"button\" class=\"uploadcare--button uploadcare--button_primary uploadcare--footer__button uploadcare--panel__done\">").concat(locale.t('dialog.done'), "</button></div><div class=\"uploadcare--powered-by uploadcare--panel__powered-by\">").concat(locale.t('dialog.footer.text'), " <a class=\"uploadcare--link uploadcare--powered-by__link\" href=\"https://uploadcare.com/uploader/").concat(version, "/\" target=\"_blank\"><svg width=\"32\" height=\"32\" role=\"presentation\" class=\"uploadcare--icon uploadcare--powered-by__logo\"><use xlink:href=\"#uploadcare--icon-uploadcare\"></use></svg> ").concat(locale.t('dialog.footer.link'), "</a></div></div></div>");
  };

  var progressText = function progressText() {
    return '<div class="uploadcare--progress__text-container"><div class="uploadcare--progress__text"></div></div>';
  };

  var tabCameraCapture = function tabCameraCapture() {
    return "<div class=\"uploadcare--tab__content\"><div class=\"uploadcare--text uploadcare--text_size_large uploadcare--tab__title\">".concat(locale.t('dialog.tabs.camera.title'), "</div><div class=\"uploadcare--camera__controls\"><button type=\"button\" class=\"uploadcare--button uploadcare--button_size_big uploadcare--button_primary uploadcare--camera__button uploadcare--camera__button_type_photo\">").concat(locale.t('dialog.tabs.camera.capture'), "</button> <button type=\"button\" class=\"uploadcare--button uploadcare--button_size_big uploadcare--button_primary uploadcare--camera__button uploadcare--camera__button_type_video\">").concat(locale.t('dialog.tabs.camera.startRecord'), "</button></div></div>");
  };

  var tabCamera = function tabCamera() {
    return "<div class=\"uploadcare--tab__content\"><div class=\"uploadcare--text uploadcare--text_size_large uploadcare--tab__title\">".concat(locale.t('dialog.tabs.camera.title'), "</div><div class=\"uploadcare--media uploadcare--camera__video-container\"><video muted class=\"uploadcare--media__video uploadcare--camera__video uploadcare--camera__video_mirrored\"></video><button type=\"button\" class=\"uploadcare--button uploadcare--button_size_small uploadcare--button_overlay uploadcare--camera__button uploadcare--camera__button_type_mirror\">").concat(locale.t('dialog.tabs.camera.mirror'), "</button></div><div class=\"uploadcare--camera__controls\"><button type=\"button\" class=\"uploadcare--button uploadcare--button_primary uploadcare--camera__button uploadcare--camera__button_type_start-record\">").concat(locale.t('dialog.tabs.camera.startRecord'), "</button> <button type=\"button\" class=\"uploadcare--button uploadcare--button_primary uploadcare--camera__button uploadcare--camera__button_type_capture\">").concat(locale.t('dialog.tabs.camera.capture'), "</button> <button type=\"button\" class=\"uploadcare--button uploadcare--camera__button uploadcare--camera__button_type_cancel-record\">").concat(locale.t('dialog.tabs.camera.cancelRecord'), "</button> <button type=\"button\" class=\"uploadcare--button uploadcare--button_primary uploadcare--camera__button uploadcare--camera__button_type_stop-record\">").concat(locale.t('dialog.tabs.camera.stopRecord'), "</button></div><div class=\"uploadcare--camera__please-allow\"><div class=\"uploadcare--text uploadcare--text_size_medium\">").concat(locale.t('dialog.tabs.camera.pleaseAllow.title'), "</div><div class=\"uploadcare--text\">").concat(locale.t('dialog.tabs.camera.pleaseAllow.text'), "</div></div><div class=\"uploadcare--camera__not-found\"><div class=\"uploadcare--text uploadcare--text_size_medium\">").concat(locale.t('dialog.tabs.camera.notFound.title'), "</div><div class=\"uploadcare--text\">").concat(locale.t('dialog.tabs.camera.notFound.text'), "</div></div><button type=\"button\" class=\"uploadcare--button uploadcare--camera__button uploadcare--camera__button_type_retry\">").concat(locale.t('dialog.tabs.camera.retry'), "</button></div>");
  };

  var tabFile = function tabFile() {
    return "<div class=\"uploadcare--tab__content uploadcare--draganddrop\"><div class=\"uploadcare--text uploadcare--text_size_extra-large uploadcare--dragging__show\">".concat(locale.t('draghere'), "</div><div class=\"uploadcare--draganddrop__title uploadcare--dragging__hide\"><div class=\"uploadcare--draganddrop__supported\"><div class=\"uploadcare--text uploadcare--text_size_extra-large\">").concat(locale.t('dialog.tabs.file.drag'), "</div><div class=\"uploadcare--text uploadcare--text_size_small uploadcare--text_muted\">").concat(locale.t('dialog.tabs.file.or'), "</div></div><div class=\"uploadcare--text uploadcare--text_size_large uploadcare--draganddrop__not-supported\">").concat(locale.t('dialog.tabs.file.nodrop'), "</div></div><button type=\"button\" class=\"uploadcare--button uploadcare--button_size_big uploadcare--button_primary uploadcare--tab__action-button needsclick uploadcare--dragging__hide\">").concat(locale.t('dialog.tabs.file.button'), "</button><div class=\"uploadcare--file-sources uploadcare--dragging__hide\"><div class=\"uploadcare--text uploadcare--text_size_small uploadcare--text_muted uploadcare--file-sources__caption\">").concat(locale.t('dialog.tabs.file.also'), "</div><div class=\"uploadcare--file-sources__items\"><button type=\"button\" class=\"uploadcare--button uploadcare--button_icon uploadcare--file-source uploadcare--file-source_all uploadcare--file-sources_item\"><svg role=\"presentation\" width=\"32\" height=\"32\" class=\"uploadcare--icon\"><use xlink:href=\"#uploadcare--icon-more\"></use></svg></button></div></div></div>");
  };

  var tabPreviewError = function tabPreviewError(_ref) {
    var debugUploads = _ref.debugUploads,
        errorType = _ref.errorType,
        error = _ref.error;
    return "<div class=\"uploadcare--tab__content uploadcare--preview__content uploadcare--error\"><div class=\"uploadcare--text uploadcare--text_size_large uploadcare--tab__title uploadcare--preview__title\">".concat(locale.t('dialog.tabs.preview.error.' + errorType + '.title') || locale.t('dialog.tabs.preview.error.default.title'), "</div><div class=\"uploadcare--text\">").concat(debugUploads && (error === null || error === void 0 ? void 0 : error.message) || locale.t("serverErrors.".concat(error === null || error === void 0 ? void 0 : error.code)) || (error === null || error === void 0 ? void 0 : error.message) || locale.t('dialog.tabs.preview.error.' + errorType + '.text') || locale.t('dialog.tabs.preview.error.default.text'), "</div><button type=\"button\" class=\"uploadcare--button uploadcare--preview__back\">").concat(locale.t('dialog.tabs.preview.error.' + errorType + '.back') || locale.t('dialog.tabs.preview.error.default.back'), "</button></div>");
  };
  /*!
   * escape-html
   * Copyright(c) 2012-2013 TJ Holowaychuk
   * Copyright(c) 2015 Andreas Lubbe
   * Copyright(c) 2015 Tiancheng "Timothy" Gu
   * MIT Licensed
   */

  /**
   * Module variables.
   * @private
   */


  var matchHtmlRegExp = /["'&<>]/;
  /**
   * Module exports.
   * @public
   */

  var escapeHtml_1 = escapeHtml;
  /**
   * Escape special characters in the given string of html.
   *
   * @param  {string} string The string to escape for inserting into HTML
   * @return {string}
   * @public
   */

  function escapeHtml(string) {
    var str = '' + string;
    var match = matchHtmlRegExp.exec(str);

    if (!match) {
      return str;
    }

    var escape;
    var html = '';
    var index = 0;
    var lastIndex = 0;

    for (index = match.index; index < str.length; index++) {
      switch (str.charCodeAt(index)) {
        case 34:
          // "
          escape = '&quot;';
          break;

        case 38:
          // &
          escape = '&amp;';
          break;

        case 39:
          // '
          escape = '&#39;';
          break;

        case 60:
          // <
          escape = '&lt;';
          break;

        case 62:
          // >
          escape = '&gt;';
          break;

        default:
          continue;
      }

      if (lastIndex !== index) {
        html += str.substring(lastIndex, index);
      }

      lastIndex = index + 1;
      html += escape;
    }

    return lastIndex !== index ? html + str.substring(lastIndex, index) : html;
  }

  var tabPreviewImage = function tabPreviewImage(_ref) {
    var src = _ref.src,
        _ref$name = _ref.name,
        name = _ref$name === void 0 ? '' : _ref$name,
        crop = _ref.crop;
    return "<div class=\"uploadcare--tab__header\"><div class=\"uploadcare--text uploadcare--text_size_large uploadcare--tab__title uploadcare--preview__title\">".concat(locale.t('dialog.tabs.preview.image.title'), "</div></div><div class=\"uploadcare--tab__content uploadcare--preview__content\"><div class=\"uploadcare--media\"><img src=\"").concat(src, "\" title=\"").concat(escapeHtml_1(name), "\" alt=\"").concat(escapeHtml_1(name), "\" class=\"uploadcare--media__image uploadcare--preview__image\"></div></div><div class=\"uploadcare--footer uploadcare--tab__footer\"><div class=\"uploadcare--footer__additions\">").concat(crop ? '<div class="uploadcare--crop-sizes"><div role="button" tabindex="0" class="uploadcare--button uploadcare--button_icon uploadcare--crop-sizes__item" data-caption="free"><div class="uploadcare--crop-sizes__icon"></div></div></div>' : '', "</div><button type=\"button\" class=\"uploadcare--button uploadcare--footer__button uploadcare--preview__back\">").concat(locale.t('dialog.tabs.preview.image.change'), "</button> <button type=\"button\" class=\"uploadcare--button uploadcare--button_primary uploadcare--footer__button uploadcare--preview__done\">").concat(locale.t('dialog.tabs.preview.done'), "</button></div>");
  };

  var tabPreviewMultipleFile = function tabPreviewMultipleFile() {
    return "<div class=\"uploadcare--file uploadcare--files__item uploadcare--file_status_uploading\"><div class=\"uploadcare--file__description\" tabindex=\"0\"><div class=\"uploadcare--file__preview\"></div><div class=\"uploadcare--file__name\">".concat(locale.t('dialog.tabs.preview.unknownName'), "</div><div class=\"uploadcare--file__size\"></div><div class=\"uploadcare--file__error\"></div></div><div class=\"uploadcare--file__progressbar\"><div class=\"uploadcare--progressbar\"><div class=\"uploadcare--progressbar__value\"></div></div></div><button type=\"button\" class=\"uploadcare--button uploadcare--button_icon uploadcare--button_muted uploadcare--file__remove\"><svg role=\"presentation\" width=\"32\" height=\"32\" class=\"uploadcare--icon\"><use xlink:href=\"#uploadcare--icon-remove\"></use></svg></button></div>");
  };

  var tabPreviewMultiple = function tabPreviewMultiple() {
    return "<div class=\"uploadcare--tab__header\"><div id=\"preview__title\" class=\"uploadcare--text uploadcare--text_size_large uploadcare--tab__title uploadcare--preview__title\" role=\"status\" aria-live=\"assertive\"></div></div><div class=\"uploadcare--tab__content uploadcare--preview__content\"><div class=\"uploadcare--files\"></div></div><div class=\"uploadcare--footer uploadcare--tab__footer\"><div class=\"uploadcare--footer__additions uploadcare--preview__message\"></div><button type=\"button\" class=\"uploadcare--button uploadcare--footer__button uploadcare--preview__back\">".concat(locale.t('dialog.tabs.preview.multiple.clear'), "</button> <button type=\"button\" class=\"uploadcare--button uploadcare--button_primary uploadcare--footer__button uploadcare--preview__done\" aria-describedby=\"preview_title\">").concat(locale.t('dialog.tabs.preview.multiple.done'), "</button></div>");
  };

  var tabPreviewRegular = function tabPreviewRegular(_ref) {
    var file = _ref.file;
    return "<div class=\"uploadcare--tab__header\"><div id=\"tab__title\" class=\"uploadcare--text uploadcare--text_size_large uploadcare--tab__title\" role=\"status\" aria-live=\"assertive\">".concat(locale.t('dialog.tabs.preview.regular.title'), "</div></div><div class=\"uploadcare--tab__content uploadcare--preview__content\"><div class=\"uploadcare--text uploadcare--preview__file-name\">").concat(escapeHtml_1(file.name) || locale.t('dialog.tabs.preview.unknownName'), " ").concat(readableFileSize(file.size, '', ', '), "</div></div><div class=\"uploadcare--footer uploadcare--tab__footer\"><button type=\"button\" class=\"uploadcare--button uploadcare--footer__button uploadcare--preview__back\">").concat(locale.t('dialog.tabs.preview.change'), "</button> <button type=\"button\" class=\"uploadcare--button uploadcare--button_primary uploadcare--footer__button uploadcare--preview__done\" aria-describedby=\"tab__title\">").concat(locale.t('dialog.tabs.preview.done'), "</button></div>");
  };

  var tabPreviewUnknown = function tabPreviewUnknown() {
    return "<div class=\"uploadcare--tab__header\"><div class=\"uploadcare--text uploadcare--text_size_large uploadcare--tab__title uploadcare--preview__title\">".concat(locale.t('dialog.tabs.preview.unknown.title'), "</div></div><div class=\"uploadcare--tab__content uploadcare--preview__content\"><div class=\"uploadcare--text uploadcare--preview__file-name\"></div></div><div class=\"uploadcare--footer uploadcare--tab__footer\"><button type=\"button\" class=\"uploadcare--button uploadcare--footer__button uploadcare--preview__back\">").concat(locale.t('dialog.tabs.preview.change'), "</button> <button type=\"button\" class=\"uploadcare--button uploadcare--button_primary uploadcare--footer__button uploadcare--preview__done\">").concat(locale.t('dialog.tabs.preview.unknown.done'), "</button></div>");
  };

  var tabPreviewVideo = function tabPreviewVideo() {
    return "<div class=\"uploadcare--tab__header\"><div class=\"uploadcare--text uploadcare--text_size_large uploadcare--tab__title uploadcare--preview__title\">".concat(locale.t('dialog.tabs.preview.video.title'), "</div></div><div class=\"uploadcare--tab__content uploadcare--preview__content\"><div class=\"uploadcare--media\"><video controls class=\"uploadcare--media__video uploadcare--preview__video\"></video></div></div><div class=\"uploadcare--footer uploadcare--tab__footer\"><button type=\"button\" class=\"uploadcare--button uploadcare--footer__button uploadcare--preview__back\">").concat(locale.t('dialog.tabs.preview.video.change'), "</button> <button type=\"button\" class=\"uploadcare--button uploadcare--button_primary uploadcare--footer__button uploadcare--preview__done\">").concat(locale.t('dialog.tabs.preview.done'), "</button></div>");
  };

  var tabUrl = function tabUrl() {
    return "<div class=\"uploadcare--tab__content\"><div class=\"uploadcare--text uploadcare--text_size_large uploadcare--tab__title\">".concat(locale.t('dialog.tabs.url.title'), "</div><div class=\"uploadcare--text\">").concat(locale.t('dialog.tabs.url.line1'), "</div><div class=\"uploadcare--text\">").concat(locale.t('dialog.tabs.url.line2'), "</div><form class=\"uploadcare--form\"><input type=\"text\" class=\"uploadcare--input\" placeholder=\"").concat(locale.t('dialog.tabs.url.input'), "\"> <button type=\"submit\" class=\"uploadcare--button uploadcare--button_primary uploadcare--tab__action-button\" type=\"submit\">").concat(locale.t('dialog.tabs.url.button'), "</button></form></div>");
  };

  var widgetButton = function widgetButton(_ref) {
    var caption = _ref.caption,
        name = _ref.name;
    return "<button type=\"button\" class=\"uploadcare--widget__button uploadcare--widget__button_type_".concat(name, "\">").concat(caption, "</button>");
  };

  var widgetFileName = function widgetFileName(_ref) {
    var name = _ref.name,
        size = _ref.size;
    return "<div class=\"uploadcare--link uploadcare--widget__file-name\" tabindex=\"0\" role=\"link\">".concat(escapeHtml_1(fitText(name, 20)), "</div><div class=\"uploadcare--widget__file-size\">, ").concat(readableFileSize(size), "</div>");
  };

  var widget = function widget() {
    return "<div class=\"uploadcare--widget\" aria-describedby=\"uploadcare--widget__text uploadcare--widget__progress\"><div class=\"uploadcare--widget__dragndrop-area\">".concat(locale.t('draghere'), "</div><div id=\"uploadcare--widget__progress\" class=\"uploadcare--widget__progress\" role=\"progressbar\" aria-valuenow=\"0\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div><div id=\"uploadcare--widget__text\" class=\"uploadcare--widget__text\" aria-live=\"polite\"></div></div>");
  };

  var _styles = ".uploadcare--jcrop-handle{box-sizing:border-box;padding:12.5px;width:45px;height:45px;background:transparent;z-index:2147483621}@media (min-width:760px){.uploadcare--jcrop-handle{height:35px;width:35px;padding:10px}}.uploadcare--jcrop-handle:before{content:\"\";display:block;width:20px;height:20px;background:#fff;box-shadow:inset 0 0 0 1px rgba(0,0,0,.2);border-radius:50%}@media (min-width:760px){.uploadcare--jcrop-handle:before{height:15px;width:15px}}.uploadcare--jcrop-handle.ord-nw{margin-top:-22.5px;margin-left:-22.5px;top:0;left:0}@media (min-width:760px){.uploadcare--jcrop-handle.ord-nw{margin-left:-17.5px;margin-top:-17.5px}}.uploadcare--jcrop-handle.ord-ne{margin-top:-22.5px;margin-right:-22.5px;top:0;right:0}@media (min-width:760px){.uploadcare--jcrop-handle.ord-ne{margin-right:-17.5px;margin-top:-17.5px}}.uploadcare--jcrop-handle.ord-se{margin-bottom:-22.5px;margin-right:-22.5px;bottom:0;right:0}@media (min-width:760px){.uploadcare--jcrop-handle.ord-se{margin-right:-17.5px;margin-bottom:-17.5px}}.uploadcare--jcrop-handle.ord-sw{margin-bottom:-22.5px;margin-left:-22.5px;bottom:0;left:0}@media (min-width:760px){.uploadcare--jcrop-handle.ord-sw{margin-left:-17.5px;margin-bottom:-17.5px}}.uploadcare--jcrop-hline{width:100%;height:1px!important;background-color:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.2);z-index:2147483620}.uploadcare--jcrop-hline.bottom{bottom:0}.uploadcare--jcrop-vline{width:1px!important;height:100%;background-color:#fff;box-shadow:0 0 0 1px rgba(0,0,0,.2);z-index:2147483620}.uploadcare--jcrop-vline.right{right:0}.uploadcare--jcrop-tracker{height:100%;width:100%;-webkit-tap-highlight-color:transparent;-webkit-touch-callout:none;-webkit-user-select:none;-ms-user-select:none;user-select:none}.uploadcare--jcrop-holder img{max-width:none;max-height:none}.uploadcare--text{margin:0 0 10px;padding:0;font-size:17.5px;line-height:25px}.uploadcare--text:empty{display:none}.uploadcare--text_muted{color:#a4a2a1}.uploadcare--text_pre{box-sizing:border-box;overflow-x:auto;padding:20px;max-width:100%;background:#e3e1e1;font-family:monospace;white-space:pre;text-align:left}.uploadcare--text_size_small{font-size:15px;line-height:20px}.uploadcare--text_size_medium{font-size:20px;font-weight:700;line-height:25px}.uploadcare--text_size_large{font-size:22px;font-weight:700;line-height:25px}.uploadcare--text_size_extra-large{font-size:35px;line-height:45px}@media (min-width:760px){.uploadcare--text_size_extra-large{font-size:42.5px;line-height:50px}}.uploadcare--icon{all:initial;color:inherit;fill:currentColor;margin:0;padding:0;max-width:100%;width:32px;height:32px;cursor:inherit}.uploadcare--link,.uploadcare--link:link,.uploadcare--link:visited{cursor:pointer;color:#157cfc;text-decoration:underline}.uploadcare--link:focus,.uploadcare--link:hover{color:#3891ff;text-decoration:none}.uploadcare--link:focus{outline:2px solid rgba(21,124,252,.5);outline-offset:1px}.uploadcare--link:active{color:#0969ee}.uploadcare--button{all:initial;-ms-flex-negative:0;flex-shrink:0;display:inline-block;overflow:hidden;box-sizing:border-box;margin:0;padding:10px;width:auto;min-width:100px;height:auto;min-height:0;border-radius:6px;border:1px solid #157cfc;background:transparent;color:#157cfc;cursor:default;white-space:nowrap;text-overflow:ellipsis;text-align:center;font-family:inherit;font-size:15px;font-weight:400;font-style:normal;line-height:20px;box-shadow:none;text-shadow:none;transition:background .3s,color .3s,border .3s}.uploadcare--button svg{pointer-events:none}.uploadcare--button:focus,.uploadcare--button:hover{background:transparent;border-color:#3891ff;color:#3891ff;font-weight:400;font-style:normal;box-shadow:none;text-shadow:none}.uploadcare--button:focus{outline:2px solid rgba(21,124,252,.5);outline-offset:1px}.uploadcare--button:active{border-color:#0969ee;color:#0969ee}.uploadcare--button:disabled,.uploadcare--button[aria-disabled=true]{background:transparent!important;border-color:#d4d2d2!important;color:#d4d2d2!important;cursor:not-allowed}@media (min-width:760px){.uploadcare--button{padding:10px 20px;font-size:17.5px;line-height:25px}}.uploadcare--button_icon{padding:14px;min-width:0;width:60px;height:60px}.uploadcare--button_muted{border-color:transparent!important;color:#a4a2a1;border-radius:0}.uploadcare--button_muted:focus,.uploadcare--button_muted:hover{color:#157cfc}.uploadcare--button_muted:disabled,.uploadcare--button_muted[aria-disabled=true]{border-color:transparent!important}.uploadcare--button_overlay{background:rgba(53,53,53,.5);border-color:transparent;color:#fff}.uploadcare--button_overlay:focus,.uploadcare--button_overlay:hover{background:hsla(0,0%,40%,.5);border-color:transparent;color:#fff}.uploadcare--button_overlay:active{background:rgba(33,33,33,.5)}.uploadcare--button_primary{background:#157cfc;border-color:#157cfc;color:#fff}.uploadcare--button_primary:focus,.uploadcare--button_primary:hover{background:#3891ff;border-color:#3891ff;color:#fff}.uploadcare--button_primary:active{background:#0969ee;border-color:#0969ee}.uploadcare--button_primary:disabled,.uploadcare--button_primary[aria-disabled=true]{background:#d4d2d2!important;border-color:#d4d2d2!important;color:#fff!important}.uploadcare--button_size_big{padding:10px 25px;font-size:20px;line-height:30px}.uploadcare--button_size_small{padding:5px 10px;min-width:80px;font-size:15px;line-height:20px}.uploadcare--input{-webkit-appearance:none;-moz-appearance:none;appearance:none;-ms-flex-negative:0;flex-shrink:0;display:block;box-sizing:border-box;margin:5px 0 15px;padding:10px 15px;width:100%;font-size:17.5px;line-height:25px;background:#fff;color:#353535;border:1px solid #a4a2a1;border-radius:2px;box-shadow:none}.uploadcare--input:focus{outline:2px solid rgba(21,124,252,.5);outline-offset:1px}.uploadcare--input::-webkit-input-placeholder{color:#a4a2a1}.uploadcare--input::-ms-input-placeholder{color:#a4a2a1}.uploadcare--input::placeholder{color:#a4a2a1}.uploadcare--form{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-align:center;align-items:center;box-sizing:border-box;max-width:400px;width:100%}.uploadcare--error{color:#e66a6a}.uploadcare--powered-by{display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;padding:7.5px 0;font-size:12.5px;line-height:15px;color:#fff;text-align:center}.uploadcare--powered-by__link{display:-ms-inline-flexbox;display:inline-flex;color:inherit!important;text-decoration:none!important}.uploadcare--powered-by__logo{display:-ms-inline-flexbox;display:inline-flex;width:20px;height:15px;vertical-align:text-bottom}.uploadcare--progress__canvas{width:100%;height:100%}.uploadcare--progress__text{display:table-cell;vertical-align:middle;text-align:center;font-size:60%;line-height:1}.uploadcare--progress__text-container{width:100%;height:100%;display:table;white-space:normal}.uploadcare--progress_type_canvas{padding:2px;width:32px;height:32px;color:#ffd800;border-color:#e3e1e1}.uploadcare--progressbar{overflow:hidden;width:100%;height:100%;background:#e3e1e1;border-radius:6px}.uploadcare--progressbar__value{width:0;height:100%;background:#ffd800}.uploadcare--menu{-ms-flex-negative:0;flex-shrink:0;width:100%;width:100vw;max-width:100%;height:100%;overflow:hidden}@media (min-width:760px){.uploadcare--menu{width:60px}}@media (max-width:759px){.uploadcare--menu{height:60px}}.uploadcare--menu__icon{-ms-flex-negative:0;flex-shrink:0;margin:14px}@media (max-width:759px){.uploadcare--menu:not(.uploadcare--menu_opened) .uploadcare--menu__item_current:not(.uploadcare--menu__item_tab_file) .uploadcare--menu__icon{position:absolute;top:0;left:50%;transform:translateX(-50%);margin-left:0}}.uploadcare--menu__item{-ms-flex-negative:0;flex-shrink:0;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;width:100vw;height:60px;overflow:hidden;cursor:default;background:#e3e1e1;color:#666;transition:background .3s,color .3s}@media (min-width:760px){.uploadcare--menu__item{width:60px}}.uploadcare--menu__item:focus,.uploadcare--menu__item:hover{color:#157cfc}.uploadcare--menu__item:active{background-color:#fff;color:#0969ee}.uploadcare--menu__item:focus{outline:none;box-shadow:inset 0 0 0 2px rgba(21,124,252,.5)}.uploadcare--menu__item[aria-disabled=true]{background:#e3e1e1!important;color:#666!important;cursor:not-allowed}.uploadcare--menu__item:after{content:attr(title);-ms-flex-negative:0;flex-shrink:0;display:-ms-flexbox;display:flex;height:30px;font-size:17px;line-height:30px;white-space:nowrap}@media (min-width:760px){.uploadcare--menu__item:after{overflow:hidden;max-width:170px;text-overflow:ellipsis}}.uploadcare--menu__item_current,.uploadcare--menu__item_current:active,.uploadcare--menu__item_current:focus,.uploadcare--menu__item_current:hover{background-color:#fff;color:#353535}.uploadcare--menu__item_hidden{display:none}.uploadcare--menu__items{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;width:100%;height:100%;padding-right:100vw;overflow-y:auto;overflow-x:hidden;background:#e3e1e1}.uploadcare--menu__toggle{width:60px;height:60px;transition:none}.uploadcare--menu__toggle:focus{outline-offset:-2px}@media (min-width:760px){.uploadcare--menu__toggle{display:none}}@media (max-width:759px){.uploadcare--menu:not(.uploadcare--menu_opened) .uploadcare--menu__toggle-icon_back{display:none}}@media (max-width:759px){.uploadcare--menu_opened{position:relative;z-index:1000;height:100%}.uploadcare--menu_opened .uploadcare--menu__toggle{-ms-flex-pack:start;justify-content:flex-start;width:100%;text-align:left;background:#e3e1e1}.uploadcare--menu_opened .uploadcare--menu__toggle-icon_menu{display:none}.uploadcare--menu_opened .uploadcare--menu__items{height:calc(100% - 60px)}}.uploadcare--footer{-ms-flex-negative:0;flex-shrink:0;display:-ms-flexbox;display:flex;-ms-flex-pack:justify;justify-content:space-between;-ms-flex-align:center;align-items:center;box-sizing:border-box;width:100%;margin-top:10px;padding:5px 20px 15px}@media (max-width:759px) and (orientation:portrait){.uploadcare--footer{display:block}}.uploadcare--footer:empty{display:none}.uploadcare--footer__additions{-ms-flex-positive:1;flex-grow:1;-ms-flex-order:1;order:1;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;box-sizing:border-box;padding:0 0 15px;text-align:center}@media (max-width:759px) and (orientation:landscape){.uploadcare--footer__additions{padding:0 20px}}@media (max-width:500px) and (orientation:landscape){.uploadcare--footer__additions{display:none}}@media (min-width:760px){.uploadcare--footer__additions{padding:0 20px}}.uploadcare--footer__additions:empty{visibility:hidden;padding:0}.uploadcare--footer__button{margin-top:5px;margin-bottom:5px}.uploadcare--footer__button:first-of-type{-ms-flex-order:0;order:0}.uploadcare--footer__button:nth-of-type(2){-ms-flex-order:2;order:2}@media (max-width:759px){.uploadcare--footer__button{max-width:calc(50% - 20px)}}@media (max-width:759px) and (orientation:portrait){.uploadcare--footer__button:first-of-type{float:left}.uploadcare--footer__button:nth-of-type(2){float:right}}.uploadcare--dragging .uploadcare--draganddrop{margin:20px;background:#e3e1e1;color:#a4a2a1;border:2px dashed;border-radius:20px}.uploadcare--draganddrop.uploadcare--dragging{color:#157cfc!important}@media (max-width:759px){.uploadcare--draganddrop__title{display:none}}.uploadcare--draganddrop:not(.uploadcare--draganddrop_supported) .uploadcare--draganddrop__supported,.uploadcare--draganddrop_supported .uploadcare--draganddrop__not-supported,.uploadcare--dragging .uploadcare--dialog__close,.uploadcare--dragging__show{display:none}.uploadcare--dragging .uploadcare--dragging__show{display:block}.uploadcare--dragging .uploadcare--dragging__hide{display:none}.uploadcare--file{display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;-ms-flex-align:stretch;align-items:stretch;-ms-flex-pack:justify;justify-content:space-between;box-sizing:border-box;padding:5px 0 5px 20px;color:#353535;cursor:default}.uploadcare--file:hover{background:rgba(21,124,252,.1)}.uploadcare--file__description{-ms-flex-positive:1;flex-grow:1;min-width:0;padding-right:20px;text-align:left}.uploadcare--file__description:focus,.uploadcare--file__description:focus .uploadcare--file__preview,.uploadcare--file__description:hover,.uploadcare--file__description:hover .uploadcare--file__preview{color:#157cfc}.uploadcare--file__description:active,.uploadcare--file__description:active .uploadcare--file__preview{color:#0969ee}.uploadcare--file__description:focus{outline:2px solid rgba(21,124,252,.5);outline-offset:2px}.uploadcare--file__icon{max-width:100%;max-height:100%}.uploadcare--file__name{overflow:hidden;margin:0;max-width:calc(100vw - 200px);line-height:25px;white-space:nowrap;text-overflow:ellipsis;transition:color .3s}@media (min-width:760px){.uploadcare--file__name{max-width:350px}}.uploadcare--file__preview{-ms-flex-negative:0;flex-shrink:0;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;float:left;box-sizing:border-box;margin-right:10px;padding:2px;width:60px;height:60px;overflow:hidden;border:1px solid;border-radius:6px;background:transparent;color:#e3e1e1;transition:border .3s}.uploadcare--file__progressbar{-ms-flex-negative:0;flex-shrink:0;-ms-flex-item-align:center;align-self:center;margin:0 10px;width:60px;height:10px}.uploadcare--file__size{font-size:12.5px;color:#a4a2a1}.uploadcare--file_status_error,.uploadcare--file_status_error .uploadcare--file__description,.uploadcare--file_status_error .uploadcare--file__preview{color:#e66a6a!important}.uploadcare--file_status_error .uploadcare--file__name{color:rgba(230,106,106,.5)!important}.uploadcare--file_status_error .uploadcare--file__progressbar,.uploadcare--file_status_error .uploadcare--file__size,.uploadcare--file_status_uploaded .uploadcare--file__progressbar{display:none}.uploadcare--file_status_uploading,.uploadcare--file_status_uploading .uploadcare--file__description{color:#353535!important}.uploadcare--file_status_uploading .uploadcare--file__name{max-width:calc(100vw - 280px)}@media (min-width:760px){.uploadcare--file_status_uploading .uploadcare--file__name{max-width:270px}}.uploadcare--file_status_uploading .uploadcare--file__preview{background:#ffd800;color:#ffd800!important}.uploadcare--files{-ms-flex-positive:1;flex-grow:1;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;overflow:auto;width:100%;height:100%}.uploadcare--files__item{-ms-flex-negative:0;flex-shrink:0}.uploadcare--crop-sizes{-ms-flex-positive:1;flex-grow:1;display:-ms-flexbox;display:flex;-ms-flex-pack:distribute;justify-content:space-around}.uploadcare--crop-sizes__item{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:end;justify-content:flex-end;-ms-flex-align:center;align-items:center;padding:0;height:65px;background:transparent;border-color:transparent;color:#353535}.uploadcare--crop-sizes__item:focus,.uploadcare--crop-sizes__item:hover{background:transparent;border-color:transparent;color:#157cfc}.uploadcare--crop-sizes__item:active{background:transparent;border-color:transparent;color:#0969ee}.uploadcare--crop-sizes__item:disabled,.uploadcare--crop-sizes__item[aria-disabled=true]{border-color:transparent!important}.uploadcare--crop-sizes__item:after{content:attr(data-caption);display:block;font-size:14px;line-height:25px;text-transform:uppercase}@media (max-width:400px),(max-width:600px) and (orientation:landscape){.uploadcare--crop-sizes__item:after{font-size:12px}}.uploadcare--crop-sizes__item:before{content:\"\";display:block;-ms-flex-order:1;order:1;margin:1px 0;width:6px;height:6px;background:transparent;border-radius:50%}.uploadcare--crop-sizes__item_current:active,.uploadcare--crop-sizes__item_current:focus,.uploadcare--crop-sizes__item_current:hover{color:#353535}.uploadcare--crop-sizes__item_current:before{background:#157cfc}.uploadcare--crop-sizes__icon{box-sizing:border-box;width:30px;height:30px;border:2px solid;border-radius:2px;color:inherit;transform:scale(.666)}.uploadcare--crop-sizes__icon_free{border:none;border-radius:0;transform:none}.uploadcare--file-source{margin:10px;border-color:#e3e1e1;background:#e3e1e1;color:#353535}.uploadcare--file-source_all{-ms-flex-order:1;order:1;border-color:currentColor;background:transparent;color:#157cfc}.uploadcare--file-sources{-ms-flex-negative:0;flex-shrink:0;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-align:center;align-items:center;width:100%}@media (max-width:759px) and (max-height:450px),(min-width:760px){.uploadcare--file-sources{display:none}}.uploadcare--file-sources__caption{margin:15px 0 5px}@media (max-width:759px) and (max-height:550px){.uploadcare--file-sources__item:nth-child(4),.uploadcare--file-sources__item:nth-child(5),.uploadcare--file-sources__item:nth-child(6){display:none}}.uploadcare--file-sources__items{display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-pack:center;justify-content:center;max-width:300px}.uploadcare--file-sources__items:empty,.uploadcare--file-sources__items:not(.uploadcare--file-sources__items_many) .uploadcare--file-source__all{display:none}.uploadcare--media{-ms-flex-positive:1;flex-grow:1;display:-ms-flexbox;display:flex;-ms-flex-pack:center;justify-content:center;-ms-flex-align:center;align-items:center;position:relative;width:100%}.uploadcare--media__image{position:absolute;top:50%;left:50%;max-width:100%;max-height:100%;transform:translateX(-50%) translateY(-50%)}.uploadcare--media__video{all:initial;width:auto;max-width:100%;height:auto;min-height:100px;max-height:100%}@media (max-width:759px) and (max-height:379px){.uploadcare--media__video{max-height:120px}}@media (max-width:759px) and (min-height:380px) and (max-height:499px){.uploadcare--media__video{max-height:160px}}@media (max-width:759px) and (min-height:500px),(min-width:760px){.uploadcare--media__video{max-height:300px}}.uploadcare--camera__button{margin:5px 10px}.uploadcare--camera__button_type_mirror{position:absolute;top:15px;left:50%;margin:0;transform:translateX(-50%)}.uploadcare--camera__video{transition:transform .8s cubic-bezier(.23,1,.32,1)}.uploadcare--camera__video_mirrored{transform:scaleX(-1)}.uploadcare--camera__video-container{-ms-flex-positive:0;flex-grow:0;position:relative;margin-bottom:10px}.uploadcare--camera_status_denied .uploadcare--camera__button_type_cancel-record,.uploadcare--camera_status_denied .uploadcare--camera__button_type_capture,.uploadcare--camera_status_denied .uploadcare--camera__button_type_mirror,.uploadcare--camera_status_denied .uploadcare--camera__button_type_start-record,.uploadcare--camera_status_denied .uploadcare--camera__button_type_stop-record,.uploadcare--camera_status_denied .uploadcare--camera__controls,.uploadcare--camera_status_denied .uploadcare--camera__not-found,.uploadcare--camera_status_denied .uploadcare--camera__please-allow,.uploadcare--camera_status_denied .uploadcare--camera__video-container,.uploadcare--camera_status_not-founded .uploadcare--camera__button_type_cancel-record,.uploadcare--camera_status_not-founded .uploadcare--camera__button_type_capture,.uploadcare--camera_status_not-founded .uploadcare--camera__button_type_mirror,.uploadcare--camera_status_not-founded .uploadcare--camera__button_type_retry,.uploadcare--camera_status_not-founded .uploadcare--camera__button_type_start-record,.uploadcare--camera_status_not-founded .uploadcare--camera__button_type_stop-record,.uploadcare--camera_status_not-founded .uploadcare--camera__controls,.uploadcare--camera_status_not-founded .uploadcare--camera__please-allow,.uploadcare--camera_status_not-founded .uploadcare--camera__video-container,.uploadcare--camera_status_ready .uploadcare--camera__button_type_cancel-record,.uploadcare--camera_status_ready .uploadcare--camera__button_type_retry,.uploadcare--camera_status_ready .uploadcare--camera__button_type_stop-record,.uploadcare--camera_status_ready .uploadcare--camera__not-found,.uploadcare--camera_status_ready .uploadcare--camera__please-allow,.uploadcare--camera_status_recording .uploadcare--camera__button_type_capture,.uploadcare--camera_status_recording .uploadcare--camera__button_type_mirror,.uploadcare--camera_status_recording .uploadcare--camera__button_type_retry,.uploadcare--camera_status_recording .uploadcare--camera__button_type_start-record,.uploadcare--camera_status_recording .uploadcare--camera__not-found,.uploadcare--camera_status_recording .uploadcare--camera__please-allow,.uploadcare--camera_status_requested .uploadcare--camera__button_type_cancel-record,.uploadcare--camera_status_requested .uploadcare--camera__button_type_capture,.uploadcare--camera_status_requested .uploadcare--camera__button_type_mirror,.uploadcare--camera_status_requested .uploadcare--camera__button_type_retry,.uploadcare--camera_status_requested .uploadcare--camera__button_type_start-record,.uploadcare--camera_status_requested .uploadcare--camera__button_type_stop-record,.uploadcare--camera_status_requested .uploadcare--camera__controls,.uploadcare--camera_status_requested .uploadcare--camera__not-found,.uploadcare--camera_status_requested .uploadcare--camera__video-container{display:none}.uploadcare--crop-widget>.uploadcare--preview__image{-webkit-filter:brightness(60%);filter:brightness(60%);transform:none}.uploadcare--tab{overflow:hidden;-ms-flex-align:stretch;align-items:stretch;text-align:center}.uploadcare--tab,.uploadcare--tab__content{-ms-flex-positive:1;flex-grow:1;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:center;justify-content:center}.uploadcare--tab__content{-ms-flex-negative:1;flex-shrink:1;-ms-flex-align:center;align-items:center;overflow-y:auto;padding:0 20px}.uploadcare--tab__header{-ms-flex-negative:0;flex-shrink:0;padding:0 20px;overflow:hidden}@media (min-width:760px){.uploadcare--tab__header{display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;padding-right:60px;height:60px}}.uploadcare--tab__iframe{-ms-flex-positive:1;flex-grow:1;width:100%;height:100%;border:0;opacity:0}.uploadcare--tab__title{margin-top:10px;margin-bottom:10px}.uploadcare--tab:not(.uploadcare--tab_current),.uploadcare--tab_name_preview.uploadcare--tab_current~.uploadcare--panel__footer{display:none}.uploadcare--tab_remote.uploadcare--tab_current~.uploadcare--panel__footer{margin-top:0}.uploadcare--panel{-ms-flex-negative:0;flex-shrink:0;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;position:relative;box-sizing:border-box;overflow:hidden;width:100%;height:500px;border:1px solid #a4a2a1;border-radius:6px;background:#fff;color:#353535;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,Arial,sans-serif;font-weight:400;font-size:15px;line-height:20px}@media (min-width:760px){.uploadcare--panel{-ms-flex-direction:row;flex-direction:row}}.uploadcare--panel__content{-ms-flex-positive:1;flex-grow:1;display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;overflow:hidden}.uploadcare--panel__file-counter{display:inline}.uploadcare--panel__footer{padding-top:15px;background:#fff9d8}.uploadcare--panel__icon{box-sizing:border-box;padding:3px}.uploadcare--panel__menu_hidden{display:none}.uploadcare--panel__message_hidden{color:#d4d2d2}.uploadcare--panel__powered-by{background:#353535;color:hsla(0,0%,100%,.5)}@media (min-width:760px){.uploadcare--panel__powered-by{display:none}}.uploadcare--tab:not(:nth-child(2)).uploadcare--tab_current~.uploadcare--panel__powered-by{display:none}@media (max-width:759px){.uploadcare--panel_menu-hidden .uploadcare--tab__header{padding:6px 60px 0;min-height:60px}}.uploadcare--panel:not(.uploadcare--panel_multiple) .uploadcare--panel__footer{display:none}.uploadcare--panel_multiple .uploadcare--panel__content{position:relative}.uploadcare--panel_multiple .uploadcare--tab_name_preview{position:absolute;top:0;left:0;height:100%;width:100%}.uploadcare--panel_multiple .uploadcare--tab_name_preview .uploadcare--tab__content{padding-left:0;padding-right:0}.uploadcare--panel_multiple .uploadcare--tab_name_preview .uploadcare--tab__footer{position:relative;margin-top:0;padding-top:15px}.uploadcare--panel_multiple .uploadcare--tab_name_preview .uploadcare--tab__footer:before{content:\"\";position:absolute;top:0;left:20px;width:calc(100% - 40px);height:1px;background:#e3e1e1}.uploadcare--preview__content{overflow:hidden}.uploadcare--preview__content_crop{padding:10px 20px}.uploadcare--dialog{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;-ms-flex-pack:start;justify-content:flex-start;-ms-flex-align:stretch;align-items:stretch;position:fixed;top:0;left:0;z-index:2147483647;box-sizing:border-box;overflow:hidden;-ms-touch-action:none;touch-action:none;width:100%;height:100%;background:#fff;color:#353535;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,Arial,sans-serif;font-weight:400;font-size:15px;line-height:20px;opacity:0;transition:opacity .33s cubic-bezier(.05,.7,.25,1)}@media (min-width:760px){.uploadcare--dialog{-ms-flex-align:center;align-items:center;overflow-y:auto;background:rgba(0,0,0,.5)}}@media (min-width:760px) and (max-height:559px){.uploadcare--dialog{padding-top:30px}}@media (min-width:760px) and (min-height:560px){.uploadcare--dialog{-ms-flex-pack:center;justify-content:center}}.uploadcare--dialog__close{position:absolute;top:0;right:0;z-index:49}.uploadcare--dialog__close:focus{outline-offset:-2px}.uploadcare--dialog__container{display:-ms-flexbox;display:flex;position:relative;overflow:hidden}@media (max-width:759px){.uploadcare--dialog__container{-ms-flex-positive:1;flex-grow:1;height:100%}}@media (min-width:760px){.uploadcare--dialog__container{width:calc(100% - 60px);max-width:900px;height:calc(100% - 60px);min-height:500px;max-height:660px;border-radius:6px;-webkit-mask-image:-webkit-radial-gradient(#fff,#000)}}@media (min-width:1210px){.uploadcare--dialog__container{max-width:1050px}}.uploadcare--dialog__panel{height:100%;border:none;border-radius:0}@media (min-width:1210px){.uploadcare--dialog__panel .uploadcare--menu,.uploadcare--dialog__panel .uploadcare--menu__item{width:250px}}.uploadcare--dialog__powered-by{-ms-flex-negative:0;flex-shrink:0}@media (max-width:759px){.uploadcare--dialog__powered-by{display:none}}.uploadcare--dialog_status_active{opacity:1}.uploadcare--widget{display:inline-block;vertical-align:baseline}.uploadcare--dragging .uploadcare--widget,.uploadcare--widget.uploadcare--dragging{position:relative}.uploadcare--widget__button{all:initial;display:inline-block;box-sizing:border-box;margin:0;padding:.4em 1em;width:auto;min-width:0;height:auto;min-height:0;border-radius:6px;border:none;background:#c3c3c3;color:#fff;cursor:default;text-align:center;white-space:nowrap;font:inherit;line-height:inherit;box-shadow:none;text-shadow:inherit;transition:background .3s}.uploadcare--widget__button:focus,.uploadcare--widget__button:hover{background:#b3b3b3;color:#fff;font:inherit;box-shadow:none;text-shadow:inherit}.uploadcare--widget__button:focus{outline:2px solid rgba(21,124,252,.5);outline-offset:1px}.uploadcare--widget__button:active{background:#b3b3b3}.uploadcare--widget__button:disabled{background:#c3c3c3;color:#fff;cursor:not-allowed}.uploadcare--widget__button_type_open{background:#157cfc;color:#fff}.uploadcare--widget__button_type_open:focus,.uploadcare--widget__button_type_open:hover{background:#3891ff}.uploadcare--widget__button_type_open:active{background:#0969ee}.uploadcare--widget__button_type_open:disabled{background:#c3c3c3}.uploadcare--widget__dragndrop-area{position:absolute;top:0;left:0;box-sizing:border-box;min-width:100%;min-height:100%;margin:0;padding:calc(.4em - 1.5px) 1em;font:inherit;line-height:inherit;text-align:center;white-space:nowrap;border:1.5px dashed;border-radius:6px;background:#e3e1e1;color:#a4a2a1;transition:color .3s;display:none}.uploadcare--dragging .uploadcare--widget__dragndrop-area{display:block}.uploadcare--widget.uploadcare--dragging .uploadcare--widget__dragndrop-area{color:#157cfc}.uploadcare--widget__file-name,.uploadcare--widget__file-size{display:inline}.uploadcare--widget__progress{display:inline-block;width:1.8em;height:1.8em;margin:0 .2em 0 0;padding:0;line-height:0;vertical-align:middle}.uploadcare--widget__text{display:inline-block;box-sizing:border-box;margin-right:.2em;padding:.4em 0;white-space:nowrap}.uploadcare--widget:not(.uploadcare--widget_option_clearable).uploadcare--widget_status_error .uploadcare--widget__button_type_remove,.uploadcare--widget:not(.uploadcare--widget_option_clearable).uploadcare--widget_status_loaded .uploadcare--widget__button_type_remove,.uploadcare--widget_option_clearable.uploadcare--widget_status_error .uploadcare--widget__button_type_open,.uploadcare--widget_status_error .uploadcare--widget__button_type_cancel,.uploadcare--widget_status_error .uploadcare--widget__progress,.uploadcare--widget_status_loaded .uploadcare--widget__button_type_cancel,.uploadcare--widget_status_loaded .uploadcare--widget__button_type_open,.uploadcare--widget_status_loaded .uploadcare--widget__progress,.uploadcare--widget_status_ready .uploadcare--widget__button_type_cancel,.uploadcare--widget_status_ready .uploadcare--widget__button_type_remove,.uploadcare--widget_status_ready .uploadcare--widget__progress,.uploadcare--widget_status_ready .uploadcare--widget__text,.uploadcare--widget_status_started .uploadcare--widget__button_type_open,.uploadcare--widget_status_started .uploadcare--widget__button_type_remove{display:none}.uploadcare--page{width:auto;min-width:0;max-width:100%;height:auto;min-height:0;max-height:100%;overflow:hidden}.uploadcare--mouse-focused:focus{outline:none}";
  var _icons = "<svg width=\"0\" height=\"0\" style=\"position:absolute\"><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-back\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M21.132 9.06a1.5 1.5 0 00-2.122-2.12L9.88 16.07l9.06 9.061a1.5 1.5 0 102.122-2.121l-6.94-6.94 7.01-7.01z\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-box\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M4.962 9C4.385 9 4 9.384 4 9.96v8.243C4 20.793 6.213 23 8.811 23c1.829 0 3.464-1.043 4.33-2.578.866 1.535 2.406 2.578 4.33 2.578 2.695 0 4.812-2.206 4.812-4.797 0-2.686-2.117-4.886-4.811-4.886-1.829 0-3.465 1.043-4.33 2.578-.77-1.535-2.406-2.578-4.33-2.578a4.957 4.957 0 00-2.887.96V9.958c0-.48-.482-.959-.963-.959zm17.08 4.257a.841.841 0 00-.33.15c-.385.288-.5.965-.211 1.349l2.526 3.357-2.526 3.358c-.289.384-.174 1.061.21 1.35.385.287 1.065.173 1.354-.21l2.105-2.879 2.105 2.878c.288.384.968.498 1.353.21.385-.288.499-.965.21-1.349l-2.526-3.358 2.526-3.357c.289-.384.175-1.061-.21-1.35-.385-.287-1.065-.203-1.353.18l-2.105 2.879-2.105-2.878c-.217-.288-.657-.406-1.023-.33zm-13.23 2.068c1.539 0 2.886 1.344 2.886 2.878.096 1.535-1.25 2.878-2.887 2.878a2.89 2.89 0 01-2.886-2.878c0-1.63 1.347-2.878 2.886-2.878zm8.66 0a2.89 2.89 0 012.886 2.878c0 1.535-1.347 2.878-2.886 2.878a2.89 2.89 0 01-2.887-2.878c0-1.63 1.347-2.878 2.887-2.878z\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-camera\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M21 10h3c1.653 0 3 1.343 3 3v9c0 1.656-1.344 3-3.001 3H8A3 3 0 015 22v-9a3 3 0 013-3h3v-.999C11 7.901 11.895 7 13 7h6c1.113 0 2 .896 2 2.001V10zm-5 12a4.5 4.5 0 100-9 4.5 4.5 0 000 9zm0-2a2.5 2.5 0 110-5 2.5 2.5 0 010 5z\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-close\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M10.06 7.94a1.5 1.5 0 00-2.12 2.12L13.878 16l-5.94 5.94a1.5 1.5 0 002.122 2.12L16 18.122l5.94 5.94a1.5 1.5 0 002.12-2.122L18.122 16l5.94-5.94a1.5 1.5 0 00-2.122-2.12L16 13.878l-5.94-5.94z\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-crop-free\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M8 12a2.004 2.004 0 01-2-2.01V8.01C6 6.897 6.893 6 8.01 6h1.98c1.109 0 2.005.888 2.01 2h8c.005-1.107.896-2 2.01-2h1.98C25.103 6 26 6.893 26 8.01v1.98A2.004 2.004 0 0124 12v8c1.107.005 2 .896 2 2.01v1.98c0 1.112-.893 2.01-2.01 2.01h-1.98A2.004 2.004 0 0120 24h-8a2.004 2.004 0 01-2.01 2H8.01A2.004 2.004 0 016 23.99v-1.98c0-1.109.888-2.005 2-2.01v-8zm2 0v8a2.004 2.004 0 012 2h8a2.004 2.004 0 012-2v-8a2.004 2.004 0 01-2-2h-8a2.004 2.004 0 01-2 2zm12 10.01v1.98c0 .01 0 .01.01.01h1.98c.01 0 .01 0 .01-.01v-1.98c0-.01 0-.01-.01-.01h-1.98c-.01 0-.01 0-.01.01zm0-14v1.98c0 .01 0 .01.01.01h1.98c.01 0 .01 0 .01-.01V8.01C24 8 24 8 23.99 8h-1.98C22 8 22 8 22 8.01zm-14 14v1.98c0 .01 0 .01.01.01h1.98c.01 0 .01 0 .01-.01v-1.98c0-.01 0-.01-.01-.01H8.01C8 22 8 22 8 22.01zm0-14v1.98c0 .01 0 .01.01.01h1.98c.01 0 .01 0 .01-.01V8.01C10 8 10 8 9.99 8H8.01C8 8 8 8 8 8.01z\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-dropbox\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M9.5 5L16 9.141l-6.5 4.141L3 9.141 9.5 5zm13 0L29 9.141l-6.5 4.141L16 9.141 22.5 5zM3 17.423l6.5-4.141 6.5 4.141-6.5 4.141L3 17.423zm19.5-4.141l6.5 4.141-6.5 4.141-6.5-4.141 6.5-4.141zm-13 9.662l6.5-4.14 6.5 4.14-6.5 4.141-6.5-4.14z\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-empty-pubkey\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M16 31C7.716 31 1 24.284 1 16 1 7.716 7.716 1 16 1c8.284 0 15 6.716 15 15 0 8.284-6.716 15-15 15zm0-13.704a1.296 1.296 0 100-2.592 1.296 1.296 0 000 2.592z\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-error\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M18.122 23.93V21a.583.583 0 00-.179-.434.585.585 0 00-.423-.175h-2.616a.585.585 0 00-.424.175.583.583 0 00-.179.434v2.93c0 .172.06.316.18.433.118.117.26.175.423.175h2.616a.585.585 0 00.423-.175.583.583 0 00.18-.434zm-.037-6.326l.339-9.05a.404.404 0 00-.189-.351c-.163-.135-.313-.203-.452-.203H14.64c-.138 0-.288.068-.452.203-.125.086-.188.215-.188.388l.32 9.013c0 .123.063.224.188.304.126.08.277.12.452.12h2.484c.176 0 .324-.04.443-.12a.41.41 0 00.198-.304z\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-evernote\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7.998 8.648h2.245a.233.233 0 00.232-.233s-.028-1.931-.028-2.468v-.006c0-.441.093-.825.253-1.148l.077-.144a.05.05 0 00-.026.014l-4.359 4.34a.05.05 0 00-.016.025c.09-.044.213-.106.23-.113.38-.172.84-.267 1.392-.267M24.196 6.56c-.553-.2-1.675-.408-3.084-.575-1.134-.134-2.467-.123-3.272-.098-.097-.665-.56-1.272-1.08-1.482-1.384-.56-3.523-.424-4.071-.27-.437.123-.92.373-1.188.76-.18.258-.297.59-.298 1.051 0 .262.007.878.014 1.426.006.548.014 1.04.014 1.043a.887.887 0 01-.884.888H8.103c-.479 0-.845.08-1.124.208-.28.127-.478.3-.628.503-.3.404-.352.902-.351 1.411 0 0 .004.416.104 1.22.083.622.756 4.971 1.394 6.294.248.514.413.73.9.956 1.083.466 3.559.984 4.72 1.133 1.158.148 1.885.46 2.318-.451.002-.003.087-.227.204-.557.377-1.144.43-2.16.43-2.894 0-.075.108-.078.108 0 0 .519-.098 2.354 1.283 2.847.545.194 1.676.367 2.826.502 1.039.12 1.793.53 1.793 3.208 0 1.628-.34 1.851-2.122 1.851-1.444 0-1.994.038-1.994-1.113 0-.932.917-.834 1.596-.834.304 0 .083-.226.083-.8 0-.572.357-.902.02-.91-2.35-.066-3.733-.003-3.733 2.947 0 2.679 1.021 3.176 4.357 3.176 2.614 0 3.536-.086 4.616-3.45.213-.663.73-2.69 1.043-6.092.197-2.15-.187-8.644-.491-10.282-.178-.958-.746-1.43-1.259-1.616zm-3.3 8.792a4.75 4.75 0 00-.923.056c.081-.66.353-1.473 1.316-1.439 1.066.037 1.216 1.049 1.22 1.734-.45-.201-1.006-.33-1.613-.35\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-facebook\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M28 16c0-6.627-5.373-12-12-12S4 9.373 4 16c0 5.99 4.388 10.954 10.125 11.854V19.47h-3.047V16h3.047v-2.644c0-3.007 1.792-4.668 4.533-4.668 1.312 0 2.686.234 2.686.234v2.953H19.83c-1.491 0-1.956.925-1.956 1.875V16h3.328l-.532 3.469h-2.796v8.385C23.612 26.954 28 21.99 28 16z\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-file\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M19 6l5 5h-4c-.556 0-1-.448-1-1V6zm5 7v11.192c0 .995-.808 1.808-1.804 1.808H9.804A1.808 1.808 0 018 24.2V7.74C8 6.602 8.627 6 9.778 6H17v4.994c0 1.12.898 2.006 2.006 2.006H24z\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-flickr\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M11 20c-2.212 0-4-1.79-4-4s1.79-4 4-4a4 4 0 010 8zm10.001 0a4 4 0 11-.002-8 4 4 0 01.002 8z\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-gdrive\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M19.461 6l7.109 12h-7.004L12.539 6h6.922zm-9.27 19l3.467-6H27l-3.466 6H10.192zM5 18.841l6.618-11.36 3.566 5.929-6.722 11.36L5 18.84z\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-gphotos\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M8.797 9.5l-5.632 5.841c-.064.07-.165.228-.165.33 0 .202.127.329.33.329h8.869c1.444 0 2.501-1.09 2.501-2.534V9.5H8.797zM28.67 16H19.8c-1.444 0-2.501 1.09-2.501 2.534V22.5h5.903l5.632-5.841c.064-.07.165-.228.165-.33 0-.202-.127-.329-.33-.329zM16.659 3.165C16.589 3.1 16.43 3 16.329 3c-.202 0-.329.127-.329.33v8.869c0 1.444 1.09 2.501 2.534 2.501H22.5V8.797l-5.841-5.632zM13.466 17.3H9.5v5.903l5.841 5.632c.07.064.228.165.33.165.202 0 .329-.127.329-.33v-8.869c0-1.444-1.09-2.501-2.534-2.501z\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-huddle\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M13.63 14.39c.07-.102.17-.26.2-.313 1.474-2.683 6.857-2.686 8.49 1.002.43.968.67 1.97.675 3.023.008 1.978.004 3.957.002 5.936 0 1.192-.68 1.945-1.763 1.962-1.087.016-1.856-.766-1.865-1.944-.014-1.874.003-3.749-.006-5.623-.006-1.351-.654-2.388-1.719-2.793-1.775-.675-3.59.305-3.892 2.159-.122.747-.104 1.52-.114 2.281-.016 1.336-.002 2.673-.005 4.01-.003 1.125-.669 1.866-1.707 1.907-1.06.042-1.828-.668-1.922-1.78-.007-.086-.003-.173-.003-.26 0-5.31-.002-10.622.002-15.932 0-1.2.731-2.016 1.79-2.025 1.05-.01 1.832.74 1.837 1.792.01 2.013.003 4.026.005 6.04 0 .12.002.391-.005.558\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-instagram\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M16 5c2.987 0 3.362.013 4.535.066 1.171.054 1.97.24 2.67.511a5.391 5.391 0 011.949 1.27 5.392 5.392 0 011.269 1.948c.272.7.457 1.499.51 2.67.054 1.173.067 1.548.067 4.535s-.013 3.362-.066 4.535c-.054 1.171-.24 1.97-.511 2.67a5.392 5.392 0 01-1.27 1.949 5.391 5.391 0 01-1.948 1.269c-.7.271-1.499.457-2.67.51-1.173.054-1.548.067-4.535.067s-3.362-.013-4.535-.066c-1.171-.054-1.97-.24-2.67-.511a5.392 5.392 0 01-1.949-1.27 5.391 5.391 0 01-1.268-1.948c-.273-.7-.458-1.499-.512-2.67C5.013 19.362 5 18.987 5 16s.013-3.362.066-4.535c.054-1.171.24-1.97.512-2.67a5.391 5.391 0 011.268-1.949 5.392 5.392 0 011.949-1.269c.7-.271 1.499-.457 2.67-.51C12.638 5.012 13.013 5 16 5zm0 1.982c-2.937 0-3.285.011-4.445.064-1.072.049-1.655.228-2.042.379-.514.2-.88.438-1.265.823a3.41 3.41 0 00-.823 1.264c-.15.388-.33.97-.379 2.043-.053 1.16-.064 1.508-.064 4.445 0 2.937.011 3.285.064 4.445.049 1.072.228 1.655.379 2.043.2.513.438.88.823 1.264.385.385.751.624 1.265.823.387.15.97.33 2.042.379 1.16.053 1.508.064 4.445.064 2.937 0 3.285-.011 4.445-.064 1.072-.049 1.655-.228 2.042-.379.514-.2.88-.438 1.265-.823.385-.385.624-.751.823-1.264.15-.388.33-.97.379-2.043.053-1.16.064-1.508.064-4.445 0-2.937-.011-3.285-.064-4.445-.049-1.072-.228-1.655-.379-2.043-.2-.513-.438-.88-.823-1.264a3.408 3.408 0 00-1.265-.823c-.387-.15-.97-.33-2.042-.379-1.16-.053-1.508-.064-4.445-.064zm0 3.37a5.649 5.649 0 110 11.297 5.649 5.649 0 010-11.298zm0 9.315a3.667 3.667 0 100-7.334 3.667 3.667 0 000 7.334zm7.192-9.539a1.32 1.32 0 11-2.64 0 1.32 1.32 0 012.64 0z\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-menu\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7.5 10a1.5 1.5 0 010-3h17a1.5 1.5 0 010 3h-17zm0 7a1.5 1.5 0 010-3h17a1.5 1.5 0 010 3h-17zm0 7a1.5 1.5 0 010-3h17a1.5 1.5 0 010 3h-17z\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-more\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M21 16a3 3 0 116 0 3 3 0 01-6 0zm-8 0a3 3 0 116 0 3 3 0 01-6 0zm-8 0a3 3 0 116 0 3 3 0 01-6 0z\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-nft\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M15.76 3.252c-.059.138-1.805 3.07-3.881 6.515-2.077 3.446-3.793 6.31-3.814 6.365-.028.072 1.1.773 3.955 2.46l3.995 2.36 3.992-2.36c2.87-1.697 3.983-2.39 3.955-2.463C23.817 15.753 16.052 3 15.968 3c-.057 0-.151.113-.209.252zM8.073 17.829c.154.263 7.908 11.172 7.94 11.171.053-.002 7.98-11.203 7.95-11.234-.03-.029-7.439 4.335-7.748 4.563l-.19.14-3.835-2.265a734.48 734.48 0 01-4.01-2.377c-.158-.101-.167-.101-.107.002z\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-onedrive\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M11.715 16.427c.584-2.413 2.699-4.177 5.209-4.177 1.483 0 2.873.621 3.878 1.7.425-.14.922-.248 1.364-.258v-.16c0-3.054-2.214-5.532-4.944-5.532-1.952 0-3.624 1.278-4.428 3.115a3.55 3.55 0 00-2.033-.658c-2.142 0-3.877 1.94-3.877 4.336 0 .258.028.51.068.754-1.652.167-2.946 1.9-2.946 3.79 0 .02.005.037.005.056-.001.017-.011.035-.011.052 0 .757.257 1.449.673 2.007a3.14 3.14 0 002.568 1.317h1.513a4.49 4.49 0 01-.477-1.987c-.001-2.138 1.476-3.93 3.438-4.355zm13.752 2.375c-.03 0-.06.01-.09.01.008-.09.026-.18.026-.273 0-1.812-1.431-3.279-3.198-3.279-.703 0-1.347.24-1.877.635-.655-1.249-1.924-2.107-3.405-2.107-2.146 0-3.885 1.784-3.885 3.984 0 .029.008.053.009.082a2.764 2.764 0 00-.431-.045c-1.602 0-2.898 1.33-2.898 2.973 0 .205.02.406.059.599C10.05 22.87 11.322 24 12.856 24h12.847v-.023C26.99 23.85 28 22.753 28 21.402c0-1.435-1.134-2.6-2.533-2.6z\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-remove\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M22.142 24.009c-.078 1.1-1.044 1.991-2.15 1.991h-7.983c-1.11 0-2.073-.897-2.151-1.991l-.786-11.002A.924.924 0 0110.007 12h11.986c.556 0 .975.45.935 1.007l-.786 11.002zM13 7V6c0-.556.444-1 .99-1h4.02A1 1 0 0119 6v1h4c.556 0 1 .447 1 .999v1.002A.997.997 0 0123 10H9c-.555 0-1-.447-1-.999V7.999A.996.996 0 019 7h4z\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-uploadcare\" xmlns=\"http://www.w3.org/2000/svg\"><path fill=\"#ffd800\" d=\"M16 31C7.716 31 1 24.284 1 16 1 7.716 7.716 1 16 1c8.284 0 15 6.716 15 15 0 8.284-6.716 15-15 15zm0-13.704a1.296 1.296 0 100-2.592 1.296 1.296 0 000 2.592z\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-url\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M16 5c6.074 0 11 4.926 11 11s-4.926 11-11 11S5 22.074 5 16 9.926 5 16 5zm6.076 6.327a.992.992 0 10-1.403-1.403l-1.128 1.128c-1.431-.92-3.47-.768-4.697.461l-3.186 3.185a3.7 3.7 0 00-1.09 2.636c0 .748.22 1.46.624 2.067l-1.272 1.272a.992.992 0 101.402 1.403l1.273-1.272c.606.405 1.32.623 2.067.623.997 0 1.933-.386 2.634-1.089l3.187-3.186a3.729 3.729 0 00.464-4.7l1.125-1.125zm-4.252 3.841a.982.982 0 00.701-.29l.95-.95c.067.188.114.385.114.591 0 .466-.178.904-.505 1.23l-3.186 3.187c-.472.47-1.197.588-1.813.382l.793-.792a.992.992 0 10-1.404-1.404l-.801.802a1.752 1.752 0 01-.115-.59c0-.468.179-.905.506-1.232l3.186-3.186a1.736 1.736 0 011.23-.507c.207 0 .404.049.592.116l-.948.95a.992.992 0 00.7 1.693z\"/></symbol><symbol viewBox=\"0 0 32 32\" id=\"uploadcare--icon-vk\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M27.791 21.484c-.416-.767-1.212-1.708-2.386-2.824l-.038-.038c-.558-.532-.895-.882-1.037-1.06-.258-.341-.316-.686-.175-1.036.1-.264.475-.821 1.125-1.673.341-.451.612-.813.812-1.086 1.441-1.959 2.066-3.21 1.874-3.756l-.074-.127c-.05-.077-.18-.147-.387-.211-.209-.064-.475-.075-.8-.032l-3.599.025a.457.457 0 00-.25.007l-.163.038-.062.032-.05.039a.56.56 0 00-.137.134.882.882 0 00-.125.223 21.072 21.072 0 01-1.337 2.875 27.31 27.31 0 01-.85 1.373c-.258.388-.475.673-.65.856a4.57 4.57 0 01-.475.44c-.141.112-.25.158-.324.141a8.987 8.987 0 01-.213-.05.843.843 0 01-.281-.314 1.425 1.425 0 01-.144-.498c-.025-.2-.04-.373-.044-.518-.003-.144-.002-.349.007-.613.008-.264.012-.443.012-.536 0-.324.007-.675.019-1.054l.031-.901c.009-.222.013-.456.013-.703 0-.247-.015-.44-.044-.581a2.02 2.02 0 00-.131-.409.684.684 0 00-.256-.307 1.426 1.426 0 00-.419-.172c-.441-.102-1.004-.158-1.687-.166-1.55-.017-2.545.085-2.986.307a1.69 1.69 0 00-.475.383c-.15.187-.171.29-.063.306.5.077.854.26 1.062.55l.075.153c.059.11.117.307.175.588.059.28.096.592.113.932.041.622.041 1.154 0 1.597-.042.443-.081.788-.119 1.035a2.107 2.107 0 01-.169.6 2.55 2.55 0 01-.15.281.217.217 0 01-.062.064.918.918 0 01-.337.064c-.117 0-.259-.06-.425-.179a3.024 3.024 0 01-.519-.492c-.179-.208-.38-.5-.606-.875a15.385 15.385 0 01-.7-1.328l-.2-.37a32.156 32.156 0 01-.512-1.042 20.306 20.306 0 01-.575-1.323.84.84 0 00-.3-.408l-.062-.039a.85.85 0 00-.2-.108 1.304 1.304 0 00-.287-.083L4.8 9.64c-.35 0-.587.081-.712.243l-.05.077a.421.421 0 00-.038.204c0 .094.025.209.075.345.5 1.201 1.043 2.36 1.63 3.475C6.294 15.1 6.804 16 7.237 16.68c.433.681.875 1.324 1.325 1.929.45.604.748.992.893 1.162.146.17.26.298.344.384l.312.306c.2.205.494.45.881.735.388.285.817.566 1.287.843.471.277 1.019.503 1.644.677a5.564 5.564 0 001.824.211h1.437c.292-.026.512-.12.662-.281l.05-.064a.858.858 0 00.094-.236c.029-.107.044-.224.044-.351a4.301 4.301 0 01.08-.99c.063-.294.134-.516.213-.665a1.632 1.632 0 01.482-.562.806.806 0 01.1-.045c.2-.068.434-.002.705.199.271.2.525.447.763.74.237.295.522.625.856.99.333.367.625.64.874.818l.25.154c.167.102.384.196.65.28.266.086.5.107.7.065l3.199-.051c.316 0 .562-.054.737-.16.175-.107.279-.224.312-.351.034-.128.035-.273.007-.435a1.632 1.632 0 00-.088-.338 1.694 1.694 0 00-.082-.16z\"/></symbol></svg>";
  var JST = {
    dialog: dialog,
    dialog__panel: dialogPanel,
    progress__text: progressText,
    'tab-camera-capture': tabCameraCapture,
    'tab-camera': tabCamera,
    'tab-file': tabFile,
    'tab-preview-error': tabPreviewError,
    'tab-preview-image': tabPreviewImage,
    'tab-preview-multiple-file': tabPreviewMultipleFile,
    'tab-preview-multiple': tabPreviewMultiple,
    'tab-preview-regular': tabPreviewRegular,
    'tab-preview-unknown': tabPreviewUnknown,
    'tab-preview-video': tabPreviewVideo,
    'tab-url': tabUrl,
    'widget-button': widgetButton,
    'widget-file-name': widgetFileName,
    widget: widget,
    icons: function icons() {
      return _icons;
    },
    styles: function styles() {
      return _styles;
    }
  };

  var tpl = function tpl(key) {
    var ctx = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var fn = JST[key];
    return fn != null ? fn(_objectSpread2({}, ctx)) : '';
  };

  isWindowDefined() && waitForSettings.add(function (settings) {
    var css = tpl('styles', {
      settings: settings
    });
    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');

    if (style.styleSheet != null) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    return $__default['default']('head').prepend(style);
  });

  var canSubmit = function canSubmit(form) {
    var notSubmittable;
    notSubmittable = '[data-status=started], [data-status=error]';
    return !form.find('.uploadcare--widget').is(notSubmittable);
  };

  var submitPreventionState = function submitPreventionState(form, prevent) {
    form.attr('data-uploadcare-submitted', prevent);
    return form.find(':submit').attr('disabled', prevent);
  };

  var uploadForm = '[role~="uploadcare-upload-form"]';
  var submittedForm = uploadForm + '[data-uploadcare-submitted]';

  if (isWindowDefined()) {
    $__default['default'](document).on('submit', uploadForm, function () {
      var form;
      form = $__default['default'](this);

      if (canSubmit(form)) {
        return true; // allow submit
      } else {
        submitPreventionState(form, true);
        return false;
      }
    });
    $__default['default'](document).on('loaded.uploadcare', submittedForm, function () {
      return $__default['default'](this).submit();
    });
    var cancelEvents = 'ready.uploadcare error.uploadcare';
    $__default['default'](document).on(cancelEvents, submittedForm, function () {
      var form;
      form = $__default['default'](this);

      if (canSubmit(form)) {
        return submitPreventionState(form, false);
      }
    });
  }

  var fakeButtons = ['.uploadcare--menu__item', '.uploadcare--file__description', '.uploadcare--crop-sizes__item'].join(', ');
  var mouseFocusedClass = 'uploadcare--mouse-focused';
  isWindowDefined() && $__default['default'](document.documentElement).on('mousedown', fakeButtons, function (e) {
    // http://wd.dizaina.net/internet-maintenance/on-outlines/
    return defer(function () {
      var activeElement;
      activeElement = document.activeElement;

      if (activeElement && activeElement !== document.body) {
        return $__default['default'](activeElement).addClass(mouseFocusedClass).one('blur', function () {
          return $__default['default'](activeElement).removeClass(mouseFocusedClass);
        });
      }
    });
  }).on('keypress', fakeButtons, function (e) {
    // 13 = Return, 32 = Space
    if (e.which === 13 || e.which === 32) {
      $__default['default'](this).click();
      e.preventDefault();
      return e.stopPropagation();
    }
  });

  var Circle = /*#__PURE__*/function () {
    function Circle(element) {
      _classCallCheck(this, Circle);

      if (canvas) {
        this.renderer = new CanvasRenderer(element);
      } else {
        this.renderer = new TextRenderer(element);
      }

      this.observed = null;
    }

    _createClass(Circle, [{
      key: "listen",
      value: function listen(file, selector) {
        var _this = this;

        var selectorFn;
        this.reset();
        selectorFn = selector != null ? function (info) {
          return info[selector];
        } : function (x) {
          return x;
        };
        this.observed = file;

        if (this.observed.state() === 'resolved') {
          this.renderer.setValue(1, true);
        } else {
          this.observed.progress(function (progress) {
            // if we are still listening to this one
            if (file === _this.observed) {
              _this.renderer.setValue(selectorFn(progress));
            }
          }).always(function (uploadedFile) {
            if (file === _this.observed) {
              _this.renderer.setValue(1, false);
            }
          });
        }

        return this;
      }
    }, {
      key: "reset",
      value: function reset() {
        var filled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
        this.observed = null;
        this.renderer.setValue(filled ? 1 : 0, true);
      }
    }, {
      key: "update",
      value: function update() {
        this.renderer.update();
      }
    }]);

    return Circle;
  }();

  var BaseRenderer = /*#__PURE__*/function () {
    function BaseRenderer(el) {
      _classCallCheck(this, BaseRenderer);

      this.element = $__default['default'](el);
      this.element.data('uploadcare-progress-renderer', this);
      this.element.addClass('uploadcare--progress');
    }

    _createClass(BaseRenderer, [{
      key: "update",
      value: function update() {}
    }]);

    return BaseRenderer;
  }();

  var TextRenderer = /*#__PURE__*/function (_BaseRenderer) {
    _inherits(TextRenderer, _BaseRenderer);

    var _super = _createSuper(TextRenderer);

    function TextRenderer() {
      var _this2;

      _classCallCheck(this, TextRenderer);

      _this2 = _super.apply(this, arguments);

      _this2.element.addClass('uploadcare--progress_type_text');

      _this2.element.html(tpl('progress__text'));

      _this2.text = _this2.element.find('.uploadcare--progress__text');
      return _this2;
    }

    _createClass(TextRenderer, [{
      key: "setValue",
      value: function setValue(val) {
        val = Math.round(val * 100);
        this.text.html("".concat(val, " %"));
      }
    }]);

    return TextRenderer;
  }(BaseRenderer);

  var CanvasRenderer = /*#__PURE__*/function (_BaseRenderer2) {
    _inherits(CanvasRenderer, _BaseRenderer2);

    var _super2 = _createSuper(CanvasRenderer);

    function CanvasRenderer() {
      var _this3;

      _classCallCheck(this, CanvasRenderer);

      _this3 = _super2.apply(this, arguments);
      _this3.canvasEl = $__default['default']('<canvas>').addClass('uploadcare--progress__canvas').get(0);

      _this3.element.addClass('uploadcare--progress_type_canvas');

      _this3.element.html(_this3.canvasEl);

      _this3.setValue(0, true);

      return _this3;
    }

    _createClass(CanvasRenderer, [{
      key: "update",
      value: function update() {
        var _this4 = this;

        window.cancelAnimationFrame(this.__rafId);
        this.__rafId = window.requestAnimationFrame(function () {
          var half = Math.floor(Math.min(_this4.element.width(), _this4.element.height()));
          var size = half * 2;

          if (half) {
            if (_this4.canvasEl.width !== size || _this4.canvasEl.height !== size) {
              _this4.canvasEl.width = size;
              _this4.canvasEl.height = size;
            }

            var ctx = _this4.canvasEl.getContext('2d');

            var arc = function arc(radius, val) {
              var offset;
              offset = -Math.PI / 2;
              ctx.beginPath();
              ctx.moveTo(half, half);
              ctx.arc(half, half, radius, offset, offset + 2 * Math.PI * val, false);
              ctx.fill();
            }; // Clear


            ctx.clearRect(0, 0, size, size); // Background circle

            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = _this4.element.css('border-left-color');
            arc(half - 0.5, 1); // Progress circle

            ctx.fillStyle = _this4.element.css('color');
            arc(half, _this4.val); // Make a hole

            ctx.globalCompositeOperation = 'destination-out';
            arc(half / 7, 1);
          }
        });
      }
    }, {
      key: "__animateValue",
      value: function __animateValue(target) {
        var _this5 = this;

        var speed, start, val;
        val = this.val;
        start = new Date();
        speed = target > val ? 2 : -2;
        this.__animIntervalId = setInterval(function () {
          var current;
          current = val + (new Date() - start) / 1000 * speed;
          current = (speed > 0 ? Math.min : Math.max)(current, target);

          if (current === target) {
            _this5.__stopAnimation();
          }

          _this5.__setValue(current);
        }, 15);
      }
    }, {
      key: "__stopAnimation",
      value: function __stopAnimation() {
        if (this.__animIntervalId) {
          clearInterval(this.__animIntervalId);
        }

        this.__animIntervalId = null;
      }
    }, {
      key: "__setValue",
      value: function __setValue(val) {
        this.val = val;
        this.element.attr('aria-valuenow', (val * 100).toFixed(0));
        this.update();
      }
    }, {
      key: "setValue",
      value: function setValue(val) {
        var instant = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        this.__stopAnimation();

        if (instant) {
          this.__setValue(val);
        } else {
          this.__animateValue(val);
        }
      }
    }]);

    return CanvasRenderer;
  }(BaseRenderer);

  var support = fileDragAndDrop;

  var uploadDrop = function uploadDrop(el, callback, settings) {
    settings = build(settings);
    return receiveDrop(el, function (type, data) {
      return callback(settings.multiple ? filesFrom(type, data, settings) : fileFrom(type, data[0], settings));
    });
  };

  var receiveDrop = !support ? function () {} : function (el, callback) {
    watchDragging(el);
    $__default['default'](el).on({
      dragover: function dragover(e) {
        e.preventDefault(); // Prevent opening files.
        // This is way to change cursor.

        e.originalEvent.dataTransfer.dropEffect = 'copy';
      },
      drop: function drop(e) {
        var dt, i, len, ref, uri, uris;
        e.preventDefault(); // Prevent opening files.

        dt = e.originalEvent.dataTransfer;

        if (!dt) {
          return;
        }

        if (dt.files.length) {
          // eslint-disable-next-line standard/no-callback-literal
          return callback('object', dt.files);
        } else {
          uris = [];
          ref = dt.getData('text/uri-list').split();

          for (i = 0, len = ref.length; i < len; i++) {
            uri = ref[i];
            uri = $__default['default'].trim(uri);

            if (uri && uri[0] !== '#') {
              uris.push(uri);
            }
          }

          if (uris) {
            // eslint-disable-next-line standard/no-callback-literal
            return callback('url', uris);
          }
        }
      }
    });
  };
  var watchDragging = !support ? function () {} : function (el, receiver) {
    var changeState, counter, lastActive;
    lastActive = false;
    counter = 0;

    changeState = function changeState(active) {
      if (lastActive !== active) {
        lastActive = active;
        return $__default['default'](el).toggleClass('uploadcare--dragging', active);
      }
    };

    return $__default['default'](receiver || el).on({
      dragenter: function dragenter() {
        counter += 1;
        return changeState(true);
      },
      dragleave: function dragleave() {
        counter -= 1;

        if (counter === 0) {
          return changeState(false);
        }
      },
      'drop mouseenter': function dropMouseenter() {
        counter = 0;
        return changeState(false);
      }
    });
  };
  isWindowDefined() && watchDragging('body', document);

  var Template = /*#__PURE__*/function () {
    function Template(settings, element) {
      _classCallCheck(this, Template);

      this.settings = settings;
      this.element = element;
      this.content = $__default['default'](tpl('widget'));
      this.element.after(this.content);
      this.circle = new Circle(this.content.find('.uploadcare--widget__progress').removeClass('uploadcare--widget__progress'));
      this.content.find('.uploadcare--progress').addClass('uploadcare--widget__progress');
      this.statusText = this.content.find('.uploadcare--widget__text');
      this.content.toggleClass('uploadcare--widget_option_clearable', this.settings.clearable);
    }

    _createClass(Template, [{
      key: "addButton",
      value: function addButton(name) {
        var caption = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
        return $__default['default'](tpl('widget-button', {
          name: name,
          caption: caption
        })).appendTo(this.content);
      }
    }, {
      key: "setStatus",
      value: function setStatus(status) {
        var prefix;
        prefix = 'uploadcare--widget_status_';
        this.content.removeClass(prefix + this.content.attr('data-status'));
        this.content.attr('data-status', status);
        this.content.addClass(prefix + status);
        return this.element.trigger("".concat(status, ".uploadcare"));
      }
    }, {
      key: "reset",
      value: function reset() {
        this.circle.reset();
        this.setStatus('ready');
        this.content.attr('aria-busy', false);
        this.__file = undefined;
        return this.__file;
      }
    }, {
      key: "loaded",
      value: function loaded() {
        this.setStatus('loaded');
        this.content.attr('aria-busy', false);
        return this.circle.reset(true);
      }
    }, {
      key: "listen",
      value: function listen(file) {
        var _this = this;

        this.__file = file;
        this.circle.listen(file, 'uploadProgress');
        this.setStatus('started');
        this.content.attr('aria-busy', true);
        return file.progress(function (info) {
          if (file === _this.__file) {
            switch (info.state) {
              case 'uploading':
                return _this.statusText.text(locale.t('uploading'));

              case 'uploaded':
                return _this.statusText.text(locale.t('loadingInfo'));
            }
          }
        });
      }
    }, {
      key: "error",
      value: function error(errorType, _error) {
        var text = this.settings.debugUploads && (_error === null || _error === void 0 ? void 0 : _error.message) || locale.t("serverErrors.".concat(_error === null || _error === void 0 ? void 0 : _error.code)) || (_error === null || _error === void 0 ? void 0 : _error.message) || locale.t("errors.".concat(errorType || 'default'));
        this.statusText.text(text);
        this.content.attr('aria-busy', false);
        return this.setStatus('error');
      }
    }, {
      key: "setFileInfo",
      value: function setFileInfo(info) {
        return this.statusText.html(tpl('widget-file-name', info)).find('.uploadcare--widget__file-name').toggleClass('needsclick', this.settings.systemDialog);
      }
    }]);

    return Template;
  }();

  var FileTab = /*#__PURE__*/function () {
    function FileTab(container, tabButton1, dialogApi, settings, name1) {
      _classCallCheck(this, FileTab);

      this.__initTabsList = this.__initTabsList.bind(this);
      this.container = container;
      this.tabButton = tabButton1;
      this.dialogApi = dialogApi;
      this.settings = settings;
      this.name = name1;
      this.container.append(tpl('tab-file'));

      this.__setupFileButton();

      this.__initDragNDrop();

      this.__initTabsList();
    }

    _createClass(FileTab, [{
      key: "__initDragNDrop",
      value: function __initDragNDrop() {
        var _this = this;

        var dropArea;
        dropArea = this.container.find('.uploadcare--draganddrop');

        if (fileDragAndDrop) {
          receiveDrop(dropArea, function (type, files) {
            if (_this.settings.multiple) {
              _this.dialogApi.addFiles(type, files);
            } else {
              _this.dialogApi.addFiles(type, [files[0]]);
            }

            return _this.dialogApi.switchTab('preview');
          });
          return dropArea.addClass('uploadcare--draganddrop_supported');
        }
      }
    }, {
      key: "__setupFileButton",
      value: function __setupFileButton() {
        var _this2 = this;

        var fileButton;
        fileButton = this.container.find('.uploadcare--tab__action-button');

        if (sendFileAPI) {
          return fileButton.on('click', function () {
            fileSelectDialog(_this2.container, _this2.settings, function (input) {
              _this2.dialogApi.addFiles('object', input.files);

              return _this2.dialogApi.switchTab('preview');
            });
            return false;
          });
        } else {
          return fileInput(fileButton, this.settings, function (input) {
            _this2.dialogApi.addFiles('input', [input]);

            return _this2.dialogApi.switchTab('preview');
          });
        }
      }
    }, {
      key: "__initTabsList",
      value: function __initTabsList() {
        var _this3 = this;

        var i, len, list, n, ref, tab;
        list = this.container.find('.uploadcare--file-sources__items');
        list.remove('.uploadcare--file-sources__item:not(.uploadcare--file-source_all)');
        n = 0;
        ref = this.settings.tabs;

        for (i = 0, len = ref.length; i < len; i++) {
          tab = ref[i];

          if (tab === 'file' || tab === 'url' || tab === 'camera') {
            continue;
          }

          if (!this.dialogApi.isTabVisible(tab)) {
            continue;
          }

          n += 1;

          if (n > 5) {
            continue;
          }

          list.append([this.__tabButton(tab), ' ']);
        }

        list.find('.uploadcare--file-source_all').on('click', function () {
          return _this3.dialogApi.openMenu();
        });

        if (n > 5) {
          list.addClass('uploadcare--file-sources__items_many');
        }

        return this.container.find('.uploadcare--file-sources').attr('hidden', n === 0);
      }
    }, {
      key: "__tabButton",
      value: function __tabButton(name) {
        var _this4 = this;

        var tabIcon;
        tabIcon = $__default['default']("<svg width='32' height='32'><use xlink:href='#uploadcare--icon-".concat(name, "'/></svg>")).attr('role', 'presentation').attr('class', 'uploadcare--icon uploadcare--file-source__icon');
        return $__default['default']('<button>').addClass('uploadcare--button').addClass('uploadcare--button_icon').addClass('uploadcare--file-source').addClass("uploadcare--file-source_".concat(name)).addClass('uploadcare--file-sources__item').attr('type', 'button').attr('title', locale.t("dialog.tabs.names.".concat(name))).attr('data-tab', name).append(tabIcon).on('click', function () {
          return _this4.dialogApi.switchTab(name);
        });
      }
    }, {
      key: "displayed",
      value: function displayed() {
        this.dialogApi.takeFocus() && this.container.find('.uploadcare--tab__action-button').focus();
      }
    }]);

    return FileTab;
  }();

  var fixUrl, urlRegexp;

  var UrlTab = /*#__PURE__*/function () {
    function UrlTab(container, tabButton, dialogApi, settings, name) {
      var _this = this;

      _classCallCheck(this, UrlTab);

      var button, input;
      this.container = container;
      this.tabButton = tabButton;
      this.dialogApi = dialogApi;
      this.settings = settings;
      this.name = name;
      this.container.append(tpl('tab-url'));
      input = this.container.find('.uploadcare--input');
      input.on('change keyup input', function () {
        var isDisabled = !$__default['default'].trim(this.value);
        return button.attr('disabled', isDisabled).attr('aria-disabled', isDisabled);
      });
      button = this.container.find('.uploadcare--button[type=submit]').attr('disabled', true);
      this.container.find('.uploadcare--form').on('submit', function () {
        var url = fixUrl(input.val());

        if (url) {
          _this.dialogApi.addFiles('url', [[url, {
            source: 'url-tab'
          }]]);

          input.val('').trigger('change');
        }

        return false;
      });
    }

    _createClass(UrlTab, [{
      key: "displayed",
      value: function displayed() {
        this.dialogApi.takeFocus() && this.container.find('.uploadcare--input').focus();
      }
    }]);

    return UrlTab;
  }(); // starts with scheme


  urlRegexp = /^[a-z][a-z0-9+\-.]*:?\/\//;

  fixUrl = function fixUrl(url) {
    url = $__default['default'].trim(url);

    if (urlRegexp.test(url)) {
      return url;
    } else {
      return 'http://' + url;
    }
  };

  function find(arr, predicate) {
    var len = arr.length;
    var k = 0;

    while (k < len) {
      var kValue = arr[k];

      if (predicate(kValue)) {
        return kValue;
      }

      k++;
    }

    return undefined;
  }

  var isSecure = isWindowDefined() && document.location.protocol === 'https:';

  var CameraTab = /*#__PURE__*/function () {
    function CameraTab(container1, tabButton, dialogApi, settings, name1) {
      _classCallCheck(this, CameraTab);

      var video;
      this.__captureInput = this.__captureInput.bind(this);
      this.__captureInputHandle = this.__captureInputHandle.bind(this);
      this.__setState = this.__setState.bind(this);
      this.__requestCamera = this.__requestCamera.bind(this);
      this.__revoke = this.__revoke.bind(this);
      this.__mirror = this.__mirror.bind(this);
      this.__capture = this.__capture.bind(this);
      this.__startRecording = this.__startRecording.bind(this);
      this.__stopRecording = this.__stopRecording.bind(this);
      this.__cancelRecording = this.__cancelRecording.bind(this);
      this.container = container1;
      this.tabButton = tabButton;
      this.dialogApi = dialogApi;
      this.settings = settings;
      this.name = name1;

      if (this.__checkCapture()) {
        this.container.append(tpl('tab-camera-capture'));
        this.container.addClass('uploadcare--camera');
        this.container.find('.uploadcare--camera__button_type_photo').on('click', this.__captureInput('image/*'));
        video = this.container.find('.uploadcare--camera__button_type_video').on('click', this.__captureInput('video/*'));

        if (this.settings.imagesOnly) {
          video.hide();
        }
      } else {
        if (!this.__checkCompatibility()) {
          this.dialogApi.hideTab(this.name);
          return;
        }

        this.__initCamera();
      }
    }

    _createClass(CameraTab, [{
      key: "__captureInput",
      value: function __captureInput(accept) {
        var _this = this;

        return function () {
          return fileSelectDialog(_this.container, {
            inputAcceptTypes: accept
          }, _this.__captureInputHandle, {
            capture: 'camera'
          });
        };
      }
    }, {
      key: "__captureInputHandle",
      value: function __captureInputHandle(input) {
        this.dialogApi.addFiles('object', input.files);
        return this.dialogApi.switchTab('preview');
      }
    }, {
      key: "__initCamera",
      value: function __initCamera() {
        var _this2 = this;

        var startRecord;
        this.__loaded = false;
        this.mirrored = this.settings.cameraMirrorDefault;
        this.container.append(tpl('tab-camera'));
        this.container.addClass('uploadcare--camera');
        this.container.addClass('uploadcare--camera_status_requested');
        this.container.find('.uploadcare--camera__button_type_capture').on('click', this.__capture);
        startRecord = this.container.find('.uploadcare--camera__button_type_start-record').on('click', this.__startRecording);
        this.container.find('.uploadcare--camera__button_type_stop-record').on('click', this.__stopRecording);
        this.container.find('.uploadcare--camera__button_type_cancel-record').on('click', this.__cancelRecording);
        this.container.find('.uploadcare--camera__button_type_mirror').on('click', this.__mirror);
        this.container.find('.uploadcare--camera__button_type_retry').on('click', this.__requestCamera);

        if (!this.MediaRecorder || this.settings.imagesOnly || !this.settings.enableVideoRecording) {
          startRecord.hide();
        }

        this.video = this.container.find('.uploadcare--camera__video');
        this.video.toggleClass('uploadcare--camera__video_mirrored', this.mirrored);
        this.video.on('loadeddata', function () {
          return this.play();
        });
        this.dialogApi.progress(function (name) {
          if (name === _this2.name) {
            if (!_this2.__loaded) {
              return _this2.__requestCamera();
            }
          } else {
            if (_this2.__loaded && isSecure) {
              return _this2.__revoke();
            }
          }
        });
        return this.dialogApi.always(this.__revoke);
      }
    }, {
      key: "__checkCompatibility",
      value: function __checkCompatibility() {
        var isLocalhost;

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          this.getUserMedia = function (constraints, successCallback, errorCallback) {
            return navigator.mediaDevices.getUserMedia(constraints).then(successCallback).catch(errorCallback);
          };
        } else {
          this.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        }

        this.URL = window.URL || window.webkitURL;
        this.MediaRecorder = window.MediaRecorder;

        if (!isSecure) {
          warn('Camera is not allowed for HTTP. Please use HTTPS connection.');
        }

        isLocalhost = document.location.hostname === 'localhost';
        return !!this.getUserMedia && Uint8Array && (isSecure || isLocalhost);
      }
    }, {
      key: "__checkCapture",
      value: function __checkCapture() {
        var input;
        input = document.createElement('input');
        input.setAttribute('capture', 'camera');
        return !!input.capture;
      }
    }, {
      key: "__setState",
      value: function __setState(newState) {
        var oldStates = ['', 'ready', 'requested', 'denied', 'not-founded', 'recording', 'error'].join(' uploadcare--camera_status_');
        this.container.removeClass(oldStates).addClass("uploadcare--camera_status_".concat(newState));
        this.container.find('.uploadcare--camera__button').focus();
      }
    }, {
      key: "__requestCamera",
      value: function __requestCamera() {
        var _this3 = this;

        this.__loaded = true;
        return this.getUserMedia.call(navigator, {
          audio: this.settings.enableAudioRecording,
          video: {
            width: {
              ideal: 1920
            },
            height: {
              ideal: 1080
            },
            frameRate: {
              ideal: 30
            }
          }
        }, function (stream) {
          _this3.__setState('ready');

          _this3.__stream = stream;

          if ('srcObject' in _this3.video[0]) {
            _this3.video.prop('srcObject', stream);

            return _this3.video.on('loadedmetadata', function () {
              return _this3.video[0].play();
            });
          } else {
            if (_this3.URL) {
              _this3.__streamObject = _this3.URL.createObjectURL(stream);

              _this3.video.prop('src', _this3.__streamObject);
            } else {
              _this3.video.prop('src', stream);
            }

            return _this3.video[0].play();
          }
        }, function (error) {
          var handle = Object.create(null);

          handle.NotFoundError = function () {
            _this3.__setState('not-founded');
          };

          handle.NotAllowedError = function () {
            _this3.__setState('denied');
          };

          handle.other = function () {
            _this3.__setState('denied'); // TODO: add common error state: this.__setState('error')


            console.warn('Camera error occurred: ' + error.name);
          };

          (handle[error.name] || handle.other)();
          _this3.__loaded = false;
          return _this3.__loaded;
        });
      }
    }, {
      key: "__revoke",
      value: function __revoke() {
        var base;

        this.__setState('requested');

        this.__loaded = false;

        if (!this.__stream) {
          return;
        }

        if (this.__streamObject) {
          this.URL.revokeObjectURL(this.__streamObject);
        }

        if (this.__stream.getTracks) {
          $__default['default'].each(this.__stream.getTracks(), function () {
            return typeof this.stop === 'function' ? this.stop() : undefined;
          });
        } else {
          if (typeof (base = this.__stream).stop === 'function') {
            base.stop();
          }
        }

        this.__stream = null;
        return this.__stream;
      }
    }, {
      key: "__mirror",
      value: function __mirror() {
        this.mirrored = !this.mirrored;
        return this.video.toggleClass('uploadcare--camera__video_mirrored', this.mirrored);
      }
    }, {
      key: "__capture",
      value: function __capture() {
        var _this4 = this;

        var canvas, ctx, h, video, w;
        video = this.video[0];
        w = video.videoWidth;
        h = video.videoHeight;
        canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        ctx = canvas.getContext('2d');

        if (this.mirrored) {
          ctx.translate(w, 0);
          ctx.scale(-1, 1);
        }

        ctx.drawImage(video, 0, 0, w, h);
        return canvasToBlob(canvas, 'image/jpeg', 0.9, function (blob) {
          canvas.width = canvas.height = 1;
          blob.name = 'camera.jpg';

          _this4.dialogApi.addFiles('object', [[blob, {
            source: 'camera'
          }]]);

          return _this4.dialogApi.switchTab('preview');
        });
      }
    }, {
      key: "__startRecording",
      value: function __startRecording() {
        var _this5 = this;

        this.__setState('recording');

        this.__chunks = [];
        var __recorderOptions = {};
        var mimeTypes = this.settings.videoPreferredMimeTypes;

        if (mimeTypes != null) {
          var mimeType = find($__default['default'].isArray(mimeTypes) ? mimeTypes : [mimeTypes], function (mimeType) {
            return _this5.MediaRecorder.isTypeSupported(mimeType);
          });

          if (mimeType != null) {
            __recorderOptions.mimeType = mimeType;
          }
        }

        var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

        if (__recorderOptions.mimeType == null && isFirefox && this.MediaRecorder.isTypeSupported('video/webm')) {
          __recorderOptions.mimeType = 'video/webm';
        }

        if (this.settings.audioBitsPerSecond !== null) {
          __recorderOptions.audioBitsPerSecond = this.settings.audioBitsPerSecond;
        }

        if (this.settings.videoBitsPerSecond !== null) {
          __recorderOptions.videoBitsPerSecond = this.settings.videoBitsPerSecond;
        }

        if (Object.keys(__recorderOptions).length !== 0) {
          this.__recorder = new this.MediaRecorder(this.__stream, __recorderOptions);
        } else {
          this.__recorder = new this.MediaRecorder(this.__stream);
        }

        this.__recorder.start();

        this.__recorder.ondataavailable = function (e) {
          return _this5.__chunks.push(e.data);
        };

        return this.__recorder.ondataavailable;
      }
    }, {
      key: "__stopRecording",
      value: function __stopRecording() {
        var _this6 = this;

        this.__setState('ready');

        this.__recorder.onstop = function () {
          var blob, ext;
          blob = new window.Blob(_this6.__chunks, {
            type: _this6.__recorder.mimeType
          });
          ext = _this6.__guessExtensionByMime(_this6.__recorder.mimeType);
          blob.name = "record.".concat(ext);

          _this6.dialogApi.addFiles('object', [[blob, {
            source: 'camera'
          }]]);

          _this6.dialogApi.switchTab('preview');

          _this6.__chunks = [];
          return _this6.__chunks;
        };

        return this.__recorder.stop();
      }
    }, {
      key: "__cancelRecording",
      value: function __cancelRecording() {
        this.__setState('ready');

        this.__recorder.stop();

        this.__chunks = [];
        return this.__chunks;
      }
    }, {
      key: "__guessExtensionByMime",
      value: function __guessExtensionByMime(mime) {
        var knownContainers = {
          mp4: 'mp4',
          ogg: 'ogg',
          webm: 'webm',
          quicktime: 'mov',
          'x-matroska': 'mkv'
        }; // MediaRecorder.mimeType returns empty string in Firefox.
        // Firefox record video as WebM now by default.
        // @link https://bugzilla.mozilla.org/show_bug.cgi?id=1512175

        if (mime === '') {
          return 'webm';
        } // e.g. "video/x-matroska;codecs=avc1,opus"


        if (mime) {
          // e.g. ["video", "x-matroska;codecs=avc1,opus"]
          mime = mime.split('/');

          if (mime[0] === 'video') {
            // e.g. "x-matroska;codecs=avc1,opus"
            mime = mime.slice(1).join('/'); // e.g. "x-matroska"

            var container = mime.split(';')[0]; // e.g. "mkv"

            if (knownContainers[container]) {
              return knownContainers[container];
            }
          }
        } // In all other cases just return the base extension for all times


        return 'avi';
      }
    }, {
      key: "displayed",
      value: function displayed() {
        this.dialogApi.takeFocus() && this.container.find('.uploadcare--camera__button').focus();
      }
    }]);

    return CameraTab;
  }();
  /**
   * jquery.Jcrop.js v0.9.10
   * jQuery Image Cropping Plugin - released under MIT License
   * Author: Kelly Hallman <khallman@gmail.com>
   * http://github.com/tapmodo/Jcrop
   * Copyright (c) 2008-2012 Tapmodo Interactive LLC {{{
   *
   * Permission is hereby granted, free of charge, to any person
   * obtaining a copy of this software and associated documentation
   * files (the "Software"), to deal in the Software without
   * restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the
   * Software is furnished to do so, subject to the following
   * conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
   * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
   * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
   * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
   * OTHER DEALINGS IN THE SOFTWARE.
   *
   * }}}
   */


  isWindowDefined() && function ($) {
    $.Jcrop = function (obj, opt) {
      var options = $.extend({}, $.Jcrop.defaults),
          docOffset; // Internal Methods {{{

      function px(n) {
        return Math.round(n) + 'px';
      }

      function cssClass(cl) {
        return options.baseClass + '-' + cl;
      }

      function supportsColorFade() {
        return $.fx.step.hasOwnProperty('backgroundColor');
      }

      function getPos(obj) //{{{
      {
        var pos = $(obj).offset();
        return [pos.left, pos.top];
      } //}}}


      function mouseAbs(e) //{{{
      {
        return [e.pageX - docOffset[0], e.pageY - docOffset[1]];
      } //}}}


      function setOptions(opt) //{{{
      {
        if (_typeof(opt) !== 'object') opt = {};
        options = $.extend(options, opt);
        $.each(['onChange', 'onSelect', 'onRelease', 'onDblClick'], function (i, e) {
          if (typeof options[e] !== 'function') options[e] = function () {};
        });
      } //}}}


      function startDragMode(mode, pos) //{{{
      {
        docOffset = getPos($img);

        if (mode === 'move') {
          return Tracker.activateHandlers(createMover(pos), doneSelect);
        }

        var fc = Coords.getFixed();
        var opp = oppLockCorner(mode);
        var opc = Coords.getCorner(oppLockCorner(opp));
        Coords.setPressed(Coords.getCorner(opp));
        Coords.setCurrent(opc);
        Tracker.activateHandlers(dragmodeHandler(mode, fc), doneSelect);
      } //}}}


      function dragmodeHandler(mode, f) //{{{
      {
        return function (pos) {
          if (!options.aspectRatio) {
            switch (mode) {
              case 'e':
                pos[1] = f.y2;
                break;

              case 'w':
                pos[1] = f.y2;
                break;

              case 'n':
                pos[0] = f.x2;
                break;

              case 's':
                pos[0] = f.x2;
                break;
            }
          } else {
            switch (mode) {
              case 'e':
                pos[1] = f.y + 1;
                break;

              case 'w':
                pos[1] = f.y + 1;
                break;

              case 'n':
                pos[0] = f.x + 1;
                break;

              case 's':
                pos[0] = f.x + 1;
                break;
            }
          }

          Coords.setCurrent(pos);
          Selection.update();
        };
      } //}}}


      function createMover(pos) //{{{
      {
        var lloc = pos;
        KeyManager.watchKeys();
        return function (pos) {
          Coords.moveOffset([pos[0] - lloc[0], pos[1] - lloc[1]]);
          lloc = pos;
          Selection.update();
        };
      } //}}}


      function oppLockCorner(ord) //{{{
      {
        switch (ord) {
          case 'n':
            return 'sw';

          case 's':
            return 'nw';

          case 'e':
            return 'nw';

          case 'w':
            return 'ne';

          case 'ne':
            return 'sw';

          case 'nw':
            return 'se';

          case 'se':
            return 'nw';

          case 'sw':
            return 'ne';
        }
      } //}}}


      function createDragger(ord) //{{{
      {
        return function (e) {
          if (options.disabled) {
            return false;
          }

          if (ord === 'move' && !options.allowMove) {
            return false;
          } // Fix position of crop area when dragged the very first time.
          // Necessary when crop image is in a hidden element when page is loaded.


          docOffset = getPos($img);
          btndown = true;
          startDragMode(ord, mouseAbs(e));
          e.stopPropagation();
          e.preventDefault();
          return false;
        };
      } //}}}


      function presize($obj, w, h) //{{{
      {
        var nw = $obj.width(),
            nh = $obj.height();

        if (nw > w && w > 0) {
          nw = w;
          nh = w / $obj.width() * $obj.height();
        }

        if (nh > h && h > 0) {
          nh = h;
          nw = h / $obj.height() * $obj.width();
        }

        xscale = $obj.width() / nw;
        yscale = $obj.height() / nh;
        $obj.width(nw).height(nh);
      } //}}}


      function unscale(c) //{{{
      {
        return {
          x: c.x * xscale,
          y: c.y * yscale,
          x2: c.x2 * xscale,
          y2: c.y2 * yscale,
          w: c.w * xscale,
          h: c.h * yscale
        };
      } //}}}


      function doneSelect(pos) //{{{
      {
        Coords.getFixed();
        Selection.enableHandles();
        Selection.done();
      } //}}}


      function newTracker() //{{{
      {
        var trk = $('<div></div>').addClass(cssClass('tracker'));
        trk.css({
          opacity: 0,
          backgroundColor: 'white'
        });
        return trk;
      } //}}}
      // }}}
      // Initialization {{{
      // Sanitize some options {{{


      if (_typeof(obj) !== 'object') {
        obj = $(obj)[0];
      }

      if (_typeof(opt) !== 'object') {
        opt = {};
      } // }}}


      setOptions(opt); // Initialize some jQuery objects {{{
      // The values are SET on the image(s) for the interface
      // If the original image has any of these set, they will be reset
      // However, if you destroy() the Jcrop instance the original image's
      // character in the DOM will be as you left it.

      var img_css = {
        border: 'none',
        visibility: 'visible',
        margin: 0,
        padding: 0,
        position: 'absolute',
        top: 0,
        left: 0
      };
      var $origimg = $(obj),
          img_mode = true;

      if (obj.tagName == 'IMG') {
        // Fix size of crop image.
        // Necessary when crop image is within a hidden element when page is loaded.
        if ($origimg[0].width != 0 && $origimg[0].height != 0) {
          // Obtain dimensions from contained img element.
          $origimg.width($origimg[0].width);
          $origimg.height($origimg[0].height);
        } else {
          // Obtain dimensions from temporary image in case the original is not loaded yet (e.g. IE 7.0).
          var tempImage = new Image();
          tempImage.src = $origimg[0].src;
          $origimg.width(tempImage.width);
          $origimg.height(tempImage.height);
        }

        var $img = $origimg.clone().removeAttr('id').css(img_css).show();
        $img.width($origimg.width());
        $img.height($origimg.height());
        $origimg.after($img).hide();
      } else {
        $img = $origimg.css(img_css).show();
        img_mode = false;

        if (options.shade === null) {
          options.shade = true;
        }
      }

      presize($img, options.boxWidth, options.boxHeight);
      var boundx = $img.width(),
          boundy = $img.height(),
          $div = $('<div></div>').width(boundx).height(boundy).addClass(cssClass('holder')).css({
        position: 'relative',
        backgroundColor: options.bgColor
      }).insertAfter($origimg).append($img);

      if (options.addClass) {
        $div.addClass(options.addClass);
      }

      var $img2 = $('<div></div>'),
          $img_holder = $('<div></div>').width('100%').height('100%').css({
        zIndex: 310,
        position: 'absolute',
        overflow: 'hidden'
      }),
          $sel = $('<div></div>').css({
        position: 'absolute',
        zIndex: 600
      }).dblclick(function () {
        var c = Coords.getFixed();
        options.onDblClick.call(api, c);
      }).insertBefore($img).append($img_holder);

      if (img_mode) {
        $img2 = $('<img />').attr('src', $img.attr('src')).css(img_css).width(boundx).height(boundy), $img_holder.append($img2);
      }

      var bound = options.boundary;
      var $trk = newTracker().width(boundx + bound * 2).height(boundy + bound * 2).css({
        position: 'absolute',
        top: px(-bound),
        left: px(-bound),
        zIndex: 290
      });
      /* }}} */
      // Set more variables {{{

      var bgcolor = options.bgColor,
          bgopacity = options.bgOpacity,
          xlimit,
          ylimit,
          xmin,
          ymin,
          xscale,
          yscale,
          btndown,
          shift_down;
      docOffset = getPos($img); // }}}
      // }}}
      // Internal Modules {{{
      // Touch Module {{{

      var Touch = function () {
        // Touch support detection function adapted (under MIT License)
        // from code by Jeffrey Sambells - http://github.com/iamamused/
        function hasTouchSupport() {
          var support = {},
              events = ['touchstart', 'touchmove', 'touchend'],
              el = document.createElement('div'),
              i;

          try {
            for (i = 0; i < events.length; i++) {
              var eventName = events[i];
              eventName = 'on' + eventName;
              var isSupported = (eventName in el);

              if (!isSupported) {
                el.setAttribute(eventName, 'return;');
                isSupported = typeof el[eventName] == 'function';
              }

              support[events[i]] = isSupported;
            }

            return support.touchstart && support.touchend && support.touchmove;
          } catch (err) {
            return false;
          }
        }

        function detectSupport() {
          if (options.touchSupport === true || options.touchSupport === false) return options.touchSupport;else return hasTouchSupport();
        }

        return {
          createDragger: function createDragger(ord) {
            return function (e) {
              e.pageX = e.originalEvent.changedTouches[0].pageX;
              e.pageY = e.originalEvent.changedTouches[0].pageY;

              if (options.disabled) {
                return false;
              }

              if (ord === 'move' && !options.allowMove) {
                return false;
              }

              btndown = true;
              startDragMode(ord, mouseAbs(e));
              e.stopPropagation();
              e.preventDefault();
              return false;
            };
          },
          isSupported: hasTouchSupport,
          support: detectSupport()
        };
      }(); // }}}
      // Coords Module {{{


      var Coords = function () {
        var x1 = 0,
            y1 = 0,
            x2 = 0,
            y2 = 0,
            ox,
            oy;

        function setPressed(pos) //{{{
        {
          pos = rebound(pos);
          x2 = x1 = pos[0];
          y2 = y1 = pos[1];
        } //}}}


        function setCurrent(pos) //{{{
        {
          pos = rebound(pos);
          ox = pos[0] - x2;
          oy = pos[1] - y2;
          x2 = pos[0];
          y2 = pos[1];
        } //}}}


        function getOffset() //{{{
        {
          return [ox, oy];
        } //}}}


        function moveOffset(offset) //{{{
        {
          var ox = offset[0],
              oy = offset[1];

          if (0 > x1 + ox) {
            ox -= ox + x1;
          }

          if (0 > y1 + oy) {
            oy -= oy + y1;
          }

          if (boundy < y2 + oy) {
            oy += boundy - (y2 + oy);
          }

          if (boundx < x2 + ox) {
            ox += boundx - (x2 + ox);
          }

          x1 += ox;
          x2 += ox;
          y1 += oy;
          y2 += oy;
        } //}}}


        function getCorner(ord) //{{{
        {
          var c = getFixed();

          switch (ord) {
            case 'ne':
              return [c.x2, c.y];

            case 'nw':
              return [c.x, c.y];

            case 'se':
              return [c.x2, c.y2];

            case 'sw':
              return [c.x, c.y2];
          }
        } //}}}


        function getFixed() //{{{
        {
          if (!options.aspectRatio) {
            return getRect();
          } // This function could use some optimization I think...


          var aspect = options.aspectRatio,
              min_x = options.minSize[0] / xscale,
              //min_y = options.minSize[1]/yscale,
          max_x = options.maxSize[0] / xscale;
          options.maxSize[1] / yscale;
          var rw = x2 - x1,
              rh = y2 - y1,
              rwa = Math.abs(rw),
              rha = Math.abs(rh),
              real_ratio = rwa / rha,
              xx,
              yy,
              w,
              h;

          if (max_x === 0) {
            max_x = boundx * 10;
          }

          if (real_ratio < aspect) {
            yy = y2;
            w = rha * aspect;
            xx = rw < 0 ? x1 - w : w + x1;

            if (xx < 0) {
              xx = 0;
              h = Math.abs((xx - x1) / aspect);
              yy = rh < 0 ? y1 - h : h + y1;
            } else if (xx > boundx) {
              xx = boundx;
              h = Math.abs((xx - x1) / aspect);
              yy = rh < 0 ? y1 - h : h + y1;
            }
          } else {
            xx = x2;
            h = rwa / aspect;
            yy = rh < 0 ? y1 - h : y1 + h;

            if (yy < 0) {
              yy = 0;
              w = Math.abs((yy - y1) * aspect);
              xx = rw < 0 ? x1 - w : w + x1;
            } else if (yy > boundy) {
              yy = boundy;
              w = Math.abs(yy - y1) * aspect;
              xx = rw < 0 ? x1 - w : w + x1;
            }
          } // Magic %-)


          if (xx > x1) {
            // right side
            if (xx - x1 < min_x) {
              xx = x1 + min_x;
            } else if (xx - x1 > max_x) {
              xx = x1 + max_x;
            }

            if (yy > y1) {
              yy = y1 + (xx - x1) / aspect;
            } else {
              yy = y1 - (xx - x1) / aspect;
            }
          } else if (xx < x1) {
            // left side
            if (x1 - xx < min_x) {
              xx = x1 - min_x;
            } else if (x1 - xx > max_x) {
              xx = x1 - max_x;
            }

            if (yy > y1) {
              yy = y1 + (x1 - xx) / aspect;
            } else {
              yy = y1 - (x1 - xx) / aspect;
            }
          }

          if (xx < 0) {
            x1 -= xx;
            xx = 0;
          } else if (xx > boundx) {
            x1 -= xx - boundx;
            xx = boundx;
          }

          if (yy < 0) {
            y1 -= yy;
            yy = 0;
          } else if (yy > boundy) {
            y1 -= yy - boundy;
            yy = boundy;
          }

          return makeObj(flipCoords(x1, y1, xx, yy));
        } //}}}


        function rebound(p) //{{{
        {
          if (p[0] < 0) {
            p[0] = 0;
          }

          if (p[1] < 0) {
            p[1] = 0;
          }

          if (p[0] > boundx) {
            p[0] = boundx;
          }

          if (p[1] > boundy) {
            p[1] = boundy;
          }

          return [p[0], p[1]];
        } //}}}


        function flipCoords(x1, y1, x2, y2) //{{{
        {
          var xa = x1,
              xb = x2,
              ya = y1,
              yb = y2;

          if (x2 < x1) {
            xa = x2;
            xb = x1;
          }

          if (y2 < y1) {
            ya = y2;
            yb = y1;
          }

          return [xa, ya, xb, yb];
        } //}}}


        function getRect() //{{{
        {
          var xsize = x2 - x1,
              ysize = y2 - y1,
              delta;

          if (xlimit && Math.abs(xsize) > xlimit) {
            x2 = xsize > 0 ? x1 + xlimit : x1 - xlimit;
          }

          if (ylimit && Math.abs(ysize) > ylimit) {
            y2 = ysize > 0 ? y1 + ylimit : y1 - ylimit;
          }

          if (ymin / yscale && Math.abs(ysize) < ymin / yscale) {
            y2 = ysize > 0 ? y1 + ymin / yscale : y1 - ymin / yscale;
          }

          if (xmin / xscale && Math.abs(xsize) < xmin / xscale) {
            x2 = xsize > 0 ? x1 + xmin / xscale : x1 - xmin / xscale;
          }

          if (x1 < 0) {
            x2 -= x1;
            x1 -= x1;
          }

          if (y1 < 0) {
            y2 -= y1;
            y1 -= y1;
          }

          if (x2 < 0) {
            x1 -= x2;
            x2 -= x2;
          }

          if (y2 < 0) {
            y1 -= y2;
            y2 -= y2;
          }

          if (x2 > boundx) {
            delta = x2 - boundx;
            x1 -= delta;
            x2 -= delta;
          }

          if (y2 > boundy) {
            delta = y2 - boundy;
            y1 -= delta;
            y2 -= delta;
          }

          if (x1 > boundx) {
            delta = x1 - boundy;
            y2 -= delta;
            y1 -= delta;
          }

          if (y1 > boundy) {
            delta = y1 - boundy;
            y2 -= delta;
            y1 -= delta;
          }

          return makeObj(flipCoords(x1, y1, x2, y2));
        } //}}}


        function makeObj(a) //{{{
        {
          return {
            x: a[0],
            y: a[1],
            x2: a[2],
            y2: a[3],
            w: a[2] - a[0],
            h: a[3] - a[1]
          };
        } //}}}


        return {
          flipCoords: flipCoords,
          setPressed: setPressed,
          setCurrent: setCurrent,
          getOffset: getOffset,
          moveOffset: moveOffset,
          getCorner: getCorner,
          getFixed: getFixed
        };
      }(); //}}}
      // Shade Module {{{


      var Shade = function () {
        var enabled = false,
            holder = $('<div></div>').css({
          position: 'absolute',
          zIndex: 240,
          opacity: 0
        }),
            shades = {
          top: createShade(),
          left: createShade().height(boundy),
          right: createShade().height(boundy),
          bottom: createShade()
        };

        function resizeShades(w, h) {
          shades.left.css({
            height: px(h)
          });
          shades.right.css({
            height: px(h)
          });
        }

        function updateAuto() {
          return updateShade(Coords.getFixed());
        }

        function updateShade(c) {
          shades.top.css({
            left: px(c.x),
            width: px(c.w),
            height: px(c.y)
          });
          shades.bottom.css({
            top: px(c.y2),
            left: px(c.x),
            width: px(c.w),
            height: px(boundy - c.y2)
          });
          shades.right.css({
            left: px(c.x2),
            width: px(boundx - c.x2)
          });
          shades.left.css({
            width: px(c.x)
          });
        }

        function createShade() {
          return $('<div></div>').css({
            position: 'absolute',
            backgroundColor: options.shadeColor || options.bgColor
          }).appendTo(holder);
        }

        function enableShade() {
          if (!enabled) {
            enabled = true;
            holder.insertBefore($img);
            updateAuto();
            Selection.setBgOpacity(1, 0, 1);
            $img2.hide();
            setBgColor(options.shadeColor || options.bgColor, 1);

            if (Selection.isAwake()) {
              setOpacity(options.bgOpacity, 1);
            } else setOpacity(1, 1);
          }
        }

        function setBgColor(color, now) {
          colorChangeMacro(getShades(), color, now);
        }

        function disableShade() {
          if (enabled) {
            holder.remove();
            $img2.show();
            enabled = false;

            if (Selection.isAwake()) {
              Selection.setBgOpacity(options.bgOpacity, 1, 1);
            } else {
              Selection.setBgOpacity(1, 1, 1);
              Selection.disableHandles();
            }

            colorChangeMacro($div, 0, 1);
          }
        }

        function setOpacity(opacity, now) {
          if (enabled) {
            if (options.bgFade && !now) {
              holder.animate({
                opacity: 1 - opacity
              }, {
                queue: false,
                duration: options.fadeTime
              });
            } else holder.css({
              opacity: 1 - opacity
            });
          }
        }

        function refreshAll() {
          options.shade ? enableShade() : disableShade();
          if (Selection.isAwake()) setOpacity(options.bgOpacity);
        }

        function getShades() {
          return holder.children();
        }

        return {
          update: updateAuto,
          updateRaw: updateShade,
          getShades: getShades,
          setBgColor: setBgColor,
          enable: enableShade,
          disable: disableShade,
          resize: resizeShades,
          refresh: refreshAll,
          opacity: setOpacity
        };
      }(); // }}}
      // Selection Module {{{


      var Selection = function () {
        var awake,
            borders = {},
            handle = {}; // Private Methods

        function insertBorder(type) //{{{
        {
          var jq = $('<div></div>').css({
            position: 'absolute'
          }).addClass(cssClass(type));
          $sel.append(jq);
          return jq;
        } //}}}


        function dragDiv(ord) //{{{
        {
          var jq = $('<div></div>').mousedown(createDragger(ord)).css({
            cursor: ord + '-resize',
            position: 'absolute'
          }).append('<div></div>').addClass('ord-' + ord);

          if (Touch.support) {
            jq.on('touchstart.jcrop', Touch.createDragger(ord));
          }

          $sel.append(jq);
          return jq;
        } //}}}


        function insertHandle(ord) //{{{
        {
          return dragDiv(ord).addClass(cssClass('handle'));
        } //}}}


        function createBorders(li) //{{{
        {
          var cl, i;

          for (i = 0; i < li.length; i++) {
            switch (li[i]) {
              case 'n':
                cl = 'hline';
                break;

              case 's':
                cl = 'hline bottom';
                break;

              case 'e':
                cl = 'vline right';
                break;

              case 'w':
                cl = 'vline';
                break;
            }

            borders[li[i]] = insertBorder(cl);
          }
        } //}}}


        function createHandles(li) //{{{
        {
          var i;

          for (i = 0; i < li.length; i++) {
            handle[li[i]] = insertHandle(li[i]);
          }
        } //}}}


        function moveto(x, y) //{{{
        {
          if (!options.shade) {
            $img2.css({
              top: px(-y),
              left: px(-x)
            });
          }

          $sel.css({
            top: px(y),
            left: px(x)
          });
        } //}}}


        function resize(w, h) //{{{
        {
          $sel.width(Math.round(w)).height(Math.round(h));
        } //}}}


        function refresh() //{{{
        {
          var c = Coords.getFixed();
          Coords.setPressed([c.x, c.y]);
          Coords.setCurrent([c.x2, c.y2]);
          updateVisible();
        } //}}}
        // Internal Methods


        function updateVisible(select) //{{{
        {
          if (awake) {
            return update(select);
          }
        } //}}}


        function update(select) //{{{
        {
          var c = Coords.getFixed();
          resize(c.w, c.h);
          moveto(c.x, c.y);
          if (options.shade) Shade.updateRaw(c);
          awake || show();

          if (select) {
            options.onSelect.call(api, unscale(c));
          } else {
            options.onChange.call(api, unscale(c));
          }
        } //}}}


        function setBgOpacity(opacity, force, now) //{{{
        {
          if (!awake && !force) return;

          if (options.bgFade && !now) {
            $img.animate({
              opacity: opacity
            }, {
              queue: false,
              duration: options.fadeTime
            });
          } else {
            $img.css('opacity', opacity);
          }
        } //}}}


        function show() //{{{
        {
          $sel.show();
          if (options.shade) Shade.opacity(bgopacity);else setBgOpacity(bgopacity, true);
          awake = true;
        } //}}}


        function release() //{{{
        {
          $sel.hide();
          if (options.shade) Shade.opacity(1);else setBgOpacity(1);
          awake = false;
          options.onRelease.call(api);
        } //}}}


        function enableHandles() //{{{
        {
          if (options.allowResize) {
            return true;
          }
        } //}}}


        function disableHandles() //{{{
        {} //}}}


        function animMode(v) //{{{
        {
          if (v) ;else {
            enableHandles();
          }
        } //}}}


        function done() //{{{
        {
          animMode(false);
          refresh();
        } //}}}
        // Insert draggable elements {{{
        // Insert border divs for outline


        if ($.isArray(options.createHandles)) createHandles(options.createHandles);
        if (options.drawBorders && $.isArray(options.createBorders)) createBorders(options.createBorders); //}}}
        // This is a hack for iOS5 to support drag/move touch functionality

        $(document).on('touchstart.jcrop-ios', function (e) {
          if ($(e.currentTarget).hasClass('jcrop-tracker')) e.stopPropagation();
        });
        var $track = newTracker().mousedown(createDragger('move')).css({
          cursor: 'move',
          position: 'absolute',
          zIndex: 360
        });

        if (Touch.support) {
          $track.on('touchstart.jcrop', Touch.createDragger('move'));
        }

        $img_holder.append($track);
        return {
          updateVisible: updateVisible,
          update: update,
          release: release,
          refresh: refresh,
          isAwake: function isAwake() {
            return awake;
          },
          setCursor: function setCursor(cursor) {
            $track.css('cursor', cursor);
          },
          enableHandles: enableHandles,
          enableOnly: function enableOnly() {},
          disableHandles: disableHandles,
          animMode: animMode,
          setBgOpacity: setBgOpacity,
          done: done
        };
      }(); //}}}
      // Tracker Module {{{


      var Tracker = function () {
        var onMove = function onMove() {},
            onDone = function onDone() {},
            trackDoc = options.trackDocument;

        function toFront() //{{{
        {
          $trk.css({
            zIndex: 450
          });

          if (Touch.support) {
            $(document).on('touchmove.jcrop', trackTouchMove).on('touchend.jcrop', trackTouchEnd);
          }

          if (trackDoc) {
            $(document).on('mousemove.jcrop', trackMove).on('mouseup.jcrop', trackUp);
          }
        } //}}}


        function toBack() //{{{
        {
          $trk.css({
            zIndex: 290
          });
          $(document).off('.jcrop');
        } //}}}


        function trackMove(e) //{{{
        {
          onMove(mouseAbs(e));
          return false;
        } //}}}


        function trackUp(e) //{{{
        {
          e.preventDefault();
          e.stopPropagation();

          if (btndown) {
            btndown = false;
            onDone(mouseAbs(e));

            if (Selection.isAwake()) {
              options.onSelect.call(api, unscale(Coords.getFixed()));
            }

            toBack();

            onMove = function onMove() {};

            onDone = function onDone() {};
          }

          return false;
        } //}}}


        function activateHandlers(move, done) //{{{
        {
          btndown = true;
          onMove = move;
          onDone = done;
          toFront();
          return false;
        } //}}}


        function trackTouchMove(e) //{{{
        {
          e.pageX = e.originalEvent.changedTouches[0].pageX;
          e.pageY = e.originalEvent.changedTouches[0].pageY;
          return trackMove(e);
        } //}}}


        function trackTouchEnd(e) //{{{
        {
          e.pageX = e.originalEvent.changedTouches[0].pageX;
          e.pageY = e.originalEvent.changedTouches[0].pageY;
          return trackUp(e);
        } //}}}


        if (!trackDoc) {
          $trk.mousemove(trackMove).mouseup(trackUp).mouseout(trackUp);
        }

        $img.before($trk);
        return {
          activateHandlers: activateHandlers
        };
      }(); //}}}
      // KeyManager Module {{{


      var KeyManager = function () {
        var $keymgr = $('<input type="radio" />').css({
          position: 'fixed',
          left: '-120px',
          width: '12px'
        }).addClass('jcrop-keymgr'),
            $keywrap = $('<div></div>').css({
          position: 'absolute',
          overflow: 'hidden'
        }).append($keymgr);

        function watchKeys() //{{{
        {
          if (options.keySupport) {
            $keymgr.show();
            $keymgr.focus();
          }
        } //}}}


        function onBlur(e) //{{{
        {
          $keymgr.hide();
        } //}}}


        function doNudge(e, x, y) //{{{
        {
          if (options.allowMove) {
            Coords.moveOffset([x, y]);
            Selection.updateVisible(true);
          }

          e.preventDefault();
          e.stopPropagation();
        } //}}}


        function parseKey(e) //{{{
        {
          if (e.ctrlKey || e.metaKey) {
            return true;
          }

          shift_down = e.shiftKey ? true : false;
          var nudge = shift_down ? 10 : 1;

          switch (e.keyCode) {
            case 37:
              doNudge(e, -nudge, 0);
              break;

            case 39:
              doNudge(e, nudge, 0);
              break;

            case 38:
              doNudge(e, 0, -nudge);
              break;

            case 40:
              doNudge(e, 0, nudge);
              break;

            case 9:
              return true;
          }

          return false;
        } //}}}


        if (options.keySupport) {
          $keymgr.keydown(parseKey).blur(onBlur);
          $keymgr.css({
            position: 'absolute',
            left: '-20px'
          });
          $keywrap.append($keymgr).insertBefore($img);
        }

        return {
          watchKeys: watchKeys
        };
      }(); //}}}
      // }}}
      // API methods {{{


      function setClass(cname) //{{{
      {
        $div.removeClass().addClass(cssClass('holder')).addClass(cname);
      } //}}}


      function setSelect(rect) //{{{
      {
        setSelectRaw([rect[0] / xscale, rect[1] / yscale, rect[2] / xscale, rect[3] / yscale]);
        options.onSelect.call(api, unscale(Coords.getFixed()));
        Selection.enableHandles();
      } //}}}


      function setSelectRaw(l) //{{{
      {
        Coords.setPressed([l[0], l[1]]);
        Coords.setCurrent([l[2], l[3]]);
        Selection.update();
      } //}}}


      function tellSelect() //{{{
      {
        return unscale(Coords.getFixed());
      } //}}}


      function tellScaled() //{{{
      {
        return Coords.getFixed();
      } //}}}


      function setOptionsNew(opt) //{{{
      {
        setOptions(opt);
        interfaceUpdate();
      } //}}}


      function disableCrop() //{{{
      {
        options.disabled = true;
        Selection.disableHandles();
        Selection.setCursor('default');
      } //}}}


      function enableCrop() //{{{
      {
        options.disabled = false;
        interfaceUpdate();
      } //}}}


      function cancelCrop() //{{{
      {
        Selection.done();
        Tracker.activateHandlers(null, null);
      } //}}}


      function destroy() //{{{
      {
        $div.remove();
        $origimg.show();
        $origimg.css('visibility', 'visible');
        $(obj).removeData('Jcrop');
      } //}}}


      function colorChangeMacro($obj, color, now) {
        var mycolor = color || options.bgColor;

        if (options.bgFade && supportsColorFade() && options.fadeTime && !now) {
          $obj.animate({
            backgroundColor: mycolor
          }, {
            queue: false,
            duration: options.fadeTime
          });
        } else {
          $obj.css('backgroundColor', mycolor);
        }
      }

      function interfaceUpdate(alt) //{{{
      // This method tweaks the interface based on options object.
      // Called when options are changed and at end of initialization.
      {
        if (options.allowResize) {
          if (alt) {
            Selection.enableOnly();
          } else {
            Selection.enableHandles();
          }
        } else {
          Selection.disableHandles();
        }

        Selection.setCursor(options.allowMove ? 'move' : 'default');

        if (options.hasOwnProperty('trueSize')) {
          xscale = options.trueSize[0] / boundx;
          yscale = options.trueSize[1] / boundy;
        }

        if (options.hasOwnProperty('setSelect')) {
          setSelect(options.setSelect);
          Selection.done();
          delete options.setSelect;
        }

        Shade.refresh();

        if (options.bgColor != bgcolor) {
          colorChangeMacro(options.shade ? Shade.getShades() : $div, options.shade ? options.shadeColor || options.bgColor : options.bgColor);
          bgcolor = options.bgColor;
        }

        if (bgopacity != options.bgOpacity) {
          bgopacity = options.bgOpacity;
          if (options.shade) Shade.refresh();else Selection.setBgOpacity(bgopacity);
        }

        xlimit = options.maxSize[0] || 0;
        ylimit = options.maxSize[1] || 0;
        xmin = options.minSize[0] || 0;
        ymin = options.minSize[1] || 0;

        if (options.hasOwnProperty('outerImage')) {
          $img.attr('src', options.outerImage);
          delete options.outerImage;
        }

        Selection.refresh();
      } //}}}
      //}}}


      interfaceUpdate(true);
      var api = {
        setSelect: setSelect,
        setOptions: setOptionsNew,
        tellSelect: tellSelect,
        tellScaled: tellScaled,
        setClass: setClass,
        disable: disableCrop,
        enable: enableCrop,
        cancel: cancelCrop,
        release: Selection.release,
        destroy: destroy,
        focus: KeyManager.watchKeys,
        getBounds: function getBounds() {
          return [boundx * xscale, boundy * yscale];
        },
        getWidgetSize: function getWidgetSize() {
          return [boundx, boundy];
        },
        getScaleFactor: function getScaleFactor() {
          return [xscale, yscale];
        },
        getOptions: function getOptions() {
          // careful: internal values are returned
          return options;
        },
        ui: {
          holder: $div,
          selection: $sel
        }
      };
      $origimg.data('Jcrop', api);
      return api;
    };

    $.fn.Jcrop = function (options, callback) //{{{
    {
      var api; // Iterate over each object, attach Jcrop

      this.each(function () {
        // If we've already attached to this object
        if ($(this).data('Jcrop')) {
          // The API can be requested this way (undocumented)
          if (options === 'api') return $(this).data('Jcrop'); // Otherwise, we just reset the options...
          else $(this).data('Jcrop').setOptions(options);
        } // If we haven't been attached, preload and attach
        else {
          if (this.tagName == 'IMG') $.Jcrop.Loader(this, function () {
            $(this).css({
              display: 'block',
              visibility: 'hidden'
            });
            api = $.Jcrop(this, options);
            if ($.isFunction(callback)) callback.call(api);
          });else {
            $(this).css({
              display: 'block',
              visibility: 'hidden'
            });
            api = $.Jcrop(this, options);
            if ($.isFunction(callback)) callback.call(api);
          }
        }
      }); // Return "this" so the object is chainable (jQuery-style)

      return this;
    }; //}}}
    // $.Jcrop.Loader - basic image loader {{{


    $.Jcrop.Loader = function (imgobj, success, error) {
      var $img = $(imgobj),
          img = $img[0];

      function completeCheck() {
        if (img.complete) {
          $img.off('.jcloader');
          if ($.isFunction(success)) success.call(img);
        } else window.setTimeout(completeCheck, 50);
      }

      $img.on('load.jcloader', completeCheck).on('error.jcloader', function (e) {
        $img.off('.jcloader');
        if ($.isFunction(error)) error.call(img);
      });

      if (img.complete && $.isFunction(success)) {
        $img.off('.jcloader');
        success.call(img);
      }
    }; //}}}
    // Global Defaults {{{


    $.Jcrop.defaults = {
      // Basic Settings
      allowMove: true,
      allowResize: true,
      trackDocument: true,
      // Styling Options
      baseClass: 'jcrop',
      addClass: null,
      bgColor: 'black',
      bgOpacity: 0.6,
      bgFade: false,
      aspectRatio: 0,
      keySupport: true,
      createHandles: ['n', 's', 'e', 'w', 'nw', 'ne', 'se', 'sw'],
      createBorders: ['n', 's', 'e', 'w'],
      drawBorders: true,
      dragEdges: true,
      fixedSupport: true,
      touchSupport: null,
      shade: null,
      boxWidth: 0,
      boxHeight: 0,
      boundary: 2,
      fadeTime: 400,
      animationDelay: 20,
      swingSpeed: 3,
      maxSize: [0, 0],
      minSize: [0, 0],
      // Callbacks / Event Handlers
      onChange: function onChange() {},
      onSelect: function onSelect() {},
      onDblClick: function onDblClick() {},
      onRelease: function onRelease() {}
    }; // }}}
  }($__default['default']);
  var cropModifierRegExp = /-\/crop\/([0-9]+)x([0-9]+)(\/(center|([0-9]+),([0-9]+)))?\//i;

  var CropWidget = /*#__PURE__*/function () {
    function CropWidget(element, originalSize) {
      var crop = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      _classCallCheck(this, CropWidget);

      this.element = element;
      this.originalSize = originalSize;
      this.__api = $__default['default'].Jcrop(this.element[0], {
        trueSize: this.originalSize,
        baseClass: 'uploadcare--jcrop',
        addClass: 'uploadcare--crop-widget',
        createHandles: ['nw', 'ne', 'se', 'sw'],
        bgColor: 'transparent',
        bgOpacity: 0.8
      });
      this.setCrop(crop);
      this.setSelection();
    } //   downscale:
    // If set to `true` "-/resize/%preferedSize%/" will be added
    // if selected area bigger than `preferedSize`. Default false.
    //   upscale:
    // If set to `true` "-/resize/%preferedSize%/" will be added
    // if selected area smaller than `preferedSize`. Default false.
    //   notLess:
    // Restrict selection to preferedSize area. Default false.
    //   preferedSize:
    // Defines image size you want to get at the end.
    // If `downscale` option is set to `false`, it defines only
    // the prefered aspect ratio.
    // If set to `null` any aspect ratio will be acceptable.
    // Array: [123, 123]. (optional)


    _createClass(CropWidget, [{
      key: "setCrop",
      value: function setCrop(crop) {
        this.crop = crop;
        return this.__api.setOptions({
          aspectRatio: crop.preferedSize ? crop.preferedSize[0] / crop.preferedSize[1] : 0,
          minSize: crop.notLess ? fitSize(crop.preferedSize, this.originalSize) : [0, 0]
        });
      }
    }, {
      key: "setSelection",
      value: function setSelection(selection) {
        var center, left, size, top;

        if (selection) {
          center = selection.center;
          size = [selection.width, selection.height];
        } else {
          center = true;
          size = this.originalSize;
        }

        if (this.crop.preferedSize) {
          size = fitSize(this.crop.preferedSize, size, true);
        }

        if (center) {
          left = (this.originalSize[0] - size[0]) / 2;
          top = (this.originalSize[1] - size[1]) / 2;
        } else {
          left = selection.left || 0;
          top = selection.top || 0;
        }

        return this.__api.setSelect([left, top, size[0] + left, size[1] + top]);
      }
    }, {
      key: "__parseModifiers",
      value: function __parseModifiers(modifiers) {
        var raw = modifiers != null ? modifiers.match(cropModifierRegExp) : undefined;

        if (raw) {
          return {
            width: parseInt(raw[1], 10),
            height: parseInt(raw[2], 10),
            center: raw[4] === 'center',
            left: parseInt(raw[5], 10) || undefined,
            top: parseInt(raw[6], 10) || undefined
          };
        }
      }
    }, {
      key: "setSelectionFromModifiers",
      value: function setSelectionFromModifiers(modifiers) {
        return this.setSelection(this.__parseModifiers(modifiers));
      }
    }, {
      key: "getSelection",
      value: function getSelection() {
        var coords, left, top;
        coords = this.__api.tellSelect();
        left = Math.round(Math.max(0, coords.x));
        top = Math.round(Math.max(0, coords.y));
        return {
          left: left,
          top: top,
          width: Math.round(Math.min(this.originalSize[0], coords.x2)) - left,
          height: Math.round(Math.min(this.originalSize[1], coords.y2)) - top
        };
      }
    }, {
      key: "applySelectionToFile",
      value: function applySelectionToFile(file) {
        var _this = this;

        return file.then(function (info) {
          return applyCropCoordsToInfo(info, _this.crop, _this.originalSize, _this.getSelection());
        });
      }
    }]);

    return CropWidget;
  }();

  var BasePreviewTab = /*#__PURE__*/function () {
    function BasePreviewTab(container, tabButton, dialogApi, settings, name) {
      var _this = this;

      _classCallCheck(this, BasePreviewTab);

      var notDisabled;
      this.container = container;
      this.tabButton = tabButton;
      this.dialogApi = dialogApi;
      this.settings = settings;
      this.name = name;

      this.__initTabButtonCircle();

      this.container.addClass('uploadcare--preview');
      notDisabled = ':not(:disabled)';
      this.container.on('click', '.uploadcare--preview__back' + notDisabled, function () {
        return _this.dialogApi.fileColl.clear();
      });
      this.container.on('click', '.uploadcare--preview__done' + notDisabled, this.dialogApi.resolve);
    }

    _createClass(BasePreviewTab, [{
      key: "__initTabButtonCircle",
      value: function __initTabButtonCircle() {
        var _this2 = this;

        var circle, circleDf, circleEl, update;
        circleEl = this.tabButton.find('.uploadcare--panel__icon');
        circleDf = $__default['default'].Deferred();

        update = function update() {
          var i, infos, len, progress, progressInfo;
          infos = _this2.dialogApi.fileColl.lastProgresses();
          progress = 0;

          for (i = 0, len = infos.length; i < len; i++) {
            progressInfo = infos[i];
            progress += ((progressInfo != null ? progressInfo.progress : undefined) || 0) / infos.length;
          }

          return circleDf.notify(progress);
        };

        this.dialogApi.fileColl.onAnyProgress(update);
        this.dialogApi.fileColl.onAdd.add(update);
        this.dialogApi.fileColl.onRemove.add(update);
        update();
        circle = new Circle(circleEl).listen(circleDf.promise());
        return this.dialogApi.progress(function () {
          var _circle;

          return (_circle = circle).update.apply(_circle, arguments);
        });
      }
    }]);

    return BasePreviewTab;
  }();

  var PreviewTab = /*#__PURE__*/function (_BasePreviewTab) {
    _inherits(PreviewTab, _BasePreviewTab);

    var _super = _createSuper(PreviewTab);

    function PreviewTab(container, tabButton, dialogApi, settings, name) {
      var _this;

      _classCallCheck(this, PreviewTab);

      _this = _super.apply(this, arguments); // error
      // unknown
      // image
      // video
      // regular

      _this.container = container;
      _this.tabButton = tabButton;
      _this.dialogApi = dialogApi;
      _this.settings = settings;
      _this.name = name;
      $__default['default'].each(_this.dialogApi.fileColl.get(), function (i, file) {
        return _this.__setFile(file);
      });

      _this.dialogApi.fileColl.onAdd.add(_this.__setFile.bind(_assertThisInitialized(_this)));

      _this.widget = null;
      _this.__state = null;
      return _this;
    }

    _createClass(PreviewTab, [{
      key: "__setFile",
      value: function __setFile(file) {
        var _this2 = this;

        var ifCur, tryToLoadImagePreview, tryToLoadVideoPreview;
        this.file = file;

        ifCur = function ifCur(fn) {
          return function () {
            if (file === _this2.file) {
              for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
              }

              return fn.apply(null, args);
            }
          };
        };

        tryToLoadImagePreview = once(this.__tryToLoadImagePreview.bind(this));
        tryToLoadVideoPreview = once(this.__tryToLoadVideoPreview.bind(this));

        this.__setState('unknown', {});

        this.file.progress(ifCur(function (info) {
          var blob, label, source;
          info = info.incompleteFileInfo;
          label = (info.name || '') + readableFileSize(info.size, '', ', ');

          _this2.container.find('.uploadcare--preview__file-name').text(label);

          source = info.sourceInfo;
          blob = Blob;

          if (source.file && blob && source.file instanceof blob) {
            if (source.file.type && source.file.type.search(/^image\//i) !== -1) {
              return tryToLoadImagePreview(file, source.file);
            } else if (source.file.type && source.file.type.search(/^video\//i) !== -1) {
              return tryToLoadVideoPreview(file, source.file);
            } else {
              return tryToLoadImagePreview(file, source.file).fail(function () {
                return tryToLoadVideoPreview(file, source.file);
              });
            }
          }
        }));
        this.file.done(ifCur(function (info) {
          var imgInfo, src;

          if (_this2.__state === 'video') {
            return;
          }

          if (info.isImage) {
            // avoid subsequent image states
            if (_this2.__state !== 'image') {
              src = info.originalUrl; // 1162x684 is 1.5 size of conteiner

              src += '-/preview/1162x693/-/setfill/ffffff/-/format/jpeg/-/progressive/yes/';

              if (_this2.settings.previewUrlCallback) {
                src = _this2.settings.previewUrlCallback(src, info);
              }

              imgInfo = info.originalImageInfo;

              _this2.__setState('image', {
                src: src,
                name: info.name,
                info: info
              });

              return _this2.initImage([imgInfo.width, imgInfo.height], info.cdnUrlModifiers);
            }
          } else {
            // , but update if other
            return _this2.__setState('regular', {
              file: info
            });
          }
        }));
        return this.file.fail(ifCur(function (errorType, info, error) {
          return _this2.__setState('error', {
            errorType: errorType,
            error: error,
            file: info
          });
        }));
      }
    }, {
      key: "__tryToLoadImagePreview",
      value: function __tryToLoadImagePreview(file, blob) {
        var _this3 = this;

        var df;
        df = $__default['default'].Deferred();

        if (file.state() !== 'pending' || !blob.size || blob.size >= this.settings.multipartMinSize) {
          return df.reject().promise();
        }

        drawFileToCanvas(blob, 1550, 924, '#ffffff', this.settings.imagePreviewMaxSize).done(function (canvas, size) {
          return canvasToBlob(canvas, 'image/jpeg', 0.95, function (blob) {
            var src;
            df.resolve();
            canvas.width = canvas.height = 1;

            if (file.state() !== 'pending' || _this3.dialogApi.state() !== 'pending' || _this3.file !== file) {
              return;
            }

            src = URL.createObjectURL(blob);

            _this3.dialogApi.always(function () {
              return URL.revokeObjectURL(src);
            });

            if (_this3.__state !== 'image') {
              _this3.__setState('image', {
                src: src,
                name: ''
              });

              return _this3.initImage(size);
            }
          });
        }).fail(df.reject);
        return df.promise();
      }
    }, {
      key: "__tryToLoadVideoPreview",
      value: function __tryToLoadVideoPreview(file, blob) {
        var _this4 = this;

        var df, op, src;
        df = $__default['default'].Deferred();

        if (!URL || !blob.size) {
          return df.reject().promise();
        }

        src = URL.createObjectURL(blob);
        op = videoLoader(src);
        op.fail(function () {
          URL.revokeObjectURL(src);
          return df.reject();
        }).done(function () {
          if (file.state() !== 'pending' || _this4.dialogApi.state() !== 'pending' || _this4.file !== file) {
            URL.revokeObjectURL(src);
            return;
          }

          _this4.dialogApi.always(function () {
            return URL.revokeObjectURL(src);
          });

          df.resolve();

          _this4.__setState('video');

          var videoTag = _this4.container.find('.uploadcare--preview__video'); // hack to enable seeking due to bug in MediaRecorder API
          // https://bugs.chromium.org/p/chromium/issues/detail?id=569840


          videoTag.on('loadeddata', function () {
            var el;
            el = videoTag.get(0);
            el.currentTime = 360000; // 100 hours

            return videoTag.off('loadeddata');
          });
          videoTag.on('ended', function () {
            var el;
            el = videoTag.get(0);
            el.currentTime = 0;
            return videoTag.off('ended');
          }); // end of hack

          videoTag.attr('src', src); // hack to load first-frame poster on ios safari

          return videoTag.get(0).load();
        });
        return df.promise();
      }
    }, {
      key: "__setState",
      value: function __setState(state, data) {
        this.__state = state;
        data = data || {};
        data.crop = this.settings.crop;
        this.container.empty().append(tpl("tab-preview-".concat(state), _objectSpread2(_objectSpread2({}, data), {}, {
          debugUploads: this.settings.debugUploads
        })));
        this.container.removeClass(function (index, classes) {
          return classes.split(' ').filter(function (c) {
            return !!~c.indexOf('uploadcare--preview_status_');
          }).join(' ');
        });

        if (state === 'unknown' && this.settings.crop) {
          this.container.find('.uploadcare--preview__done').hide();
        }

        if (state === 'error') {
          this.container.addClass('uploadcare--preview_status_error-' + data.errorType);
        }

        this.container.find('.uploadcare--preview__done').focus();
      }
    }, {
      key: "initImage",
      value: function initImage(imgSize, cdnModifiers) {
        var _this5 = this;

        var done, img, imgLoader, startCrop;
        img = this.container.find('.uploadcare--preview__image');
        done = this.container.find('.uploadcare--preview__done');
        imgLoader = imageLoader(img[0]).done(function () {
          return _this5.container.addClass('uploadcare--preview_status_loaded');
        }).fail(function () {
          _this5.file = null;
          return _this5.__setState('error', {
            error: 'loadImage'
          });
        });

        startCrop = function startCrop() {
          _this5.container.find('.uploadcare--crop-sizes__item').attr('aria-disabled', false).attr('tabindex', 0);

          done.attr('disabled', false).attr('aria-disabled', false);
          _this5.widget = new CropWidget(img, imgSize, _this5.settings.crop[0]);

          if (cdnModifiers) {
            _this5.widget.setSelectionFromModifiers(cdnModifiers);
          }

          return done.on('click', function () {
            var newFile;
            newFile = _this5.widget.applySelectionToFile(_this5.file);

            _this5.dialogApi.fileColl.replace(_this5.file, newFile);

            return true;
          });
        };

        if (this.settings.crop) {
          this.container.find('.uploadcare--preview__title').text(locale.t('dialog.tabs.preview.crop.title'));
          this.container.find('.uploadcare--preview__content').addClass('uploadcare--preview__content_crop');
          done.attr('disabled', true).attr('aria-disabled', true);
          done.text(locale.t('dialog.tabs.preview.crop.done'));
          this.populateCropSizes();
          this.container.find('.uploadcare--crop-sizes__item').attr('aria-disabled', true).attr('tabindex', -1);
          return imgLoader.done(function () {
            // Often IE 11 doesn't do reflow after image.onLoad
            // and actual image remains 28x30 (broken image placeholder).
            // Looks like defer always fixes it.
            return defer(startCrop);
          });
        }
      }
    }, {
      key: "populateCropSizes",
      value: function populateCropSizes() {
        var _this6 = this;

        var control, currentClass, template;
        control = this.container.find('.uploadcare--crop-sizes');
        template = control.children();
        currentClass = 'uploadcare--crop-sizes__item_current';
        $__default['default'].each(this.settings.crop, function (i, crop) {
          var caption, gcd$1, icon, item, prefered, size;
          prefered = crop.preferedSize;

          if (prefered) {
            gcd$1 = gcd(prefered[0], prefered[1]);
            caption = "".concat(prefered[0] / gcd$1, ":").concat(prefered[1] / gcd$1);
          } else {
            caption = locale.t('dialog.tabs.preview.crop.free');
          }

          item = template.clone().appendTo(control).attr('data-caption', caption).on('click', function (e) {
            if ($__default['default'](e.currentTarget).attr('aria-disabled') === 'true') {
              return;
            }

            if (!$__default['default'](e.currentTarget).hasClass(currentClass) && _this6.settings.crop.length > 1 && _this6.widget) {
              _this6.widget.setCrop(crop);

              control.find('>*').removeClass(currentClass);
              item.addClass(currentClass);
            }
          });

          if (prefered) {
            size = fitSize(prefered, [30, 30], true);
            return item.children().css({
              width: Math.max(20, size[0]),
              height: Math.max(12, size[1])
            });
          } else {
            icon = $__default['default']("<svg width='32' height='32'><use xlink:href='#uploadcare--icon-crop-free'/></svg>").attr('role', 'presentation').attr('class', 'uploadcare--icon');
            return item.children().append(icon).addClass('uploadcare--crop-sizes__icon_free');
          }
        });
        template.remove();
        return control.find('>*').eq(0).addClass(currentClass);
      }
    }, {
      key: "displayed",
      value: function displayed() {
        this.dialogApi.takeFocus() && this.container.find('.uploadcare--preview__done').focus();
      }
    }]);

    return PreviewTab;
  }(BasePreviewTab);

  isWindowDefined() && function ($) {
    function nearestFinder(targets) {
      this.targets = targets;
      this.last = null;
      this.update();
    }

    nearestFinder.prototype = {
      update: function update() {
        var rows = {};
        this.targets.each(function (i) {
          var offset = $(this).offset();

          if (!(offset.top in rows)) {
            rows[offset.top] = [];
          }

          rows[offset.top].push([offset.left + this.offsetWidth / 2, this]);
        });
        this.rows = rows;
      },
      find: function find(x, y) {
        var minDistance = Infinity;
        var rows = this.rows;
        var nearestRow, top, nearest;

        for (top in rows) {
          var distance = Math.abs(top - y);

          if (distance < minDistance) {
            minDistance = distance;
            nearestRow = rows[top];
          }
        }

        minDistance = Math.abs(nearestRow[0][0] - x);
        nearest = nearestRow[0][1];

        for (var i = 1; i < nearestRow.length; i++) {
          var distance = Math.abs(nearestRow[i][0] - x);

          if (distance < minDistance) {
            minDistance = distance;
            nearest = nearestRow[i][1];
          }
        }

        return nearest;
      },
      findNotLast: function findNotLast(x, y) {
        var nearest = this.find(x, y);

        if (this.last && nearest && this.last == nearest) {
          return null;
        }

        return this.last = nearest;
      }
    };
    var movableName = 'uploadcareMovable';
    var sortableName = 'uploadcareSortable';
    var extend = {};

    extend[movableName] = function (o) {
      o = $.extend({
        distance: 4,
        anyButton: false,
        axis: false,
        zIndex: 1000,
        start: $.noop,
        move: $.noop,
        finish: $.noop,
        items: null,
        keepFake: false,
        touch: true
      }, o);

      function fixTouch(e) {
        if (!o.touch) {
          return;
        }

        var touch, s;
        s = e.originalEvent.touches;

        if (s && s.length) {
          touch = s[0];
        } else {
          s = e.originalEvent.changedTouches;

          if (s && s.length) {
            touch = s[0];
          } else {
            return;
          }
        }

        e.pageX = touch.pageX;
        e.pageY = touch.pageY;
        e.which = 1;
      }

      var events = 'mousedown.{} touchstart.{}'.replace(/\{}/g, movableName);
      this.on(events, o.items, null, function (eDown) {
        fixTouch(eDown);

        if (!o.anyButton && eDown.which != 1) {
          return;
        }

        eDown.preventDefault();
        var dragged = false;
        var $dragged = $(this);
        var $fake = false;
        var originalPos = $dragged.position(); // offset parent

        originalPos.top += $dragged.offsetParent().scrollTop();
        originalPos.left += $dragged.offsetParent().scrollLeft();
        var events = 'mousemove.{} touchmove.{}'.replace(/\{}/g, movableName);
        $(document).on(events, function (eMove) {
          fixTouch(eMove);

          if (!dragged && (Math.abs(eMove.pageX - eDown.pageX) > o.distance || Math.abs(eMove.pageY - eDown.pageY) > o.distance)) {
            dragged = true;
            $fake = $dragged.clone().css({
              position: 'absolute',
              zIndex: o.zIndex,
              width: $dragged.width()
            }).appendTo($dragged.offsetParent());
            o.start({
              event: eMove,
              dragged: $dragged,
              fake: $fake
            });
          }

          if (!dragged) {
            return;
          }

          eMove.preventDefault();
          var dx = o.axis == 'y' ? 0 : eMove.pageX - eDown.pageX;
          var dy = o.axis == 'x' ? 0 : eMove.pageY - eDown.pageY;
          $fake.css({
            left: dx + originalPos.left,
            top: dy + originalPos.top
          });
          o.move({
            event: eMove,
            dragged: $dragged,
            fake: $fake,
            dx: dx,
            dy: dy
          });
        });
        var events = 'mouseup.{} touchend.{} touchcancel.{} touchleave.{}';
        $(document).on(events.replace(/\{}/g, movableName), function (eUp) {
          fixTouch(eUp);
          var events = 'mousemove.{} touchmove.{} mouseup.{} touchend.{} touchcancel.{} touchleave.{}';
          $(document).off(events.replace(/\{}/g, movableName));

          if (!dragged) {
            return;
          }

          eUp.preventDefault();
          var dx = eUp.pageX - eDown.pageX;
          var dy = eUp.pageY - eDown.pageY;
          dragged = false;
          o.finish({
            event: eUp,
            dragged: $dragged,
            fake: $fake,
            dx: dx,
            dy: dy
          });

          if (!o.keepFake) {
            $fake.remove();
          }
        });
      });
    };

    extend[sortableName] = function (o) {
      var oMovable = $.extend({
        items: '>*'
      }, o);
      var o = $.extend({
        checkBounds: function checkBounds() {
          return true;
        },
        start: $.noop,
        attach: $.noop,
        move: $.noop,
        finish: $.noop
      }, o);
      var finder;
      var initialNext = false;
      var parent = this;

      oMovable.start = function (info) {
        o.start(info);
        finder = new nearestFinder(parent.find(oMovable.items).not(info.fake));
        initialNext = info.dragged.next();
      };

      oMovable.move = function (info) {
        info.nearest = null;

        if (o.checkBounds(info)) {
          var offset = info.fake.offset();
          var nearest = finder.findNotLast(offset.left + info.dragged.width() / 2, offset.top);
          info.nearest = $(nearest);

          if (nearest && nearest != info.dragged[0]) {
            if (info.dragged.nextAll().filter(nearest).length > 0) {
              info.dragged.insertAfter(nearest);
            } else {
              info.dragged.insertBefore(nearest);
            }

            o.attach(info);
            finder.last = null;
            finder.update();
          }
        } else if (finder.last !== null) {
          finder.last = null;

          if (initialNext.length) {
            info.dragged.insertBefore(initialNext);
          } else {
            info.dragged.parent().append(info.dragged);
          }

          o.attach(info);
          finder.update();
        }

        o.move(info);
      };

      oMovable.finish = function (info) {
        var offset = info.fake.offset();
        info.nearest = null;

        if (o.checkBounds(info)) {
          info.nearest = $(finder.find(offset.left + info.dragged.width() / 2, offset.top));
        }

        o.finish(info);
        finder = null;
      };

      return this[movableName](oMovable);
    };

    $.fn.extend(extend);
  }($__default['default']);

  var PreviewTabMultiple = /*#__PURE__*/function (_BasePreviewTab) {
    _inherits(PreviewTabMultiple, _BasePreviewTab);

    var _super = _createSuper(PreviewTabMultiple);

    function PreviewTabMultiple() {
      var _this;

      _classCallCheck(this, PreviewTabMultiple);

      _this = _super.apply(this, arguments);

      _this.container.append(tpl('tab-preview-multiple'));

      _this.__fileTpl = $__default['default'](tpl('tab-preview-multiple-file'));
      _this.fileListEl = _this.container.find('.uploadcare--files');
      _this.doneBtnEl = _this.container.find('.uploadcare--preview__done');
      $__default['default'].each(_this.dialogApi.fileColl.get(), function (i, file) {
        return _this.__fileAdded(file);
      });

      _this.__updateContainerView();

      _this.dialogApi.fileColl.onAdd.add(_this.__fileAdded.bind(_assertThisInitialized(_this)), function () {
        return _this.__updateContainerView();
      });

      _this.dialogApi.fileColl.onRemove.add(_this.__fileRemoved.bind(_assertThisInitialized(_this)), function () {
        return _this.__updateContainerView();
      });

      _this.dialogApi.fileColl.onReplace.add(_this.__fileReplaced.bind(_assertThisInitialized(_this)), function () {
        return _this.__updateContainerView();
      });

      _this.dialogApi.fileColl.onAnyProgress(_this.__fileProgress.bind(_assertThisInitialized(_this)));

      _this.dialogApi.fileColl.onAnyDone(_this.__fileDone.bind(_assertThisInitialized(_this)));

      _this.dialogApi.fileColl.onAnyFail(_this.__fileFailed.bind(_assertThisInitialized(_this)));

      _this.fileListEl.addClass(_this.settings.imagesOnly ? 'uploadcare--files_type_tiles' : 'uploadcare--files_type_table');

      _this.__setupSorting();

      return _this;
    }

    _createClass(PreviewTabMultiple, [{
      key: "__setupSorting",
      value: function __setupSorting() {
        var _this2 = this;

        return this.fileListEl.uploadcareSortable({
          touch: false,
          axis: this.settings.imagesOnly ? 'xy' : 'y',
          start: function start(info) {
            return info.dragged.css('visibility', 'hidden');
          },
          finish: function finish(info) {
            var elements, index;
            info.dragged.css('visibility', 'visible');
            elements = _this2.container.find('.uploadcare--file');

            index = function index(file) {
              return elements.index(_this2.__fileToEl(file));
            };

            return _this2.dialogApi.fileColl.sort(function (a, b) {
              return index(a) - index(b);
            });
          }
        });
      }
    }, {
      key: "__updateContainerView",
      value: function __updateContainerView() {
        var errorContainer, files, hasWrongNumberFiles, title, tooFewFiles, tooManyFiles, wrongNumberFilesMessage;
        files = this.dialogApi.fileColl.length();
        tooManyFiles = files > this.settings.multipleMax;
        tooFewFiles = files < this.settings.multipleMin;
        hasWrongNumberFiles = tooManyFiles || tooFewFiles;
        this.doneBtnEl.attr('disabled', hasWrongNumberFiles).attr('aria-disabled', hasWrongNumberFiles);
        title = locale.t('dialog.tabs.preview.multiple.question').replace('%files%', locale.t('file', files));
        this.container.find('.uploadcare--preview__title').text(title);
        errorContainer = this.container.find('.uploadcare--preview__message');
        errorContainer.empty();

        if (hasWrongNumberFiles) {
          wrongNumberFilesMessage = tooManyFiles ? locale.t('dialog.tabs.preview.multiple.tooManyFiles').replace('%max%', this.settings.multipleMax) : files && tooFewFiles ? locale.t('dialog.tabs.preview.multiple.tooFewFiles').replace('%min%', this.settings.multipleMin).replace('%files%', locale.t('file', files)) : undefined;
          return errorContainer.addClass('uploadcare--error').text(wrongNumberFilesMessage);
        }
      }
    }, {
      key: "__updateFileInfo",
      value: function __updateFileInfo(fileEl, info) {
        var filename;
        filename = info.name || locale.t('dialog.tabs.preview.unknownName');
        fileEl.find('.uploadcare--file__name').text(filename);
        fileEl.find('.uploadcare--file__description').attr('aria-label', locale.t('dialog.tabs.preview.multiple.file.preview').replace('%file%', filename));
        fileEl.find('.uploadcare--file__remove').attr('title', locale.t('dialog.tabs.preview.multiple.file.remove').replace('%file%', filename)).attr('aria-label', locale.t('dialog.tabs.preview.multiple.file.remove').replace('%file%', filename));
        return fileEl.find('.uploadcare--file__size').text(readableFileSize(info.size, '–'));
      }
    }, {
      key: "__fileProgress",
      value: function __fileProgress(file, progressInfo) {
        var fileEl;
        fileEl = this.__fileToEl(file);
        fileEl.find('.uploadcare--progressbar__value').css('width', Math.round(progressInfo.progress * 100) + '%');
        return this.__updateFileInfo(fileEl, progressInfo.incompleteFileInfo);
      }
    }, {
      key: "__fileDone",
      value: function __fileDone(file, info) {
        var _this3 = this;

        var cdnURL, fileEl, filePreview, filename;
        fileEl = this.__fileToEl(file).removeClass('uploadcare--file_status_uploading').addClass('uploadcare--file_status_uploaded');
        fileEl.find('.uploadcare--progressbar__value').css('width', '100%');

        this.__updateFileInfo(fileEl, info);

        if (info.isImage) {
          cdnURL = "".concat(info.cdnUrl, "-/quality/lightest/-/preview/108x108/");

          if (this.settings.previewUrlCallback) {
            cdnURL = this.settings.previewUrlCallback(cdnURL, info);
          }

          filename = fileEl.find('.uploadcare--file__name').text();
          filePreview = $__default['default']('<img>').attr('src', cdnURL).attr('alt', filename).addClass('uploadcare--file__icon');
        } else {
          filePreview = $__default['default']("<svg width='32' height='32'><use xlink:href='#uploadcare--icon-file'/></svg>").attr('role', 'presentation').attr('class', 'uploadcare--icon uploadcare--file__icon');
        }

        fileEl.find('.uploadcare--file__preview').html(filePreview);
        return fileEl.find('.uploadcare--file__description').on('click', function () {
          return openPreviewDialog(file, _this3.settings).done(function (newFile) {
            return _this3.dialogApi.fileColl.replace(file, newFile);
          });
        });
      }
    }, {
      key: "__fileFailed",
      value: function __fileFailed(file, errorType, info, error) {
        var text = this.settings.debugUploads && (error === null || error === void 0 ? void 0 : error.message) || locale.t("serverErrors.".concat(error === null || error === void 0 ? void 0 : error.code)) || (error === null || error === void 0 ? void 0 : error.message) || locale.t("errors.".concat(errorType));

        var fileEl = this.__fileToEl(file).removeClass('uploadcare--file_status_uploading').addClass('uploadcare--file_status_error');

        fileEl.find('.uploadcare--file__error').text(text);
        var filePreview = $__default['default']("<svg width='32' height='32'><use xlink:href='#uploadcare--icon-error'/></svg>").attr('role', 'presentation').attr('class', 'uploadcare--icon uploadcare--file__icon');
        return fileEl.find('.uploadcare--file__preview').html(filePreview);
      }
    }, {
      key: "__fileAdded",
      value: function __fileAdded(file) {
        var fileEl;
        fileEl = this.__createFileEl(file);
        return fileEl.appendTo(this.fileListEl);
      }
    }, {
      key: "__fileRemoved",
      value: function __fileRemoved(file) {
        this.__fileToEl(file).remove();

        return $__default['default'](file).removeData();
      }
    }, {
      key: "__fileReplaced",
      value: function __fileReplaced(oldFile, newFile) {
        var fileEl;
        fileEl = this.__createFileEl(newFile);
        fileEl.insertAfter(this.__fileToEl(oldFile));
        return this.__fileRemoved(oldFile);
      }
    }, {
      key: "__fileToEl",
      value: function __fileToEl(file) {
        // File can be removed before.
        return $__default['default'](file).data('dpm-el') || $__default['default']();
      }
    }, {
      key: "__createFileEl",
      value: function __createFileEl(file) {
        var _this4 = this;

        var fileEl;
        fileEl = this.__fileTpl.clone().on('click', '.uploadcare--file__remove', function () {
          return _this4.dialogApi.fileColl.remove(file);
        });
        $__default['default'](file).data('dpm-el', fileEl);
        return fileEl;
      }
    }, {
      key: "displayed",
      value: function displayed() {
        this.container.find('.uploadcare--preview__done').focus();
      }
    }]);

    return PreviewTabMultiple;
  }(BasePreviewTab);

  var lockDialogFocus = function lockDialogFocus(e) {
    if (!e.shiftKey && focusableElements.last().is(e.target)) {
      e.preventDefault();
      return focusableElements.first().focus();
    } else if (e.shiftKey && focusableElements.first().is(e.target)) {
      e.preventDefault();
      return focusableElements.last().focus();
    }
  };

  var lockScroll = function lockScroll(el, toTop) {
    var left, top;
    top = el.scrollTop();
    left = el.scrollLeft();

    if (toTop) {
      el.scrollTop(0).scrollLeft(0);
    }

    return function () {
      return el.scrollTop(top).scrollLeft(left);
    };
  };

  isWindowDefined() && $__default['default'](window).on('keydown', function (e) {
    if (isDialogOpened()) {
      if (e.which === 27) {
        // Escape
        e.stopImmediatePropagation(); // close only topmost dialog

        if (typeof currentDialogPr !== 'undefined' && currentDialogPr !== null) {
          currentDialogPr.reject();
        }
      }

      if (e.which === 9) {
        // Tab
        return lockDialogFocus(e);
      }
    }
  });
  var currentDialogPr = null;
  var openedClass = 'uploadcare--page';
  var originalFocusedElement = null;
  var focusableElements = null;

  var isDialogOpened = function isDialogOpened() {
    return currentDialogPr !== null;
  };

  var closeDialog = function closeDialog() {
    if (currentDialogPr) {
      currentDialogPr.reject();
      currentDialogPr = null;
    }
  };

  var openDialog = function openDialog(files, tab, settings) {
    var cancelLock, dialog, dialogPr;
    closeDialog();
    originalFocusedElement = document.activeElement;
    dialog = $__default['default'](tpl('dialog')).appendTo('body');
    dialogPr = openPanel(dialog.find('.uploadcare--dialog__placeholder'), files, tab, settings, {
      inModal: true
    });
    dialog.find('.uploadcare--panel').addClass('uploadcare--dialog__panel');
    dialog.addClass('uploadcare--dialog_status_active');
    dialogPr.dialogElement = dialog;
    focusableElements = dialog.find('select, input, textarea, button, a[href]');
    focusableElements.first().focus();
    cancelLock = lockScroll($__default['default'](window), dialog.css('position') === 'absolute');
    $__default['default']('html, body').addClass(openedClass);
    dialog.find('.uploadcare--dialog__close').on('click', dialogPr.reject);
    dialog.on('dblclick', function (e) {
      var showStoppers; // handler can be called after element detached (close button)

      if (!$__default['default'].contains(document.documentElement, e.target)) {
        return;
      }

      showStoppers = '.uploadcare--dialog__panel, .uploadcare--dialog__powered-by';

      if ($__default['default'](e.target).is(showStoppers) || $__default['default'](e.target).parents(showStoppers).length) {
        return;
      }

      return dialogPr.reject();
    });
    currentDialogPr = dialogPr.always(function () {
      $__default['default']('html, body').removeClass(openedClass);
      currentDialogPr = null;
      dialog.remove();
      cancelLock();
      return originalFocusedElement.focus();
    });
    return currentDialogPr;
  };

  var openPreviewDialog = function openPreviewDialog(file, settings) {
    var dialog, oldDialogPr; // hide current opened dialog and open new one

    oldDialogPr = currentDialogPr;
    currentDialogPr = null;
    settings = $__default['default'].extend({}, settings, {
      multiple: false,
      tabs: ''
    });
    dialog = openDialog(file, 'preview', settings);

    if (oldDialogPr != null) {
      oldDialogPr.dialogElement.addClass('uploadcare--dialog_status_inactive');
    }

    dialog.always(function () {
      currentDialogPr = oldDialogPr;

      if (oldDialogPr != null) {
        // still opened
        $__default['default']('html, body').addClass(openedClass);
        return oldDialogPr.dialogElement.removeClass('uploadcare--dialog_status_inactive');
      }
    });
    dialog.onTabVisibility(function (tab, shown) {
      if (tab === 'preview' && !shown) {
        return dialog.reject();
      }
    });
    return dialog;
  }; // files - null, or File object, or array of File objects, or FileGroup object
  // result - File objects or FileGroup object (depends on settings.multiple)


  var openPanel = function openPanel(placeholder, files, tab, settings) {
    var opt = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {
      inModal: false
    };
    var filter, panel;

    if ($__default['default'].isPlainObject(tab)) {
      settings = tab;
      tab = null;
    }

    if (!files) {
      files = [];
    } else if (isFileGroup(files)) {
      files = files.files();
    } else if (!$__default['default'].isArray(files)) {
      files = [files];
    }

    settings = build(settings);
    panel = new Panel(settings, placeholder, files, tab, opt).publicPromise();

    filter = function filter(files) {
      if (settings.multiple) {
        return FileGroup(files, settings);
      } else {
        return files[0];
      }
    };

    return then(panel, filter, filter).promise(panel);
  };

  var registeredTabs = {};

  var registerTab = function registerTab(tabName, constructor) {
    registeredTabs[tabName] = constructor;
    return registeredTabs[tabName];
  };

  registerTab('file', FileTab);
  registerTab('url', UrlTab);
  registerTab('camera', CameraTab);
  registerTab('facebook', RemoteTab);
  registerTab('dropbox', RemoteTab);
  registerTab('gdrive', RemoteTab);
  registerTab('gphotos', RemoteTab);
  registerTab('instagram', RemoteTab);
  registerTab('flickr', RemoteTab);
  registerTab('vk', RemoteTab);
  registerTab('evernote', RemoteTab);
  registerTab('box', RemoteTab);
  registerTab('onedrive', RemoteTab);
  registerTab('huddle', RemoteTab);
  registerTab('nft', RemoteTab);
  registerTab('empty-pubkey', function (tabPanel, _1, _2, settings) {
    return tabPanel.append(emptyKeyText);
  });
  registerTab('preview', function (tabPanel, tabButton, dialogApi, settings, name) {
    var tabCls;

    if (!settings.previewStep && dialogApi.fileColl.length() === 0) {
      return;
    }

    tabCls = settings.multiple ? PreviewTabMultiple : PreviewTab; // eslint-disable-next-line new-cap

    return new tabCls(tabPanel, tabButton, dialogApi, settings, name);
  });

  var Panel = /*#__PURE__*/function () {
    function Panel(settings1, placeholder, files, tab, opt) {
      var _this = this;

      _classCallCheck(this, Panel);

      var sel;
      this.inModal = opt.inModal || false; // (fileType, data) or ([fileObject, fileObject])

      this.addFiles = this.addFiles.bind(this);
      this.__resolve = this.__resolve.bind(this);
      this.__reject = this.__reject.bind(this);
      this.__updateFooter = this.__updateFooter.bind(this);
      this.__closePanel = this.__closePanel.bind(this);
      this.switchTab = this.switchTab.bind(this);
      this.showTab = this.showTab.bind(this);
      this.hideTab = this.hideTab.bind(this);
      this.isTabVisible = this.isTabVisible.bind(this);
      this.openMenu = this.openMenu.bind(this);
      this.settings = settings1;
      this.dfd = $__default['default'].Deferred();
      this.dfd.always(this.__closePanel);
      sel = '.uploadcare--panel';
      this.content = $__default['default'](tpl('dialog__panel'));
      this.panel = this.content.find(sel).add(this.content.filter(sel));
      this.placeholder = $__default['default'](placeholder);
      this.placeholder.replaceWith(this.content);
      this.panel.append($__default['default'](tpl('icons')));

      if (this.settings.multiple) {
        this.panel.addClass('uploadcare--panel_multiple');
      }

      this.panel.find('.uploadcare--menu__toggle').on('click', function () {
        return _this.panel.find('.uploadcare--menu').toggleClass('uploadcare--menu_opened');
      }); // files collection

      this.files = new CollectionOfPromises(files);
      this.files.onRemove.add(function () {
        if (_this.files.length() === 0) {
          return _this.hideTab('preview');
        }
      });

      this.__autoCrop(this.files);

      this.tabs = {};

      this.__prepareFooter();

      this.onTabVisibility = $__default['default'].Callbacks().add(function (tab, show) {
        return _this.panel.find(".uploadcare--menu__item_tab_".concat(tab)).toggleClass('uploadcare--menu__item_hidden', !show);
      });

      if (this.settings.publicKey) {
        this.__prepareTabs(tab);
      } else {
        this.__welcome();
      }
    }

    _createClass(Panel, [{
      key: "takeFocus",
      value: function takeFocus() {
        return this.inModal;
      }
    }, {
      key: "publicPromise",
      value: function publicPromise() {
        if (!this.promise) {
          this.promise = this.dfd.promise({
            reject: this.__reject,
            resolve: this.__resolve,
            fileColl: this.files,
            addFiles: this.addFiles,
            switchTab: this.switchTab,
            hideTab: this.hideTab,
            showTab: this.showTab,
            isTabVisible: this.isTabVisible,
            openMenu: this.openMenu,
            takeFocus: this.takeFocus.bind(this),
            onTabVisibility: publicCallbacks(this.onTabVisibility)
          });
        }

        return this.promise;
      }
    }, {
      key: "addFiles",
      value: function addFiles(files, data) {
        var file, i, len;

        if (data) {
          // 'files' is actually file type
          files = filesFrom(files, data, this.settings);
        }

        if (!this.settings.multiple) {
          this.files.clear();
          files = [files[0]];
        }

        for (i = 0, len = files.length; i < len; i++) {
          file = files[i];

          if (this.settings.multipleMaxStrict) {
            if (this.files.length() >= this.settings.multipleMax) {
              file.cancel();
              continue;
            }
          }

          this.files.add(file);
        }

        if (this.settings.previewStep) {
          this.showTab('preview');

          if (!this.settings.multiple) {
            return this.switchTab('preview');
          }
        } else {
          return this.__resolve();
        }
      }
    }, {
      key: "__autoCrop",
      value: function __autoCrop(files) {
        var _this2 = this;

        var crop, i, len, ref;

        if (!this.settings.crop || !this.settings.multiple) {
          return;
        }

        ref = this.settings.crop;

        for (i = 0, len = ref.length; i < len; i++) {
          crop = ref[i]; // if even one of crop option sets allow free crop,
          // we don't need to crop automatically

          if (!crop.preferedSize) {
            return;
          }
        }

        return files.autoThen(function (fileInfo) {
          var info, size; // .cdnUrlModifiers came from already cropped files
          // .crop came from autocrop even if autocrop do not set cdnUrlModifiers

          if (!fileInfo.isImage || fileInfo.cdnUrlModifiers || fileInfo.crop) {
            return fileInfo;
          }

          info = fileInfo.originalImageInfo;
          size = fitSize(_this2.settings.crop[0].preferedSize, [info.width, info.height], true);
          return applyCropCoordsToInfo(fileInfo, _this2.settings.crop[0], [info.width, info.height], {
            width: size[0],
            height: size[1],
            left: Math.round((info.width - size[0]) / 2),
            top: Math.round((info.height - size[1]) / 2)
          });
        });
      }
    }, {
      key: "__resolve",
      value: function __resolve() {
        return this.dfd.resolve(this.files.get());
      }
    }, {
      key: "__reject",
      value: function __reject() {
        return this.dfd.reject(this.files.get());
      }
    }, {
      key: "__prepareTabs",
      value: function __prepareTabs(tab) {
        var i, len, ref, tabName;
        this.addTab('preview');
        ref = this.settings.tabs;

        for (i = 0, len = ref.length; i < len; i++) {
          tabName = ref[i];
          this.addTab(tabName);
        }

        if (this.files.length()) {
          this.showTab('preview');
          this.switchTab('preview');
        } else {
          this.hideTab('preview');
          this.switchTab(tab || this.__firstVisibleTab());
        }

        if (this.settings.tabs.length === 0) {
          this.panel.addClass('uploadcare--panel_menu-hidden');
          return this.panel.find('.uploadcare--panel__menu').addClass('uploadcare--panel__menu_hidden');
        }
      }
    }, {
      key: "__prepareFooter",
      value: function __prepareFooter() {
        var _this3 = this;

        var notDisabled;
        this.footer = this.panel.find('.uploadcare--panel__footer');
        notDisabled = ':not(:disabled)';
        this.footer.on('click', '.uploadcare--panel__show-files' + notDisabled, function () {
          return _this3.switchTab('preview');
        });
        this.footer.on('click', '.uploadcare--panel__done' + notDisabled, this.__resolve);

        this.__updateFooter();

        this.files.onAdd.add(this.__updateFooter);
        return this.files.onRemove.add(this.__updateFooter);
      }
    }, {
      key: "__updateFooter",
      value: function __updateFooter() {
        var footer, tooFewFiles, tooManyFiles;
        var files = this.files.length();
        tooManyFiles = files > this.settings.multipleMax;
        tooFewFiles = files < this.settings.multipleMin;
        this.footer.find('.uploadcare--panel__done').attr('disabled', tooManyFiles || tooFewFiles).attr('aria-disabled', tooManyFiles || tooFewFiles);
        this.footer.find('.uploadcare--panel__show-files').attr('disabled', files === 0).attr('aria-disabled', files === 0);
        footer = tooManyFiles ? locale.t('dialog.tabs.preview.multiple.tooManyFiles').replace('%max%', this.settings.multipleMax) : files && tooFewFiles ? locale.t('dialog.tabs.preview.multiple.tooFewFiles').replace('%min%', this.settings.multipleMin) : locale.t('dialog.tabs.preview.multiple.title');
        this.footer.find('.uploadcare--panel__message').toggleClass('uploadcare--panel__message_hidden', files === 0).toggleClass('uploadcare--error', tooManyFiles || tooFewFiles).text(footer.replace('%files%', locale.t('file', files)));
        return this.footer.find('.uploadcare--panel__file-counter').toggleClass('uploadcare--error', tooManyFiles || tooFewFiles).text(files ? "(".concat(files, ")") : '');
      }
    }, {
      key: "__closePanel",
      value: function __closePanel() {
        this.panel.replaceWith(this.placeholder);
        return this.content.remove();
      }
    }, {
      key: "addTab",
      value: function addTab(name) {
        var _this4 = this;

        var TabCls, tabButton, tabIcon, tabPanel;

        if (name in this.tabs) {
          return;
        }

        TabCls = registeredTabs[name];

        if (!TabCls) {
          throw new Error("No such tab: ".concat(name));
        }

        tabPanel = $__default['default']('<div>').addClass('uploadcare--tab').addClass("uploadcare--tab_name_".concat(name)).insertBefore(this.footer);

        if (name === 'preview') {
          tabIcon = $__default['default']('<div class="uploadcare--menu__icon uploadcare--panel__icon" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">');
        } else {
          tabIcon = $__default['default']("<svg width='32' height='32'><use xlink:href='#uploadcare--icon-".concat(name, "'/></svg>")).attr('role', 'presentation').attr('class', 'uploadcare--icon uploadcare--menu__icon');
        }

        tabButton = $__default['default']('<div>', {
          role: 'button',
          tabindex: '0'
        }).addClass('uploadcare--menu__item').addClass("uploadcare--menu__item_tab_".concat(name)).attr('title', locale.t("dialog.tabs.names.".concat(name))).append(tabIcon).appendTo(this.panel.find('.uploadcare--menu__items')).on('click', function () {
          if (name === _this4.currentTab) {
            return _this4.panel.find('.uploadcare--panel__menu').removeClass('uploadcare--menu_opened');
          } else {
            return _this4.switchTab(name);
          }
        });
        this.tabs[name] = new TabCls(tabPanel, tabButton, this.publicPromise(), this.settings, name);
        return this.tabs[name];
      }
    }, {
      key: "switchTab",
      value: function switchTab(tab) {
        var className;

        if (!tab || this.currentTab === tab) {
          return;
        }

        this.currentTab = tab;
        this.panel.find('.uploadcare--panel__menu').removeClass('uploadcare--menu_opened').attr('data-current', tab);
        this.panel.find('.uploadcare--menu__item').removeClass('uploadcare--menu__item_current').filter(".uploadcare--menu__item_tab_".concat(tab)).addClass('uploadcare--menu__item_current');
        className = 'uploadcare--tab';
        this.panel.find(".".concat(className)).removeClass("".concat(className, "_current")).filter(".".concat(className, "_name_").concat(tab)).addClass("".concat(className, "_current"));

        if (this.tabs[tab].displayed) {
          this.tabs[tab].displayed();
        }

        return this.dfd.notify(tab);
      }
    }, {
      key: "showTab",
      value: function showTab(tab) {
        return this.onTabVisibility.fire(tab, true);
      }
    }, {
      key: "hideTab",
      value: function hideTab(tab) {
        this.onTabVisibility.fire(tab, false);

        if (this.currentTab === tab) {
          return this.switchTab(this.__firstVisibleTab());
        }
      }
    }, {
      key: "isTabVisible",
      value: function isTabVisible(tab) {
        return !this.panel.find(".uploadcare--menu__item_tab_".concat(tab)).is('.uploadcare--menu__item_hidden');
      }
    }, {
      key: "openMenu",
      value: function openMenu() {
        return this.panel.find('.uploadcare--panel__menu').addClass('uploadcare--menu_opened');
      }
    }, {
      key: "__firstVisibleTab",
      value: function __firstVisibleTab() {
        var i, len, ref, tab;
        ref = this.settings.tabs;

        for (i = 0, len = ref.length; i < len; i++) {
          tab = ref[i];

          if (this.isTabVisible(tab)) {
            return tab;
          }
        }
      }
    }, {
      key: "__welcome",
      value: function __welcome() {
        var i, len, ref, tabName;
        this.addTab('empty-pubkey');
        this.switchTab('empty-pubkey');
        ref = this.settings.tabs;

        for (i = 0, len = ref.length; i < len; i++) {
          tabName = ref[i];

          this.__addFakeTab(tabName);
        }

        return null;
      }
    }, {
      key: "__addFakeTab",
      value: function __addFakeTab(name) {
        var tabIcon;
        tabIcon = $__default['default']("<svg width='32' height='32'><use xlink:href='#uploadcare--icon-".concat(name, "'/></svg>")).attr('role', 'presentation').attr('class', 'uploadcare--icon uploadcare--menu__icon');

        if (name === 'empty-pubkey') {
          tabIcon.addClass('uploadcare--panel__icon');
        }

        return $__default['default']('<div>').addClass('uploadcare--menu__item').addClass("uploadcare--menu__item_tab_".concat(name)).attr('aria-disabled', true).attr('title', locale.t("dialog.tabs.names.".concat(name))).append(tabIcon).appendTo(this.panel.find('.uploadcare--menu__items'));
      }
    }]);

    return Panel;
  }();

  var BaseWidget = /*#__PURE__*/function () {
    function BaseWidget(element, settings) {
      var _this = this;

      _classCallCheck(this, BaseWidget);

      this.element = element;
      this.settings = settings;
      this.validators = this.settings.validators = [];
      this.currentObject = null;
      this.__onDialogOpen = $__default['default'].Callbacks();
      this.__onUploadComplete = $__default['default'].Callbacks();
      this.__onChange = $__default['default'].Callbacks().add(function (object) {
        return object != null ? object.promise().done(function (info) {
          return _this.__onUploadComplete.fire(info);
        }) : undefined;
      });

      this.__setupWidget();

      this.element.on('change.uploadcare', this.reloadInfo.bind(this)); // Delay loading info to allow set custom validators on page load.

      this.__hasValue = false;
      defer(function () {
        // Do not reload info if user call uc.Widget().value(uuid) manual.
        if (!_this.__hasValue) {
          return _this.reloadInfo();
        }
      });
    }

    _createClass(BaseWidget, [{
      key: "__setupWidget",
      value: function __setupWidget() {
        var _this2 = this;

        var path;
        this.template = new Template(this.settings, this.element);
        path = ['buttons.choose'];
        path.push(this.settings.imagesOnly ? 'images' : 'files');
        path.push(this.settings.multiple ? 'other' : 'one');
        this.template.addButton('open', locale.t(path.join('.'))).toggleClass('needsclick', this.settings.systemDialog).on('click', function () {
          return _this2.openDialog();
        });
        this.template.addButton('cancel', locale.t('buttons.cancel')).on('click', function () {
          return _this2.__setObject(null);
        });
        this.template.addButton('remove', locale.t('buttons.remove')).on('click', function () {
          return _this2.__setObject(null);
        });
        this.template.content.on('click', '.uploadcare--widget__file-name', function () {
          return _this2.openDialog();
        }); // Enable drag and drop

        receiveDrop(this.template.content, this.__handleDirectSelection.bind(this));
        return this.template.reset();
      }
    }, {
      key: "__infoToValue",
      value: function __infoToValue(info) {
        if (info.cdnUrlModifiers || this.settings.pathValue) {
          return info.cdnUrl;
        } else {
          return info.uuid;
        }
      }
    }, {
      key: "__reset",
      value: function __reset() {
        var object; // low-level primitive. @__setObject(null) could be better.

        object = this.currentObject;
        this.currentObject = null;

        if (object != null) {
          if (typeof object.cancel === 'function') {
            object.cancel();
          }
        }

        return this.template.reset();
      }
    }, {
      key: "__setObject",
      value: function __setObject(newFile) {
        if (newFile === this.currentObject) {
          return;
        }

        this.__reset();

        if (newFile) {
          this.currentObject = newFile;

          this.__watchCurrentObject();
        } else {
          this.element.val('');
        }

        return this.__onChange.fire(this.currentObject);
      }
    }, {
      key: "__watchCurrentObject",
      value: function __watchCurrentObject() {
        var _this3 = this;

        var object;
        object = this.__currentFile();

        if (object) {
          this.template.listen(object);
          return object.done(function (info) {
            if (object === _this3.__currentFile()) {
              return _this3.__onUploadingDone(info);
            }
          }).fail(function (errorType, fileInfo, error) {
            if (object === _this3.__currentFile()) {
              return _this3.__onUploadingFailed(errorType, error);
            }
          });
        }
      }
    }, {
      key: "__onUploadingDone",
      value: function __onUploadingDone(info) {
        this.element.val(this.__infoToValue(info));
        this.template.setFileInfo(info);
        return this.template.loaded();
      }
    }, {
      key: "__onUploadingFailed",
      value: function __onUploadingFailed(errorType, error) {
        this.template.reset();
        return this.template.error(errorType, error);
      }
    }, {
      key: "__setExternalValue",
      value: function __setExternalValue(value) {
        return this.__setObject(valueToFile(value, this.settings));
      }
    }, {
      key: "value",
      value: function value(_value) {
        if (_value !== undefined) {
          this.__hasValue = true;

          this.__setExternalValue(_value);

          return this;
        } else {
          return this.currentObject;
        }
      }
    }, {
      key: "reloadInfo",
      value: function reloadInfo() {
        return this.value(this.element.val());
      }
    }, {
      key: "openDialog",
      value: function openDialog(tab) {
        var _this4 = this;

        if (this.settings.systemDialog) {
          return fileSelectDialog(this.template.content, this.settings, function (input) {
            return _this4.__handleDirectSelection('object', input.files);
          });
        } else {
          return this.__openDialog(tab);
        }
      }
    }, {
      key: "__openDialog",
      value: function __openDialog(tab) {
        var dialogApi;
        dialogApi = openDialog(this.currentObject, tab, this.settings);

        this.__onDialogOpen.fire(dialogApi);

        return dialogApi.done(this.__setObject.bind(this));
      }
    }, {
      key: "api",
      value: function api() {
        if (!this.__api) {
          this.__api = bindAll(this, ['openDialog', 'reloadInfo', 'value', 'validators']);
          this.__api.onChange = publicCallbacks(this.__onChange);
          this.__api.onUploadComplete = publicCallbacks(this.__onUploadComplete);
          this.__api.onDialogOpen = publicCallbacks(this.__onDialogOpen);
          this.__api.inputElement = this.element.get(0);
        }

        return this.__api;
      }
    }]);

    return BaseWidget;
  }();

  var Widget$1 = /*#__PURE__*/function (_BaseWidget) {
    _inherits(Widget, _BaseWidget);

    var _super = _createSuper(Widget);

    function Widget() {
      _classCallCheck(this, Widget);

      return _super.apply(this, arguments);
    }

    _createClass(Widget, [{
      key: "__currentFile",
      value: function __currentFile() {
        return this.currentObject;
      }
    }, {
      key: "__handleDirectSelection",
      value: function __handleDirectSelection(type, data) {
        var file = fileFrom(type, data[0], this.settings);

        if (this.settings.systemDialog || !this.settings.previewStep) {
          return this.__setObject(file);
        } else {
          return this.__openDialog('preview').addFiles([file]);
        }
      }
    }]);

    return Widget;
  }(BaseWidget);

  Widget$1._name = 'SingleWidget';

  var MultipleWidget$1 = /*#__PURE__*/function (_BaseWidget) {
    _inherits(MultipleWidget, _BaseWidget);

    var _super = _createSuper(MultipleWidget);

    function MultipleWidget() {
      _classCallCheck(this, MultipleWidget);

      return _super.apply(this, arguments);
    }

    _createClass(MultipleWidget, [{
      key: "__currentFile",
      value: function __currentFile() {
        var ref1;
        return (ref1 = this.currentObject) != null ? ref1.promise() : undefined;
      }
    }, {
      key: "__setObject",
      value: function __setObject(group) {
        if (!isFileGroupsEqual(this.currentObject, group)) {
          return _get(_getPrototypeOf(MultipleWidget.prototype), "__setObject", this).call(this, group); // special case, when multiple widget is used with clearable
          // and user or some external code clears the value after
          // group loading error.
        } else if (!group) {
          this.__reset();

          return this.element.val('');
        }
      }
    }, {
      key: "__setExternalValue",
      value: function __setExternalValue(value) {
        var _this = this;

        var groupPr;
        this.__lastGroupPr = groupPr = valueToGroup(value, this.settings);

        if (value) {
          this.template.setStatus('started');
          this.template.statusText.text(locale.t('loadingInfo'));
        }

        return groupPr.done(function (group) {
          if (_this.__lastGroupPr === groupPr) {
            return _this.__setObject(group);
          }
        }).fail(function () {
          if (_this.__lastGroupPr === groupPr) {
            return _this.__onUploadingFailed('createGroup');
          }
        });
      }
    }, {
      key: "__handleDirectSelection",
      value: function __handleDirectSelection(type, data) {
        var files = filesFrom(type, data, this.settings);

        if (this.settings.systemDialog) {
          return this.__setObject(FileGroup(files, this.settings));
        } else {
          return this.__openDialog('preview').addFiles(files);
        }
      }
    }]);

    return MultipleWidget;
  }(BaseWidget);

  MultipleWidget$1._name = 'MultipleWidget';
  var dataAttr = 'uploadcareWidget';
  var selector = '[role~="uploadcare-uploader"]';

  var initialize = function initialize() {
    var container = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ':root';
    var el, i, len, ref, res, widgets;
    res = [];
    ref = $__default['default'](container);

    for (i = 0, len = ref.length; i < len; i++) {
      el = ref[i];
      widgets = _initialize(el.querySelectorAll(selector));
      res = res.concat(widgets);
    }

    return res;
  };

  var _initialize = function _initialize(targets) {
    var i, len, results, target, widget;
    results = [];

    for (i = 0, len = targets.length; i < len; i++) {
      target = targets[i];
      widget = $__default['default'](target).data(dataAttr);

      if (widget && widget.inputElement === target) {
        // widget already exists
        continue;
      }

      results.push(initializeWidget(target));
    }

    return results;
  };

  var SingleWidget = function SingleWidget(el, settings) {
    return initializeWidget(el, settings, Widget$1);
  };

  var MultipleWidget = function MultipleWidget(el, settings) {
    return initializeWidget(el, settings, MultipleWidget$1);
  };

  var Widget = function Widget(el, settings) {
    return initializeWidget(el, settings);
  };

  var initializeWidget = function initializeWidget(input) {
    var settings = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var targetClass = arguments.length > 2 ? arguments[2] : undefined;
    var inputArr = $__default['default'](input);

    if (inputArr.length === 0) {
      throw new Error('No DOM elements found matching selector');
    } else if (inputArr.length > 1) {
      warn('There are multiple DOM elements matching selector');
    }

    input = inputArr.eq(0);
    var s = build(_objectSpread2(_objectSpread2({}, settings), input.data()));
    var Widget = s.multiple ? MultipleWidget$1 : Widget$1;

    if (targetClass && Widget !== targetClass) {
      throw new Error("This element should be processed using ".concat(Widget._name));
    }

    var api = input.data(dataAttr);

    if (!api || api.inputElement !== input[0]) {
      cleanup(input);
      var widget = new Widget(input, s);
      api = widget.api();
      input.data(dataAttr, api);
      widget.template.content.data(dataAttr, api);
    }

    return api;
  };

  var cleanup = function cleanup(input) {
    return input.off('.uploadcare').each(function () {
      var widget, widgetElement;
      widgetElement = $__default['default'](this).next('.uploadcare--widget');
      widget = widgetElement.data(dataAttr);

      if (widget && widget.inputElement === this) {
        return widgetElement.remove();
      }
    });
  };

  var start = once(function (s, isolated) {
    // when isolated, call settings.common(s) only
    s = common(s, isolated);

    if (isolated) {
      return;
    }

    if (s.live) {
      setInterval(initialize, 100);
    } // should be after settings.common(s) call


    return initialize();
  });
  isWindowDefined() && $__default['default'](function () {
    if (!window.UPLOADCARE_MANUAL_START) {
      start();
    }
  });

  var namespace$1 = _objectSpread2(_objectSpread2({}, _namespace), {}, {
    templates: {
      JST: JST,
      tpl: tpl
    },
    crop: {
      CropWidget: CropWidget
    },
    dragdrop: {
      support: support,
      uploadDrop: uploadDrop,
      watchDragging: watchDragging,
      receiveDrop: receiveDrop
    },
    ui: {
      progress: {
        Circle: Circle,
        BaseRenderer: BaseRenderer,
        TextRenderer: TextRenderer,
        CanvasRenderer: CanvasRenderer
      }
    },
    widget: {
      tabs: {
        FileTab: FileTab,
        UrlTab: UrlTab,
        CameraTab: CameraTab,
        RemoteTab: RemoteTab,
        BasePreviewTab: BasePreviewTab,
        PreviewTab: PreviewTab,
        PreviewTabMultiple: PreviewTabMultiple
      },
      Template: Template,
      BaseWidget: BaseWidget,
      Widget: Widget$1,
      MultipleWidget: MultipleWidget$1
    },
    isDialogOpened: isDialogOpened,
    closeDialog: closeDialog,
    openDialog: openDialog,
    openPreviewDialog: openPreviewDialog,
    openPanel: openPanel,
    registerTab: registerTab,
    initialize: initialize,
    SingleWidget: SingleWidget,
    MultipleWidget: MultipleWidget,
    Widget: Widget,
    start: start
  });

  var plugin$1 = createPlugin(namespace$1);

  var uploadcare$1 = _objectSpread2(_objectSpread2({}, uploadcare$2), {}, {
    plugin: plugin$1,
    start: start,
    initialize: initialize,
    openDialog: openDialog,
    closeDialog: closeDialog,
    openPanel: openPanel,
    registerTab: registerTab,
    Circle: Circle,
    SingleWidget: SingleWidget,
    MultipleWidget: MultipleWidget,
    Widget: Widget,
    tabsCss: tabsCss,
    dragdrop: {
      receiveDrop: receiveDrop,
      support: support,
      uploadDrop: uploadDrop
    }
  });

  var namespace = namespace$1;
  var plugin = createPlugin(namespace);

  var uploadcare = _objectSpread2(_objectSpread2({}, uploadcare$1), {}, {
    plugin: plugin,
    locales: Object.keys(locale.translations)
  });

  return uploadcare;
});
},{"jquery":"node_modules/jquery/dist/jquery.js"}],"main.js":[function(require,module,exports) {
"use strict";

var _uploadcareWidget = _interopRequireDefault(require("uploadcare-widget"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var widget = _uploadcareWidget.default.Widget("#uploader", {
  publicKey: 'b04c4bcbd68df83a407f'
});

widget.onUploadComplete(function (fileInfo) {
  // get a CDN URL from the file info
  console.log("my upload object output ".concat(fileInfo.cdnUrl));
  console.log(fileInfo);
});
},{"uploadcare-widget":"node_modules/uploadcare-widget/uploadcare.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54202" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map