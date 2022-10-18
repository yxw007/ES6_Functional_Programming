import { autoRun } from '../helper.js'
import { forEach, every, some, tap, unary, once, menolized } from "../lib/es6-functional.js";

autoRun("1.foreach", () => {
	//! 这样无需关系不用管forEach如何遍历的，forEach即做到具体逻辑的抽象
	forEach([1, 2, 3], (item) => {
		console.log(item)
	});
});

autoRun("2.every", () => {
	console.log(every([NaN, NaN, NaN], isNaN));
	console.log(every([NaN, 4], isNaN));
});

autoRun("3.some", () => {
	console.log(some([NaN, NaN, NaN], isNaN));
	console.log(some([NaN, 4], isNaN));
});

autoRun("4.tap", () => {
	tap("fun")((it) => {
		console.log("value is", it)
	})
});

autoRun("5.map", () => {
	let r1 = [1, 2, 3].map(it => it * 2)
	console.log("r1:", r1);
	//output=> r1: [ 2, 4, 6 ]

	let r2 = ['1', '2'].map(parseInt);
	console.log("r2:", r2);
	//output=>r2: [ 1, NaN ]
	//! 非预期结果，只转换了一个参数

	//! 利用unary将多参转成只接收一个参数的函数
	let r3 = ['1', '2'].map(unary(parseInt))
	console.log("r3:", r3);
	//output=>r3: [ 1, 2 ]
});

autoRun("6.once", () => {
	var doPayment = once(() => {
		return "Payment is done";
	})

	console.log(doPayment());
	//=> Payment is done

	console.log(doPayment());
	//=> undefined
});

autoRun("7.menolized", () => {
	let fastFactorial = menolized((n) => {
		if (n === 0) {
			return 1;
		}
		return n * fastFactorial(n - 1);
	});

	console.log(fastFactorial(5));

	fastFactorial(5)
	// => 120

	// => lookupTable将为: object { 0: 1, 1: 1, 2: 2, 3: 6, 4: 24, 5: 120 }
	fastFactorial(3)

	//=> 6 //从lookupTable中返回
	fastFactorial(7)
	//=> 5040
	// => lookupTable将为: object {
	// 		0: 1, 1: 1, 2: 2, 3: 6, 4: 24, 5: 120,
	// 			6: 720, 7: 5040
	// 	}
});
