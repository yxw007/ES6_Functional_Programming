<h1 align="center">函数式编程实践</h1>

<p align="center">
	<img alt="GitHub Workflow Status (branch)" src="https://img.shields.io/github/workflow/status/yxw007/ES6_Functional_Programming/CI/master?label=CI" />
	<img src="https://img.shields.io/npm/v/vitepress?label=vitepress" />
</p>

<!-- omit in toc -->
## 目录
- [背景](#背景)
- [项目结构](#项目结构)
- [快速开始](#快速开始)
- [使用](#使用)
- [参考资料](#参考资料)
- [许可证](#许可证)
 
 ## 背景

我虽然看完了JS红宝书，但是在js编程方式上总感觉还是缺点什么，于是在网友的推荐下，阅读了[**JavaScript ES6 函数式编程入门经典**](https://book.douban.com/subject/30180100/) 豆瓣评分：8.4，本书电子书在book目录中，推荐大家读读

## 项目结构

```
|-- src
|   |-- lib                                     实现源码
|   |   `-- es6-functional.js		
|   |-- helper.js                               测试辅助
|   |-- 5.函子                                  函子相关demo
|   |   `-- index.js
|   |-- 4.组合与管道                             组合与管道相关demo
|   |   `-- index.js
|   |-- 3.柯里化                                柯里化相关demo
|   |   `-- index.js
|   |-- 2.数组函数式编程                         数组函数相关demo
|   |   `-- index.js
|   `-- 1.高阶函数                              高阶函数相关demo
|       `-- index.js
|-- docs                                       在线笔记文档目录
|   `-- guide
`-- book											
    `-- 《JavaScript ES6函数式编程入门经典》_Anto Aravinth_梁宵_201801.pdf
```

**在线笔记文档：https://yanxuewen.cn/ES6_Functional_Programming/** 


## 快速开始

- 安装依赖

```
pnpm install
```
- 运行
```
pnpm docs:dev
```
- 打包
```
pnpm docs:build
```

## 使用

安装node.js后，直接在需要的测试地方，点击代码运行即可看到测试结果

## 参考资料
- https://github.com/antsmartian/functional-es8

## 许可证

MIT © 2022 Potter
