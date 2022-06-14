import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import style from '../../assets/global-style';
import { prefixStyle } from './../../api/utils';

const ProgressBarWrapper = styled.div`
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, .3);
    .progress {
      position: absolute;
      height: 100%;
      background: ${style["theme-color"]};
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -15px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid ${style["border-color"]};
        border-radius: 50%;
        background: ${style["theme-color"]};
      }
    }
  }
`

function ProgressBar(props) {
    const { percent } = props;
    // 取出回调函数 父组件传递过来的进度改变的回调函数
    const { percentChange } = props;
    const transform = prefixStyle("transform");
    //监听percent变化来改变进度条
    useEffect(() => {
        if (percent >= 0 && percent <= 1 && !touch.initiated) {
            const barWidth = progressBar.current.clientWidth - progressBtnWidth;
            const offsetWidth = percent * barWidth;
            progress.current.style.width = `${offsetWidth}px`;
            progressBtn.current.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
        }
        // eslint-disable-next-line
    }, [percent]);

    const _changePercent = () => {
        const barWidth = progressBar.current.clientWidth - progressBtnWidth;//除去按钮宽度的进度条的总宽度
        const curPercent = progress.current.clientWidth / barWidth;// 新的进度计算
        percentChange(curPercent);// 把新的进度传给回调函数并执行
    }
    const progressBar = useRef();//进度条整体
    const progress = useRef();//进度
    const progressBtn = useRef();//进度条按钮
    const [touch, setTouch] = useState({});
    const progressBtnWidth = 16;
    // 处理进度条的偏移
    const _offset = (offsetWidth) => {
        progress.current.style.width = `${offsetWidth}px`;
        progressBtn.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`;
    }

    const progressTouchStart = (e) => {
        console.log('onTouchStart', e);
        const startTouch = {};
        startTouch.initiated = true;//initial 为 true 表示滑动动作开始了
        startTouch.startX = e.touches[0].pageX;//滑动开始时横向坐标
        startTouch.left = progress.current.clientWidth;//当前 progress 长度
        setTouch(startTouch);
    }

    const progressTouchMove = (e) => {
        console.log('onTouchMove', e);
        if (!touch.initiated) return;// 未曾开始滑动
        // 滑动距离   
        const deltaX = e.touches[0].pageX - touch.startX;
        const barWidth = progressBar.current.clientWidth - progressBtnWidth; //减去btn本身的width 就是进度条最大的移动范围
        const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth); //做拖动的约束 不能小于0 不能大于barWidth
        _offset(offsetWidth);
    }

    const progressTouchEnd = (e) => {
        console.log('onTouchEnd', e);
        const endTouch = JSON.parse(JSON.stringify(touch));
        endTouch.initiated = false;
        setTouch(endTouch);
        _changePercent();
    }
    const progressClick = (e) => {
        //点击进度条 进度条也要发生相应的改变
        const rect = progressBar.current.getBoundingClientRect();//进度条距离视窗左边的距离
        const offsetWidth = e.pageX - rect.left;
        _offset(offsetWidth);
        _changePercent();
    };
    return (
        <ProgressBarWrapper>
            <div className="bar-inner" ref={progressBar} onClick={progressClick}>
                <div className="progress" ref={progress}></div>
                <div className="progress-btn-wrapper" ref={progressBtn}
                    onTouchStart={progressTouchStart}
                    onTouchMove={progressTouchMove}
                    onTouchEnd={progressTouchEnd}
                >
                    <div className="progress-btn"></div>
                </div>
            </div>
        </ProgressBarWrapper>
    )
}
export default ProgressBar;
