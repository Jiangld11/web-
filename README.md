```
This project was bootstrapped with Create React App.
```

react hooks+redux+immutable.js 仿网易云音乐打造精美 webApp


打开方式:

将项目 clone 下来
$ git clone 
$ cd cloud-music
$ npm install


运行
$ npm run start
现在就在本地的 3000 端口访问了。如果要打包到线上，执行 npm run build 即可。

项目介绍:

说明:本项目参考网易云音乐安卓端 app 界面开发，基础 UI 绝大多数自己来构建，算是对自己的一个挑战，在这个过程也学到了不少设计经验。

功能介绍
1、推荐部分
首页推荐:

推荐歌单详情:

空中切入切出效果，另外还有随着滑动会产生和标题跑马灯效果。 在歌单中歌曲数量过多的情况下，做了分页处理，随着滚动不断进行上拉加载，防止大量 DOM 加载导致的页面卡顿。

2、歌手部分
歌手列表:

这里做了异步加载的处理，上拉到底进行新数据的获取，下拉则进行数据的重新加载。

歌手详情:

3、排行榜
榜单页:

榜单详情:

4、播放器
播放器内核:

播放列表:

会有移动端 app 一样的反弹效果。

5、搜索部分

项目部分模块分享
1、利用 better-scroll 打造超级好用的 scroll 基础组件
import React, { forwardRef, useState,useEffect, useRef, useImperativeHandle } from "react"
import PropTypes from "prop-types"
import BScroll from "better-scroll"
import styled from 'styled-components';
import { debounce } from "../../api/utils";

const ScrollContainer = styled.div` width: 100%; height: 100%; overflow: hidden;`

const Scroll = forwardRef((props, ref) => {
const [bScroll, setBScroll] = useState();

const scrollContaninerRef = useRef();

const { direction, click, refresh, pullUpLoading, pullDownLoading, bounceTop, bounceBottom } = props;

const { pullUp, pullDown, onScroll } = props;

useEffect(() => {
if(bScroll) return;
const scroll = new BScroll(scrollContaninerRef.current, {
scrollX: direction === "horizental",
scrollY: direction === "vertical",
probeType: 3,
click: click,
bounce:{
top: bounceTop,
bottom: bounceBottom
}
});
setBScroll(scroll);
if(pullUp) {
scroll.on('scrollEnd', () => {
//判断是否滑动到了底部
if(scroll.y <= scroll.maxScrollY + 100){
pullUp();
}
});
}
if(pullDown) {
scroll.on('touchEnd', (pos) => {
//判断用户的下拉动作
if(pos.y > 50) {
debounce(pullDown, 0)();
}
});
}

    if(onScroll) {
      scroll.on('scroll', (scroll) => {
        onScroll(scroll);
      })
    }

    if(refresh) {
      scroll.refresh();
    }
    return () => {
      scroll.off('scroll');
      setBScroll(null);
    }
    // eslint-disable-next-line

}, []);

useEffect(() => {
if(refresh && bScroll){
bScroll.refresh();
}
})

useImperativeHandle(ref, () => ({
refresh() {
if(bScroll) {
bScroll.refresh();
bScroll.scrollTo(0, 0);
}
}
}));

const PullUpdisplayStyle = pullUpLoading ? { display: "" } : { display: "none" };
const PullDowndisplayStyle = pullDownLoading ? { display: "" } : { display: "none" };
return (
<ScrollContainer ref={scrollContaninerRef}>
{props.children}
{/_ 滑到底部加载动画 _/}
<PullUpLoading style={ PullUpdisplayStyle }></PullUpLoading>
{/_ 顶部下拉刷新动画 _/}
<PullDownLoading style={ PullDowndisplayStyle }></PullDownLoading>
</ScrollContainer>
);
})

Scroll.defaultProps = {
direction: "vertical",
click: true,
refresh: true,
onScroll: null,
pullUpLoading: false,
pullDownLoading: false,
pullUp: () => {},
pullDown: () => {},
bounceTop: true,
bounceBottom: true
};

