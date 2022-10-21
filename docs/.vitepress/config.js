export default {
	title: "Functional Programming",
	description: "函数式编程学习",
	base: '/ES6_Functional_Programming/',
	themeConfig: {
		nav: nav(),
		sidebar: {
			'/guide/': slidebarGuide()
		}
	}
}

function nav() {
	return [
		{
			text: "笔记", link: '/guide/higher-order-functions', activeMatch: "/guide/"
		}
	];
}

function slidebarGuide() {
	return [
		{
			text: "笔记",
			collapsible: false,
			items: [
				{ text: "高级函数", link: "/guide/higher-order-functions" },
				{ text: "数组的函数式编程", link: "/guide/array-functional" },
				{ text: "柯里化应用", link: "/guide/currying" },
				{ text: "组合", link: "/guide/combination" },
				{ text: "函子", link: "/guide/functor" }
			]
		}
	]
}
