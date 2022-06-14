/*
 * @Author: “罗顺枫” “shunfeng.luo@deepfinance.com”
 * @Date: 2022-03-15 10:56:25
 * @LastEditors: “罗顺枫” “shunfeng.luo@deepfinance.com”
 * @LastEditTime: 2022-05-08 21:53:35
 * @FilePath: \cloud-music\src\application\Singers\style.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import styled from 'styled-components';
import style from '../../assets/global-style';
//设定容器大小支持滚动
export const NavContainer = styled.div`
  box-sizing: border-box;
  position: fixed;
  top: 95px;
  width: 100%; 
  padding: 5px;
  overflow: hidden;
`;
export const ListContainer = styled.div`
  position: fixed;
  top: 160px;
  left: 0;
  bottom: ${props => props.play ? '60px' : 0};
  overflow: hidden;
  width: 100%;
`;

export const List = styled.div`
  display: flex;
  margin: auto;
  flex-direction: column;
  overflow: hidden;
  .title {
    margin:10px 0 10px 10px;
    color: ${style["font-color-desc"]};
    font-size: ${style["font-size-s"]};
  }
`;
export const ListItem = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  margin: 0 5px;
  padding: 5px 0;
  align-items: center;
  border-bottom: 1px solid ${style["border-color"]};
  .img_wrapper {
    margin-right: 20px;
    img {
      border-radius: 3px;
      width: 50px;
      height: 50px;
    }
  }
  .name {
    font-size: ${style["font-size-m"]};
    color: ${style["font-color-desc"]};
    font-weight: 500;
  }
`;