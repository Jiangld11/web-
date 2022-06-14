
import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle, useMemo } from "react";
import PropTypes from "prop-types"
import BScroll from "better-scroll"
import Loading from '../loading/index';
import LoadingV2 from '../loading-v2';
import { debounce } from "../../api/utils";
import styled from 'styled-components';

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;
const PullUpLoading = styled.div`
  position: absolute;
  left:0; right:0;
  bottom: 5px;
  width: 60px;
  height: 60px;
  margin: auto;
  z-index: 100;
`;

export const PullDownLoading = styled.div`
  position: absolute;
  left:0; right:0;
  top: 0px;
  height: 30px;
  margin: auto;
  z-index: 100;
`;
//获取原生DOM对象，向上层组件暴露调用ref
const Scroll = forwardRef((props, ref) => {
    //better-scroll 实例对象
    const [bScroll, setBScroll] = useState();
    //current 指向初始化 bs 实例需要的 DOM 元素 
    const scrollContaninerRef = useRef(); //简历 scroll引用
    // 获取各种状态开启
    const { direction, click, refresh, bounceTop, bounceBottom, pullUpLoading, pullDownLoading } = props;
    // 获取上拉加载 下拉刷新的滚动的回调
    const { pullUp, pullDown, onScroll } = props;

    //上滑防抖
    const pullUpDebounce = useMemo(() => {
        return debounce(pullUp, 300)
    }, [pullUp])
    //下拉防抖
    const pullDownDebounce = useMemo(() => {
        return debounce(pullDown, 300)
    }, [pullDown])

    //初始化scroll实例 
    useEffect(() => {
        const scroll = new BScroll(scrollContaninerRef.current, {
            scrollX: direction === "horizental",
            scrollY: direction === "vertical",
            probeType: 3,
            click: click,
            bounce: {
                top: bounceTop,
                bottom: bounceBottom
            }
        });
        setBScroll(scroll);//初始化Scroll实例
        return () => {
            setBScroll(null);//清空scroll 
        }
        // eslint-disable-next-line
    }, [])
    //滚动中的监听
    useEffect(() => {
        if (!bScroll || !onScroll) return;
        bScroll.on('scroll', (scroll) => {
            onScroll(scroll);
        })
        return () => {
            bScroll.off('scroll');
        }
    }, [onScroll, bScroll]);
    //每次重新渲染都要刷新实例，防止无法滑动
    useEffect(() => {
        if (refresh && bScroll) {
            bScroll.refresh();
        }
    });
    //上拉到底加载更多
    useEffect(() => {
        if (!bScroll || !pullUp) return;
        bScroll.on('scrollEnd', () => {
            // 判断是否滑动到了底部
            if (bScroll.y <= bScroll.maxScrollY + 100) {
                pullUpDebounce();
            }
        });
        return () => {
            bScroll.off('scrollEnd');
        }
    }, [pullUp, pullUpDebounce, bScroll]);
    //进行下拉的判断，调用下拉刷新的函数
    useEffect(() => {
        if (!bScroll || !pullDown) return;
        bScroll.on('touchEnd', (pos) => {
            // 判断用户的下拉动作
            if (pos.y > 50) {
                pullDownDebounce();
            }
        });
        return () => {
            bScroll.off('touchEnd');
        }
    }, [pullDown, pullDownDebounce, bScroll]);
    // 一般和 forwardRef 一起使用，ref 已经在 forWardRef 中默认传入
    useImperativeHandle(ref, () => ({
        // 给外界暴露 refresh 方法
        refresh() {
            if (bScroll) {
                bScroll.refresh();
                bScroll.scrollTo(0, 0);
            }
        },
        // 给外界暴露 getBScroll 方法，提供 bs 实例
        getBScroll() {
            if (bScroll) {
                return bScroll;
            }
        }
    }));
    const PullUpdisplayStyle = pullUpLoading ? { display: "" } : { display: "none" };
    const PullDowndisplayStyle = pullDownLoading ? { display: "" } : { display: "none" };
    return (
        <ScrollContainer ref={scrollContaninerRef}>
            {props.children}
            {/* 滑到底部加载动画 */}
            <PullUpLoading style={PullUpdisplayStyle}><Loading></Loading></PullUpLoading>
            {/* 顶部下拉刷新动画 */}
            <PullDownLoading style={PullDowndisplayStyle}><LoadingV2></LoadingV2></PullDownLoading>
        </ScrollContainer>
    );
})

export default Scroll;
Scroll.defaultProps = {
    direction: "vertical", //默认是纵向滚动
    click: true,
    refresh: true,
    onScroll: null,
    pullUpLoading: false,
    pullDownLoading: false,
    pullUp: null,
    pullDown: null,
    bounceTop: true,
    bounceBottom: true
};
Scroll.propTypes = {
    direction: PropTypes.oneOf(['vertical', 'horizental']),// 滚动的方向
    click: true,// 是否支持点击
    refresh: PropTypes.bool,// 是否刷新
    onScroll: PropTypes.func,// 滑动触发的回调函数
    pullUp: PropTypes.func,// 上拉加载逻辑
    pullDown: PropTypes.func,// 下拉刷新逻辑
    pullUpLoading: PropTypes.bool,// 是否显示上拉 loading 动画
    pullDownLoading: PropTypes.bool,// 是否显示下拉 loading 动画
    bounceTop: PropTypes.bool,// 是否支持向上吸顶
    bounceBottom: PropTypes.bool// 是否支持向下吸底
}