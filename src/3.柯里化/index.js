import { autoRun } from '../helper.js';
import { curry, curryN } from '../lib/es6-functional.js';

const add = (a, b) => a + b;

autoRun("1.示例", () => {
	//add 柯里化版本
	const addCurried = a => b => a + b;
	const fn = addCurried(4)
	console.log(fn);
	//fn: b => a + b

	//相当于执行上面的匿名函数(b)=>4+b,4+3=7,所以就是输出7
	let r1 = addCurried(4)(3);
	console.log(r1);
	//7
});

autoRun("2.curry1", () => {
	//add具有a和b的二元函数
	let autoCurried = curry(add)
	autoCurried(2)(3)
	//=> 5

	//示例
	const tableOf2 = (y) => 2 * y;
	const tableOf3 = (y) => 3 * y;

	//生成表格
	console.log(tableOf2(2));
	//=> 2 * 2 = 4

	console.log(tableOf3(3));
	//=> 3 * 3 = 9
});

autoRun("3.curry2", () => {
	//把这个操作抽象化
	const genTab = (x, y) => x * y;

	//转成柯里化形式
	const tableOf2 = curry(genTab)(2)
	const tableOf3 = curry(genTab)(3)

	//生成表格
	console.log(tableOf2(2));
	//=> 2 * 2 = 4

	console.log(tableOf3(3));
	//=> 3 * 3 = 9
});

const loggerHelper = (mode, initialMessage, errorMessage, lineNo) => {
	if (mode === "DEBUG") {
		console.debug(initialMessage, errorMessage + "at line: " + lineNo)
	}
	else if (mode === "ERROR") {
		console.error(initialMessage, errorMessage + "at line: " + lineNo)
	}
	else if (mode === "WARN") {
		console.warn(initialMessage, errorMessage + "at line: " + lineNo)
	}
	else {
		throw "Wrong mode"
	}
}

autoRun("4.log1", () => {
	loggerHelper("ERROR", "Error At Stats.js", "Error message", 21);
	loggerHelper("DEBUG", "Debug At Stats.js", "Debug message", 233);
	loggerHelper("WARN", "Warn At Stats.js", "Warn message", 24);
});

autoRun("5.curryN", () => {
	let errorLogger = curryN(loggerHelper)("ERROR")("Error At Stats.js");
	let debugLogger = curryN(loggerHelper)("DEBUG")("Debug At Stats.js");
	let warnLogger = curryN(loggerHelper)("WARN")("Warn At Stats.js");

	//for error
	errorLogger("Error message", 21)

	//for debug
	debugLogger("Debug message", 233)

	//for warn
	warnLogger("Warn message", 34)
});
