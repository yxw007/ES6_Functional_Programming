import { autoRun } from '../helper.js'
import { compose, composeN, pipe, filter, map, partial } from '../lib/es6-functional.js'

let apressBooks = [
	{
		"id": 111,
		"title": "C# 6.0",
		"author": "ANDREW TROELSEN",
		"rating": [4.7],
		"reviews": [{ good: 4, excellent: 12 }]
	},
	{
		"id": 222,
		"title": "Efficient Learning Machines",
		"author": "Rahul Khanna",
		"rating": [4.5],
		"reviews": []
	},
	{
		"id": 333,
		"title": "Pro AngularJS",
		"author": "Adam Freeman",
		"rating": [4.0],
		"reviews": []
	},
	{
		"id": 444,
		"title": "Pro ASP.NET",
		"author": "Adam Freeman",
		"rating": [4.2],
		"reviews": [{ good: 14, excellent: 12 }]
	}
];

autoRun("1.compose 简单使用", () => {
	let data = parseFloat("3.56");
	let number = Math.round(data);
	console.log(data);
	//3.56
	console.log(number);
	//4

	//! 利用compose将round和parseFloat组合成一个函数，然后执行新函数
	let cNumber = compose(Math.round, parseFloat);
	let rNumber = cNumber("3.56");
	console.log(rNumber);
	//4

	//! 可以看到通过compose可以使处理过程更简单，使用更加方便
});

autoRun("2.无法直接利用compose,通过partial转换后再使用compose", () => {
	//获取评分大于4.5的书
	let filterGoodBooks = (book) => book.rating[0] > 4.5;
	//仅返回书的title和author字段
	let projectTitleAndAuthor = (book) => { return { title: book.title, author: book.author } }

	//! 由于compose只接受1个参数，所以不能直接组合接收2个参数的filter和map，需要利用partial转化
	let queryGoodBooks = partial(filter, undefined, filterGoodBooks);
	let mapTitleAndAuthor = partial(map, undefined, projectTitleAndAuthor);

	let titleAndAuthorForGoodBooks = compose(mapTitleAndAuthor, queryGoodBooks);
	console.log("Good book title and author via compose", titleAndAuthorForGoodBooks(apressBooks))
	//Good book title and author via compose [ { title: 'C# 6.0', author: 'ANDREW TROELSEN' } ]
});

autoRun("3.多参函数compose使用", () => {
	//判断奇偶
	let oddOrEven = (ip) => ip % 2 == 0 ? "even" : "odd"

	//用空格分割字符串
	let splitIntoSpaces = (str) => str.split(" ");

	//计算长度
	let count = (array) => array.length;

	//! 从右往左执行每个函数,每个函数的返回值是下一个函数的参数
	let oddOrEvenWords = composeN(oddOrEven, count, splitIntoSpaces);
	console.log("Even or odd via pipe ?", oddOrEvenWords("hello your reading about composition"))
	//Even or odd via pipe ? [ 'odd' ]

	//! 组合满足结合律
	//右结合
	var oddOrEvenWordsR = composeN(oddOrEven, composeN(count, splitIntoSpaces));
	console.log("Even or odd via pipe ?", oddOrEvenWordsR("hello your reading about composition"))
	//左结合
	var oddOrEvenWordsL = composeN(composeN(oddOrEven, count), splitIntoSpaces);
	console.log("Even or odd via pipe ?", oddOrEvenWordsL("hello your reading about composition"))
});

autoRun("4.管道pipe函数的使用", () => {
	//判断奇偶
	let oddOrEven = (ip) => ip % 2 == 0 ? "even" : "odd"

	//用空格分割字符串
	let splitIntoSpaces = (str) => str.split(" ");

	//计算长度
	let count = (array) => array.length;

	//! 从左往执行执行每个函数,每个函数的返回值是下一个函数的参数
	let oddOrEvenWords = pipe(splitIntoSpaces, count, oddOrEven);
	console.log("Even or odd via pipe ?", oddOrEvenWords("hello your reading about composition"))
	//Even or odd via pipe ? [ 'odd' ]
});

autoRun("5.利用compose打印中间值，调试复杂的compose函数", () => {
	//! 定义调试函数，仅仅打印参数，然后返回参数
	const identity = (it) => {
		console.log(it);
		return it
	}

	//判断奇偶
	let oddOrEven = (ip) => ip % 2 == 0 ? "even" : "odd"

	//用空格分割字符串
	let splitIntoSpaces = (str) => str.split(" ");

	//计算长度
	let count = (array) => array.length;

	//! 需要查看哪个函数处理结果，就将identity放置哪个函数前面(因为：数据是从右往左执行的)
	console.log("Debugging", composeN(oddOrEven, count, identity, splitIntoSpaces)("Test string"))
});
