/**
 * 创建日期: 2022-10-18
 * 文件名称：es6-functional.js
 * 创建作者：Potter
 * 开发版本：1.0.0
 * 相关说明：
 */

const forEach = (arr, fn) => {
	for (let i = 0; i < arr.length; i++) {
		fn(arr[i])
	}
}

const every = (arr, fn) => {
	let result = true;
	for (let i = 0; i < arr.length; i++)
		result = result && fn(arr[i])
	return result
}

const some = (arr, fn) => {
	let result = false;
	for (const value of arr)
		result = result || fn(value)
	return result
}

const tap = (value) =>
	(fn) => (
		typeof (fn) === 'function' && fn(value),
		console.log(value)
	);

const unary = (fn) => {
	return fn.length === 1 ? fn : (args) => fn(args)
}

const once = (fn) => {
	let done = false;

	return function () {
		return done ? undefined : ((done = true), fn.apply(this, arguments))
	}
}

const menolized = (fn) => {
	const lookupTable = {};
	return (arg) => lookupTable[arg] || (lookupTable[arg] = fn(arg))
}

const map = (array, fn) => {
	let results = []
	for (const value of array)
		results.push(fn(value))
	return results;
}

const filter = (array, fn) => {
	let results = []
	for (const value of array)
		(fn(value)) ? results.push(value) : undefined
	return results;
}

const concatAll = (arr, fn) => {
	let result = [];
	for (let value of arr) {//value是子数组
		result.push.apply(result, value)
	}
	return result;
}

const reduce1 = (array, fn) => {
	let accumlator = 0;

	for (const value of array) {
		accumlator = fn(accumlator, value)
	}

	return [accumlator]
}

const reduce = (array, fn, initialValue) => {
	let accumlator;

	if (initialValue != undefined) {
		accumlator = initialValue;
	}
	else {
		accumlator = array[0];
	}

	if (initialValue === undefined) {
		for (let i = 1; i < array.length; i++) {
			accumlator = fn(accumlator, array[i])
		}
	}
	else {
		for (const value of array) {
			accumlator = fn(accumlator, value)
		}
	}

	return [accumlator]
}

const zip = (leftArr, rightArr, fn) => {
	let index, results = [];

	for (index = 0; index < Math.min(leftArr.length, rightArr.length); index++) {
		results.push(fn(leftArr[index], rightArr[index]));
	}

	return results;
}

const curry = (binaryFn) => {
	return function (firstArg) {
		return function (secondArg) {
			return binaryFn(firstArg, secondArg);
		};
	};
};

const curryN = (fn) => {
	if (typeof fn !== 'function') {
		throw Error('No function provided');
	}

	return function curriedFn(...args) {

		//! 当闭包的函数参数数量不够执行fn的参数长度，递归调用curriedFn拼接参数
		if (args.length < fn.length) {
			return function () {
				return curriedFn.apply(null, args.concat([].slice.call(arguments)));
			};
		}

		//! 当前参数长度=fn.length则执行函数
		return fn.apply(null, args);
	};
};

/**
 * 偏函数
 * @param {*} fn 
 * @param  {...any} partialArgs 
 * @returns 
 */
const partial = function (fn, ...partialArgs) {
	let args = partialArgs.slice(0);
	return function (...fullArguments) {
		let arg = 0;
		//! 补全参数
		for (let i = 0; i < args.length && arg < fullArguments.length; i++) {
			//! 将占位的参数进行赋值
			if (args[i] === undefined) {
				args[i] = fullArguments[arg++];
			}
		}
		return fn.apply(this, args);
	};
};

export {
	forEach, every, some, tap, unary, once, menolized,
	map, filter, concatAll, reduce1, reduce, zip,
	curry, curryN, partial
}
