/*
 * @Author: Rick 312712100@qq.com
 * @Date: 2022-05-22 18:09:22
 * @LastEditors: Rick 312712100@qq.com
 * @LastEditTime: 2022-05-22 18:18:06
 * @FilePath: \cloud-music\src\application\Search\store\reducer.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import * as actionTypes from './constants';
import { fromJS } from 'immutable';

const defaultState = fromJS({
    hotList: [], // 热门关键词列表
    suggestList: [],//推荐列表，包括歌单和歌手
    songsList: [],// 歌曲列表
    enterLoading: false
})
export default (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.SET_HOT_KEYWRODS:
            return state.set('hotList', action.data);
        case actionTypes.SET_SUGGEST_LIST:
            return state.set('suggestList', action.data);
        case actionTypes.SET_RESULT_SONGS_LIST:
            return state.set('songsList', action.data);
        case actionTypes.SET_ENTER_LOADING:
            return state.set('enterLoading', action.data);
        default:
            return state;
    }
}