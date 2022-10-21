# 组合

---

# 1. 利用 compose 优化处理过程

```jsx
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
```

# 2.无法直接利用compose,通过partial转换后再使用compose

```jsx
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
```

## 3. 多参函数compose使用

```jsx
/**
 * 支持多参数的compose
 * @param  {...any} fns 
 * @returns 
 */
const composeN = function (...fns) {
	return (value) => {
		return reduce(fns.reverse(), (acc, fn) => fn(acc), value);
	}
}

//判断奇偶
let oddOrEven = (ip) => ip % 2 == 0 ? "even" : "odd"

//用空格分割字符串
let splitIntoSpaces = (str) => str.split(" ");

//计算长度
let count = (array) => array.length;

//! 从右往左执行每个函数
var oddOrEvenWords = composeN(oddOrEven, count, splitIntoSpaces);
console.log("Even or odd via pipe ?", oddOrEvenWords("hello your reading about composition"))

var oddOrEvenWordsR = composeN(oddOrEven,composeN(count,splitIntoSpaces));
var oddOrEvenWordsL = composeN(composeN(oddOrEven,count),splitIntoSpaces));
```

> 利用compose灵活的组合函数，可以轻松更加复杂的处理函数
> 

## 4. 管道pipe 实现及应用

类似Unix 的命令执行中的“|”，从左到右处理数据流的过程成为管道。比如：ps -ef | grep nginx

```jsx
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

//判断奇偶
let oddOrEven = (ip) => ip % 2 == 0 ? "even" : "odd"

//用空格分割字符串
let splitIntoSpaces = (str) => str.split(" ");

//计算长度
let count = (array) => array.length;

//! 从左往执行执行每个函数,每个函数的返回值是下一个函数的参数
let oddOrEvenWords = pipe(splitIntoSpaces, count, oddOrEven);
console.log("Even or odd via pipe ?", oddOrEvenWords("hello your reading about composition"))
//Even or odd via pipe ? 'odd'
```

## 5.  利用compose打印中间值，调试复杂的compose函数

```jsx
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
```

# 总结

- pipe和compose做事完全一样，只是处理数据流方向不同而已
- compose满足结合律

# 参考文献

- 

> 以上：如发现有问题，欢迎留言指出，我及时更正
>