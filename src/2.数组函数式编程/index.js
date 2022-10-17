import { autoRun } from '../helper.js'

autoRun("1.map", () => {
	const map = (array, fn) => {
		let results = []
		for (const value of array)
			results.push(fn(value))
		return results;
	}

	let ret = map([1, 2, 3], (it) => it * it);
	console.log(ret);
	//=> [1, 4, 9]
});

autoRun("2.filter", () => {
	const filter = (array, fn) => {
		let results = []
		for (const value of array)
			(fn(value)) ? results.push(value) : undefined
		return results;
	}

	let ret = filter([1, 2, 4], (it) => it > 2);
	console.log(ret);
	//=> [4]
});

autoRun("3.concatAll", () => {
	const concatAll = (arr, fn) => {
		let result = [];
		for (let value of arr) {//value是子数组
			result.push.apply(result, value)
		}
	}

	let appBooks = [{}];
	let ret = concatAll(appBooks,()=>{
		
	});

	[[{
		id: 111,
		title: 'C# 6.0',
		author: ' ANDREW TROELSEN',
		rating: [object],
		reviews: [object]
	},
	{
		id: 222,
		title: 'Efficient Learning Machines ',
		author: 'Rahul Khanna',
		rating: [object],
		reviews: []
	}],
	[{
		id: 333,
		title: 'Pro AngularJS',
		author: 'Adam Freeman',
		rating: [object],
		reviews: []
	},
	{
		id: 444,
		title: 'Pro ASP. NET',
		author: 'Adam Freeman',
		rating: [object],
		reviews: [object]
	}]]

});
