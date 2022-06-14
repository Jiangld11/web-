import React, { useEffect } from 'react'
import { connect } from "react-redux";
// 引入 forceCheck 方法
import { forceCheck } from 'react-lazyload';
import { Outlet } from "react-router-dom";
import * as actionTypes from './store/actionCreators';
import Slider from '../../components/silder'
import RecommendList from '../../components/list/list'
import Scroll from '../../baseUI/scroll'
import Loading from '../../baseUI/loading/index';
import { Content } from './style';
function Recommend(props) {

    //取store里面的state
    const { bannerList, recommendList, enterLoading, songsCount } = props;
    //取dispatch调用函数
    const { getBannerDataDispatch, getRecommendListDataDispatch } = props;
    useEffect(() => {
        // 如果页面有数据，则不发请求
        //immutable 数据结构中长度属性 size
        if (!bannerList.size) getBannerDataDispatch();
        if (!recommendList.size) getRecommendListDataDispatch();
        //eslint-disable-next-line
    }, [])
    const bannerListJS = bannerList.size ? bannerList.toJS() : [];
    const recommendListJS = recommendList.size ? recommendList.toJS() : [];
    //mock数据
    // const bannerList = [1, 2, 3, 4].map((item) => {
    //     return { imageUrl: 'http://p1.music.126.net/ZYLJ2oZn74yUz5x8NBGkVA==/109951164331219056.jpg' }
    // })
    // const recommendList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item, index) => {
    //     return {
    //         id: index,
    //         picUrl: "https://p1.music.126.net/fhmefjUfMD-8qtj3JKeHbA==/18999560928537533.jpg",
    //         playCount: 17171122,
    //         name: "朴树、许巍、李健、郑钧、老狼、赵雷"
    //     }
    // })
    return (
        <Content play={songsCount}>
            <Scroll className="list" onScroll={forceCheck}>
                <div>
                    {/* 轮播图 */}
                    <Slider bannerList={bannerListJS} />
                    {/* 推荐列表 */}
                    <RecommendList recommendList={recommendListJS} history={props.history} />
                </div>
            </Scroll>
            <Outlet />
            {enterLoading ? <Loading /> : null}
        </Content>
    )
}
//映射Redux全局的state 到组建的props上
const mapStateToProps = (state) => ({
    // 不要在这里将数据 toJS
    // 不然每次 diff 比对 props 的时候都是不一样的引用，还是导致不必要的重渲染，属于滥用 immutable
    bannerList: state.getIn(['recommend', 'bannerList']),
    recommendList: state.getIn(['recommend', 'recommendList']),
    enterLoading: state.getIn(['recommend', 'enterLoading']),
    songsCount: state.getIn(['player', 'playList']).size,// 尽量减少 toJS 操作，直接取 size 属性就代表了 list 的长度
})
//映射dispatch到props上
const mapDispatchToProps = (dispatch) => {
    return {
        getBannerDataDispatch() {
            dispatch(actionTypes.getBannerList());
        },
        getRecommendListDataDispatch() {
            dispatch(actionTypes.getRecommendList());
        },
    }
}
// 将 ui 组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend));

