/*
 * @Author: your name
 * @Date: 2022-03-10 17:35:48
 * @LastEditTime: 2022-05-16 12:01:20
 * @LastEditors: Rick 312712100@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \cloud-music\src\assets\global-style.js
 */
// 扩大可点击区域
const extendClick = () => {
  return `
      position: relative;
      &:before {
        content: '';
        position: absolute;
        top: -10px; bottom: -10px; left: -10px; right: -10px;
      };
    `
}
// 一行文字溢出部分用... 代替
const noWrap = () => {
  return `
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    `
}

export default {
  'theme-color': '#d44439',
  'theme-color-shadow': 'rgba(212, 68, 57, .5)',
  'font-color-light': '#f1f1f1',
  'font-color-desc': '#2E3030',
  'font-color-desc-v2': '#bba8a8',// 略淡
  'font-size-ss': '10px',
  'font-size-s': '12px',
  'font-size-m': '14px',
  'font-size-l': '16px',
  'font-size-ll': '18px',
  "border-color": '#e4e4e4',
  'background-color': '#f2f3f4',
  'background-color-shadow': 'rgba(0, 0, 0, 0.3)',
  'highlight-background-color': '#fff',
  extendClick,
  noWrap
}
