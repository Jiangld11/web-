import React, { useContext, useEffect, useCallback } from 'react'
import Horizen from '../../baseUI/horizenItem';
import Scroll from '../../baseUI/scroll/index'
import { Outlet, useNavigate } from 'react-router-dom'
import Loading from '../../baseUI/loading';
import LazyLoad, { forceCheck } from 'react-lazyload';
import { CategoryDataContext, CHANGE_CATEGORY, CHANGE_ALPHA } from './data';
import { NavContainer, ListContainer, List, ListItem } from "./style";
import { categoryTypes, alphaTypes } from '../../api/config';
import {
    getSingerList,
    getHotSingerList,
    changeEnterLoading,
    changePageCount,
    refreshMoreSingerList,
    changePullUpLoading,
    changePullDownLoading,
    refreshMoreHotSingerList
} from './store/actionCreators';
import { connect } from 'react-redux';

//mock 数据
// const singerList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(item => {
//     return {
//         picUrl: "https://p2.music.126.net/uTwOm8AEFFX_BYHvfvFcmQ==/109951164232057952.jpg",
//         name: "隔壁老樊",
//         accountId: 277313426,
//     }
// });
function Singers(props) {
    // const [category, setCategory] = useState('');//当前类目
    // const [alpha, setAlpha] = useState('');//当前歌手
    // 将之前的 useState 代码删除
    const { data, dispatch } = useContext(CategoryDataContext);
    // 拿到 category 和 alpha 的值
    const { category, alpha } = data.toJS();
    const { updateDispatch, pullUpRefreshDispatch, pullDownRefreshDispatch, getHotSingerDispatch } = props;
    const { pullUpLoading, pullDownLoading, enterLoading, pageCount, singerList, songsCount } = props;
    let navigate = useNavigate();

    useEffect(() => {
        if (!singerList.size) { //歌手分类都为空 也就是初始化的时候刷新 歌手和分类缓存起来
            getHotSingerDispatch();
        }
    }, [])
    let handleUpdateAlpha = (val) => {//改变歌手
        dispatch({ type: CHANGE_ALPHA, data: val });
        updateDispatch(category, val);
    }
    let handleUpdateCategory = (val) => {//改变分类
        dispatch({ type: CHANGE_CATEGORY, data: val });
        updateDispatch(val, alpha);
    }
    const handlePullUp = () => { //上拉刷新
        pullUpRefreshDispatch(category, alpha, category === '', pageCount);
    };

    const handlePullDown = () => {//下拉加载
        pullDownRefreshDispatch(category, alpha);
    };
    const enterDetail = useCallback(
        (item) => {
            navigate(`/singers/${item.id}`)
        },
        [],
    )
    // 渲染函数，返回歌手列表
    const renderSingerList = () => {
        return (
            <List>
                {
                    singerList.toJS().map((item, index) => {
                        return (
                            <ListItem key={item.accountId + "" + index} onClick={() => enterDetail(item)}>
                                <div className="img_wrapper">
                                    <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png')} alt="music" />}>
                                        <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music" />
                                    </LazyLoad>
                                </div>
                                <span className="name">{item.name}</span>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    };
    return (
        <NavContainer>
            <Horizen list={categoryTypes} handleClick={handleUpdateCategory} oldVal={category} title={"分类 (默认热门):"}></Horizen>
            <Horizen list={alphaTypes} handleClick={val => handleUpdateAlpha(val)} oldVal={alpha} title={"首字母:"}></Horizen>
            <ListContainer play={songsCount}>
                <Scroll
                    pullUp={handlePullUp}
                    pullDown={handlePullDown}
                    pullUpLoading={pullUpLoading}
                    pullDownLoading={pullDownLoading}
                    onScroll={forceCheck}
                >
                    {renderSingerList()}
                </Scroll>
                <Loading show={enterLoading}></Loading>
            </ListContainer>
            <Outlet />
        </NavContainer>
    )
}
const mapStateToProps = (state) => ({
    singerList: state.getIn(['singers', 'singerList']),
    enterLoading: state.getIn(['singers', 'enterLoading']),
    pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
    pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
    pageCount: state.getIn(['singers', 'pageCount']),
    songsCount: state.getIn(['player', 'playList']).size
});
const mapDispatchToProps = (dispatch) => {
    return {
        getHotSingerDispatch() {//初始化加载无分类和歌手的列表
            dispatch(getHotSingerList());
        },
        updateDispatch(category, alpha) {
            dispatch(changePageCount(0));//由于改变了分类，所以pageCount清零
            dispatch(changeEnterLoading(true));//loading
            dispatch(getSingerList(category, alpha));
        },
        // 滑到最底部刷新部分的处理
        pullUpRefreshDispatch(category, alpha, hot, count) {
            dispatch(changePullUpLoading(true));
            dispatch(changePageCount(count + 1));
            if (hot) {//热门歌手刷新
                dispatch(refreshMoreHotSingerList());
            } else {
                dispatch(refreshMoreSingerList(category, alpha));
            }
        },
        //顶部下拉刷新
        pullDownRefreshDispatch(category, alpha) {
            dispatch(changePullDownLoading(true));
            dispatch(changePageCount(0));//属于重新获取数据
            if (category === '' && alpha === '') {
                dispatch(getHotSingerList());
            } else {
                dispatch(getSingerList(category, alpha));
            }
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers));

