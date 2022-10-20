import { Container, MayBe, map, Either, Some, Nothing, compose } from '../lib/es6-functional.js'
import { autoRun, autoRunPromise } from '../helper.js'

autoRun("1.函子Container初始化", () => {
	let testValue = new Container(3)
	console.log("Value inside container", testValue)
	//Value inside container: Container { value: 3 }

	let testObj = new Container({ a: 1 })
	console.log("Object inside container", testObj)
	//Object inside container: Container { value: { a: 1 } }

	let testArray = new Container([1, 2])
	console.log("Array inside container", testArray)
	//Array inside container: Container { value: [ 1, 2 ] }
});

autoRun("2.函子Container 利用静态方法of初始化", () => {
	let testValue = Container.of(3)
	console.log("Value inside container:", testValue)
	//Value inside container: Container { value: 3 }

	let testObj = Container.of({ a: 1 })
	console.log("Object inside container:", testObj)
	//Object inside container: Container { value: { a: 1 } }

	let testArray = Container.of([1, 2])
	console.log("Array inside container:", testArray)
	//Array inside container: Container { value: [ 1, 2 ] }

	//嵌套of初始化
	console.log("Nested conatiner:", Container.of(Container.of(3)))
	//Nested conatiner: Container { value: Container { value: 3 } }
});

autoRun("3.函子Contianer 实现map方法", () => {
	let double = (x) => x + x;
	console.log("Double container: ", Container.of(3).map(double));
	//Double container: Container { value: 6 }

	//!可链式调用
	console.log(Container.of(3).map(double).map(double));
	//Container { value: 12 }
});

autoRun("4.Maybe函子, 自动处理掉非法值(null or undefined)的应用", () => {
	console.log("May Be Example:", MayBe.of("string").map((x) => x.toUpperCase()))
	//May Be Example MayBe { value: 'STRING' }

	//! 注意：此处传递的是一个null参数，函数也能正常执行不会导致报错
	console.log("May Be null example:", MayBe.of(null).map((x) => x.toUpperCase()))
	//May Be null example MayBe { value: null }

	//! 如果不利用MayBe我们需要进行大量判断，会知道代码变得臃肿，而且也不方便使用。利用MayBe我们就可以把判断隐藏起来
	/* 
		["1",null].map((x)=>{
			if(x !== null || x !== undefined){
				return x.toUpperCase();
			}
		});
	 */

	//! 无判空心智负担，可以随意链式调用
	console.log("MayBe chaining null", MayBe.of("George").map(() => undefined).map((x) => "Mr. " + x))
});

autoRun("5.Maybe真实示例", () => {
	//! 1. 通常这样请求数据
	let getTopTenSubRedditPosts = (type) => {
		let response
		try {
			//说明：由于此链接已无法访问，所以模拟处理请求
			// response = JSON.parse(request('GET', "https://www.reddit.com/r/subreddits/" + type + ".json?limit=10").getBody('utf8'))
			if (type === 'new') {
				response = {
					data:
					{
						children: [
							{
								data: {
									title: "title1",
									url: "https://baidu.com"
								}
							}
						]
					}
				};
			} else {
				throw { statusCode: 404 };
			}
		} catch (err) {
			response = { message: "Something went wrong", errorCode: err['statusCode'] }
		}
		return response
	}

	let res = getTopTenSubRedditPosts("new");
	console.log("res:", JSON.stringify(res));
	//res: {"data":{"children":[{"data":{"title":"title1","url":"https://baidu.com"}}]}}

	//! 2.利用Meybe优化代码，使代码更加健壮
	let getTopTenSubRedditPostsMeyBe = (type) => {
		let response = getTopTenSubRedditPosts(type);

		//! 无需考虑resposne数据是否为空
		return MayBe.of(response).map((arr) => arr['data'])
			.map((arr) => arr['children'])
			.map((arr) => map(arr, (x) => {
				return {
					title: x['data'].title,
					url: x['data'].url
				}
			}
			))
	}

	let res2 = getTopTenSubRedditPostsMeyBe("new");
	console.log("res2:", res2);
	//res2: MayBe { value: [ { title: 'title1', url: 'https://baidu.com' } ] }

	//! 遗留问题：MayBe无法确切的知道到底哪个分支出问题了,比如：不知道到底是哪个map出问题
	let handleFn = () => { return null };
	MayBe.of("George").map((name) => name.toUpperCase()).map(handleFn).map((x) => "Mr. " + x);
});

autoRun("6.利用MaybeJoin解决层级嵌套过深问题", () => {
	let joinExample = MayBe.of(MayBe.of(5));
	console.log(joinExample);
	//MayBe { value: MayBe { value: 5 } }

	console.log(joinExample.join());
	//MayBe { value: 5 }

	//让joinExample的value+4，如下写代码非常麻烦
	let r1 = joinExample.map((outSideMayBe) => {
		return outSideMayBe.map((value) => value + 4);
	});
	console.log("r1:", r1);
	//MayBe { value: MayBe { value: 5 } }

	//利用join简化代码
	let r2 = joinExample.join().map((v) => v + 4);
	console.log("r2:", r2);
	//r2: MayBe { value: 9 }
})

autoRun("7.利用MaybeJoin.chain 简化掉map.join过程", () => {
	let joinExample = MayBe.of([{ val: "a1" }, { val: "a2" }]);

	let r1 = joinExample.map((item) => {
		return MayBe.of(map(item, x => {
			return { name: x.val }
		}));
	}).join();
	console.log("r1:", r1);
	//r1: MayBe { value: [ { name: 'a1' }, { name: 'a2' } ] }

	//!用chain简化map和join的转换过程,将map和join封装成chain
	let r2 = joinExample.chain(item => {
		return MayBe.of(map(item, x => {
			return { name: x.val }
		}));
	});
	console.log("r2:", r2);
	//r2: MayBe { value: [{ name: 'a1' }, { name: 'a2' }] }
})

autoRun("8.利用Either处理分支错误问题", () => {
	//! 1. 通常这样请求数据
	let getTopTenSubRedditPostsEither = (type) => {
		let response
		try {
			//说明：由于此链接已无法访问，所以模拟处理请求
			// response = JSON.parse(request('GET', "https://www.reddit.com/r/subreddits/" + type + ".json?limit=10").getBody('utf8'))
			if (type === 'new') {
				response = Some.of({
					data: {
						children: [{
							data: {
								title: "title1",
								url: "https://baidu.com"
							}
						}]
					}
				});
			} else {
				throw { statusCode: 404 };
			}
		} catch (err) {
			response = Nothing.of({ message: "Something went wrong", errorCode: err['statusCode'] })
		}
		return response
	}

	let res = getTopTenSubRedditPostsEither("new");
	console.log("res:", res);
	//res: Some { value: { data: { children: [Array] } } }

	let res2 = getTopTenSubRedditPostsEither("test");
	console.log("res2:", res2);
	//res2: Nothing { value: { message: 'Something went wrong', errorCode: 404 } }
});