Scroll.propTypes = {
direction: PropTypes.oneOf(['vertical', 'horizental']),
refresh: PropTypes.bool,
onScroll: PropTypes.func,
pullUp: PropTypes.func,
pullDown: PropTypes.func,
pullUpLoading: PropTypes.bool,
pullDownLoading: PropTypes.bool,
bounceTop: PropTypes.bool,//是否支持向上吸顶
bounceBottom: PropTypes.bool//是否支持向上吸顶
};

export default React.memo(Scroll);
2、富有动感的 loading 组件
import React from 'react';
import styled, {keyframes} from 'styled-components';
import style from '../../assets/global-style'

const dance = keyframes` 0%, 40%, 100%{ transform: scaleY(0.4); transform-origin: center 100%; } 20%{ transform: scaleY(1); }`
const Loading = styled.div`height: 10px; width: 100%; margin: auto; text-align: center; font-size: 10px; >div{ display: inline-block; background-color: ${style["theme-color"]}; height: 100%; width: 1px; margin-right:2px; animation: ${dance} 1s infinite; } >div:nth-child(2) { animation-delay: -0.4s; } >div:nth-child(3) { animation-delay: -0.6s; } >div:nth-child(4) { animation-delay: -0.5s; } >div:nth-child(5) { animation-delay: -0.2s; }`

function LoadingV2() {
return (
<Loading>

<div></div>
<div></div>
<div></div>
<div></div>
<div></div>
<span>拼命加载中...</span>
</Loading>
);
}

export default LoadingV2;

3、模块懒加载及代码分割(CodeSpliting)
react 官方已经提供了相应的方案, 用 react 自带的 lazy 和 Suspense 即可完成。 操作如下:

import React, {lazy, Suspense} from 'react';
const HomeComponent = lazy(() => import("../application/Home/"));
const Home = (props) => {
return (
<Suspense fallback={null}>
<HomeComponent {...props}></HomeComponent>
</Suspense>
)
};
......
export default [
{
path: "/",
component: Home,
routes: [
{
path: "/",
exact: true,
render: ()=> (
<Redirect to={"/recommend"}/>
)
},
{
path: "/recommend/",
extra: true,
key: 'home',
component: Recommend,
routes:[{
path: '/recommend/:id',
component: Album,
}]
}
......
]
},

];


## 工程目录

├─api // 网路请求代码、工具类函数和相关配置
├─application // 项目核心功能
├─assets // 字体配置及全局样式
├─baseUI // 基础 UI 轮子
├─components // 可复用的 UI 组件
├─routes // 路由配置文件
└─store //redux 相关文件
App.js // 根组件
index.js // 入口文件
serviceWorker.js // PWA 离线应用配置
style.js // 默认样式

## Redux 结构

actionCreators.js// 放不同 action 的地方
constants.js // 常量集合，存放不同 action 的 type 值
index.js // 用来导出 reducer，action
reducer.js // 存放 initialState 和 reducer 函数

## 前端环境:

react v17.0.2 全家桶 (react，react-router) : 用于构建用户界面的 MVVM 框架
redux: 著名 JavaScript 状态管理容器
redux-thunk:
处理异步逻辑的 redux 中间件
immutable: Facebook 历时三年开发出的进行持久性数据结构处理的库
react-lazyload: react 懒加载库 better-scroll: 提升移动端滑动体验的知名库
styled-components: 处理样式，体现 css in js 的前端工程化神器
axios: 用来请求后端 api 的数据。
后端部分:

## 后端环境:

采用 github 上开源的 NodeJS 版 api 接口 NeteaseCloudMusicApi，提供音乐数据。在此特别鸣谢 Binaryify 大佬开源接口！

## 其他方面:

create-react-app: React 脚手架，快速搭建项目
eslint: 知名代码风格检查工具
iconfont: 阿里巴巴图标库
fastclick: 解决移动端点击延迟 300ms 的问题
