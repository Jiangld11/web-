/*
 * @Author: “罗顺枫” “shunfeng.luo@deepfinance.com”
 * @Date: 2022-05-09 09:45:41
 * @LastEditors: Rick 312712100@qq.com
 * @LastEditTime: 2022-05-17 00:21:02
 * @FilePath: \cloud-music\src\application\Player\play-list\style.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import styled from 'styled-components';
import style from '../../../assets/global-style';

export const PlayListWrapper = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1000;
  background-color: ${style["background-color-shadow"]};
  &.list-fade-enter{
    opacity: 0;
  }
  &.list-fade-enter-active{
    opacity: 1;
    transition: all 0.3s;
  }
  &.list-fade-exit{
    opacity: 1;
  }
  &.list-fade-exit-active{
    opacity: 0;
    transition: all 0.3s;
  }
  .list_wrapper{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    opacity: 1;
    border-radius: 10px 10px 0 0;
    background-color: ${style["highlight-background-color"]};
    transform: translate3d(0, 0, 0);
    .list_close{
      text-align: center;
      line-height: 50px;
      background: ${style["background-color"]};
      font-size: ${style["font-size-l"]};
      color: ${style["font-color-desc"]};
    }
  }
`;
export const ScrollWrapper = styled.div`
  height: 400px;
  overflow: hidden;
`;
// 列表头部包裹播放模式和清空按钮的容器组件
export const ListHeader = styled.div`
  position: relative;
  padding: 20px 30px 10px 20px;
  .title{
    display: flex;
    align-items: center;
    >div{
      flex:1;
      .text{
        flex: 1;
        font-size: ${style["font-size-m"]};
        color: ${style["font-color-desc"]};
      }
    }
    .iconfont {
      margin-right: 10px;
      font-size: ${style["font-size-ll"]};
      color: ${style["theme-color"]};
    }
    .clear{
      ${style.extendClick()}
      font-size: ${style["font-size-l"]};
    }
  }
`
//包裹整个歌曲的列表
export const ListContent = styled.div`
  .item{
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 30px 0 20px;
    overflow: hidden;
    .current{
      flex: 0 0 20px;
      width: 20px;
      font-size: ${style["font-size-s"]};
      color: ${style["theme-color"]};
    }
    .text{
      flex: 1;
      ${style.noWrap()}
      font-size: ${style["font-size-m"]};
      color: ${style["font-color-desc-v2"]};
      .icon-favorite{
        color: ${style["theme-color"]};
      }
    }
    .like{
      ${style.extendClick()}
      margin-right: 15px;
      font-size: ${style["font-size-m"]};
      color: ${style["theme-color"]};
    }
    .delete{
      ${style.extendClick()}
      font-size: ${style["font-size-s"]};
      color: ${style["theme-color"]};
    }
  }
`