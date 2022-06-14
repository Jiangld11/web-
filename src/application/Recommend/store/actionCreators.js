import * as actionTypes from './constants';
import { fromJS } from 'immutable';//将js对象转化成immutable对象
import { getBannerRequest, getRecommendListRequest } from '../../../api/request';
//定义同步action
export const changeBannerList = (data) => ({
    type: actionTypes.CHANGE_BANNER,
    data: fromJS(data)
})

export const changeRecommendList = (data) => ({
    type: actionTypes.CHANGE_RECOMMEND_LIST,
    data: fromJS(data)
})

export const changeEnterLoading = (data) => ({
    type: actionTypes.CHANGE_ENTER_LOADING,
    data
});

//定义异步action
export const getBannerList = () => {
    return (dispatch) => {
        getBannerRequest().then(data => {
            dispatch(changeBannerList(data.banners));
        }).catch(() => {
            console.log('轮播图数据传输错误')
        })
    }
}
export const getRecommendList = () => {
    return (dispatch) => {
        getRecommendListRequest().then(data => {
            dispatch(changeRecommendList(data.result));
            dispatch(changeEnterLoading(false));// 改变 loading
        }).catch(() => {
            console.log('推荐歌单数据传输错误')
        })
    }
}