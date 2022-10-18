import { autoRun } from '../helper.js'
import { map, filter, concatAll, reduce1, reduce, zip } from '../lib/es6-functional.js'

autoRun("1.map", () => {
	let ret = map([1, 2, 3], (it) => it * it);
	console.log(ret);
	//=> [1, 4, 9]
});

autoRun("2.filter", () => {
	let ret = filter([1, 2, 4], (it) => it > 2);
	console.log(ret);
	//=> [4]
});

autoRun("3.concatAll", () => {
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

	//! 返回2层嵌套结果[[]]
	let mapArr = map(apressBooks, (book) => {
		return book.bookDetails
	});
	console.log("mapArr:", mapArr);

	//! 返回1层扁平结构
	console.log('Flattend Array:', concatAll(mapArr))
});

autoRun("4.reduce", () => {
	let r1 = reduce1([1, 2, 3], (accumlator, it) => accumlator + it);
	console.log("r1:", r1);

	let r2 = reduce1([1, 2, 3], (accumlator, it) => accumlator * it);
	console.log("r2:", r2);

	console.log(reduce([1, 2, 3], (accumlator, it) => accumlator * it, 1));
});

autoRun("5.zip", () => {
	let r = zip([1, 2], [3, 4, 5], (x, y) => x + y);
	console.log(r);
});
