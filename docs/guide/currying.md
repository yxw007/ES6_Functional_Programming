# 柯里化应用

## 定义

柯里化是把一个多参函数转成只有1个参数的嵌套函数的过程(1个参数的函数称一元函数)

## 示例1：add

```jsx
const add = (a, b) => a + b;

//add 柯里化版本
const addCurried = a => b => a + b;
const fn = addCurried(4)
console.log(fn);
//fn: b => a + b

//相当于执行上面的匿名函数(b)=>4+b,4+3=7,所以就是输出7
let r1 = addCurried(4)(3);
console.log(r1);
//7

//add具有a和b的二元函数
let autoCurried = curry(add)
autoCurried(2)(3)
//=> 5
```

## 示例2：创建表格

- 常用代码
    
    ```jsx
    //示例
    const tableOf2 = (y) => 2 * y;
    const tableOf3 = (y) => 3 * y;
    
    //生成表格
    console.log(tableOf2(2));
    //=> 2 * 2 = 4
    
    console.log(tableOf3(3));
    //=> 3 * 3 = 9
    ```
    
- 柯里化版
    
    ```jsx
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
    ```
    

## 示例3：日志函数

- 常用代码
    
    ```jsx
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
    
    loggerHelper("ERROR", "Error At Stats.js", "Error message", 21);
    loggerHelper("DEBUG", "Debug At Stats.js", "Debug message", 233);
    loggerHelper("WARN", "Warn At Stats.js", "Warn message", 24);
    ```
    
    问题：每次打印日志都要填写每个参数，使用起来非常不方便
    
- 柯里化应用
    
    ```jsx
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
    ```
    
    ```jsx
    let errorLogger = curryN(loggerHelper)("ERROR")("Error At Stats.js");
    let debugLogger = curryN(loggerHelper)("DEBUG")("Debug At Stats.js");
    let warnLogger = curryN(loggerHelper)("WARN")("Warn At Stats.js");
    
    //for error
    errorLogger("Error message", 21)
    
    //for debug
    debugLogger("Debug message", 233)
    
    //for warn
    warnLogger("Warn message", 34)
    ```
    
    柯里化解决此问题：将前面2个参数利用闭包缓存掉，接下来就只需要传递一个参数即可
    

## 示例4：从数组中寻找包含数字的元素

```jsx
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
```

真是利用柯里可以更加灵活的组合函数

## 示例5：偏函数应用timeout

- 柯里化版本
    
    ```jsx
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
    ```
    
    > 注意：由于柯里化curryN参数是顺序的，所以需要用setTimeoutWrapper包裹一层来调换参数顺序
    > 
- 用偏函数partial 优化
    
    ```jsx
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
    ```
    
    ```jsx
    //! 传递部分参数，未传的参数用undefined占位
    	let delayTenMsPartial = partial(setTimeout, undefined, 10);
    	delayTenMsPartial(() => {
    		console.log("Do X. . .  task");
    		resolve();
    	})
    ```
    
    > 注意：此时就只需要用undefined占位，然后再后面调用函数按占位顺序赋值参数即可
    > 

## 示例6：用偏函数partial应用json序列化

```jsx
//! 用undefined占位第1个参数，后2个参数固定
	let prettyPrintJson = partial(JSON.stringify, undefined, null, 2)
	console.log("JSON pretty print via partial", prettyPrintJson({ foo: "bar", bar: "foo" }))
```

## 总结

- 顺序参数，利用柯里化函数简化传参
- 动态传参，利用偏函数简化传参