/*
 * @Author: Rick 312712100@qq.com
 * @Date: 2022-05-22 18:08:43
 * @LastEditors: Rick 312712100@qq.com
 * @LastEditTime: 2022-05-22 18:22:42
 * @FilePath: \cloud-music\src\application\Search\store\actionCreators.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { SET_HOT_KEYWRODS, SET_SUGGEST_LIST, SET_RESULT_SONGS_LIST, SET_ENTER_LOADING } from './constants';
import { fromJS } from 'immutable';
import { getHotKeyWordsRequest, getSuggestListRequest, getResultSongsListRequest } from './../../../api/request';

const changeHotKeyWords = (data) => ({
    type: SET_HOT_KEYWRODS,
    data: fromJS(data)
});

const changeSuggestList = (data) => ({
    type: SET_SUGGEST_LIST,
    data: fromJS(data)
});

const changeResultSongs = (data) => ({
    type: SET_RESULT_SONGS_LIST,
    data: fromJS(data)
});

export const changeEnterLoading = (data) => ({
    type: SET_ENTER_LOADING,
    data
});

export const getHotKeyWords = () => {
    return dispatch => {
        getHotKeyWordsRequest().then(data => {
            // 拿到关键词列表
            let list = data.result.hots;
            dispatch(changeHotKeyWords(list));
        })
    }
};
export const getSuggestList = (query) => {
    return dispatch => {
        getSuggestListRequest(query).then(data => {
            if (!data) return;
            let res = data.result || [];
            dispatch(changeSuggestList(res));
        })
        getResultSongsListRequest(query).then(data => {
            if (!data) return;
            let res = data.result.songs || [];
            dispatch(changeResultSongs(res));
            dispatch(changeEnterLoading(false));// 关闭 loading
        })
    }
};