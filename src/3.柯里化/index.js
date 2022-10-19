import { autoRun, autoRunPromise } from '../helper.js';
import { curry, curryN, partial } from '../lib/es6-functional.js';

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

autoRun("6.从数组中寻找包含数字的元素", () => {
	//1.定义柯里化匹配函数
	let match = curryN((expr, str) => {
		return str.match(expr);
	});

	//2.赋值match第1个参数
	let hasNumber = match(/[0-9]+/);

	//3.定义科里化过滤函数
	let filter = curryN((fn, arr) => {
		return arr.filter(fn);
	});

	//4.定义过滤函数
	let findNumbersInArray = filter(hasNumber);
	console.log("Finding numbers via curry", findNumbersInArray(["js", "number1"]))
	//Finding numbers via curry [ 'number1' ]
})

autoRun("7.求平方", () => {
	let map = curry(function (f, ary) {
		return ary.map(f);
	});

	let squareAll = map((x) => x * x);
	console.log("Squaring the array with currying", squareAll([1, 2, 3]))
	//Squaring the array with currying [ 1, 4, 9 ]
})

await autoRunPromise("8.timeout", (resolve) => {
	setTimeout(() => console.log("Print after 10 ms."), 10);

	//! 由于setTimeout参数第1个是fn,第2个参数是time，所以不能直接用curryN 需用函数包裹一层
	const setTimeoutWrapper = (time, fn) => {
		setTimeout(fn, time);
	}

	//赋值第1个参数
	const delayTenMs = curryN(setTimeoutWrapper)(10);

	//传第二个参数fn，调用执行
	delayTenMs(() => {
		console.log("Do X task");
		resolve();
	})
});

await autoRunPromise("9.用偏函数partial应用timeout示例", (resolve) => {
	//! 传递部分参数，未传的参数用undefined占位
	let delayTenMsPartial = partial(setTimeout, undefined, 10);
	delayTenMsPartial(() => {
		console.log("Do X. . .  task");
		resolve();
	})
});

autoRun("10.用偏函数partial应用json序列化", () => {
	//! 用undefined占位第1个参数，后2个参数固定
	let prettyPrintJson = partial(JSON.stringify, undefined, null, 2)
	console.log("JSON pretty print via partial", prettyPrintJson({ foo: "bar", bar: "foo" }))
});
