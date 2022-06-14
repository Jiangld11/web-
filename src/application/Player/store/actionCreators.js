/*
 * @Author: your name
 * @Date: 2022-04-05 21:27:22
 * @LastEditTime: 2022-05-22 21:10:18
 * @LastEditors: Rick 312712100@qq.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \cloud-music\src\application\Player\store\actionCreators.js
 */
import { SET_CURRENT_SONG, SET_FULL_SCREEN, SET_PLAYING_STATE, SET_SEQUENCE_PLAYLIST, SET_PLAYLIST, SET_PLAY_MODE, SET_CURRENT_INDEX, SET_SHOW_PLAYLIST, DELETE_SONG, INSERT_SONG } from './constants';
import { getSongDetailRequest } from '../../../api/request';
import { fromJS } from 'immutable';
//切换当前歌曲
export const changeCurrentSong = (data) => ({
    type: SET_CURRENT_SONG,
    data: fromJS(data)
});
//切换全屏
export const changeFullScreen = (data) => ({
    type: SET_FULL_SCREEN,
    data
})
//设置播放状态
export const changePlayingState = (data) => ({
    type: SET_PLAYING_STATE,
    data
})
//设置播放顺序列表
export const changeSequencePlayList = (data) => ({
    type: SET_SEQUENCE_PLAYLIST,
    data: fromJS(data)
})
//设置播放列表
export const changePlayList = (data) => ({
    type: SET_PLAYLIST,
    data: fromJS(data)
})
//设置播放模式
export const changePlayMode = (data) => ({
    type: SET_PLAY_MODE,
    data
})
//是否显示播放列表
export const changeShowPlayList = (data) => ({
    type: SET_SHOW_PLAYLIST,
    data
})
export const changeCurrentIndex = (data) => ({
    type: SET_CURRENT_INDEX,
    data
});
export const deleteSong = (data) => ({
    type: DELETE_SONG,
    data
});
export const insertSong = (data) => ({
    //插入单曲播放
    type: INSERT_SONG,
    data
});

export const getSongDetail = (id) => {
    //请求单曲数据
    return (dispatch) => {
        getSongDetailRequest(id).then(data => {
            let song = data.songs[0];
            dispatch(insertSong(song));
        })
    }
}