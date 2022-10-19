import { Container, MayBe } from '../lib/es6-functional.js'
import { autoRun } from '../helper.js'

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
});
