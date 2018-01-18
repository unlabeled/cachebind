var cached = new WeakMap()

/**
 * Cache binded function with no context
 *
 * @param {Function} fn
 * @param {Array} args
 */
function bindArgs() {
  var args = Array.prototype.splice.call(arguments, 0)
  args.unshift(undefined)
  return bind.apply(undefined, args)
}

/**
 * Cache binded function result with its params
 *
 * @param {Any} context
 * @param {Function} fn
 * @param {Array} args
 * @returns {Function}
 */
function bind(context, fn) {
  if (typeof fn !== "function") {
    throw new TypeError("You use bindcache util with no function.")
  }
  var args = Array.prototype.slice.call(arguments, 2)
  var contextWithArgs = [].concat(context, args)
  if (!cached.has(fn)) {
    var bindedFunction = bindAllArgs(context, fn, args)
    var argsFunction = new Map()
    argsFunction.set(bindedFunction, contextWithArgs)
    cached.set(fn, argsFunction)
    return bindedFunction
  }

  var found = cached.get(fn)
  var iterator = found.entries()
  var entry
  while ((entry = iterator.next()) && !entry.done) {
    var bindedFunction = entry.value[0]
    var storedArgs = entry.value[1]
    if (isEqual(storedArgs, contextWithArgs)) {
      return bindedFunction
    }
    entry = iterator.next()
  }
  var bindedFunction = bindAllArgs(context, fn, args)
  found.set(bindedFunction, contextWithArgs)
  return bindedFunction
}

/**
 * Helper to apply array into bind
 *
 * @param {*} context
 * @param {Function} fn
 * @param {Array} args
 */
function bindAllArgs(context, fn, args) {
  return fn.bind.apply(fn, [context].concat(args))
}

/**
 * Check if arrays of args are equal
 *
 * @param {Array} firstParams
 * @param {Array} secondParams
 * @returns {boolean}
 */
function isEqual(firstParams, secondParams) {
  var lengthFirstParams = firstParams.length
  var lengthSecondParams = secondParams.length

  if (lengthFirstParams !== lengthSecondParams) {
    return false
  }

  var condition = true
  for (var i = 0; i < lengthFirstParams; i++) {
    if (firstParams[i] !== secondParams[i]) {
      condition = false
      break
    }
  }
  return condition
}

exports.bind = bind
exports.bindArgs = bindArgs
