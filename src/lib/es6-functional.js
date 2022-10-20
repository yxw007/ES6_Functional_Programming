/**
 * 创建日期: 2022-10-18
 * 文件名称：es6-functional.js
 * 创建作者：Potter
 * 开发版本：1.0.0
 * 相关说明：
 */

/**
 * 遍历数组每一个元素，进行fn处理
 * @param {*} arr 
 * @param {*} fn 
 */
const forEach = (arr, fn) => {
	for (let i = 0; i < arr.length; i++) {
		fn(arr[i])
	}
}

/**
 * 需要每一个fn执行结果为true,结果才为true，否则就是false
 * @param {*} arr 
 * @param {*} fn 
 * @returns 
 */
const every = (arr, fn) => {
	let result = true;
	for (let i = 0; i < arr.length; i++)
		result = result && fn(arr[i])
	return result
}

/**
 * 只要一个fn执行结果为true，结果就是true
 * @param {*} arr 
 * @param {*} fn 
 * @returns 
 */
const some = (arr, fn) => {
	let result = false;
	for (const value of arr)
		result = result || fn(value)
	return result
}

/**
 * 打印日志
 * @param {*} value 
 * @returns 
 */
const tap = (value) => {
	return (fn) => (
		typeof (fn) === 'function' && fn(value),
		console.log(value)
	);
}

/**
 * 利用unary将多参转成只接收一个参数的函数
 * @param {*} fn 
 * @returns 
 */
const unary = (fn) => {
	return fn.length === 1 ? fn : (args) => fn(args)
}

/**
 * 限制仅执行一次
 * @param {*} fn 
 * @returns 
 */
const once = (fn) => {
	let done = false;

	return function () {
		return done ? undefined : ((done = true), fn.apply(this, arguments))
	}
}

/**
 * 具备缓存fn结果的高阶函数
 * @param {*} fn 
 * @returns 
 */
const menolized = (fn) => {
	const lookupTable = {};
	return (arg) => lookupTable[arg] || (lookupTable[arg] = fn(arg))
}

/**
 * 遍历array中的每个元素，通过fn处理返回新的对象数组
 * @param {*} array 
 * @param {*} fn 
 * @returns 
 */
const map = (array, fn) => {
	let results = []
	for (const value of array)
		results.push(fn(value))
	return results;
}

/**
 * 遍历array中的每个元素，通过fn处理返回满足条件的对象数组
 * @param {*} array 
 * @param {*} fn 
 * @returns 
 */
const filter = (array, fn) => {
	let results = []
	for (const value of array)
		(fn(value)) ? results.push(value) : undefined
	return results;
}

/**
 * 将多维度数组，拍平成1维数组
 * @param {*} arr 
 * @param {*} fn 
 * @returns 
 */
const concatAll = (arr, fn) => {
	let result = [];
	for (let value of arr) {//value是子数组
		result.push.apply(result, value)
	}
	return result;
}

/**
 * 按顺序通过fn处理每个元素，将结果作为下一次处理的入参数，依次执行到最后，最终返回处理后的结果
 * @param {*} array 
 * @param {*} fn 
 * @returns 
 */
const reduce1 = (array, fn) => {
	let accumlator = 0;

	for (const value of array) {
		accumlator = fn(accumlator, value)
	}

	return accumlator
}

/**
 * 按顺序通过fn处理每个元素，将结果作为下一次处理的入参数，依次执行到最后，最终返回处理后的结果
 * 支持：默认初始值
 * @param {*} array 
 * @param {*} fn 
 * @param {*} initialValue 
 * @returns 
 */
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

	return accumlator
}

/**
 * 将2个数组合并成一个数组
 * @param {*} leftArr 
 * @param {*} rightArr 
 * @param {*} fn 
 * @returns 
 */
const zip = (leftArr, rightArr, fn) => {
	let index, results = [];

	for (index = 0; index < Math.min(leftArr.length, rightArr.length); index++) {
		results.push(fn(leftArr[index], rightArr[index]));
	}

	return results;
}

/**
 * 柯里化函数 仅接受2个函数参数
 * 将多参转成只有一个参数的高级函数
 * @param {*} binaryFn 
 * @returns 
 */
const curry = (binaryFn) => {
	return function (firstArg) {
		return function (secondArg) {
			return binaryFn(firstArg, secondArg);
		};
	};
};

/**
 * 柯里化函数 仅接受任意个函数参数
 * 将多参转成只有一个参数的高级函数
 * @param {*} fn 
 * @returns 
 */
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
 * 特点：动态控制赋值参数，最终赋满参数后执行fn
 * 作用：将多参数转成单参数的函数
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

/**
 * compose 组合函数
 * 特点：接收2个函数，然后返回一个函数c, 函数逆序执行(从右往左执行参数函数)
 * @param {*} a 
 * @param {*} b 
 * @returns 
 */
const compose = function (a, b) {
	return (c) => {
		return a(b(c));
	};
}

/**
 * compose 组合函数
 * 支持多参数函数组合
 * @param  {...any} fns 
 * @returns 
 */
const composeN = function (...fns) {
	return (value) => {
		return reduce(fns.reverse(), (acc, fn) => fn(acc), value);
	}
}

/**
 * pipe 是compseN的复制品，只是执行顺序是从左至右执行参数函数
 * @param  {...any} fns 
 * @returns 
 */
const pipe = (...fns) => {
	return (value) => {
		return reduce(fns, (acc, fn) => fn(acc), value);
	}
}

/**
 * 函子 - 基本版
 * @param {*} val 
 */
const Container = function (val) {
	this.value = val;
}

Container.of = function (value) {
	return new Container(value);
}

Container.prototype.map = function (fn) {
	return Container.of(fn(this.value));
}

/**
 * MayBe - 函子
 * @param {*} val 
 */
const MayBe = function (val) {
	this.value = val;
}

MayBe.of = function (val) {
	return new MayBe(val);
}

MayBe.prototype.isNothing = function () {
	return (this.value === null || this.value === undefined);
};

MayBe.prototype.map = function (fn) {
	//! 关键代码：如果为非法值直接返回空，跳过fn调用避免报错
	return this.isNothing() ? MayBe.of(null) : MayBe.of(fn(this.value));
};

MayBe.prototype.join = function () {
	return this.isNothing() ? MayBe.of(null) : this.value;
}

MayBe.prototype.chain = function (f) {
	return this.map(f).join();
}

const Nothing = function (val) {
	this.value = val;
};

Nothing.of = function (val) {
	return new Nothing(val);
};

Nothing.prototype.map = function (f) {
	//! 注意Nothing map 什么事都不做
	return this;
};

const Some = function (val) {
	this.value = val;
};

Some.of = function (val) {
	return new Some(val);
};

Some.prototype.map = function (fn) {
	return Some.of(fn(this.value));
}

const Either = {
	Some: Some,
	Nothing: Nothing
}

export {
	forEach, every, some, tap, unary, once, menolized,
	map, filter, concatAll, reduce1, reduce, zip,
	curry, curryN, partial,
	compose, composeN, pipe,
	Container, MayBe, Some, Nothing, Either
}
