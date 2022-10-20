# 数组的函数式编程

## 示例：map

```jsx
//遍历调用处理函数，然后将结果缓存只result中，最终返回result
const map = (array, fn) => {
	let results = []
	for (const value of array)
		results.push(fn(value))
	return results;
}

let ret = map([1, 2, 3], (it) => it * it);
//=> [1, 4, 9]
```

## 示例：filter

```jsx
//遍历处理每个值，fn(value)如果满足过滤处理函数就将其放入结果result中，最终返回result
const filter = (array, fn) => {
		let results = []
		for (const value of array)
			(fn(value)) ? results.push(value) : undefined
		return results;
	}

	let ret = filter([1, 2, 4], (it) => it > 2);
	console.log(ret);
	//=> 4
```

## 示例：concatAll

把嵌套数组连接到一个数组中，扁平处理

```jsx
const concatAll = (arr, fn) => {
	let result = [];
	for (let value of arr) {//value是子数组
		result.push.apply(result, value)
	}
	return result;
}

let apressBooks = [
	{
		name: "beginners",
		bookDetails: [
			{
				"id": 111,
				"title": "C# 6.0",
			},
		]
	},
	{
		name: "pro",
		bookDetails: [
			{
				"id": 333,
				"title": "Pro AngularJS",
			},
		]
	}
];

let mapArr = map(apressBooks, (book) => {
	return book.bookDetails
});
console.log("mapArr:", mapArr);
//! 返回2层嵌套结果
//mapArr: [[ { id: 111, title: 'C# 6.0' } ],  [ { id: 333, title: 'Pro AngularJS' } ]]

console.log('Flattend Array:', concatAll(mapArr))
//! 返回1层扁平结构
//Flattend Array: [ { id: 111, title: 'C# 6.0' }, { id: 333, title: 'Pro AngularJS' } ]
```

这样即将上面的2层嵌套的数组转成一维数组，这样就更加方便的使用数据了

## 示例：reduce

遍历数组每个元素，将元素accumulator和value作为fn入参，执行fn函数处理后将结果缓存至accumulator，依次处理下去最终返回[accumlator]

```jsx
const reduce = (array, fn) => {
	let accumlator = 0;

	for (const value of array) {
		accumlator = fn(accumlator, value)
	}

	return accumlator
}
```

```jsx
//实现一个求和demo
reduce([1, 2, 3], (accumlator, it) => accumlator + it);
=> 6

//问题：accumlator初始值不能内置默认，需要由外部传入，否则会导致求乘积失败
reduce([1, 2, 3], (accumlator, it) => accumlator * it);
=> 0

//原因：accumlator初始值是0，所以最终结果为0
```

优化版本

```jsx
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
```

如果传了initValue就使用其作为accumulator初始值，然后遍历处理。否者将第一项作为accumulator作为初始值，然后从第二项开始遍历处理

```jsx

reduce([1, 2, 3], (accumlator, it) => accumlator * it, 1)
=> 6

//上面的求乘积的问题就解决了
```

## 示例：zip

将两个数组合并成一个数组，以较短的数组进行遍历，然后利用fn进行2个数组元素的合并处理，然后将处理结果push至result数组中，最后返回results

```jsx
const zip = (leftArr, rightArr, fn) => {
	let index, results = [];

	for (index = 0; index < Math.min(leftArr.length, rightArr.length); index++) {
		results.push(fn(leftArr[index], rightArr[index]));
	}

	return results;
}
```

```jsx
zip([1, 2], [3, 4, 5], (x, y) => x + y);
=>[4,6]
```