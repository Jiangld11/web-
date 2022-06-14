import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import { filterIndex } from '../../api/utils';
import { getRankList } from './store'
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Loading from '../../baseUI/loading';
import {
    List,
    ListItem,
    SongList,
    Container
} from './style'
import Scroll from '../../baseUI/scroll/index';
// import { EnterLoading } from './../Singers/style'; 

function Rank(props) {
    const { rankList: list, loading, songsCount } = props;
    const { getRankListDataDispatch } = props;
    let navigate = useNavigate();
    let rankList = list ? list.toJS() : [];

    useEffect(() => {
        getRankListDataDispatch();
    }, []);

    let globalStartIndex = filterIndex(rankList);
    let officialList = rankList.slice(0, globalStartIndex);//官方榜单
    let globalList = rankList.slice(globalStartIndex);//全球榜单
    //进入详情
    const enterDetail = (id) => {
        // const idx = filterIdx(name);
        // if (idx === null) {
        //     alert("暂无相关数据");
        //     return;
        // }
        navigate(`/rank/${id}`)
    }
    // 这是渲染榜单列表函数，传入 global 变量来区分不同的布局方式
    const renderRankList = (list, global) => {
        //左侧图片
        return (
            <List globalRank={global}>
                {
                    list.map((item) => {
                        return (
                            <ListItem key={item.coverImgId} tracks={item.tracks} onClick={() => enterDetail(item.id)}>
                                <div className="img_wrapper">
                                    <img src={item.coverImgUrl} alt="" />
                                    <div className="decorate"></div>
                                    <span className="update_frequecy">{item.updateFrequency}</span>
                                </div>
                                { renderSongList(item.tracks)}
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    }

    const renderSongList = (list) => {
        //右侧歌名
        return list.length ? (
            <SongList>
                {
                    list.map((item, index) => {
                        return <li key={index}>{index + 1}. {item.first} - {item.second}</li>
                    })
                }
            </SongList>
        ) : null;
    }
    // 榜单数据未加载出来之前都给隐藏
    let displayStyle = loading ? { "display": "none" } : { "display": "" };
    return (
        <Container play={songsCount}>
            <Scroll>
                <div>
                    <h1 className="offical" style={displayStyle}> 官方榜 </h1>
                    {renderRankList(officialList)}
                    <h1 className="global" style={displayStyle}> 全球榜 </h1>
                    {renderRankList(globalList, true)}
                    {loading ? <><Loading></Loading></> : null}
                </div>
            </Scroll>
            <Outlet />
        </Container>
    )
}

// 映射 Redux 全局的 state 到组件的 props 上
const mapStateToProps = (state) => ({
    rankList: state.getIn(['rank', 'rankList']),
    loading: state.getIn(['rank', 'loading']),
    songsCount: state.getIn(['player', 'playList']).size
});
// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
    return {
        getRankListDataDispatch() {
            dispatch(getRankList());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Rank));

