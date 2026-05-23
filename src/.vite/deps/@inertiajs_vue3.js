//#region node_modules/es-toolkit/dist/compat/predicate/isSymbol.mjs
function isSymbol$1(value) {
	return typeof value === "symbol" || value instanceof Symbol;
}
//#endregion
//#region node_modules/es-toolkit/dist/_internal/globalThis.mjs
var globalThis_ = typeof globalThis === "object" && globalThis || typeof window === "object" && window || typeof self === "object" && self || typeof global === "object" && global || (function() {
	return this;
})() || Function("return this")();
//#endregion
//#region node_modules/es-toolkit/dist/function/debounce.mjs
function debounce$2(func, debounceMs, { signal, edges } = {}) {
	let pendingThis = void 0;
	let pendingArgs = null;
	const leading = edges != null && edges.includes("leading");
	const trailing = edges == null || edges.includes("trailing");
	const invoke = () => {
		if (pendingArgs !== null) {
			func.apply(pendingThis, pendingArgs);
			pendingThis = void 0;
			pendingArgs = null;
		}
	};
	const onTimerEnd = () => {
		if (trailing) invoke();
		cancel();
	};
	let timeoutId = null;
	const schedule = () => {
		if (timeoutId != null) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			timeoutId = null;
			onTimerEnd();
		}, debounceMs);
	};
	const cancelTimer = () => {
		if (timeoutId !== null) {
			clearTimeout(timeoutId);
			timeoutId = null;
		}
	};
	const cancel = () => {
		cancelTimer();
		pendingThis = void 0;
		pendingArgs = null;
	};
	const flush = () => {
		invoke();
	};
	const debounced = function(...args) {
		if (signal?.aborted) return;
		pendingThis = this;
		pendingArgs = args;
		const isFirstCall = timeoutId == null;
		schedule();
		if (leading && isFirstCall) invoke();
	};
	debounced.schedule = schedule;
	debounced.cancel = cancel;
	debounced.flush = flush;
	signal?.addEventListener("abort", cancel, { once: true });
	return debounced;
}
//#endregion
//#region node_modules/es-toolkit/dist/function/noop.mjs
function noop$2() {}
//#endregion
//#region node_modules/es-toolkit/dist/predicate/isPrimitive.mjs
function isPrimitive(value) {
	return value == null || typeof value !== "object" && typeof value !== "function";
}
//#endregion
//#region node_modules/es-toolkit/dist/predicate/isTypedArray.mjs
function isTypedArray$1(x) {
	return ArrayBuffer.isView(x) && !(x instanceof DataView);
}
//#endregion
//#region node_modules/es-toolkit/dist/object/clone.mjs
function clone(obj) {
	if (isPrimitive(obj)) return obj;
	if (Array.isArray(obj) || isTypedArray$1(obj) || obj instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && obj instanceof SharedArrayBuffer) return obj.slice(0);
	const prototype = Object.getPrototypeOf(obj);
	if (prototype == null) return Object.assign(Object.create(prototype), obj);
	const Constructor = prototype.constructor;
	if (obj instanceof Date || obj instanceof Map || obj instanceof Set) return new Constructor(obj);
	if (obj instanceof RegExp) {
		const newRegExp = new Constructor(obj);
		newRegExp.lastIndex = obj.lastIndex;
		return newRegExp;
	}
	if (obj instanceof DataView) return new Constructor(obj.buffer.slice(0));
	if (obj instanceof Error) {
		let newError;
		if (obj instanceof AggregateError) newError = new Constructor(obj.errors, obj.message, { cause: obj.cause });
		else newError = new Constructor(obj.message, { cause: obj.cause });
		newError.stack = obj.stack;
		Object.assign(newError, obj);
		return newError;
	}
	if (typeof File !== "undefined" && obj instanceof File) return new Constructor([obj], obj.name, {
		type: obj.type,
		lastModified: obj.lastModified
	});
	if (typeof obj === "object") return Object.assign(Object.create(prototype), obj);
	return obj;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/_internal/getSymbols.mjs
function getSymbols(object) {
	return Object.getOwnPropertySymbols(object).filter((symbol) => Object.prototype.propertyIsEnumerable.call(object, symbol));
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/_internal/getTag.mjs
function getTag(value) {
	if (value == null) return value === void 0 ? "[object Undefined]" : "[object Null]";
	return Object.prototype.toString.call(value);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/_internal/tags.mjs
var regexpTag = "[object RegExp]";
var stringTag = "[object String]";
var numberTag = "[object Number]";
var booleanTag = "[object Boolean]";
var argumentsTag = "[object Arguments]";
var symbolTag = "[object Symbol]";
var dateTag = "[object Date]";
var mapTag = "[object Map]";
var setTag = "[object Set]";
var arrayTag = "[object Array]";
var functionTag = "[object Function]";
var arrayBufferTag = "[object ArrayBuffer]";
var objectTag = "[object Object]";
var errorTag = "[object Error]";
var dataViewTag = "[object DataView]";
var uint8ArrayTag = "[object Uint8Array]";
var uint8ClampedArrayTag = "[object Uint8ClampedArray]";
var uint16ArrayTag = "[object Uint16Array]";
var uint32ArrayTag = "[object Uint32Array]";
var bigUint64ArrayTag = "[object BigUint64Array]";
var int8ArrayTag = "[object Int8Array]";
var int16ArrayTag = "[object Int16Array]";
var int32ArrayTag = "[object Int32Array]";
var bigInt64ArrayTag = "[object BigInt64Array]";
var float32ArrayTag = "[object Float32Array]";
var float64ArrayTag = "[object Float64Array]";
//#endregion
//#region node_modules/es-toolkit/dist/predicate/isBuffer.mjs
function isBuffer(x) {
	return typeof globalThis_.Buffer !== "undefined" && globalThis_.Buffer.isBuffer(x);
}
//#endregion
//#region node_modules/es-toolkit/dist/object/cloneDeepWith.mjs
function cloneDeepWith$1(obj, cloneValue) {
	return cloneDeepWithImpl(obj, void 0, obj, /* @__PURE__ */ new Map(), cloneValue);
}
function cloneDeepWithImpl(valueToClone, keyToClone, objectToClone, stack = /* @__PURE__ */ new Map(), cloneValue = void 0) {
	const cloned = cloneValue?.(valueToClone, keyToClone, objectToClone, stack);
	if (cloned !== void 0) return cloned;
	if (isPrimitive(valueToClone)) return valueToClone;
	if (stack.has(valueToClone)) return stack.get(valueToClone);
	if (Array.isArray(valueToClone)) {
		const result = new Array(valueToClone.length);
		stack.set(valueToClone, result);
		for (let i = 0; i < valueToClone.length; i++) result[i] = cloneDeepWithImpl(valueToClone[i], i, objectToClone, stack, cloneValue);
		if (Object.hasOwn(valueToClone, "index")) result.index = valueToClone.index;
		if (Object.hasOwn(valueToClone, "input")) result.input = valueToClone.input;
		return result;
	}
	if (valueToClone instanceof Date) return new Date(valueToClone.getTime());
	if (valueToClone instanceof RegExp) {
		const result = new RegExp(valueToClone.source, valueToClone.flags);
		result.lastIndex = valueToClone.lastIndex;
		return result;
	}
	if (valueToClone instanceof Map) {
		const result = /* @__PURE__ */ new Map();
		stack.set(valueToClone, result);
		for (const [key, value] of valueToClone) result.set(key, cloneDeepWithImpl(value, key, objectToClone, stack, cloneValue));
		return result;
	}
	if (valueToClone instanceof Set) {
		const result = /* @__PURE__ */ new Set();
		stack.set(valueToClone, result);
		for (const value of valueToClone) result.add(cloneDeepWithImpl(value, void 0, objectToClone, stack, cloneValue));
		return result;
	}
	if (isBuffer(valueToClone)) return valueToClone.subarray();
	if (isTypedArray$1(valueToClone)) {
		const result = new (Object.getPrototypeOf(valueToClone)).constructor(valueToClone.length);
		stack.set(valueToClone, result);
		for (let i = 0; i < valueToClone.length; i++) result[i] = cloneDeepWithImpl(valueToClone[i], i, objectToClone, stack, cloneValue);
		return result;
	}
	if (valueToClone instanceof ArrayBuffer || typeof SharedArrayBuffer !== "undefined" && valueToClone instanceof SharedArrayBuffer) return valueToClone.slice(0);
	if (valueToClone instanceof DataView) {
		const result = new DataView(valueToClone.buffer.slice(0), valueToClone.byteOffset, valueToClone.byteLength);
		stack.set(valueToClone, result);
		copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
		return result;
	}
	if (typeof File !== "undefined" && valueToClone instanceof File) {
		const result = new File([valueToClone], valueToClone.name, { type: valueToClone.type });
		stack.set(valueToClone, result);
		copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
		return result;
	}
	if (typeof Blob !== "undefined" && valueToClone instanceof Blob) {
		const result = new Blob([valueToClone], { type: valueToClone.type });
		stack.set(valueToClone, result);
		copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
		return result;
	}
	if (valueToClone instanceof Error) {
		const result = structuredClone(valueToClone);
		stack.set(valueToClone, result);
		result.message = valueToClone.message;
		result.name = valueToClone.name;
		result.stack = valueToClone.stack;
		result.cause = valueToClone.cause;
		result.constructor = valueToClone.constructor;
		copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
		return result;
	}
	if (valueToClone instanceof Boolean) {
		const result = new Boolean(valueToClone.valueOf());
		stack.set(valueToClone, result);
		copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
		return result;
	}
	if (valueToClone instanceof Number) {
		const result = new Number(valueToClone.valueOf());
		stack.set(valueToClone, result);
		copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
		return result;
	}
	if (valueToClone instanceof String) {
		const result = new String(valueToClone.valueOf());
		stack.set(valueToClone, result);
		copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
		return result;
	}
	if (typeof valueToClone === "object" && isCloneableObject(valueToClone)) {
		const result = Object.create(Object.getPrototypeOf(valueToClone));
		stack.set(valueToClone, result);
		copyProperties(result, valueToClone, objectToClone, stack, cloneValue);
		return result;
	}
	return valueToClone;
}
function copyProperties(target, source, objectToClone = target, stack, cloneValue) {
	const keys = [...Object.keys(source), ...getSymbols(source)];
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		const descriptor = Object.getOwnPropertyDescriptor(target, key);
		if (descriptor == null || descriptor.writable) target[key] = cloneDeepWithImpl(source[key], key, objectToClone, stack, cloneValue);
	}
}
function isCloneableObject(object) {
	switch (getTag(object)) {
		case argumentsTag:
		case arrayTag:
		case arrayBufferTag:
		case dataViewTag:
		case booleanTag:
		case dateTag:
		case float32ArrayTag:
		case float64ArrayTag:
		case int8ArrayTag:
		case int16ArrayTag:
		case int32ArrayTag:
		case mapTag:
		case numberTag:
		case objectTag:
		case regexpTag:
		case setTag:
		case stringTag:
		case symbolTag:
		case uint8ArrayTag:
		case uint8ClampedArrayTag:
		case uint16ArrayTag:
		case uint32ArrayTag: return true;
		default: return false;
	}
}
//#endregion
//#region node_modules/es-toolkit/dist/object/cloneDeep.mjs
function cloneDeep$1(obj) {
	return cloneDeepWithImpl(obj, void 0, obj, /* @__PURE__ */ new Map(), void 0);
}
//#endregion
//#region node_modules/es-toolkit/dist/predicate/isPlainObject.mjs
function isPlainObject$3(value) {
	if (!value || typeof value !== "object") return false;
	const proto = Object.getPrototypeOf(value);
	if (!(proto === null || proto === Object.prototype || Object.getPrototypeOf(proto) === null)) return false;
	return Object.prototype.toString.call(value) === "[object Object]";
}
//#endregion
//#region node_modules/es-toolkit/dist/_internal/isUnsafeProperty.mjs
function isUnsafeProperty(key) {
	return key === "__proto__";
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/predicate/isPlainObject.mjs
function isPlainObject$2(object) {
	if (typeof object !== "object") return false;
	if (object == null) return false;
	if (Object.getPrototypeOf(object) === null) return true;
	if (Object.prototype.toString.call(object) !== "[object Object]") {
		const tag = object[Symbol.toStringTag];
		if (tag == null) return false;
		if (!Object.getOwnPropertyDescriptor(object, Symbol.toStringTag)?.writable) return false;
		return object.toString() === `[object ${tag}]`;
	}
	let proto = object;
	while (Object.getPrototypeOf(proto) !== null) proto = Object.getPrototypeOf(proto);
	return Object.getPrototypeOf(object) === proto;
}
//#endregion
//#region node_modules/es-toolkit/dist/_internal/isEqualsSameValueZero.mjs
function isEqualsSameValueZero(value, other) {
	return value === other || Number.isNaN(value) && Number.isNaN(other);
}
//#endregion
//#region node_modules/es-toolkit/dist/predicate/isEqualWith.mjs
function isEqualWith(a, b, areValuesEqual) {
	return isEqualWithImpl(a, b, void 0, void 0, void 0, void 0, areValuesEqual);
}
function isEqualWithImpl(a, b, property, aParent, bParent, stack, areValuesEqual) {
	const result = areValuesEqual(a, b, property, aParent, bParent, stack);
	if (result !== void 0) return result;
	if (typeof a === typeof b) switch (typeof a) {
		case "bigint":
		case "string":
		case "boolean":
		case "symbol":
		case "undefined": return a === b;
		case "number": return a === b || Object.is(a, b);
		case "function": return a === b;
		case "object": return areObjectsEqual(a, b, stack, areValuesEqual);
	}
	return areObjectsEqual(a, b, stack, areValuesEqual);
}
function areObjectsEqual(a, b, stack, areValuesEqual) {
	if (Object.is(a, b)) return true;
	let aTag = getTag(a);
	let bTag = getTag(b);
	if (aTag === "[object Arguments]") aTag = objectTag;
	if (bTag === "[object Arguments]") bTag = objectTag;
	if (aTag !== bTag) return false;
	switch (aTag) {
		case stringTag: return a.toString() === b.toString();
		case numberTag: return isEqualsSameValueZero(a.valueOf(), b.valueOf());
		case booleanTag:
		case dateTag:
		case symbolTag: return Object.is(a.valueOf(), b.valueOf());
		case regexpTag: return a.source === b.source && a.flags === b.flags;
		case functionTag: return a === b;
	}
	stack = stack ?? /* @__PURE__ */ new Map();
	const aStack = stack.get(a);
	const bStack = stack.get(b);
	if (aStack != null && bStack != null) return aStack === b;
	stack.set(a, b);
	stack.set(b, a);
	try {
		switch (aTag) {
			case mapTag:
				if (a.size !== b.size) return false;
				for (const [key, value] of a.entries()) if (!b.has(key) || !isEqualWithImpl(value, b.get(key), key, a, b, stack, areValuesEqual)) return false;
				return true;
			case setTag: {
				if (a.size !== b.size) return false;
				const aValues = Array.from(a.values());
				const bValues = Array.from(b.values());
				for (let i = 0; i < aValues.length; i++) {
					const aValue = aValues[i];
					const index = bValues.findIndex((bValue) => {
						return isEqualWithImpl(aValue, bValue, void 0, a, b, stack, areValuesEqual);
					});
					if (index === -1) return false;
					bValues.splice(index, 1);
				}
				return true;
			}
			case arrayTag:
			case uint8ArrayTag:
			case uint8ClampedArrayTag:
			case uint16ArrayTag:
			case uint32ArrayTag:
			case bigUint64ArrayTag:
			case int8ArrayTag:
			case int16ArrayTag:
			case int32ArrayTag:
			case bigInt64ArrayTag:
			case float32ArrayTag:
			case float64ArrayTag:
				if (isBuffer(a) !== isBuffer(b)) return false;
				if (a.length !== b.length) return false;
				for (let i = 0; i < a.length; i++) if (!isEqualWithImpl(a[i], b[i], i, a, b, stack, areValuesEqual)) return false;
				return true;
			case arrayBufferTag:
				if (a.byteLength !== b.byteLength) return false;
				return areObjectsEqual(new Uint8Array(a), new Uint8Array(b), stack, areValuesEqual);
			case dataViewTag:
				if (a.byteLength !== b.byteLength || a.byteOffset !== b.byteOffset) return false;
				return areObjectsEqual(new Uint8Array(a), new Uint8Array(b), stack, areValuesEqual);
			case errorTag: return a.name === b.name && a.message === b.message;
			case objectTag: {
				if (!(areObjectsEqual(a.constructor, b.constructor, stack, areValuesEqual) || isPlainObject$3(a) && isPlainObject$3(b))) return false;
				const aKeys = [...Object.keys(a), ...getSymbols(a)];
				const bKeys = [...Object.keys(b), ...getSymbols(b)];
				if (aKeys.length !== bKeys.length) return false;
				for (let i = 0; i < aKeys.length; i++) {
					const propKey = aKeys[i];
					const aProp = a[propKey];
					if (!Object.hasOwn(b, propKey)) return false;
					const bProp = b[propKey];
					if (!isEqualWithImpl(aProp, bProp, propKey, a, b, stack, areValuesEqual)) return false;
				}
				return true;
			}
			default: return false;
		}
	} finally {
		stack.delete(a);
		stack.delete(b);
	}
}
//#endregion
//#region node_modules/es-toolkit/dist/predicate/isEqual.mjs
function isEqual(a, b) {
	return isEqualWith(a, b, noop$2);
}
//#endregion
//#region node_modules/es-toolkit/dist/predicate/isLength.mjs
function isLength(value) {
	return Number.isSafeInteger(value) && value >= 0;
}
//#endregion
//#region node_modules/es-toolkit/dist/string/escape.mjs
var htmlEscapes = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	"\"": "&quot;",
	"'": "&#39;"
};
function escape$1(str) {
	return str.replace(/[&<>"']/g, (match) => htmlEscapes[match]);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/predicate/isArrayLike.mjs
function isArrayLike(value) {
	return value != null && typeof value !== "function" && isLength(value.length);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/_internal/isDeepKey.mjs
function isDeepKey(key) {
	switch (typeof key) {
		case "number":
		case "symbol": return false;
		case "string": return key.includes(".") || key.includes("[") || key.includes("]");
	}
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/_internal/toKey.mjs
function toKey(value) {
	if (typeof value === "string" || typeof value === "symbol") return value;
	if (Object.is(value?.valueOf?.(), -0)) return "-0";
	return String(value);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/util/toString.mjs
function toString(value) {
	if (value == null) return "";
	if (typeof value === "string") return value;
	if (Array.isArray(value)) return value.map(toString).join(",");
	const result = String(value);
	if (result === "0" && Object.is(Number(value), -0)) return "-0";
	return result;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/util/toPath.mjs
function toPath(deepKey) {
	if (Array.isArray(deepKey)) return deepKey.map(toKey);
	if (typeof deepKey === "symbol") return [deepKey];
	deepKey = toString(deepKey);
	const result = [];
	const length = deepKey.length;
	if (length === 0) return result;
	let index = 0;
	let key = "";
	let quoteChar = "";
	let bracket = false;
	if (deepKey.charCodeAt(0) === 46) {
		result.push("");
		index++;
	}
	while (index < length) {
		const char = deepKey[index];
		if (quoteChar) if (char === "\\" && index + 1 < length) {
			index++;
			key += deepKey[index];
		} else if (char === quoteChar) quoteChar = "";
		else key += char;
		else if (bracket) if (char === "\"" || char === "'") quoteChar = char;
		else if (char === "]") {
			bracket = false;
			result.push(key);
			key = "";
		} else key += char;
		else if (char === "[") {
			bracket = true;
			if (key) {
				result.push(key);
				key = "";
			}
		} else if (char === ".") {
			if (key) {
				result.push(key);
				key = "";
			}
		} else key += char;
		index++;
	}
	if (key) result.push(key);
	return result;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/object/get.mjs
function get(object, path, defaultValue) {
	if (object == null) return defaultValue;
	switch (typeof path) {
		case "string": {
			if (isUnsafeProperty(path)) return defaultValue;
			const result = object[path];
			if (result === void 0) if (isDeepKey(path)) return get(object, toPath(path), defaultValue);
			else return defaultValue;
			return result;
		}
		case "number":
		case "symbol": {
			if (typeof path === "number") path = toKey(path);
			const result = object[path];
			if (result === void 0) return defaultValue;
			return result;
		}
		default: {
			if (Array.isArray(path)) return getWithPath(object, path, defaultValue);
			if (Object.is(path?.valueOf(), -0)) path = "-0";
			else path = String(path);
			if (isUnsafeProperty(path)) return defaultValue;
			const result = object[path];
			if (result === void 0) return defaultValue;
			return result;
		}
	}
}
function getWithPath(object, path, defaultValue) {
	if (path.length === 0) return defaultValue;
	let current = object;
	for (let index = 0; index < path.length; index++) {
		if (current == null) return defaultValue;
		if (isUnsafeProperty(path[index])) return defaultValue;
		current = current[path[index]];
	}
	if (current === void 0) return defaultValue;
	return current;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/predicate/isObject.mjs
function isObject$1(value) {
	return value !== null && (typeof value === "object" || typeof value === "function");
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/object/cloneDeepWith.mjs
function cloneDeepWith(obj, customizer) {
	return cloneDeepWith$1(obj, (value, key, object, stack) => {
		const cloned = customizer?.(value, key, object, stack);
		if (cloned !== void 0) return cloned;
		if (typeof obj !== "object") return;
		if (getTag(obj) === "[object Object]" && typeof obj.constructor !== "function") {
			const result = {};
			stack.set(obj, result);
			copyProperties(result, obj, object, stack);
			return result;
		}
		switch (Object.prototype.toString.call(obj)) {
			case numberTag:
			case stringTag:
			case booleanTag: {
				const result = new obj.constructor(obj?.valueOf());
				copyProperties(result, obj);
				return result;
			}
			case argumentsTag: {
				const result = {};
				copyProperties(result, obj);
				result.length = obj.length;
				result[Symbol.iterator] = obj[Symbol.iterator];
				return result;
			}
			default: return;
		}
	});
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/object/cloneDeep.mjs
function cloneDeep(obj) {
	return cloneDeepWith(obj);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/_internal/isIndex.mjs
var IS_UNSIGNED_INTEGER = /^(?:0|[1-9]\d*)$/;
function isIndex(value, length = Number.MAX_SAFE_INTEGER) {
	switch (typeof value) {
		case "number": return Number.isInteger(value) && value >= 0 && value < length;
		case "symbol": return false;
		case "string": return IS_UNSIGNED_INTEGER.test(value);
	}
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/predicate/isArguments.mjs
function isArguments(value) {
	return value !== null && typeof value === "object" && getTag(value) === "[object Arguments]";
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/object/has.mjs
function has(object, path) {
	let resolvedPath;
	if (Array.isArray(path)) resolvedPath = path;
	else if (typeof path === "string" && isDeepKey(path) && object?.[path] == null) resolvedPath = toPath(path);
	else resolvedPath = [path];
	if (resolvedPath.length === 0) return false;
	let current = object;
	for (let i = 0; i < resolvedPath.length; i++) {
		const key = resolvedPath[i];
		if (current == null || !Object.hasOwn(current, key)) {
			if (!((Array.isArray(current) || isArguments(current)) && isIndex(key) && key < current.length)) return false;
		}
		current = current[key];
	}
	return true;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/predicate/isObjectLike.mjs
function isObjectLike(value) {
	return typeof value === "object" && value !== null;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/predicate/isArrayLikeObject.mjs
function isArrayLikeObject(value) {
	return isObjectLike(value) && isArrayLike(value);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/_internal/isKey.mjs
var regexIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/;
var regexIsPlainProp = /^\w*$/;
function isKey(value, object) {
	if (Array.isArray(value)) return false;
	if (typeof value === "number" || typeof value === "boolean" || value == null || isSymbol$1(value)) return true;
	return typeof value === "string" && (regexIsPlainProp.test(value) || !regexIsDeepProp.test(value)) || object != null && Object.hasOwn(object, value);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/_internal/assignValue.mjs
var assignValue = (object, key, value) => {
	const objValue = object[key];
	if (!(Object.hasOwn(object, key) && isEqualsSameValueZero(objValue, value)) || value === void 0 && !(key in object)) object[key] = value;
};
//#endregion
//#region node_modules/es-toolkit/dist/compat/object/updateWith.mjs
function updateWith(obj, path, updater, customizer) {
	if (obj == null && !isObject$1(obj)) return obj;
	let resolvedPath;
	if (isKey(path, obj)) resolvedPath = [path];
	else if (Array.isArray(path)) resolvedPath = path;
	else resolvedPath = toPath(path);
	const updateValue = updater(get(obj, resolvedPath));
	let current = obj;
	for (let i = 0; i < resolvedPath.length && current != null; i++) {
		const key = toKey(resolvedPath[i]);
		if (isUnsafeProperty(key)) continue;
		let newValue;
		if (i === resolvedPath.length - 1) newValue = updateValue;
		else {
			const objValue = current[key];
			const customizerResult = customizer?.(objValue, key, obj);
			newValue = customizerResult !== void 0 ? customizerResult : isObject$1(objValue) ? objValue : isIndex(resolvedPath[i + 1]) ? [] : {};
		}
		assignValue(current, key, newValue);
		current = current[key];
	}
	return obj;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/object/set.mjs
function set(obj, path, value) {
	return updateWith(obj, path, () => value, () => void 0);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/function/debounce.mjs
function debounce$1(func, debounceMs = 0, options = {}) {
	if (typeof options !== "object") options = {};
	const { leading = false, trailing = true, maxWait } = options;
	const edges = Array(2);
	if (leading) edges[0] = "leading";
	if (trailing) edges[1] = "trailing";
	let result = void 0;
	let pendingAt = null;
	const _debounced = debounce$2(function(...args) {
		result = func.apply(this, args);
		pendingAt = null;
	}, debounceMs, { edges });
	const debounced = function(...args) {
		if (maxWait != null) {
			if (pendingAt === null) pendingAt = Date.now();
			if (Date.now() - pendingAt >= maxWait) {
				result = func.apply(this, args);
				pendingAt = Date.now();
				_debounced.cancel();
				_debounced.schedule();
				return result;
			}
		}
		_debounced.apply(this, args);
		return result;
	};
	const flush = () => {
		_debounced.flush();
		return result;
	};
	debounced.cancel = _debounced.cancel;
	debounced.flush = flush;
	return debounced;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/predicate/isTypedArray.mjs
function isTypedArray(x) {
	return isTypedArray$1(x);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/object/mergeWith.mjs
function mergeWith(object, ...otherArgs) {
	const sources = otherArgs.slice(0, -1);
	const merge = otherArgs[otherArgs.length - 1];
	let result = object;
	for (let i = 0; i < sources.length; i++) {
		const source = sources[i];
		result = mergeWithDeep(result, source, merge, /* @__PURE__ */ new Map());
	}
	return result;
}
function mergeWithDeep(target, source, merge, stack) {
	if (isPrimitive(target)) target = Object(target);
	if (source == null || typeof source !== "object") return target;
	if (stack.has(source)) return clone(stack.get(source));
	stack.set(source, target);
	if (Array.isArray(source)) {
		source = source.slice();
		for (let i = 0; i < source.length; i++) source[i] = source[i] ?? void 0;
	}
	const sourceKeys = [...Object.keys(source), ...getSymbols(source)];
	for (let i = 0; i < sourceKeys.length; i++) {
		const key = sourceKeys[i];
		if (isUnsafeProperty(key)) continue;
		let sourceValue = source[key];
		let targetValue = target[key];
		if (isArguments(sourceValue)) sourceValue = { ...sourceValue };
		if (isArguments(targetValue)) targetValue = { ...targetValue };
		if (isBuffer(sourceValue)) sourceValue = cloneDeep(sourceValue);
		if (Array.isArray(sourceValue)) if (Array.isArray(targetValue)) {
			const cloned = [];
			const targetKeys = Reflect.ownKeys(targetValue);
			for (let i = 0; i < targetKeys.length; i++) {
				const targetKey = targetKeys[i];
				cloned[targetKey] = targetValue[targetKey];
			}
			targetValue = cloned;
		} else if (isArrayLikeObject(targetValue)) {
			const cloned = [];
			for (let i = 0; i < targetValue.length; i++) cloned[i] = targetValue[i];
			targetValue = cloned;
		} else targetValue = [];
		const merged = merge(targetValue, sourceValue, key, target, source, stack);
		if (merged !== void 0) target[key] = merged;
		else if (Array.isArray(sourceValue)) target[key] = mergeWithDeep(targetValue, sourceValue, merge, stack);
		else if (isObjectLike(targetValue) && isObjectLike(sourceValue) && (isPlainObject$2(targetValue) || isPlainObject$2(sourceValue) || isTypedArray(targetValue) || isTypedArray(sourceValue))) target[key] = mergeWithDeep(targetValue, sourceValue, merge, stack);
		else if (targetValue == null && isPlainObject$2(sourceValue)) target[key] = mergeWithDeep({}, sourceValue, merge, stack);
		else if (targetValue == null && isTypedArray(sourceValue)) target[key] = cloneDeep(sourceValue);
		else if (targetValue === void 0 || sourceValue !== void 0) target[key] = sourceValue;
	}
	return target;
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/object/merge.mjs
function merge(object, ...sources) {
	return mergeWith(object, ...sources, noop$2);
}
//#endregion
//#region node_modules/es-toolkit/dist/compat/string/escape.mjs
function escape(string) {
	return escape$1(toString(string));
}
//#endregion
//#region node_modules/laravel-precognition/dist/form.js
/**
* Determine if the value is a file.
*/
var isFile$1 = (value) => typeof File !== "undefined" && value instanceof File || value instanceof Blob || typeof FileList !== "undefined" && value instanceof FileList && value.length > 0;
/**
* Determine if the payload has any files.
*
* @see https://github.com/inertiajs/inertia/blob/master/packages/core/src/files.ts
*/
var hasFiles$1 = (data) => {
	if (data instanceof FormData) return true;
	return isFile$1(data) || typeof data === "object" && data !== null && Object.values(data).some((value) => hasFiles$1(value));
};
//#endregion
//#region node_modules/laravel-precognition/dist/http/errors.js
/**
* Error thrown when the server responds with a 4xx or 5xx status code.
*/
var HttpResponseError$1 = class extends Error {
	response;
	constructor(response) {
		super(`HTTP error ${response.status}`);
		this.name = "HttpResponseError";
		this.response = response;
	}
};
/**
* Error thrown when a request is cancelled/aborted.
*/
var HttpCancelledError$1 = class extends Error {
	constructor(message = "Request was cancelled") {
		super(message);
		this.name = "HttpCancelledError";
	}
};
/**
* Error thrown when a network error occurs (e.g., no connection).
*/
var HttpNetworkError$1 = class extends Error {
	constructor(message = "Network error") {
		super(message);
		this.name = "HttpNetworkError";
	}
};
//#endregion
//#region node_modules/laravel-precognition/dist/http/url.js
/**
* Build a query string from params.
*/
function buildQueryString(params) {
	const searchParams = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (value === void 0 || value === null) return;
		if (Array.isArray(value)) value.forEach((item) => searchParams.append(`${key}[]`, String(item)));
		else if (typeof value === "object") searchParams.append(key, JSON.stringify(value));
		else searchParams.append(key, String(value));
	});
	return searchParams.toString();
}
/**
* Build the full URL with base URL and query params.
*/
function buildUrl(url, baseURL, params) {
	if (baseURL && !url.startsWith("http://") && !url.startsWith("https://")) url = baseURL.replace(/\/$/, "") + "/" + url.replace(/^\//, "");
	if (params && Object.keys(params).length > 0) {
		const queryString = buildQueryString(params);
		if (queryString) url += (url.includes("?") ? "&" : "?") + queryString;
	}
	return url;
}
//#endregion
//#region node_modules/laravel-precognition/dist/http/fetchClient.js
/**
* Get the X-Requested-With header from Laravel's bootstrap config if available.
*/
function getAjaxHeader() {
	if (typeof window === "undefined") return null;
	return window.axios?.defaults?.headers?.common?.["X-Requested-With"] ?? null;
}
/**
* Convert data to FormData recursively.
*/
function toFormData(data, formData = new FormData(), parentKey = null) {
	for (const key in data) if (Object.prototype.hasOwnProperty.call(data, key)) appendToFormData(formData, parentKey ? `${parentKey}[${key}]` : key, data[key]);
	return formData;
}
function appendToFormData(formData, key, value) {
	if (Array.isArray(value)) return value.forEach((val, index) => appendToFormData(formData, `${key}[${index}]`, val));
	else if (value instanceof Date) return formData.append(key, value.toISOString());
	else if (typeof File !== "undefined" && value instanceof File) return formData.append(key, value, value.name);
	else if (value instanceof Blob) return formData.append(key, value);
	else if (typeof value === "boolean") return formData.append(key, value ? "1" : "0");
	else if (typeof value === "string") return formData.append(key, value);
	else if (typeof value === "number") return formData.append(key, `${value}`);
	else if (value === null || value === void 0) return formData.append(key, "");
	toFormData(value, formData, key);
}
/**
* Prepare the request body.
*/
function prepareBody(data, headers) {
	if (data === void 0 || data === null) return;
	if (data instanceof FormData) return data;
	if (typeof data === "object" && hasFiles$1(data)) return toFormData(data);
	if (typeof data === "object" || headers["Content-Type"]?.includes("application/json")) return JSON.stringify(data);
	return String(data);
}
/**
* Parse response headers into a plain object.
*/
function parseHeaders$1(headers) {
	const result = {};
	headers.forEach((value, key) => {
		result[key.toLowerCase()] = value;
	});
	return result;
}
/**
* Create a fetch-based HTTP client.
*/
function createFetchClient(options = {}) {
	let xsrfCookieName = options.xsrfCookieName ?? "XSRF-TOKEN";
	let xsrfHeaderName = options.xsrfHeaderName ?? "X-XSRF-TOKEN";
	function getXsrfToken() {
		if (typeof document === "undefined") return null;
		const match = document.cookie.match(new RegExp("(^|;\\s*)" + xsrfCookieName + "=([^;]*)"));
		return match ? decodeURIComponent(match[2]) : null;
	}
	return {
		setXsrfCookieName(name) {
			xsrfCookieName = name;
		},
		setXsrfHeaderName(name) {
			xsrfHeaderName = name;
		},
		async request(config) {
			const url = buildUrl(config.url, config.baseURL, config.params);
			const method = config.method.toUpperCase();
			const headers = {};
			const ajaxHeader = getAjaxHeader();
			if (ajaxHeader) headers["X-Requested-With"] = ajaxHeader;
			if (config.data !== void 0 && !["GET", "DELETE"].includes(method)) {
				if (!(config.data instanceof FormData) && !hasFiles$1(config.data)) headers["Content-Type"] = "application/json";
			}
			if (config.headers) Object.entries(config.headers).forEach(([key, value]) => {
				if (value !== void 0) headers[key] = String(value);
			});
			const xsrfToken = getXsrfToken();
			if (xsrfToken && ![
				"GET",
				"HEAD",
				"OPTIONS"
			].includes(method)) headers[xsrfHeaderName] = xsrfToken;
			let signal = config.signal;
			let timeoutId;
			const timeout = config.timeout ?? 3e4;
			if (timeout > 0 && !signal) {
				const controller = new AbortController();
				signal = controller.signal;
				timeoutId = setTimeout(() => controller.abort(), timeout);
			}
			const body = ["GET", "DELETE"].includes(method) ? void 0 : prepareBody(config.data, headers);
			if (body instanceof FormData) delete headers["Content-Type"];
			try {
				const response = await fetch(url, {
					method,
					headers,
					body,
					signal,
					credentials: config.credentials ?? "same-origin"
				});
				if (timeoutId) clearTimeout(timeoutId);
				let data;
				if (response.headers.get("content-type")?.includes("application/json")) data = await response.json();
				else data = await response.text();
				const httpResponse = {
					status: response.status,
					data,
					headers: parseHeaders$1(response.headers)
				};
				if (!response.ok) throw new HttpResponseError$1(httpResponse);
				return httpResponse;
			} catch (error) {
				if (timeoutId) clearTimeout(timeoutId);
				if (error instanceof HttpResponseError$1) throw error;
				if (error instanceof DOMException && error.name === "AbortError") throw new HttpCancelledError$1();
				if (error instanceof TypeError) throw new HttpNetworkError$1(error.message);
				throw error;
			}
		}
	};
}
/**
* Default fetch HTTP client instance.
*/
var fetchHttpClient = createFetchClient();
//#endregion
//#region node_modules/laravel-precognition/dist/client.js
/**
* The configured HTTP client.
*/
var httpClient$1 = fetchHttpClient;
/**
* The configured base URL.
*/
var baseURL = void 0;
/**
* The configured default timeout.
*/
var timeout = void 0;
/**
* The configured credentials mode.
*/
var credentials = "same-origin";
/**
* The request fingerprint resolver.
*/
var requestFingerprintResolver = (config) => `${config.method}:${config.baseURL ?? baseURL ?? ""}${config.url}`;
/**
* The precognition success resolver.
*/
var successResolver = (response) => response.status === 204 && response.headers["precognition-success"] === "true";
/**
* The abort controller cache.
*/
var abortControllers = {};
/**
* The precognitive HTTP client instance.
*/
var client = {
	get: (url, data = {}, config = {}) => request(mergeConfig("get", url, data, config)),
	post: (url, data = {}, config = {}) => request(mergeConfig("post", url, data, config)),
	patch: (url, data = {}, config = {}) => request(mergeConfig("patch", url, data, config)),
	put: (url, data = {}, config = {}) => request(mergeConfig("put", url, data, config)),
	delete: (url, data = {}, config = {}) => request(mergeConfig("delete", url, data, config)),
	useHttpClient(newHttpClient) {
		httpClient$1 = newHttpClient;
		return client;
	},
	withBaseURL(url) {
		baseURL = url;
		return client;
	},
	withTimeout(duration) {
		timeout = duration;
		return client;
	},
	withCredentials(value) {
		credentials = typeof value === "string" ? value : value ? "include" : "omit";
		return client;
	},
	fingerprintRequestsUsing(callback) {
		requestFingerprintResolver = callback === null ? () => null : callback;
		return client;
	},
	determineSuccessUsing(callback) {
		successResolver = callback;
		return client;
	},
	withXsrfCookieName(name) {
		fetchHttpClient.setXsrfCookieName(name);
		return client;
	},
	withXsrfHeaderName(name) {
		fetchHttpClient.setXsrfHeaderName(name);
		return client;
	}
};
/**
* Merge the client specified arguments with the provided configuration.
*/
var mergeConfig = (method, url, data, config) => ({
	url,
	method,
	...config,
	...["get", "delete"].includes(method) ? { params: merge({}, data, config?.params) } : { data: merge({}, data, config?.data) }
});
/**
* Send and handle a new request.
*/
var request = (userConfig = {}) => {
	const config = [
		resolveConfig,
		abortMatchingRequests,
		refreshAbortController
	].reduce((config, callback) => callback(config), userConfig);
	if ((config.onBefore ?? (() => true))() === false) return Promise.resolve(null);
	(config.onStart ?? (() => null))();
	return httpClient$1.request({
		method: config.method,
		url: config.url,
		baseURL: config.baseURL ?? baseURL,
		data: config.data,
		params: config.params,
		headers: config.headers,
		signal: config.signal,
		timeout: config.timeout,
		credentials
	}).then(async (response) => {
		if (config.precognitive) validatePrecognitionResponse(response);
		const status = response.status;
		let payload = response;
		if (config.precognitive && config.onPrecognitionSuccess && successResolver(response)) payload = await Promise.resolve(config.onPrecognitionSuccess(response) ?? payload);
		if (config.onSuccess && isSuccess(status)) payload = await Promise.resolve(config.onSuccess(payload) ?? payload);
		return (resolveStatusHandler(config, status) ?? ((response) => response))(payload) ?? payload;
	}, (error) => {
		if (isNotServerGeneratedError(error)) return Promise.reject(error);
		const httpError = error;
		if (config.precognitive) validatePrecognitionResponse(httpError.response);
		return (resolveStatusHandler(config, httpError.response.status) ?? ((_, error) => Promise.reject(error)))(httpError.response, httpError);
	}).finally(config.onFinish ?? (() => null));
};
/**
* Resolve the configuration.
*/
var resolveConfig = (config) => {
	const only = config.only ?? config.validate;
	return {
		...config,
		timeout: config.timeout ?? timeout,
		precognitive: config.precognitive !== false,
		fingerprint: typeof config.fingerprint === "undefined" ? requestFingerprintResolver(config, httpClient$1) : config.fingerprint,
		headers: {
			...config.headers,
			"Accept": "application/json",
			"Content-Type": resolveContentType(config),
			...config.precognitive !== false ? { Precognition: true } : {},
			...only ? { "Precognition-Validate-Only": Array.from(only).join() } : {}
		}
	};
};
/**
* Determine if the status is successful.
*/
var isSuccess = (status) => status >= 200 && status < 300;
/**
* Abort an existing request with the same configured fingerprint.
*/
var abortMatchingRequests = (config) => {
	if (typeof config.fingerprint !== "string") return config;
	abortControllers[config.fingerprint]?.abort();
	delete abortControllers[config.fingerprint];
	return config;
};
/**
* Create and configure the abort controller for a new request.
*/
var refreshAbortController = (config) => {
	if (typeof config.fingerprint !== "string" || config.signal || !config.precognitive) return config;
	abortControllers[config.fingerprint] = new AbortController();
	return {
		...config,
		signal: abortControllers[config.fingerprint].signal
	};
};
/**
* Ensure that the response is a Precognition response.
*/
var validatePrecognitionResponse = (response) => {
	if (response.headers?.precognition !== "true") throw Error("Did not receive a Precognition response. Ensure you have the Precognition middleware in place for the route.");
};
/**
* Determine if the error was not triggered by a server response.
*/
var isNotServerGeneratedError = (error) => {
	return !(error instanceof HttpResponseError$1) || typeof error.response?.status !== "number";
};
/**
* Resolve the handler for the given HTTP response status.
*/
var resolveStatusHandler = (config, code) => ({
	401: config.onUnauthorized,
	403: config.onForbidden,
	404: config.onNotFound,
	409: config.onConflict,
	422: config.onValidationError,
	423: config.onLocked
})[code];
/**
* Resolve the request's "Content-Type" header.
*/
var resolveContentType = (config) => config.headers?.["Content-Type"] ?? config.headers?.["Content-type"] ?? config.headers?.["content-type"] ?? (hasFiles$1(config.data) ? "multipart/form-data" : "application/json");
//#endregion
//#region node_modules/laravel-precognition/dist/validator.js
/**
* Expand a wildcard path to concrete paths using the given data.
*
* Examples:
* - 'users.*' with {users: [{name: 'A'}, {name: 'B'}]} => ['users.0', 'users.1']
* - 'users.*.name' with {users: [{name: 'A'}, {name: 'B'}]} => ['users.0.name', 'users.1.name']
* - 'author.*' with {author: {name: 'John', bio: 'Dev'}} => ['author.name', 'author.bio']
*/
var expandWildcardPaths = (pattern, data) => {
	if (!pattern.includes("*")) return [pattern];
	const parts = pattern.split(".");
	let paths = [""];
	for (const part of parts) if (part === "*") {
		const expanded = [];
		for (const path of paths) {
			const value = path ? get(data, path) : data;
			if (Array.isArray(value)) for (let index = 0; index < value.length; index++) expanded.push(path ? `${path}.${index}` : String(index));
			else if (value !== null && typeof value === "object") for (const key of Object.keys(value)) expanded.push(path ? `${path}.${key}` : key);
		}
		paths = expanded;
	} else paths = paths.map((path) => path ? `${path}.${part}` : part);
	return paths;
};
/**
* Determine if a key matches the given pattern.
*/
var keyMatchesPattern = (key, pattern) => {
	if (!pattern.includes("*")) return key === pattern;
	return new RegExp("^" + pattern.replace(/\./g, "\\.").replace(/\*/g, "[^.]+") + "$").test(key);
};
/**
* Omit entries from an object whose keys match the given patterns.
*/
var omitByPattern = (obj, patterns) => {
	return Object.fromEntries(Object.entries(obj).filter(([key]) => {
		return !patterns.some((pattern) => keyMatchesPattern(key, pattern));
	}));
};
var createValidator = (callback, initialData = {}) => {
	/**
	* Event listener state.
	*/
	const listeners = {
		errorsChanged: [],
		touchedChanged: [],
		validatingChanged: [],
		validatedChanged: []
	};
	/**
	* Validate files state.
	*/
	let validateFiles = false;
	/**
	* Processing validation state.
	*/
	let validating = false;
	/**
	* Set the validating inputs.
	*
	* Returns an array of listeners that should be invoked once all state
	* changes have taken place.
	*/
	const setValidating = (value) => {
		if (value !== validating) {
			validating = value;
			return listeners.validatingChanged;
		}
		return [];
	};
	/**
	* Inputs that have been validated.
	*/
	let validated = [];
	/**
	* Set the validated inputs.
	*
	* Returns an array of listeners that should be invoked once all state
	* changes have taken place.
	*/
	const setValidated = (value) => {
		const uniqueNames = [...new Set(value)];
		if (validated.length !== uniqueNames.length || !uniqueNames.every((name) => validated.includes(name))) {
			validated = uniqueNames;
			return listeners.validatedChanged;
		}
		return [];
	};
	/**
	* Valid validation state.
	*/
	const valid = () => validated.filter((name) => typeof errors[name] === "undefined");
	/**
	* Touched input state.
	*/
	let touched = [];
	/**
	* Set the touched inputs.
	*
	* Returns an array of listeners that should be invoked once all state
	* changes have taken place.
	*/
	const setTouched = (value) => {
		const uniqueNames = [...new Set(value)];
		if (touched.length !== uniqueNames.length || !uniqueNames.every((name) => touched.includes(name))) {
			touched = uniqueNames;
			return listeners.touchedChanged;
		}
		return [];
	};
	/**
	* Validation errors state.
	*/
	let errors = {};
	/**
	* Set the input errors.
	*
	* Returns an array of listeners that should be invoked once all state
	* changes have taken place.
	*/
	const setErrors = (value) => {
		const prepared = toValidationErrors(value);
		if (!isEqual(errors, prepared)) {
			errors = prepared;
			return listeners.errorsChanged;
		}
		return [];
	};
	/**
	* Forget the given input's errors.
	*
	* Returns an array of listeners that should be invoked once all state
	* changes have taken place.
	*/
	const forgetError = (name) => {
		const newErrors = { ...errors };
		delete newErrors[resolveName(name)];
		return setErrors(newErrors);
	};
	/**
	* Has errors state.
	*/
	const hasErrors = () => Object.keys(errors).length > 0;
	/**
	* Debouncing timeout state.
	*/
	let debounceTimeoutDuration = 1500;
	const setDebounceTimeout = (value) => {
		debounceTimeoutDuration = value;
		validator.cancel();
		validator = createValidator();
	};
	/**
	* The old data.
	*/
	let oldData = initialData;
	/**
	* The data currently being validated.
	*/
	let validatingData = null;
	/**
	* The old touched.
	*/
	let oldTouched = [];
	/**
	* The touched currently being validated.
	*/
	let validatingTouched = null;
	/**
	* Create a debounced validation callback.
	*/
	const createValidator = () => debounce$1((instanceConfig) => {
		callback({
			get: (url, data = {}, globalConfig = {}) => client.get(url, parseData(data), resolveConfig(globalConfig, instanceConfig, data)),
			post: (url, data = {}, globalConfig = {}) => client.post(url, parseData(data), resolveConfig(globalConfig, instanceConfig, data)),
			patch: (url, data = {}, globalConfig = {}) => client.patch(url, parseData(data), resolveConfig(globalConfig, instanceConfig, data)),
			put: (url, data = {}, globalConfig = {}) => client.put(url, parseData(data), resolveConfig(globalConfig, instanceConfig, data)),
			delete: (url, data = {}, globalConfig = {}) => client.delete(url, parseData(data), resolveConfig(globalConfig, instanceConfig, data))
		}).catch((error) => {
			if (error instanceof HttpCancelledError$1) return null;
			if (error instanceof HttpResponseError$1 && error.response?.status === 422) return null;
			return Promise.reject(error);
		});
	}, debounceTimeoutDuration, {
		leading: true,
		trailing: true
	});
	/**
	* Validator state.
	*/
	let validator = createValidator();
	/**
	* Resolve the configuration.
	*/
	const resolveConfig = (globalConfig, instanceConfig, data = {}) => {
		const config = {
			...globalConfig,
			...instanceConfig
		};
		const only = Array.from(config.only ?? config.validate ?? touched);
		return {
			...instanceConfig,
			...merge({}, globalConfig, instanceConfig),
			only,
			timeout: config.timeout ?? 5e3,
			onValidationError: (response, error) => {
				[...setValidated([...validated, ...only]), ...setErrors(merge(omitByPattern({ ...errors }, only), response.data.errors))].forEach((listener) => listener());
				return config.onValidationError ? config.onValidationError(response, error) : Promise.reject(error);
			},
			onSuccess: (response) => {
				setValidated([...validated, ...only]).forEach((listener) => listener());
				return config.onSuccess ? config.onSuccess(response) : response;
			},
			onPrecognitionSuccess: (response) => {
				[...setValidated([...validated, ...only]), ...setErrors(omitByPattern({ ...errors }, only))].forEach((listener) => listener());
				return config.onPrecognitionSuccess ? config.onPrecognitionSuccess(response) : response;
			},
			onBefore: () => {
				const hasWildcards = touched.some((name) => name.includes("*"));
				const expandedTouched = hasWildcards ? [...new Set(touched.flatMap((name) => expandWildcardPaths(name, data)))] : touched;
				if (config.onBeforeValidation && config.onBeforeValidation({
					data,
					touched: expandedTouched
				}, {
					data: oldData,
					touched: oldTouched
				}) === false) return false;
				if ((config.onBefore || (() => true))() === false) return false;
				if (hasWildcards) setTouched(expandedTouched).forEach((listener) => listener());
				validatingTouched = touched;
				validatingData = data;
				return true;
			},
			onStart: () => {
				setValidating(true).forEach((listener) => listener());
				(config.onStart ?? (() => null))();
			},
			onFinish: () => {
				setValidating(false).forEach((listener) => listener());
				oldTouched = validatingTouched;
				oldData = validatingData;
				validatingTouched = validatingData = null;
				(config.onFinish ?? (() => null))();
			}
		};
	};
	/**
	* Validate the given input.
	*/
	const validate = (name, value, config) => {
		if (typeof name === "undefined") {
			const only = Array.from(config?.only ?? config?.validate ?? []);
			setTouched([...touched, ...only]).forEach((listener) => listener());
			validator(config ?? {});
			return;
		}
		if (isFile$1(value) && !validateFiles) {
			console.warn("Precognition file validation is not active. Call the \"validateFiles\" function on your form to enable it.");
			return;
		}
		name = resolveName(name);
		if (name.includes("*") || get(oldData, name) !== value) {
			setTouched([name, ...touched]).forEach((listener) => listener());
			validator(config ?? {});
		}
	};
	/**
	* Parse the validated data.
	*/
	const parseData = (data) => validateFiles === false ? forgetFiles(data) : data;
	/**
	* The form validator instance.
	*/
	const form = {
		touched: () => touched,
		validate(name, value, config) {
			if (typeof name === "object" && !("target" in name)) {
				config = name;
				name = value = void 0;
			}
			validate(name, value, config);
			return form;
		},
		touch(input) {
			const inputs = Array.isArray(input) ? input : [resolveName(input)];
			setTouched([...touched, ...inputs]).forEach((listener) => listener());
			return form;
		},
		validating: () => validating,
		valid,
		errors: () => errors,
		hasErrors,
		setErrors(value) {
			setErrors(value).forEach((listener) => listener());
			return form;
		},
		forgetError(name) {
			forgetError(name).forEach((listener) => listener());
			return form;
		},
		defaults(data) {
			initialData = data;
			oldData = data;
			return form;
		},
		reset(...names) {
			if (names.length === 0) setTouched([]).forEach((listener) => listener());
			else {
				const newTouched = [...touched];
				names.forEach((name) => {
					if (newTouched.includes(name)) newTouched.splice(newTouched.indexOf(name), 1);
					set(oldData, name, get(initialData, name));
				});
				setTouched(newTouched).forEach((listener) => listener());
			}
			return form;
		},
		setTimeout(value) {
			setDebounceTimeout(value);
			return form;
		},
		on(event, callback) {
			listeners[event].push(callback);
			return form;
		},
		validateFiles() {
			validateFiles = true;
			return form;
		},
		withoutFileValidation() {
			validateFiles = false;
			return form;
		}
	};
	return form;
};
/**
* Normalise the validation errors as Inertia formatted errors.
*/
var toSimpleValidationErrors = (errors) => {
	return Object.keys(errors).reduce((carry, key) => ({
		...carry,
		[key]: Array.isArray(errors[key]) ? errors[key][0] : errors[key]
	}), {});
};
/**
* Normalise the validation errors as Laravel formatted errors.
*/
var toValidationErrors = (errors) => {
	return Object.keys(errors).reduce((carry, key) => ({
		...carry,
		[key]: typeof errors[key] === "string" ? [errors[key]] : errors[key]
	}), {});
};
/**
* Resolve the input's "name" attribute.
*/
var resolveName = (name) => {
	return typeof name !== "string" ? name.target.name : name;
};
/**
* Forget any files from the payload.
*/
var forgetFiles = (data) => {
	const newData = { ...data };
	Object.keys(newData).forEach((name) => {
		const value = newData[name];
		if (value === null) return;
		if (isFile$1(value)) {
			delete newData[name];
			return;
		}
		if (Array.isArray(value)) {
			newData[name] = Object.values(forgetFiles({ ...value }));
			return;
		}
		if (typeof value === "object") {
			newData[name] = forgetFiles(newData[name]);
			return;
		}
	});
	return newData;
};
//#endregion
//#region node_modules/@inertiajs/core/dist/index.js
var Config = class {
	config = {};
	defaults;
	constructor(defaults) {
		this.defaults = defaults;
	}
	extend(defaults) {
		if (defaults) this.defaults = {
			...this.defaults,
			...defaults
		};
		return this;
	}
	replace(newConfig) {
		this.config = newConfig;
	}
	get(key) {
		return has(this.config, key) ? get(this.config, key) : get(this.defaults, key);
	}
	set(keyOrValues, value) {
		if (typeof keyOrValues === "string") set(this.config, keyOrValues, value);
		else Object.entries(keyOrValues).forEach(([key, val]) => {
			set(this.config, key, val);
		});
	}
};
var config$1 = new Config({
	form: {
		recentlySuccessfulDuration: 2e3,
		forceIndicesArrayFormatInFormData: true,
		withAllErrors: false
	},
	prefetch: {
		cacheFor: 3e4,
		hoverDelay: 75
	}
});
function debounce(fn, delay) {
	let timeoutID;
	return function(...args) {
		clearTimeout(timeoutID);
		timeoutID = setTimeout(() => fn.apply(this, args), delay);
	};
}
function fireEvent(name, options) {
	return document.dispatchEvent(new CustomEvent(`inertia:${name}`, options));
}
var fireBeforeEvent = (visit) => {
	return fireEvent("before", {
		cancelable: true,
		detail: { visit }
	});
};
var fireErrorEvent = (errors) => {
	return fireEvent("error", { detail: { errors } });
};
var fireNetworkErrorEvent = (error) => {
	return fireEvent("networkError", {
		cancelable: true,
		detail: { error }
	});
};
var fireFinishEvent = (visit) => {
	return fireEvent("finish", { detail: { visit } });
};
var fireHttpExceptionEvent = (response) => {
	return fireEvent("httpException", {
		cancelable: true,
		detail: { response }
	});
};
var fireBeforeUpdateEvent = (page2) => {
	return fireEvent("beforeUpdate", { detail: { page: page2 } });
};
var fireNavigateEvent = (page2) => {
	return fireEvent("navigate", { detail: { page: page2 } });
};
var fireProgressEvent = (progress3) => {
	return fireEvent("progress", { detail: { progress: progress3 } });
};
var fireStartEvent = (visit) => {
	return fireEvent("start", { detail: { visit } });
};
var fireSuccessEvent = (page2) => {
	return fireEvent("success", { detail: { page: page2 } });
};
var firePrefetchedEvent = (response, visit) => {
	return fireEvent("prefetched", { detail: {
		fetchedAt: Date.now(),
		response,
		visit
	} });
};
var firePrefetchingEvent = (visit) => {
	return fireEvent("prefetching", { detail: { visit } });
};
var fireFlashEvent = (flash) => {
	return fireEvent("flash", { detail: { flash } });
};
var SessionStorage = class {
	static locationVisitKey = "inertiaLocationVisit";
	static set(key, value) {
		if (typeof window !== "undefined") window.sessionStorage.setItem(key, JSON.stringify(value));
	}
	static get(key) {
		if (typeof window !== "undefined") return JSON.parse(window.sessionStorage.getItem(key) || "null");
	}
	static merge(key, value) {
		const existing = this.get(key);
		if (existing === null) this.set(key, value);
		else this.set(key, {
			...existing,
			...value
		});
	}
	static remove(key) {
		if (typeof window !== "undefined") window.sessionStorage.removeItem(key);
	}
	static removeNested(key, nestedKey) {
		const existing = this.get(key);
		if (existing !== null) {
			delete existing[nestedKey];
			this.set(key, existing);
		}
	}
	static exists(key) {
		try {
			return this.get(key) !== null;
		} catch (error) {
			return false;
		}
	}
	static clear() {
		if (typeof window !== "undefined") window.sessionStorage.clear();
	}
};
var encryptHistory = async (data) => {
	if (typeof window === "undefined") throw new Error("Unable to encrypt history");
	const iv = getIv();
	const key = await getOrCreateKey(await getKeyFromSessionStorage());
	if (!key) throw new Error("Unable to encrypt history");
	return await encryptData(iv, key, data);
};
var historySessionStorageKeys = {
	key: "historyKey",
	iv: "historyIv"
};
var decryptHistory = async (data) => {
	const iv = getIv();
	const storedKey = await getKeyFromSessionStorage();
	if (!storedKey) throw new Error("Unable to decrypt history");
	return await decryptData(iv, storedKey, data);
};
var encryptData = async (iv, key, data) => {
	if (typeof window === "undefined") throw new Error("Unable to encrypt history");
	if (typeof window.crypto.subtle === "undefined") {
		console.warn("Encryption is not supported in this environment. SSL is required.");
		return Promise.resolve(data);
	}
	const textEncoder = new TextEncoder();
	const str = JSON.stringify(data);
	const encoded = new Uint8Array(str.length * 3);
	const result = textEncoder.encodeInto(str, encoded);
	return window.crypto.subtle.encrypt({
		name: "AES-GCM",
		iv
	}, key, encoded.subarray(0, result.written));
};
var decryptData = async (iv, key, data) => {
	if (typeof window.crypto.subtle === "undefined") {
		console.warn("Decryption is not supported in this environment. SSL is required.");
		return Promise.resolve(data);
	}
	const decrypted = await window.crypto.subtle.decrypt({
		name: "AES-GCM",
		iv
	}, key, data);
	return JSON.parse(new TextDecoder().decode(decrypted));
};
var getIv = () => {
	const ivString = SessionStorage.get(historySessionStorageKeys.iv);
	if (ivString) return new Uint8Array(ivString);
	const iv = window.crypto.getRandomValues(new Uint8Array(12));
	SessionStorage.set(historySessionStorageKeys.iv, Array.from(iv));
	return iv;
};
var createKey = async () => {
	if (typeof window.crypto.subtle === "undefined") {
		console.warn("Encryption is not supported in this environment. SSL is required.");
		return Promise.resolve(null);
	}
	return window.crypto.subtle.generateKey({
		name: "AES-GCM",
		length: 256
	}, true, ["encrypt", "decrypt"]);
};
var saveKey = async (key) => {
	if (typeof window.crypto.subtle === "undefined") {
		console.warn("Encryption is not supported in this environment. SSL is required.");
		return Promise.resolve();
	}
	const keyData = await window.crypto.subtle.exportKey("raw", key);
	SessionStorage.set(historySessionStorageKeys.key, Array.from(new Uint8Array(keyData)));
};
var getOrCreateKey = async (key) => {
	if (key) return key;
	const newKey = await createKey();
	if (!newKey) return null;
	await saveKey(newKey);
	return newKey;
};
var getKeyFromSessionStorage = async () => {
	const stringKey = SessionStorage.get(historySessionStorageKeys.key);
	if (!stringKey) return null;
	return await window.crypto.subtle.importKey("raw", new Uint8Array(stringKey), {
		name: "AES-GCM",
		length: 256
	}, true, ["encrypt", "decrypt"]);
};
var stripTopLevelUndefined = (obj) => {
	const result = {};
	for (const key of Object.keys(obj)) if (obj[key] !== void 0) result[key] = obj[key];
	return result;
};
var objectsAreEqual = (obj1, obj2, excludeKeys) => {
	if (obj1 === obj2) return true;
	for (const key in obj1) {
		if (excludeKeys.includes(key)) continue;
		if (obj1[key] === obj2[key]) continue;
		if (!compareValues(obj1[key], obj2[key])) return false;
	}
	for (const key in obj2) {
		if (excludeKeys.includes(key)) continue;
		if (!(key in obj1)) return false;
	}
	return true;
};
var compareValues = (value1, value2) => {
	switch (typeof value1) {
		case "object": return objectsAreEqual(value1, value2, []);
		case "function": return value1.toString() === value2.toString();
		default: return value1 === value2;
	}
};
var conversionMap = {
	ms: 1,
	s: 1e3,
	m: 1e3 * 60,
	h: 1e3 * 60 * 60,
	d: 1e3 * 60 * 60 * 24
};
var timeToMs = (time) => {
	if (typeof time === "number") return time;
	for (const [unit, conversion] of Object.entries(conversionMap)) if (time.endsWith(unit)) return parseFloat(time) * conversion;
	return parseInt(time);
};
var PrefetchedRequests = class {
	cached = [];
	inFlightRequests = [];
	removalTimers = [];
	currentUseId = null;
	add(params, sendFunc, { cacheFor, cacheTags }) {
		if (this.findInFlight(params)) return Promise.resolve();
		const existing = this.findCached(params);
		if (!params.fresh && existing && existing.staleTimestamp > Date.now()) return Promise.resolve();
		const [stale, prefetchExpiresIn] = this.extractStaleValues(cacheFor);
		const promise = new Promise((resolve, reject) => {
			sendFunc({
				...params,
				onCancel: () => {
					this.remove(params);
					params.onCancel();
					reject();
				},
				onError: (error) => {
					this.remove(params);
					params.onError(error);
					reject();
				},
				onPrefetching(visitParams) {
					params.onPrefetching(visitParams);
				},
				onPrefetched(response, visit) {
					params.onPrefetched(response, visit);
				},
				onPrefetchResponse(response) {
					resolve(response);
				},
				onPrefetchError(error) {
					prefetchedRequests.removeFromInFlight(params);
					reject(error);
				}
			});
		}).then((response) => {
			this.remove(params);
			const pageResponse = response.getPageResponse();
			page$1.mergeOncePropsIntoResponse(pageResponse);
			this.cached.push({
				params: { ...params },
				staleTimestamp: Date.now() + stale,
				expiresAt: Date.now() + prefetchExpiresIn,
				response: promise,
				singleUse: prefetchExpiresIn === 0,
				timestamp: Date.now(),
				inFlight: false,
				tags: Array.isArray(cacheTags) ? cacheTags : [cacheTags]
			});
			const oncePropExpiresIn = this.getShortestOncePropTtl(pageResponse);
			this.scheduleForRemoval(params, oncePropExpiresIn ? Math.min(prefetchExpiresIn, oncePropExpiresIn) : prefetchExpiresIn);
			this.removeFromInFlight(params);
			response.handlePrefetch();
			return response;
		});
		this.inFlightRequests.push({
			params: { ...params },
			response: promise,
			staleTimestamp: null,
			inFlight: true
		});
		return promise;
	}
	removeAll() {
		this.cached = [];
		this.removalTimers.forEach((removalTimer) => {
			clearTimeout(removalTimer.timer);
		});
		this.removalTimers = [];
	}
	removeByTags(tags) {
		this.cached = this.cached.filter((prefetched) => {
			return !prefetched.tags.some((tag) => tags.includes(tag));
		});
	}
	remove(params) {
		this.cached = this.cached.filter((prefetched) => {
			return !this.paramsAreEqual(prefetched.params, params);
		});
		this.clearTimer(params);
	}
	removeFromInFlight(params) {
		this.inFlightRequests = this.inFlightRequests.filter((prefetching) => {
			return !this.paramsAreEqual(prefetching.params, params);
		});
	}
	extractStaleValues(cacheFor) {
		const [stale, expires] = this.cacheForToStaleAndExpires(cacheFor);
		return [timeToMs(stale), timeToMs(expires)];
	}
	cacheForToStaleAndExpires(cacheFor) {
		if (!Array.isArray(cacheFor)) return [cacheFor, cacheFor];
		switch (cacheFor.length) {
			case 0: return [0, 0];
			case 1: return [cacheFor[0], cacheFor[0]];
			default: return [cacheFor[0], cacheFor[1]];
		}
	}
	clearTimer(params) {
		const timer = this.removalTimers.find((removalTimer) => {
			return this.paramsAreEqual(removalTimer.params, params);
		});
		if (timer) {
			clearTimeout(timer.timer);
			this.removalTimers = this.removalTimers.filter((removalTimer) => removalTimer !== timer);
		}
	}
	scheduleForRemoval(params, expiresIn) {
		if (typeof window === "undefined") return;
		this.clearTimer(params);
		if (expiresIn > 0) {
			const timer = window.setTimeout(() => this.remove(params), expiresIn);
			this.removalTimers.push({
				params,
				timer
			});
		}
	}
	get(params) {
		return this.findCached(params) || this.findInFlight(params);
	}
	use(prefetched, params) {
		const id = `${params.url.pathname}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
		this.currentUseId = id;
		return prefetched.response.then((response) => {
			if (this.currentUseId !== id) return;
			response.mergeParams({
				...params,
				onPrefetched: () => {}
			});
			this.removeSingleUseItems(params);
			return response.handle();
		});
	}
	removeSingleUseItems(params) {
		this.cached = this.cached.filter((prefetched) => {
			if (!this.paramsAreEqual(prefetched.params, params)) return true;
			return !prefetched.singleUse;
		});
	}
	findCached(params) {
		return this.cached.find((prefetched) => {
			return this.paramsAreEqual(prefetched.params, params);
		}) || null;
	}
	findInFlight(params) {
		return this.inFlightRequests.find((prefetched) => {
			return this.paramsAreEqual(prefetched.params, params);
		}) || null;
	}
	withoutPurposePrefetchHeader(params) {
		const newParams = cloneDeep$1(params);
		if (newParams.headers["Purpose"] === "prefetch") delete newParams.headers["Purpose"];
		return newParams;
	}
	paramsAreEqual(params1, params2) {
		return objectsAreEqual(this.withoutPurposePrefetchHeader(params1), this.withoutPurposePrefetchHeader(params2), [
			"showProgress",
			"replace",
			"prefetch",
			"preserveScroll",
			"preserveState",
			"onBefore",
			"onBeforeUpdate",
			"onStart",
			"onProgress",
			"onFinish",
			"onCancel",
			"onSuccess",
			"onError",
			"onFlash",
			"onPrefetched",
			"onCancelToken",
			"onPrefetching",
			"async",
			"viewTransition",
			"optimistic",
			"component",
			"pageProps"
		]);
	}
	updateCachedOncePropsFromCurrentPage() {
		this.cached.forEach((prefetched) => {
			prefetched.response.then((response) => {
				const pageResponse = response.getPageResponse();
				page$1.mergeOncePropsIntoResponse(pageResponse, { force: true });
				for (const [group, deferredProps] of Object.entries(pageResponse.deferredProps ?? {})) {
					const remaining = deferredProps.filter((prop) => get(pageResponse.props, prop) === void 0);
					if (remaining.length > 0) pageResponse.deferredProps[group] = remaining;
					else delete pageResponse.deferredProps[group];
				}
				const oncePropExpiresIn = this.getShortestOncePropTtl(pageResponse);
				if (oncePropExpiresIn === null) return;
				const prefetchExpiresIn = prefetched.expiresAt - Date.now();
				const expiresIn = Math.min(prefetchExpiresIn, oncePropExpiresIn);
				if (expiresIn > 0) this.scheduleForRemoval(prefetched.params, expiresIn);
				else this.remove(prefetched.params);
			});
		});
	}
	getShortestOncePropTtl(page2) {
		const expiryTimestamps = Object.values(page2.onceProps ?? {}).map((onceProp) => onceProp.expiresAt).filter((expiresAt) => !!expiresAt);
		if (expiryTimestamps.length === 0) return null;
		return Math.min(...expiryTimestamps) - Date.now();
	}
};
var prefetchedRequests = new PrefetchedRequests();
var elementInViewport = (el) => {
	if (el.offsetParent === null) return false;
	const rect = el.getBoundingClientRect();
	const verticallyVisible = rect.top < window.innerHeight && rect.bottom >= 0;
	const horizontallyVisible = rect.left < window.innerWidth && rect.right >= 0;
	return verticallyVisible && horizontallyVisible;
};
var getScrollableParent = (element) => {
	const allowsVerticalScroll = (el) => {
		const computedStyle = window.getComputedStyle(el);
		if (computedStyle.overflowY === "scroll") return true;
		if (computedStyle.overflowY !== "auto") return false;
		if (["visible", "clip"].includes(computedStyle.overflowX)) return true;
		return hasDimensionConstraint(computedStyle.maxHeight, el.style.height) || isConstrainedByLayout(el, "height");
	};
	const allowsHorizontalScroll = (el) => {
		const computedStyle = window.getComputedStyle(el);
		if (computedStyle.overflowX === "scroll") return true;
		if (computedStyle.overflowX !== "auto") return false;
		if (["visible", "clip"].includes(computedStyle.overflowY)) return true;
		return hasDimensionConstraint(computedStyle.maxWidth, el.style.width) || isConstrainedByLayout(el, "width");
	};
	const hasDimensionConstraint = (computedMaxDimension, inlineStyleDimension) => {
		if (computedMaxDimension && computedMaxDimension !== "none" && computedMaxDimension !== "0px") return true;
		if (inlineStyleDimension && inlineStyleDimension !== "auto" && inlineStyleDimension !== "0") return true;
		return false;
	};
	const isConstrainedByLayout = (el, dimension) => {
		const parent2 = el.parentElement;
		if (!parent2) return false;
		const parentStyle = window.getComputedStyle(parent2);
		if (["flex", "inline-flex"].includes(parentStyle.display)) {
			const isColumnLayout = ["column", "column-reverse"].includes(parentStyle.flexDirection);
			return dimension === "height" ? isColumnLayout : !isColumnLayout;
		}
		return ["grid", "inline-grid"].includes(parentStyle.display);
	};
	let parent = element?.parentElement;
	while (parent) {
		const allowsScroll = allowsVerticalScroll(parent) || allowsHorizontalScroll(parent);
		if (window.getComputedStyle(parent).display !== "contents" && allowsScroll) return parent;
		parent = parent.parentElement;
	}
	return null;
};
var getElementsInViewportFromCollection = (elements, referenceElement) => {
	if (!referenceElement) return elements.filter((element) => elementInViewport(element));
	const referenceIndex = elements.indexOf(referenceElement);
	const upwardElements = [];
	const downwardElements = [];
	for (let i = referenceIndex; i >= 0; i--) {
		const element = elements[i];
		if (elementInViewport(element)) upwardElements.push(element);
		else break;
	}
	for (let i = referenceIndex + 1; i < elements.length; i++) {
		const element = elements[i];
		if (elementInViewport(element)) downwardElements.push(element);
		else break;
	}
	return [...upwardElements.reverse(), ...downwardElements];
};
var requestAnimationFrame$1 = (cb, times = 1) => {
	window.requestAnimationFrame(() => {
		if (times > 1) requestAnimationFrame$1(cb, times - 1);
		else cb();
	});
};
var getInitialPageFromDOM = (id) => {
	if (typeof window === "undefined") return null;
	const scriptEl = document.querySelector(`script[data-page="${id}"][type="application/json"]`);
	if (scriptEl?.textContent) return JSON.parse(scriptEl.textContent);
	return null;
};
var isServer = typeof window === "undefined";
var isFirefox = !isServer && /Firefox/i.test(window.navigator.userAgent);
var Scroll = class {
	static save() {
		history.saveScrollPositions(this.getScrollRegions());
	}
	static getScrollRegions() {
		return Array.from(this.regions()).map((region) => ({
			top: region.scrollTop,
			left: region.scrollLeft
		}));
	}
	static regions() {
		return document.querySelectorAll("[scroll-region]");
	}
	static scrollToTop() {
		if (isFirefox && getComputedStyle(document.documentElement).scrollBehavior === "smooth") return requestAnimationFrame$1(() => window.scrollTo(0, 0), 2);
		window.scrollTo(0, 0);
	}
	static reset() {
		if (!(isServer ? null : window.location.hash)) this.scrollToTop();
		this.regions().forEach((region) => {
			if (typeof region.scrollTo === "function") region.scrollTo(0, 0);
			else {
				region.scrollTop = 0;
				region.scrollLeft = 0;
			}
		});
		this.save();
		this.scrollToAnchor();
	}
	static scrollToAnchor() {
		const anchorHash = isServer ? null : window.location.hash;
		if (anchorHash) setTimeout(() => {
			const anchorElement = document.getElementById(anchorHash.slice(1));
			anchorElement ? anchorElement.scrollIntoView() : this.scrollToTop();
		});
	}
	static restore(scrollRegions) {
		if (isServer) return;
		window.requestAnimationFrame(() => {
			this.restoreDocument();
			this.restoreScrollRegions(scrollRegions);
		});
	}
	static restoreScrollRegions(scrollRegions) {
		if (isServer) return;
		this.regions().forEach((region, index) => {
			const scrollPosition = scrollRegions[index];
			if (!scrollPosition) return;
			if (typeof region.scrollTo === "function") region.scrollTo(scrollPosition.left, scrollPosition.top);
			else {
				region.scrollTop = scrollPosition.top;
				region.scrollLeft = scrollPosition.left;
			}
		});
	}
	static restoreDocument() {
		const scrollPosition = history.getDocumentScrollPosition();
		window.scrollTo(scrollPosition.left, scrollPosition.top);
	}
	static onScroll(event) {
		const target = event.target;
		if (typeof target.hasAttribute === "function" && target.hasAttribute("scroll-region")) this.save();
	}
	static onWindowScroll() {
		history.saveDocumentScrollPosition({
			top: window.scrollY,
			left: window.scrollX
		});
	}
};
var isFile = (value) => typeof File !== "undefined" && value instanceof File || value instanceof Blob || typeof FileList !== "undefined" && value instanceof FileList && value.length > 0;
function hasFiles(data) {
	return isFile(data) || data instanceof FormData && Array.from(data.values()).some((value) => hasFiles(value)) || typeof data === "object" && data !== null && Object.values(data).some((value) => hasFiles(value));
}
var isFormData = (value) => value instanceof FormData;
function objectToFormData(source, form = new FormData(), parentKey = null, queryStringArrayFormat = "brackets") {
	source = source || {};
	for (const key in source) if (Object.prototype.hasOwnProperty.call(source, key)) append(form, composeKey(parentKey, key, "indices"), source[key], queryStringArrayFormat);
	return form;
}
function composeKey(parent, key, format) {
	if (!parent) return key;
	return format === "brackets" ? `${parent}[]` : `${parent}[${key}]`;
}
function append(form, key, value, format) {
	if (Array.isArray(value)) return Array.from(value.keys()).forEach((index) => append(form, composeKey(key, index.toString(), format), value[index], format));
	else if (value instanceof Date) return form.append(key, value.toISOString());
	else if (value instanceof File) return form.append(key, value, value.name);
	else if (value instanceof Blob) return form.append(key, value);
	else if (typeof value === "boolean") return form.append(key, value ? "1" : "0");
	else if (typeof value === "string") return form.append(key, value);
	else if (typeof value === "number") return form.append(key, `${value}`);
	else if (value === null || value === void 0) return form.append(key, "");
	objectToFormData(value, form, key, format);
}
function hasIndices(url) {
	return /\[\d+\]/.test(decodeURIComponent(url.search));
}
function parse(query) {
	if (!query || query === "?") return {};
	const result = {};
	query.replace(/^\?/, "").split("&").filter(Boolean).forEach((segment) => {
		const [rawKey, rawValue] = splitPair(segment);
		set2(result, decode(rawKey), decode(rawValue));
	});
	return result;
}
function stringify(data, arrayFormat) {
	const pairs = [];
	build(data, "", pairs, arrayFormat);
	return pairs.length ? "?" + pairs.join("&") : "";
}
function splitPair(pair) {
	const index = pair.indexOf("=");
	return index === -1 ? [pair, ""] : [pair.substring(0, index), pair.substring(index + 1)];
}
function decode(value) {
	return decodeURIComponent(value.replace(/\+/g, " "));
}
function set2(target, key, value) {
	const keys = parseKey(key);
	if (keys.some((k) => k === "__proto__")) return;
	let current = target;
	while (keys.length > 1) {
		const segment = keys.shift();
		const nextIsArrayPush = keys[0] === "";
		if (typeof current[segment] !== "object" || current[segment] === null) current[segment] = nextIsArrayPush ? [] : {};
		current = current[segment];
	}
	const final = keys.shift();
	if (final === "" && Array.isArray(current)) current.push(value);
	else current[final] = value;
}
function parseKey(key) {
	const segments = [];
	const base = key.split("[")[0];
	if (base) segments.push(base);
	let match;
	const pattern = /\[([^\]]*)\]/g;
	while ((match = pattern.exec(key)) !== null) segments.push(match[1]);
	return segments;
}
function build(value, prefix, pairs, arrayFormat) {
	if (value === void 0) return;
	if (value === null) {
		pairs.push(`${prefix}=`);
		return;
	}
	if (Array.isArray(value)) {
		value.forEach((item, index) => {
			build(item, arrayFormat === "indices" ? `${prefix}[${index}]` : `${prefix}[]`, pairs, arrayFormat);
		});
		return;
	}
	if (typeof value === "object") {
		Object.keys(value).forEach((key) => {
			build(value[key], prefix ? `${prefix}[${key}]` : key, pairs, arrayFormat);
		});
		return;
	}
	pairs.push(`${prefix}=${encodeURIComponent(String(value))}`);
}
function hrefToUrl(href) {
	return new URL(href.toString(), typeof window === "undefined" ? void 0 : window.location.toString());
}
var transformUrlAndData = (href, data, method, forceFormData, queryStringArrayFormat) => {
	let url = typeof href === "string" ? hrefToUrl(href) : href;
	if ((hasFiles(data) || forceFormData) && !isFormData(data)) {
		if (config$1.get("form.forceIndicesArrayFormatInFormData")) queryStringArrayFormat = "indices";
		data = objectToFormData(data, new FormData(), null, queryStringArrayFormat);
	}
	if (isFormData(data)) return [url, data];
	const [_href, _data] = mergeDataIntoQueryString(method, url, data, queryStringArrayFormat);
	return [hrefToUrl(_href), _data];
};
function mergeDataIntoQueryString(method, href, data, qsArrayFormat = "brackets") {
	const hasDataForQueryString = method === "get" && !isFormData(data) && Object.keys(data).length > 0;
	const hasHost = urlHasProtocol(href.toString());
	const hasAbsolutePath = hasHost || href.toString().startsWith("/") || href.toString() === "";
	const hasRelativePath = !hasAbsolutePath && !href.toString().startsWith("#") && !href.toString().startsWith("?");
	const hasRelativePathWithDotPrefix = /^[.]{1,2}([/]|$)/.test(href.toString());
	const hasSearch = href.toString().includes("?") || hasDataForQueryString;
	const hasHash = href.toString().includes("#");
	const url = new URL(href.toString(), typeof window === "undefined" ? "http://localhost" : window.location.toString());
	if (hasDataForQueryString) {
		const arrayFormat = hasIndices(url) ? "indices" : qsArrayFormat;
		url.search = stringify({
			...parse(url.search),
			...data
		}, arrayFormat);
	}
	return [[
		hasHost ? `${url.protocol}//${url.host}` : "",
		hasAbsolutePath ? url.pathname : "",
		hasRelativePath ? url.pathname.substring(hasRelativePathWithDotPrefix ? 0 : 1) : "",
		hasSearch ? url.search : "",
		hasHash ? url.hash : ""
	].join(""), hasDataForQueryString ? {} : data];
}
function urlWithoutHash(url) {
	url = new URL(url.href);
	url.hash = "";
	return url;
}
var setHashIfSameUrl = (originUrl, destinationUrl) => {
	if (originUrl.hash && !destinationUrl.hash && urlWithoutHash(originUrl).href === destinationUrl.href) destinationUrl.hash = originUrl.hash;
};
var isSameUrlWithoutHash = (url1, url2) => {
	return urlWithoutHash(url1).href === urlWithoutHash(url2).href;
};
var isSameUrlWithoutQueryOrHash = (url1, url2) => {
	return url1.origin === url2.origin && url1.pathname === url2.pathname;
};
function isUrlMethodPair(href) {
	return href !== null && typeof href === "object" && href !== void 0 && "url" in href && "method" in href;
}
function resolveUrlMethodPairComponent(pair) {
	if (!pair.component) return null;
	if (typeof pair.component !== "string") {
		console.error(`The "component" property on the URL method pair received multiple components (${Object.keys(pair.component).join(", ")}), but only a single component string is supported for instant visits. Use the withComponent() method to specify which component to use.`);
		return null;
	}
	return pair.component;
}
function urlHasProtocol(url) {
	return /^([a-z][a-z0-9+.-]*:)?\/\/[^/]/i.test(url);
}
function urlToString(url, absolute) {
	const urlObj = typeof url === "string" ? hrefToUrl(url) : url;
	return absolute ? `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}${urlObj.search}${urlObj.hash}` : `${urlObj.pathname}${urlObj.search}${urlObj.hash}`;
}
var CurrentPage = class {
	page;
	swapComponent;
	resolveComponent;
	onFlashCallback;
	componentId = {};
	listeners = [];
	isFirstPageLoad = true;
	cleared = false;
	pendingDeferredProps = null;
	historyQuotaExceeded = false;
	optimisticBaseline = {};
	pendingOptimistics = [];
	optimisticCounter = 0;
	init({ initialPage, swapComponent, resolveComponent, onFlash }) {
		this.page = {
			...initialPage,
			flash: initialPage.flash ?? {},
			rescuedProps: initialPage.rescuedProps ?? []
		};
		this.swapComponent = swapComponent;
		this.resolveComponent = resolveComponent;
		this.onFlashCallback = onFlash;
		eventHandler.on("historyQuotaExceeded", () => {
			this.historyQuotaExceeded = true;
		});
		return this;
	}
	set(page2, { replace = false, preserveScroll = false, preserveState = false, viewTransition = false } = {}) {
		if (Object.keys(page2.deferredProps || {}).length) {
			this.pendingDeferredProps = {
				deferredProps: page2.deferredProps,
				component: page2.component,
				url: page2.url
			};
			if (page2.initialDeferredProps === void 0) page2.initialDeferredProps = page2.deferredProps;
		}
		this.componentId = {};
		const componentId = this.componentId;
		if (page2.clearHistory) history.clear();
		return this.resolve(page2.component, page2).then((component) => {
			if (componentId !== this.componentId) return;
			page2.rememberedState ??= {};
			const isServer3 = typeof window === "undefined";
			const location = !isServer3 ? window.location : new URL(page2.url);
			const scrollRegions = !isServer3 && preserveScroll ? Scroll.getScrollRegions() : [];
			replace = replace || isSameUrlWithoutHash(hrefToUrl(page2.url), location);
			const pageForHistory = {
				...page2,
				flash: {}
			};
			return new Promise((resolve) => replace ? history.replaceState(pageForHistory, resolve) : history.pushState(pageForHistory, resolve)).then(() => {
				const isNewComponent = !this.isTheSame(page2);
				if (!isNewComponent && Object.keys(page2.props.errors || {}).length > 0) viewTransition = false;
				this.page = page2;
				this.cleared = false;
				if (this.hasOnceProps()) prefetchedRequests.updateCachedOncePropsFromCurrentPage();
				if (isNewComponent) this.fireEventsFor("newComponent");
				if (this.isFirstPageLoad) this.fireEventsFor("firstLoad");
				this.isFirstPageLoad = false;
				if (this.historyQuotaExceeded) {
					this.historyQuotaExceeded = false;
					return;
				}
				return this.swap({
					component,
					page: page2,
					preserveState,
					viewTransition
				}).then(() => {
					if (preserveScroll) window.requestAnimationFrame(() => Scroll.restoreScrollRegions(scrollRegions));
					else Scroll.reset();
					if (this.pendingDeferredProps && this.pendingDeferredProps.component === page2.component && this.pendingDeferredProps.url === page2.url) eventHandler.fireInternalEvent("loadDeferredProps", this.pendingDeferredProps.deferredProps);
					this.pendingDeferredProps = null;
					if (!replace) fireNavigateEvent(page2);
				});
			});
		});
	}
	setQuietly(page2, { preserveState = false } = {}) {
		return this.resolve(page2.component, page2).then((component) => {
			this.page = page2;
			this.cleared = false;
			history.setCurrent(page2);
			return this.swap({
				component,
				page: page2,
				preserveState,
				viewTransition: false
			});
		});
	}
	clear() {
		this.cleared = true;
	}
	isCleared() {
		return this.cleared;
	}
	get() {
		return this.page;
	}
	getWithoutFlashData() {
		return {
			...this.page,
			flash: {}
		};
	}
	hasOnceProps() {
		return Object.keys(this.page.onceProps ?? {}).length > 0;
	}
	merge(data) {
		this.page = {
			...this.page,
			...data
		};
	}
	setPropsQuietly(props) {
		this.page = {
			...this.page,
			props
		};
		return this.resolve(this.page.component, this.page).then((component) => {
			return this.swap({
				component,
				page: this.page,
				preserveState: true,
				viewTransition: false
			});
		});
	}
	setFlash(flash) {
		this.page = {
			...this.page,
			flash
		};
		this.onFlashCallback?.(flash);
	}
	setUrlHash(hash) {
		if (!this.page.url.includes(hash)) this.page.url += hash;
	}
	remember(data) {
		this.page.rememberedState = data;
	}
	swap({ component, page: page2, preserveState, viewTransition }) {
		const doSwap = () => this.swapComponent({
			component,
			page: page2,
			preserveState
		});
		if (!viewTransition || !document?.startViewTransition || document.visibilityState === "hidden") return doSwap();
		const viewTransitionCallback = typeof viewTransition === "boolean" ? () => null : viewTransition;
		return new Promise((resolve) => {
			viewTransitionCallback(document.startViewTransition(() => doSwap().then(resolve)));
		});
	}
	resolve(component, page2) {
		return Promise.resolve(this.resolveComponent(component, page2));
	}
	nextOptimisticId() {
		return ++this.optimisticCounter;
	}
	setBaseline(key, value) {
		if (!(key in this.optimisticBaseline)) this.optimisticBaseline[key] = value;
	}
	updateBaseline(key, value) {
		if (key in this.optimisticBaseline) this.optimisticBaseline[key] = value;
	}
	hasBaseline(key) {
		return key in this.optimisticBaseline;
	}
	registerOptimistic(id, callback) {
		this.pendingOptimistics.push({
			id,
			callback
		});
	}
	unregisterOptimistic(id) {
		this.pendingOptimistics = this.pendingOptimistics.filter((entry) => entry.id !== id);
	}
	replayOptimistics() {
		const baselineKeys = Object.keys(this.optimisticBaseline);
		if (baselineKeys.length === 0) return {};
		const props = cloneDeep$1(this.page.props);
		for (const key of baselineKeys) props[key] = cloneDeep$1(this.optimisticBaseline[key]);
		for (const { callback } of this.pendingOptimistics) {
			const result = callback(cloneDeep$1(props));
			if (result) Object.assign(props, result);
		}
		const replayedProps = {};
		for (const key of baselineKeys) replayedProps[key] = props[key];
		return replayedProps;
	}
	pendingOptimisticCount() {
		return this.pendingOptimistics.length;
	}
	clearOptimisticState() {
		this.optimisticBaseline = {};
		this.pendingOptimistics = [];
	}
	isTheSame(page2) {
		return this.page.component === page2.component;
	}
	on(event, callback) {
		this.listeners.push({
			event,
			callback
		});
		return () => {
			this.listeners = this.listeners.filter((listener) => listener.event !== event && listener.callback !== callback);
		};
	}
	fireEventsFor(event) {
		this.listeners.filter((listener) => listener.event === event).forEach((listener) => listener.callback());
	}
	mergeOncePropsIntoResponse(response, { force = false } = {}) {
		Object.entries(response.onceProps ?? {}).forEach(([key, onceProp]) => {
			const existingOnceProp = this.page.onceProps?.[key];
			if (existingOnceProp === void 0) return;
			if (force || get(response.props, onceProp.prop) === void 0) {
				set(response.props, onceProp.prop, get(this.page.props, existingOnceProp.prop));
				response.onceProps[key].expiresAt = existingOnceProp.expiresAt;
			}
		});
	}
};
var page$1 = new CurrentPage();
var Queue = class {
	items = [];
	processingPromise = null;
	add(item) {
		this.items.push(item);
		return this.process();
	}
	process() {
		this.processingPromise ??= this.processNext().finally(() => {
			this.processingPromise = null;
		});
		return this.processingPromise;
	}
	processNext() {
		const next = this.items.shift();
		if (next) return Promise.resolve(next()).then(() => this.processNext());
		return Promise.resolve();
	}
};
var isServer2 = typeof window === "undefined";
var queue$1 = new Queue();
var isChromeIOS = !isServer2 && /CriOS/.test(window.navigator.userAgent);
var History = class {
	rememberedState = "rememberedState";
	scrollRegions = "scrollRegions";
	preserveUrl = false;
	current = {};
	initialState = null;
	remember(data, key) {
		this.replaceState({
			...page$1.getWithoutFlashData(),
			rememberedState: {
				...page$1.get()?.rememberedState ?? {},
				[key]: data
			}
		});
	}
	restore(key) {
		if (!isServer2) return this.current[this.rememberedState]?.[key] !== void 0 ? this.current[this.rememberedState]?.[key] : this.initialState?.[this.rememberedState]?.[key];
	}
	pushState(page2, cb = null) {
		if (isServer2) return;
		if (this.preserveUrl) {
			cb && cb();
			return;
		}
		this.current = page2;
		queue$1.add(() => {
			return this.getPageData(page2).then((data) => {
				const doPush = () => this.doPushState({ page: data }, page2.url).then(() => cb?.());
				if (isChromeIOS) return new Promise((resolve) => {
					setTimeout(() => doPush().then(resolve));
				});
				return doPush();
			});
		});
	}
	clonePageProps(page2) {
		try {
			structuredClone(page2.props);
			return page2;
		} catch {
			return {
				...page2,
				props: cloneDeep$1(page2.props)
			};
		}
	}
	getPageData(page2) {
		const pageWithClonedProps = this.clonePageProps(page2);
		return new Promise((resolve) => {
			return page2.encryptHistory ? encryptHistory(pageWithClonedProps).then(resolve) : resolve(pageWithClonedProps);
		});
	}
	processQueue() {
		return queue$1.process();
	}
	decrypt(page2 = null) {
		if (isServer2) return Promise.resolve(page2 ?? page$1.get());
		const pageData = page2 ?? window.history.state?.page;
		return this.decryptPageData(pageData).then((data) => {
			if (!data) throw new Error("Unable to decrypt history");
			if (this.initialState === null) this.initialState = data ?? void 0;
			else this.current = data ?? {};
			return data;
		});
	}
	decryptPageData(pageData) {
		return pageData instanceof ArrayBuffer ? decryptHistory(pageData) : Promise.resolve(pageData);
	}
	saveScrollPositions(scrollRegions) {
		queue$1.add(() => {
			return Promise.resolve().then(() => {
				if (!window.history.state?.page) return;
				if (isEqual(this.getScrollRegions(), scrollRegions)) return;
				return this.doReplaceState({
					page: window.history.state.page,
					scrollRegions
				});
			});
		});
	}
	saveDocumentScrollPosition(scrollRegion) {
		queue$1.add(() => {
			return Promise.resolve().then(() => {
				if (!window.history.state?.page) return;
				if (isEqual(this.getDocumentScrollPosition(), scrollRegion)) return;
				return this.doReplaceState({
					page: window.history.state.page,
					documentScrollPosition: scrollRegion
				});
			});
		});
	}
	getScrollRegions() {
		return window.history.state?.scrollRegions || [];
	}
	getDocumentScrollPosition() {
		return window.history.state?.documentScrollPosition || {
			top: 0,
			left: 0
		};
	}
	replaceState(page2, cb = null) {
		if (isEqual(this.current, page2)) {
			cb && cb();
			return;
		}
		const { flash, ...pageWithoutFlash } = page2;
		page$1.merge(pageWithoutFlash);
		if (isServer2) return;
		if (this.preserveUrl) {
			cb && cb();
			return;
		}
		this.current = page2;
		queue$1.add(() => {
			return this.getPageData(page2).then((data) => {
				const doReplace = () => this.doReplaceState({ page: data }, page2.url).then(() => cb?.());
				if (isChromeIOS) return new Promise((resolve) => {
					setTimeout(() => doReplace().then(resolve));
				});
				return doReplace();
			});
		});
	}
	isHistoryThrottleError(error) {
		return error instanceof Error && error.name === "SecurityError" && (error.message.includes("history.pushState") || error.message.includes("history.replaceState"));
	}
	isQuotaExceededError(error) {
		return error instanceof Error && error.name === "QuotaExceededError";
	}
	withThrottleProtection(cb) {
		return Promise.resolve().then(() => {
			try {
				return cb();
			} catch (error) {
				if (!this.isHistoryThrottleError(error)) throw error;
				console.error(error.message);
			}
		});
	}
	doReplaceState(data, url) {
		return this.withThrottleProtection(() => {
			window.history.replaceState({
				...data,
				scrollRegions: data.scrollRegions ?? window.history.state?.scrollRegions,
				documentScrollPosition: data.documentScrollPosition ?? window.history.state?.documentScrollPosition
			}, "", url);
		});
	}
	doPushState(data, url) {
		return this.withThrottleProtection(() => {
			try {
				window.history.pushState(data, "", url);
			} catch (error) {
				if (!this.isQuotaExceededError(error)) throw error;
				eventHandler.fireInternalEvent("historyQuotaExceeded", url);
			}
		});
	}
	getState(key, defaultValue) {
		return this.current?.[key] ?? defaultValue;
	}
	deleteState(key) {
		if (this.current[key] !== void 0) {
			delete this.current[key];
			this.replaceState(this.current);
		}
	}
	clearInitialState(key) {
		if (this.initialState && this.initialState[key] !== void 0) delete this.initialState[key];
	}
	browserHasHistoryEntry() {
		return !isServer2 && !!window.history.state?.page;
	}
	clear() {
		SessionStorage.remove(historySessionStorageKeys.key);
		SessionStorage.remove(historySessionStorageKeys.iv);
	}
	setCurrent(page2) {
		this.current = page2;
	}
	isValidState(state) {
		return !!state.page;
	}
	getAllState() {
		return this.current;
	}
};
if (typeof window !== "undefined" && window.history.scrollRestoration) window.history.scrollRestoration = "manual";
var history = new History();
var EventHandler = class {
	internalListeners = [];
	init() {
		if (typeof window !== "undefined") {
			window.addEventListener("popstate", this.handlePopstateEvent.bind(this));
			window.addEventListener("pageshow", this.handlePageshowEvent.bind(this));
			window.addEventListener("scroll", debounce(Scroll.onWindowScroll.bind(Scroll), 100), true);
		}
		if (typeof document !== "undefined") document.addEventListener("scroll", debounce(Scroll.onScroll.bind(Scroll), 100), true);
	}
	onGlobalEvent(type, callback) {
		const listener = ((event) => {
			const response = callback(event);
			if (event.cancelable && !event.defaultPrevented && response === false) event.preventDefault();
		});
		return this.registerListener(`inertia:${type}`, listener);
	}
	on(event, callback) {
		this.internalListeners.push({
			event,
			listener: callback
		});
		return () => {
			this.internalListeners = this.internalListeners.filter((listener) => listener.listener !== callback);
		};
	}
	onMissingHistoryItem() {
		page$1.clear();
		this.fireInternalEvent("missingHistoryItem");
	}
	fireInternalEvent(event, ...args) {
		this.internalListeners.filter((listener) => listener.event === event).forEach((listener) => listener.listener(...args));
	}
	registerListener(type, listener) {
		document.addEventListener(type, listener);
		return () => document.removeEventListener(type, listener);
	}
	handlePageshowEvent(event) {
		if (event.persisted) history.decrypt().catch(() => this.onMissingHistoryItem());
	}
	handlePopstateEvent(event) {
		const state = event.state || null;
		if (state === null) {
			const url = hrefToUrl(page$1.get().url);
			url.hash = window.location.hash;
			history.replaceState({
				...page$1.getWithoutFlashData(),
				url: url.href
			});
			Scroll.reset();
			return;
		}
		if (!history.isValidState(state)) return this.onMissingHistoryItem();
		history.decrypt(state.page).then((data) => {
			if (page$1.get().version !== data.version) {
				this.onMissingHistoryItem();
				return;
			}
			router.cancelAll({ prefetch: false });
			page$1.setQuietly(data, { preserveState: false }).then(() => {
				Scroll.restore(history.getScrollRegions());
				fireNavigateEvent(page$1.get());
				const pendingDeferred = {};
				const pageProps = page$1.get().props;
				for (const [group, props] of Object.entries(data.initialDeferredProps ?? data.deferredProps ?? {})) {
					const missing = props.filter((prop) => get(pageProps, prop) === void 0);
					if (missing.length > 0) pendingDeferred[group] = missing;
				}
				if (Object.keys(pendingDeferred).length > 0) this.fireInternalEvent("loadDeferredProps", pendingDeferred);
			});
		}).catch(() => {
			this.onMissingHistoryItem();
		});
	}
};
var eventHandler = new EventHandler();
var NavigationType = class {
	type;
	constructor() {
		this.type = this.resolveType();
	}
	resolveType() {
		if (typeof window === "undefined") return "navigate";
		return (window.performance?.getEntriesByType("navigation")[0])?.type ?? "navigate";
	}
	get() {
		return this.type;
	}
	isBackForward() {
		return this.type === "back_forward";
	}
	isReload() {
		return this.type === "reload";
	}
};
var navigationType = new NavigationType();
var InitialVisit = class {
	static handle() {
		this.clearRememberedStateOnReload();
		[
			this.handleBackForward,
			this.handleLocation,
			this.handleDefault
		].find((handler) => handler.bind(this)());
	}
	static clearRememberedStateOnReload() {
		if (navigationType.isReload()) {
			history.deleteState(history.rememberedState);
			history.clearInitialState(history.rememberedState);
		}
	}
	static handleBackForward() {
		if (!navigationType.isBackForward() || !history.browserHasHistoryEntry()) return false;
		const scrollRegions = history.getScrollRegions();
		history.decrypt().then((data) => {
			page$1.set(data, {
				preserveScroll: true,
				preserveState: true
			}).then(() => {
				Scroll.restore(scrollRegions);
				fireNavigateEvent(page$1.get());
			});
		}).catch(() => {
			eventHandler.onMissingHistoryItem();
		});
		return true;
	}
	/**
	* @link https://inertiajs.com/redirects#external-redirects
	*/
	static handleLocation() {
		if (!SessionStorage.exists(SessionStorage.locationVisitKey)) return false;
		const locationVisit = SessionStorage.get(SessionStorage.locationVisitKey) || {};
		SessionStorage.remove(SessionStorage.locationVisitKey);
		if (typeof window !== "undefined") page$1.setUrlHash(window.location.hash);
		history.decrypt(page$1.get()).then(() => {
			const rememberedState = history.getState(history.rememberedState, {});
			const scrollRegions = history.getScrollRegions();
			page$1.remember(rememberedState);
			page$1.set(page$1.get(), {
				preserveScroll: locationVisit.preserveScroll,
				preserveState: true
			}).then(() => {
				if (locationVisit.preserveScroll) Scroll.restore(scrollRegions);
				this.fireInitialEvents();
			});
		}).catch(() => {
			eventHandler.onMissingHistoryItem();
		});
		return true;
	}
	static handleDefault() {
		if (typeof window !== "undefined") page$1.setUrlHash(window.location.hash);
		page$1.set(page$1.get(), {
			preserveScroll: true,
			preserveState: true
		}).then(() => {
			if (navigationType.isReload()) Scroll.restore(history.getScrollRegions());
			else Scroll.scrollToAnchor();
			this.fireInitialEvents();
		});
	}
	static fireInitialEvents() {
		const page2 = page$1.get();
		fireNavigateEvent(page2);
		if (Object.keys(page2.flash).length > 0) queueMicrotask(() => fireFlashEvent(page2.flash));
	}
};
var Poll = class {
	intervalId = null;
	timeoutId = null;
	throttle = false;
	keepAlive = false;
	cb;
	interval;
	cbCount = 0;
	mode;
	inFlight = false;
	currentCancel = null;
	stopped = true;
	instanceId = 0;
	constructor(interval, cb, options) {
		this.keepAlive = options.keepAlive ?? false;
		this.mode = options.mode ?? "overlap";
		this.cb = cb;
		this.interval = interval;
		if (options.autoStart ?? true) this.start();
	}
	stop() {
		this.stopped = true;
		this.instanceId++;
		this.inFlight = false;
		this.currentCancel = null;
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = null;
		}
	}
	start() {
		if (typeof window === "undefined") return;
		this.stop();
		this.stopped = false;
		if (this.mode === "rest") {
			this.scheduleNext();
			return;
		}
		this.intervalId = window.setInterval(() => this.tick(), this.interval);
	}
	isInBackground(hidden2) {
		this.throttle = this.keepAlive ? false : hidden2;
		if (this.throttle) this.cbCount = 0;
	}
	scheduleNext() {
		if (this.stopped) return;
		this.timeoutId = window.setTimeout(() => {
			this.timeoutId = null;
			this.tick();
		}, this.interval);
	}
	tick() {
		if (!this.throttle || this.cbCount % 10 === 0) this.fire();
		else if (this.mode === "rest") this.scheduleNext();
		if (this.throttle) this.cbCount++;
	}
	fire() {
		if (this.inFlight && this.mode === "cancel") this.currentCancel?.();
		const instance = this.instanceId;
		this.cb({
			onStart: (cancel) => {
				if (instance !== this.instanceId) return;
				this.inFlight = true;
				this.currentCancel = cancel;
			},
			onFinish: () => {
				if (instance !== this.instanceId) return;
				this.inFlight = false;
				this.currentCancel = null;
				if (this.mode === "rest") this.scheduleNext();
			}
		});
	}
};
var Polls = class {
	polls = [];
	constructor() {
		this.setupVisibilityListener();
	}
	get count() {
		return this.polls.length;
	}
	add(interval, cb, options) {
		const poll = new Poll(interval, cb, options);
		this.polls.push(poll);
		return {
			stop: () => poll.stop(),
			start: () => poll.start(),
			destroy: () => {
				poll.stop();
				this.polls = this.polls.filter((p) => p !== poll);
			}
		};
	}
	clear() {
		this.polls.forEach((poll) => poll.stop());
		this.polls = [];
	}
	setupVisibilityListener() {
		if (typeof document === "undefined") return;
		document.addEventListener("visibilitychange", () => {
			this.polls.forEach((poll) => poll.isInBackground(document.hidden));
		}, false);
	}
};
var polls = new Polls();
var HttpHandlers = class {
	requestHandlers = [];
	responseHandlers = [];
	errorHandlers = [];
	onRequest(handler) {
		this.requestHandlers.push(handler);
		return () => {
			this.requestHandlers = this.requestHandlers.filter((h) => h !== handler);
		};
	}
	onResponse(handler) {
		this.responseHandlers.push(handler);
		return () => {
			this.responseHandlers = this.responseHandlers.filter((h) => h !== handler);
		};
	}
	onError(handler) {
		this.errorHandlers.push(handler);
		return () => {
			this.errorHandlers = this.errorHandlers.filter((h) => h !== handler);
		};
	}
	async processRequest(config2) {
		let result = config2;
		for (const handler of this.requestHandlers) result = await handler(result);
		return result;
	}
	async processResponse(response) {
		let result = response;
		for (const handler of this.responseHandlers) result = await handler(result);
		return result;
	}
	async processError(error) {
		for (const handler of this.errorHandlers) await handler(error);
	}
};
var httpHandlers = new HttpHandlers();
var HttpError = class extends Error {
	code;
	url;
	constructor(message, code, url) {
		super(url ? `${message} (${url})` : message);
		this.name = "HttpError";
		this.code = code;
		this.url = url;
	}
};
var HttpResponseError = class extends HttpError {
	response;
	constructor(message, response, url) {
		super(message, "ERR_HTTP_RESPONSE", url);
		this.name = "HttpResponseError";
		this.response = response;
	}
};
var HttpCancelledError = class extends HttpError {
	constructor(message = "Request was cancelled", url) {
		super(message, "ERR_CANCELLED", url);
		this.name = "HttpCancelledError";
	}
};
var HttpNetworkError = class extends HttpError {
	cause;
	constructor(message, url, cause) {
		super(message, "ERR_NETWORK", url);
		this.name = "HttpNetworkError";
		this.cause = cause;
	}
};
function getCookie(name) {
	const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
	return match ? decodeURIComponent(match[3]) : null;
}
function parseHeaders(xhr) {
	const headers = {};
	xhr.getAllResponseHeaders().split("\r\n").forEach((line) => {
		const index = line.indexOf(":");
		if (index > 0) headers[line.slice(0, index).toLowerCase().trim()] = line.slice(index + 1).trim();
	});
	return headers;
}
function setHeaders(xhr, config2) {
	if (!config2.headers) return;
	const isFormData2 = config2.data instanceof FormData;
	Object.entries(config2.headers).forEach(([key, value]) => {
		if (key.toLowerCase() !== "content-type" || !isFormData2) xhr.setRequestHeader(key, String(value));
	});
}
function buildUrlWithParams(url, params) {
	if (!params || Object.keys(params).length === 0) return url;
	const [urlWithParams] = mergeDataIntoQueryString("get", url, params);
	return urlWithParams;
}
var XhrHttpClient = class {
	xsrfCookieName;
	xsrfHeaderName;
	constructor(options = {}) {
		this.xsrfCookieName = options.xsrfCookieName ?? "XSRF-TOKEN";
		this.xsrfHeaderName = options.xsrfHeaderName ?? "X-XSRF-TOKEN";
	}
	async request(config2) {
		const processedConfig = await httpHandlers.processRequest(config2);
		try {
			const response = await this.doRequest(processedConfig);
			return await httpHandlers.processResponse(response);
		} catch (error) {
			if (error instanceof HttpResponseError || error instanceof HttpNetworkError || error instanceof HttpCancelledError) await httpHandlers.processError(error);
			throw error;
		}
	}
	doRequest(config2) {
		return new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			const url = buildUrlWithParams(config2.url, config2.params);
			xhr.open(config2.method.toUpperCase(), url, true);
			const xsrfToken = getCookie(this.xsrfCookieName);
			if (xsrfToken) xhr.setRequestHeader(this.xsrfHeaderName, xsrfToken);
			let body = null;
			if (config2.data !== null && config2.data !== void 0) if (config2.data instanceof FormData) body = config2.data;
			else if (typeof config2.data === "object") {
				body = JSON.stringify(config2.data);
				if (!config2.headers?.["Content-Type"] && !config2.headers?.["content-type"]) xhr.setRequestHeader("Content-Type", "application/json");
			} else body = String(config2.data);
			setHeaders(xhr, config2);
			if (config2.onUploadProgress) xhr.upload.onprogress = (event) => {
				const progress3 = event.lengthComputable ? event.loaded / event.total : void 0;
				config2.onUploadProgress({
					progress: progress3,
					percentage: progress3 ? Math.round(progress3 * 100) : 0,
					loaded: event.loaded,
					total: event.lengthComputable ? event.total : void 0
				});
			};
			if (config2.signal) config2.signal.addEventListener("abort", () => xhr.abort());
			xhr.onabort = () => reject(new HttpCancelledError("Request was cancelled", config2.url));
			xhr.onerror = () => reject(new HttpNetworkError("Network error", config2.url));
			xhr.onload = () => {
				const response = {
					status: xhr.status,
					data: xhr.responseText,
					headers: parseHeaders(xhr)
				};
				if (xhr.status >= 400) reject(new HttpResponseError(`Request failed with status ${xhr.status}`, response, config2.url));
				else resolve(response);
			};
			xhr.send(body);
		});
	}
};
var httpClient = new XhrHttpClient();
function isHttpClientOptions(client) {
	return !("request" in client);
}
var http = {
	/**
	* Get the current HTTP client
	*/
	getClient() {
		return httpClient;
	},
	/**
	* Set the HTTP client to use for all Inertia requests
	*/
	setClient(clientOrOptions) {
		if (!isHttpClientOptions(clientOrOptions)) {
			httpClient = clientOrOptions;
			return;
		}
		httpClient = new XhrHttpClient(clientOrOptions);
		if (clientOrOptions.xsrfCookieName) client.withXsrfCookieName(clientOrOptions.xsrfCookieName);
		if (clientOrOptions.xsrfHeaderName) client.withXsrfHeaderName(clientOrOptions.xsrfHeaderName);
	},
	/**
	* Register a request handler that runs before each request
	*/
	onRequest: httpHandlers.onRequest.bind(httpHandlers),
	/**
	* Register a response handler that runs after each successful response
	*/
	onResponse: httpHandlers.onResponse.bind(httpHandlers),
	/**
	* Register an error handler that runs when a request fails
	*/
	onError: httpHandlers.onError.bind(httpHandlers),
	/**
	* Process a request config through all registered request handlers.
	* For use by custom HttpClient implementations.
	*/
	processRequest: httpHandlers.processRequest.bind(httpHandlers),
	/**
	* Process a response through all registered response handlers.
	* For use by custom HttpClient implementations.
	*/
	processResponse: httpHandlers.processResponse.bind(httpHandlers),
	/**
	* Process an error through all registered error handlers.
	* For use by custom HttpClient implementations.
	*/
	processError: httpHandlers.processError.bind(httpHandlers)
};
var RequestParams = class _RequestParams {
	callbacks = [];
	params;
	constructor(params) {
		if (!params.prefetch) this.params = params;
		else {
			const wrappedCallbacks = {
				onBefore: this.wrapCallback(params, "onBefore"),
				onBeforeUpdate: this.wrapCallback(params, "onBeforeUpdate"),
				onStart: this.wrapCallback(params, "onStart"),
				onProgress: this.wrapCallback(params, "onProgress"),
				onFinish: this.wrapCallback(params, "onFinish"),
				onCancel: this.wrapCallback(params, "onCancel"),
				onSuccess: this.wrapCallback(params, "onSuccess"),
				onError: this.wrapCallback(params, "onError"),
				onHttpException: this.wrapCallback(params, "onHttpException"),
				onNetworkError: this.wrapCallback(params, "onNetworkError"),
				onFlash: this.wrapCallback(params, "onFlash"),
				onCancelToken: this.wrapCallback(params, "onCancelToken"),
				onPrefetched: this.wrapCallback(params, "onPrefetched"),
				onPrefetching: this.wrapCallback(params, "onPrefetching")
			};
			this.params = {
				...params,
				...wrappedCallbacks,
				onPrefetchResponse: params.onPrefetchResponse || (() => {}),
				onPrefetchError: params.onPrefetchError || (() => {})
			};
		}
	}
	static create(params) {
		return new _RequestParams(params);
	}
	data() {
		return this.params.method === "get" ? null : this.params.data;
	}
	queryParams() {
		return this.params.method === "get" ? this.params.data : {};
	}
	isPartial() {
		return this.params.only.length > 0 || this.params.except.length > 0 || this.params.reset.length > 0;
	}
	isPrefetch() {
		return this.params.prefetch === true;
	}
	isDeferredPropsRequest() {
		return this.params.deferredProps === true;
	}
	onCancelToken(cb) {
		this.params.onCancelToken({ cancel: cb });
	}
	markAsFinished() {
		this.params.completed = true;
		this.params.cancelled = false;
		this.params.interrupted = false;
	}
	markAsCancelled({ cancelled = true, interrupted = false }) {
		this.params.onCancel();
		this.params.completed = false;
		this.params.cancelled = cancelled;
		this.params.interrupted = interrupted;
	}
	wasCancelledAtAll() {
		return this.params.cancelled || this.params.interrupted;
	}
	onFinish() {
		this.params.onFinish(this.params);
	}
	onStart() {
		this.params.onStart(this.params);
	}
	onPrefetching() {
		this.params.onPrefetching(this.params);
	}
	onPrefetchResponse(response) {
		if (this.params.onPrefetchResponse) this.params.onPrefetchResponse(response);
	}
	onPrefetchError(error) {
		if (this.params.onPrefetchError) this.params.onPrefetchError(error);
	}
	all() {
		return this.params;
	}
	headers() {
		const headers = { ...this.params.headers };
		if (this.isPartial()) headers["X-Inertia-Partial-Component"] = page$1.get().component;
		const only = this.params.only.concat(this.params.reset);
		if (only.length > 0) headers["X-Inertia-Partial-Data"] = only.join(",");
		if (this.params.except.length > 0) headers["X-Inertia-Partial-Except"] = this.params.except.join(",");
		if (this.params.reset.length > 0) headers["X-Inertia-Reset"] = this.params.reset.join(",");
		if (this.params.errorBag && this.params.errorBag.length > 0) headers["X-Inertia-Error-Bag"] = this.params.errorBag;
		return headers;
	}
	setPreserveOptions(page2) {
		this.params.preserveScroll = _RequestParams.resolvePreserveOption(this.params.preserveScroll, page2);
		this.params.preserveState = _RequestParams.resolvePreserveOption(this.params.preserveState, page2);
	}
	runCallbacks() {
		this.callbacks.forEach(({ name, args }) => {
			this.params[name](...args);
		});
	}
	merge(toMerge) {
		this.params = {
			...this.params,
			...toMerge
		};
	}
	wrapCallback(params, name) {
		return (...args) => {
			this.recordCallback(name, args);
			params[name](...args);
		};
	}
	recordCallback(name, args) {
		this.callbacks.push({
			name,
			args
		});
	}
	static resolvePreserveOption(value, page2) {
		if (typeof value === "function") return value(page2);
		if (value === "errors") return Object.keys(page2.props.errors || {}).length > 0;
		return value;
	}
};
var dialog_default = {
	createIframeAndPage(html) {
		if (typeof html === "object") html = `All Inertia requests must receive a valid Inertia response, however a plain JSON response was received.<hr>${JSON.stringify(html)}`;
		const page2 = document.createElement("html");
		page2.innerHTML = html;
		page2.querySelectorAll("a").forEach((a) => a.setAttribute("target", "_top"));
		const iframe = document.createElement("iframe");
		iframe.style.backgroundColor = "white";
		iframe.style.borderRadius = "5px";
		iframe.style.width = "100%";
		iframe.style.height = "100%";
		iframe.setAttribute("sandbox", "allow-scripts");
		return {
			iframe,
			page: page2
		};
	},
	show(html) {
		const { iframe, page: page2 } = this.createIframeAndPage(html);
		iframe.style.boxSizing = "border-box";
		iframe.style.display = "block";
		const dialog = document.createElement("dialog");
		dialog.id = "inertia-error-dialog";
		Object.assign(dialog.style, {
			width: "calc(100vw - 100px)",
			height: "calc(100vh - 100px)",
			padding: "0",
			margin: "auto",
			border: "none",
			backgroundColor: "transparent"
		});
		const dialogStyleElement = document.createElement("style");
		dialogStyleElement.textContent = `
      dialog#inertia-error-dialog::backdrop {
        background-color: rgba(0, 0, 0, 0.6);
      }

      dialog#inertia-error-dialog:focus {
        outline: none;
      }
    `;
		const nonce = config$1.get("nonce");
		if (nonce) dialogStyleElement.nonce = nonce;
		document.head.appendChild(dialogStyleElement);
		dialog.addEventListener("click", (event) => {
			if (event.target === dialog) dialog.close();
		});
		dialog.addEventListener("close", () => {
			dialogStyleElement.remove();
			dialog.remove();
		});
		dialog.appendChild(iframe);
		document.body.prepend(dialog);
		dialog.showModal();
		dialog.focus();
		iframe.srcdoc = page2.outerHTML;
	}
};
var isPathOrSubPath = (path, candidate) => {
	return path === candidate || path.startsWith(`${candidate}.`);
};
var partialReloadRequestsProp = (visit, prop) => {
	const { only, except } = visit;
	if (only.length === 0 && except.length === 0) return false;
	if (only.length > 0 && !only.some((candidate) => isPathOrSubPath(prop, candidate))) return false;
	if (except.length > 0 && except.some((candidate) => isPathOrSubPath(prop, candidate))) return false;
	return true;
};
var partialReloadRequestsSomeProps = (visit, props) => {
	return props.some((prop) => partialReloadRequestsProp(visit, prop));
};
var queue2 = new Queue();
var Response = class _Response {
	constructor(requestParams, response, originatingPage) {
		this.requestParams = requestParams;
		this.response = response;
		this.originatingPage = originatingPage;
	}
	wasPrefetched = false;
	processed = false;
	static create(params, response, originatingPage) {
		return new _Response(params, response, originatingPage);
	}
	isProcessed() {
		return this.processed;
	}
	async handlePrefetch() {
		if (isSameUrlWithoutHash(this.requestParams.all().url, window.location)) this.handle();
	}
	async handle() {
		return queue2.add(() => this.process());
	}
	async process() {
		if (this.requestParams.all().prefetch) {
			this.wasPrefetched = true;
			this.requestParams.all().prefetch = false;
			this.requestParams.all().onPrefetched(this.response, this.requestParams.all());
			firePrefetchedEvent(this.response, this.requestParams.all());
			return Promise.resolve();
		}
		this.requestParams.runCallbacks();
		this.processed = true;
		if (!this.isInertiaResponse()) return this.handleNonInertiaResponse();
		if (this.isHttpException()) {
			const response = {
				...this.response,
				data: this.getDataFromResponse(this.response.data)
			};
			if (this.requestParams.all().onHttpException(response) === false) return;
			if (!fireHttpExceptionEvent(response)) return;
		}
		await history.processQueue();
		history.preserveUrl = this.requestParams.all().preserveUrl;
		await this.setPage();
		const { flash } = page$1.get();
		if (Object.keys(flash).length > 0 && !this.requestParams.isDeferredPropsRequest()) {
			fireFlashEvent(flash);
			this.requestParams.all().onFlash(flash);
		}
		const errors = page$1.get().props.errors || {};
		if (Object.keys(errors).length > 0) {
			const scopedErrors = this.getScopedErrors(errors);
			fireErrorEvent(scopedErrors);
			return this.requestParams.all().onError(scopedErrors);
		}
		router.flushByCacheTags(this.requestParams.all().invalidateCacheTags || []);
		if (!this.wasPrefetched) router.flush(page$1.get().url);
		fireSuccessEvent(page$1.get());
		await this.requestParams.all().onSuccess(page$1.get());
		history.preserveUrl = false;
	}
	mergeParams(params) {
		this.requestParams.merge(params);
	}
	getPageResponse() {
		const data = this.getDataFromResponse(this.response.data);
		if (typeof data === "object") return this.response.data = {
			...data,
			flash: data.flash ?? {},
			rescuedProps: data.rescuedProps ?? []
		};
		return this.response.data = data;
	}
	async handleNonInertiaResponse() {
		if (this.isInertiaRedirect()) {
			router.visit(this.getHeader("x-inertia-redirect"), {
				...this.requestParams.all(),
				method: "get",
				data: {}
			});
			return;
		}
		if (this.isLocationVisit()) {
			const locationUrl = hrefToUrl(this.getHeader("x-inertia-location"));
			setHashIfSameUrl(this.requestParams.all().url, locationUrl);
			return this.locationVisit(locationUrl);
		}
		const response = {
			...this.response,
			data: this.getDataFromResponse(this.response.data)
		};
		if (this.requestParams.all().onHttpException(response) === false) return;
		if (fireHttpExceptionEvent(response)) return dialog_default.show(response.data);
	}
	isInertiaResponse() {
		return this.hasHeader("x-inertia");
	}
	isHttpException() {
		return this.response.status >= 400;
	}
	hasStatus(status2) {
		return this.response.status === status2;
	}
	getHeader(header) {
		return this.response.headers[header];
	}
	hasHeader(header) {
		return this.getHeader(header) !== void 0;
	}
	isInertiaRedirect() {
		return this.hasStatus(409) && this.hasHeader("x-inertia-redirect");
	}
	isLocationVisit() {
		return this.hasStatus(409) && this.hasHeader("x-inertia-location");
	}
	/**
	* @link https://inertiajs.com/redirects#external-redirects
	*/
	locationVisit(url) {
		try {
			SessionStorage.set(SessionStorage.locationVisitKey, { preserveScroll: this.requestParams.all().preserveScroll === true });
			if (typeof window === "undefined") return;
			if (isSameUrlWithoutHash(window.location, url)) window.location.reload();
			else window.location.href = url.href;
		} catch (error) {
			return false;
		}
	}
	async setPage() {
		const pageResponse = this.getPageResponse();
		if (!this.shouldSetPage(pageResponse)) return Promise.resolve();
		this.mergeProps(pageResponse);
		page$1.mergeOncePropsIntoResponse(pageResponse);
		this.preserveOptimisticProps(pageResponse);
		this.preserveEqualProps(pageResponse);
		await this.setRememberedState(pageResponse);
		this.requestParams.setPreserveOptions(pageResponse);
		pageResponse.url = history.preserveUrl ? page$1.get().url : this.pageUrl(pageResponse);
		this.requestParams.all().onBeforeUpdate(pageResponse);
		fireBeforeUpdateEvent(pageResponse);
		return page$1.set(pageResponse, {
			replace: this.requestParams.all().replace,
			preserveScroll: this.requestParams.all().preserveScroll,
			preserveState: this.requestParams.all().preserveState,
			viewTransition: this.requestParams.all().viewTransition
		});
	}
	getDataFromResponse(response) {
		if (typeof response !== "string") return response;
		try {
			return JSON.parse(response);
		} catch (error) {
			return response;
		}
	}
	shouldSetPage(pageResponse) {
		if (!this.requestParams.all().async) return true;
		if (this.originatingPage.component !== pageResponse.component) return true;
		if (this.originatingPage.component !== page$1.get().component) return false;
		const originatingUrl = hrefToUrl(this.originatingPage.url);
		const currentPageUrl = hrefToUrl(page$1.get().url);
		return originatingUrl.origin === currentPageUrl.origin && originatingUrl.pathname === currentPageUrl.pathname;
	}
	pageUrl(pageResponse) {
		const responseUrl = hrefToUrl(pageResponse.url);
		if (pageResponse.preserveFragment) responseUrl.hash = this.requestParams.all().url.hash;
		else setHashIfSameUrl(this.requestParams.all().url, responseUrl);
		return responseUrl.pathname + responseUrl.search + responseUrl.hash;
	}
	preserveOptimisticProps(pageResponse) {
		if (!router.hasPendingOptimistic()) return;
		for (const key of Object.keys(pageResponse.props)) if (page$1.hasBaseline(key)) {
			page$1.updateBaseline(key, pageResponse.props[key]);
			pageResponse.props[key] = page$1.get().props[key];
		}
	}
	preserveEqualProps(pageResponse) {
		if (pageResponse.component !== page$1.get().component) return;
		const currentPageProps = page$1.get().props;
		Object.entries(pageResponse.props).forEach(([key, value]) => {
			if (isEqual(value, currentPageProps[key])) pageResponse.props[key] = currentPageProps[key];
		});
	}
	mergeProps(pageResponse) {
		if (!this.requestParams.isPartial() || pageResponse.component !== page$1.get().component) return;
		const propsToAppend = pageResponse.mergeProps || [];
		const propsToPrepend = pageResponse.prependProps || [];
		const propsToDeepMerge = pageResponse.deepMergeProps || [];
		const matchPropsOn = pageResponse.matchPropsOn || [];
		const mergeProp = (prop, shouldAppend) => {
			const currentProp = get(page$1.get().props, prop);
			const incomingProp = get(pageResponse.props, prop);
			if (Array.isArray(incomingProp)) {
				const newArray = this.mergeOrMatchItems(currentProp || [], incomingProp, prop, matchPropsOn, shouldAppend);
				set(pageResponse.props, prop, newArray);
			} else if (typeof incomingProp === "object" && incomingProp !== null) {
				const newObject = {
					...currentProp || {},
					...incomingProp
				};
				set(pageResponse.props, prop, newObject);
			}
		};
		propsToAppend.forEach((prop) => mergeProp(prop, true));
		propsToPrepend.forEach((prop) => mergeProp(prop, false));
		propsToDeepMerge.forEach((prop) => {
			const currentProp = get(page$1.get().props, prop);
			const incomingProp = get(pageResponse.props, prop);
			const deepMerge = (target, source, matchProp) => {
				if (Array.isArray(source)) return this.mergeOrMatchItems(target, source, matchProp, matchPropsOn);
				if (typeof source === "object" && source !== null) return Object.keys(source).reduce((acc, key) => {
					acc[key] = deepMerge(target ? target[key] : void 0, source[key], `${matchProp}.${key}`);
					return acc;
				}, { ...target });
				return source;
			};
			set(pageResponse.props, prop, deepMerge(currentProp, incomingProp, prop));
		});
		const nestedTopKeys = new Set([...this.requestParams.all().only, ...this.requestParams.all().except].filter((prop) => prop.includes(".")).map((prop) => prop.split(".")[0]));
		for (const key of nestedTopKeys) {
			const currentValue = page$1.get().props[key];
			if (this.isObject(currentValue) && this.isObject(pageResponse.props[key])) pageResponse.props[key] = this.deepMergeObjects(currentValue, pageResponse.props[key]);
		}
		pageResponse.props = {
			...page$1.get().props,
			...pageResponse.props
		};
		if (this.shouldPreserveErrors(pageResponse)) pageResponse.props.errors = page$1.get().props.errors;
		if (page$1.get().scrollProps) pageResponse.scrollProps = {
			...page$1.get().scrollProps || {},
			...pageResponse.scrollProps || {}
		};
		if (page$1.hasOnceProps()) pageResponse.onceProps = {
			...page$1.get().onceProps || {},
			...pageResponse.onceProps || {}
		};
		if (this.requestParams.isDeferredPropsRequest()) pageResponse.flash = { ...page$1.get().flash };
		const currentOriginalDeferred = page$1.get().initialDeferredProps;
		if (currentOriginalDeferred && Object.keys(currentOriginalDeferred).length > 0) pageResponse.initialDeferredProps = currentOriginalDeferred;
		pageResponse.rescuedProps = this.mergeRescuedProps(pageResponse);
	}
	mergeRescuedProps(pageResponse) {
		const currentRescued = page$1.get().rescuedProps ?? [];
		const incomingRescued = pageResponse.rescuedProps ?? [];
		const newRescued = new Set(currentRescued.filter((prop) => !partialReloadRequestsProp(this.requestParams.all(), prop)));
		incomingRescued.forEach((prop) => newRescued.add(prop));
		return Array.from(newRescued);
	}
	/**
	* By default, the Laravel adapter shares validation errors via Inertia::always(),
	* so responses always include errors, even when empty. Components like
	* InfiniteScroll and WhenVisible, as well as loading deferred props,
	* perform async requests that should practically never reset errors.
	*/
	shouldPreserveErrors(pageResponse) {
		if (!this.requestParams.all().preserveErrors) return false;
		const currentErrors = page$1.get().props.errors;
		if (!currentErrors || Object.keys(currentErrors).length === 0) return false;
		const responseErrors = pageResponse.props.errors;
		if (responseErrors && Object.keys(responseErrors).length > 0) return false;
		return true;
	}
	isObject(item) {
		return item && typeof item === "object" && !Array.isArray(item);
	}
	deepMergeObjects(target, source) {
		const result = { ...target };
		for (const key of Object.keys(source)) {
			const targetValue = target[key];
			const sourceValue = source[key];
			if (this.isObject(targetValue) && this.isObject(sourceValue)) result[key] = this.deepMergeObjects(targetValue, sourceValue);
			else result[key] = sourceValue;
		}
		return result;
	}
	mergeOrMatchItems(existingItems, newItems, matchProp, matchPropsOn, shouldAppend = true) {
		const items = Array.isArray(existingItems) ? existingItems : [];
		const matchingKey = matchPropsOn.find((key) => {
			return key.split(".").slice(0, -1).join(".") === matchProp;
		});
		if (!matchingKey) return shouldAppend ? [...items, ...newItems] : [...newItems, ...items];
		const uniqueProperty = matchingKey.split(".").pop() || "";
		const newItemsMap = /* @__PURE__ */ new Map();
		newItems.forEach((item) => {
			if (this.hasUniqueProperty(item, uniqueProperty)) newItemsMap.set(item[uniqueProperty], item);
		});
		return shouldAppend ? this.appendWithMatching(items, newItems, newItemsMap, uniqueProperty) : this.prependWithMatching(items, newItems, newItemsMap, uniqueProperty);
	}
	appendWithMatching(existingItems, newItems, newItemsMap, uniqueProperty) {
		const updatedExisting = existingItems.map((item) => {
			if (this.hasUniqueProperty(item, uniqueProperty) && newItemsMap.has(item[uniqueProperty])) return newItemsMap.get(item[uniqueProperty]);
			return item;
		});
		const newItemsToAdd = newItems.filter((item) => {
			if (!this.hasUniqueProperty(item, uniqueProperty)) return true;
			return !existingItems.some((existing) => this.hasUniqueProperty(existing, uniqueProperty) && existing[uniqueProperty] === item[uniqueProperty]);
		});
		return [...updatedExisting, ...newItemsToAdd];
	}
	prependWithMatching(existingItems, newItems, newItemsMap, uniqueProperty) {
		const untouchedExisting = existingItems.filter((item) => {
			if (this.hasUniqueProperty(item, uniqueProperty)) return !newItemsMap.has(item[uniqueProperty]);
			return true;
		});
		return [...newItems, ...untouchedExisting];
	}
	hasUniqueProperty(item, property) {
		return item && typeof item === "object" && property in item;
	}
	async setRememberedState(pageResponse) {
		const rememberedState = await history.getState(history.rememberedState, {});
		if (this.requestParams.all().preserveState && rememberedState && pageResponse.component === page$1.get().component) pageResponse.rememberedState = rememberedState;
	}
	getScopedErrors(errors) {
		if (!this.requestParams.all().errorBag) return errors;
		return errors[this.requestParams.all().errorBag || ""] || {};
	}
};
var Request = class _Request {
	constructor(params, page2, { optimistic = false } = {}) {
		this.page = page2;
		this.requestParams = RequestParams.create(params);
		this.cancelToken = new AbortController();
		this.optimistic = optimistic;
	}
	response;
	cancelToken;
	requestParams;
	requestHasFinished = false;
	optimistic;
	static create(params, page2, options) {
		return new _Request(params, page2, options);
	}
	isPrefetch() {
		return this.requestParams.isPrefetch();
	}
	isOptimistic() {
		return this.optimistic;
	}
	isPendingOptimistic() {
		return this.isOptimistic() && (!this.response || !this.response.isProcessed());
	}
	async send() {
		this.requestParams.onCancelToken(() => this.cancel({ cancelled: true }));
		fireStartEvent(this.requestParams.all());
		this.requestParams.onStart();
		if (this.requestParams.all().prefetch) {
			this.requestParams.onPrefetching();
			firePrefetchingEvent(this.requestParams.all());
		}
		const originallyPrefetch = this.requestParams.all().prefetch;
		return http.getClient().request({
			method: this.requestParams.all().method,
			url: urlWithoutHash(this.requestParams.all().url).href,
			data: this.requestParams.data(),
			signal: this.cancelToken.signal,
			headers: this.getHeaders(),
			onUploadProgress: this.onProgress.bind(this)
		}).then((response) => {
			this.response = Response.create(this.requestParams, response, this.page);
			return this.response.handle();
		}).catch((error) => {
			if (error instanceof HttpResponseError) {
				this.response = Response.create(this.requestParams, error.response, this.page);
				return this.response.handle();
			}
			return Promise.reject(error);
		}).catch((error) => {
			if (error instanceof HttpCancelledError) return;
			if (this.requestParams.all().onNetworkError(error) === false) return;
			if (fireNetworkErrorEvent(error)) {
				if (originallyPrefetch) this.requestParams.onPrefetchError(error);
				return Promise.reject(error);
			}
		}).finally(() => {
			this.finish();
			if (originallyPrefetch && this.response) this.requestParams.onPrefetchResponse(this.response);
		});
	}
	finish() {
		if (this.requestParams.wasCancelledAtAll()) return;
		this.requestParams.markAsFinished();
		this.fireFinishEvents();
	}
	fireFinishEvents() {
		if (this.requestHasFinished) return;
		this.requestHasFinished = true;
		fireFinishEvent(this.requestParams.all());
		this.requestParams.onFinish();
	}
	cancel({ cancelled = false, interrupted = false }) {
		if (this.requestHasFinished) return;
		this.cancelToken.abort();
		this.requestParams.markAsCancelled({
			cancelled,
			interrupted
		});
		this.fireFinishEvents();
	}
	onProgress(progress3) {
		if (this.requestParams.data() instanceof FormData) {
			fireProgressEvent(progress3);
			this.requestParams.all().onProgress(progress3);
		}
	}
	getHeaders() {
		const headers = {
			...this.requestParams.headers(),
			Accept: "text/html, application/xhtml+xml",
			"X-Requested-With": "XMLHttpRequest",
			"X-Inertia": true
		};
		const page2 = page$1.get();
		if (page2.version) headers["X-Inertia-Version"] = page2.version;
		const onceProps = Object.entries(page2.onceProps || {}).filter(([, onceProp]) => {
			if (get(page2.props, onceProp.prop) === void 0) return false;
			return !onceProp.expiresAt || onceProp.expiresAt > Date.now();
		}).map(([key]) => key);
		if (onceProps.length > 0) headers["X-Inertia-Except-Once-Props"] = onceProps.join(",");
		return headers;
	}
};
var RequestStream = class {
	requests = [];
	maxConcurrent;
	interruptible;
	constructor({ maxConcurrent, interruptible }) {
		this.maxConcurrent = maxConcurrent;
		this.interruptible = interruptible;
	}
	send(request) {
		this.requests.push(request);
		request.send().finally(() => {
			this.requests = this.requests.filter((r) => r !== request);
		});
	}
	interruptInFlight() {
		this.cancel({ interrupted: true }, false);
	}
	cancelInFlight({ prefetch = true, optimistic = true } = {}) {
		this.requests.filter((request) => prefetch || !request.isPrefetch()).filter((request) => optimistic || !request.isOptimistic()).forEach((request) => request.cancel({ cancelled: true }));
	}
	cancel({ cancelled = false, interrupted = false } = {}, force = false) {
		if (!force && !this.shouldCancel()) return;
		this.requests.shift()?.cancel({
			cancelled,
			interrupted
		});
	}
	shouldCancel() {
		return this.interruptible && this.requests.length >= this.maxConcurrent;
	}
	hasPendingOptimistic() {
		return this.requests.some((request) => request.isPendingOptimistic());
	}
};
var noop$1 = () => {};
var Router = class {
	syncRequestStream = new RequestStream({
		maxConcurrent: 1,
		interruptible: true
	});
	asyncRequestStream = new RequestStream({
		maxConcurrent: Infinity,
		interruptible: false
	});
	clientVisitQueue = new Queue();
	pendingOptimisticCallback = void 0;
	init({ initialPage, resolveComponent, swapComponent, onFlash }) {
		page$1.init({
			initialPage,
			resolveComponent,
			swapComponent,
			onFlash
		});
		InitialVisit.handle();
		eventHandler.init();
		eventHandler.on("missingHistoryItem", () => {
			if (typeof window !== "undefined") this.visit(window.location.href, {
				preserveState: true,
				preserveScroll: true,
				replace: true
			});
		});
		eventHandler.on("loadDeferredProps", (deferredProps) => {
			this.loadDeferredProps(deferredProps);
		});
		eventHandler.on("historyQuotaExceeded", (url) => {
			window.location.href = url;
		});
	}
	optimistic(callback) {
		this.pendingOptimisticCallback = callback;
		return this;
	}
	get(url, data = {}, options = {}) {
		return this.visit(url, {
			...options,
			method: "get",
			data
		});
	}
	post(url, data = {}, options = {}) {
		return this.visit(url, {
			preserveState: true,
			...options,
			method: "post",
			data
		});
	}
	put(url, data = {}, options = {}) {
		return this.visit(url, {
			preserveState: true,
			...options,
			method: "put",
			data
		});
	}
	patch(url, data = {}, options = {}) {
		return this.visit(url, {
			preserveState: true,
			...options,
			method: "patch",
			data
		});
	}
	delete(url, options = {}) {
		return this.visit(url, {
			preserveState: true,
			...options,
			method: "delete"
		});
	}
	reload(options = {}) {
		return this.doReload(options);
	}
	doReload(options = {}) {
		if (typeof window === "undefined") return;
		return this.visit(window.location.href, {
			...options,
			preserveScroll: true,
			preserveState: true,
			async: true,
			headers: {
				...options.headers || {},
				"Cache-Control": "no-cache"
			}
		});
	}
	remember(data, key = "default") {
		history.remember(data, key);
	}
	restore(key = "default") {
		return history.restore(key);
	}
	on(type, callback) {
		if (typeof window === "undefined") return () => {};
		return eventHandler.onGlobalEvent(type, callback);
	}
	once(type, callback) {
		if (typeof window === "undefined") return () => {};
		const remove2 = this.on(type, (event) => {
			remove2();
			return callback(event);
		});
		return remove2;
	}
	hasPendingOptimistic() {
		return this.asyncRequestStream.hasPendingOptimistic();
	}
	get activePolls() {
		return polls.count;
	}
	cancelAll({ async = true, prefetch = true, sync = true } = {}) {
		if (async) this.asyncRequestStream.cancelInFlight({ prefetch });
		if (sync) this.syncRequestStream.cancelInFlight();
	}
	poll(interval, requestOptions = {}, options = {}) {
		return polls.add(interval, ({ onStart, onFinish }) => {
			const resolved = typeof requestOptions === "function" ? requestOptions() : requestOptions;
			this.reload({
				preserveErrors: true,
				...resolved,
				onCancelToken: (token) => {
					onStart(token.cancel);
					resolved.onCancelToken?.(token);
				},
				onFinish: (visit) => {
					onFinish();
					resolved.onFinish?.(visit);
				}
			});
		}, {
			autoStart: options.autoStart ?? true,
			keepAlive: options.keepAlive ?? false,
			mode: options.mode
		});
	}
	visit(href, options = {}) {
		options.optimistic = options.optimistic ?? this.pendingOptimisticCallback;
		this.pendingOptimisticCallback = void 0;
		if (options.optimistic) options.async = options.async ?? true;
		const visit = this.getPendingVisit(href, {
			...options,
			showProgress: options.showProgress ?? (!options.async || !!options.optimistic)
		});
		const events = this.getVisitEvents(options);
		if (events.onBefore(visit) === false || !fireBeforeEvent(visit)) return;
		const currentPageUrl = hrefToUrl(page$1.get().url);
		if (!(visit.only.length > 0 || visit.except.length > 0 || visit.reset.length > 0 ? isSameUrlWithoutQueryOrHash(visit.url, currentPageUrl) : isSameUrlWithoutHash(visit.url, currentPageUrl))) this.asyncRequestStream.cancelInFlight({
			prefetch: false,
			optimistic: false
		});
		if (!visit.async) this.syncRequestStream.interruptInFlight();
		if (options.optimistic) this.applyOptimisticUpdate(options.optimistic, events);
		if (!page$1.isCleared() && !visit.preserveUrl) Scroll.save();
		const requestParams = {
			...visit,
			...events
		};
		const sendRequest = () => {
			const prefetched = prefetchedRequests.get(requestParams);
			if (prefetched) {
				progress.reveal(prefetched.inFlight);
				prefetchedRequests.use(prefetched, requestParams);
			} else {
				progress.reveal(true);
				(visit.async ? this.asyncRequestStream : this.syncRequestStream).send(Request.create(requestParams, page$1.get(), { optimistic: !!options.optimistic }));
			}
		};
		if (Array.isArray(visit.component)) {
			console.error(`The "component" prop received an array of components (${visit.component.join(", ")}), but only a single component string is supported for instant visits. Pass an explicit component name instead.`);
			visit.component = null;
		}
		if (visit.component) history.processQueue().then(() => {
			this.performInstantSwap(visit).then(() => {
				requestParams.preserveState = true;
				requestParams.replace = true;
				requestParams.viewTransition = false;
				sendRequest();
			});
		});
		else sendRequest();
	}
	getCached(href, options = {}) {
		return prefetchedRequests.findCached(this.getPrefetchParams(href, options));
	}
	flush(href, options = {}) {
		prefetchedRequests.remove(this.getPrefetchParams(href, options));
	}
	flushAll() {
		prefetchedRequests.removeAll();
	}
	flushByCacheTags(tags) {
		prefetchedRequests.removeByTags(Array.isArray(tags) ? tags : [tags]);
	}
	getPrefetching(href, options = {}) {
		return prefetchedRequests.findInFlight(this.getPrefetchParams(href, options));
	}
	prefetch(href, options = {}, prefetchOptions = {}) {
		if ((options.method ?? (isUrlMethodPair(href) ? href.method : "get")) !== "get") throw new Error("Prefetch requests must use the GET method");
		const visit = this.getPendingVisit(href, {
			...options,
			async: true,
			showProgress: false,
			prefetch: true,
			viewTransition: false
		});
		if (visit.url.origin + visit.url.pathname + visit.url.search === window.location.origin + window.location.pathname + window.location.search) return;
		const events = this.getVisitEvents(options);
		if (events.onBefore(visit) === false || !fireBeforeEvent(visit)) return;
		progress.hide();
		this.asyncRequestStream.interruptInFlight();
		const requestParams = {
			...visit,
			...events
		};
		const ensureCurrentPageIsSet = () => {
			return new Promise((resolve) => {
				const checkIfPageIsDefined = () => {
					if (page$1.get()) resolve();
					else setTimeout(checkIfPageIsDefined, 50);
				};
				checkIfPageIsDefined();
			});
		};
		ensureCurrentPageIsSet().then(() => {
			prefetchedRequests.add(requestParams, (params) => {
				this.asyncRequestStream.send(Request.create(params, page$1.get()));
			}, {
				cacheFor: config$1.get("prefetch.cacheFor"),
				cacheTags: [],
				...prefetchOptions
			});
		});
	}
	clearHistory() {
		history.clear();
	}
	decryptHistory() {
		return history.decrypt();
	}
	resolveComponent(component, page2) {
		return page$1.resolve(component, page2);
	}
	replace(params) {
		this.clientVisit(params, { replace: true });
	}
	replaceProp(name, value, options) {
		this.replace({
			preserveScroll: true,
			preserveState: true,
			props(currentProps) {
				const newValue = typeof value === "function" ? value(get(currentProps, name), currentProps) : value;
				return set(cloneDeep$1(currentProps), name, newValue);
			},
			...options || {}
		});
	}
	appendToProp(name, value, options) {
		this.replaceProp(name, (currentValue, currentProps) => {
			const newValue = typeof value === "function" ? value(currentValue, currentProps) : value;
			if (!Array.isArray(currentValue)) currentValue = currentValue !== void 0 ? [currentValue] : [];
			return [...currentValue, newValue];
		}, options);
	}
	prependToProp(name, value, options) {
		this.replaceProp(name, (currentValue, currentProps) => {
			const newValue = typeof value === "function" ? value(currentValue, currentProps) : value;
			if (!Array.isArray(currentValue)) currentValue = currentValue !== void 0 ? [currentValue] : [];
			return [newValue, ...currentValue];
		}, options);
	}
	push(params) {
		this.clientVisit(params);
	}
	flash(keyOrData, value) {
		const current = page$1.get().flash;
		let flash;
		if (typeof keyOrData === "function") flash = keyOrData(current);
		else if (typeof keyOrData === "string") flash = {
			...current,
			[keyOrData]: value
		};
		else if (keyOrData && Object.keys(keyOrData).length) flash = {
			...current,
			...keyOrData
		};
		else return;
		page$1.setFlash(flash);
		if (Object.keys(flash).length) fireFlashEvent(flash);
	}
	clientVisit(params, { replace = false } = {}) {
		this.clientVisitQueue.add(() => this.performClientVisit(params, { replace }));
	}
	performClientVisit(params, { replace = false } = {}) {
		const current = page$1.get();
		const onceProps = typeof params.props === "function" ? Object.fromEntries(Object.values(current.onceProps ?? {}).map((onceProp) => [onceProp.prop, get(current.props, onceProp.prop)])) : {};
		const props = typeof params.props === "function" ? params.props(current.props, onceProps) : params.props ?? current.props;
		const flash = typeof params.flash === "function" ? params.flash(current.flash) : params.flash;
		const { viewTransition, onError, onFinish, onFlash, onSuccess, ...pageParams } = params;
		const page2 = {
			...current,
			...pageParams,
			flash: flash ?? {},
			props
		};
		const preserveScroll = RequestParams.resolvePreserveOption(params.preserveScroll ?? false, page2);
		const preserveState = RequestParams.resolvePreserveOption(params.preserveState ?? false, page2);
		return page$1.set(page2, {
			replace,
			preserveScroll,
			preserveState,
			viewTransition
		}).then(() => {
			const currentFlash = page$1.get().flash;
			if (Object.keys(currentFlash).length > 0) {
				fireFlashEvent(currentFlash);
				onFlash?.(currentFlash);
			}
			const errors = page$1.get().props.errors || {};
			if (Object.keys(errors).length === 0) {
				onSuccess?.(page$1.get());
				return;
			}
			const scopedErrors = params.errorBag ? errors[params.errorBag || ""] || {} : errors;
			onError?.(scopedErrors);
		}).finally(() => onFinish?.(params));
	}
	performInstantSwap(visit) {
		const current = page$1.get();
		const sharedProps = Object.fromEntries((current.sharedProps ?? []).filter((key) => key in current.props).map((key) => [key, current.props[key]]));
		const resolvedPageProps = typeof visit.pageProps === "function" ? visit.pageProps(cloneDeep$1(current.props), cloneDeep$1(sharedProps)) : visit.pageProps;
		const intermediateProps = resolvedPageProps !== null ? { ...resolvedPageProps } : { ...sharedProps };
		const intermediatePage = {
			component: visit.component,
			url: visit.url.pathname + visit.url.search + visit.url.hash,
			version: current.version,
			props: {
				...intermediateProps,
				errors: {}
			},
			flash: {},
			rescuedProps: [],
			clearHistory: false,
			encryptHistory: current.encryptHistory,
			sharedProps: current.sharedProps,
			rememberedState: {}
		};
		return page$1.set(intermediatePage, {
			replace: visit.replace,
			preserveScroll: RequestParams.resolvePreserveOption(visit.preserveScroll, intermediatePage),
			preserveState: false,
			viewTransition: visit.viewTransition
		});
	}
	getPrefetchParams(href, options) {
		return {
			...this.getPendingVisit(href, {
				...options,
				async: true,
				showProgress: false,
				prefetch: true,
				viewTransition: false
			}),
			...this.getVisitEvents(options)
		};
	}
	getPendingVisit(href, options) {
		if (isUrlMethodPair(href)) {
			const urlMethodPair = href;
			href = urlMethodPair.url;
			options.method = options.method ?? urlMethodPair.method;
		}
		const defaultVisitOptionsCallback = config$1.get("visitOptions");
		const configuredOptions = defaultVisitOptionsCallback ? defaultVisitOptionsCallback(href.toString(), cloneDeep$1(options)) || {} : {};
		const mergedOptions = {
			method: "get",
			data: {},
			replace: false,
			preserveScroll: false,
			preserveState: false,
			only: [],
			except: [],
			headers: {},
			errorBag: "",
			forceFormData: false,
			queryStringArrayFormat: "brackets",
			async: false,
			showProgress: true,
			fresh: false,
			reset: [],
			preserveUrl: false,
			preserveErrors: false,
			prefetch: false,
			invalidateCacheTags: [],
			viewTransition: false,
			component: null,
			pageProps: null,
			...stripTopLevelUndefined(options),
			...stripTopLevelUndefined(configuredOptions)
		};
		const [url, _data] = transformUrlAndData(href, mergedOptions.data, mergedOptions.method, mergedOptions.forceFormData, mergedOptions.queryStringArrayFormat);
		const visit = {
			cancelled: false,
			completed: false,
			interrupted: false,
			...mergedOptions,
			url,
			data: _data
		};
		if (visit.prefetch) visit.headers["Purpose"] = "prefetch";
		return visit;
	}
	getVisitEvents(options) {
		return {
			onCancelToken: options.onCancelToken || noop$1,
			onBefore: options.onBefore || noop$1,
			onBeforeUpdate: options.onBeforeUpdate || noop$1,
			onStart: options.onStart || noop$1,
			onProgress: options.onProgress || noop$1,
			onFinish: options.onFinish || noop$1,
			onCancel: options.onCancel || noop$1,
			onSuccess: options.onSuccess || noop$1,
			onError: options.onError || noop$1,
			onHttpException: options.onHttpException || noop$1,
			onNetworkError: options.onNetworkError || noop$1,
			onFlash: options.onFlash || noop$1,
			onPrefetched: options.onPrefetched || noop$1,
			onPrefetching: options.onPrefetching || noop$1
		};
	}
	applyOptimisticUpdate(optimistic, events) {
		const currentProps = page$1.get().props;
		const optimisticProps = optimistic(cloneDeep$1(currentProps));
		if (!optimisticProps) return;
		const changedKeys = [];
		for (const key of Object.keys(optimisticProps)) if (!isEqual(currentProps[key], optimisticProps[key])) changedKeys.push(key);
		if (changedKeys.length === 0) return;
		const id = page$1.nextOptimisticId();
		const component = page$1.get().component;
		for (const key of changedKeys) page$1.setBaseline(key, cloneDeep$1(currentProps[key]));
		page$1.registerOptimistic(id, optimistic);
		page$1.setPropsQuietly({
			...currentProps,
			...optimisticProps
		});
		let shouldRestore = true;
		const originalOnSuccess = events.onSuccess;
		events.onSuccess = (page2) => {
			shouldRestore = false;
			return originalOnSuccess(page2);
		};
		const originalOnFinish = events.onFinish;
		events.onFinish = (visit) => {
			page$1.unregisterOptimistic(id);
			if (shouldRestore && page$1.get().component === component) {
				const replayedProps = page$1.replayOptimistics();
				if (Object.keys(replayedProps).length > 0) page$1.setPropsQuietly({
					...page$1.get().props,
					...replayedProps
				});
			}
			if (page$1.pendingOptimisticCount() === 0) page$1.clearOptimisticState();
			return originalOnFinish(visit);
		};
	}
	loadDeferredProps(deferred) {
		if (deferred) Object.values(deferred).forEach((props) => {
			this.doReload({
				only: props,
				deferredProps: true,
				preserveErrors: true
			});
		});
	}
};
var UseFormUtils = class {
	/**
	* Creates a callback that returns a UrlMethodPair.
	*
	* createWayfinderCallback(urlMethodPair)
	* createWayfinderCallback(method, url)
	* createWayfinderCallback(() => urlMethodPair)
	* createWayfinderCallback(() => method, () => url)
	*/
	static createWayfinderCallback(...args) {
		return () => {
			if (args.length === 1) return isUrlMethodPair(args[0]) ? args[0] : args[0]();
			return {
				method: typeof args[0] === "function" ? args[0]() : args[0],
				url: typeof args[1] === "function" ? args[1]() : args[1]
			};
		};
	}
	/**
	* Parses all useForm() arguments into { rememberKey, data, precognitionEndpoint }.
	*
	* useForm()
	* useForm(data)
	* useForm(rememberKey, data)
	* useForm(method, url, data)
	* useForm(urlMethodPair, data)
	*
	*/
	static parseUseFormArguments(...args) {
		if (args.length === 0) return {
			rememberKey: null,
			data: {},
			precognitionEndpoint: null
		};
		if (args.length === 1) return {
			rememberKey: null,
			data: args[0],
			precognitionEndpoint: null
		};
		if (args.length === 2) {
			if (typeof args[0] === "string") return {
				rememberKey: args[0],
				data: args[1],
				precognitionEndpoint: null
			};
			return {
				rememberKey: null,
				data: args[1],
				precognitionEndpoint: this.createWayfinderCallback(args[0])
			};
		}
		return {
			rememberKey: null,
			data: args[2],
			precognitionEndpoint: this.createWayfinderCallback(args[0], args[1])
		};
	}
	/**
	* Parses all submission arguments into { method, url, options }.
	* It uses the Precognition endpoint if no explicit method/url are provided.
	*
	* form.submit(method, url)
	* form.submit(method, url, options)
	* form.submit(urlMethodPair)
	* form.submit(urlMethodPair, options)
	* form.submit()
	* form.submit(options)
	*/
	static parseSubmitArguments(args, precognitionEndpoint) {
		if (args.length === 3 || args.length === 2 && typeof args[0] === "string") return {
			method: args[0],
			url: args[1],
			options: args[2] ?? {}
		};
		if (isUrlMethodPair(args[0])) return {
			...args[0],
			options: args[1] ?? {}
		};
		return {
			...precognitionEndpoint(),
			options: args[0] ?? {}
		};
	}
	/**
	* Merges headers into the Precognition validate() arguments.
	*/
	static mergeHeadersForValidation(field, config2, headers) {
		const merge = (config3) => {
			config3.headers = {
				...headers ?? {},
				...config3.headers ?? {}
			};
			return config3;
		};
		if (field && typeof field === "object" && !("target" in field)) field = merge(field);
		else if (config2 && typeof config2 === "object") config2 = merge(config2);
		else if (typeof field === "string") config2 = merge(config2 ?? {});
		else field = merge(field ?? {});
		return [field, config2];
	}
};
function undotKey(key) {
	if (!key.includes(".")) return key;
	const transformSegment = (segment) => {
		if (segment.startsWith("[") && segment.endsWith("]")) return segment;
		return segment.split(".").reduce((result, part, index) => index === 0 ? part : `${result}[${part}]`);
	};
	return key.replace(/\\\./g, "__ESCAPED_DOT__").split(/(\[[^\]]*\])/).filter(Boolean).map(transformSegment).join("").replace(/__ESCAPED_DOT__/g, ".");
}
function parseKey2(key) {
	const path = [];
	const pattern = /([^\[\]]+)|\[(\d*)\]/g;
	let match;
	while ((match = pattern.exec(key)) !== null) if (match[1] !== void 0) path.push(match[1]);
	else if (match[2] !== void 0) path.push(match[2] === "" ? "" : Number(match[2]));
	return path;
}
function setNestedObject(obj, path, value) {
	let current = obj;
	for (let i = 0; i < path.length - 1; i++) {
		if (!(path[i] in current)) current[path[i]] = {};
		current = current[path[i]];
	}
	current[path[path.length - 1]] = value;
}
function objectHasSequentialNumericKeys(value) {
	const keys = Object.keys(value);
	const numericKeys = keys.filter((k) => /^\d+$/.test(k)).map(Number).sort((a, b) => a - b);
	return keys.length === numericKeys.length && numericKeys.length > 0 && numericKeys[0] === 0 && numericKeys.every((n, i) => n === i);
}
function convertSequentialObjectsToArrays(value) {
	if (Array.isArray(value)) return value.map(convertSequentialObjectsToArrays);
	if (typeof value !== "object" || value === null || isFile(value)) return value;
	if (objectHasSequentialNumericKeys(value)) {
		const result2 = [];
		for (let i = 0; i < Object.keys(value).length; i++) result2[i] = convertSequentialObjectsToArrays(value[i]);
		return result2;
	}
	const result = {};
	for (const key in value) result[key] = convertSequentialObjectsToArrays(value[key]);
	return result;
}
function formDataToObject(source) {
	const form = {};
	for (const [key, value] of source.entries()) {
		if (value instanceof File && value.size === 0 && value.name === "") continue;
		const path = parseKey2(undotKey(key));
		if (path[path.length - 1] === "") {
			const arrayPath = path.slice(0, -1);
			const existing = get(form, arrayPath);
			if (Array.isArray(existing)) existing.push(value);
			else if (existing && typeof existing === "object" && !isFile(existing)) {
				const numericKeys = Object.keys(existing).filter((k) => /^\d+$/.test(k)).map(Number).sort((a, b) => a - b);
				set(form, arrayPath, numericKeys.length > 0 ? [...numericKeys.map((k) => existing[k]), value] : [value]);
			} else set(form, arrayPath, [value]);
			continue;
		}
		setNestedObject(form, path.map(String), value);
	}
	return convertSequentialObjectsToArrays(form);
}
var Renderer = {
	buildDOMElement(tag) {
		const template = document.createElement("template");
		template.innerHTML = tag;
		const node = template.content.firstChild;
		if (!tag.startsWith("<script ")) return node;
		const script = document.createElement("script");
		script.innerHTML = node.innerHTML;
		node.getAttributeNames().forEach((name) => {
			script.setAttribute(name, node.getAttribute(name) || "");
		});
		return script;
	},
	isInertiaManagedElement(element) {
		return element.nodeType === Node.ELEMENT_NODE && element.getAttribute("data-inertia") !== null;
	},
	findMatchingElementIndex(element, elements) {
		const key = element.getAttribute("data-inertia");
		if (key !== null) return elements.findIndex((element2) => element2.getAttribute("data-inertia") === key);
		return -1;
	},
	update: debounce(function(elements) {
		const sourceElements = elements.map((element) => this.buildDOMElement(element));
		const targetElements = Array.from(document.head.childNodes).filter((element) => this.isInertiaManagedElement(element));
		if (sourceElements.some((element) => element instanceof HTMLTitleElement)) document.head.querySelectorAll("title:not([data-inertia])").forEach((title) => title.remove());
		targetElements.forEach((targetElement) => {
			const index = this.findMatchingElementIndex(targetElement, sourceElements);
			if (index === -1) {
				targetElement.remove();
				return;
			}
			const sourceElement = sourceElements.splice(index, 1)[0];
			if (sourceElement && !targetElement.isEqualNode(sourceElement)) targetElement.replaceWith(sourceElement);
		});
		sourceElements.forEach((element) => {
			document.head.appendChild(element);
		});
	}, 1)
};
function createHeadManager(isServer3, titleCallback, onUpdate) {
	const states = {};
	let lastProviderId = 0;
	function connect() {
		const id = lastProviderId += 1;
		states[id] = [];
		return id.toString();
	}
	function disconnect(id) {
		if (id === null || Object.keys(states).indexOf(id) === -1) return;
		delete states[id];
		commit();
	}
	function reconnect(id) {
		if (Object.keys(states).indexOf(id) === -1) states[id] = [];
	}
	function update(id, elements = []) {
		if (id !== null && Object.keys(states).indexOf(id) > -1) states[id] = elements;
		commit();
	}
	function collect() {
		const title = titleCallback("");
		const defaults = { ...title ? { title: `<title data-inertia="">${title}</title>` } : {} };
		const elements = Object.values(states).reduce((carry, elements2) => carry.concat(elements2), []).reduce((carry, element) => {
			if (element.indexOf("<") === -1) return carry;
			if (element.indexOf("<title ") === 0) {
				const title2 = element.match(/(<title [^>]+>)(.*?)(<\/title>)/s);
				carry.title = title2 ? `${title2[1]}${titleCallback(title2[2])}${title2[3]}` : element;
				return carry;
			}
			const match = element.match(/ data-inertia="[^"]+"/);
			if (match) carry[match[0]] = element;
			else carry[Object.keys(carry).length] = element;
			return carry;
		}, defaults);
		return Object.values(elements);
	}
	function commit() {
		isServer3 ? onUpdate(collect()) : Renderer.update(collect());
	}
	commit();
	return {
		forceUpdate: commit,
		createProvider: function() {
			const id = connect();
			return {
				reconnect: () => reconnect(id),
				update: (elements) => update(id, elements),
				disconnect: () => disconnect(id)
			};
		}
	};
}
var MERGE_INTENT_HEADER = "X-Inertia-Infinite-Scroll-Merge-Intent";
var useInfiniteScrollData = (options) => {
	const getScrollPropFromCurrentPage = () => {
		const scrollProp = page$1.get().scrollProps?.[options.getPropName()];
		if (scrollProp) return scrollProp;
		throw new Error(`The page object does not contain a scroll prop named "${options.getPropName()}".`);
	};
	const state = {
		component: null,
		loading: false,
		previousPage: null,
		nextPage: null,
		lastLoadedPage: null,
		requestCount: 0
	};
	const resetState = () => {
		const scrollProp = getScrollPropFromCurrentPage();
		state.component = page$1.get().component;
		state.loading = false;
		state.previousPage = scrollProp.previousPage;
		state.nextPage = scrollProp.nextPage;
		state.lastLoadedPage = scrollProp.currentPage;
		state.requestCount = 0;
	};
	const getRememberKey = () => `inertia:infinite-scroll-data:${options.getPropName()}`;
	if (typeof window !== "undefined") {
		resetState();
		const rememberedState = router.restore(getRememberKey());
		if (rememberedState && typeof rememberedState === "object" && rememberedState.lastLoadedPage === getScrollPropFromCurrentPage().currentPage) {
			state.previousPage = rememberedState.previousPage;
			state.nextPage = rememberedState.nextPage;
			state.lastLoadedPage = rememberedState.lastLoadedPage;
			state.requestCount = rememberedState.requestCount || 0;
		}
	}
	const removeEventListener = router.on("success", (event) => {
		if (state.component === event.detail.page.component && getScrollPropFromCurrentPage().reset) {
			resetState();
			options.onReset?.();
		}
	});
	const getScrollPropKeyForSide = (side) => {
		return side === "next" ? "nextPage" : "previousPage";
	};
	const findPageToLoad = (side) => {
		return state[getScrollPropKeyForSide(side)];
	};
	const syncStateOnSuccess = (side) => {
		const scrollProp = getScrollPropFromCurrentPage();
		const paginationProp = getScrollPropKeyForSide(side);
		state.lastLoadedPage = scrollProp.currentPage;
		state[paginationProp] = scrollProp[paginationProp];
		state.requestCount += 1;
		router.remember({
			previousPage: state.previousPage,
			nextPage: state.nextPage,
			lastLoadedPage: state.lastLoadedPage,
			requestCount: state.requestCount
		}, getRememberKey());
	};
	const getPageName = () => getScrollPropFromCurrentPage().pageName;
	const getRequestCount = () => state.requestCount;
	const fetchPage = (side, reloadOptions = {}) => {
		const page2 = findPageToLoad(side);
		if (state.loading || page2 === null) return;
		state.loading = true;
		router.reload({
			preserveErrors: true,
			...reloadOptions,
			data: {
				...reloadOptions.data || {},
				[getPageName()]: page2
			},
			only: [...reloadOptions.only || [], options.getPropName()],
			preserveUrl: true,
			headers: {
				[MERGE_INTENT_HEADER]: side === "previous" ? "prepend" : "append",
				...reloadOptions.headers
			},
			onBefore: (visit) => {
				side === "next" ? options.onBeforeNextRequest() : options.onBeforePreviousRequest();
				reloadOptions.onBefore?.(visit);
			},
			onBeforeUpdate: (page3) => {
				options.onBeforeUpdate();
				reloadOptions.onBeforeUpdate?.(page3);
			},
			onSuccess: (page3) => {
				syncStateOnSuccess(side);
				reloadOptions.onSuccess?.(page3);
			},
			onFinish: (visit) => {
				state.loading = false;
				const completed = visit.completed;
				const page3 = completed ? state.lastLoadedPage : null;
				side === "next" ? options.onCompleteNextRequest(page3, {
					page: page3,
					completed
				}) : options.onCompletePreviousRequest(page3, {
					page: page3,
					completed
				});
				reloadOptions.onFinish?.(visit);
			}
		});
	};
	const getLastLoadedPage = () => state.lastLoadedPage;
	const hasPrevious = () => !!state.previousPage;
	const hasNext = () => !!state.nextPage;
	const fetchPrevious = (reloadOptions) => fetchPage("previous", reloadOptions);
	const fetchNext = (reloadOptions) => fetchPage("next", reloadOptions);
	return {
		getLastLoadedPage,
		getPageName,
		getRequestCount,
		hasPrevious,
		hasNext,
		fetchNext,
		fetchPrevious,
		removeEventListener
	};
};
var useIntersectionObservers = () => {
	const intersectionObservers = [];
	const newIntersectionObserver = (callback, options = {}) => {
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) if (entry.isIntersecting) callback(entry);
		}, options);
		intersectionObservers.push(observer);
		return observer;
	};
	const flushAll = () => {
		intersectionObservers.forEach((observer) => observer.disconnect());
		intersectionObservers.length = 0;
	};
	return {
		new: newIntersectionObserver,
		flushAll
	};
};
var INFINITE_SCROLL_PAGE_KEY = "infiniteScrollPage";
var INFINITE_SCROLL_IGNORE_KEY = "infiniteScrollIgnore";
var getPageFromElement = (element) => element.dataset[INFINITE_SCROLL_PAGE_KEY];
var useInfiniteScrollElementManager = (options) => {
	const intersectionObservers = useIntersectionObservers();
	let itemsObserver;
	let startElementObserver;
	let endElementObserver;
	let itemsMutationObserver;
	let triggersEnabled = false;
	const setupObservers = () => {
		itemsMutationObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType !== Node.ELEMENT_NODE) return;
					addedElements.add(node);
				});
			});
			rememberElementsDebounced();
		});
		itemsMutationObserver.observe(options.getItemsElement(), { childList: true });
		itemsObserver = intersectionObservers.new((entry) => options.onItemIntersected(entry.target));
		const observerOptions = {
			root: options.getScrollableParent(),
			rootMargin: `${Math.max(1, options.getTriggerMargin())}px`
		};
		startElementObserver = intersectionObservers.new(options.onPreviousTriggered, observerOptions);
		endElementObserver = intersectionObservers.new(options.onNextTriggered, observerOptions);
	};
	const enableTriggers = () => {
		if (triggersEnabled) disableTriggers();
		const startElement = options.getStartElement();
		const endElement = options.getEndElement();
		if (startElement && options.shouldFetchPrevious()) startElementObserver.observe(startElement);
		if (endElement && options.shouldFetchNext()) endElementObserver.observe(endElement);
		triggersEnabled = true;
	};
	const disableTriggers = () => {
		if (!triggersEnabled) return;
		startElementObserver.disconnect();
		endElementObserver.disconnect();
		triggersEnabled = false;
	};
	const refreshTriggers = () => {
		if (triggersEnabled) enableTriggers();
	};
	const flushAll = () => {
		disableTriggers();
		intersectionObservers.flushAll();
		itemsMutationObserver?.disconnect();
	};
	const addedElements = /* @__PURE__ */ new Set();
	const elementIsUntagged = (element) => !(INFINITE_SCROLL_PAGE_KEY in element.dataset) && !(INFINITE_SCROLL_IGNORE_KEY in element.dataset);
	const processManuallyAddedElements = () => {
		Array.from(addedElements).forEach((element) => {
			if (elementIsUntagged(element)) element.dataset[INFINITE_SCROLL_IGNORE_KEY] = "true";
			itemsObserver.observe(element);
		});
		addedElements.clear();
	};
	const findUntaggedElements = (containerElement) => {
		return Array.from(containerElement.querySelectorAll(`:scope > *:not([data-infinite-scroll-page]):not([data-infinite-scroll-ignore])`));
	};
	let hasRestoredElements = false;
	const processServerLoadedElements = (loadedPage) => {
		if (!hasRestoredElements) {
			hasRestoredElements = true;
			if (restoreElements()) return;
		}
		findUntaggedElements(options.getItemsElement()).forEach((element) => {
			if (elementIsUntagged(element)) element.dataset[INFINITE_SCROLL_PAGE_KEY] = loadedPage?.toString() || "1";
			itemsObserver.observe(element);
		});
		rememberElements();
	};
	const getElementsRememberKey = () => `inertia:infinite-scroll-elements:${options.getPropName()}`;
	const rememberElements = () => {
		const pageElementRange = {};
		const childNodes = options.getItemsElement().childNodes;
		for (let index = 0; index < childNodes.length; index++) {
			const node = childNodes[index];
			if (node.nodeType !== Node.ELEMENT_NODE) continue;
			const page2 = getPageFromElement(node);
			if (typeof page2 === "undefined") continue;
			if (!(page2 in pageElementRange)) pageElementRange[page2] = {
				from: index,
				to: index
			};
			else pageElementRange[page2].to = index;
		}
		router.remember(pageElementRange, getElementsRememberKey());
	};
	const rememberElementsDebounced = debounce(rememberElements, 250);
	const restoreElements = () => {
		const pageElementRange = router.restore(getElementsRememberKey());
		if (!pageElementRange || typeof pageElementRange !== "object") return false;
		const childNodes = options.getItemsElement().childNodes;
		for (let index = 0; index < childNodes.length; index++) {
			const node = childNodes[index];
			if (node.nodeType !== Node.ELEMENT_NODE) continue;
			const element = node;
			let elementPage;
			for (const [page2, range] of Object.entries(pageElementRange)) if (index >= range.from && index <= range.to) {
				elementPage = page2;
				break;
			}
			if (elementPage) element.dataset[INFINITE_SCROLL_PAGE_KEY] = elementPage;
			else if (!elementIsUntagged(element)) continue;
			else element.dataset[INFINITE_SCROLL_IGNORE_KEY] = "true";
			itemsObserver.observe(element);
		}
		return true;
	};
	return {
		setupObservers,
		enableTriggers,
		disableTriggers,
		refreshTriggers,
		flushAll,
		processManuallyAddedElements,
		processServerLoadedElements
	};
};
var queue3 = new Queue();
var initialUrl;
var payloadUrl;
var initialUrlWasAbsolute = null;
var useInfiniteScrollQueryString = (options) => {
	let enabled = true;
	const queuePageUpdate = (page2) => {
		queue3.add(() => {
			return new Promise((resolve) => {
				if (!enabled) {
					initialUrl = payloadUrl = null;
					return resolve();
				}
				if (!initialUrl || !payloadUrl) {
					const currentPageUrl = page$1.get().url;
					initialUrl = hrefToUrl(currentPageUrl);
					payloadUrl = hrefToUrl(currentPageUrl);
					initialUrlWasAbsolute = urlHasProtocol(currentPageUrl);
				}
				const pageName = options.getPageName();
				const searchParams = payloadUrl.searchParams;
				if (page2 === "1") searchParams.delete(pageName);
				else searchParams.set(pageName, page2);
				setTimeout(() => resolve());
			});
		}).finally(() => {
			if (enabled && initialUrl && payloadUrl && initialUrl.href !== payloadUrl.href && initialUrlWasAbsolute !== null) router.replace({
				url: urlToString(payloadUrl, initialUrlWasAbsolute),
				preserveScroll: true,
				preserveState: true
			});
			initialUrl = payloadUrl = initialUrlWasAbsolute = null;
		});
	};
	return {
		onItemIntersected: debounce((itemElement) => {
			const itemsElement = options.getItemsElement();
			if (!enabled || options.shouldPreserveUrl() || !itemElement || !itemsElement) return;
			const pageMap = /* @__PURE__ */ new Map();
			getElementsInViewportFromCollection([...itemsElement.children], itemElement).forEach((element) => {
				const page2 = getPageFromElement(element) ?? "1";
				if (pageMap.has(page2)) pageMap.set(page2, pageMap.get(page2) + 1);
				else pageMap.set(page2, 1);
			});
			const mostVisiblePage = Array.from(pageMap.entries()).sort((a, b) => b[1] - a[1])[0]?.[0];
			if (mostVisiblePage !== void 0) queuePageUpdate(mostVisiblePage);
		}, 250),
		cancel: () => enabled = false
	};
};
var useInfiniteScrollPreservation = (options) => {
	const createCallbacks = () => {
		let currentScrollTop;
		let referenceElement = null;
		let referenceElementTop = 0;
		const captureScrollPosition = () => {
			const scrollableContainer = options.getScrollableParent();
			const itemsElement = options.getItemsElement();
			currentScrollTop = scrollableContainer?.scrollTop || window.scrollY;
			const visibleElements = getElementsInViewportFromCollection([...itemsElement.children]);
			if (visibleElements.length > 0) {
				referenceElement = visibleElements[0];
				const containerRect = scrollableContainer?.getBoundingClientRect() || { top: 0 };
				const containerTop = scrollableContainer ? containerRect.top : 0;
				referenceElementTop = referenceElement.getBoundingClientRect().top - containerTop;
			}
		};
		const restoreScrollPosition = () => {
			if (!referenceElement) return;
			let attempts = 0;
			let restored = false;
			const restore = () => {
				attempts++;
				if (restored || attempts > 10) return false;
				const scrollableContainer = options.getScrollableParent();
				const containerRect = scrollableContainer?.getBoundingClientRect() || { top: 0 };
				const containerTop = scrollableContainer ? containerRect.top : 0;
				const adjustment = referenceElement.getBoundingClientRect().top - containerTop - referenceElementTop;
				if (adjustment === 0) {
					window.requestAnimationFrame(restore);
					return;
				}
				if (scrollableContainer) scrollableContainer.scrollTo({ top: currentScrollTop + adjustment });
				else window.scrollTo(0, window.scrollY + adjustment);
				restored = true;
			};
			window.requestAnimationFrame(restore);
		};
		return {
			captureScrollPosition,
			restoreScrollPosition
		};
	};
	return { createCallbacks };
};
function useInfiniteScroll(options) {
	const queryStringManager = useInfiniteScrollQueryString({
		...options,
		getPageName: () => dataManager.getPageName()
	});
	const scrollPreservation = useInfiniteScrollPreservation(options);
	const elementManager = useInfiniteScrollElementManager({
		...options,
		onItemIntersected: queryStringManager.onItemIntersected,
		onPreviousTriggered: () => dataManager.fetchPrevious(),
		onNextTriggered: () => dataManager.fetchNext()
	});
	const dataManager = useInfiniteScrollData({
		...options,
		onBeforeUpdate: elementManager.processManuallyAddedElements,
		onCompletePreviousRequest: (_, details) => {
			options.onCompletePreviousRequest(details);
			if (details.completed) requestAnimationFrame$1(() => elementManager.processServerLoadedElements(details.page), 2);
		},
		onCompleteNextRequest: (_, details) => {
			options.onCompleteNextRequest(details);
			if (details.completed) requestAnimationFrame$1(() => elementManager.processServerLoadedElements(details.page), 2);
		},
		onReset: options.onDataReset
	});
	const addScrollPreservationCallbacks = (reloadOptions) => {
		const { captureScrollPosition, restoreScrollPosition } = scrollPreservation.createCallbacks();
		const originalOnBeforeUpdate = reloadOptions.onBeforeUpdate || (() => {});
		const originalOnSuccess = reloadOptions.onSuccess || (() => {});
		reloadOptions.onBeforeUpdate = (page2) => {
			originalOnBeforeUpdate(page2);
			captureScrollPosition();
		};
		reloadOptions.onSuccess = (page2) => {
			originalOnSuccess(page2);
			restoreScrollPosition();
		};
		return reloadOptions;
	};
	const originalFetchNext = dataManager.fetchNext;
	dataManager.fetchNext = (reloadOptions = {}) => {
		reloadOptions = {
			...options.getReloadOptions?.(),
			...reloadOptions
		};
		if (options.inReverseMode()) reloadOptions = addScrollPreservationCallbacks(reloadOptions);
		originalFetchNext(reloadOptions);
	};
	const originalFetchPrevious = dataManager.fetchPrevious;
	dataManager.fetchPrevious = (reloadOptions = {}) => {
		reloadOptions = {
			...options.getReloadOptions?.(),
			...reloadOptions
		};
		if (!options.inReverseMode()) reloadOptions = addScrollPreservationCallbacks(reloadOptions);
		originalFetchPrevious(reloadOptions);
	};
	const removeEventListener = router.on("success", () => requestAnimationFrame$1(elementManager.refreshTriggers, 2));
	return {
		dataManager,
		elementManager,
		flush: () => {
			removeEventListener();
			dataManager.removeEventListener();
			elementManager.flushAll();
			queryStringManager.cancel();
		}
	};
}
function createLayoutPropsStore() {
	let shared = {};
	let named = {};
	let snapshot = {
		shared,
		named
	};
	const listeners = /* @__PURE__ */ new Set();
	let pendingNotify = false;
	const updateSnapshot = () => {
		snapshot = {
			shared,
			named
		};
	};
	const notify = () => {
		if (pendingNotify) return;
		pendingNotify = true;
		queueMicrotask(() => {
			pendingNotify = false;
			listeners.forEach((fn) => fn());
		});
	};
	return {
		set(props) {
			const merged = {
				...shared,
				...props
			};
			if (isEqual(shared, merged)) return;
			shared = merged;
			updateSnapshot();
			notify();
		},
		setFor(name, props) {
			const current = named[name] || {};
			const merged = {
				...current,
				...props
			};
			if (isEqual(current, merged)) return;
			named = {
				...named,
				[name]: merged
			};
			updateSnapshot();
			notify();
		},
		reset() {
			shared = {};
			named = {};
			updateSnapshot();
			notify();
		},
		subscribe(callback) {
			listeners.add(callback);
			return () => listeners.delete(callback);
		},
		get: () => snapshot
	};
}
function isPlainObject$1(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function hasComponentKey(value) {
	return isPlainObject$1(value) && "component" in value;
}
function hasComponentEntry(value, isComponent) {
	return "component" in value && isComponent(value.component);
}
function isNamedLayouts(value, isComponent) {
	if (!isPlainObject$1(value) || isComponent(value) || hasComponentEntry(value, isComponent)) return false;
	return Object.values(value).every((v) => isComponent(v) || Array.isArray(v) && isComponent(v[0]) || hasComponentKey(v) && isComponent(v.component));
}
function isPropsObject(value, isComponent) {
	return isPlainObject$1(value) && !isComponent(value) && !hasComponentEntry(value, isComponent) && !isNamedLayouts(value, isComponent);
}
function isPropsObjectOrCallback(value, isComponent) {
	if (isPropsObject(value, isComponent)) return true;
	if (!isPlainObject$1(value) || isComponent(value) || hasComponentEntry(value, isComponent)) return false;
	const values = Object.values(value);
	return values.length > 0 && values.every((v) => typeof v === "function");
}
function isTuple(value, isComponent) {
	return Array.isArray(value) && value.length === 2 && isComponent(value[0]) && isPlainObject$1(value[1]) && !isComponent(value[1]);
}
function extract(item, isComponent) {
	if (Array.isArray(item) && isComponent(item[0])) return {
		component: item[0],
		props: item[1] ?? {}
	};
	if (hasComponentKey(item) && isComponent(item.component)) return {
		component: item.component,
		props: item.props ?? {}
	};
	if (isComponent(item)) return {
		component: item,
		props: {}
	};
	throw new Error(`Invalid layout definition: received ${typeof item}`);
}
function normalizeLayouts(layout, isComponent, isRenderFunction) {
	if (!layout || isRenderFunction && isRenderFunction(layout)) return [];
	if (isNamedLayouts(layout, isComponent)) return Object.entries(layout).map(([name, value]) => ({
		...extract(value, isComponent),
		name
	}));
	if (isTuple(layout, isComponent)) return [{
		component: layout[0],
		props: layout[1] ?? {}
	}];
	if (Array.isArray(layout)) return layout.map((item) => extract(item, isComponent));
	if (hasComponentKey(layout) && isComponent(layout.component)) return [{
		component: layout.component,
		props: layout.props ?? {}
	}];
	if (isComponent(layout)) return [{
		component: layout,
		props: {}
	}];
	return [];
}
function isContentEditableOrPrevented(event) {
	return event.target instanceof HTMLElement && event.target.isContentEditable || event.defaultPrevented;
}
function shouldIntercept(event) {
	const isLink = event.currentTarget.tagName.toLowerCase() === "a";
	return !(isContentEditableOrPrevented(event) || isLink && event.altKey || isLink && event.ctrlKey || isLink && event.metaKey || isLink && event.shiftKey || isLink && "button" in event && event.button !== 0);
}
function shouldNavigate(event) {
	const isButton = event.currentTarget.tagName.toLowerCase() === "button";
	return !isContentEditableOrPrevented(event) && (event.key === "Enter" || isButton && event.key === " ");
}
var baseComponentSelector = "nprogress";
var usePopover;
var progress2;
var settings = {
	minimum: .08,
	easing: "linear",
	speed: 200,
	trickle: true,
	trickleSpeed: 200,
	showSpinner: true,
	barSelector: "[role=\"bar\"]",
	spinnerSelector: "[role=\"spinner\"]",
	parent: "body",
	color: "#29d",
	includeCSS: true,
	popover: null,
	template: [
		"<div class=\"bar\" role=\"bar\">",
		"<div class=\"peg\"></div>",
		"</div>",
		"<div class=\"spinner\" role=\"spinner\">",
		"<div class=\"spinner-icon\"></div>",
		"</div>"
	].join("")
};
var status = null;
var hidden = false;
var configure = (options) => {
	Object.assign(settings, options);
	usePopover = settings.popover ?? "popover" in HTMLElement.prototype;
	if (settings.includeCSS) injectCSS(settings.color);
	progress2 = document.createElement("div");
	progress2.id = baseComponentSelector;
	progress2.innerHTML = settings.template;
	if (usePopover) progress2.popover = "manual";
};
var set7 = (n) => {
	const started = isStarted();
	n = clamp(n, settings.minimum, 1);
	status = n === 1 ? null : n;
	const progress3 = render(!started);
	const bar = progress3.querySelector(settings.barSelector);
	const speed = settings.speed;
	const ease = settings.easing;
	progress3.offsetWidth;
	queue4((next) => {
		const barStyles = {
			transition: `all ${speed}ms ${ease}`,
			transform: `translate3d(${toBarPercentage(n)}%,0,0)`
		};
		for (const key in barStyles) bar.style[key] = barStyles[key];
		if (n !== 1) return setTimeout(next, speed);
		progress3.style.transition = "none";
		progress3.style.opacity = "1";
		progress3.offsetWidth;
		setTimeout(() => {
			progress3.style.transition = `all ${speed}ms linear`;
			progress3.style.opacity = "0";
			setTimeout(() => {
				remove$1();
				progress3.style.transition = "";
				progress3.style.opacity = "";
				next();
			}, speed);
		}, speed);
	});
};
var isStarted = () => typeof status === "number";
var start = () => {
	if (!status) set7(0);
	const work = function() {
		setTimeout(function() {
			if (!status) return;
			increaseByRandom();
			work();
		}, settings.trickleSpeed);
	};
	if (settings.trickle) work();
};
var done = (force) => {
	if (!force && !status) return;
	increaseByRandom(.3 + .5 * Math.random());
	set7(1);
};
var increaseByRandom = (amount) => {
	const n = status;
	if (n === null) return start();
	if (n > 1) return;
	amount = typeof amount === "number" ? amount : (() => {
		const ranges = {
			.1: [0, .2],
			.04: [.2, .5],
			.02: [.5, .8],
			.005: [.8, .99]
		};
		for (const r in ranges) if (n >= ranges[r][0] && n < ranges[r][1]) return parseFloat(r);
		return 0;
	})();
	return set7(clamp(n + amount, 0, .994));
};
var render = (fromStart) => {
	if (isRendered()) return document.getElementById(baseComponentSelector);
	document.documentElement.classList.add(`${baseComponentSelector}-busy`);
	const bar = progress2.querySelector(settings.barSelector);
	const perc = fromStart ? "-100" : toBarPercentage(status || 0);
	bar.style.transition = "all 0 linear";
	bar.style.transform = `translate3d(${perc}%,0,0)`;
	if (!settings.showSpinner) progress2.querySelector(settings.spinnerSelector)?.remove();
	if (usePopover) {
		document.body.appendChild(progress2);
		if (!hidden) progress2.showPopover();
	} else {
		const parent = getParent();
		if (parent !== document.body) parent.classList.add(`${baseComponentSelector}-custom-parent`);
		parent.appendChild(progress2);
		if (hidden) progress2.style.display = "none";
	}
	return progress2;
};
var getParent = () => {
	return document.querySelector(settings.parent);
};
var remove$1 = () => {
	document.documentElement.classList.remove(`${baseComponentSelector}-busy`);
	if (usePopover && progress2?.isConnected) try {
		progress2.hidePopover();
	} catch {}
	if (!usePopover) getParent().classList.remove(`${baseComponentSelector}-custom-parent`);
	progress2?.remove();
};
var isRendered = () => {
	return document.getElementById(baseComponentSelector) !== null;
};
function clamp(n, min, max) {
	if (n < min) return min;
	if (n > max) return max;
	return n;
}
var toBarPercentage = (n) => (-1 + n) * 100;
var queue4 = /* @__PURE__ */ (() => {
	const pending = [];
	const next = () => {
		const fn = pending.shift();
		if (fn) fn(next);
	};
	return (fn) => {
		pending.push(fn);
		if (pending.length === 1) next();
	};
})();
var injectCSS = (color) => {
	const element = document.createElement("style");
	const nonce = config$1.get("nonce");
	if (nonce) element.nonce = nonce;
	element.textContent = `
    #${baseComponentSelector} {
      pointer-events: none;
      background: none;
      border: none;
      margin: 0;
      padding: 0;
      overflow: visible;
      inset: unset;
      width: 100%;
      height: 0;
      position: fixed;
      top: 0;
      left: 0;
    }

    #${baseComponentSelector}::backdrop {
      display: none;
    }

    #${baseComponentSelector} .bar {
      background: ${color};

      position: fixed;
      z-index: 1031;
      top: 0;
      left: 0;

      width: 100%;
      height: 2px;
    }

    #${baseComponentSelector} .peg {
      display: block;
      position: absolute;
      right: 0px;
      width: 100px;
      height: 100%;
      box-shadow: 0 0 10px ${color}, 0 0 5px ${color};
      opacity: 1.0;

      transform: rotate(3deg) translate(0px, -4px);
    }

    #${baseComponentSelector} .spinner {
      display: block;
      position: fixed;
      z-index: 1031;
      top: 15px;
      right: 15px;
    }

    #${baseComponentSelector} .spinner-icon {
      width: 18px;
      height: 18px;
      box-sizing: border-box;

      border: solid 2px transparent;
      border-top-color: ${color};
      border-left-color: ${color};
      border-radius: 50%;

      animation: ${baseComponentSelector}-spinner 400ms linear infinite;
    }

    .${baseComponentSelector}-custom-parent {
      overflow: hidden;
      position: relative;
    }

    .${baseComponentSelector}-custom-parent #${baseComponentSelector} .spinner,
    .${baseComponentSelector}-custom-parent #${baseComponentSelector} .bar {
      position: absolute;
    }

    @keyframes ${baseComponentSelector}-spinner {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
	document.head.appendChild(element);
};
var show = () => {
	hidden = false;
	if (!progress2?.isConnected) return;
	if (usePopover) try {
		progress2.showPopover();
	} catch {}
	else progress2.style.display = "";
};
var hide = () => {
	hidden = true;
	if (!progress2?.isConnected) return;
	if (usePopover) try {
		progress2.hidePopover();
	} catch {}
	else progress2.style.display = "none";
};
var progress_component_default = {
	configure,
	isStarted,
	done,
	set: set7,
	remove: remove$1,
	start,
	status,
	show,
	hide
};
var Progress = class {
	hideCount = 0;
	start() {
		progress_component_default.start();
	}
	reveal(force = false) {
		this.hideCount = Math.max(0, this.hideCount - 1);
		if (force || this.hideCount === 0) progress_component_default.show();
	}
	hide() {
		this.hideCount++;
		progress_component_default.hide();
	}
	set(status2) {
		progress_component_default.set(Math.max(0, Math.min(1, status2)));
	}
	finish() {
		progress_component_default.done();
	}
	reset() {
		progress_component_default.set(0);
	}
	remove() {
		progress_component_default.done();
		progress_component_default.remove();
	}
	isStarted() {
		return progress_component_default.isStarted();
	}
	getStatus() {
		return progress_component_default.status;
	}
};
var progress = new Progress();
function addEventListeners(delay) {
	document.addEventListener("inertia:start", (e) => handleStartEvent(e, delay));
	document.addEventListener("inertia:progress", handleProgressEvent);
}
function handleStartEvent(event, delay) {
	if (!event.detail.visit.showProgress) progress.hide();
	const timeout = setTimeout(() => progress.start(), delay);
	document.addEventListener("inertia:finish", (e) => finish(e, timeout), { once: true });
}
function handleProgressEvent(event) {
	if (progress.isStarted() && event.detail.progress?.percentage) progress.set(Math.max(progress.getStatus(), event.detail.progress.percentage / 100 * .9));
}
function finish(event, timeout) {
	clearTimeout(timeout);
	if (!progress.isStarted()) return;
	if (event.detail.visit.completed) progress.finish();
	else if (event.detail.visit.interrupted) progress.reset();
	else if (event.detail.visit.cancelled) progress.remove();
}
function setupProgress({ delay = 250, color = "#29d", includeCSS = true, showSpinner = false, popover = null } = {}) {
	addEventListeners(delay);
	progress_component_default.configure({
		showSpinner,
		includeCSS,
		color,
		popover
	});
}
var FormComponentResetSymbol = /* @__PURE__ */ Symbol("FormComponentReset");
function isFormElement(element) {
	return element instanceof HTMLInputElement || element instanceof HTMLSelectElement || element instanceof HTMLTextAreaElement;
}
function resetInputElement(input, defaultValues) {
	const oldValue = input.value;
	const oldChecked = input.checked;
	switch (input.type.toLowerCase()) {
		case "checkbox":
			input.checked = defaultValues.includes(input.value);
			break;
		case "radio":
			input.checked = defaultValues[0] === input.value;
			break;
		case "file":
			input.value = "";
			break;
		case "button":
		case "submit":
		case "reset":
		case "image": break;
		default: input.value = defaultValues[0] !== null && defaultValues[0] !== void 0 ? String(defaultValues[0]) : "";
	}
	return input.value !== oldValue || input.checked !== oldChecked;
}
function resetSelectElement(select, defaultValues) {
	const oldValue = select.value;
	const oldSelectedOptions = Array.from(select.selectedOptions).map((opt) => opt.value);
	if (select.multiple) {
		const defaultStrings = defaultValues.map((value) => String(value));
		Array.from(select.options).forEach((option) => {
			option.selected = defaultStrings.includes(option.value);
		});
	} else select.value = defaultValues[0] !== void 0 ? String(defaultValues[0]) : "";
	const newSelectedOptions = Array.from(select.selectedOptions).map((opt) => opt.value);
	return select.multiple ? JSON.stringify(oldSelectedOptions.sort()) !== JSON.stringify(newSelectedOptions.sort()) : select.value !== oldValue;
}
function resetFormElement(element, defaultValues) {
	if (element.disabled) {
		if (element instanceof HTMLInputElement) {
			const oldValue = element.value;
			const oldChecked = element.checked;
			switch (element.type.toLowerCase()) {
				case "checkbox":
				case "radio":
					element.checked = element.defaultChecked;
					return element.checked !== oldChecked;
				case "file":
					element.value = "";
					return oldValue !== "";
				case "button":
				case "submit":
				case "reset":
				case "image": return false;
				default:
					element.value = element.defaultValue;
					return element.value !== oldValue;
			}
		} else if (element instanceof HTMLSelectElement) {
			const oldSelectedOptions = Array.from(element.selectedOptions).map((opt) => opt.value);
			Array.from(element.options).forEach((option) => {
				option.selected = option.defaultSelected;
			});
			const newSelectedOptions = Array.from(element.selectedOptions).map((opt) => opt.value);
			return JSON.stringify(oldSelectedOptions.sort()) !== JSON.stringify(newSelectedOptions.sort());
		} else if (element instanceof HTMLTextAreaElement) {
			const oldValue = element.value;
			element.value = element.defaultValue;
			return element.value !== oldValue;
		}
		return false;
	}
	if (element instanceof HTMLInputElement) return resetInputElement(element, defaultValues);
	else if (element instanceof HTMLSelectElement) return resetSelectElement(element, defaultValues);
	else if (element instanceof HTMLTextAreaElement) {
		const oldValue = element.value;
		element.value = defaultValues[0] !== void 0 ? String(defaultValues[0]) : "";
		return element.value !== oldValue;
	}
	return false;
}
function resetFieldElements(elements, defaultValues) {
	let hasChanged = false;
	if (elements instanceof RadioNodeList || elements instanceof HTMLCollection) Array.from(elements).forEach((node, index) => {
		if (node instanceof Element && isFormElement(node)) {
			if (node instanceof HTMLInputElement && ["checkbox", "radio"].includes(node.type.toLowerCase())) {
				if (resetFormElement(node, defaultValues)) hasChanged = true;
			} else if (resetFormElement(node, defaultValues[index] !== void 0 ? [defaultValues[index]] : [defaultValues[0] ?? null].filter(Boolean))) hasChanged = true;
		}
	});
	else if (isFormElement(elements)) hasChanged = resetFormElement(elements, defaultValues);
	return hasChanged;
}
function resetFormFields(formElement, defaults, fieldNames) {
	if (!formElement) return;
	const resetEntireForm = !fieldNames || fieldNames.length === 0;
	if (resetEntireForm) {
		const formData = new FormData(formElement);
		const formElementNames = Array.from(formElement.elements).map((el) => isFormElement(el) ? el.name : "").filter(Boolean);
		fieldNames = [.../* @__PURE__ */ new Set([
			...defaults.keys(),
			...formData.keys(),
			...formElementNames
		])];
	}
	let hasChanged = false;
	fieldNames.forEach((fieldName) => {
		const elements = formElement.elements.namedItem(fieldName);
		if (elements) {
			if (resetFieldElements(elements, defaults.getAll(fieldName))) hasChanged = true;
		}
	});
	if (hasChanged && resetEntireForm) formElement.dispatchEvent(new CustomEvent("reset", {
		bubbles: true,
		cancelable: true,
		detail: { [FormComponentResetSymbol]: true }
	}));
}
function buildSSRBody(id, page2, html) {
	return `<script data-page="${id}" type="application/json">${JSON.stringify(page2).replace(/\//g, "\\/")}<\/script><div data-server-rendered="true" id="${id}">${html}</div>`;
}
var router = new Router();
/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
* @license MIT */
//#endregion
//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
/**
* @vue/shared v3.5.34
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
/* @__NO_SIDE_EFFECTS__ */
function makeMap(str) {
	const map = /* @__PURE__ */ Object.create(null);
	for (const key of str.split(",")) map[key] = 1;
	return (val) => val in map;
}
var EMPTY_OBJ = Object.freeze({});
var EMPTY_ARR = Object.freeze([]);
var NOOP = () => {};
var NO = () => false;
var isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && (key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
var isModelListener = (key) => key.startsWith("onUpdate:");
var extend = Object.assign;
var remove = (arr, el) => {
	const i = arr.indexOf(el);
	if (i > -1) arr.splice(i, 1);
};
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
var isArray = Array.isArray;
var isMap = (val) => toTypeString(val) === "[object Map]";
var isSet = (val) => toTypeString(val) === "[object Set]";
var isDate = (val) => toTypeString(val) === "[object Date]";
var isFunction = (val) => typeof val === "function";
var isString = (val) => typeof val === "string";
var isSymbol = (val) => typeof val === "symbol";
var isObject = (val) => val !== null && typeof val === "object";
var isPromise = (val) => {
	return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
var objectToString = Object.prototype.toString;
var toTypeString = (value) => objectToString.call(value);
var toRawType = (value) => {
	return toTypeString(value).slice(8, -1);
};
var isPlainObject = (val) => toTypeString(val) === "[object Object]";
var isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
var isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
var isBuiltInDirective = /* @__PURE__ */ makeMap("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo");
var cacheStringFunction = (fn) => {
	const cache = /* @__PURE__ */ Object.create(null);
	return ((str) => {
		return cache[str] || (cache[str] = fn(str));
	});
};
var camelizeRE = /-\w/g;
var camelize = cacheStringFunction((str) => {
	return str.replace(camelizeRE, (c) => c.slice(1).toUpperCase());
});
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
var capitalize = cacheStringFunction((str) => {
	return str.charAt(0).toUpperCase() + str.slice(1);
});
var toHandlerKey = cacheStringFunction((str) => {
	return str ? `on${capitalize(str)}` : ``;
});
var hasChanged = (value, oldValue) => !Object.is(value, oldValue);
var invokeArrayFns = (fns, ...arg) => {
	for (let i = 0; i < fns.length; i++) fns[i](...arg);
};
var def = (obj, key, value, writable = false) => {
	Object.defineProperty(obj, key, {
		configurable: true,
		enumerable: false,
		writable,
		value
	});
};
var looseToNumber = (val) => {
	const n = parseFloat(val);
	return isNaN(n) ? val : n;
};
var _globalThis;
var getGlobalThis = () => {
	return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
	if (isArray(value)) {
		const res = {};
		for (let i = 0; i < value.length; i++) {
			const item = value[i];
			const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
			if (normalized) for (const key in normalized) res[key] = normalized[key];
		}
		return res;
	} else if (isString(value) || isObject(value)) return value;
}
var listDelimiterRE = /;(?![^(]*\))/g;
var propertyDelimiterRE = /:([^]+)/;
var styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
	const ret = {};
	cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
		if (item) {
			const tmp = item.split(propertyDelimiterRE);
			tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
		}
	});
	return ret;
}
function stringifyStyle(styles) {
	if (!styles) return "";
	if (isString(styles)) return styles;
	let ret = "";
	for (const key in styles) {
		const value = styles[key];
		if (isString(value) || typeof value === "number") {
			const normalizedKey = key.startsWith(`--`) ? key : hyphenate(key);
			ret += `${normalizedKey}:${value};`;
		}
	}
	return ret;
}
function normalizeClass(value) {
	let res = "";
	if (isString(value)) res = value;
	else if (isArray(value)) for (let i = 0; i < value.length; i++) {
		const normalized = normalizeClass(value[i]);
		if (normalized) res += normalized + " ";
	}
	else if (isObject(value)) {
		for (const name in value) if (value[name]) res += name + " ";
	}
	return res.trim();
}
var HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
var SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
var MATH_TAGS = "annotation,annotation-xml,maction,maligngroup,malignmark,math,menclose,merror,mfenced,mfrac,mfraction,mglyph,mi,mlabeledtr,mlongdiv,mmultiscripts,mn,mo,mover,mpadded,mphantom,mprescripts,mroot,mrow,ms,mscarries,mscarry,msgroup,msline,mspace,msqrt,msrow,mstack,mstyle,msub,msubsup,msup,mtable,mtd,mtext,mtr,munder,munderover,none,semantics";
var isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
var isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
var isMathMLTag = /* @__PURE__ */ makeMap(MATH_TAGS);
var specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
var isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
var isBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs + `,async,autofocus,autoplay,controls,default,defer,disabled,hidden,inert,loop,open,required,reversed,scoped,seamless,checked,muted,multiple,selected`);
function includeBooleanAttr(value) {
	return !!value || value === "";
}
var isKnownHtmlAttr = /* @__PURE__ */ makeMap(`accept,accept-charset,accesskey,action,align,allow,alt,async,autocapitalize,autocomplete,autofocus,autoplay,background,bgcolor,border,buffered,capture,challenge,charset,checked,cite,class,code,codebase,color,cols,colspan,content,contenteditable,contextmenu,controls,coords,crossorigin,csp,data,datetime,decoding,default,defer,dir,dirname,disabled,download,draggable,dropzone,enctype,enterkeyhint,for,form,formaction,formenctype,formmethod,formnovalidate,formtarget,headers,height,hidden,high,href,hreflang,http-equiv,icon,id,importance,inert,integrity,ismap,itemprop,keytype,kind,label,lang,language,loading,list,loop,low,manifest,max,maxlength,minlength,media,min,multiple,muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,preload,radiogroup,readonly,referrerpolicy,rel,required,reversed,rows,rowspan,sandbox,scope,scoped,selected,shape,size,sizes,slot,span,spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,target,title,translate,type,usemap,value,width,wrap`);
var isKnownSvgAttr = /* @__PURE__ */ makeMap(`xmlns,accent-height,accumulate,additive,alignment-baseline,alphabetic,amplitude,arabic-form,ascent,attributeName,attributeType,azimuth,baseFrequency,baseline-shift,baseProfile,bbox,begin,bias,by,calcMode,cap-height,class,clip,clipPathUnits,clip-path,clip-rule,color,color-interpolation,color-interpolation-filters,color-profile,color-rendering,contentScriptType,contentStyleType,crossorigin,cursor,cx,cy,d,decelerate,descent,diffuseConstant,direction,display,divisor,dominant-baseline,dur,dx,dy,edgeMode,elevation,enable-background,end,exponent,fill,fill-opacity,fill-rule,filter,filterRes,filterUnits,flood-color,flood-opacity,font-family,font-size,font-size-adjust,font-stretch,font-style,font-variant,font-weight,format,from,fr,fx,fy,g1,g2,glyph-name,glyph-orientation-horizontal,glyph-orientation-vertical,glyphRef,gradientTransform,gradientUnits,hanging,height,href,hreflang,horiz-adv-x,horiz-origin-x,id,ideographic,image-rendering,in,in2,intercept,k,k1,k2,k3,k4,kernelMatrix,kernelUnitLength,kerning,keyPoints,keySplines,keyTimes,lang,lengthAdjust,letter-spacing,lighting-color,limitingConeAngle,local,marker-end,marker-mid,marker-start,markerHeight,markerUnits,markerWidth,mask,maskContentUnits,maskUnits,mathematical,max,media,method,min,mode,name,numOctaves,offset,opacity,operator,order,orient,orientation,origin,overflow,overline-position,overline-thickness,panose-1,paint-order,path,pathLength,patternContentUnits,patternTransform,patternUnits,ping,pointer-events,points,pointsAtX,pointsAtY,pointsAtZ,preserveAlpha,preserveAspectRatio,primitiveUnits,r,radius,referrerPolicy,refX,refY,rel,rendering-intent,repeatCount,repeatDur,requiredExtensions,requiredFeatures,restart,result,rotate,rx,ry,scale,seed,shape-rendering,slope,spacing,specularConstant,specularExponent,speed,spreadMethod,startOffset,stdDeviation,stemh,stemv,stitchTiles,stop-color,stop-opacity,strikethrough-position,strikethrough-thickness,string,stroke,stroke-dasharray,stroke-dashoffset,stroke-linecap,stroke-linejoin,stroke-miterlimit,stroke-opacity,stroke-width,style,surfaceScale,systemLanguage,tabindex,tableValues,target,targetX,targetY,text-anchor,text-decoration,text-rendering,textLength,to,transform,transform-origin,type,u1,u2,underline-position,underline-thickness,unicode,unicode-bidi,unicode-range,units-per-em,v-alphabetic,v-hanging,v-ideographic,v-mathematical,values,vector-effect,version,vert-adv-y,vert-origin-x,vert-origin-y,viewBox,viewTarget,visibility,width,widths,word-spacing,writing-mode,x,x-height,x1,x2,xChannelSelector,xlink:actuate,xlink:arcrole,xlink:href,xlink:role,xlink:show,xlink:title,xlink:type,xmlns:xlink,xml:base,xml:lang,xml:space,y,y1,y2,yChannelSelector,z,zoomAndPan`);
function isRenderableAttrValue(value) {
	if (value == null) return false;
	const type = typeof value;
	return type === "string" || type === "number" || type === "boolean";
}
var cssVarNameEscapeSymbolsRE = /[ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~]/g;
function getEscapedCssVarName(key, doubleEscape) {
	return key.replace(cssVarNameEscapeSymbolsRE, (s) => doubleEscape ? s === "\"" ? "\\\\\\\"" : `\\\\${s}` : `\\${s}`);
}
function looseCompareArrays(a, b) {
	if (a.length !== b.length) return false;
	let equal = true;
	for (let i = 0; equal && i < a.length; i++) equal = looseEqual(a[i], b[i]);
	return equal;
}
function looseEqual(a, b) {
	if (a === b) return true;
	let aValidType = isDate(a);
	let bValidType = isDate(b);
	if (aValidType || bValidType) return aValidType && bValidType ? a.getTime() === b.getTime() : false;
	aValidType = isSymbol(a);
	bValidType = isSymbol(b);
	if (aValidType || bValidType) return a === b;
	aValidType = isArray(a);
	bValidType = isArray(b);
	if (aValidType || bValidType) return aValidType && bValidType ? looseCompareArrays(a, b) : false;
	aValidType = isObject(a);
	bValidType = isObject(b);
	if (aValidType || bValidType) {
		if (!aValidType || !bValidType) return false;
		if (Object.keys(a).length !== Object.keys(b).length) return false;
		for (const key in a) {
			const aHasKey = a.hasOwnProperty(key);
			const bHasKey = b.hasOwnProperty(key);
			if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) return false;
		}
	}
	return String(a) === String(b);
}
function normalizeCssVarValue(value) {
	if (value == null) return "initial";
	if (typeof value === "string") return value === "" ? " " : value;
	if (typeof value !== "number" || !Number.isFinite(value)) console.warn("[Vue warn] Invalid value used for CSS binding. Expected a string or a finite number but received:", value);
	return String(value);
}
//#endregion
//#region node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js
/**
* @vue/reactivity v3.5.34
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function warn$2(msg, ...args) {
	console.warn(`[Vue warn] ${msg}`, ...args);
}
var activeEffectScope;
var EffectScope = class {
	constructor(detached = false) {
		this.detached = detached;
		/**
		* @internal
		*/
		this._active = true;
		/**
		* @internal track `on` calls, allow `on` call multiple times
		*/
		this._on = 0;
		/**
		* @internal
		*/
		this.effects = [];
		/**
		* @internal
		*/
		this.cleanups = [];
		this._isPaused = false;
		this._warnOnRun = true;
		this.__v_skip = true;
		if (!detached && activeEffectScope) if (activeEffectScope.active) {
			this.parent = activeEffectScope;
			this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
		} else {
			this._active = false;
			this._warnOnRun = false;
		}
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = true;
			let i, l;
			if (this.scopes) for (i = 0, l = this.scopes.length; i < l; i++) this.scopes[i].pause();
			for (i = 0, l = this.effects.length; i < l; i++) this.effects[i].pause();
		}
	}
	/**
	* Resumes the effect scope, including all child scopes and effects.
	*/
	resume() {
		if (this._active) {
			if (this._isPaused) {
				this._isPaused = false;
				let i, l;
				if (this.scopes) for (i = 0, l = this.scopes.length; i < l; i++) this.scopes[i].resume();
				for (i = 0, l = this.effects.length; i < l; i++) this.effects[i].resume();
			}
		}
	}
	run(fn) {
		if (this._active) {
			const currentEffectScope = activeEffectScope;
			try {
				activeEffectScope = this;
				return fn();
			} finally {
				activeEffectScope = currentEffectScope;
			}
		} else if (this._warnOnRun) warn$2(`cannot run an inactive effect scope.`);
	}
	/**
	* This should only be called on non-detached scopes
	* @internal
	*/
	on() {
		if (++this._on === 1) {
			this.prevScope = activeEffectScope;
			activeEffectScope = this;
		}
	}
	/**
	* This should only be called on non-detached scopes
	* @internal
	*/
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (activeEffectScope === this) activeEffectScope = this.prevScope;
			else {
				let current = activeEffectScope;
				while (current) {
					if (current.prevScope === this) {
						current.prevScope = this.prevScope;
						break;
					}
					current = current.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(fromParent) {
		if (this._active) {
			this._active = false;
			let i, l;
			for (i = 0, l = this.effects.length; i < l; i++) this.effects[i].stop();
			this.effects.length = 0;
			for (i = 0, l = this.cleanups.length; i < l; i++) this.cleanups[i]();
			this.cleanups.length = 0;
			if (this.scopes) {
				for (i = 0, l = this.scopes.length; i < l; i++) this.scopes[i].stop(true);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !fromParent) {
				const last = this.parent.scopes.pop();
				if (last && last !== this) {
					this.parent.scopes[this.index] = last;
					last.index = this.index;
				}
			}
			this.parent = void 0;
		}
	}
};
function getCurrentScope() {
	return activeEffectScope;
}
var activeSub;
var pausedQueueEffects = /* @__PURE__ */ new WeakSet();
var ReactiveEffect = class {
	constructor(fn) {
		this.fn = fn;
		/**
		* @internal
		*/
		this.deps = void 0;
		/**
		* @internal
		*/
		this.depsTail = void 0;
		/**
		* @internal
		*/
		this.flags = 5;
		/**
		* @internal
		*/
		this.next = void 0;
		/**
		* @internal
		*/
		this.cleanup = void 0;
		this.scheduler = void 0;
		if (activeEffectScope) if (activeEffectScope.active) activeEffectScope.effects.push(this);
		else this.flags &= -2;
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		if (this.flags & 64) {
			this.flags &= -65;
			if (pausedQueueEffects.has(this)) {
				pausedQueueEffects.delete(this);
				this.trigger();
			}
		}
	}
	/**
	* @internal
	*/
	notify() {
		if (this.flags & 2 && !(this.flags & 32)) return;
		if (!(this.flags & 8)) batch(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2;
		cleanupEffect(this);
		prepareDeps(this);
		const prevEffect = activeSub;
		const prevShouldTrack = shouldTrack;
		activeSub = this;
		shouldTrack = true;
		try {
			return this.fn();
		} finally {
			if (activeSub !== this) warn$2("Active effect was not restored correctly - this is likely a Vue internal bug.");
			cleanupDeps(this);
			activeSub = prevEffect;
			shouldTrack = prevShouldTrack;
			this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let link = this.deps; link; link = link.nextDep) removeSub(link);
			this.deps = this.depsTail = void 0;
			cleanupEffect(this);
			this.onStop && this.onStop();
			this.flags &= -2;
		}
	}
	trigger() {
		if (this.flags & 64) pausedQueueEffects.add(this);
		else if (this.scheduler) this.scheduler();
		else this.runIfDirty();
	}
	/**
	* @internal
	*/
	runIfDirty() {
		if (isDirty(this)) this.run();
	}
	get dirty() {
		return isDirty(this);
	}
};
var batchDepth = 0;
var batchedSub;
var batchedComputed;
function batch(sub, isComputed = false) {
	sub.flags |= 8;
	if (isComputed) {
		sub.next = batchedComputed;
		batchedComputed = sub;
		return;
	}
	sub.next = batchedSub;
	batchedSub = sub;
}
function startBatch() {
	batchDepth++;
}
function endBatch() {
	if (--batchDepth > 0) return;
	if (batchedComputed) {
		let e = batchedComputed;
		batchedComputed = void 0;
		while (e) {
			const next = e.next;
			e.next = void 0;
			e.flags &= -9;
			e = next;
		}
	}
	let error;
	while (batchedSub) {
		let e = batchedSub;
		batchedSub = void 0;
		while (e) {
			const next = e.next;
			e.next = void 0;
			e.flags &= -9;
			if (e.flags & 1) try {
				e.trigger();
			} catch (err) {
				if (!error) error = err;
			}
			e = next;
		}
	}
	if (error) throw error;
}
function prepareDeps(sub) {
	for (let link = sub.deps; link; link = link.nextDep) {
		link.version = -1;
		link.prevActiveLink = link.dep.activeLink;
		link.dep.activeLink = link;
	}
}
function cleanupDeps(sub) {
	let head;
	let tail = sub.depsTail;
	let link = tail;
	while (link) {
		const prev = link.prevDep;
		if (link.version === -1) {
			if (link === tail) tail = prev;
			removeSub(link);
			removeDep(link);
		} else head = link;
		link.dep.activeLink = link.prevActiveLink;
		link.prevActiveLink = void 0;
		link = prev;
	}
	sub.deps = head;
	sub.depsTail = tail;
}
function isDirty(sub) {
	for (let link = sub.deps; link; link = link.nextDep) if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) return true;
	if (sub._dirty) return true;
	return false;
}
function refreshComputed(computed) {
	if (computed.flags & 4 && !(computed.flags & 16)) return;
	computed.flags &= -17;
	if (computed.globalVersion === globalVersion) return;
	computed.globalVersion = globalVersion;
	if (!computed.isSSR && computed.flags & 128 && (!computed.deps && !computed._dirty || !isDirty(computed))) return;
	computed.flags |= 2;
	const dep = computed.dep;
	const prevSub = activeSub;
	const prevShouldTrack = shouldTrack;
	activeSub = computed;
	shouldTrack = true;
	try {
		prepareDeps(computed);
		const value = computed.fn(computed._value);
		if (dep.version === 0 || hasChanged(value, computed._value)) {
			computed.flags |= 128;
			computed._value = value;
			dep.version++;
		}
	} catch (err) {
		dep.version++;
		throw err;
	} finally {
		activeSub = prevSub;
		shouldTrack = prevShouldTrack;
		cleanupDeps(computed);
		computed.flags &= -3;
	}
}
function removeSub(link, soft = false) {
	const { dep, prevSub, nextSub } = link;
	if (prevSub) {
		prevSub.nextSub = nextSub;
		link.prevSub = void 0;
	}
	if (nextSub) {
		nextSub.prevSub = prevSub;
		link.nextSub = void 0;
	}
	if (dep.subsHead === link) dep.subsHead = nextSub;
	if (dep.subs === link) {
		dep.subs = prevSub;
		if (!prevSub && dep.computed) {
			dep.computed.flags &= -5;
			for (let l = dep.computed.deps; l; l = l.nextDep) removeSub(l, true);
		}
	}
	if (!soft && !--dep.sc && dep.map) dep.map.delete(dep.key);
}
function removeDep(link) {
	const { prevDep, nextDep } = link;
	if (prevDep) {
		prevDep.nextDep = nextDep;
		link.prevDep = void 0;
	}
	if (nextDep) {
		nextDep.prevDep = prevDep;
		link.nextDep = void 0;
	}
}
var shouldTrack = true;
var trackStack = [];
function pauseTracking() {
	trackStack.push(shouldTrack);
	shouldTrack = false;
}
function resetTracking() {
	const last = trackStack.pop();
	shouldTrack = last === void 0 ? true : last;
}
function cleanupEffect(e) {
	const { cleanup } = e;
	e.cleanup = void 0;
	if (cleanup) {
		const prevSub = activeSub;
		activeSub = void 0;
		try {
			cleanup();
		} finally {
			activeSub = prevSub;
		}
	}
}
var globalVersion = 0;
var Link = class {
	constructor(sub, dep) {
		this.sub = sub;
		this.dep = dep;
		this.version = dep.version;
		this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
};
var Dep = class {
	constructor(computed) {
		this.computed = computed;
		this.version = 0;
		/**
		* Link between this dep and the current active effect
		*/
		this.activeLink = void 0;
		/**
		* Doubly linked list representing the subscribing effects (tail)
		*/
		this.subs = void 0;
		/**
		* For object property deps cleanup
		*/
		this.map = void 0;
		this.key = void 0;
		/**
		* Subscriber counter
		*/
		this.sc = 0;
		/**
		* @internal
		*/
		this.__v_skip = true;
		this.subsHead = void 0;
	}
	track(debugInfo) {
		if (!activeSub || !shouldTrack || activeSub === this.computed) return;
		let link = this.activeLink;
		if (link === void 0 || link.sub !== activeSub) {
			link = this.activeLink = new Link(activeSub, this);
			if (!activeSub.deps) activeSub.deps = activeSub.depsTail = link;
			else {
				link.prevDep = activeSub.depsTail;
				activeSub.depsTail.nextDep = link;
				activeSub.depsTail = link;
			}
			addSub(link);
		} else if (link.version === -1) {
			link.version = this.version;
			if (link.nextDep) {
				const next = link.nextDep;
				next.prevDep = link.prevDep;
				if (link.prevDep) link.prevDep.nextDep = next;
				link.prevDep = activeSub.depsTail;
				link.nextDep = void 0;
				activeSub.depsTail.nextDep = link;
				activeSub.depsTail = link;
				if (activeSub.deps === link) activeSub.deps = next;
			}
		}
		if (activeSub.onTrack) activeSub.onTrack(extend({ effect: activeSub }, debugInfo));
		return link;
	}
	trigger(debugInfo) {
		this.version++;
		globalVersion++;
		this.notify(debugInfo);
	}
	notify(debugInfo) {
		startBatch();
		try {
			for (let head = this.subsHead; head; head = head.nextSub) if (head.sub.onTrigger && !(head.sub.flags & 8)) head.sub.onTrigger(extend({ effect: head.sub }, debugInfo));
			for (let link = this.subs; link; link = link.prevSub) if (link.sub.notify()) link.sub.dep.notify();
		} finally {
			endBatch();
		}
	}
};
function addSub(link) {
	link.dep.sc++;
	if (link.sub.flags & 4) {
		const computed = link.dep.computed;
		if (computed && !link.dep.subs) {
			computed.flags |= 20;
			for (let l = computed.deps; l; l = l.nextDep) addSub(l);
		}
		const currentTail = link.dep.subs;
		if (currentTail !== link) {
			link.prevSub = currentTail;
			if (currentTail) currentTail.nextSub = link;
		}
		if (link.dep.subsHead === void 0) link.dep.subsHead = link;
		link.dep.subs = link;
	}
}
var targetMap = /* @__PURE__ */ new WeakMap();
var ITERATE_KEY = /* @__PURE__ */ Symbol("Object iterate");
var MAP_KEY_ITERATE_KEY = /* @__PURE__ */ Symbol("Map keys iterate");
var ARRAY_ITERATE_KEY = /* @__PURE__ */ Symbol("Array iterate");
function track(target, type, key) {
	if (shouldTrack && activeSub) {
		let depsMap = targetMap.get(target);
		if (!depsMap) targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
		let dep = depsMap.get(key);
		if (!dep) {
			depsMap.set(key, dep = new Dep());
			dep.map = depsMap;
			dep.key = key;
		}
		dep.track({
			target,
			type,
			key
		});
	}
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
	const depsMap = targetMap.get(target);
	if (!depsMap) {
		globalVersion++;
		return;
	}
	const run = (dep) => {
		if (dep) dep.trigger({
			target,
			type,
			key,
			newValue,
			oldValue,
			oldTarget
		});
	};
	startBatch();
	if (type === "clear") depsMap.forEach(run);
	else {
		const targetIsArray = isArray(target);
		const isArrayIndex = targetIsArray && isIntegerKey(key);
		if (targetIsArray && key === "length") {
			const newLength = Number(newValue);
			depsMap.forEach((dep, key2) => {
				if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) run(dep);
			});
		} else {
			if (key !== void 0 || depsMap.has(void 0)) run(depsMap.get(key));
			if (isArrayIndex) run(depsMap.get(ARRAY_ITERATE_KEY));
			switch (type) {
				case "add":
					if (!targetIsArray) {
						run(depsMap.get(ITERATE_KEY));
						if (isMap(target)) run(depsMap.get(MAP_KEY_ITERATE_KEY));
					} else if (isArrayIndex) run(depsMap.get("length"));
					break;
				case "delete":
					if (!targetIsArray) {
						run(depsMap.get(ITERATE_KEY));
						if (isMap(target)) run(depsMap.get(MAP_KEY_ITERATE_KEY));
					}
					break;
				case "set":
					if (isMap(target)) run(depsMap.get(ITERATE_KEY));
					break;
			}
		}
	}
	endBatch();
}
function reactiveReadArray(array) {
	const raw = /* @__PURE__ */ toRaw(array);
	if (raw === array) return raw;
	track(raw, "iterate", ARRAY_ITERATE_KEY);
	return /* @__PURE__ */ isShallow(array) ? raw : raw.map(toReactive);
}
function shallowReadArray(arr) {
	track(arr = /* @__PURE__ */ toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
	return arr;
}
function toWrapped(target, item) {
	if (/* @__PURE__ */ isReadonly(target)) return /* @__PURE__ */ isReactive(target) ? toReadonly(toReactive(item)) : toReadonly(item);
	return toReactive(item);
}
var arrayInstrumentations = {
	__proto__: null,
	[Symbol.iterator]() {
		return iterator(this, Symbol.iterator, (item) => toWrapped(this, item));
	},
	concat(...args) {
		return reactiveReadArray(this).concat(...args.map((x) => isArray(x) ? reactiveReadArray(x) : x));
	},
	entries() {
		return iterator(this, "entries", (value) => {
			value[1] = toWrapped(this, value[1]);
			return value;
		});
	},
	every(fn, thisArg) {
		return apply(this, "every", fn, thisArg, void 0, arguments);
	},
	filter(fn, thisArg) {
		return apply(this, "filter", fn, thisArg, (v) => v.map((item) => toWrapped(this, item)), arguments);
	},
	find(fn, thisArg) {
		return apply(this, "find", fn, thisArg, (item) => toWrapped(this, item), arguments);
	},
	findIndex(fn, thisArg) {
		return apply(this, "findIndex", fn, thisArg, void 0, arguments);
	},
	findLast(fn, thisArg) {
		return apply(this, "findLast", fn, thisArg, (item) => toWrapped(this, item), arguments);
	},
	findLastIndex(fn, thisArg) {
		return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
	},
	forEach(fn, thisArg) {
		return apply(this, "forEach", fn, thisArg, void 0, arguments);
	},
	includes(...args) {
		return searchProxy(this, "includes", args);
	},
	indexOf(...args) {
		return searchProxy(this, "indexOf", args);
	},
	join(separator) {
		return reactiveReadArray(this).join(separator);
	},
	lastIndexOf(...args) {
		return searchProxy(this, "lastIndexOf", args);
	},
	map(fn, thisArg) {
		return apply(this, "map", fn, thisArg, void 0, arguments);
	},
	pop() {
		return noTracking(this, "pop");
	},
	push(...args) {
		return noTracking(this, "push", args);
	},
	reduce(fn, ...args) {
		return reduce(this, "reduce", fn, args);
	},
	reduceRight(fn, ...args) {
		return reduce(this, "reduceRight", fn, args);
	},
	shift() {
		return noTracking(this, "shift");
	},
	some(fn, thisArg) {
		return apply(this, "some", fn, thisArg, void 0, arguments);
	},
	splice(...args) {
		return noTracking(this, "splice", args);
	},
	toReversed() {
		return reactiveReadArray(this).toReversed();
	},
	toSorted(comparer) {
		return reactiveReadArray(this).toSorted(comparer);
	},
	toSpliced(...args) {
		return reactiveReadArray(this).toSpliced(...args);
	},
	unshift(...args) {
		return noTracking(this, "unshift", args);
	},
	values() {
		return iterator(this, "values", (item) => toWrapped(this, item));
	}
};
function iterator(self, method, wrapValue) {
	const arr = shallowReadArray(self);
	const iter = arr[method]();
	if (arr !== self && !/* @__PURE__ */ isShallow(self)) {
		iter._next = iter.next;
		iter.next = () => {
			const result = iter._next();
			if (!result.done) result.value = wrapValue(result.value);
			return result;
		};
	}
	return iter;
}
var arrayProto = Array.prototype;
function apply(self, method, fn, thisArg, wrappedRetFn, args) {
	const arr = shallowReadArray(self);
	const needsWrap = arr !== self && !/* @__PURE__ */ isShallow(self);
	const methodFn = arr[method];
	if (methodFn !== arrayProto[method]) {
		const result2 = methodFn.apply(self, args);
		return needsWrap ? toReactive(result2) : result2;
	}
	let wrappedFn = fn;
	if (arr !== self) {
		if (needsWrap) wrappedFn = function(item, index) {
			return fn.call(this, toWrapped(self, item), index, self);
		};
		else if (fn.length > 2) wrappedFn = function(item, index) {
			return fn.call(this, item, index, self);
		};
	}
	const result = methodFn.call(arr, wrappedFn, thisArg);
	return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
}
function reduce(self, method, fn, args) {
	const arr = shallowReadArray(self);
	const needsWrap = arr !== self && !/* @__PURE__ */ isShallow(self);
	let wrappedFn = fn;
	let wrapInitialAccumulator = false;
	if (arr !== self) {
		if (needsWrap) {
			wrapInitialAccumulator = args.length === 0;
			wrappedFn = function(acc, item, index) {
				if (wrapInitialAccumulator) {
					wrapInitialAccumulator = false;
					acc = toWrapped(self, acc);
				}
				return fn.call(this, acc, toWrapped(self, item), index, self);
			};
		} else if (fn.length > 3) wrappedFn = function(acc, item, index) {
			return fn.call(this, acc, item, index, self);
		};
	}
	const result = arr[method](wrappedFn, ...args);
	return wrapInitialAccumulator ? toWrapped(self, result) : result;
}
function searchProxy(self, method, args) {
	const arr = /* @__PURE__ */ toRaw(self);
	track(arr, "iterate", ARRAY_ITERATE_KEY);
	const res = arr[method](...args);
	if ((res === -1 || res === false) && /* @__PURE__ */ isProxy(args[0])) {
		args[0] = /* @__PURE__ */ toRaw(args[0]);
		return arr[method](...args);
	}
	return res;
}
function noTracking(self, method, args = []) {
	pauseTracking();
	startBatch();
	const res = (/* @__PURE__ */ toRaw(self))[method].apply(self, args);
	endBatch();
	resetTracking();
	return res;
}
var isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
var builtInSymbols = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol));
function hasOwnProperty(key) {
	if (!isSymbol(key)) key = String(key);
	const obj = /* @__PURE__ */ toRaw(this);
	track(obj, "has", key);
	return obj.hasOwnProperty(key);
}
var BaseReactiveHandler = class {
	constructor(_isReadonly = false, _isShallow = false) {
		this._isReadonly = _isReadonly;
		this._isShallow = _isShallow;
	}
	get(target, key, receiver) {
		if (key === "__v_skip") return target["__v_skip"];
		const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
		if (key === "__v_isReactive") return !isReadonly2;
		else if (key === "__v_isReadonly") return isReadonly2;
		else if (key === "__v_isShallow") return isShallow2;
		else if (key === "__v_raw") {
			if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) return target;
			return;
		}
		const targetIsArray = isArray(target);
		if (!isReadonly2) {
			let fn;
			if (targetIsArray && (fn = arrayInstrumentations[key])) return fn;
			if (key === "hasOwnProperty") return hasOwnProperty;
		}
		const res = Reflect.get(target, key, /* @__PURE__ */ isRef(target) ? target : receiver);
		if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) return res;
		if (!isReadonly2) track(target, "get", key);
		if (isShallow2) return res;
		if (/* @__PURE__ */ isRef(res)) {
			const value = targetIsArray && isIntegerKey(key) ? res : res.value;
			return isReadonly2 && isObject(value) ? /* @__PURE__ */ readonly(value) : value;
		}
		if (isObject(res)) return isReadonly2 ? /* @__PURE__ */ readonly(res) : /* @__PURE__ */ reactive(res);
		return res;
	}
};
var MutableReactiveHandler = class extends BaseReactiveHandler {
	constructor(isShallow2 = false) {
		super(false, isShallow2);
	}
	set(target, key, value, receiver) {
		let oldValue = target[key];
		const isArrayWithIntegerKey = isArray(target) && isIntegerKey(key);
		if (!this._isShallow) {
			const isOldValueReadonly = /* @__PURE__ */ isReadonly(oldValue);
			if (!/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) {
				oldValue = /* @__PURE__ */ toRaw(oldValue);
				value = /* @__PURE__ */ toRaw(value);
			}
			if (!isArrayWithIntegerKey && /* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) if (isOldValueReadonly) {
				warn$2(`Set operation on key "${String(key)}" failed: target is readonly.`, target[key]);
				return true;
			} else {
				oldValue.value = value;
				return true;
			}
		}
		const hadKey = isArrayWithIntegerKey ? Number(key) < target.length : hasOwn(target, key);
		const result = Reflect.set(target, key, value, /* @__PURE__ */ isRef(target) ? target : receiver);
		if (target === /* @__PURE__ */ toRaw(receiver)) {
			if (!hadKey) trigger(target, "add", key, value);
			else if (hasChanged(value, oldValue)) trigger(target, "set", key, value, oldValue);
		}
		return result;
	}
	deleteProperty(target, key) {
		const hadKey = hasOwn(target, key);
		const oldValue = target[key];
		const result = Reflect.deleteProperty(target, key);
		if (result && hadKey) trigger(target, "delete", key, void 0, oldValue);
		return result;
	}
	has(target, key) {
		const result = Reflect.has(target, key);
		if (!isSymbol(key) || !builtInSymbols.has(key)) track(target, "has", key);
		return result;
	}
	ownKeys(target) {
		track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
		return Reflect.ownKeys(target);
	}
};
var ReadonlyReactiveHandler = class extends BaseReactiveHandler {
	constructor(isShallow2 = false) {
		super(true, isShallow2);
	}
	set(target, key) {
		warn$2(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
		return true;
	}
	deleteProperty(target, key) {
		warn$2(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
		return true;
	}
};
var mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
var readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
var shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
var shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
var toShallow = (value) => value;
var getProto = (v) => Reflect.getPrototypeOf(v);
function createIterableMethod(method, isReadonly2, isShallow2) {
	return function(...args) {
		const target = this["__v_raw"];
		const rawTarget = /* @__PURE__ */ toRaw(target);
		const targetIsMap = isMap(rawTarget);
		const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
		const isKeyOnly = method === "keys" && targetIsMap;
		const innerIterator = target[method](...args);
		const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
		!isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
		return extend(Object.create(innerIterator), { next() {
			const { value, done } = innerIterator.next();
			return done ? {
				value,
				done
			} : {
				value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
				done
			};
		} });
	};
}
function createReadonlyMethod(type) {
	return function(...args) {
		{
			const key = args[0] ? `on key "${args[0]}" ` : ``;
			warn$2(`${capitalize(type)} operation ${key}failed: target is readonly.`, /* @__PURE__ */ toRaw(this));
		}
		return type === "delete" ? false : type === "clear" ? void 0 : this;
	};
}
function createInstrumentations(readonly, shallow) {
	const instrumentations = {
		get(key) {
			const target = this["__v_raw"];
			const rawTarget = /* @__PURE__ */ toRaw(target);
			const rawKey = /* @__PURE__ */ toRaw(key);
			if (!readonly) {
				if (hasChanged(key, rawKey)) track(rawTarget, "get", key);
				track(rawTarget, "get", rawKey);
			}
			const { has } = getProto(rawTarget);
			const wrap = shallow ? toShallow : readonly ? toReadonly : toReactive;
			if (has.call(rawTarget, key)) return wrap(target.get(key));
			else if (has.call(rawTarget, rawKey)) return wrap(target.get(rawKey));
			else if (target !== rawTarget) target.get(key);
		},
		get size() {
			const target = this["__v_raw"];
			!readonly && track(/* @__PURE__ */ toRaw(target), "iterate", ITERATE_KEY);
			return target.size;
		},
		has(key) {
			const target = this["__v_raw"];
			const rawTarget = /* @__PURE__ */ toRaw(target);
			const rawKey = /* @__PURE__ */ toRaw(key);
			if (!readonly) {
				if (hasChanged(key, rawKey)) track(rawTarget, "has", key);
				track(rawTarget, "has", rawKey);
			}
			return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
		},
		forEach(callback, thisArg) {
			const observed = this;
			const target = observed["__v_raw"];
			const rawTarget = /* @__PURE__ */ toRaw(target);
			const wrap = shallow ? toShallow : readonly ? toReadonly : toReactive;
			!readonly && track(rawTarget, "iterate", ITERATE_KEY);
			return target.forEach((value, key) => {
				return callback.call(thisArg, wrap(value), wrap(key), observed);
			});
		}
	};
	extend(instrumentations, readonly ? {
		add: createReadonlyMethod("add"),
		set: createReadonlyMethod("set"),
		delete: createReadonlyMethod("delete"),
		clear: createReadonlyMethod("clear")
	} : {
		add(value) {
			const target = /* @__PURE__ */ toRaw(this);
			const proto = getProto(target);
			const rawValue = /* @__PURE__ */ toRaw(value);
			const valueToAdd = !shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value) ? rawValue : value;
			if (!(proto.has.call(target, valueToAdd) || hasChanged(value, valueToAdd) && proto.has.call(target, value) || hasChanged(rawValue, valueToAdd) && proto.has.call(target, rawValue))) {
				target.add(valueToAdd);
				trigger(target, "add", valueToAdd, valueToAdd);
			}
			return this;
		},
		set(key, value) {
			if (!shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) value = /* @__PURE__ */ toRaw(value);
			const target = /* @__PURE__ */ toRaw(this);
			const { has, get } = getProto(target);
			let hadKey = has.call(target, key);
			if (!hadKey) {
				key = /* @__PURE__ */ toRaw(key);
				hadKey = has.call(target, key);
			} else checkIdentityKeys(target, has, key);
			const oldValue = get.call(target, key);
			target.set(key, value);
			if (!hadKey) trigger(target, "add", key, value);
			else if (hasChanged(value, oldValue)) trigger(target, "set", key, value, oldValue);
			return this;
		},
		delete(key) {
			const target = /* @__PURE__ */ toRaw(this);
			const { has, get } = getProto(target);
			let hadKey = has.call(target, key);
			if (!hadKey) {
				key = /* @__PURE__ */ toRaw(key);
				hadKey = has.call(target, key);
			} else checkIdentityKeys(target, has, key);
			const oldValue = get ? get.call(target, key) : void 0;
			const result = target.delete(key);
			if (hadKey) trigger(target, "delete", key, void 0, oldValue);
			return result;
		},
		clear() {
			const target = /* @__PURE__ */ toRaw(this);
			const hadItems = target.size !== 0;
			const oldTarget = isMap(target) ? new Map(target) : new Set(target);
			const result = target.clear();
			if (hadItems) trigger(target, "clear", void 0, void 0, oldTarget);
			return result;
		}
	});
	[
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((method) => {
		instrumentations[method] = createIterableMethod(method, readonly, shallow);
	});
	return instrumentations;
}
function createInstrumentationGetter(isReadonly2, shallow) {
	const instrumentations = createInstrumentations(isReadonly2, shallow);
	return (target, key, receiver) => {
		if (key === "__v_isReactive") return !isReadonly2;
		else if (key === "__v_isReadonly") return isReadonly2;
		else if (key === "__v_raw") return target;
		return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
	};
}
var mutableCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(false, false) };
var shallowCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(false, true) };
var readonlyCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(true, false) };
var shallowReadonlyCollectionHandlers = { get: /* @__PURE__ */ createInstrumentationGetter(true, true) };
function checkIdentityKeys(target, has, key) {
	const rawKey = /* @__PURE__ */ toRaw(key);
	if (rawKey !== key && has.call(target, rawKey)) {
		const type = toRawType(target);
		warn$2(`Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
	}
}
var reactiveMap = /* @__PURE__ */ new WeakMap();
var shallowReactiveMap = /* @__PURE__ */ new WeakMap();
var readonlyMap = /* @__PURE__ */ new WeakMap();
var shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
	switch (rawType) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
function getTargetType(value) {
	return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
/* @__NO_SIDE_EFFECTS__ */
function reactive(target) {
	if (/* @__PURE__ */ isReadonly(target)) return target;
	return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
/* @__NO_SIDE_EFFECTS__ */
function shallowReactive(target) {
	return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
/* @__NO_SIDE_EFFECTS__ */
function readonly(target) {
	return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
/* @__NO_SIDE_EFFECTS__ */
function shallowReadonly(target) {
	return createReactiveObject(target, true, shallowReadonlyHandlers, shallowReadonlyCollectionHandlers, shallowReadonlyMap);
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
	if (!isObject(target)) {
		warn$2(`value cannot be made ${isReadonly2 ? "readonly" : "reactive"}: ${String(target)}`);
		return target;
	}
	if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) return target;
	const targetType = getTargetType(target);
	if (targetType === 0) return target;
	const existingProxy = proxyMap.get(target);
	if (existingProxy) return existingProxy;
	const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
	proxyMap.set(target, proxy);
	return proxy;
}
/* @__NO_SIDE_EFFECTS__ */
function isReactive(value) {
	if (/* @__PURE__ */ isReadonly(value)) return /* @__PURE__ */ isReactive(value["__v_raw"]);
	return !!(value && value["__v_isReactive"]);
}
/* @__NO_SIDE_EFFECTS__ */
function isReadonly(value) {
	return !!(value && value["__v_isReadonly"]);
}
/* @__NO_SIDE_EFFECTS__ */
function isShallow(value) {
	return !!(value && value["__v_isShallow"]);
}
/* @__NO_SIDE_EFFECTS__ */
function isProxy(value) {
	return value ? !!value["__v_raw"] : false;
}
/* @__NO_SIDE_EFFECTS__ */
function toRaw(observed) {
	const raw = observed && observed["__v_raw"];
	return raw ? /* @__PURE__ */ toRaw(raw) : observed;
}
function markRaw(value) {
	if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) def(value, "__v_skip", true);
	return value;
}
var toReactive = (value) => isObject(value) ? /* @__PURE__ */ reactive(value) : value;
var toReadonly = (value) => isObject(value) ? /* @__PURE__ */ readonly(value) : value;
/* @__NO_SIDE_EFFECTS__ */
function isRef(r) {
	return r ? r["__v_isRef"] === true : false;
}
/* @__NO_SIDE_EFFECTS__ */
function ref(value) {
	return createRef(value, false);
}
/* @__NO_SIDE_EFFECTS__ */
function shallowRef(value) {
	return createRef(value, true);
}
function createRef(rawValue, shallow) {
	if (/* @__PURE__ */ isRef(rawValue)) return rawValue;
	return new RefImpl(rawValue, shallow);
}
var RefImpl = class {
	constructor(value, isShallow2) {
		this.dep = new Dep();
		this["__v_isRef"] = true;
		this["__v_isShallow"] = false;
		this._rawValue = isShallow2 ? value : /* @__PURE__ */ toRaw(value);
		this._value = isShallow2 ? value : toReactive(value);
		this["__v_isShallow"] = isShallow2;
	}
	get value() {
		this.dep.track({
			target: this,
			type: "get",
			key: "value"
		});
		return this._value;
	}
	set value(newValue) {
		const oldValue = this._rawValue;
		const useDirectValue = this["__v_isShallow"] || /* @__PURE__ */ isShallow(newValue) || /* @__PURE__ */ isReadonly(newValue);
		newValue = useDirectValue ? newValue : /* @__PURE__ */ toRaw(newValue);
		if (hasChanged(newValue, oldValue)) {
			this._rawValue = newValue;
			this._value = useDirectValue ? newValue : toReactive(newValue);
			this.dep.trigger({
				target: this,
				type: "set",
				key: "value",
				newValue,
				oldValue
			});
		}
	}
};
function unref(ref2) {
	return /* @__PURE__ */ isRef(ref2) ? ref2.value : ref2;
}
var shallowUnwrapHandlers = {
	get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
	set: (target, key, value, receiver) => {
		const oldValue = target[key];
		if (/* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) {
			oldValue.value = value;
			return true;
		} else return Reflect.set(target, key, value, receiver);
	}
};
function proxyRefs(objectWithRefs) {
	return /* @__PURE__ */ isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
var ComputedRefImpl = class {
	constructor(fn, setter, isSSR) {
		this.fn = fn;
		this.setter = setter;
		/**
		* @internal
		*/
		this._value = void 0;
		/**
		* @internal
		*/
		this.dep = new Dep(this);
		/**
		* @internal
		*/
		this.__v_isRef = true;
		/**
		* @internal
		*/
		this.deps = void 0;
		/**
		* @internal
		*/
		this.depsTail = void 0;
		/**
		* @internal
		*/
		this.flags = 16;
		/**
		* @internal
		*/
		this.globalVersion = globalVersion - 1;
		/**
		* @internal
		*/
		this.next = void 0;
		this.effect = this;
		this["__v_isReadonly"] = !setter;
		this.isSSR = isSSR;
	}
	/**
	* @internal
	*/
	notify() {
		this.flags |= 16;
		if (!(this.flags & 8) && activeSub !== this) {
			batch(this, true);
			return true;
		}
	}
	get value() {
		const link = this.dep.track({
			target: this,
			type: "get",
			key: "value"
		});
		refreshComputed(this);
		if (link) link.version = this.dep.version;
		return this._value;
	}
	set value(newValue) {
		if (this.setter) this.setter(newValue);
		else warn$2("Write operation failed: computed value is readonly");
	}
};
/* @__NO_SIDE_EFFECTS__ */
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
	let getter;
	let setter;
	if (isFunction(getterOrOptions)) getter = getterOrOptions;
	else {
		getter = getterOrOptions.get;
		setter = getterOrOptions.set;
	}
	const cRef = new ComputedRefImpl(getter, setter, isSSR);
	if (debugOptions && !isSSR) {
		cRef.onTrack = debugOptions.onTrack;
		cRef.onTrigger = debugOptions.onTrigger;
	}
	return cRef;
}
var INITIAL_WATCHER_VALUE = {};
var cleanupMap = /* @__PURE__ */ new WeakMap();
var activeWatcher = void 0;
function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
	if (owner) {
		let cleanups = cleanupMap.get(owner);
		if (!cleanups) cleanupMap.set(owner, cleanups = []);
		cleanups.push(cleanupFn);
	} else if (!failSilently) warn$2(`onWatcherCleanup() was called when there was no active watcher to associate with.`);
}
function watch$1(source, cb, options = EMPTY_OBJ) {
	const { immediate, deep, once, scheduler, augmentJob, call } = options;
	const warnInvalidSource = (s) => {
		(options.onWarn || warn$2)(`Invalid watch source: `, s, `A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`);
	};
	const reactiveGetter = (source2) => {
		if (deep) return source2;
		if (/* @__PURE__ */ isShallow(source2) || deep === false || deep === 0) return traverse(source2, 1);
		return traverse(source2);
	};
	let effect;
	let getter;
	let cleanup;
	let boundCleanup;
	let forceTrigger = false;
	let isMultiSource = false;
	if (/* @__PURE__ */ isRef(source)) {
		getter = () => source.value;
		forceTrigger = /* @__PURE__ */ isShallow(source);
	} else if (/* @__PURE__ */ isReactive(source)) {
		getter = () => reactiveGetter(source);
		forceTrigger = true;
	} else if (isArray(source)) {
		isMultiSource = true;
		forceTrigger = source.some((s) => /* @__PURE__ */ isReactive(s) || /* @__PURE__ */ isShallow(s));
		getter = () => source.map((s) => {
			if (/* @__PURE__ */ isRef(s)) return s.value;
			else if (/* @__PURE__ */ isReactive(s)) return reactiveGetter(s);
			else if (isFunction(s)) return call ? call(s, 2) : s();
			else warnInvalidSource(s);
		});
	} else if (isFunction(source)) if (cb) getter = call ? () => call(source, 2) : source;
	else getter = () => {
		if (cleanup) {
			pauseTracking();
			try {
				cleanup();
			} finally {
				resetTracking();
			}
		}
		const currentEffect = activeWatcher;
		activeWatcher = effect;
		try {
			return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
		} finally {
			activeWatcher = currentEffect;
		}
	};
	else {
		getter = NOOP;
		warnInvalidSource(source);
	}
	if (cb && deep) {
		const baseGetter = getter;
		const depth = deep === true ? Infinity : deep;
		getter = () => traverse(baseGetter(), depth);
	}
	const scope = getCurrentScope();
	const watchHandle = () => {
		effect.stop();
		if (scope && scope.active) remove(scope.effects, effect);
	};
	if (once && cb) {
		const _cb = cb;
		cb = (...args) => {
			_cb(...args);
			watchHandle();
		};
	}
	let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
	const job = (immediateFirstRun) => {
		if (!(effect.flags & 1) || !effect.dirty && !immediateFirstRun) return;
		if (cb) {
			const newValue = effect.run();
			if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
				if (cleanup) cleanup();
				const currentWatcher = activeWatcher;
				activeWatcher = effect;
				try {
					const args = [
						newValue,
						oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
						boundCleanup
					];
					oldValue = newValue;
					call ? call(cb, 3, args) : cb(...args);
				} finally {
					activeWatcher = currentWatcher;
				}
			}
		} else effect.run();
	};
	if (augmentJob) augmentJob(job);
	effect = new ReactiveEffect(getter);
	effect.scheduler = scheduler ? () => scheduler(job, false) : job;
	boundCleanup = (fn) => onWatcherCleanup(fn, false, effect);
	cleanup = effect.onStop = () => {
		const cleanups = cleanupMap.get(effect);
		if (cleanups) {
			if (call) call(cleanups, 4);
			else for (const cleanup2 of cleanups) cleanup2();
			cleanupMap.delete(effect);
		}
	};
	effect.onTrack = options.onTrack;
	effect.onTrigger = options.onTrigger;
	if (cb) if (immediate) job(true);
	else oldValue = effect.run();
	else if (scheduler) scheduler(job.bind(null, true), true);
	else effect.run();
	watchHandle.pause = effect.pause.bind(effect);
	watchHandle.resume = effect.resume.bind(effect);
	watchHandle.stop = watchHandle;
	return watchHandle;
}
function traverse(value, depth = Infinity, seen) {
	if (depth <= 0 || !isObject(value) || value["__v_skip"]) return value;
	seen = seen || /* @__PURE__ */ new Map();
	if ((seen.get(value) || 0) >= depth) return value;
	seen.set(value, depth);
	depth--;
	if (/* @__PURE__ */ isRef(value)) traverse(value.value, depth, seen);
	else if (isArray(value)) for (let i = 0; i < value.length; i++) traverse(value[i], depth, seen);
	else if (isSet(value) || isMap(value)) value.forEach((v) => {
		traverse(v, depth, seen);
	});
	else if (isPlainObject(value)) {
		for (const key in value) traverse(value[key], depth, seen);
		for (const key of Object.getOwnPropertySymbols(value)) if (Object.prototype.propertyIsEnumerable.call(value, key)) traverse(value[key], depth, seen);
	}
	return value;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
/**
* @vue/runtime-core v3.5.34
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
var stack = [];
function pushWarningContext(vnode) {
	stack.push(vnode);
}
function popWarningContext() {
	stack.pop();
}
var isWarning = false;
function warn$1(msg, ...args) {
	if (isWarning) return;
	isWarning = true;
	pauseTracking();
	const instance = stack.length ? stack[stack.length - 1].component : null;
	const appWarnHandler = instance && instance.appContext.config.warnHandler;
	const trace = getComponentTrace();
	if (appWarnHandler) callWithErrorHandling(appWarnHandler, instance, 11, [
		msg + args.map((a) => {
			var _a, _b;
			return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
		}).join(""),
		instance && instance.proxy,
		trace.map(({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`).join("\n"),
		trace
	]);
	else {
		const warnArgs = [`[Vue warn]: ${msg}`, ...args];
		if (trace.length && true) warnArgs.push(`
`, ...formatTrace(trace));
		console.warn(...warnArgs);
	}
	resetTracking();
	isWarning = false;
}
function getComponentTrace() {
	let currentVNode = stack[stack.length - 1];
	if (!currentVNode) return [];
	const normalizedStack = [];
	while (currentVNode) {
		const last = normalizedStack[0];
		if (last && last.vnode === currentVNode) last.recurseCount++;
		else normalizedStack.push({
			vnode: currentVNode,
			recurseCount: 0
		});
		const parentInstance = currentVNode.component && currentVNode.component.parent;
		currentVNode = parentInstance && parentInstance.vnode;
	}
	return normalizedStack;
}
function formatTrace(trace) {
	const logs = [];
	trace.forEach((entry, i) => {
		logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
	});
	return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
	const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
	const isRoot = vnode.component ? vnode.component.parent == null : false;
	const open = ` at <${formatComponentName(vnode.component, vnode.type, isRoot)}`;
	const close = `>` + postfix;
	return vnode.props ? [
		open,
		...formatProps(vnode.props),
		close
	] : [open + close];
}
function formatProps(props) {
	const res = [];
	const keys = Object.keys(props);
	keys.slice(0, 3).forEach((key) => {
		res.push(...formatProp(key, props[key]));
	});
	if (keys.length > 3) res.push(` ...`);
	return res;
}
function formatProp(key, value, raw) {
	if (isString(value)) {
		value = JSON.stringify(value);
		return raw ? value : [`${key}=${value}`];
	} else if (typeof value === "number" || typeof value === "boolean" || value == null) return raw ? value : [`${key}=${value}`];
	else if (/* @__PURE__ */ isRef(value)) {
		value = formatProp(key, /* @__PURE__ */ toRaw(value.value), true);
		return raw ? value : [
			`${key}=Ref<`,
			value,
			`>`
		];
	} else if (isFunction(value)) return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
	else {
		value = /* @__PURE__ */ toRaw(value);
		return raw ? value : [`${key}=`, value];
	}
}
var ErrorTypeStrings$1 = {
	["sp"]: "serverPrefetch hook",
	["bc"]: "beforeCreate hook",
	["c"]: "created hook",
	["bm"]: "beforeMount hook",
	["m"]: "mounted hook",
	["bu"]: "beforeUpdate hook",
	["u"]: "updated",
	["bum"]: "beforeUnmount hook",
	["um"]: "unmounted hook",
	["a"]: "activated hook",
	["da"]: "deactivated hook",
	["ec"]: "errorCaptured hook",
	["rtc"]: "renderTracked hook",
	["rtg"]: "renderTriggered hook",
	[0]: "setup function",
	[1]: "render function",
	[2]: "watcher getter",
	[3]: "watcher callback",
	[4]: "watcher cleanup function",
	[5]: "native event handler",
	[6]: "component event handler",
	[7]: "vnode hook",
	[8]: "directive hook",
	[9]: "transition hook",
	[10]: "app errorHandler",
	[11]: "app warnHandler",
	[12]: "ref function",
	[13]: "async component loader",
	[14]: "scheduler flush",
	[15]: "component update",
	[16]: "app unmount cleanup function"
};
function callWithErrorHandling(fn, instance, type, args) {
	try {
		return args ? fn(...args) : fn();
	} catch (err) {
		handleError(err, instance, type);
	}
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
	if (isFunction(fn)) {
		const res = callWithErrorHandling(fn, instance, type, args);
		if (res && isPromise(res)) res.catch((err) => {
			handleError(err, instance, type);
		});
		return res;
	}
	if (isArray(fn)) {
		const values = [];
		for (let i = 0; i < fn.length; i++) values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
		return values;
	} else warn$1(`Invalid value type passed to callWithAsyncErrorHandling(): ${typeof fn}`);
}
function handleError(err, instance, type, throwInDev = true) {
	const contextVNode = instance ? instance.vnode : null;
	const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
	if (instance) {
		let cur = instance.parent;
		const exposedInstance = instance.proxy;
		const errorInfo = ErrorTypeStrings$1[type];
		while (cur) {
			const errorCapturedHooks = cur.ec;
			if (errorCapturedHooks) {
				for (let i = 0; i < errorCapturedHooks.length; i++) if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) return;
			}
			cur = cur.parent;
		}
		if (errorHandler) {
			pauseTracking();
			callWithErrorHandling(errorHandler, null, 10, [
				err,
				exposedInstance,
				errorInfo
			]);
			resetTracking();
			return;
		}
	}
	logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
}
function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
	{
		const info = ErrorTypeStrings$1[type];
		if (contextVNode) pushWarningContext(contextVNode);
		warn$1(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
		if (contextVNode) popWarningContext();
		if (throwInDev) throw err;
		else console.error(err);
	}
}
var queue = [];
var flushIndex = -1;
var pendingPostFlushCbs = [];
var activePostFlushCbs = null;
var postFlushIndex = 0;
var resolvedPromise = /* @__PURE__ */ Promise.resolve();
var currentFlushPromise = null;
var RECURSION_LIMIT = 100;
function nextTick(fn) {
	const p = currentFlushPromise || resolvedPromise;
	return fn ? p.then(this ? fn.bind(this) : fn) : p;
}
function findInsertionIndex(id) {
	let start = flushIndex + 1;
	let end = queue.length;
	while (start < end) {
		const middle = start + end >>> 1;
		const middleJob = queue[middle];
		const middleJobId = getId(middleJob);
		if (middleJobId < id || middleJobId === id && middleJob.flags & 2) start = middle + 1;
		else end = middle;
	}
	return start;
}
function queueJob(job) {
	if (!(job.flags & 1)) {
		const jobId = getId(job);
		const lastJob = queue[queue.length - 1];
		if (!lastJob || !(job.flags & 2) && jobId >= getId(lastJob)) queue.push(job);
		else queue.splice(findInsertionIndex(jobId), 0, job);
		job.flags |= 1;
		queueFlush();
	}
}
function queueFlush() {
	if (!currentFlushPromise) currentFlushPromise = resolvedPromise.then(flushJobs);
}
function queuePostFlushCb(cb) {
	if (!isArray(cb)) {
		if (activePostFlushCbs && cb.id === -1) activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
		else if (!(cb.flags & 1)) {
			pendingPostFlushCbs.push(cb);
			cb.flags |= 1;
		}
	} else pendingPostFlushCbs.push(...cb);
	queueFlush();
}
function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
	seen = seen || /* @__PURE__ */ new Map();
	for (; i < queue.length; i++) {
		const cb = queue[i];
		if (cb && cb.flags & 2) {
			if (instance && cb.id !== instance.uid) continue;
			if (checkRecursiveUpdates(seen, cb)) continue;
			queue.splice(i, 1);
			i--;
			if (cb.flags & 4) cb.flags &= -2;
			cb();
			if (!(cb.flags & 4)) cb.flags &= -2;
		}
	}
}
function flushPostFlushCbs(seen) {
	if (pendingPostFlushCbs.length) {
		const deduped = [...new Set(pendingPostFlushCbs)].sort((a, b) => getId(a) - getId(b));
		pendingPostFlushCbs.length = 0;
		if (activePostFlushCbs) {
			activePostFlushCbs.push(...deduped);
			return;
		}
		activePostFlushCbs = deduped;
		seen = seen || /* @__PURE__ */ new Map();
		for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
			const cb = activePostFlushCbs[postFlushIndex];
			if (checkRecursiveUpdates(seen, cb)) continue;
			if (cb.flags & 4) cb.flags &= -2;
			if (!(cb.flags & 8)) cb();
			cb.flags &= -2;
		}
		activePostFlushCbs = null;
		postFlushIndex = 0;
	}
}
var getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
function flushJobs(seen) {
	seen = seen || /* @__PURE__ */ new Map();
	const check = (job) => checkRecursiveUpdates(seen, job);
	try {
		for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
			const job = queue[flushIndex];
			if (job && !(job.flags & 8)) {
				if (check(job)) continue;
				if (job.flags & 4) job.flags &= -2;
				callWithErrorHandling(job, job.i, job.i ? 15 : 14);
				if (!(job.flags & 4)) job.flags &= -2;
			}
		}
	} finally {
		for (; flushIndex < queue.length; flushIndex++) {
			const job = queue[flushIndex];
			if (job) job.flags &= -2;
		}
		flushIndex = -1;
		queue.length = 0;
		flushPostFlushCbs(seen);
		currentFlushPromise = null;
		if (queue.length || pendingPostFlushCbs.length) flushJobs(seen);
	}
}
function checkRecursiveUpdates(seen, fn) {
	const count = seen.get(fn) || 0;
	if (count > RECURSION_LIMIT) {
		const instance = fn.i;
		const componentName = instance && getComponentName(instance.type);
		handleError(`Maximum recursive updates exceeded${componentName ? ` in component <${componentName}>` : ``}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`, null, 10);
		return true;
	}
	seen.set(fn, count + 1);
	return false;
}
var isHmrUpdating = false;
var setHmrUpdating = (v) => {
	try {
		return isHmrUpdating;
	} finally {
		isHmrUpdating = v;
	}
};
var hmrDirtyComponents = /* @__PURE__ */ new Map();
getGlobalThis().__VUE_HMR_RUNTIME__ = {
	createRecord: tryWrap(createRecord),
	rerender: tryWrap(rerender),
	reload: tryWrap(reload)
};
var map = /* @__PURE__ */ new Map();
function registerHMR(instance) {
	const id = instance.type.__hmrId;
	let record = map.get(id);
	if (!record) {
		createRecord(id, instance.type);
		record = map.get(id);
	}
	record.instances.add(instance);
}
function unregisterHMR(instance) {
	map.get(instance.type.__hmrId).instances.delete(instance);
}
function createRecord(id, initialDef) {
	if (map.has(id)) return false;
	map.set(id, {
		initialDef: normalizeClassComponent(initialDef),
		instances: /* @__PURE__ */ new Set()
	});
	return true;
}
function normalizeClassComponent(component) {
	return isClassComponent(component) ? component.__vccOpts : component;
}
function rerender(id, newRender) {
	const record = map.get(id);
	if (!record) return;
	record.initialDef.render = newRender;
	[...record.instances].forEach((instance) => {
		if (newRender) {
			instance.render = newRender;
			normalizeClassComponent(instance.type).render = newRender;
		}
		instance.renderCache = [];
		isHmrUpdating = true;
		if (!(instance.job.flags & 8)) instance.update();
		isHmrUpdating = false;
	});
}
function reload(id, newComp) {
	const record = map.get(id);
	if (!record) return;
	newComp = normalizeClassComponent(newComp);
	updateComponentDef(record.initialDef, newComp);
	const instances = [...record.instances];
	for (let i = 0; i < instances.length; i++) {
		const instance = instances[i];
		const oldComp = normalizeClassComponent(instance.type);
		let dirtyInstances = hmrDirtyComponents.get(oldComp);
		if (!dirtyInstances) {
			if (oldComp !== record.initialDef) updateComponentDef(oldComp, newComp);
			hmrDirtyComponents.set(oldComp, dirtyInstances = /* @__PURE__ */ new Set());
		}
		dirtyInstances.add(instance);
		instance.appContext.propsCache.delete(instance.type);
		instance.appContext.emitsCache.delete(instance.type);
		instance.appContext.optionsCache.delete(instance.type);
		if (instance.ceReload) {
			dirtyInstances.add(instance);
			instance.ceReload(newComp.styles);
			dirtyInstances.delete(instance);
		} else if (instance.parent) queueJob(() => {
			if (!(instance.job.flags & 8)) {
				isHmrUpdating = true;
				instance.parent.update();
				isHmrUpdating = false;
				dirtyInstances.delete(instance);
			}
		});
		else if (instance.appContext.reload) instance.appContext.reload();
		else if (typeof window !== "undefined") window.location.reload();
		else console.warn("[HMR] Root or manually mounted instance modified. Full reload required.");
		if (instance.root.ce && instance !== instance.root) instance.root.ce._removeChildStyle(oldComp);
	}
	queuePostFlushCb(() => {
		hmrDirtyComponents.clear();
	});
}
function updateComponentDef(oldComp, newComp) {
	extend(oldComp, newComp);
	for (const key in oldComp) if (key !== "__file" && !(key in newComp)) delete oldComp[key];
}
function tryWrap(fn) {
	return (id, arg) => {
		try {
			return fn(id, arg);
		} catch (e) {
			console.error(e);
			console.warn(`[HMR] Something went wrong during Vue component hot-reload. Full reload required.`);
		}
	};
}
var devtools$1;
var buffer = [];
var devtoolsNotInstalled = false;
function emit$1(event, ...args) {
	if (devtools$1) devtools$1.emit(event, ...args);
	else if (!devtoolsNotInstalled) buffer.push({
		event,
		args
	});
}
function setDevtoolsHook$1(hook, target) {
	var _a, _b;
	devtools$1 = hook;
	if (devtools$1) {
		devtools$1.enabled = true;
		buffer.forEach(({ event, args }) => devtools$1.emit(event, ...args));
		buffer = [];
	} else if (typeof window !== "undefined" && window.HTMLElement && !((_b = (_a = window.navigator) == null ? void 0 : _a.userAgent) == null ? void 0 : _b.includes("jsdom"))) {
		(target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || []).push((newHook) => {
			setDevtoolsHook$1(newHook, target);
		});
		setTimeout(() => {
			if (!devtools$1) {
				target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
				devtoolsNotInstalled = true;
				buffer = [];
			}
		}, 3e3);
	} else {
		devtoolsNotInstalled = true;
		buffer = [];
	}
}
function devtoolsInitApp(app, version) {
	emit$1("app:init", app, version, {
		Fragment,
		Text,
		Comment,
		Static
	});
}
function devtoolsUnmountApp(app) {
	emit$1("app:unmount", app);
}
var devtoolsComponentAdded = /* @__PURE__ */ createDevtoolsComponentHook("component:added");
var devtoolsComponentUpdated = /* @__PURE__ */ createDevtoolsComponentHook("component:updated");
var _devtoolsComponentRemoved = /* @__PURE__ */ createDevtoolsComponentHook("component:removed");
var devtoolsComponentRemoved = (component) => {
	if (devtools$1 && typeof devtools$1.cleanupBuffer === "function" && !devtools$1.cleanupBuffer(component)) _devtoolsComponentRemoved(component);
};
/* @__NO_SIDE_EFFECTS__ */
function createDevtoolsComponentHook(hook) {
	return (component) => {
		emit$1(hook, component.appContext.app, component.uid, component.parent ? component.parent.uid : void 0, component);
	};
}
var devtoolsPerfStart = /* @__PURE__ */ createDevtoolsPerformanceHook("perf:start");
var devtoolsPerfEnd = /* @__PURE__ */ createDevtoolsPerformanceHook("perf:end");
function createDevtoolsPerformanceHook(hook) {
	return (component, type, time) => {
		emit$1(hook, component.appContext.app, component.uid, component, type, time);
	};
}
function devtoolsComponentEmit(component, event, params) {
	emit$1("component:emit", component.appContext.app, component, event, params);
}
var currentRenderingInstance = null;
var currentScopeId = null;
function setCurrentRenderingInstance(instance) {
	const prev = currentRenderingInstance;
	currentRenderingInstance = instance;
	currentScopeId = instance && instance.type.__scopeId || null;
	return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
	if (!ctx) return fn;
	if (fn._n) return fn;
	const renderFnWithContext = (...args) => {
		if (renderFnWithContext._d) setBlockTracking(-1);
		const prevInstance = setCurrentRenderingInstance(ctx);
		let res;
		try {
			res = fn(...args);
		} finally {
			setCurrentRenderingInstance(prevInstance);
			if (renderFnWithContext._d) setBlockTracking(1);
		}
		devtoolsComponentUpdated(ctx);
		return res;
	};
	renderFnWithContext._n = true;
	renderFnWithContext._c = true;
	renderFnWithContext._d = true;
	return renderFnWithContext;
}
function validateDirectiveName(name) {
	if (isBuiltInDirective(name)) warn$1("Do not use built-in directive ids as custom directive id: " + name);
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
	const bindings = vnode.dirs;
	const oldBindings = prevVNode && prevVNode.dirs;
	for (let i = 0; i < bindings.length; i++) {
		const binding = bindings[i];
		if (oldBindings) binding.oldValue = oldBindings[i].value;
		let hook = binding.dir[name];
		if (hook) {
			pauseTracking();
			callWithAsyncErrorHandling(hook, instance, 8, [
				vnode.el,
				binding,
				vnode,
				prevVNode
			]);
			resetTracking();
		}
	}
}
function provide(key, value) {
	if (!currentInstance || currentInstance.isMounted) warn$1(`provide() can only be used inside setup().`);
	if (currentInstance) {
		let provides = currentInstance.provides;
		const parentProvides = currentInstance.parent && currentInstance.parent.provides;
		if (parentProvides === provides) provides = currentInstance.provides = Object.create(parentProvides);
		provides[key] = value;
	}
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
	const instance = getCurrentInstance();
	if (instance || currentApp) {
		let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
		if (provides && key in provides) return provides[key];
		else if (arguments.length > 1) return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
		else warn$1(`injection "${String(key)}" not found.`);
	} else warn$1(`inject() can only be used inside setup() or functional components.`);
}
var ssrContextKey = /* @__PURE__ */ Symbol.for("v-scx");
var useSSRContext = () => {
	{
		const ctx = inject(ssrContextKey);
		if (!ctx) warn$1(`Server rendering context not provided. Make sure to only call useSSRContext() conditionally in the server build.`);
		return ctx;
	}
};
function watch(source, cb, options) {
	if (!isFunction(cb)) warn$1(`\`watch(fn, options?)\` signature has been moved to a separate API. Use \`watchEffect(fn, options?)\` instead. \`watch\` now only supports \`watch(source, cb, options?) signature.`);
	return doWatch(source, cb, options);
}
function doWatch(source, cb, options = EMPTY_OBJ) {
	const { immediate, deep, flush, once } = options;
	if (!cb) {
		if (immediate !== void 0) warn$1(`watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.`);
		if (deep !== void 0) warn$1(`watch() "deep" option is only respected when using the watch(source, callback, options?) signature.`);
		if (once !== void 0) warn$1(`watch() "once" option is only respected when using the watch(source, callback, options?) signature.`);
	}
	const baseWatchOptions = extend({}, options);
	baseWatchOptions.onWarn = warn$1;
	const runsImmediately = cb && immediate || !cb && flush !== "post";
	let ssrCleanup;
	if (isInSSRComponentSetup) {
		if (flush === "sync") {
			const ctx = useSSRContext();
			ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
		} else if (!runsImmediately) {
			const watchStopHandle = () => {};
			watchStopHandle.stop = NOOP;
			watchStopHandle.resume = NOOP;
			watchStopHandle.pause = NOOP;
			return watchStopHandle;
		}
	}
	const instance = currentInstance;
	baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
	let isPre = false;
	if (flush === "post") baseWatchOptions.scheduler = (job) => {
		queuePostRenderEffect(job, instance && instance.suspense);
	};
	else if (flush !== "sync") {
		isPre = true;
		baseWatchOptions.scheduler = (job, isFirstRun) => {
			if (isFirstRun) job();
			else queueJob(job);
		};
	}
	baseWatchOptions.augmentJob = (job) => {
		if (cb) job.flags |= 4;
		if (isPre) {
			job.flags |= 2;
			if (instance) {
				job.id = instance.uid;
				job.i = instance;
			}
		}
	};
	const watchHandle = watch$1(source, cb, baseWatchOptions);
	if (isInSSRComponentSetup) {
		if (ssrCleanup) ssrCleanup.push(watchHandle);
		else if (runsImmediately) watchHandle();
	}
	return watchHandle;
}
function instanceWatch(source, value, options) {
	const publicThis = this.proxy;
	const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
	let cb;
	if (isFunction(value)) cb = value;
	else {
		cb = value.handler;
		options = value;
	}
	const reset = setCurrentInstance(this);
	const res = doWatch(getter, cb.bind(publicThis), options);
	reset();
	return res;
}
function createPathGetter(ctx, path) {
	const segments = path.split(".");
	return () => {
		let cur = ctx;
		for (let i = 0; i < segments.length && cur; i++) cur = cur[segments[i]];
		return cur;
	};
}
var TeleportEndKey = /* @__PURE__ */ Symbol("_vte");
var isTeleport = (type) => type.__isTeleport;
var leaveCbKey = /* @__PURE__ */ Symbol("_leaveCb");
function setTransitionHooks(vnode, hooks) {
	if (vnode.shapeFlag & 6 && vnode.component) {
		vnode.transition = hooks;
		setTransitionHooks(vnode.component.subTree, hooks);
	} else if (vnode.shapeFlag & 128) {
		vnode.ssContent.transition = hooks.clone(vnode.ssContent);
		vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
	} else vnode.transition = hooks;
}
/* @__NO_SIDE_EFFECTS__ */
function defineComponent(options, extraOptions) {
	return isFunction(options) ? /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))() : options;
}
function markAsyncBoundary(instance) {
	instance.ids = [
		instance.ids[0] + instance.ids[2]++ + "-",
		0,
		0
	];
}
var knownTemplateRefs = /* @__PURE__ */ new WeakSet();
function isTemplateRefKey(refs, key) {
	let desc;
	return !!((desc = Object.getOwnPropertyDescriptor(refs, key)) && !desc.configurable);
}
var pendingSetRefMap = /* @__PURE__ */ new WeakMap();
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
	if (isArray(rawRef)) {
		rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
		return;
	}
	if (isAsyncWrapper(vnode) && !isUnmount) {
		if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
		return;
	}
	const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
	const value = isUnmount ? null : refValue;
	const { i: owner, r: ref } = rawRef;
	if (!owner) {
		warn$1(`Missing ref owner context. ref cannot be used on hoisted vnodes. A vnode with ref must be created inside the render function.`);
		return;
	}
	const oldRef = oldRawRef && oldRawRef.r;
	const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
	const setupState = owner.setupState;
	const rawSetupState = /* @__PURE__ */ toRaw(setupState);
	const canSetSetupRef = setupState === EMPTY_OBJ ? NO : (key) => {
		if (hasOwn(rawSetupState, key) && !/* @__PURE__ */ isRef(rawSetupState[key])) warn$1(`Template ref "${key}" used on a non-ref value. It will not work in the production build.`);
		if (knownTemplateRefs.has(rawSetupState[key])) return false;
		if (isTemplateRefKey(refs, key)) return false;
		return hasOwn(rawSetupState, key);
	};
	const canSetRef = (ref2, key) => {
		if (knownTemplateRefs.has(ref2)) return false;
		if (key && isTemplateRefKey(refs, key)) return false;
		return true;
	};
	if (oldRef != null && oldRef !== ref) {
		invalidatePendingSetRef(oldRawRef);
		if (isString(oldRef)) {
			refs[oldRef] = null;
			if (canSetSetupRef(oldRef)) setupState[oldRef] = null;
		} else if (/* @__PURE__ */ isRef(oldRef)) {
			const oldRawRefAtom = oldRawRef;
			if (canSetRef(oldRef, oldRawRefAtom.k)) oldRef.value = null;
			if (oldRawRefAtom.k) refs[oldRawRefAtom.k] = null;
		}
	}
	if (isFunction(ref)) callWithErrorHandling(ref, owner, 12, [value, refs]);
	else {
		const _isString = isString(ref);
		const _isRef = /* @__PURE__ */ isRef(ref);
		if (_isString || _isRef) {
			const doSet = () => {
				if (rawRef.f) {
					const existing = _isString ? canSetSetupRef(ref) ? setupState[ref] : refs[ref] : canSetRef(ref) || !rawRef.k ? ref.value : refs[rawRef.k];
					if (isUnmount) isArray(existing) && remove(existing, refValue);
					else if (!isArray(existing)) if (_isString) {
						refs[ref] = [refValue];
						if (canSetSetupRef(ref)) setupState[ref] = refs[ref];
					} else {
						const newVal = [refValue];
						if (canSetRef(ref, rawRef.k)) ref.value = newVal;
						if (rawRef.k) refs[rawRef.k] = newVal;
					}
					else if (!existing.includes(refValue)) existing.push(refValue);
				} else if (_isString) {
					refs[ref] = value;
					if (canSetSetupRef(ref)) setupState[ref] = value;
				} else if (_isRef) {
					if (canSetRef(ref, rawRef.k)) ref.value = value;
					if (rawRef.k) refs[rawRef.k] = value;
				} else warn$1("Invalid template ref type:", ref, `(${typeof ref})`);
			};
			if (value) {
				const job = () => {
					doSet();
					pendingSetRefMap.delete(rawRef);
				};
				job.id = -1;
				pendingSetRefMap.set(rawRef, job);
				queuePostRenderEffect(job, parentSuspense);
			} else {
				invalidatePendingSetRef(rawRef);
				doSet();
			}
		} else warn$1("Invalid template ref type:", ref, `(${typeof ref})`);
	}
}
function invalidatePendingSetRef(rawRef) {
	const pendingSetRef = pendingSetRefMap.get(rawRef);
	if (pendingSetRef) {
		pendingSetRef.flags |= 8;
		pendingSetRefMap.delete(rawRef);
	}
}
var hasLoggedMismatchError = false;
var logMismatchError = () => {
	if (hasLoggedMismatchError) return;
	console.error("Hydration completed but contains mismatches.");
	hasLoggedMismatchError = true;
};
var isSVGContainer = (container) => container.namespaceURI.includes("svg") && container.tagName !== "foreignObject";
var isMathMLContainer = (container) => container.namespaceURI.includes("MathML");
var getContainerType = (container) => {
	if (container.nodeType !== 1) return void 0;
	if (isSVGContainer(container)) return "svg";
	if (isMathMLContainer(container)) return "mathml";
};
var isComment = (node) => node.nodeType === 8;
function createHydrationFunctions(rendererInternals) {
	const { mt: mountComponent, p: patch, o: { patchProp, createText, nextSibling, parentNode, remove, insert, createComment } } = rendererInternals;
	const hydrate = (vnode, container) => {
		if (!container.hasChildNodes()) {
			warn$1(`Attempting to hydrate existing markup but container is empty. Performing full mount instead.`);
			patch(null, vnode, container);
			flushPostFlushCbs();
			container._vnode = vnode;
			return;
		}
		hydrateNode(container.firstChild, vnode, null, null, null);
		flushPostFlushCbs();
		container._vnode = vnode;
	};
	const hydrateNode = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized = false) => {
		optimized = optimized || !!vnode.dynamicChildren;
		const isFragmentStart = isComment(node) && node.data === "[";
		const onMismatch = () => handleMismatch(node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragmentStart);
		const { type, ref, shapeFlag, patchFlag } = vnode;
		let domType = node.nodeType;
		vnode.el = node;
		def(node, "__vnode", vnode, true);
		def(node, "__vueParentComponent", parentComponent, true);
		if (patchFlag === -2) {
			optimized = false;
			vnode.dynamicChildren = null;
		}
		let nextNode = null;
		switch (type) {
			case Text:
				if (domType !== 3) if (vnode.children === "") {
					insert(vnode.el = createText(""), parentNode(node), node);
					nextNode = node;
				} else nextNode = onMismatch();
				else {
					if (node.data !== vnode.children) {
						warn$1(`Hydration text mismatch in`, node.parentNode, `
  - rendered on server: ${JSON.stringify(node.data)}
  - expected on client: ${JSON.stringify(vnode.children)}`);
						logMismatchError();
						node.data = vnode.children;
					}
					nextNode = nextSibling(node);
				}
				break;
			case Comment:
				if (isTemplateNode(node)) {
					nextNode = nextSibling(node);
					replaceNode(vnode.el = node.content.firstChild, node, parentComponent);
				} else if (domType !== 8 || isFragmentStart) nextNode = onMismatch();
				else nextNode = nextSibling(node);
				break;
			case Static:
				if (isFragmentStart) {
					node = nextSibling(node);
					domType = node.nodeType;
				}
				if (domType === 1 || domType === 3) {
					nextNode = node;
					const needToAdoptContent = !vnode.children.length;
					for (let i = 0; i < vnode.staticCount; i++) {
						if (needToAdoptContent) vnode.children += nextNode.nodeType === 1 ? nextNode.outerHTML : nextNode.data;
						if (i === vnode.staticCount - 1) vnode.anchor = nextNode;
						nextNode = nextSibling(nextNode);
					}
					return isFragmentStart ? nextSibling(nextNode) : nextNode;
				} else onMismatch();
				break;
			case Fragment:
				if (!isFragmentStart) nextNode = onMismatch();
				else nextNode = hydrateFragment(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
				break;
			default: if (shapeFlag & 1) if ((domType !== 1 || vnode.type.toLowerCase() !== node.tagName.toLowerCase()) && !isTemplateNode(node)) nextNode = onMismatch();
			else nextNode = hydrateElement(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
			else if (shapeFlag & 6) {
				vnode.slotScopeIds = slotScopeIds;
				const container = parentNode(node);
				if (isFragmentStart) nextNode = locateClosingAnchor(node);
				else if (isComment(node) && node.data === "teleport start") nextNode = locateClosingAnchor(node, node.data, "teleport end");
				else nextNode = nextSibling(node);
				mountComponent(vnode, container, null, parentComponent, parentSuspense, getContainerType(container), optimized);
				if (isAsyncWrapper(vnode) && !vnode.type.__asyncResolved) {
					let subTree;
					if (isFragmentStart) {
						subTree = createVNode(Fragment);
						subTree.anchor = nextNode ? nextNode.previousSibling : container.lastChild;
					} else subTree = node.nodeType === 3 ? createTextVNode("") : createVNode("div");
					subTree.el = node;
					vnode.component.subTree = subTree;
				}
			} else if (shapeFlag & 64) if (domType !== 8) nextNode = onMismatch();
			else nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, rendererInternals, hydrateChildren);
			else if (shapeFlag & 128) nextNode = vnode.type.hydrate(node, vnode, parentComponent, parentSuspense, getContainerType(parentNode(node)), slotScopeIds, optimized, rendererInternals, hydrateNode);
			else warn$1("Invalid HostVNode type:", type, `(${typeof type})`);
		}
		if (ref != null) setRef(ref, null, parentSuspense, vnode);
		return nextNode;
	};
	const hydrateElement = (el, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
		optimized = optimized || !!vnode.dynamicChildren;
		const { type, props, patchFlag, shapeFlag, dirs, transition } = vnode;
		const forcePatch = type === "input" || type === "option";
		{
			if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "created");
			let needCallTransitionHooks = false;
			if (isTemplateNode(el)) {
				needCallTransitionHooks = needTransition(null, transition) && parentComponent && parentComponent.vnode.props && parentComponent.vnode.props.appear;
				const content = el.content.firstChild;
				if (needCallTransitionHooks) {
					const cls = content.getAttribute("class");
					if (cls) content.$cls = cls;
					transition.beforeEnter(content);
				}
				replaceNode(content, el, parentComponent);
				vnode.el = el = content;
			}
			if (shapeFlag & 16 && !(props && (props.innerHTML || props.textContent))) {
				let next = hydrateChildren(el.firstChild, vnode, el, parentComponent, parentSuspense, slotScopeIds, optimized);
				let hasWarned = false;
				while (next) {
					if (!isMismatchAllowed(el, 1)) {
						if (!hasWarned) {
							warn$1(`Hydration children mismatch on`, el, `
Server rendered element contains more child nodes than client vdom.`);
							hasWarned = true;
						}
						logMismatchError();
					}
					const cur = next;
					next = next.nextSibling;
					remove(cur);
				}
			} else if (shapeFlag & 8) {
				let clientText = vnode.children;
				if (clientText[0] === "\n" && (el.tagName === "PRE" || el.tagName === "TEXTAREA")) clientText = clientText.slice(1);
				const { textContent } = el;
				if (textContent !== clientText && textContent !== clientText.replace(/\r\n|\r/g, "\n")) {
					if (!isMismatchAllowed(el, 0)) {
						warn$1(`Hydration text content mismatch on`, el, `
  - rendered on server: ${textContent}
  - expected on client: ${clientText}`);
						logMismatchError();
					}
					el.textContent = vnode.children;
				}
			}
			if (props) {
				const isCustomElement = el.tagName.includes("-");
				for (const key in props) {
					if (!(dirs && dirs.some((d) => d.dir.created)) && propHasMismatch(el, key, props[key], vnode, parentComponent)) logMismatchError();
					if (forcePatch && (key.endsWith("value") || key === "indeterminate") || isOn(key) && !isReservedProp(key) || key[0] === "." || isCustomElement && !isReservedProp(key)) patchProp(el, key, null, props[key], void 0, parentComponent);
				}
			}
			let vnodeHooks;
			if (vnodeHooks = props && props.onVnodeBeforeMount) invokeVNodeHook(vnodeHooks, parentComponent, vnode);
			if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
			if ((vnodeHooks = props && props.onVnodeMounted) || dirs || needCallTransitionHooks) queueEffectWithSuspense(() => {
				vnodeHooks && invokeVNodeHook(vnodeHooks, parentComponent, vnode);
				needCallTransitionHooks && transition.enter(el);
				dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
			}, parentSuspense);
		}
		return el.nextSibling;
	};
	const hydrateChildren = (node, parentVNode, container, parentComponent, parentSuspense, slotScopeIds, optimized) => {
		optimized = optimized || !!parentVNode.dynamicChildren;
		const children = parentVNode.children;
		const l = children.length;
		let hasWarned = false;
		for (let i = 0; i < l; i++) {
			const vnode = optimized ? children[i] : children[i] = normalizeVNode(children[i]);
			const isText = vnode.type === Text;
			if (node) {
				if (isText && !optimized) {
					if (i + 1 < l && normalizeVNode(children[i + 1]).type === Text) {
						insert(createText(node.data.slice(vnode.children.length)), container, nextSibling(node));
						node.data = vnode.children;
					}
				}
				node = hydrateNode(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
			} else if (isText && !vnode.children) insert(vnode.el = createText(""), container);
			else {
				if (!isMismatchAllowed(container, 1)) {
					if (!hasWarned) {
						warn$1(`Hydration children mismatch on`, container, `
Server rendered element contains fewer child nodes than client vdom.`);
						hasWarned = true;
					}
					logMismatchError();
				}
				patch(null, vnode, container, null, parentComponent, parentSuspense, getContainerType(container), slotScopeIds);
			}
		}
		return node;
	};
	const hydrateFragment = (node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
		const { slotScopeIds: fragmentSlotScopeIds } = vnode;
		if (fragmentSlotScopeIds) slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
		const container = parentNode(node);
		const next = hydrateChildren(nextSibling(node), vnode, container, parentComponent, parentSuspense, slotScopeIds, optimized);
		if (next && isComment(next) && next.data === "]") return nextSibling(vnode.anchor = next);
		else {
			logMismatchError();
			insert(vnode.anchor = createComment(`]`), container, next);
			return next;
		}
	};
	const handleMismatch = (node, vnode, parentComponent, parentSuspense, slotScopeIds, isFragment) => {
		if (!isMismatchAllowed(node.parentElement, 1)) {
			warn$1(`Hydration node mismatch:
- rendered on server:`, node, node.nodeType === 3 ? `(text)` : isComment(node) && node.data === "[" ? `(start of fragment)` : ``, `
- expected on client:`, vnode.type);
			logMismatchError();
		}
		vnode.el = null;
		if (isFragment) {
			const end = locateClosingAnchor(node);
			while (true) {
				const next2 = nextSibling(node);
				if (next2 && next2 !== end) remove(next2);
				else break;
			}
		}
		const next = nextSibling(node);
		const container = parentNode(node);
		remove(node);
		patch(null, vnode, container, next, parentComponent, parentSuspense, getContainerType(container), slotScopeIds);
		if (parentComponent) {
			parentComponent.vnode.el = vnode.el;
			updateHOCHostEl(parentComponent, vnode.el);
		}
		return next;
	};
	const locateClosingAnchor = (node, open = "[", close = "]") => {
		let match = 0;
		while (node) {
			node = nextSibling(node);
			if (node && isComment(node)) {
				if (node.data === open) match++;
				if (node.data === close) if (match === 0) return nextSibling(node);
				else match--;
			}
		}
		return node;
	};
	const replaceNode = (newNode, oldNode, parentComponent) => {
		const parentNode2 = oldNode.parentNode;
		if (parentNode2) parentNode2.replaceChild(newNode, oldNode);
		let parent = parentComponent;
		while (parent) {
			if (parent.vnode.el === oldNode) parent.vnode.el = parent.subTree.el = newNode;
			parent = parent.parent;
		}
	};
	const isTemplateNode = (node) => {
		return node.nodeType === 1 && node.tagName === "TEMPLATE";
	};
	return [hydrate, hydrateNode];
}
function propHasMismatch(el, key, clientValue, vnode, instance) {
	let mismatchType;
	let mismatchKey;
	let actual;
	let expected;
	if (key === "class") {
		if (el.$cls) {
			actual = el.$cls;
			delete el.$cls;
		} else actual = el.getAttribute("class");
		expected = normalizeClass(clientValue);
		if (!isSetEqual(toClassSet(actual || ""), toClassSet(expected))) {
			mismatchType = 2;
			mismatchKey = `class`;
		}
	} else if (key === "style") {
		actual = el.getAttribute("style") || "";
		expected = isString(clientValue) ? clientValue : stringifyStyle(normalizeStyle(clientValue));
		const actualMap = toStyleMap(actual);
		const expectedMap = toStyleMap(expected);
		if (vnode.dirs) {
			for (const { dir, value } of vnode.dirs) if (dir.name === "show" && !value) expectedMap.set("display", "none");
		}
		if (instance) resolveCssVars(instance, vnode, expectedMap);
		if (!isMapEqual(actualMap, expectedMap)) {
			mismatchType = 3;
			mismatchKey = "style";
		}
	} else if (el instanceof SVGElement && isKnownSvgAttr(key) || el instanceof HTMLElement && (isBooleanAttr(key) || isKnownHtmlAttr(key))) {
		if (isBooleanAttr(key)) {
			actual = el.hasAttribute(key);
			expected = includeBooleanAttr(clientValue);
		} else if (clientValue == null) {
			actual = el.hasAttribute(key);
			expected = false;
		} else {
			if (el.hasAttribute(key)) actual = el.getAttribute(key);
			else if (key === "value" && el.tagName === "TEXTAREA") actual = el.value;
			else actual = false;
			expected = isRenderableAttrValue(clientValue) ? String(clientValue) : false;
		}
		if (actual !== expected) {
			mismatchType = 4;
			mismatchKey = key;
		}
	}
	if (mismatchType != null && !isMismatchAllowed(el, mismatchType)) {
		const format = (v) => v === false ? `(not rendered)` : `${mismatchKey}="${v}"`;
		warn$1(`Hydration ${MismatchTypeString[mismatchType]} mismatch on`, el, `
  - rendered on server: ${format(actual)}
  - expected on client: ${format(expected)}
  Note: this mismatch is check-only. The DOM will not be rectified in production due to performance overhead.
  You should fix the source of the mismatch.`);
		return true;
	}
	return false;
}
function toClassSet(str) {
	return new Set(str.trim().split(/\s+/));
}
function isSetEqual(a, b) {
	if (a.size !== b.size) return false;
	for (const s of a) if (!b.has(s)) return false;
	return true;
}
function toStyleMap(str) {
	const styleMap = /* @__PURE__ */ new Map();
	for (const item of str.split(";")) {
		let [key, value] = item.split(":");
		key = key.trim();
		value = value && value.trim();
		if (key && value) styleMap.set(key, value);
	}
	return styleMap;
}
function isMapEqual(a, b) {
	if (a.size !== b.size) return false;
	for (const [key, value] of a) if (value !== b.get(key)) return false;
	return true;
}
function resolveCssVars(instance, vnode, expectedMap) {
	const root = instance.subTree;
	if (instance.getCssVars && (vnode === root || root && root.type === Fragment && root.children.includes(vnode))) {
		const cssVars = instance.getCssVars();
		for (const key in cssVars) {
			const value = normalizeCssVarValue(cssVars[key]);
			expectedMap.set(`--${getEscapedCssVarName(key, false)}`, value);
		}
	}
	if (vnode === root && instance.parent) resolveCssVars(instance.parent, instance.vnode, expectedMap);
}
var allowMismatchAttr = "data-allow-mismatch";
var MismatchTypeString = {
	[0]: "text",
	[1]: "children",
	[2]: "class",
	[3]: "style",
	[4]: "attribute"
};
function isMismatchAllowed(el, allowedType) {
	if (allowedType === 0 || allowedType === 1) while (el && !el.hasAttribute(allowMismatchAttr)) el = el.parentElement;
	const allowedAttr = el && el.getAttribute(allowMismatchAttr);
	if (allowedAttr == null) return false;
	else if (allowedAttr === "") return true;
	else {
		const list = allowedAttr.split(",");
		if (allowedType === 0 && list.includes("children")) return true;
		return list.includes(MismatchTypeString[allowedType]);
	}
}
getGlobalThis().requestIdleCallback;
getGlobalThis().cancelIdleCallback;
var isAsyncWrapper = (i) => !!i.type.__asyncLoader;
var isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
	registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
	registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
	const wrappedHook = hook.__wdc || (hook.__wdc = () => {
		let current = target;
		while (current) {
			if (current.isDeactivated) return;
			current = current.parent;
		}
		return hook();
	});
	injectHook(type, wrappedHook, target);
	if (target) {
		let current = target.parent;
		while (current && current.parent) {
			if (isKeepAlive(current.parent.vnode)) injectToKeepAliveRoot(wrappedHook, type, target, current);
			current = current.parent;
		}
	}
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
	const injected = injectHook(type, hook, keepAliveRoot, true);
	onUnmounted(() => {
		remove(keepAliveRoot[type], injected);
	}, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
	if (target) {
		const hooks = target[type] || (target[type] = []);
		const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
			pauseTracking();
			const reset = setCurrentInstance(target);
			const res = callWithAsyncErrorHandling(hook, target, type, args);
			reset();
			resetTracking();
			return res;
		});
		if (prepend) hooks.unshift(wrappedHook);
		else hooks.push(wrappedHook);
		return wrappedHook;
	} else warn$1(`${toHandlerKey(ErrorTypeStrings$1[type].replace(/ hook$/, ""))} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`);
}
var createHook = (lifecycle) => (hook, target = currentInstance) => {
	if (!isInSSRComponentSetup || lifecycle === "sp") injectHook(lifecycle, (...args) => hook(...args), target);
};
var onBeforeMount = createHook("bm");
var onMounted = createHook("m");
var onBeforeUpdate = createHook("bu");
var onUpdated = createHook("u");
var onBeforeUnmount = createHook("bum");
var onUnmounted = createHook("um");
var onServerPrefetch = createHook("sp");
var onRenderTriggered = createHook("rtg");
var onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
	injectHook("ec", hook, target);
}
var NULL_DYNAMIC_COMPONENT = /* @__PURE__ */ Symbol.for("v-ndc");
var getPublicInstance = (i) => {
	if (!i) return null;
	if (isStatefulComponent(i)) return getComponentPublicInstance(i);
	return getPublicInstance(i.parent);
};
var publicPropertiesMap = /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
	$: (i) => i,
	$el: (i) => i.vnode.el,
	$data: (i) => i.data,
	$props: (i) => /* @__PURE__ */ shallowReadonly(i.props),
	$attrs: (i) => /* @__PURE__ */ shallowReadonly(i.attrs),
	$slots: (i) => /* @__PURE__ */ shallowReadonly(i.slots),
	$refs: (i) => /* @__PURE__ */ shallowReadonly(i.refs),
	$parent: (i) => getPublicInstance(i.parent),
	$root: (i) => getPublicInstance(i.root),
	$host: (i) => i.ce,
	$emit: (i) => i.emit,
	$options: (i) => __VUE_OPTIONS_API__ ? resolveMergedOptions(i) : i.type,
	$forceUpdate: (i) => i.f || (i.f = () => {
		queueJob(i.update);
	}),
	$nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
	$watch: (i) => __VUE_OPTIONS_API__ ? instanceWatch.bind(i) : NOOP
});
var isReservedPrefix = (key) => key === "_" || key === "$";
var hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
var PublicInstanceProxyHandlers = {
	get({ _: instance }, key) {
		if (key === "__v_skip") return true;
		const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
		if (key === "__isVue") return true;
		if (key[0] !== "$") {
			const n = accessCache[key];
			if (n !== void 0) switch (n) {
				case 1: return setupState[key];
				case 2: return data[key];
				case 4: return ctx[key];
				case 3: return props[key];
			}
			else if (hasSetupBinding(setupState, key)) {
				accessCache[key] = 1;
				return setupState[key];
			} else if (__VUE_OPTIONS_API__ && data !== EMPTY_OBJ && hasOwn(data, key)) {
				accessCache[key] = 2;
				return data[key];
			} else if (hasOwn(props, key)) {
				accessCache[key] = 3;
				return props[key];
			} else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
				accessCache[key] = 4;
				return ctx[key];
			} else if (!__VUE_OPTIONS_API__ || shouldCacheAccess) accessCache[key] = 0;
		}
		const publicGetter = publicPropertiesMap[key];
		let cssModule, globalProperties;
		if (publicGetter) {
			if (key === "$attrs") {
				track(instance.attrs, "get", "");
				markAttrsAccessed();
			} else if (key === "$slots") track(instance, "get", key);
			return publicGetter(instance);
		} else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) return cssModule;
		else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
			accessCache[key] = 4;
			return ctx[key];
		} else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) return globalProperties[key];
		else if (currentRenderingInstance && (!isString(key) || key.indexOf("__v") !== 0)) {
			if (data !== EMPTY_OBJ && isReservedPrefix(key[0]) && hasOwn(data, key)) warn$1(`Property ${JSON.stringify(key)} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`);
			else if (instance === currentRenderingInstance) warn$1(`Property ${JSON.stringify(key)} was accessed during render but is not defined on instance.`);
		}
	},
	set({ _: instance }, key, value) {
		const { data, setupState, ctx } = instance;
		if (hasSetupBinding(setupState, key)) {
			setupState[key] = value;
			return true;
		} else if (setupState.__isScriptSetup && hasOwn(setupState, key)) {
			warn$1(`Cannot mutate <script setup> binding "${key}" from Options API.`);
			return false;
		} else if (__VUE_OPTIONS_API__ && data !== EMPTY_OBJ && hasOwn(data, key)) {
			data[key] = value;
			return true;
		} else if (hasOwn(instance.props, key)) {
			warn$1(`Attempting to mutate prop "${key}". Props are readonly.`);
			return false;
		}
		if (key[0] === "$" && key.slice(1) in instance) {
			warn$1(`Attempting to mutate public property "${key}". Properties starting with $ are reserved and readonly.`);
			return false;
		} else if (key in instance.appContext.config.globalProperties) Object.defineProperty(ctx, key, {
			enumerable: true,
			configurable: true,
			value
		});
		else ctx[key] = value;
		return true;
	},
	has({ _: { data, setupState, accessCache, ctx, appContext, props, type } }, key) {
		let cssModules;
		return !!(accessCache[key] || __VUE_OPTIONS_API__ && data !== EMPTY_OBJ && key[0] !== "$" && hasOwn(data, key) || hasSetupBinding(setupState, key) || hasOwn(props, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key) || (cssModules = type.__cssModules) && cssModules[key]);
	},
	defineProperty(target, key, descriptor) {
		if (descriptor.get != null) target._.accessCache[key] = 0;
		else if (hasOwn(descriptor, "value")) this.set(target, key, descriptor.value, null);
		return Reflect.defineProperty(target, key, descriptor);
	}
};
PublicInstanceProxyHandlers.ownKeys = (target) => {
	warn$1(`Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.`);
	return Reflect.ownKeys(target);
};
function createDevRenderContext(instance) {
	const target = {};
	Object.defineProperty(target, `_`, {
		configurable: true,
		enumerable: false,
		get: () => instance
	});
	Object.keys(publicPropertiesMap).forEach((key) => {
		Object.defineProperty(target, key, {
			configurable: true,
			enumerable: false,
			get: () => publicPropertiesMap[key](instance),
			set: NOOP
		});
	});
	return target;
}
function exposePropsOnRenderContext(instance) {
	const { ctx, propsOptions: [propsOptions] } = instance;
	if (propsOptions) Object.keys(propsOptions).forEach((key) => {
		Object.defineProperty(ctx, key, {
			enumerable: true,
			configurable: true,
			get: () => instance.props[key],
			set: NOOP
		});
	});
}
function exposeSetupStateOnRenderContext(instance) {
	const { ctx, setupState } = instance;
	Object.keys(/* @__PURE__ */ toRaw(setupState)).forEach((key) => {
		if (!setupState.__isScriptSetup) {
			if (isReservedPrefix(key[0])) {
				warn$1(`setup() return property ${JSON.stringify(key)} should not start with "$" or "_" which are reserved prefixes for Vue internals.`);
				return;
			}
			Object.defineProperty(ctx, key, {
				enumerable: true,
				configurable: true,
				get: () => setupState[key],
				set: NOOP
			});
		}
	});
}
function normalizePropsOrEmits(props) {
	return isArray(props) ? props.reduce((normalized, p) => (normalized[p] = null, normalized), {}) : props;
}
function createDuplicateChecker() {
	const cache = /* @__PURE__ */ Object.create(null);
	return (type, key) => {
		if (cache[key]) warn$1(`${type} property "${key}" is already defined in ${cache[key]}.`);
		else cache[key] = type;
	};
}
var shouldCacheAccess = true;
function applyOptions(instance) {
	const options = resolveMergedOptions(instance);
	const publicThis = instance.proxy;
	const ctx = instance.ctx;
	shouldCacheAccess = false;
	if (options.beforeCreate) callHook(options.beforeCreate, instance, "bc");
	const { data: dataOptions, computed: computedOptions, methods, watch: watchOptions, provide: provideOptions, inject: injectOptions, created, beforeMount, mounted, beforeUpdate, updated, activated, deactivated, beforeDestroy, beforeUnmount, destroyed, unmounted, render, renderTracked, renderTriggered, errorCaptured, serverPrefetch, expose, inheritAttrs, components, directives, filters } = options;
	const checkDuplicateProperties = createDuplicateChecker();
	{
		const [propsOptions] = instance.propsOptions;
		if (propsOptions) for (const key in propsOptions) checkDuplicateProperties("Props", key);
	}
	if (injectOptions) resolveInjections(injectOptions, ctx, checkDuplicateProperties);
	if (methods) for (const key in methods) {
		const methodHandler = methods[key];
		if (isFunction(methodHandler)) {
			Object.defineProperty(ctx, key, {
				value: methodHandler.bind(publicThis),
				configurable: true,
				enumerable: true,
				writable: true
			});
			checkDuplicateProperties("Methods", key);
		} else warn$1(`Method "${key}" has type "${typeof methodHandler}" in the component definition. Did you reference the function correctly?`);
	}
	if (dataOptions) {
		if (!isFunction(dataOptions)) warn$1(`The data option must be a function. Plain object usage is no longer supported.`);
		const data = dataOptions.call(publicThis, publicThis);
		if (isPromise(data)) warn$1(`data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>.`);
		if (!isObject(data)) warn$1(`data() should return an object.`);
		else {
			instance.data = /* @__PURE__ */ reactive(data);
			for (const key in data) {
				checkDuplicateProperties("Data", key);
				if (!isReservedPrefix(key[0])) Object.defineProperty(ctx, key, {
					configurable: true,
					enumerable: true,
					get: () => data[key],
					set: NOOP
				});
			}
		}
	}
	shouldCacheAccess = true;
	if (computedOptions) for (const key in computedOptions) {
		const opt = computedOptions[key];
		const get = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
		if (get === NOOP) warn$1(`Computed property "${key}" has no getter.`);
		const c = computed({
			get,
			set: !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : () => {
				warn$1(`Write operation failed: computed property "${key}" is readonly.`);
			}
		});
		Object.defineProperty(ctx, key, {
			enumerable: true,
			configurable: true,
			get: () => c.value,
			set: (v) => c.value = v
		});
		checkDuplicateProperties("Computed", key);
	}
	if (watchOptions) for (const key in watchOptions) createWatcher(watchOptions[key], ctx, publicThis, key);
	if (provideOptions) {
		const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
		Reflect.ownKeys(provides).forEach((key) => {
			provide(key, provides[key]);
		});
	}
	if (created) callHook(created, instance, "c");
	function registerLifecycleHook(register, hook) {
		if (isArray(hook)) hook.forEach((_hook) => register(_hook.bind(publicThis)));
		else if (hook) register(hook.bind(publicThis));
	}
	registerLifecycleHook(onBeforeMount, beforeMount);
	registerLifecycleHook(onMounted, mounted);
	registerLifecycleHook(onBeforeUpdate, beforeUpdate);
	registerLifecycleHook(onUpdated, updated);
	registerLifecycleHook(onActivated, activated);
	registerLifecycleHook(onDeactivated, deactivated);
	registerLifecycleHook(onErrorCaptured, errorCaptured);
	registerLifecycleHook(onRenderTracked, renderTracked);
	registerLifecycleHook(onRenderTriggered, renderTriggered);
	registerLifecycleHook(onBeforeUnmount, beforeUnmount);
	registerLifecycleHook(onUnmounted, unmounted);
	registerLifecycleHook(onServerPrefetch, serverPrefetch);
	if (isArray(expose)) {
		if (expose.length) {
			const exposed = instance.exposed || (instance.exposed = {});
			expose.forEach((key) => {
				Object.defineProperty(exposed, key, {
					get: () => publicThis[key],
					set: (val) => publicThis[key] = val,
					enumerable: true
				});
			});
		} else if (!instance.exposed) instance.exposed = {};
	}
	if (render && instance.render === NOOP) instance.render = render;
	if (inheritAttrs != null) instance.inheritAttrs = inheritAttrs;
	if (components) instance.components = components;
	if (directives) instance.directives = directives;
	if (serverPrefetch) markAsyncBoundary(instance);
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
	if (isArray(injectOptions)) injectOptions = normalizeInject(injectOptions);
	for (const key in injectOptions) {
		const opt = injectOptions[key];
		let injected;
		if (isObject(opt)) if ("default" in opt) injected = inject(opt.from || key, opt.default, true);
		else injected = inject(opt.from || key);
		else injected = inject(opt);
		if (/* @__PURE__ */ isRef(injected)) Object.defineProperty(ctx, key, {
			enumerable: true,
			configurable: true,
			get: () => injected.value,
			set: (v) => injected.value = v
		});
		else ctx[key] = injected;
		checkDuplicateProperties("Inject", key);
	}
}
function callHook(hook, instance, type) {
	callWithAsyncErrorHandling(isArray(hook) ? hook.map((h) => h.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
}
function createWatcher(raw, ctx, publicThis, key) {
	let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
	if (isString(raw)) {
		const handler = ctx[raw];
		if (isFunction(handler)) watch(getter, handler);
		else warn$1(`Invalid watch handler specified by key "${raw}"`, handler);
	} else if (isFunction(raw)) watch(getter, raw.bind(publicThis));
	else if (isObject(raw)) if (isArray(raw)) raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
	else {
		const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
		if (isFunction(handler)) watch(getter, handler, raw);
		else warn$1(`Invalid watch handler specified by key "${raw.handler}"`, handler);
	}
	else warn$1(`Invalid watch option: "${key}"`, raw);
}
function resolveMergedOptions(instance) {
	const base = instance.type;
	const { mixins, extends: extendsOptions } = base;
	const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
	const cached = cache.get(base);
	let resolved;
	if (cached) resolved = cached;
	else if (!globalMixins.length && !mixins && !extendsOptions) resolved = base;
	else {
		resolved = {};
		if (globalMixins.length) globalMixins.forEach((m) => mergeOptions(resolved, m, optionMergeStrategies, true));
		mergeOptions(resolved, base, optionMergeStrategies);
	}
	if (isObject(base)) cache.set(base, resolved);
	return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
	const { mixins, extends: extendsOptions } = from;
	if (extendsOptions) mergeOptions(to, extendsOptions, strats, true);
	if (mixins) mixins.forEach((m) => mergeOptions(to, m, strats, true));
	for (const key in from) if (asMixin && key === "expose") warn$1(`"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.`);
	else {
		const strat = internalOptionMergeStrats[key] || strats && strats[key];
		to[key] = strat ? strat(to[key], from[key]) : from[key];
	}
	return to;
}
var internalOptionMergeStrats = {
	data: mergeDataFn,
	props: mergeEmitsOrPropsOptions,
	emits: mergeEmitsOrPropsOptions,
	methods: mergeObjectOptions,
	computed: mergeObjectOptions,
	beforeCreate: mergeAsArray,
	created: mergeAsArray,
	beforeMount: mergeAsArray,
	mounted: mergeAsArray,
	beforeUpdate: mergeAsArray,
	updated: mergeAsArray,
	beforeDestroy: mergeAsArray,
	beforeUnmount: mergeAsArray,
	destroyed: mergeAsArray,
	unmounted: mergeAsArray,
	activated: mergeAsArray,
	deactivated: mergeAsArray,
	errorCaptured: mergeAsArray,
	serverPrefetch: mergeAsArray,
	components: mergeObjectOptions,
	directives: mergeObjectOptions,
	watch: mergeWatchOptions,
	provide: mergeDataFn,
	inject: mergeInject
};
function mergeDataFn(to, from) {
	if (!from) return to;
	if (!to) return from;
	return function mergedDataFn() {
		return extend(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
	};
}
function mergeInject(to, from) {
	return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
	if (isArray(raw)) {
		const res = {};
		for (let i = 0; i < raw.length; i++) res[raw[i]] = raw[i];
		return res;
	}
	return raw;
}
function mergeAsArray(to, from) {
	return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
	return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
	if (to) {
		if (isArray(to) && isArray(from)) return [.../* @__PURE__ */ new Set([...to, ...from])];
		return extend(/* @__PURE__ */ Object.create(null), normalizePropsOrEmits(to), normalizePropsOrEmits(from != null ? from : {}));
	} else return from;
}
function mergeWatchOptions(to, from) {
	if (!to) return from;
	if (!from) return to;
	const merged = extend(/* @__PURE__ */ Object.create(null), to);
	for (const key in from) merged[key] = mergeAsArray(to[key], from[key]);
	return merged;
}
function createAppContext() {
	return {
		app: null,
		config: {
			isNativeTag: NO,
			performance: false,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
var uid$1 = 0;
function createAppAPI(render, hydrate) {
	return function createApp(rootComponent, rootProps = null) {
		if (!isFunction(rootComponent)) rootComponent = extend({}, rootComponent);
		if (rootProps != null && !isObject(rootProps)) {
			warn$1(`root props passed to app.mount() must be an object.`);
			rootProps = null;
		}
		const context = createAppContext();
		const installedPlugins = /* @__PURE__ */ new WeakSet();
		const pluginCleanupFns = [];
		let isMounted = false;
		const app = context.app = {
			_uid: uid$1++,
			_component: rootComponent,
			_props: rootProps,
			_container: null,
			_context: context,
			_instance: null,
			version,
			get config() {
				return context.config;
			},
			set config(v) {
				warn$1(`app.config cannot be replaced. Modify individual options instead.`);
			},
			use(plugin, ...options) {
				if (installedPlugins.has(plugin)) warn$1(`Plugin has already been applied to target app.`);
				else if (plugin && isFunction(plugin.install)) {
					installedPlugins.add(plugin);
					plugin.install(app, ...options);
				} else if (isFunction(plugin)) {
					installedPlugins.add(plugin);
					plugin(app, ...options);
				} else warn$1(`A plugin must either be a function or an object with an "install" function.`);
				return app;
			},
			mixin(mixin) {
				if (__VUE_OPTIONS_API__) if (!context.mixins.includes(mixin)) context.mixins.push(mixin);
				else warn$1("Mixin has already been applied to target app" + (mixin.name ? `: ${mixin.name}` : ""));
				else warn$1("Mixins are only available in builds supporting Options API");
				return app;
			},
			component(name, component) {
				validateComponentName(name, context.config);
				if (!component) return context.components[name];
				if (context.components[name]) warn$1(`Component "${name}" has already been registered in target app.`);
				context.components[name] = component;
				return app;
			},
			directive(name, directive) {
				validateDirectiveName(name);
				if (!directive) return context.directives[name];
				if (context.directives[name]) warn$1(`Directive "${name}" has already been registered in target app.`);
				context.directives[name] = directive;
				return app;
			},
			mount(rootContainer, isHydrate, namespace) {
				if (!isMounted) {
					if (rootContainer.__vue_app__) warn$1(`There is already an app instance mounted on the host container.
 If you want to mount another app on the same host container, you need to unmount the previous app by calling \`app.unmount()\` first.`);
					const vnode = app._ceVNode || createVNode(rootComponent, rootProps);
					vnode.appContext = context;
					if (namespace === true) namespace = "svg";
					else if (namespace === false) namespace = void 0;
					context.reload = () => {
						const cloned = cloneVNode(vnode);
						cloned.el = null;
						render(cloned, rootContainer, namespace);
					};
					if (isHydrate && hydrate) hydrate(vnode, rootContainer);
					else render(vnode, rootContainer, namespace);
					isMounted = true;
					app._container = rootContainer;
					rootContainer.__vue_app__ = app;
					app._instance = vnode.component;
					devtoolsInitApp(app, version);
					return getComponentPublicInstance(vnode.component);
				} else warn$1(`App has already been mounted.
If you want to remount the same app, move your app creation logic into a factory function and create fresh app instances for each mount - e.g. \`const createMyApp = () => createApp(App)\``);
			},
			onUnmount(cleanupFn) {
				if (typeof cleanupFn !== "function") warn$1(`Expected function as first argument to app.onUnmount(), but got ${typeof cleanupFn}`);
				pluginCleanupFns.push(cleanupFn);
			},
			unmount() {
				if (isMounted) {
					callWithAsyncErrorHandling(pluginCleanupFns, app._instance, 16);
					render(null, app._container);
					app._instance = null;
					devtoolsUnmountApp(app);
					delete app._container.__vue_app__;
				} else warn$1(`Cannot unmount an app that is not mounted.`);
			},
			provide(key, value) {
				if (key in context.provides) if (hasOwn(context.provides, key)) warn$1(`App already provides property with key "${String(key)}". It will be overwritten with the new value.`);
				else warn$1(`App already provides property with key "${String(key)}" inherited from its parent element. It will be overwritten with the new value.`);
				context.provides[key] = value;
				return app;
			},
			runWithContext(fn) {
				const lastApp = currentApp;
				currentApp = app;
				try {
					return fn();
				} finally {
					currentApp = lastApp;
				}
			}
		};
		return app;
	};
}
var currentApp = null;
var getModelModifiers = (props, modelName) => {
	return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
};
function emit(instance, event, ...rawArgs) {
	if (instance.isUnmounted) return;
	const props = instance.vnode.props || EMPTY_OBJ;
	{
		const { emitsOptions, propsOptions: [propsOptions] } = instance;
		if (emitsOptions) if (!(event in emitsOptions) && true) {
			if (!propsOptions || !(toHandlerKey(camelize(event)) in propsOptions)) warn$1(`Component emitted event "${event}" but it is neither declared in the emits option nor as an "${toHandlerKey(camelize(event))}" prop.`);
		} else {
			const validator = emitsOptions[event];
			if (isFunction(validator)) {
				if (!validator(...rawArgs)) warn$1(`Invalid event arguments: event validation failed for event "${event}".`);
			}
		}
	}
	let args = rawArgs;
	const isModelListener = event.startsWith("update:");
	const modifiers = isModelListener && getModelModifiers(props, event.slice(7));
	if (modifiers) {
		if (modifiers.trim) args = rawArgs.map((a) => isString(a) ? a.trim() : a);
		if (modifiers.number) args = rawArgs.map(looseToNumber);
	}
	devtoolsComponentEmit(instance, event, args);
	{
		const lowerCaseEvent = event.toLowerCase();
		if (lowerCaseEvent !== event && props[toHandlerKey(lowerCaseEvent)]) warn$1(`Event "${lowerCaseEvent}" is emitted in component ${formatComponentName(instance, instance.type)} but the handler is registered for "${event}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${hyphenate(event)}" instead of "${event}".`);
	}
	let handlerName;
	let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize(event))];
	if (!handler && isModelListener) handler = props[handlerName = toHandlerKey(hyphenate(event))];
	if (handler) callWithAsyncErrorHandling(handler, instance, 6, args);
	const onceHandler = props[handlerName + `Once`];
	if (onceHandler) {
		if (!instance.emitted) instance.emitted = {};
		else if (instance.emitted[handlerName]) return;
		instance.emitted[handlerName] = true;
		callWithAsyncErrorHandling(onceHandler, instance, 6, args);
	}
}
var mixinEmitsCache = /* @__PURE__ */ new WeakMap();
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
	const cache = __VUE_OPTIONS_API__ && asMixin ? mixinEmitsCache : appContext.emitsCache;
	const cached = cache.get(comp);
	if (cached !== void 0) return cached;
	const raw = comp.emits;
	let normalized = {};
	let hasExtends = false;
	if (__VUE_OPTIONS_API__ && !isFunction(comp)) {
		const extendEmits = (raw2) => {
			const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
			if (normalizedFromExtend) {
				hasExtends = true;
				extend(normalized, normalizedFromExtend);
			}
		};
		if (!asMixin && appContext.mixins.length) appContext.mixins.forEach(extendEmits);
		if (comp.extends) extendEmits(comp.extends);
		if (comp.mixins) comp.mixins.forEach(extendEmits);
	}
	if (!raw && !hasExtends) {
		if (isObject(comp)) cache.set(comp, null);
		return null;
	}
	if (isArray(raw)) raw.forEach((key) => normalized[key] = null);
	else extend(normalized, raw);
	if (isObject(comp)) cache.set(comp, normalized);
	return normalized;
}
function isEmitListener(options, key) {
	if (!options || !isOn(key)) return false;
	key = key.slice(2).replace(/Once$/, "");
	return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
var accessedAttrs = false;
function markAttrsAccessed() {
	accessedAttrs = true;
}
function renderComponentRoot(instance) {
	const { type: Component, vnode, proxy, withProxy, propsOptions: [propsOptions], slots, attrs, emit, render, renderCache, props, data, setupState, ctx, inheritAttrs } = instance;
	const prev = setCurrentRenderingInstance(instance);
	let result;
	let fallthroughAttrs;
	accessedAttrs = false;
	try {
		if (vnode.shapeFlag & 4) {
			const proxyToUse = withProxy || proxy;
			const thisProxy = setupState.__isScriptSetup ? new Proxy(proxyToUse, { get(target, key, receiver) {
				warn$1(`Property '${String(key)}' was accessed via 'this'. Avoid using 'this' in templates.`);
				return Reflect.get(target, key, receiver);
			} }) : proxyToUse;
			result = normalizeVNode(render.call(thisProxy, proxyToUse, renderCache, /* @__PURE__ */ shallowReadonly(props), setupState, data, ctx));
			fallthroughAttrs = attrs;
		} else {
			const render2 = Component;
			if (attrs === props) markAttrsAccessed();
			result = normalizeVNode(render2.length > 1 ? render2(/* @__PURE__ */ shallowReadonly(props), {
				get attrs() {
					markAttrsAccessed();
					return /* @__PURE__ */ shallowReadonly(attrs);
				},
				slots,
				emit
			}) : render2(/* @__PURE__ */ shallowReadonly(props), null));
			fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
		}
	} catch (err) {
		blockStack.length = 0;
		handleError(err, instance, 1);
		result = createVNode(Comment);
	}
	let root = result;
	let setRoot = void 0;
	if (result.patchFlag > 0 && result.patchFlag & 2048) [root, setRoot] = getChildRoot(result);
	if (fallthroughAttrs && inheritAttrs !== false) {
		const keys = Object.keys(fallthroughAttrs);
		const { shapeFlag } = root;
		if (keys.length) {
			if (shapeFlag & 7) {
				if (propsOptions && keys.some(isModelListener)) fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
				root = cloneVNode(root, fallthroughAttrs, false, true);
			} else if (!accessedAttrs && root.type !== Comment) {
				const allAttrs = Object.keys(attrs);
				const eventAttrs = [];
				const extraAttrs = [];
				for (let i = 0, l = allAttrs.length; i < l; i++) {
					const key = allAttrs[i];
					if (isOn(key)) {
						if (!isModelListener(key)) eventAttrs.push(key[2].toLowerCase() + key.slice(3));
					} else extraAttrs.push(key);
				}
				if (extraAttrs.length) warn$1(`Extraneous non-props attributes (${extraAttrs.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text or teleport root nodes.`);
				if (eventAttrs.length) warn$1(`Extraneous non-emits event listeners (${eventAttrs.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the "emits" option.`);
			}
		}
	}
	if (vnode.dirs) {
		if (!isElementRoot(root)) warn$1(`Runtime directive used on component with non-element root node. The directives will not function as intended.`);
		root = cloneVNode(root, null, false, true);
		root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
	}
	if (vnode.transition) {
		if (!isElementRoot(root)) warn$1(`Component inside <Transition> renders non-element root node that cannot be animated.`);
		setTransitionHooks(root, vnode.transition);
	}
	if (setRoot) setRoot(root);
	else result = root;
	setCurrentRenderingInstance(prev);
	return result;
}
var getChildRoot = (vnode) => {
	const rawChildren = vnode.children;
	const dynamicChildren = vnode.dynamicChildren;
	const childRoot = filterSingleRoot(rawChildren, false);
	if (!childRoot) return [vnode, void 0];
	else if (childRoot.patchFlag > 0 && childRoot.patchFlag & 2048) return getChildRoot(childRoot);
	const index = rawChildren.indexOf(childRoot);
	const dynamicIndex = dynamicChildren ? dynamicChildren.indexOf(childRoot) : -1;
	const setRoot = (updatedRoot) => {
		rawChildren[index] = updatedRoot;
		if (dynamicChildren) {
			if (dynamicIndex > -1) dynamicChildren[dynamicIndex] = updatedRoot;
			else if (updatedRoot.patchFlag > 0) vnode.dynamicChildren = [...dynamicChildren, updatedRoot];
		}
	};
	return [normalizeVNode(childRoot), setRoot];
};
function filterSingleRoot(children, recurse = true) {
	let singleRoot;
	for (let i = 0; i < children.length; i++) {
		const child = children[i];
		if (isVNode(child)) {
			if (child.type !== Comment || child.children === "v-if") if (singleRoot) return;
			else {
				singleRoot = child;
				if (recurse && singleRoot.patchFlag > 0 && singleRoot.patchFlag & 2048) return filterSingleRoot(singleRoot.children);
			}
		} else return;
	}
	return singleRoot;
}
var getFunctionalFallthrough = (attrs) => {
	let res;
	for (const key in attrs) if (key === "class" || key === "style" || isOn(key)) (res || (res = {}))[key] = attrs[key];
	return res;
};
var filterModelListeners = (attrs, props) => {
	const res = {};
	for (const key in attrs) if (!isModelListener(key) || !(key.slice(9) in props)) res[key] = attrs[key];
	return res;
};
var isElementRoot = (vnode) => {
	return vnode.shapeFlag & 7 || vnode.type === Comment;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
	const { props: prevProps, children: prevChildren, component } = prevVNode;
	const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
	const emits = component.emitsOptions;
	if ((prevChildren || nextChildren) && isHmrUpdating) return true;
	if (nextVNode.dirs || nextVNode.transition) return true;
	if (optimized && patchFlag >= 0) {
		if (patchFlag & 1024) return true;
		if (patchFlag & 16) {
			if (!prevProps) return !!nextProps;
			return hasPropsChanged(prevProps, nextProps, emits);
		} else if (patchFlag & 8) {
			const dynamicProps = nextVNode.dynamicProps;
			for (let i = 0; i < dynamicProps.length; i++) {
				const key = dynamicProps[i];
				if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emits, key)) return true;
			}
		}
	} else {
		if (prevChildren || nextChildren) {
			if (!nextChildren || !nextChildren.$stable) return true;
		}
		if (prevProps === nextProps) return false;
		if (!prevProps) return !!nextProps;
		if (!nextProps) return true;
		return hasPropsChanged(prevProps, nextProps, emits);
	}
	return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
	const nextKeys = Object.keys(nextProps);
	if (nextKeys.length !== Object.keys(prevProps).length) return true;
	for (let i = 0; i < nextKeys.length; i++) {
		const key = nextKeys[i];
		if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emitsOptions, key)) return true;
	}
	return false;
}
function hasPropValueChanged(nextProps, prevProps, key) {
	const nextProp = nextProps[key];
	const prevProp = prevProps[key];
	if (key === "style" && isObject(nextProp) && isObject(prevProp)) return !looseEqual(nextProp, prevProp);
	return nextProp !== prevProp;
}
function updateHOCHostEl({ vnode, parent, suspense }, el) {
	while (parent) {
		const root = parent.subTree;
		if (root.suspense && root.suspense.activeBranch === vnode) {
			root.suspense.vnode.el = root.el = el;
			vnode = root;
		}
		if (root === vnode) {
			(vnode = parent.vnode).el = el;
			parent = parent.parent;
		} else break;
	}
	if (suspense && suspense.activeBranch === vnode) suspense.vnode.el = el;
}
var internalObjectProto = {};
var createInternalObject = () => Object.create(internalObjectProto);
var isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
function initProps(instance, rawProps, isStateful, isSSR = false) {
	const props = {};
	const attrs = createInternalObject();
	instance.propsDefaults = /* @__PURE__ */ Object.create(null);
	setFullProps(instance, rawProps, props, attrs);
	for (const key in instance.propsOptions[0]) if (!(key in props)) props[key] = void 0;
	validateProps(rawProps || {}, props, instance);
	if (isStateful) instance.props = isSSR ? props : /* @__PURE__ */ shallowReactive(props);
	else if (!instance.type.props) instance.props = attrs;
	else instance.props = props;
	instance.attrs = attrs;
}
function isInHmrContext(instance) {
	while (instance) {
		if (instance.type.__hmrId) return true;
		instance = instance.parent;
	}
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
	const { props, attrs, vnode: { patchFlag } } = instance;
	const rawCurrentProps = /* @__PURE__ */ toRaw(props);
	const [options] = instance.propsOptions;
	let hasAttrsChanged = false;
	if (!isInHmrContext(instance) && (optimized || patchFlag > 0) && !(patchFlag & 16)) {
		if (patchFlag & 8) {
			const propsToUpdate = instance.vnode.dynamicProps;
			for (let i = 0; i < propsToUpdate.length; i++) {
				let key = propsToUpdate[i];
				if (isEmitListener(instance.emitsOptions, key)) continue;
				const value = rawProps[key];
				if (options) if (hasOwn(attrs, key)) {
					if (value !== attrs[key]) {
						attrs[key] = value;
						hasAttrsChanged = true;
					}
				} else {
					const camelizedKey = camelize(key);
					props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false);
				}
				else if (value !== attrs[key]) {
					attrs[key] = value;
					hasAttrsChanged = true;
				}
			}
		}
	} else {
		if (setFullProps(instance, rawProps, props, attrs)) hasAttrsChanged = true;
		let kebabKey;
		for (const key in rawCurrentProps) if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) if (options) {
			if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) props[key] = resolvePropValue(options, rawCurrentProps, key, void 0, instance, true);
		} else delete props[key];
		if (attrs !== rawCurrentProps) {
			for (const key in attrs) if (!rawProps || !hasOwn(rawProps, key) && true) {
				delete attrs[key];
				hasAttrsChanged = true;
			}
		}
	}
	if (hasAttrsChanged) trigger(instance.attrs, "set", "");
	validateProps(rawProps || {}, props, instance);
}
function setFullProps(instance, rawProps, props, attrs) {
	const [options, needCastKeys] = instance.propsOptions;
	let hasAttrsChanged = false;
	let rawCastValues;
	if (rawProps) for (let key in rawProps) {
		if (isReservedProp(key)) continue;
		const value = rawProps[key];
		let camelKey;
		if (options && hasOwn(options, camelKey = camelize(key))) if (!needCastKeys || !needCastKeys.includes(camelKey)) props[camelKey] = value;
		else (rawCastValues || (rawCastValues = {}))[camelKey] = value;
		else if (!isEmitListener(instance.emitsOptions, key)) {
			if (!(key in attrs) || value !== attrs[key]) {
				attrs[key] = value;
				hasAttrsChanged = true;
			}
		}
	}
	if (needCastKeys) {
		const rawCurrentProps = /* @__PURE__ */ toRaw(props);
		const castValues = rawCastValues || EMPTY_OBJ;
		for (let i = 0; i < needCastKeys.length; i++) {
			const key = needCastKeys[i];
			props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn(castValues, key));
		}
	}
	return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
	const opt = options[key];
	if (opt != null) {
		const hasDefault = hasOwn(opt, "default");
		if (hasDefault && value === void 0) {
			const defaultValue = opt.default;
			if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
				const { propsDefaults } = instance;
				if (key in propsDefaults) value = propsDefaults[key];
				else {
					const reset = setCurrentInstance(instance);
					value = propsDefaults[key] = defaultValue.call(null, props);
					reset();
				}
			} else value = defaultValue;
			if (instance.ce) instance.ce._setProp(key, value);
		}
		if (opt[0]) {
			if (isAbsent && !hasDefault) value = false;
			else if (opt[1] && (value === "" || value === hyphenate(key))) value = true;
		}
	}
	return value;
}
var mixinPropsCache = /* @__PURE__ */ new WeakMap();
function normalizePropsOptions(comp, appContext, asMixin = false) {
	const cache = __VUE_OPTIONS_API__ && asMixin ? mixinPropsCache : appContext.propsCache;
	const cached = cache.get(comp);
	if (cached) return cached;
	const raw = comp.props;
	const normalized = {};
	const needCastKeys = [];
	let hasExtends = false;
	if (__VUE_OPTIONS_API__ && !isFunction(comp)) {
		const extendProps = (raw2) => {
			hasExtends = true;
			const [props, keys] = normalizePropsOptions(raw2, appContext, true);
			extend(normalized, props);
			if (keys) needCastKeys.push(...keys);
		};
		if (!asMixin && appContext.mixins.length) appContext.mixins.forEach(extendProps);
		if (comp.extends) extendProps(comp.extends);
		if (comp.mixins) comp.mixins.forEach(extendProps);
	}
	if (!raw && !hasExtends) {
		if (isObject(comp)) cache.set(comp, EMPTY_ARR);
		return EMPTY_ARR;
	}
	if (isArray(raw)) for (let i = 0; i < raw.length; i++) {
		if (!isString(raw[i])) warn$1(`props must be strings when using array syntax.`, raw[i]);
		const normalizedKey = camelize(raw[i]);
		if (validatePropName(normalizedKey)) normalized[normalizedKey] = EMPTY_OBJ;
	}
	else if (raw) {
		if (!isObject(raw)) warn$1(`invalid props options`, raw);
		for (const key in raw) {
			const normalizedKey = camelize(key);
			if (validatePropName(normalizedKey)) {
				const opt = raw[key];
				const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
				const propType = prop.type;
				let shouldCast = false;
				let shouldCastTrue = true;
				if (isArray(propType)) for (let index = 0; index < propType.length; ++index) {
					const type = propType[index];
					const typeName = isFunction(type) && type.name;
					if (typeName === "Boolean") {
						shouldCast = true;
						break;
					} else if (typeName === "String") shouldCastTrue = false;
				}
				else shouldCast = isFunction(propType) && propType.name === "Boolean";
				prop[0] = shouldCast;
				prop[1] = shouldCastTrue;
				if (shouldCast || hasOwn(prop, "default")) needCastKeys.push(normalizedKey);
			}
		}
	}
	const res = [normalized, needCastKeys];
	if (isObject(comp)) cache.set(comp, res);
	return res;
}
function validatePropName(key) {
	if (key[0] !== "$" && !isReservedProp(key)) return true;
	else warn$1(`Invalid prop name: "${key}" is a reserved property.`);
	return false;
}
function getType(ctor) {
	if (ctor === null) return "null";
	if (typeof ctor === "function") return ctor.name || "";
	else if (typeof ctor === "object") return ctor.constructor && ctor.constructor.name || "";
	return "";
}
function validateProps(rawProps, props, instance) {
	const resolvedValues = /* @__PURE__ */ toRaw(props);
	const options = instance.propsOptions[0];
	const camelizePropsKey = Object.keys(rawProps).map((key) => camelize(key));
	for (const key in options) {
		let opt = options[key];
		if (opt == null) continue;
		validateProp(key, resolvedValues[key], opt, /* @__PURE__ */ shallowReadonly(resolvedValues), !camelizePropsKey.includes(key));
	}
}
function validateProp(name, value, prop, props, isAbsent) {
	const { type, required, validator, skipCheck } = prop;
	if (required && isAbsent) {
		warn$1("Missing required prop: \"" + name + "\"");
		return;
	}
	if (value == null && !required) return;
	if (type != null && type !== true && !skipCheck) {
		let isValid = false;
		const types = isArray(type) ? type : [type];
		const expectedTypes = [];
		for (let i = 0; i < types.length && !isValid; i++) {
			const { valid, expectedType } = assertType(value, types[i]);
			expectedTypes.push(expectedType || "");
			isValid = valid;
		}
		if (!isValid) {
			warn$1(getInvalidTypeMessage(name, value, expectedTypes));
			return;
		}
	}
	if (validator && !validator(value, props)) warn$1("Invalid prop: custom validator check failed for prop \"" + name + "\".");
}
var isSimpleType = /* @__PURE__ */ makeMap("String,Number,Boolean,Function,Symbol,BigInt");
function assertType(value, type) {
	let valid;
	const expectedType = getType(type);
	if (expectedType === "null") valid = value === null;
	else if (isSimpleType(expectedType)) {
		const t = typeof value;
		valid = t === expectedType.toLowerCase();
		if (!valid && t === "object") valid = value instanceof type;
	} else if (expectedType === "Object") valid = isObject(value);
	else if (expectedType === "Array") valid = isArray(value);
	else valid = value instanceof type;
	return {
		valid,
		expectedType
	};
}
function getInvalidTypeMessage(name, value, expectedTypes) {
	if (expectedTypes.length === 0) return `Prop type [] for prop "${name}" won't match anything. Did you mean to use type Array instead?`;
	let message = `Invalid prop: type check failed for prop "${name}". Expected ${expectedTypes.map(capitalize).join(" | ")}`;
	const expectedType = expectedTypes[0];
	const receivedType = toRawType(value);
	const expectedValue = styleValue(value, expectedType);
	const receivedValue = styleValue(value, receivedType);
	if (expectedTypes.length === 1 && isExplicable(expectedType) && isCoercible(expectedType, receivedType)) message += ` with value ${expectedValue}`;
	message += `, got ${receivedType} `;
	if (isExplicable(receivedType)) message += `with value ${receivedValue}.`;
	return message;
}
function styleValue(value, type) {
	if (isSymbol(value)) return value.toString();
	else if (type === "String") return `"${value}"`;
	else if (type === "Number") return `${Number(value)}`;
	else return `${value}`;
}
function isExplicable(type) {
	return [
		"string",
		"number",
		"boolean"
	].some((elem) => type.toLowerCase() === elem);
}
function isCoercible(...args) {
	return args.every((elem) => {
		const value = elem.toLowerCase();
		return value !== "boolean" && value !== "symbol";
	});
}
var isInternalKey = (key) => key === "_" || key === "_ctx" || key === "$stable";
var normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
var normalizeSlot = (key, rawSlot, ctx) => {
	if (rawSlot._n) return rawSlot;
	const normalized = withCtx((...args) => {
		if (currentInstance && !(ctx === null && currentRenderingInstance) && !(ctx && ctx.root !== currentInstance.root)) warn$1(`Slot "${key}" invoked outside of the render function: this will not track dependencies used in the slot. Invoke the slot function inside the render function instead.`);
		return normalizeSlotValue(rawSlot(...args));
	}, ctx);
	normalized._c = false;
	return normalized;
};
var normalizeObjectSlots = (rawSlots, slots, instance) => {
	const ctx = rawSlots._ctx;
	for (const key in rawSlots) {
		if (isInternalKey(key)) continue;
		const value = rawSlots[key];
		if (isFunction(value)) slots[key] = normalizeSlot(key, value, ctx);
		else if (value != null) {
			warn$1(`Non-function value encountered for slot "${key}". Prefer function slots for better performance.`);
			const normalized = normalizeSlotValue(value);
			slots[key] = () => normalized;
		}
	}
};
var normalizeVNodeSlots = (instance, children) => {
	if (!isKeepAlive(instance.vnode) && true) warn$1(`Non-function value encountered for default slot. Prefer function slots for better performance.`);
	const normalized = normalizeSlotValue(children);
	instance.slots.default = () => normalized;
};
var assignSlots = (slots, children, optimized) => {
	for (const key in children) if (optimized || !isInternalKey(key)) slots[key] = children[key];
};
var initSlots = (instance, children, optimized) => {
	const slots = instance.slots = createInternalObject();
	if (instance.vnode.shapeFlag & 32) {
		const type = children._;
		if (type) {
			assignSlots(slots, children, optimized);
			if (optimized) def(slots, "_", type, true);
		} else normalizeObjectSlots(children, slots);
	} else if (children) normalizeVNodeSlots(instance, children);
};
var updateSlots = (instance, children, optimized) => {
	const { vnode, slots } = instance;
	let needDeletionCheck = true;
	let deletionComparisonTarget = EMPTY_OBJ;
	if (vnode.shapeFlag & 32) {
		const type = children._;
		if (type) if (isHmrUpdating) {
			assignSlots(slots, children, optimized);
			trigger(instance, "set", "$slots");
		} else if (optimized && type === 1) needDeletionCheck = false;
		else assignSlots(slots, children, optimized);
		else {
			needDeletionCheck = !children.$stable;
			normalizeObjectSlots(children, slots);
		}
		deletionComparisonTarget = children;
	} else if (children) {
		normalizeVNodeSlots(instance, children);
		deletionComparisonTarget = { default: 1 };
	}
	if (needDeletionCheck) {
		for (const key in slots) if (!isInternalKey(key) && deletionComparisonTarget[key] == null) delete slots[key];
	}
};
var supported;
var perf;
function startMeasure(instance, type) {
	if (instance.appContext.config.performance && isSupported()) perf.mark(`vue-${type}-${instance.uid}`);
	devtoolsPerfStart(instance, type, isSupported() ? perf.now() : Date.now());
}
function endMeasure(instance, type) {
	if (instance.appContext.config.performance && isSupported()) {
		const startTag = `vue-${type}-${instance.uid}`;
		const endTag = startTag + `:end`;
		const measureName = `<${formatComponentName(instance, instance.type)}> ${type}`;
		perf.mark(endTag);
		perf.measure(measureName, startTag, endTag);
		perf.clearMeasures(measureName);
		perf.clearMarks(startTag);
		perf.clearMarks(endTag);
	}
	devtoolsPerfEnd(instance, type, isSupported() ? perf.now() : Date.now());
}
function isSupported() {
	if (supported !== void 0) return supported;
	if (typeof window !== "undefined" && window.performance) {
		supported = true;
		perf = window.performance;
	} else supported = false;
	return supported;
}
function initFeatureFlags() {
	const needWarn = [];
	if (typeof __VUE_OPTIONS_API__ !== "boolean") {
		needWarn.push(`__VUE_OPTIONS_API__`);
		getGlobalThis().__VUE_OPTIONS_API__ = true;
	}
	if (typeof __VUE_PROD_DEVTOOLS__ !== "boolean") {
		needWarn.push(`__VUE_PROD_DEVTOOLS__`);
		getGlobalThis().__VUE_PROD_DEVTOOLS__ = false;
	}
	if (typeof __VUE_PROD_HYDRATION_MISMATCH_DETAILS__ !== "boolean") {
		needWarn.push(`__VUE_PROD_HYDRATION_MISMATCH_DETAILS__`);
		getGlobalThis().__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;
	}
	if (needWarn.length) {
		const multi = needWarn.length > 1;
		console.warn(`Feature flag${multi ? `s` : ``} ${needWarn.join(", ")} ${multi ? `are` : `is`} not explicitly defined. You are running the esm-bundler build of Vue, which expects these compile-time feature flags to be globally injected via the bundler config in order to get better tree-shaking in the production bundle.

For more details, see https://link.vuejs.org/feature-flags.`);
	}
}
var queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
	return baseCreateRenderer(options);
}
function createHydrationRenderer(options) {
	return baseCreateRenderer(options, createHydrationFunctions);
}
function baseCreateRenderer(options, createHydrationFns) {
	initFeatureFlags();
	const target = getGlobalThis();
	target.__VUE__ = true;
	setDevtoolsHook$1(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target);
	const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, insertStaticContent: hostInsertStaticContent } = options;
	const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = isHmrUpdating ? false : !!n2.dynamicChildren) => {
		if (n1 === n2) return;
		if (n1 && !isSameVNodeType(n1, n2)) {
			anchor = getNextHostNode(n1);
			unmount(n1, parentComponent, parentSuspense, true);
			n1 = null;
		}
		if (n2.patchFlag === -2) {
			optimized = false;
			n2.dynamicChildren = null;
		}
		const { type, ref, shapeFlag } = n2;
		switch (type) {
			case Text:
				processText(n1, n2, container, anchor);
				break;
			case Comment:
				processCommentNode(n1, n2, container, anchor);
				break;
			case Static:
				if (n1 == null) mountStaticNode(n2, container, anchor, namespace);
				else patchStaticNode(n1, n2, container, namespace);
				break;
			case Fragment:
				processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				break;
			default: if (shapeFlag & 1) processElement(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else if (shapeFlag & 6) processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else if (shapeFlag & 64) type.process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals);
			else if (shapeFlag & 128) type.process(n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, internals);
			else warn$1("Invalid VNode type:", type, `(${typeof type})`);
		}
		if (ref != null && parentComponent) setRef(ref, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
		else if (ref == null && n1 && n1.ref != null) setRef(n1.ref, null, parentSuspense, n1, true);
	};
	const processText = (n1, n2, container, anchor) => {
		if (n1 == null) hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
		else {
			const el = n2.el = n1.el;
			if (n2.children !== n1.children) hostSetText(el, n2.children);
		}
	};
	const processCommentNode = (n1, n2, container, anchor) => {
		if (n1 == null) hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
		else n2.el = n1.el;
	};
	const mountStaticNode = (n2, container, anchor, namespace) => {
		[n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, namespace, n2.el, n2.anchor);
	};
	const patchStaticNode = (n1, n2, container, namespace) => {
		if (n2.children !== n1.children) {
			const anchor = hostNextSibling(n1.anchor);
			removeStaticNode(n1);
			[n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, namespace);
		} else {
			n2.el = n1.el;
			n2.anchor = n1.anchor;
		}
	};
	const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
		let next;
		while (el && el !== anchor) {
			next = hostNextSibling(el);
			hostInsert(el, container, nextSibling);
			el = next;
		}
		hostInsert(anchor, container, nextSibling);
	};
	const removeStaticNode = ({ el, anchor }) => {
		let next;
		while (el && el !== anchor) {
			next = hostNextSibling(el);
			hostRemove(el);
			el = next;
		}
		hostRemove(anchor);
	};
	const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		if (n2.type === "svg") namespace = "svg";
		else if (n2.type === "math") namespace = "mathml";
		if (n1 == null) mountElement(n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		else {
			const customElement = n1.el && n1.el._isVueCE ? n1.el : null;
			try {
				if (customElement) customElement._beginPatch();
				patchElement(n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			} finally {
				if (customElement) customElement._endPatch();
			}
		}
	};
	const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		let el;
		let vnodeHook;
		const { props, shapeFlag, transition, dirs } = vnode;
		el = vnode.el = hostCreateElement(vnode.type, namespace, props && props.is, props);
		if (shapeFlag & 8) hostSetElementText(el, vnode.children);
		else if (shapeFlag & 16) mountChildren(vnode.children, el, null, parentComponent, parentSuspense, resolveChildrenNamespace(vnode, namespace), slotScopeIds, optimized);
		if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "created");
		setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
		if (props) {
			for (const key in props) if (key !== "value" && !isReservedProp(key)) hostPatchProp(el, key, null, props[key], namespace, parentComponent);
			if ("value" in props) hostPatchProp(el, "value", null, props.value, namespace);
			if (vnodeHook = props.onVnodeBeforeMount) invokeVNodeHook(vnodeHook, parentComponent, vnode);
		}
		def(el, "__vnode", vnode, true);
		def(el, "__vueParentComponent", parentComponent, true);
		if (dirs) invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
		const needCallTransitionHooks = needTransition(parentSuspense, transition);
		if (needCallTransitionHooks) transition.beforeEnter(el);
		hostInsert(el, container, anchor);
		if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
			const isHmr = isHmrUpdating;
			queuePostRenderEffect(() => {
				let prev;
				prev = setHmrUpdating(isHmr);
				try {
					vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
					needCallTransitionHooks && transition.enter(el);
					dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
				} finally {
					setHmrUpdating(prev);
				}
			}, parentSuspense);
		}
	};
	const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
		if (scopeId) hostSetScopeId(el, scopeId);
		if (slotScopeIds) for (let i = 0; i < slotScopeIds.length; i++) hostSetScopeId(el, slotScopeIds[i]);
		if (parentComponent) {
			let subTree = parentComponent.subTree;
			if (subTree.patchFlag > 0 && subTree.patchFlag & 2048) subTree = filterSingleRoot(subTree.children) || subTree;
			if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
				const parentVNode = parentComponent.vnode;
				setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
			}
		}
	};
	const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
		for (let i = start; i < children.length; i++) patch(null, children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]), container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
	};
	const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		const el = n2.el = n1.el;
		el.__vnode = n2;
		let { patchFlag, dynamicChildren, dirs } = n2;
		patchFlag |= n1.patchFlag & 16;
		const oldProps = n1.props || EMPTY_OBJ;
		const newProps = n2.props || EMPTY_OBJ;
		let vnodeHook;
		parentComponent && toggleRecurse(parentComponent, false);
		if (vnodeHook = newProps.onVnodeBeforeUpdate) invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
		if (dirs) invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
		parentComponent && toggleRecurse(parentComponent, true);
		if (isHmrUpdating) {
			patchFlag = 0;
			optimized = false;
			dynamicChildren = null;
		}
		if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) hostSetElementText(el, "");
		if (dynamicChildren) {
			patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, resolveChildrenNamespace(n2, namespace), slotScopeIds);
			traverseStaticChildren(n1, n2);
		} else if (!optimized) patchChildren(n1, n2, el, null, parentComponent, parentSuspense, resolveChildrenNamespace(n2, namespace), slotScopeIds, false);
		if (patchFlag > 0) {
			if (patchFlag & 16) patchProps(el, oldProps, newProps, parentComponent, namespace);
			else {
				if (patchFlag & 2) {
					if (oldProps.class !== newProps.class) hostPatchProp(el, "class", null, newProps.class, namespace);
				}
				if (patchFlag & 4) hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
				if (patchFlag & 8) {
					const propsToUpdate = n2.dynamicProps;
					for (let i = 0; i < propsToUpdate.length; i++) {
						const key = propsToUpdate[i];
						const prev = oldProps[key];
						const next = newProps[key];
						if (next !== prev || key === "value") hostPatchProp(el, key, prev, next, namespace, parentComponent);
					}
				}
			}
			if (patchFlag & 1) {
				if (n1.children !== n2.children) hostSetElementText(el, n2.children);
			}
		} else if (!optimized && dynamicChildren == null) patchProps(el, oldProps, newProps, parentComponent, namespace);
		if ((vnodeHook = newProps.onVnodeUpdated) || dirs) queuePostRenderEffect(() => {
			vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
			dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
		}, parentSuspense);
	};
	const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
		for (let i = 0; i < newChildren.length; i++) {
			const oldVNode = oldChildren[i];
			const newVNode = newChildren[i];
			patch(oldVNode, newVNode, oldVNode.el && (oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & 198) ? hostParentNode(oldVNode.el) : fallbackContainer, null, parentComponent, parentSuspense, namespace, slotScopeIds, true);
		}
	};
	const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
		if (oldProps !== newProps) {
			if (oldProps !== EMPTY_OBJ) {
				for (const key in oldProps) if (!isReservedProp(key) && !(key in newProps)) hostPatchProp(el, key, oldProps[key], null, namespace, parentComponent);
			}
			for (const key in newProps) {
				if (isReservedProp(key)) continue;
				const next = newProps[key];
				const prev = oldProps[key];
				if (next !== prev && key !== "value") hostPatchProp(el, key, prev, next, namespace, parentComponent);
			}
			if ("value" in newProps) hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
		}
	};
	const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
		const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
		let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
		if (isHmrUpdating || patchFlag & 2048) {
			patchFlag = 0;
			optimized = false;
			dynamicChildren = null;
		}
		if (fragmentSlotScopeIds) slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
		if (n1 == null) {
			hostInsert(fragmentStartAnchor, container, anchor);
			hostInsert(fragmentEndAnchor, container, anchor);
			mountChildren(n2.children || [], container, fragmentEndAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		} else if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren && n1.dynamicChildren.length === dynamicChildren.length) {
			patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, namespace, slotScopeIds);
			traverseStaticChildren(n1, n2);
		} else patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
	};
	const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		n2.slotScopeIds = slotScopeIds;
		if (n1 == null) if (n2.shapeFlag & 512) parentComponent.ctx.activate(n2, container, anchor, namespace, optimized);
		else mountComponent(n2, container, anchor, parentComponent, parentSuspense, namespace, optimized);
		else updateComponent(n1, n2, optimized);
	};
	const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
		const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
		if (instance.type.__hmrId) registerHMR(instance);
		pushWarningContext(initialVNode);
		startMeasure(instance, `mount`);
		if (isKeepAlive(initialVNode)) instance.ctx.renderer = internals;
		startMeasure(instance, `init`);
		setupComponent(instance, false, optimized);
		endMeasure(instance, `init`);
		if (isHmrUpdating) initialVNode.el = null;
		if (instance.asyncDep) {
			parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
			if (!initialVNode.el) {
				const placeholder = instance.subTree = createVNode(Comment);
				processCommentNode(null, placeholder, container, anchor);
				initialVNode.placeholder = placeholder.el;
			}
		} else setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, namespace, optimized);
		popWarningContext();
		endMeasure(instance, `mount`);
	};
	const updateComponent = (n1, n2, optimized) => {
		const instance = n2.component = n1.component;
		if (shouldUpdateComponent(n1, n2, optimized)) if (instance.asyncDep && !instance.asyncResolved) {
			pushWarningContext(n2);
			updateComponentPreRender(instance, n2, optimized);
			popWarningContext();
			return;
		} else {
			instance.next = n2;
			instance.update();
		}
		else {
			n2.el = n1.el;
			instance.vnode = n2;
		}
	};
	const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
		const componentUpdateFn = () => {
			if (!instance.isMounted) {
				let vnodeHook;
				const { el, props } = initialVNode;
				const { bm, m, parent, root, type } = instance;
				const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
				toggleRecurse(instance, false);
				if (bm) invokeArrayFns(bm);
				if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) invokeVNodeHook(vnodeHook, parent, initialVNode);
				toggleRecurse(instance, true);
				if (el && hydrateNode) {
					const hydrateSubTree = () => {
						startMeasure(instance, `render`);
						instance.subTree = renderComponentRoot(instance);
						endMeasure(instance, `render`);
						startMeasure(instance, `hydrate`);
						hydrateNode(el, instance.subTree, instance, parentSuspense, null);
						endMeasure(instance, `hydrate`);
					};
					if (isAsyncWrapperVNode && type.__asyncHydrate) type.__asyncHydrate(el, instance, hydrateSubTree);
					else hydrateSubTree();
				} else {
					if (root.ce && root.ce._hasShadowRoot()) root.ce._injectChildStyle(type, instance.parent ? instance.parent.type : void 0);
					startMeasure(instance, `render`);
					const subTree = instance.subTree = renderComponentRoot(instance);
					endMeasure(instance, `render`);
					startMeasure(instance, `patch`);
					patch(null, subTree, container, anchor, instance, parentSuspense, namespace);
					endMeasure(instance, `patch`);
					initialVNode.el = subTree.el;
				}
				if (m) queuePostRenderEffect(m, parentSuspense);
				if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
					const scopedInitialVNode = initialVNode;
					queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
				}
				if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) instance.a && queuePostRenderEffect(instance.a, parentSuspense);
				instance.isMounted = true;
				devtoolsComponentAdded(instance);
				initialVNode = container = anchor = null;
			} else {
				let { next, bu, u, parent, vnode } = instance;
				{
					const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
					if (nonHydratedAsyncRoot) {
						if (next) {
							next.el = vnode.el;
							updateComponentPreRender(instance, next, optimized);
						}
						nonHydratedAsyncRoot.asyncDep.then(() => {
							queuePostRenderEffect(() => {
								if (!instance.isUnmounted) update();
							}, parentSuspense);
						});
						return;
					}
				}
				let originNext = next;
				let vnodeHook;
				pushWarningContext(next || instance.vnode);
				toggleRecurse(instance, false);
				if (next) {
					next.el = vnode.el;
					updateComponentPreRender(instance, next, optimized);
				} else next = vnode;
				if (bu) invokeArrayFns(bu);
				if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) invokeVNodeHook(vnodeHook, parent, next, vnode);
				toggleRecurse(instance, true);
				startMeasure(instance, `render`);
				const nextTree = renderComponentRoot(instance);
				endMeasure(instance, `render`);
				const prevTree = instance.subTree;
				instance.subTree = nextTree;
				startMeasure(instance, `patch`);
				patch(prevTree, nextTree, hostParentNode(prevTree.el), getNextHostNode(prevTree), instance, parentSuspense, namespace);
				endMeasure(instance, `patch`);
				next.el = nextTree.el;
				if (originNext === null) updateHOCHostEl(instance, nextTree.el);
				if (u) queuePostRenderEffect(u, parentSuspense);
				if (vnodeHook = next.props && next.props.onVnodeUpdated) queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
				devtoolsComponentUpdated(instance);
				popWarningContext();
			}
		};
		instance.scope.on();
		const effect = instance.effect = new ReactiveEffect(componentUpdateFn);
		instance.scope.off();
		const update = instance.update = effect.run.bind(effect);
		const job = instance.job = effect.runIfDirty.bind(effect);
		job.i = instance;
		job.id = instance.uid;
		effect.scheduler = () => queueJob(job);
		toggleRecurse(instance, true);
		effect.onTrack = instance.rtc ? (e) => invokeArrayFns(instance.rtc, e) : void 0;
		effect.onTrigger = instance.rtg ? (e) => invokeArrayFns(instance.rtg, e) : void 0;
		update();
	};
	const updateComponentPreRender = (instance, nextVNode, optimized) => {
		nextVNode.component = instance;
		const prevProps = instance.vnode.props;
		instance.vnode = nextVNode;
		instance.next = null;
		updateProps(instance, nextVNode.props, prevProps, optimized);
		updateSlots(instance, nextVNode.children, optimized);
		pauseTracking();
		flushPreFlushCbs(instance);
		resetTracking();
	};
	const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
		const c1 = n1 && n1.children;
		const prevShapeFlag = n1 ? n1.shapeFlag : 0;
		const c2 = n2.children;
		const { patchFlag, shapeFlag } = n2;
		if (patchFlag > 0) {
			if (patchFlag & 128) {
				patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				return;
			} else if (patchFlag & 256) {
				patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				return;
			}
		}
		if (shapeFlag & 8) {
			if (prevShapeFlag & 16) unmountChildren(c1, parentComponent, parentSuspense);
			if (c2 !== c1) hostSetElementText(container, c2);
		} else if (prevShapeFlag & 16) if (shapeFlag & 16) patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		else unmountChildren(c1, parentComponent, parentSuspense, true);
		else {
			if (prevShapeFlag & 8) hostSetElementText(container, "");
			if (shapeFlag & 16) mountChildren(c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		}
	};
	const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		c1 = c1 || EMPTY_ARR;
		c2 = c2 || EMPTY_ARR;
		const oldLength = c1.length;
		const newLength = c2.length;
		const commonLength = Math.min(oldLength, newLength);
		let i;
		for (i = 0; i < commonLength; i++) {
			const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
			patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
		}
		if (oldLength > newLength) unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
		else mountChildren(c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, commonLength);
	};
	const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
		let i = 0;
		const l2 = c2.length;
		let e1 = c1.length - 1;
		let e2 = l2 - 1;
		while (i <= e1 && i <= e2) {
			const n1 = c1[i];
			const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
			if (isSameVNodeType(n1, n2)) patch(n1, n2, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else break;
			i++;
		}
		while (i <= e1 && i <= e2) {
			const n1 = c1[e1];
			const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
			if (isSameVNodeType(n1, n2)) patch(n1, n2, container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
			else break;
			e1--;
			e2--;
		}
		if (i > e1) {
			if (i <= e2) {
				const nextPos = e2 + 1;
				const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
				while (i <= e2) {
					patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
					i++;
				}
			}
		} else if (i > e2) while (i <= e1) {
			unmount(c1[i], parentComponent, parentSuspense, true);
			i++;
		}
		else {
			const s1 = i;
			const s2 = i;
			const keyToNewIndexMap = /* @__PURE__ */ new Map();
			for (i = s2; i <= e2; i++) {
				const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
				if (nextChild.key != null) {
					if (keyToNewIndexMap.has(nextChild.key)) warn$1(`Duplicate keys found during update:`, JSON.stringify(nextChild.key), `Make sure keys are unique.`);
					keyToNewIndexMap.set(nextChild.key, i);
				}
			}
			let j;
			let patched = 0;
			const toBePatched = e2 - s2 + 1;
			let moved = false;
			let maxNewIndexSoFar = 0;
			const newIndexToOldIndexMap = new Array(toBePatched);
			for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
			for (i = s1; i <= e1; i++) {
				const prevChild = c1[i];
				if (patched >= toBePatched) {
					unmount(prevChild, parentComponent, parentSuspense, true);
					continue;
				}
				let newIndex;
				if (prevChild.key != null) newIndex = keyToNewIndexMap.get(prevChild.key);
				else for (j = s2; j <= e2; j++) if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
					newIndex = j;
					break;
				}
				if (newIndex === void 0) unmount(prevChild, parentComponent, parentSuspense, true);
				else {
					newIndexToOldIndexMap[newIndex - s2] = i + 1;
					if (newIndex >= maxNewIndexSoFar) maxNewIndexSoFar = newIndex;
					else moved = true;
					patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
					patched++;
				}
			}
			const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
			j = increasingNewIndexSequence.length - 1;
			for (i = toBePatched - 1; i >= 0; i--) {
				const nextIndex = s2 + i;
				const nextChild = c2[nextIndex];
				const anchorVNode = c2[nextIndex + 1];
				const anchor = nextIndex + 1 < l2 ? anchorVNode.el || resolveAsyncComponentPlaceholder(anchorVNode) : parentAnchor;
				if (newIndexToOldIndexMap[i] === 0) patch(null, nextChild, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized);
				else if (moved) if (j < 0 || i !== increasingNewIndexSequence[j]) move(nextChild, container, anchor, 2);
				else j--;
			}
		}
	};
	const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
		const { el, type, transition, children, shapeFlag } = vnode;
		if (shapeFlag & 6) {
			move(vnode.component.subTree, container, anchor, moveType);
			return;
		}
		if (shapeFlag & 128) {
			vnode.suspense.move(container, anchor, moveType);
			return;
		}
		if (shapeFlag & 64) {
			type.move(vnode, container, anchor, internals);
			return;
		}
		if (type === Fragment) {
			hostInsert(el, container, anchor);
			for (let i = 0; i < children.length; i++) move(children[i], container, anchor, moveType);
			hostInsert(vnode.anchor, container, anchor);
			return;
		}
		if (type === Static) {
			moveStaticNode(vnode, container, anchor);
			return;
		}
		if (moveType !== 2 && shapeFlag & 1 && transition) if (moveType === 0) {
			transition.beforeEnter(el);
			hostInsert(el, container, anchor);
			queuePostRenderEffect(() => transition.enter(el), parentSuspense);
		} else {
			const { leave, delayLeave, afterLeave } = transition;
			const remove2 = () => {
				if (vnode.ctx.isUnmounted) hostRemove(el);
				else hostInsert(el, container, anchor);
			};
			const performLeave = () => {
				if (el._isLeaving) el[leaveCbKey](true);
				leave(el, () => {
					remove2();
					afterLeave && afterLeave();
				});
			};
			if (delayLeave) delayLeave(el, remove2, performLeave);
			else performLeave();
		}
		else hostInsert(el, container, anchor);
	};
	const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
		const { type, props, ref, children, dynamicChildren, shapeFlag, patchFlag, dirs, cacheIndex, memo } = vnode;
		if (patchFlag === -2) optimized = false;
		if (ref != null) {
			pauseTracking();
			setRef(ref, null, parentSuspense, vnode, true);
			resetTracking();
		}
		if (cacheIndex != null) parentComponent.renderCache[cacheIndex] = void 0;
		if (shapeFlag & 256) {
			parentComponent.ctx.deactivate(vnode);
			return;
		}
		const shouldInvokeDirs = shapeFlag & 1 && dirs;
		const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
		let vnodeHook;
		if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) invokeVNodeHook(vnodeHook, parentComponent, vnode);
		if (shapeFlag & 6) unmountComponent(vnode.component, parentSuspense, doRemove);
		else {
			if (shapeFlag & 128) {
				vnode.suspense.unmount(parentSuspense, doRemove);
				return;
			}
			if (shouldInvokeDirs) invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
			if (shapeFlag & 64) vnode.type.remove(vnode, parentComponent, parentSuspense, internals, doRemove);
			else if (dynamicChildren && !dynamicChildren.hasOnce && (type !== Fragment || patchFlag > 0 && patchFlag & 64)) unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
			else if (type === Fragment && patchFlag & 384 || !optimized && shapeFlag & 16) unmountChildren(children, parentComponent, parentSuspense);
			if (doRemove) remove(vnode);
		}
		const shouldInvalidateMemo = memo != null && cacheIndex == null;
		if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs || shouldInvalidateMemo) queuePostRenderEffect(() => {
			vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
			shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
			if (shouldInvalidateMemo) vnode.el = null;
		}, parentSuspense);
	};
	const remove = (vnode) => {
		const { type, el, anchor, transition } = vnode;
		if (type === Fragment) {
			if (vnode.patchFlag > 0 && vnode.patchFlag & 2048 && transition && !transition.persisted) vnode.children.forEach((child) => {
				if (child.type === Comment) hostRemove(child.el);
				else remove(child);
			});
			else removeFragment(el, anchor);
			return;
		}
		if (type === Static) {
			removeStaticNode(vnode);
			return;
		}
		const performRemove = () => {
			hostRemove(el);
			if (transition && !transition.persisted && transition.afterLeave) transition.afterLeave();
		};
		if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
			const { leave, delayLeave } = transition;
			const performLeave = () => leave(el, performRemove);
			if (delayLeave) delayLeave(vnode.el, performRemove, performLeave);
			else performLeave();
		} else performRemove();
	};
	const removeFragment = (cur, end) => {
		let next;
		while (cur !== end) {
			next = hostNextSibling(cur);
			hostRemove(cur);
			cur = next;
		}
		hostRemove(end);
	};
	const unmountComponent = (instance, parentSuspense, doRemove) => {
		if (instance.type.__hmrId) unregisterHMR(instance);
		const { bum, scope, job, subTree, um, m, a } = instance;
		invalidateMount(m);
		invalidateMount(a);
		if (bum) invokeArrayFns(bum);
		scope.stop();
		if (job) {
			job.flags |= 8;
			unmount(subTree, instance, parentSuspense, doRemove);
		}
		if (um) queuePostRenderEffect(um, parentSuspense);
		queuePostRenderEffect(() => {
			instance.isUnmounted = true;
		}, parentSuspense);
		devtoolsComponentRemoved(instance);
	};
	const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
		for (let i = start; i < children.length; i++) unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
	};
	const getNextHostNode = (vnode) => {
		if (vnode.shapeFlag & 6) return getNextHostNode(vnode.component.subTree);
		if (vnode.shapeFlag & 128) return vnode.suspense.next();
		const el = hostNextSibling(vnode.anchor || vnode.el);
		const teleportEnd = el && el[TeleportEndKey];
		return teleportEnd ? hostNextSibling(teleportEnd) : el;
	};
	let isFlushing = false;
	const render = (vnode, container, namespace) => {
		let instance;
		if (vnode == null) {
			if (container._vnode) {
				unmount(container._vnode, null, null, true);
				instance = container._vnode.component;
			}
		} else patch(container._vnode || null, vnode, container, null, null, null, namespace);
		container._vnode = vnode;
		if (!isFlushing) {
			isFlushing = true;
			flushPreFlushCbs(instance);
			flushPostFlushCbs();
			isFlushing = false;
		}
	};
	const internals = {
		p: patch,
		um: unmount,
		m: move,
		r: remove,
		mt: mountComponent,
		mc: mountChildren,
		pc: patchChildren,
		pbc: patchBlockChildren,
		n: getNextHostNode,
		o: options
	};
	let hydrate;
	let hydrateNode;
	if (createHydrationFns) [hydrate, hydrateNode] = createHydrationFns(internals);
	return {
		render,
		hydrate,
		createApp: createAppAPI(render, hydrate)
	};
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
	return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect, job }, allowed) {
	if (allowed) {
		effect.flags |= 32;
		job.flags |= 4;
	} else {
		effect.flags &= -33;
		job.flags &= -5;
	}
}
function needTransition(parentSuspense, transition) {
	return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
	const ch1 = n1.children;
	const ch2 = n2.children;
	if (isArray(ch1) && isArray(ch2)) for (let i = 0; i < ch1.length; i++) {
		const c1 = ch1[i];
		let c2 = ch2[i];
		if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
			if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
				c2 = ch2[i] = cloneIfMounted(ch2[i]);
				c2.el = c1.el;
			}
			if (!shallow && c2.patchFlag !== -2) traverseStaticChildren(c1, c2);
		}
		if (c2.type === Text) {
			if (c2.patchFlag === -1) c2 = ch2[i] = cloneIfMounted(c2);
			c2.el = c1.el;
		}
		if (c2.type === Comment && !c2.el) c2.el = c1.el;
		c2.el && (c2.el.__vnode = c2);
	}
}
function getSequence(arr) {
	const p = arr.slice();
	const result = [0];
	let i, j, u, v, c;
	const len = arr.length;
	for (i = 0; i < len; i++) {
		const arrI = arr[i];
		if (arrI !== 0) {
			j = result[result.length - 1];
			if (arr[j] < arrI) {
				p[i] = j;
				result.push(i);
				continue;
			}
			u = 0;
			v = result.length - 1;
			while (u < v) {
				c = u + v >> 1;
				if (arr[result[c]] < arrI) u = c + 1;
				else v = c;
			}
			if (arrI < arr[result[u]]) {
				if (u > 0) p[i] = result[u - 1];
				result[u] = i;
			}
		}
	}
	u = result.length;
	v = result[u - 1];
	while (u-- > 0) {
		result[u] = v;
		v = p[v];
	}
	return result;
}
function locateNonHydratedAsyncRoot(instance) {
	const subComponent = instance.subTree.component;
	if (subComponent) if (subComponent.asyncDep && !subComponent.asyncResolved) return subComponent;
	else return locateNonHydratedAsyncRoot(subComponent);
}
function invalidateMount(hooks) {
	if (hooks) for (let i = 0; i < hooks.length; i++) hooks[i].flags |= 8;
}
function resolveAsyncComponentPlaceholder(anchorVnode) {
	if (anchorVnode.placeholder) return anchorVnode.placeholder;
	const instance = anchorVnode.component;
	if (instance) return resolveAsyncComponentPlaceholder(instance.subTree);
	return null;
}
var isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
	if (suspense && suspense.pendingBranch) if (isArray(fn)) suspense.effects.push(...fn);
	else suspense.effects.push(fn);
	else queuePostFlushCb(fn);
}
var Fragment = /* @__PURE__ */ Symbol.for("v-fgt");
var Text = /* @__PURE__ */ Symbol.for("v-txt");
var Comment = /* @__PURE__ */ Symbol.for("v-cmt");
var Static = /* @__PURE__ */ Symbol.for("v-stc");
var blockStack = [];
var currentBlock = null;
var isBlockTreeEnabled = 1;
function setBlockTracking(value, inVOnce = false) {
	isBlockTreeEnabled += value;
	if (value < 0 && currentBlock && inVOnce) currentBlock.hasOnce = true;
}
function isVNode(value) {
	return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
	if (n2.shapeFlag & 6 && n1.component) {
		const dirtyInstances = hmrDirtyComponents.get(n2.type);
		if (dirtyInstances && dirtyInstances.has(n1.component)) {
			n1.shapeFlag &= -257;
			n2.shapeFlag &= -513;
			return false;
		}
	}
	return n1.type === n2.type && n1.key === n2.key;
}
var vnodeArgsTransformer;
var createVNodeWithArgsTransform = (...args) => {
	return _createVNode(...vnodeArgsTransformer ? vnodeArgsTransformer(args, currentRenderingInstance) : args);
};
var normalizeKey = ({ key }) => key != null ? key : null;
var normalizeRef = ({ ref, ref_key, ref_for }) => {
	if (typeof ref === "number") ref = "" + ref;
	return ref != null ? isString(ref) || /* @__PURE__ */ isRef(ref) || isFunction(ref) ? {
		i: currentRenderingInstance,
		r: ref,
		k: ref_key,
		f: !!ref_for
	} : ref : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
	const vnode = {
		__v_isVNode: true,
		__v_skip: true,
		type,
		props,
		key: props && normalizeKey(props),
		ref: props && normalizeRef(props),
		scopeId: currentScopeId,
		slotScopeIds: null,
		children,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag,
		patchFlag,
		dynamicProps,
		dynamicChildren: null,
		appContext: null,
		ctx: currentRenderingInstance
	};
	if (needFullChildrenNormalization) {
		normalizeChildren(vnode, children);
		if (shapeFlag & 128) type.normalize(vnode);
	} else if (children) vnode.shapeFlag |= isString(children) ? 8 : 16;
	if (vnode.key !== vnode.key) warn$1(`VNode created with invalid key (NaN). VNode type:`, vnode.type);
	if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) currentBlock.push(vnode);
	return vnode;
}
var createVNode = createVNodeWithArgsTransform;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
	if (!type || type === NULL_DYNAMIC_COMPONENT) {
		if (!type) warn$1(`Invalid vnode type when creating vnode: ${type}.`);
		type = Comment;
	}
	if (isVNode(type)) {
		const cloned = cloneVNode(type, props, true);
		if (children) normalizeChildren(cloned, children);
		if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) if (cloned.shapeFlag & 6) currentBlock[currentBlock.indexOf(type)] = cloned;
		else currentBlock.push(cloned);
		cloned.patchFlag = -2;
		return cloned;
	}
	if (isClassComponent(type)) type = type.__vccOpts;
	if (props) {
		props = guardReactiveProps(props);
		let { class: klass, style } = props;
		if (klass && !isString(klass)) props.class = normalizeClass(klass);
		if (isObject(style)) {
			if (/* @__PURE__ */ isProxy(style) && !isArray(style)) style = extend({}, style);
			props.style = normalizeStyle(style);
		}
	}
	const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
	if (shapeFlag & 4 && /* @__PURE__ */ isProxy(type)) {
		type = /* @__PURE__ */ toRaw(type);
		warn$1(`Vue received a Component that was made a reactive object. This can lead to unnecessary performance overhead and should be avoided by marking the component with \`markRaw\` or using \`shallowRef\` instead of \`ref\`.`, `
Component that was made reactive: `, type);
	}
	return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}
function guardReactiveProps(props) {
	if (!props) return null;
	return /* @__PURE__ */ isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
	const { props, ref, patchFlag, children, transition } = vnode;
	const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
	const cloned = {
		__v_isVNode: true,
		__v_skip: true,
		type: vnode.type,
		props: mergedProps,
		key: mergedProps && normalizeKey(mergedProps),
		ref: extraProps && extraProps.ref ? mergeRef && ref ? isArray(ref) ? ref.concat(normalizeRef(extraProps)) : [ref, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref,
		scopeId: vnode.scopeId,
		slotScopeIds: vnode.slotScopeIds,
		children: patchFlag === -1 && isArray(children) ? children.map(deepCloneVNode) : children,
		target: vnode.target,
		targetStart: vnode.targetStart,
		targetAnchor: vnode.targetAnchor,
		staticCount: vnode.staticCount,
		shapeFlag: vnode.shapeFlag,
		patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
		dynamicProps: vnode.dynamicProps,
		dynamicChildren: vnode.dynamicChildren,
		appContext: vnode.appContext,
		dirs: vnode.dirs,
		transition,
		component: vnode.component,
		suspense: vnode.suspense,
		ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
		ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
		placeholder: vnode.placeholder,
		el: vnode.el,
		anchor: vnode.anchor,
		ctx: vnode.ctx,
		ce: vnode.ce
	};
	if (transition && cloneTransition) setTransitionHooks(cloned, transition.clone(cloned));
	return cloned;
}
function deepCloneVNode(vnode) {
	const cloned = cloneVNode(vnode);
	if (isArray(vnode.children)) cloned.children = vnode.children.map(deepCloneVNode);
	return cloned;
}
function createTextVNode(text = " ", flag = 0) {
	return createVNode(Text, null, text, flag);
}
function normalizeVNode(child) {
	if (child == null || typeof child === "boolean") return createVNode(Comment);
	else if (isArray(child)) return createVNode(Fragment, null, child.slice());
	else if (isVNode(child)) return cloneIfMounted(child);
	else return createVNode(Text, null, String(child));
}
function cloneIfMounted(child) {
	return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
	let type = 0;
	const { shapeFlag } = vnode;
	if (children == null) children = null;
	else if (isArray(children)) type = 16;
	else if (typeof children === "object") if (shapeFlag & 65) {
		const slot = children.default;
		if (slot) {
			slot._c && (slot._d = false);
			normalizeChildren(vnode, slot());
			slot._c && (slot._d = true);
		}
		return;
	} else {
		type = 32;
		const slotFlag = children._;
		if (!slotFlag && !isInternalObject(children)) children._ctx = currentRenderingInstance;
		else if (slotFlag === 3 && currentRenderingInstance) if (currentRenderingInstance.slots._ === 1) children._ = 1;
		else {
			children._ = 2;
			vnode.patchFlag |= 1024;
		}
	}
	else if (isFunction(children)) {
		children = {
			default: children,
			_ctx: currentRenderingInstance
		};
		type = 32;
	} else {
		children = String(children);
		if (shapeFlag & 64) {
			type = 16;
			children = [createTextVNode(children)];
		} else type = 8;
	}
	vnode.children = children;
	vnode.shapeFlag |= type;
}
function mergeProps(...args) {
	const ret = {};
	for (let i = 0; i < args.length; i++) {
		const toMerge = args[i];
		for (const key in toMerge) if (key === "class") {
			if (ret.class !== toMerge.class) ret.class = normalizeClass([ret.class, toMerge.class]);
		} else if (key === "style") ret.style = normalizeStyle([ret.style, toMerge.style]);
		else if (isOn(key)) {
			const existing = ret[key];
			const incoming = toMerge[key];
			if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) ret[key] = existing ? [].concat(existing, incoming) : incoming;
			else if (incoming == null && existing == null && !isModelListener(key)) ret[key] = incoming;
		} else if (key !== "") ret[key] = toMerge[key];
	}
	return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
	callWithAsyncErrorHandling(hook, instance, 7, [vnode, prevVNode]);
}
var emptyAppContext = createAppContext();
var uid = 0;
function createComponentInstance(vnode, parent, suspense) {
	const type = vnode.type;
	const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
	const instance = {
		uid: uid++,
		vnode,
		type,
		parent,
		appContext,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new EffectScope(true),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: parent ? parent.provides : Object.create(appContext.provides),
		ids: parent ? parent.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: normalizePropsOptions(type, appContext),
		emitsOptions: normalizeEmitsOptions(type, appContext),
		emit: null,
		emitted: null,
		propsDefaults: EMPTY_OBJ,
		inheritAttrs: type.inheritAttrs,
		ctx: EMPTY_OBJ,
		data: EMPTY_OBJ,
		props: EMPTY_OBJ,
		attrs: EMPTY_OBJ,
		slots: EMPTY_OBJ,
		refs: EMPTY_OBJ,
		setupState: EMPTY_OBJ,
		setupContext: null,
		suspense,
		suspenseId: suspense ? suspense.pendingId : 0,
		asyncDep: null,
		asyncResolved: false,
		isMounted: false,
		isUnmounted: false,
		isDeactivated: false,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	instance.ctx = createDevRenderContext(instance);
	instance.root = parent ? parent.root : instance;
	instance.emit = emit.bind(null, instance);
	if (vnode.ce) vnode.ce(instance);
	return instance;
}
var currentInstance = null;
var getCurrentInstance = () => currentInstance || currentRenderingInstance;
var internalSetCurrentInstance;
var setInSSRSetupState;
{
	const g = getGlobalThis();
	const registerGlobalSetter = (key, setter) => {
		let setters;
		if (!(setters = g[key])) setters = g[key] = [];
		setters.push(setter);
		return (v) => {
			if (setters.length > 1) setters.forEach((set) => set(v));
			else setters[0](v);
		};
	};
	internalSetCurrentInstance = registerGlobalSetter(`__VUE_INSTANCE_SETTERS__`, (v) => currentInstance = v);
	setInSSRSetupState = registerGlobalSetter(`__VUE_SSR_SETTERS__`, (v) => isInSSRComponentSetup = v);
}
var setCurrentInstance = (instance) => {
	const prev = currentInstance;
	internalSetCurrentInstance(instance);
	instance.scope.on();
	return () => {
		instance.scope.off();
		internalSetCurrentInstance(prev);
	};
};
var unsetCurrentInstance = () => {
	currentInstance && currentInstance.scope.off();
	internalSetCurrentInstance(null);
};
var isBuiltInTag = /* @__PURE__ */ makeMap("slot,component");
function validateComponentName(name, { isNativeTag }) {
	if (isBuiltInTag(name) || isNativeTag(name)) warn$1("Do not use built-in or reserved HTML elements as component id: " + name);
}
function isStatefulComponent(instance) {
	return instance.vnode.shapeFlag & 4;
}
var isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false, optimized = false) {
	isSSR && setInSSRSetupState(isSSR);
	const { props, children } = instance.vnode;
	const isStateful = isStatefulComponent(instance);
	initProps(instance, props, isStateful, isSSR);
	initSlots(instance, children, optimized || isSSR);
	const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
	isSSR && setInSSRSetupState(false);
	return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
	const Component = instance.type;
	if (Component.name) validateComponentName(Component.name, instance.appContext.config);
	if (Component.components) {
		const names = Object.keys(Component.components);
		for (let i = 0; i < names.length; i++) validateComponentName(names[i], instance.appContext.config);
	}
	if (Component.directives) {
		const names = Object.keys(Component.directives);
		for (let i = 0; i < names.length; i++) validateDirectiveName(names[i]);
	}
	if (Component.compilerOptions && isRuntimeOnly()) warn$1(`"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.`);
	instance.accessCache = /* @__PURE__ */ Object.create(null);
	instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
	exposePropsOnRenderContext(instance);
	const { setup } = Component;
	if (setup) {
		pauseTracking();
		const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
		const reset = setCurrentInstance(instance);
		const setupResult = callWithErrorHandling(setup, instance, 0, [/* @__PURE__ */ shallowReadonly(instance.props), setupContext]);
		const isAsyncSetup = isPromise(setupResult);
		resetTracking();
		reset();
		if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) markAsyncBoundary(instance);
		if (isAsyncSetup) {
			setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
			if (isSSR) return setupResult.then((resolvedResult) => {
				handleSetupResult(instance, resolvedResult, isSSR);
			}).catch((e) => {
				handleError(e, instance, 0);
			});
			else {
				instance.asyncDep = setupResult;
				if (!instance.suspense) warn$1(`Component <${formatComponentName(instance, Component)}>: setup function returned a promise, but no <Suspense> boundary was found in the parent component tree. A component with async setup() must be nested in a <Suspense> in order to be rendered.`);
			}
		} else handleSetupResult(instance, setupResult, isSSR);
	} else finishComponentSetup(instance, isSSR);
}
function handleSetupResult(instance, setupResult, isSSR) {
	if (isFunction(setupResult)) if (instance.type.__ssrInlineRender) instance.ssrRender = setupResult;
	else instance.render = setupResult;
	else if (isObject(setupResult)) {
		if (isVNode(setupResult)) warn$1(`setup() should not return VNodes directly - return a render function instead.`);
		instance.devtoolsRawSetupState = setupResult;
		instance.setupState = proxyRefs(setupResult);
		exposeSetupStateOnRenderContext(instance);
	} else if (setupResult !== void 0) warn$1(`setup() should return an object. Received: ${setupResult === null ? "null" : typeof setupResult}`);
	finishComponentSetup(instance, isSSR);
}
var compile;
var installWithProxy;
var isRuntimeOnly = () => !compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
	const Component = instance.type;
	if (!instance.render) {
		if (!isSSR && compile && !Component.render) {
			const template = Component.template || __VUE_OPTIONS_API__ && resolveMergedOptions(instance).template;
			if (template) {
				startMeasure(instance, `compile`);
				const { isCustomElement, compilerOptions } = instance.appContext.config;
				const { delimiters, compilerOptions: componentCompilerOptions } = Component;
				Component.render = compile(template, extend(extend({
					isCustomElement,
					delimiters
				}, compilerOptions), componentCompilerOptions));
				endMeasure(instance, `compile`);
			}
		}
		instance.render = Component.render || NOOP;
		if (installWithProxy) installWithProxy(instance);
	}
	if (__VUE_OPTIONS_API__ && true) {
		const reset = setCurrentInstance(instance);
		pauseTracking();
		try {
			applyOptions(instance);
		} finally {
			resetTracking();
			reset();
		}
	}
	if (!Component.render && instance.render === NOOP && !isSSR) if (!compile && Component.template) warn$1("Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias \"vue\" to \"vue/dist/vue.esm-bundler.js\".");
	else warn$1(`Component is missing template or render function: `, Component);
}
var attrsProxyHandlers = {
	get(target, key) {
		markAttrsAccessed();
		track(target, "get", "");
		return target[key];
	},
	set() {
		warn$1(`setupContext.attrs is readonly.`);
		return false;
	},
	deleteProperty() {
		warn$1(`setupContext.attrs is readonly.`);
		return false;
	}
};
function getSlotsProxy(instance) {
	return new Proxy(instance.slots, { get(target, key) {
		track(instance, "get", "$slots");
		return target[key];
	} });
}
function createSetupContext(instance) {
	const expose = (exposed) => {
		if (instance.exposed) warn$1(`expose() should be called only once per setup().`);
		if (exposed != null) {
			let exposedType = typeof exposed;
			if (exposedType === "object") {
				if (isArray(exposed)) exposedType = "array";
				else if (/* @__PURE__ */ isRef(exposed)) exposedType = "ref";
			}
			if (exposedType !== "object") warn$1(`expose() should be passed a plain object, received ${exposedType}.`);
		}
		instance.exposed = exposed || {};
	};
	{
		let attrsProxy;
		let slotsProxy;
		return Object.freeze({
			get attrs() {
				return attrsProxy || (attrsProxy = new Proxy(instance.attrs, attrsProxyHandlers));
			},
			get slots() {
				return slotsProxy || (slotsProxy = getSlotsProxy(instance));
			},
			get emit() {
				return (event, ...args) => instance.emit(event, ...args);
			},
			expose
		});
	}
}
function getComponentPublicInstance(instance) {
	if (instance.exposed) return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
		get(target, key) {
			if (key in target) return target[key];
			else if (key in publicPropertiesMap) return publicPropertiesMap[key](instance);
		},
		has(target, key) {
			return key in target || key in publicPropertiesMap;
		}
	}));
	else return instance.proxy;
}
var classifyRE = /(?:^|[-_])\w/g;
var classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component, includeInferred = true) {
	return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
	let name = getComponentName(Component);
	if (!name && Component.__file) {
		const match = Component.__file.match(/([^/\\]+)\.\w+$/);
		if (match) name = match[1];
	}
	if (!name && instance) {
		const inferFromRegistry = (registry) => {
			for (const key in registry) if (registry[key] === Component) return key;
		};
		name = inferFromRegistry(instance.components) || instance.parent && inferFromRegistry(instance.parent.type.components) || inferFromRegistry(instance.appContext.components);
	}
	return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
	return isFunction(value) && "__vccOpts" in value;
}
var computed = (getterOrOptions, debugOptions) => {
	const c = /* @__PURE__ */ computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
	{
		const i = getCurrentInstance();
		if (i && i.appContext.config.warnRecursiveComputed) c._warnRecursive = true;
	}
	return c;
};
function h(type, propsOrChildren, children) {
	try {
		setBlockTracking(-1);
		const l = arguments.length;
		if (l === 2) if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
			if (isVNode(propsOrChildren)) return createVNode(type, null, [propsOrChildren]);
			return createVNode(type, propsOrChildren);
		} else return createVNode(type, null, propsOrChildren);
		else {
			if (l > 3) children = Array.prototype.slice.call(arguments, 2);
			else if (l === 3 && isVNode(children)) children = [children];
			return createVNode(type, propsOrChildren, children);
		}
	} finally {
		setBlockTracking(1);
	}
}
function initCustomFormatter() {
	if (typeof window === "undefined") return;
	const vueStyle = { style: "color:#3ba776" };
	const numberStyle = { style: "color:#1677ff" };
	const stringStyle = { style: "color:#f5222d" };
	const keywordStyle = { style: "color:#eb2f96" };
	const formatter = {
		__vue_custom_formatter: true,
		header(obj) {
			if (!isObject(obj)) return null;
			if (obj.__isVue) return [
				"div",
				vueStyle,
				`VueInstance`
			];
			else if (/* @__PURE__ */ isRef(obj)) {
				pauseTracking();
				const value = obj.value;
				resetTracking();
				return [
					"div",
					{},
					[
						"span",
						vueStyle,
						genRefFlag(obj)
					],
					"<",
					formatValue(value),
					`>`
				];
			} else if (/* @__PURE__ */ isReactive(obj)) return [
				"div",
				{},
				[
					"span",
					vueStyle,
					/* @__PURE__ */ isShallow(obj) ? "ShallowReactive" : "Reactive"
				],
				"<",
				formatValue(obj),
				`>${/* @__PURE__ */ isReadonly(obj) ? ` (readonly)` : ``}`
			];
			else if (/* @__PURE__ */ isReadonly(obj)) return [
				"div",
				{},
				[
					"span",
					vueStyle,
					/* @__PURE__ */ isShallow(obj) ? "ShallowReadonly" : "Readonly"
				],
				"<",
				formatValue(obj),
				">"
			];
			return null;
		},
		hasBody(obj) {
			return obj && obj.__isVue;
		},
		body(obj) {
			if (obj && obj.__isVue) return [
				"div",
				{},
				...formatInstance(obj.$)
			];
		}
	};
	function formatInstance(instance) {
		const blocks = [];
		if (instance.type.props && instance.props) blocks.push(createInstanceBlock("props", /* @__PURE__ */ toRaw(instance.props)));
		if (instance.setupState !== EMPTY_OBJ) blocks.push(createInstanceBlock("setup", instance.setupState));
		if (instance.data !== EMPTY_OBJ) blocks.push(createInstanceBlock("data", /* @__PURE__ */ toRaw(instance.data)));
		const computed = extractKeys(instance, "computed");
		if (computed) blocks.push(createInstanceBlock("computed", computed));
		const injected = extractKeys(instance, "inject");
		if (injected) blocks.push(createInstanceBlock("injected", injected));
		blocks.push([
			"div",
			{},
			[
				"span",
				{ style: keywordStyle.style + ";opacity:0.66" },
				"$ (internal): "
			],
			["object", { object: instance }]
		]);
		return blocks;
	}
	function createInstanceBlock(type, target) {
		target = extend({}, target);
		if (!Object.keys(target).length) return ["span", {}];
		return [
			"div",
			{ style: "line-height:1.25em;margin-bottom:0.6em" },
			[
				"div",
				{ style: "color:#476582" },
				type
			],
			[
				"div",
				{ style: "padding-left:1.25em" },
				...Object.keys(target).map((key) => {
					return [
						"div",
						{},
						[
							"span",
							keywordStyle,
							key + ": "
						],
						formatValue(target[key], false)
					];
				})
			]
		];
	}
	function formatValue(v, asRaw = true) {
		if (typeof v === "number") return [
			"span",
			numberStyle,
			v
		];
		else if (typeof v === "string") return [
			"span",
			stringStyle,
			JSON.stringify(v)
		];
		else if (typeof v === "boolean") return [
			"span",
			keywordStyle,
			v
		];
		else if (isObject(v)) return ["object", { object: asRaw ? /* @__PURE__ */ toRaw(v) : v }];
		else return [
			"span",
			stringStyle,
			String(v)
		];
	}
	function extractKeys(instance, type) {
		const Comp = instance.type;
		if (isFunction(Comp)) return;
		const extracted = {};
		for (const key in instance.ctx) if (isKeyOfType(Comp, key, type)) extracted[key] = instance.ctx[key];
		return extracted;
	}
	function isKeyOfType(Comp, key, type) {
		const opts = Comp[type];
		if (isArray(opts) && opts.includes(key) || isObject(opts) && key in opts) return true;
		if (Comp.extends && isKeyOfType(Comp.extends, key, type)) return true;
		if (Comp.mixins && Comp.mixins.some((m) => isKeyOfType(m, key, type))) return true;
	}
	function genRefFlag(v) {
		if (/* @__PURE__ */ isShallow(v)) return `ShallowRef`;
		if (v.effect) return `ComputedRef`;
		return `Ref`;
	}
	if (window.devtoolsFormatters) window.devtoolsFormatters.push(formatter);
	else window.devtoolsFormatters = [formatter];
}
var version = "3.5.34";
var warn = warn$1;
//#endregion
//#region node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js
/**
* @vue/runtime-dom v3.5.34
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
var policy = void 0;
var tt = typeof window !== "undefined" && window.trustedTypes;
if (tt) try {
	policy = /* @__PURE__ */ tt.createPolicy("vue", { createHTML: (val) => val });
} catch (e) {
	warn(`Error creating trusted types policy: ${e}`);
}
var unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
var svgNS = "http://www.w3.org/2000/svg";
var mathmlNS = "http://www.w3.org/1998/Math/MathML";
var doc = typeof document !== "undefined" ? document : null;
var templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
var nodeOps = {
	insert: (child, parent, anchor) => {
		parent.insertBefore(child, anchor || null);
	},
	remove: (child) => {
		const parent = child.parentNode;
		if (parent) parent.removeChild(child);
	},
	createElement: (tag, namespace, is, props) => {
		const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
		if (tag === "select" && props && props.multiple != null) el.setAttribute("multiple", props.multiple);
		return el;
	},
	createText: (text) => doc.createTextNode(text),
	createComment: (text) => doc.createComment(text),
	setText: (node, text) => {
		node.nodeValue = text;
	},
	setElementText: (el, text) => {
		el.textContent = text;
	},
	parentNode: (node) => node.parentNode,
	nextSibling: (node) => node.nextSibling,
	querySelector: (selector) => doc.querySelector(selector),
	setScopeId(el, id) {
		el.setAttribute(id, "");
	},
	insertStaticContent(content, parent, anchor, namespace, start, end) {
		const before = anchor ? anchor.previousSibling : parent.lastChild;
		if (start && (start === end || start.nextSibling)) while (true) {
			parent.insertBefore(start.cloneNode(true), anchor);
			if (start === end || !(start = start.nextSibling)) break;
		}
		else {
			templateContainer.innerHTML = unsafeToTrustedHTML(namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content);
			const template = templateContainer.content;
			if (namespace === "svg" || namespace === "mathml") {
				const wrapper = template.firstChild;
				while (wrapper.firstChild) template.appendChild(wrapper.firstChild);
				template.removeChild(wrapper);
			}
			parent.insertBefore(template, anchor);
		}
		return [before ? before.nextSibling : parent.firstChild, anchor ? anchor.previousSibling : parent.lastChild];
	}
};
var vtcKey = /* @__PURE__ */ Symbol("_vtc");
function patchClass(el, value, isSVG) {
	const transitionClasses = el[vtcKey];
	if (transitionClasses) value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
	if (value == null) el.removeAttribute("class");
	else if (isSVG) el.setAttribute("class", value);
	else el.className = value;
}
var vShowOriginalDisplay = /* @__PURE__ */ Symbol("_vod");
var vShowHidden = /* @__PURE__ */ Symbol("_vsh");
var CSS_VAR_TEXT = /* @__PURE__ */ Symbol("CSS_VAR_TEXT");
var displayRE = /(?:^|;)\s*display\s*:/;
function patchStyle(el, prev, next) {
	const style = el.style;
	const isCssString = isString(next);
	let hasControlledDisplay = false;
	if (next && !isCssString) {
		if (prev) if (!isString(prev)) {
			for (const key in prev) if (next[key] == null) setStyle(style, key, "");
		} else for (const prevStyle of prev.split(";")) {
			const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
			if (next[key] == null) setStyle(style, key, "");
		}
		for (const key in next) {
			if (key === "display") hasControlledDisplay = true;
			const value = next[key];
			if (value != null) {
				if (!shouldPreserveTextareaResizeStyle(el, key, !isString(prev) && prev ? prev[key] : void 0, value)) setStyle(style, key, value);
			} else setStyle(style, key, "");
		}
	} else if (isCssString) {
		if (prev !== next) {
			const cssVarText = style[CSS_VAR_TEXT];
			if (cssVarText) next += ";" + cssVarText;
			style.cssText = next;
			hasControlledDisplay = displayRE.test(next);
		}
	} else if (prev) el.removeAttribute("style");
	if (vShowOriginalDisplay in el) {
		el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
		if (el[vShowHidden]) style.display = "none";
	}
}
var semicolonRE = /[^\\];\s*$/;
var importantRE = /\s*!important$/;
function setStyle(style, name, val) {
	if (isArray(val)) val.forEach((v) => setStyle(style, name, v));
	else {
		if (val == null) val = "";
		if (semicolonRE.test(val)) warn(`Unexpected semicolon at the end of '${name}' style value: '${val}'`);
		if (name.startsWith("--")) style.setProperty(name, val);
		else {
			const prefixed = autoPrefix(style, name);
			if (importantRE.test(val)) style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
			else style[prefixed] = val;
		}
	}
}
var prefixes = [
	"Webkit",
	"Moz",
	"ms"
];
var prefixCache = {};
function autoPrefix(style, rawName) {
	const cached = prefixCache[rawName];
	if (cached) return cached;
	let name = camelize(rawName);
	if (name !== "filter" && name in style) return prefixCache[rawName] = name;
	name = capitalize(name);
	for (let i = 0; i < prefixes.length; i++) {
		const prefixed = prefixes[i] + name;
		if (prefixed in style) return prefixCache[rawName] = prefixed;
	}
	return rawName;
}
function shouldPreserveTextareaResizeStyle(el, key, prev, next) {
	return el.tagName === "TEXTAREA" && (key === "width" || key === "height") && isString(next) && prev === next;
}
var xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
	if (isSVG && key.startsWith("xlink:")) if (value == null) el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
	else el.setAttributeNS(xlinkNS, key, value);
	else if (value == null || isBoolean && !includeBooleanAttr(value)) el.removeAttribute(key);
	else el.setAttribute(key, isBoolean ? "" : isSymbol(value) ? String(value) : value);
}
function patchDOMProp(el, key, value, parentComponent, attrName) {
	if (key === "innerHTML" || key === "textContent") {
		if (value != null) el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
		return;
	}
	const tag = el.tagName;
	if (key === "value" && tag !== "PROGRESS" && !tag.includes("-")) {
		const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
		const newValue = value == null ? el.type === "checkbox" ? "on" : "" : String(value);
		if (oldValue !== newValue || !("_value" in el)) el.value = newValue;
		if (value == null) el.removeAttribute(key);
		el._value = value;
		return;
	}
	let needRemove = false;
	if (value === "" || value == null) {
		const type = typeof el[key];
		if (type === "boolean") value = includeBooleanAttr(value);
		else if (value == null && type === "string") {
			value = "";
			needRemove = true;
		} else if (type === "number") {
			value = 0;
			needRemove = true;
		}
	}
	try {
		el[key] = value;
	} catch (e) {
		if (!needRemove) warn(`Failed setting prop "${key}" on <${tag.toLowerCase()}>: value ${value} is invalid.`, e);
	}
	needRemove && el.removeAttribute(attrName || key);
}
function addEventListener(el, event, handler, options) {
	el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
	el.removeEventListener(event, handler, options);
}
var veiKey = /* @__PURE__ */ Symbol("_vei");
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
	const invokers = el[veiKey] || (el[veiKey] = {});
	const existingInvoker = invokers[rawName];
	if (nextValue && existingInvoker) existingInvoker.value = sanitizeEventValue(nextValue, rawName);
	else {
		const [name, options] = parseName(rawName);
		if (nextValue) addEventListener(el, name, invokers[rawName] = createInvoker(sanitizeEventValue(nextValue, rawName), instance), options);
		else if (existingInvoker) {
			removeEventListener(el, name, existingInvoker, options);
			invokers[rawName] = void 0;
		}
	}
}
var optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
	let options;
	if (optionsModifierRE.test(name)) {
		options = {};
		let m;
		while (m = name.match(optionsModifierRE)) {
			name = name.slice(0, name.length - m[0].length);
			options[m[0].toLowerCase()] = true;
		}
	}
	return [name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2)), options];
}
var cachedNow = 0;
var p = /* @__PURE__ */ Promise.resolve();
var getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
	const invoker = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= invoker.attached) return;
		callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance, 5, [e]);
	};
	invoker.value = initialValue;
	invoker.attached = getNow();
	return invoker;
}
function sanitizeEventValue(value, propName) {
	if (isFunction(value) || isArray(value)) return value;
	warn(`Wrong type passed as event handler to ${propName} - did you forget @ or : in front of your prop?
Expected function or array of functions, received type ${typeof value}.`);
	return NOOP;
}
function patchStopImmediatePropagation(e, value) {
	if (isArray(value)) {
		const originalStop = e.stopImmediatePropagation;
		e.stopImmediatePropagation = () => {
			originalStop.call(e);
			e._stopped = true;
		};
		return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
	} else return value;
}
var isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
var patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
	const isSVG = namespace === "svg";
	if (key === "class") patchClass(el, nextValue, isSVG);
	else if (key === "style") patchStyle(el, prevValue, nextValue);
	else if (isOn(key)) {
		if (!isModelListener(key)) patchEvent(el, key, prevValue, nextValue, parentComponent);
	} else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
		patchDOMProp(el, key, nextValue);
		if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
	} else if (el._isVueCE && (shouldSetAsPropForVueCE(el, key) || el._def.__asyncLoader && (/[A-Z]/.test(key) || !isString(nextValue)))) patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
	else {
		if (key === "true-value") el._trueValue = nextValue;
		else if (key === "false-value") el._falseValue = nextValue;
		patchAttr(el, key, nextValue, isSVG);
	}
};
function shouldSetAsProp(el, key, value, isSVG) {
	if (isSVG) {
		if (key === "innerHTML" || key === "textContent") return true;
		if (key in el && isNativeOn(key) && isFunction(value)) return true;
		return false;
	}
	if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") return false;
	if (key === "sandbox" && el.tagName === "IFRAME") return false;
	if (key === "form") return false;
	if (key === "list" && el.tagName === "INPUT") return false;
	if (key === "type" && el.tagName === "TEXTAREA") return false;
	if (key === "width" || key === "height") {
		const tag = el.tagName;
		if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") return false;
	}
	if (isNativeOn(key) && isString(value)) return false;
	return key in el;
}
function shouldSetAsPropForVueCE(el, key) {
	const props = el._def.props;
	if (!props) return false;
	const camelKey = camelize(key);
	return Array.isArray(props) ? props.some((prop) => camelize(prop) === camelKey) : Object.keys(props).some((prop) => camelize(prop) === camelKey);
}
var rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
var renderer;
var enabledHydration = false;
function ensureRenderer() {
	return renderer || (renderer = createRenderer(rendererOptions));
}
function ensureHydrationRenderer() {
	renderer = enabledHydration ? renderer : createHydrationRenderer(rendererOptions);
	enabledHydration = true;
	return renderer;
}
var createApp = ((...args) => {
	const app = ensureRenderer().createApp(...args);
	injectNativeTagCheck(app);
	injectCompilerOptionsCheck(app);
	const { mount } = app;
	app.mount = (containerOrSelector) => {
		const container = normalizeContainer(containerOrSelector);
		if (!container) return;
		const component = app._component;
		if (!isFunction(component) && !component.render && !component.template) component.template = container.innerHTML;
		if (container.nodeType === 1) container.textContent = "";
		const proxy = mount(container, false, resolveRootNamespace(container));
		if (container instanceof Element) {
			container.removeAttribute("v-cloak");
			container.setAttribute("data-v-app", "");
		}
		return proxy;
	};
	return app;
});
var createSSRApp = ((...args) => {
	const app = ensureHydrationRenderer().createApp(...args);
	injectNativeTagCheck(app);
	injectCompilerOptionsCheck(app);
	const { mount } = app;
	app.mount = (containerOrSelector) => {
		const container = normalizeContainer(containerOrSelector);
		if (container) return mount(container, true, resolveRootNamespace(container));
	};
	return app;
});
function resolveRootNamespace(container) {
	if (container instanceof SVGElement) return "svg";
	if (typeof MathMLElement === "function" && container instanceof MathMLElement) return "mathml";
}
function injectNativeTagCheck(app) {
	Object.defineProperty(app.config, "isNativeTag", {
		value: (tag) => isHTMLTag(tag) || isSVGTag(tag) || isMathMLTag(tag),
		writable: false
	});
}
function injectCompilerOptionsCheck(app) {
	if (isRuntimeOnly()) {
		const isCustomElement = app.config.isCustomElement;
		Object.defineProperty(app.config, "isCustomElement", {
			get() {
				return isCustomElement;
			},
			set() {
				warn(`The \`isCustomElement\` config option is deprecated. Use \`compilerOptions.isCustomElement\` instead.`);
			}
		});
		const compilerOptions = app.config.compilerOptions;
		const msg = `The \`compilerOptions\` config option is only respected when using a build of Vue.js that includes the runtime compiler (aka "full build"). Since you are using the runtime-only build, \`compilerOptions\` must be passed to \`@vue/compiler-dom\` in the build setup instead.
- For vue-loader: pass it via vue-loader's \`compilerOptions\` loader option.
- For vue-cli: see https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader
- For vite: pass it via @vitejs/plugin-vue options. See https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-sfc`;
		Object.defineProperty(app.config, "compilerOptions", {
			get() {
				warn(msg);
				return compilerOptions;
			},
			set() {
				warn(msg);
			}
		});
	}
}
function normalizeContainer(container) {
	if (isString(container)) {
		const res = document.querySelector(container);
		if (!res) warn(`Failed to mount app: mount target selector "${container}" returned null.`);
		return res;
	}
	if (window.ShadowRoot && container instanceof window.ShadowRoot && container.mode === "closed") warn(`mounting on a ShadowRoot with \`{mode: "closed"}\` may lead to unpredictable bugs`);
	return container;
}
//#endregion
//#region node_modules/vue/dist/vue.runtime.esm-bundler.js
/**
* vue v3.5.34
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/
function initDev() {
	initCustomFormatter();
}
initDev();
//#endregion
//#region node_modules/@inertiajs/vue3/dist/index.js
var store = createLayoutPropsStore();
var state = /* @__PURE__ */ ref(store.get());
store.subscribe(() => {
	state.value = store.get();
});
function setLayoutProps(nameOrProps, props) {
	if (typeof nameOrProps === "string") store.setFor(nameOrProps, props);
	else store.set(nameOrProps);
}
function resetLayoutProps() {
	store.reset();
	state.value = store.get();
}
var remember_default = { created() {
	if (!this.$options.remember) return;
	if (Array.isArray(this.$options.remember)) this.$options.remember = { data: this.$options.remember };
	if (typeof this.$options.remember === "string") this.$options.remember = { data: [this.$options.remember] };
	if (typeof this.$options.remember.data === "string") this.$options.remember = { data: [this.$options.remember.data] };
	const rememberKey = this.$options.remember.key instanceof Function ? this.$options.remember.key.call(this) : this.$options.remember.key;
	const restored = router.restore(rememberKey);
	const rememberable = this.$options.remember.data.filter((key2) => {
		return !(this[key2] !== null && typeof this[key2] === "object" && this[key2].__rememberable === false);
	});
	const hasCallbacks = (key2) => {
		return this[key2] !== null && typeof this[key2] === "object" && typeof this[key2].__remember === "function" && typeof this[key2].__restore === "function";
	};
	rememberable.forEach((key2) => {
		if (this[key2] !== void 0 && restored !== void 0 && restored[key2] !== void 0) hasCallbacks(key2) ? this[key2].__restore(restored[key2]) : this[key2] = restored[key2];
		this.$watch(key2, () => {
			router.remember(rememberable.reduce((data, key3) => ({
				...data,
				[key3]: cloneDeep$1(hasCallbacks(key3) ? this[key3].__remember() : this[key3])
			}), {}), rememberKey);
		}, {
			immediate: true,
			deep: true
		});
	});
} };
function useFormState(options) {
	const { data: dataOption, rememberKey } = options;
	let { precognitionEndpoint } = options;
	const isDataFunction = typeof dataOption === "function";
	const resolveData = () => isDataFunction ? dataOption() : dataOption;
	const restored = rememberKey ? router.restore(rememberKey) : null;
	let defaults = cloneDeep$1(restored?.data ?? cloneDeep$1(resolveData()));
	let transform = (data) => data;
	let validatorRef = null;
	let withAllErrors = null;
	const withAllErrorsEnabled = () => withAllErrors ?? config.get("form.withAllErrors");
	let recentlySuccessfulTimeoutId;
	let defaultsCalledInOnSuccess = false;
	let rememberExcludeKeys = [];
	const typedForm = /* @__PURE__ */ reactive({
		...cloneDeep$1(defaults),
		isDirty: false,
		errors: {},
		hasErrors: false,
		processing: false,
		progress: null,
		wasSuccessful: false,
		recentlySuccessful: false,
		withPrecognition(...args) {
			precognitionEndpoint = UseFormUtils.createWayfinderCallback(...args);
			const formWithPrecognition = this;
			const validator = createValidator((client) => {
				const { method, url } = precognitionEndpoint();
				const transformedData = cloneDeep$1(transform(this.data()));
				return client[method](url, transformedData);
			}, cloneDeep$1(defaults));
			validatorRef = validator;
			validator.on("validatingChanged", () => {
				formWithPrecognition.validating = validator.validating();
			}).on("validatedChanged", () => {
				formWithPrecognition.__valid = validator.valid();
			}).on("touchedChanged", () => {
				formWithPrecognition.__touched = validator.touched();
			}).on("errorsChanged", () => {
				const validationErrors = withAllErrorsEnabled() ? validator.errors() : toSimpleValidationErrors(validator.errors());
				this.errors = {};
				this.setError(validationErrors);
				formWithPrecognition.__valid = validator.valid();
			});
			const tap = (value, callback) => {
				callback(value);
				return value;
			};
			Object.assign(formWithPrecognition, {
				__touched: [],
				__valid: [],
				validating: false,
				validator: () => validator,
				withAllErrors: () => tap(formWithPrecognition, () => withAllErrors = true),
				valid: (field) => formWithPrecognition.__valid.includes(field),
				invalid: (field) => field in this.errors,
				setValidationTimeout: (duration) => tap(formWithPrecognition, () => validator.setTimeout(duration)),
				validateFiles: () => tap(formWithPrecognition, () => validator.validateFiles()),
				withoutFileValidation: () => tap(formWithPrecognition, () => validator.withoutFileValidation()),
				touch: (field, ...fields) => {
					if (Array.isArray(field)) validator.touch(field);
					else if (typeof field === "string") validator.touch([field, ...fields]);
					else validator.touch(field);
					return formWithPrecognition;
				},
				touched: (field) => typeof field === "string" ? formWithPrecognition.__touched.includes(field) : formWithPrecognition.__touched.length > 0,
				validate: (field, config3) => {
					if (typeof field === "object" && !("target" in field)) {
						config3 = field;
						field = void 0;
					}
					if (field === void 0) validator.validate(config3);
					else {
						const fieldName = resolveName(field);
						const transformedData = transform(this.data());
						validator.validate(fieldName, get(transformedData, fieldName), config3);
					}
					return formWithPrecognition;
				},
				setErrors: (errors) => tap(formWithPrecognition, () => this.setError(errors)),
				forgetError: (field) => tap(formWithPrecognition, () => this.clearErrors(resolveName(field)))
			});
			return formWithPrecognition;
		},
		data() {
			return Object.keys(defaults).reduce((carry, key2) => {
				return set(carry, key2, get(this, key2));
			}, {});
		},
		transform(callback) {
			transform = callback;
			return this;
		},
		defaults(fieldOrFields, maybeValue) {
			if (isDataFunction) throw new Error("You cannot call `defaults()` when using a function to define your form data.");
			defaultsCalledInOnSuccess = true;
			if (typeof fieldOrFields === "undefined") {
				defaults = cloneDeep$1(this.data());
				this.isDirty = false;
			} else defaults = typeof fieldOrFields === "string" ? set(cloneDeep$1(defaults), fieldOrFields, maybeValue) : Object.assign({}, cloneDeep$1(defaults), fieldOrFields);
			validatorRef?.defaults(defaults);
			return this;
		},
		reset(...fields) {
			const clonedData = cloneDeep$1(isDataFunction ? cloneDeep$1(resolveData()) : defaults);
			if (fields.length === 0) {
				if (isDataFunction) defaults = clonedData;
				Object.assign(this, clonedData);
			} else fields.filter((key2) => has(clonedData, key2)).forEach((key2) => {
				if (isDataFunction) set(defaults, key2, get(clonedData, key2));
				set(this, key2, get(clonedData, key2));
			});
			validatorRef?.reset(...fields);
			return this;
		},
		setError(fieldOrFields, maybeValue) {
			const errors = typeof fieldOrFields === "string" ? { [fieldOrFields]: maybeValue } : fieldOrFields;
			Object.assign(this.errors, errors);
			this.hasErrors = Object.keys(this.errors).length > 0;
			validatorRef?.setErrors(errors);
			return this;
		},
		clearErrors(...fields) {
			this.errors = Object.keys(this.errors).reduce((carry, field) => ({
				...carry,
				...fields.length > 0 && !fields.includes(field) ? { [field]: this.errors[field] } : {}
			}), {});
			this.hasErrors = Object.keys(this.errors).length > 0;
			if (validatorRef) if (fields.length === 0) validatorRef.setErrors({});
			else fields.forEach(validatorRef.forgetError);
			return this;
		},
		resetAndClearErrors(...fields) {
			this.reset(...fields);
			this.clearErrors(...fields);
			return this;
		},
		__rememberable: rememberKey === null,
		__remember() {
			const formData = this.data();
			if (rememberExcludeKeys.length > 0) {
				const filtered = { ...formData };
				rememberExcludeKeys.forEach((k) => delete filtered[k]);
				return {
					data: filtered,
					errors: this.errors
				};
			}
			return {
				data: formData,
				errors: this.errors
			};
		},
		__restore(restored2) {
			Object.assign(this, restored2.data);
			this.setError(restored2.errors);
		}
	});
	if (restored?.errors) typedForm.setError(restored.errors);
	watch(typedForm, () => {
		typedForm.isDirty = !isEqual(typedForm.data(), defaults);
	}, {
		immediate: true,
		deep: true
	});
	watch(typedForm, (newValue) => {
		if (!rememberKey) return;
		const storedData = router.restore(rememberKey);
		const newData = cloneDeep$1(newValue.__remember());
		if (!isEqual(storedData, newData)) router.remember(newData, rememberKey);
	}, {
		immediate: true,
		deep: true
	});
	if (precognitionEndpoint) typedForm.withPrecognition(precognitionEndpoint);
	return {
		form: typedForm,
		setDefaults: (newDefaults) => {
			defaults = newDefaults;
		},
		getTransform: () => transform,
		getPrecognitionEndpoint: () => precognitionEndpoint ?? null,
		markAsSuccessful: () => {
			typedForm.clearErrors();
			typedForm.wasSuccessful = true;
			typedForm.recentlySuccessful = true;
			recentlySuccessfulTimeoutId = setTimeout(() => typedForm.recentlySuccessful = false, config.get("form.recentlySuccessfulDuration"));
		},
		wasDefaultsCalledInOnSuccess: () => defaultsCalledInOnSuccess,
		resetDefaultsCalledInOnSuccess: () => {
			defaultsCalledInOnSuccess = false;
		},
		setRememberExcludeKeys: (keys) => {
			rememberExcludeKeys = keys;
		},
		resetBeforeSubmit: () => {
			typedForm.wasSuccessful = false;
			typedForm.recentlySuccessful = false;
			clearTimeout(recentlySuccessfulTimeoutId);
		},
		finishProcessing: () => {
			typedForm.processing = false;
			typedForm.progress = null;
		},
		withAllErrors: {
			enabled: withAllErrorsEnabled,
			enable: () => {
				withAllErrors = true;
			}
		}
	};
}
var reservedFormKeys = null;
var bootstrapping = false;
function validateFormDataKeys(data) {
	if (bootstrapping) return;
	if (reservedFormKeys === null) {
		bootstrapping = true;
		reservedFormKeys = new Set(Object.keys(useForm({})));
		bootstrapping = false;
	}
	const conflicts = Object.keys(data).filter((key2) => reservedFormKeys.has(key2));
	if (conflicts.length > 0) console.error(`[Inertia] useForm() data contains field(s) that conflict with form properties: ${conflicts.map((k) => `"${k}"`).join(", ")}. These fields will be overwritten by form methods/properties. Please rename these fields.`);
}
function useForm(...args) {
	const { rememberKey, data, precognitionEndpoint } = UseFormUtils.parseUseFormArguments(...args);
	validateFormDataKeys(typeof data === "function" ? cloneDeep$1(data()) : cloneDeep$1(data));
	let cancelToken = null;
	let pendingOptimisticCallback = null;
	const { form: baseForm, setDefaults, getTransform, getPrecognitionEndpoint, markAsSuccessful, wasDefaultsCalledInOnSuccess, resetDefaultsCalledInOnSuccess, setRememberExcludeKeys, resetBeforeSubmit, finishProcessing } = useFormState({
		data,
		rememberKey,
		precognitionEndpoint
	});
	const form = baseForm;
	const createSubmitMethod = (method) => (url, options = {}) => {
		form.submit(method, url, options);
	};
	Object.assign(form, {
		submit(...args2) {
			const { method, url, options } = UseFormUtils.parseSubmitArguments(args2, getPrecognitionEndpoint());
			resetDefaultsCalledInOnSuccess();
			const _options = {
				...options,
				onCancelToken: (token) => {
					cancelToken = token;
					return options.onCancelToken?.(token);
				},
				onBefore: (visit) => {
					resetBeforeSubmit();
					return options.onBefore?.(visit);
				},
				onStart: (visit) => {
					form.processing = true;
					return options.onStart?.(visit);
				},
				onProgress: (event) => {
					form.progress = event ?? null;
					return options.onProgress?.(event);
				},
				onSuccess: async (page2) => {
					markAsSuccessful();
					const onSuccess = options.onSuccess ? await options.onSuccess(page2) : null;
					if (!wasDefaultsCalledInOnSuccess()) {
						setDefaults(cloneDeep$1(form.data()));
						form.isDirty = false;
					}
					return onSuccess;
				},
				onError: (errors) => {
					form.clearErrors().setError(errors);
					return options.onError?.(errors);
				},
				onCancel: () => {
					return options.onCancel?.();
				},
				onFinish: (visit) => {
					finishProcessing();
					cancelToken = null;
					return options.onFinish?.(visit);
				}
			};
			_options.optimistic = _options.optimistic ?? pendingOptimisticCallback ?? void 0;
			pendingOptimisticCallback = null;
			const transformedData = getTransform()(form.data());
			if (method === "delete") router.delete(url, {
				..._options,
				data: transformedData
			});
			else router[method](url, transformedData, _options);
		},
		get: createSubmitMethod("get"),
		post: createSubmitMethod("post"),
		put: createSubmitMethod("put"),
		patch: createSubmitMethod("patch"),
		delete: createSubmitMethod("delete"),
		cancel() {
			if (cancelToken) cancelToken.cancel();
		},
		dontRemember(...keys) {
			setRememberExcludeKeys(keys);
			return form;
		},
		optimistic(callback) {
			pendingOptimisticCallback = callback;
			return form;
		}
	});
	return getPrecognitionEndpoint() ? form : form;
}
function isComponent(value) {
	if (!value) return false;
	if (typeof value === "function") return true;
	if (typeof value === "object") {
		const obj = value;
		return typeof obj.render === "function" || typeof obj.setup === "function" || typeof obj.template === "string" || "__file" in obj || "__name" in obj;
	}
	return false;
}
function isRenderFunction(value) {
	if (typeof value !== "function") return false;
	const fn = value;
	return fn.length === 2 && typeof fn.prototype === "undefined";
}
var component = /* @__PURE__ */ ref(void 0);
var page = /* @__PURE__ */ ref();
var pageAccessor = null;
var layout = /* @__PURE__ */ shallowRef(null);
var key = /* @__PURE__ */ ref(void 0);
var headManager;
var app_default = /* @__PURE__ */ defineComponent({
	name: "Inertia",
	props: {
		initialPage: {
			type: Object,
			required: true
		},
		initialComponent: {
			type: Object,
			required: false
		},
		resolveComponent: {
			type: Function,
			required: false
		},
		titleCallback: {
			type: Function,
			required: false,
			default: (title) => title
		},
		onHeadUpdate: {
			type: Function,
			required: false,
			default: () => () => {}
		},
		defaultLayout: {
			type: Function,
			required: false
		}
	},
	setup({ initialPage, initialComponent, resolveComponent, titleCallback, onHeadUpdate, defaultLayout }) {
		component.value = initialComponent ? markRaw(initialComponent) : void 0;
		page.value = {
			...initialPage,
			flash: initialPage.flash ?? {}
		};
		key.value = void 0;
		const isServer = typeof window === "undefined";
		headManager = createHeadManager(isServer, titleCallback || ((title) => title), onHeadUpdate || (() => {}));
		if (!isServer) {
			router.init({
				initialPage,
				resolveComponent,
				swapComponent: async (options) => {
					if (!options.preserveState) resetLayoutProps();
					component.value = markRaw(options.component);
					page.value = options.page;
					key.value = options.preserveState ? key.value : Date.now();
				},
				onFlash: (flash) => {
					page.value = {
						...page.value,
						flash
					};
				}
			});
			router.on("navigate", () => headManager.forceUpdate());
		}
		return () => {
			if (component.value) {
				component.value.inheritAttrs = !!component.value.inheritAttrs;
				const child = h(component.value, {
					...page.value.props,
					key: key.value
				});
				if (layout.value) {
					component.value.layout = layout.value;
					layout.value = null;
				}
				if (component.value.layout && isRenderFunction(component.value.layout)) return component.value.layout(h, child);
				let effectiveLayout;
				let callbackProps = null;
				const layoutValue = component.value.layout;
				if (typeof layoutValue === "function" && layoutValue.length <= 1 && typeof layoutValue.prototype === "undefined") {
					const result = layoutValue(page.value.props);
					if (isPropsObjectOrCallback(result, isComponent)) {
						effectiveLayout = defaultLayout?.(page.value.component, page.value);
						callbackProps = result;
					} else effectiveLayout = result;
				} else if (isPropsObject(layoutValue, isComponent)) {
					effectiveLayout = defaultLayout?.(page.value.component, page.value);
					callbackProps = layoutValue;
				} else effectiveLayout = layoutValue ?? defaultLayout?.(page.value.component, page.value);
				if (effectiveLayout) {
					let layouts = normalizeLayouts(effectiveLayout, isComponent, component.value.layout && !callbackProps ? isRenderFunction : void 0);
					if (callbackProps) layouts = layouts.map((l) => ({
						...l,
						props: {
							...l.props,
							...callbackProps
						}
					}));
					if (layouts.length > 0) {
						const dynamicProps = isServer ? {
							shared: {},
							named: {}
						} : state.value;
						return layouts.reduceRight((childNode, layout2) => {
							const layoutComponent = layout2.component;
							layoutComponent.inheritAttrs = !!layoutComponent.inheritAttrs;
							return h(layoutComponent, {
								...page.value.props,
								...layout2.props,
								...dynamicProps.shared,
								...layout2.name ? dynamicProps.named[layout2.name] || {} : {}
							}, () => childNode);
						}, child);
					}
				}
				return child;
			}
		};
	}
});
var plugin = { install(app) {
	router.form = useForm;
	Object.defineProperty(app.config.globalProperties, "$inertia", { get: () => router });
	Object.defineProperty(app.config.globalProperties, "$page", { get: () => page.value });
	Object.defineProperty(app.config.globalProperties, "$headManager", { get: () => headManager });
	app.mixin(remember_default);
} };
function usePage() {
	if (!pageAccessor) pageAccessor = /* @__PURE__ */ reactive({
		props: computed(() => page.value?.props),
		url: computed(() => page.value?.url),
		component: computed(() => page.value?.component),
		version: computed(() => page.value?.version),
		clearHistory: computed(() => page.value?.clearHistory),
		deferredProps: computed(() => page.value?.deferredProps),
		rescuedProps: computed(() => page.value?.rescuedProps),
		mergeProps: computed(() => page.value?.mergeProps),
		prependProps: computed(() => page.value?.prependProps),
		deepMergeProps: computed(() => page.value?.deepMergeProps),
		matchPropsOn: computed(() => page.value?.matchPropsOn),
		rememberedState: computed(() => page.value?.rememberedState),
		encryptHistory: computed(() => page.value?.encryptHistory),
		scrollProps: computed(() => page.value?.scrollProps),
		flash: computed(() => page.value?.flash)
	});
	return pageAccessor;
}
async function createInertiaApp({ id = "app", resolve, setup, title, progress: progress2 = {}, page: page2, render, defaults = {}, nonce, http: http3, layout: layout2, withApp } = {}) {
	config.replace(defaults);
	if (nonce) config.set("nonce", nonce);
	if (http3) http.setClient(http3);
	const isServer = typeof window === "undefined";
	const resolveComponent = (name, page3) => Promise.resolve(resolve(name, page3)).then((module) => module.default || module);
	if (isServer && !page2 && !render) return async (page3, renderToString) => {
		let head2 = [];
		const props = {
			initialPage: page3,
			initialComponent: await resolveComponent(page3.component, page3),
			resolveComponent,
			titleCallback: title,
			onHeadUpdate: (elements) => head2 = elements,
			defaultLayout: layout2
		};
		let vueApp2;
		if (setup) vueApp2 = setup({
			el: null,
			App: app_default,
			props,
			plugin
		});
		else {
			vueApp2 = createSSRApp({ render: () => h(app_default, props) });
			vueApp2.use(plugin);
			if (withApp) withApp(vueApp2, { ssr: true });
		}
		const body = buildSSRBody(id, page3, await renderToString(vueApp2));
		return {
			head: head2,
			body
		};
	};
	const initialPage = page2 || getInitialPageFromDOM(id);
	let head = [];
	const vueApp = await Promise.all([resolveComponent(initialPage.component, initialPage), router.decryptHistory().catch(() => {})]).then(([initialComponent]) => {
		const props = {
			initialPage,
			initialComponent,
			resolveComponent,
			titleCallback: title,
			onHeadUpdate: isServer ? (elements) => head = elements : void 0,
			defaultLayout: layout2
		};
		if (isServer) return setup({
			el: null,
			App: app_default,
			props,
			plugin
		});
		const el = document.getElementById(id);
		if (setup) return setup({
			el,
			App: app_default,
			props,
			plugin
		});
		if (el.hasAttribute("data-server-rendered")) {
			const app = createSSRApp({ render: () => h(app_default, props) });
			app.use(plugin);
			if (withApp) withApp(app, { ssr: false });
			app.mount(el);
		} else {
			const app = createApp({ render: () => h(app_default, props) });
			app.use(plugin);
			if (withApp) withApp(app, { ssr: false });
			app.mount(el);
		}
	});
	if (!isServer && progress2) setupProgress(progress2);
	if (isServer && render && vueApp) {
		const body = buildSSRBody(id, initialPage, await render(vueApp));
		return {
			head,
			body
		};
	}
}
var deferred_default = /* @__PURE__ */ defineComponent({
	name: "Deferred",
	props: { data: {
		type: [String, Array],
		required: true
	} },
	slots: Object,
	setup(props, { slots }) {
		const reloading = /* @__PURE__ */ ref(false);
		const activeReloads = /* @__PURE__ */ new Set();
		const page2 = usePage();
		const keys = computed(() => Array.isArray(props.data) ? props.data : [props.data]);
		const rescuedKeys = computed(() => new Set(page2.rescuedProps));
		let removeStartListener = null;
		let removeFinishListener = null;
		onMounted(() => {
			removeStartListener = router.on("start", (e) => {
				const visit = e.detail.visit;
				if (visit.preserveState === true && isSameUrlWithoutQueryOrHash(visit.url, window.location) && partialReloadRequestsSomeProps(visit, keys.value)) {
					activeReloads.add(visit);
					reloading.value = true;
				}
			});
			removeFinishListener = router.on("finish", (e) => {
				const visit = e.detail.visit;
				if (activeReloads.has(visit)) {
					activeReloads.delete(visit);
					reloading.value = activeReloads.size > 0;
				}
			});
		});
		onUnmounted(() => {
			removeStartListener?.();
			removeFinishListener?.();
			activeReloads.clear();
		});
		return () => {
			if (!slots.fallback) throw new Error("`<Deferred>` requires a `<template #fallback>` slot");
			const propsAreDefined = keys.value.every((key2) => get(page2.props, key2) !== void 0);
			const hasRescuedProps = keys.value.some((key2) => rescuedKeys.value.has(key2));
			const slotProps = { reloading: reloading.value };
			if (propsAreDefined && !hasRescuedProps) return h(Fragment, { key: "default" }, slots.default?.(slotProps) ?? []);
			if (hasRescuedProps && slots.rescue) return h(Fragment, { key: "rescue" }, slots.rescue(slotProps));
			return h(Fragment, { key: "fallback" }, slots.fallback({}));
		};
	}
});
var noop = () => void 0;
var FormContextKey = /* @__PURE__ */ Symbol("InertiaFormContext");
var Form = /* @__PURE__ */ defineComponent({
	name: "Form",
	slots: Object,
	props: {
		action: {
			type: [String, Object],
			default: ""
		},
		method: {
			type: String,
			default: "get"
		},
		headers: {
			type: Object,
			default: () => ({})
		},
		queryStringArrayFormat: {
			type: String,
			default: "brackets"
		},
		errorBag: {
			type: [String, null],
			default: null
		},
		showProgress: {
			type: Boolean,
			default: true
		},
		transform: {
			type: Function,
			default: (data) => data
		},
		options: {
			type: Object,
			default: () => ({})
		},
		resetOnError: {
			type: [Boolean, Array],
			default: false
		},
		resetOnSuccess: {
			type: [Boolean, Array],
			default: false
		},
		setDefaultsOnSuccess: {
			type: Boolean,
			default: false
		},
		onCancelToken: {
			type: Function,
			default: noop
		},
		onBefore: {
			type: Function,
			default: noop
		},
		onStart: {
			type: Function,
			default: noop
		},
		onProgress: {
			type: Function,
			default: noop
		},
		onFinish: {
			type: Function,
			default: noop
		},
		onCancel: {
			type: Function,
			default: noop
		},
		onSuccess: {
			type: Function,
			default: noop
		},
		onError: {
			type: Function,
			default: noop
		},
		onSubmitComplete: {
			type: Function,
			default: noop
		},
		disableWhileProcessing: {
			type: Boolean,
			default: false
		},
		invalidateCacheTags: {
			type: [String, Array],
			default: () => []
		},
		validateFiles: {
			type: Boolean,
			default: false
		},
		validationTimeout: {
			type: Number,
			default: 1500
		},
		optimistic: {
			type: Function,
			default: void 0
		},
		withAllErrors: {
			type: Boolean,
			default: null
		},
		component: {
			type: String,
			default: null
		},
		instant: {
			type: Boolean,
			default: false
		}
	},
	setup(props, { slots, attrs, expose }) {
		const getTransformedData = () => {
			const [_url, data] = getUrlAndData();
			return props.transform(data);
		};
		const form = useForm({}).withPrecognition(() => method.value, () => getUrlAndData()[0]).transform(getTransformedData).setValidationTimeout(props.validationTimeout);
		if (props.validateFiles) form.validateFiles();
		if (props.withAllErrors ?? config$1.get("form.withAllErrors")) form.withAllErrors();
		const formElement = /* @__PURE__ */ ref();
		const method = computed(() => isUrlMethodPair(props.action) ? props.action.method : props.method.toLowerCase());
		const resolvedComponent = computed(() => {
			if (props.component) return props.component;
			if (props.instant && isUrlMethodPair(props.action)) return resolveUrlMethodPairComponent(props.action);
			return null;
		});
		const isDirty = /* @__PURE__ */ ref(false);
		const defaultData = /* @__PURE__ */ ref(new FormData());
		const onFormUpdate = (event) => {
			if (event.type === "reset" && event.detail?.[FormComponentResetSymbol]) event.preventDefault();
			isDirty.value = event.type === "reset" ? false : !isEqual(getData(), formDataToObject(defaultData.value));
		};
		const formEvents = [
			"input",
			"change",
			"reset"
		];
		onMounted(() => {
			defaultData.value = getFormData();
			form.defaults(getData());
			formEvents.forEach((e) => formElement.value.addEventListener(e, onFormUpdate));
		});
		watch(() => props.validateFiles, (value) => value ? form.validateFiles() : form.withoutFileValidation());
		watch(() => props.validationTimeout, (value) => form.setValidationTimeout(value));
		onBeforeUnmount(() => formEvents.forEach((e) => formElement.value?.removeEventListener(e, onFormUpdate)));
		const getFormData = (submitter) => new FormData(formElement.value, submitter);
		const getData = (submitter) => formDataToObject(getFormData(submitter));
		const getUrlAndData = (submitter) => {
			return mergeDataIntoQueryString(method.value, isUrlMethodPair(props.action) ? props.action.url : props.action, getData(submitter), props.queryStringArrayFormat);
		};
		const submit = (submitter) => {
			const [url, data] = getUrlAndData(submitter);
			if (submitter?.getAttribute("formtarget") === "_blank" && method.value === "get") {
				window.open(url, "_blank");
				return;
			}
			const maybeReset = (resetOption) => {
				if (!resetOption) return;
				if (resetOption === true) reset();
				else if (resetOption.length > 0) reset(...resetOption);
			};
			const submitOptions = {
				headers: props.headers,
				queryStringArrayFormat: props.queryStringArrayFormat,
				errorBag: props.errorBag,
				showProgress: props.showProgress,
				invalidateCacheTags: props.invalidateCacheTags,
				component: resolvedComponent.value,
				optimistic: props.optimistic ? (pageProps) => props.optimistic(pageProps, data) : void 0,
				onCancelToken: props.onCancelToken,
				onBefore: props.onBefore,
				onStart: props.onStart,
				onProgress: props.onProgress,
				onFinish: props.onFinish,
				onCancel: props.onCancel,
				onSuccess: (...args) => {
					props.onSuccess?.(...args);
					props.onSubmitComplete?.(exposed);
					maybeReset(props.resetOnSuccess);
					if (props.setDefaultsOnSuccess === true) defaults();
				},
				onError: (...args) => {
					props.onError?.(...args);
					maybeReset(props.resetOnError);
				},
				...props.options
			};
			form.transform(() => props.transform(data)).submit(method.value, url, submitOptions);
			form.transform(getTransformedData);
		};
		const reset = (...fields) => {
			resetFormFields(formElement.value, defaultData.value, fields);
			form.reset(...fields);
		};
		const clearErrors = (...fields) => {
			form.clearErrors(...fields);
		};
		const resetAndClearErrors = (...fields) => {
			clearErrors(...fields);
			reset(...fields);
		};
		const defaults = () => {
			defaultData.value = getFormData();
			isDirty.value = false;
		};
		const exposed = {
			get errors() {
				return form.errors;
			},
			get hasErrors() {
				return form.hasErrors;
			},
			get processing() {
				return form.processing;
			},
			get progress() {
				return form.progress;
			},
			get wasSuccessful() {
				return form.wasSuccessful;
			},
			get recentlySuccessful() {
				return form.recentlySuccessful;
			},
			get validating() {
				return form.validating;
			},
			clearErrors,
			resetAndClearErrors,
			setError: (fieldOrFields, maybeValue) => form.setError(typeof fieldOrFields === "string" ? { [fieldOrFields]: maybeValue } : fieldOrFields),
			get isDirty() {
				return isDirty.value;
			},
			reset,
			submit,
			defaults,
			getData,
			getFormData,
			touch: form.touch,
			valid: form.valid,
			invalid: form.invalid,
			touched: form.touched,
			validate: (field, config3) => form.validate(...UseFormUtils.mergeHeadersForValidation(field, config3, props.headers)),
			validator: () => form.validator()
		};
		expose(exposed);
		provide(FormContextKey, exposed);
		return () => {
			return h("form", {
				...attrs,
				ref: formElement,
				action: isUrlMethodPair(props.action) ? props.action.url : props.action,
				method: method.value,
				onSubmit: (event) => {
					event.preventDefault();
					submit(event.submitter);
				},
				inert: props.disableWhileProcessing && form.processing
			}, slots.default ? slots.default(exposed) : []);
		};
	}
});
function useFormContext() {
	return inject(FormContextKey);
}
function createForm() {
	return Form;
}
var form_default = Form;
function isUnaryTag(node) {
	return typeof node.type === "string" && [
		"area",
		"base",
		"br",
		"col",
		"embed",
		"hr",
		"img",
		"input",
		"keygen",
		"link",
		"meta",
		"param",
		"source",
		"track",
		"wbr"
	].indexOf(node.type) > -1;
}
function renderTagStart(node) {
	node.props = node.props || {};
	node.props["data-inertia"] = node.props["head-key"] !== void 0 ? node.props["head-key"] : "";
	const attrs = Object.keys(node.props).reduce((carry, name) => {
		const value = String(node.props[name]);
		if (["key", "head-key"].includes(name)) return carry;
		else if (value === "") return carry + ` ${name}`;
		else return carry + ` ${name}="${escape(value)}"`;
	}, "");
	return `<${String(node.type)}${attrs}>`;
}
function renderTagChildren(node) {
	const { children } = node;
	if (typeof children === "string") return children;
	if (Array.isArray(children)) return children.reduce((html, child) => {
		return html + renderTag(child);
	}, "");
	return "";
}
function isFunctionNode(node) {
	return typeof node.type === "function";
}
function isComponentNode(node) {
	return typeof node.type === "object";
}
function isCommentNode(node) {
	return /(comment|cmt)/i.test(node.type.toString());
}
function isFragmentNode(node) {
	return /(fragment|fgt|symbol\(\))/i.test(node.type.toString());
}
function isTextNode(node) {
	return /(text|txt)/i.test(node.type.toString());
}
function renderTag(node) {
	if (isTextNode(node)) return String(node.children);
	else if (isFragmentNode(node)) return "";
	else if (isCommentNode(node)) return "";
	let html = renderTagStart(node);
	if (node.children) html += renderTagChildren(node);
	if (!isUnaryTag(node)) html += `</${String(node.type)}>`;
	return html;
}
function addTitleElement(elements, title) {
	if (title && !elements.find((tag) => tag.startsWith("<title"))) elements.push(`<title data-inertia="">${escape(title)}</title>`);
	return elements;
}
function renderNodes(nodes, title) {
	return addTitleElement(nodes.flatMap((node) => resolveNode(node)).map((node) => renderTag(node)).filter((node) => node), title);
}
function resolveNode(node) {
	if (isFunctionNode(node)) return resolveNode(node.type());
	else if (isComponentNode(node)) {
		console.warn(`Using components in the <Head> component is not supported.`);
		return [];
	} else if (isTextNode(node) && node.children) return node;
	else if (isFragmentNode(node) && node.children) return node.children.flatMap((child) => resolveNode(child));
	else if (isCommentNode(node)) return [];
	else return node;
}
var head_default = /* @__PURE__ */ defineComponent({
	props: { title: {
		type: String,
		required: false
	} },
	setup(props, { slots }) {
		const provider = headManager.createProvider();
		onBeforeUnmount(() => {
			provider.disconnect();
		});
		return () => {
			provider.update(renderNodes(slots.default ? slots.default() : [], props.title));
		};
	}
});
var resolveHTMLElement = (value, fallback) => {
	if (!value) return fallback;
	if (typeof value === "string") return document.querySelector(value);
	if (typeof value === "function") return value() || null;
	return fallback;
};
var infiniteScroll_default = /* @__PURE__ */ defineComponent({
	name: "InfiniteScroll",
	slots: Object,
	props: {
		data: {
			type: String,
			required: true
		},
		buffer: {
			type: Number,
			default: 0
		},
		onlyNext: {
			type: Boolean,
			default: false
		},
		onlyPrevious: {
			type: Boolean,
			default: false
		},
		as: {
			type: String,
			default: "div"
		},
		manual: {
			type: Boolean,
			default: false
		},
		manualAfter: {
			type: Number,
			default: 0
		},
		preserveUrl: {
			type: Boolean,
			default: false
		},
		reverse: {
			type: Boolean,
			default: false
		},
		autoScroll: {
			type: Boolean,
			default: void 0
		},
		itemsElement: {
			type: [
				String,
				Function,
				Object
			],
			default: null
		},
		startElement: {
			type: [
				String,
				Function,
				Object
			],
			default: null
		},
		endElement: {
			type: [
				String,
				Function,
				Object
			],
			default: null
		},
		params: {
			type: Object,
			default: () => ({})
		}
	},
	inheritAttrs: false,
	setup(props, { slots, attrs, expose }) {
		const itemsElementRef = /* @__PURE__ */ ref(null);
		const startElementRef = /* @__PURE__ */ ref(null);
		const endElementRef = /* @__PURE__ */ ref(null);
		const itemsElement = computed(() => resolveHTMLElement(props.itemsElement, itemsElementRef.value));
		const scrollableParent = computed(() => getScrollableParent(itemsElement.value));
		const startElement = computed(() => resolveHTMLElement(props.startElement, startElementRef.value));
		const endElement = computed(() => resolveHTMLElement(props.endElement, endElementRef.value));
		const loadingPrevious = /* @__PURE__ */ ref(false);
		const loadingNext = /* @__PURE__ */ ref(false);
		const requestCount = /* @__PURE__ */ ref(0);
		const hasPreviousPage = /* @__PURE__ */ ref(false);
		const hasNextPage = /* @__PURE__ */ ref(false);
		const syncStateFromDataManager = () => {
			requestCount.value = dataManager.getRequestCount();
			hasPreviousPage.value = dataManager.hasPrevious();
			hasNextPage.value = dataManager.hasNext();
		};
		const { dataManager, elementManager, flush: flushInfiniteScroll } = useInfiniteScroll({
			getPropName: () => props.data,
			inReverseMode: () => props.reverse,
			shouldFetchNext: () => !props.onlyPrevious,
			shouldFetchPrevious: () => !props.onlyNext,
			shouldPreserveUrl: () => props.preserveUrl,
			getReloadOptions: () => props.params,
			getTriggerMargin: () => props.buffer,
			getStartElement: () => startElement.value,
			getEndElement: () => endElement.value,
			getItemsElement: () => itemsElement.value,
			getScrollableParent: () => scrollableParent.value,
			onBeforePreviousRequest: () => loadingPrevious.value = true,
			onBeforeNextRequest: () => loadingNext.value = true,
			onCompletePreviousRequest: ({ completed }) => {
				loadingPrevious.value = false;
				if (completed) syncStateFromDataManager();
			},
			onCompleteNextRequest: ({ completed }) => {
				loadingNext.value = false;
				if (completed) syncStateFromDataManager();
			},
			onDataReset: syncStateFromDataManager
		});
		syncStateFromDataManager();
		if (typeof window === "undefined") {
			const scrollProp = usePage().scrollProps?.[props.data];
			if (scrollProp) {
				hasPreviousPage.value = !!scrollProp.previousPage;
				hasNextPage.value = !!scrollProp.nextPage;
			}
		}
		const autoLoad = computed(() => !manualMode.value);
		const manualMode = computed(() => props.manual || props.manualAfter > 0 && requestCount.value >= props.manualAfter);
		const scrollToBottom = () => {
			if (scrollableParent.value) scrollableParent.value.scrollTo({
				top: scrollableParent.value.scrollHeight,
				behavior: "instant"
			});
			else window.scrollTo({
				top: document.body.scrollHeight,
				behavior: "instant"
			});
		};
		onMounted(() => {
			elementManager.setupObservers();
			elementManager.processServerLoadedElements(dataManager.getLastLoadedPage());
			if (props.autoScroll !== void 0 ? props.autoScroll : props.reverse) scrollToBottom();
			if (autoLoad.value) elementManager.enableTriggers();
		});
		onUnmounted(flushInfiniteScroll);
		watch(() => [
			autoLoad.value,
			props.onlyNext,
			props.onlyPrevious
		], ([enabled]) => {
			enabled ? elementManager.enableTriggers() : elementManager.disableTriggers();
		});
		expose({
			fetchNext: dataManager.fetchNext,
			fetchPrevious: dataManager.fetchPrevious,
			hasPrevious: dataManager.hasPrevious,
			hasNext: dataManager.hasNext
		});
		return () => {
			const renderElements = [];
			const sharedExposed = {
				loadingPrevious: loadingPrevious.value,
				loadingNext: loadingNext.value,
				hasPrevious: hasPreviousPage.value,
				hasNext: hasNextPage.value
			};
			if (!props.startElement) {
				const headerAutoMode = autoLoad.value && !props.onlyNext;
				const exposedPrevious = {
					loading: loadingPrevious.value,
					fetch: dataManager.fetchPrevious,
					autoMode: headerAutoMode,
					manualMode: !headerAutoMode,
					hasMore: hasPreviousPage.value,
					...sharedExposed
				};
				renderElements.push(h("div", { ref: startElementRef }, slots.previous ? slots.previous(exposedPrevious) : loadingPrevious.value ? slots.loading?.(exposedPrevious) : void 0));
			}
			renderElements.push(h(props.as, {
				...attrs,
				ref: itemsElementRef
			}, slots.default?.({
				loading: loadingPrevious.value || loadingNext.value,
				loadingPrevious: loadingPrevious.value,
				loadingNext: loadingNext.value
			})));
			if (!props.endElement) {
				const footerAutoMode = autoLoad.value && !props.onlyPrevious;
				const exposedNext = {
					loading: loadingNext.value,
					fetch: dataManager.fetchNext,
					autoMode: footerAutoMode,
					manualMode: !footerAutoMode,
					hasMore: hasNextPage.value,
					...sharedExposed
				};
				renderElements.push(h("div", { ref: endElementRef }, slots.next ? slots.next(exposedNext) : loadingNext.value ? slots.loading?.(exposedNext) : void 0));
			}
			return h(Fragment, {}, props.reverse ? [...renderElements].reverse() : renderElements);
		};
	}
});
var noop2 = () => {};
var link_default = /* @__PURE__ */ defineComponent({
	name: "Link",
	props: {
		as: {
			type: [String, Object],
			default: "a"
		},
		data: {
			type: Object,
			default: () => ({})
		},
		href: {
			type: [String, Object],
			default: ""
		},
		method: {
			type: String,
			default: "get"
		},
		replace: {
			type: Boolean,
			default: false
		},
		preserveScroll: {
			type: [
				Boolean,
				String,
				Function
			],
			default: false
		},
		preserveState: {
			type: [
				Boolean,
				String,
				Function
			],
			default: null
		},
		preserveUrl: {
			type: Boolean,
			default: false
		},
		only: {
			type: Array,
			default: () => []
		},
		except: {
			type: Array,
			default: () => []
		},
		headers: {
			type: Object,
			default: () => ({})
		},
		queryStringArrayFormat: {
			type: String,
			default: "brackets"
		},
		async: {
			type: Boolean,
			default: false
		},
		prefetch: {
			type: [
				Boolean,
				String,
				Array
			],
			default: false
		},
		cacheFor: {
			type: [
				Number,
				String,
				Array
			],
			default: 0
		},
		onStart: {
			type: Function,
			default: noop2
		},
		onProgress: {
			type: Function,
			default: noop2
		},
		onFinish: {
			type: Function,
			default: noop2
		},
		onBefore: {
			type: Function,
			default: noop2
		},
		onCancel: {
			type: Function,
			default: noop2
		},
		onSuccess: {
			type: Function,
			default: noop2
		},
		onError: {
			type: Function,
			default: noop2
		},
		onCancelToken: {
			type: Function,
			default: noop2
		},
		onPrefetching: {
			type: Function,
			default: noop2
		},
		onPrefetched: {
			type: Function,
			default: noop2
		},
		cacheTags: {
			type: [String, Array],
			default: () => []
		},
		viewTransition: {
			type: [Boolean, Object],
			default: false
		},
		component: {
			type: String,
			default: null
		},
		instant: {
			type: Boolean,
			default: false
		},
		pageProps: {
			type: [Object, Function],
			default: null
		}
	},
	setup(props, { slots, attrs }) {
		const inFlightCount = /* @__PURE__ */ ref(0);
		const hoverTimeout = /* @__PURE__ */ ref();
		const prefetchModes = computed(() => {
			if (props.prefetch === true) return ["hover"];
			if (props.prefetch === false) return [];
			if (Array.isArray(props.prefetch)) return props.prefetch;
			return [props.prefetch];
		});
		const cacheForValue = computed(() => {
			if (props.cacheFor !== 0) return props.cacheFor;
			if (prefetchModes.value.length === 1 && prefetchModes.value[0] === "click") return 0;
			return config.get("prefetch.cacheFor");
		});
		onMounted(() => {
			if (prefetchModes.value.includes("mount")) prefetch();
		});
		onUnmounted(() => {
			clearTimeout(hoverTimeout.value);
		});
		const method = computed(() => isUrlMethodPair(props.href) ? props.href.method : (props.method ?? "get").toLowerCase());
		const as = computed(() => {
			if (typeof props.as !== "string" || props.as.toLowerCase() !== "a") return props.as;
			return method.value !== "get" ? "button" : props.as.toLowerCase();
		});
		const mergeDataArray = computed(() => mergeDataIntoQueryString(method.value, isUrlMethodPair(props.href) ? props.href.url : props.href, props.data || {}, props.queryStringArrayFormat));
		const href = computed(() => mergeDataArray.value[0]);
		const data = computed(() => mergeDataArray.value[1]);
		const resolvedComponent = computed(() => {
			if (props.component) return props.component;
			if (props.instant && isUrlMethodPair(props.href)) return resolveUrlMethodPairComponent(props.href);
			return null;
		});
		const elProps = computed(() => {
			if (as.value === "button") return { type: "button" };
			if (as.value === "a" || typeof as.value !== "string") return { href: href.value };
			return {};
		});
		const baseParams = computed(() => ({
			data: data.value,
			method: method.value,
			replace: props.replace,
			preserveScroll: props.preserveScroll,
			preserveState: props.preserveState ?? method.value !== "get",
			preserveUrl: props.preserveUrl,
			only: props.only,
			except: props.except,
			headers: props.headers,
			async: props.async,
			component: resolvedComponent.value,
			pageProps: props.pageProps
		}));
		const visitParams = computed(() => ({
			...baseParams.value,
			viewTransition: props.viewTransition,
			onCancelToken: props.onCancelToken,
			onBefore: props.onBefore,
			onStart: (visit) => {
				inFlightCount.value++;
				props.onStart?.(visit);
			},
			onProgress: props.onProgress,
			onFinish: (visit) => {
				inFlightCount.value--;
				props.onFinish?.(visit);
			},
			onCancel: props.onCancel,
			onSuccess: props.onSuccess,
			onError: props.onError
		}));
		const prefetch = () => {
			router.prefetch(href.value, {
				...baseParams.value,
				onPrefetching: props.onPrefetching,
				onPrefetched: props.onPrefetched
			}, {
				cacheFor: cacheForValue.value,
				cacheTags: props.cacheTags
			});
		};
		const regularEvents = { onClick: (event) => {
			if (shouldIntercept(event)) {
				event.preventDefault();
				router.visit(href.value, visitParams.value);
			}
		} };
		const prefetchHoverEvents = {
			onMouseenter: () => {
				hoverTimeout.value = setTimeout(() => {
					prefetch();
				}, config.get("prefetch.hoverDelay"));
			},
			onMouseleave: () => {
				clearTimeout(hoverTimeout.value);
			},
			onClick: regularEvents.onClick
		};
		const prefetchClickEvents = {
			onMousedown: (event) => {
				if (shouldIntercept(event)) {
					event.preventDefault();
					prefetch();
				}
			},
			onKeydown: (event) => {
				if (shouldNavigate(event)) {
					event.preventDefault();
					prefetch();
				}
			},
			onMouseup: (event) => {
				if (shouldIntercept(event)) {
					event.preventDefault();
					router.visit(href.value, visitParams.value);
				}
			},
			onKeyup: (event) => {
				if (shouldNavigate(event)) {
					event.preventDefault();
					router.visit(href.value, visitParams.value);
				}
			},
			onClick: (event) => {
				if (shouldIntercept(event)) event.preventDefault();
			}
		};
		return () => {
			return h(as.value, {
				...attrs,
				...elProps.value,
				"data-loading": inFlightCount.value > 0 ? "" : void 0,
				...(() => {
					if (prefetchModes.value.includes("hover")) return prefetchHoverEvents;
					if (prefetchModes.value.includes("click")) return prefetchClickEvents;
					return regularEvents;
				})()
			}, slots);
		};
	}
});
function useHttp(...args) {
	const { rememberKey, data, precognitionEndpoint } = UseFormUtils.parseUseFormArguments(...args);
	let abortController = null;
	let pendingOptimisticCallback = null;
	const { form: baseForm, setDefaults, getTransform, getPrecognitionEndpoint, markAsSuccessful, wasDefaultsCalledInOnSuccess, resetDefaultsCalledInOnSuccess, setRememberExcludeKeys, resetBeforeSubmit, finishProcessing, withAllErrors } = useFormState({
		data,
		rememberKey,
		precognitionEndpoint
	});
	const form = baseForm;
	form.response = null;
	const submit = async (method, url, options) => {
		if (options.onBefore?.() === false) return Promise.reject(/* @__PURE__ */ new Error("Request cancelled by onBefore"));
		resetDefaultsCalledInOnSuccess();
		resetBeforeSubmit();
		abortController = new AbortController();
		options.onCancelToken?.({ cancel: () => abortController?.abort() });
		options.optimistic = options.optimistic ?? pendingOptimisticCallback ?? void 0;
		pendingOptimisticCallback = null;
		let snapshot;
		if (options.optimistic) {
			snapshot = cloneDeep$1(form.data());
			const optimisticData = options.optimistic(cloneDeep$1(snapshot));
			if (optimisticData) Object.keys(optimisticData).forEach((key2) => {
				form[key2] = optimisticData[key2];
			});
		}
		form.processing = true;
		options.onStart?.();
		const transformedData = getTransform()(form.data());
		const useFormData = hasFiles(transformedData);
		let requestUrl = url;
		let requestData;
		let contentType;
		if (method === "get") {
			const [urlWithParams] = mergeDataIntoQueryString(method, url, transformedData);
			requestUrl = urlWithParams;
		} else if (useFormData) requestData = objectToFormData(transformedData);
		else {
			requestData = JSON.stringify(transformedData);
			contentType = "application/json";
		}
		try {
			const response = await http.getClient().request({
				method,
				url: requestUrl,
				data: requestData,
				headers: {
					Accept: "application/json",
					...contentType ? { "Content-Type": contentType } : {},
					...options.headers
				},
				signal: abortController.signal,
				onUploadProgress: (event) => {
					form.progress = event;
					options.onProgress?.(event);
				}
			});
			const responseData = response.data ? JSON.parse(response.data) : null;
			if (response.status >= 200 && response.status < 300) {
				markAsSuccessful();
				form.response = responseData;
				options.onSuccess?.(responseData, response);
				if (!wasDefaultsCalledInOnSuccess()) setDefaults(cloneDeep$1(form.data()));
				form.isDirty = false;
				return responseData;
			}
			throw new HttpResponseError(`Request failed with status ${response.status}`, response, url);
		} catch (error) {
			if (snapshot) Object.keys(snapshot).forEach((key2) => {
				form[key2] = snapshot[key2];
			});
			if (error instanceof HttpResponseError) {
				if (error.response.status === 422) {
					const validationErrors = JSON.parse(error.response.data).errors || {};
					const processedErrors = withAllErrors.enabled() ? validationErrors : toSimpleValidationErrors(validationErrors);
					form.clearErrors().setError(processedErrors);
					options.onError?.(processedErrors);
				} else options.onHttpException?.(error.response);
				throw error;
			}
			if (error instanceof HttpCancelledError || error instanceof Error && error.name === "AbortError") {
				options.onCancel?.();
				throw new HttpCancelledError("Request was cancelled", url);
			}
			options.onNetworkError?.(error instanceof Error ? error : /* @__PURE__ */ new Error("Unknown error"));
			throw error;
		} finally {
			finishProcessing();
			abortController = null;
			options.onFinish?.();
		}
	};
	const createSubmitMethod = (method) => async (url, options = {}) => {
		return submit(method, url, options);
	};
	Object.assign(form, {
		submit(...args2) {
			const parsed = UseFormUtils.parseSubmitArguments(args2, getPrecognitionEndpoint());
			return submit(parsed.method, parsed.url, parsed.options);
		},
		get: createSubmitMethod("get"),
		post: createSubmitMethod("post"),
		put: createSubmitMethod("put"),
		patch: createSubmitMethod("patch"),
		delete: createSubmitMethod("delete"),
		cancel() {
			if (abortController) abortController.abort();
		},
		dontRemember(...keys) {
			setRememberExcludeKeys(keys);
			return form;
		},
		optimistic(callback) {
			pendingOptimisticCallback = callback;
			return form;
		},
		withAllErrors() {
			withAllErrors.enable();
			return form;
		}
	});
	const originalWithPrecognition = form.withPrecognition;
	form.withPrecognition = (...args2) => {
		originalWithPrecognition.call(form, ...args2);
		return form;
	};
	return getPrecognitionEndpoint() ? form : form;
}
function usePoll(interval, requestOptions = {}, options = {
	keepAlive: false,
	autoStart: true
}) {
	const { stop, start, destroy } = router.poll(interval, requestOptions, {
		...options,
		autoStart: false
	});
	onMounted(() => {
		if (options.autoStart ?? true) start();
	});
	onUnmounted(() => {
		destroy();
	});
	return {
		stop,
		start
	};
}
function usePrefetch(options = {}) {
	const isPrefetching = /* @__PURE__ */ ref(false);
	const lastUpdatedAt = /* @__PURE__ */ ref(null);
	const isPrefetched = /* @__PURE__ */ ref(false);
	const cached = typeof window === "undefined" ? null : router.getCached(window.location.pathname, options);
	const inFlight = typeof window === "undefined" ? null : router.getPrefetching(window.location.pathname, options);
	lastUpdatedAt.value = cached?.staleTimestamp || null;
	isPrefetching.value = inFlight !== null;
	isPrefetched.value = cached !== null;
	let onPrefetchedListener;
	let onPrefetchingListener;
	onMounted(() => {
		onPrefetchingListener = router.on("prefetching", (e) => {
			if (e.detail.visit.url.pathname === window.location.pathname) isPrefetching.value = true;
		});
		onPrefetchedListener = router.on("prefetched", (e) => {
			if (e.detail.visit.url.pathname === window.location.pathname) {
				isPrefetching.value = false;
				isPrefetched.value = true;
			}
		});
	});
	onUnmounted(() => {
		onPrefetchedListener();
		onPrefetchingListener();
	});
	return {
		lastUpdatedAt,
		isPrefetching,
		isPrefetched,
		flush: () => router.flush(window.location.pathname, options)
	};
}
function useRemember(data, key2) {
	if (typeof data === "object" && data !== null && data.__rememberable === false) return data;
	const restored = router.restore(key2);
	const type = /* @__PURE__ */ isReactive(data) ? reactive : ref;
	const hasCallbacks = typeof data.__remember === "function" && typeof data.__restore === "function";
	const remembered = type(restored === void 0 ? data : hasCallbacks ? data.__restore(cloneDeep$1(restored)) : cloneDeep$1(restored));
	watch(remembered, (newValue) => {
		router.remember(cloneDeep$1(hasCallbacks ? data.__remember() : newValue), key2);
	}, {
		immediate: true,
		deep: true
	});
	return remembered;
}
var whenVisible_default = /* @__PURE__ */ defineComponent({
	name: "WhenVisible",
	slots: Object,
	props: {
		data: { type: [String, Array] },
		params: { type: Object },
		buffer: {
			type: Number,
			default: 0
		},
		as: {
			type: String,
			default: "div"
		},
		always: {
			type: Boolean,
			default: false
		}
	},
	setup(props, { slots }) {
		const loaded = /* @__PURE__ */ ref(false);
		const fetching = /* @__PURE__ */ ref(false);
		const observer = /* @__PURE__ */ ref(null);
		const elementRef = /* @__PURE__ */ ref(null);
		const page2 = usePage();
		const keys = computed(() => {
			return props.data ? Array.isArray(props.data) ? props.data : [props.data] : [];
		});
		function getReloadParams() {
			const reloadParams = {
				preserveErrors: true,
				...props.params
			};
			if (props.data) reloadParams.only = Array.isArray(props.data) ? props.data : [props.data];
			return reloadParams;
		}
		function registerObserver() {
			if (typeof window === "undefined") return;
			observer.value?.disconnect();
			observer.value = new IntersectionObserver((entries) => {
				if (!entries[0].isIntersecting) return;
				if (fetching.value) return;
				if (!props.always && loaded.value) return;
				fetching.value = true;
				const reloadParams = getReloadParams();
				router.reload({
					...reloadParams,
					onStart: (e) => {
						fetching.value = true;
						reloadParams.onStart?.(e);
					},
					onFinish: (e) => {
						loaded.value = true;
						fetching.value = false;
						reloadParams.onFinish?.(e);
						if (!props.always) observer.value?.disconnect();
					}
				});
			}, { rootMargin: `${props.buffer}px` });
			if (elementRef.value) observer.value.observe(elementRef.value);
		}
		watch(() => keys.value.map((key2) => get(page2.props, key2)), () => {
			const exists = keys.value.length > 0 && keys.value.every((key2) => get(page2.props, key2) !== void 0);
			loaded.value = exists;
			if (exists && !props.always) return;
			if (!observer.value || !exists) nextTick(registerObserver);
		}, { immediate: true });
		onUnmounted(() => {
			observer.value?.disconnect();
		});
		return () => {
			const els = [];
			if (props.always || !loaded.value) els.push(h(props.as, { ref: elementRef }));
			if (!loaded.value) els.push(slots.fallback ? slots.fallback({}) : null);
			else if (slots.default) els.push(slots.default({ fetching: fetching.value }));
			return els;
		};
	}
});
var config = config$1.extend({});
//#endregion
export { app_default as App, deferred_default as Deferred, form_default as Form, head_default as Head, infiniteScroll_default as InfiniteScroll, link_default as Link, whenVisible_default as WhenVisible, config, createForm, createInertiaApp, http, progress, resetLayoutProps, router, setLayoutProps, useForm, useFormContext, useHttp, usePage, usePoll, usePrefetch, useRemember };

//# sourceMappingURL=@inertiajs_vue3.js.map