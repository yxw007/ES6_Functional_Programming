# 高阶函数

高阶函数就是定义抽象函数，常用于解决抽象问题

## 定义

高阶函数接收函数参数并且或者返回函数

## 示例1：forEach

```jsx
const forEach = (arr, fn) => {
	for (let i = 0; i < arr.length; i++) {
		fn(arr[i])
	}
}

//! 这样无需关系不用管forEach如何遍历的，forEach即做到具体逻辑的抽象
forEach([1, 2, 3], (item) => {
	console.log(item)
});
```

## 示例2：every

每一个函数都返回true最终结果才为true

```jsx
const every = (arr, fn) => {
	let result = true;
	for (let i = 0; i < arr.length; i++)
		result = result && fn(arr[i])
	return result
}

every([NaN,NaN,NaN],isNaN)
=> true
every([NaN,4],isNaN)
=> false
```

## 示例3：some

只要一个结果返回true，结果就为true

```jsx
const some = (arr, fn) => {
		let result = false;
		for (const value of arr)
			result = result || fn(value)
		return result
	}

some([NaN,NaN,NaN],isNaN)
=> true
some([NaN,4],isNaN)
=> true
```

## 真实高级函数: tap

接收一个value参数，返回一个附带闭包value的函数

```jsx
const tap = (value) =>
		(fn) => (
			typeof (fn) === 'function' && fn(value),
			console.log(value)
		);

tap("fun")((it)=>{console.log("value is",it)})
=> value is fun
=> fun
```

## 真实高阶函数：unary

```jsx
[1,2,3].map(it=>it*2)
=>[2,4,6]

['1','2'].map(parseInt)
=>[1,NaN]

 //非预期结果，只转换了一个参数
利用unary将多参转成只接收一个参数的函数
const unary = (fn)=>{
  return fn.length === 1 ? fn : (args)=>fn(args)

['1','2'].map(unary(parseInt))
=>[1,2]
```

## 真实高阶：once

利用闭包存了一个done，只要调用过一次函数就将done设置为true，返回函数结果，再次调用就返回undefined

```jsx
const once = (fn) => {
		let done = false;

		return function () {
			return done ? undefined : ((done = true), fn.apply(this, arguments))
		}
	}
```

比如支付场景就是如此，只要支付一次即可，下次就无需再支付了

```jsx
var doPayment = once(() => {
		return "Payment is done";
	})

console.log(doPayment());
//=> Payment is done

console.log(doPayment());
//=> undefined
```

## 真实场景：menolized

利用闭包变量缓存结果，让函数再次调用时直接从缓存中返回

```jsx
const menolized = (fn) => {
		const lookupTable = {};
		return (arg) => lookupTable[arg] || (lookupTable[arg] = fn(arg))
	}
```

```jsx
let fastFactorial = menolized((n) => {
	if (n === 0) {
		return 1;
	}
	return n * fastFactor(n - 1);
});
```

```jsx
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
```