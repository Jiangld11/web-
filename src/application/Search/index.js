import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { getHotKeyWords, changeEnterLoading, getSuggestList } from './store/actionCreators';
import { getSongDetail } from './../Player/store/actionCreators';
import MusicalNote from '../../baseUI/music-note';
import { Container, ShortcutWrapper, HotKey } from './style';
import Scroll from '../../baseUI/scroll';
import Loading from './../../baseUI/loading/index';
import SearchBox from './../../baseUI/search-box/index';
import { SongItem } from './style';
import { getName } from '../../api/utils';
import { connect } from 'react-redux';
import {
    useNavigate
} from "react-router-dom";
// 引入歌单相关
import LazyLoad, { forceCheck } from 'react-lazyload';
import { List, ListItem } from './style';

/**
 * 1.当搜索框为空，展示热门搜索列表
2.当搜索框有内容时，发送 Ajax 请求，显示搜索结果
3.点击搜索结果，分别进入到不同的详情页中
 * @param {*} props 
 */
function Search(props) {
    const {
        hotList,
        enterLoading,
        suggestList: immutableSuggestList,
        songsCount,
        songsList: immutableSongsList
    } = props;

    const suggestList = immutableSuggestList.toJS();
    const songsList = immutableSongsList.toJS();

    const {
        getHotKeyWordsDispatch,
        changeEnterLoadingDispatch,
        getSuggestListDispatch,
        getSongDetailDispatch
    } = props;
    // 控制动画
    const [show, setShow] = useState(false);
    const [query, setQuery] = useState('');
    const musicNoteRef = useRef();
    let navigate = useNavigate();

    useEffect(() => {
        setShow(true);
        //第一次无热门列表时请求，redux缓存中有就不请求，节省性能
        if (!hotList.size)
            getHotKeyWordsDispatch();
    }, []);

    useEffect(() => {
        setShow(true);
    }, []);

    // 由于是传给子组件的方法，尽量用 useCallback 包裹，以使得在依赖未改变，始终给子组件传递的是相同的引用
    const searchBack = useCallback(() => {
        setShow(false);
    }, []);

    const handleQuery = (q) => {
        setQuery(q);
        if (!q) return;
        changeEnterLoadingDispatch(true);//开启入场动画
        getSuggestListDispatch(q);//搜索推荐列表
    }
    const renderHotKey = () => {
        //渲染热门关键词
        let list = hotList ? hotList.toJS() : [];
        return (
            <ul>
                {
                    list.map(item => {
                        return (
                            <li className="item" key={item.first} onClick={() => setQuery(item.first)}>
                                <span>{item.first}</span>
                            </li>
                        )
                    })
                }
            </ul>
        )
    };
    const renderSingers = () => {
        let singers = suggestList.artists;
        if (!singers || !singers.length) return;
        return (
            <List>
                <h1 className="title">相关歌手</h1>
                {
                    singers.map((item, index) => {
                        return (
                            <ListItem key={item.accountId + "" + index} onClick={() => navigate(`/singers/${item.id}`)}>
                                <div className="img_wrapper">
                                    <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png')} alt="singer" />}>
                                        <img src={item.picUrl} width="100%" height="100%" alt="music" />
                                    </LazyLoad>
                                </div>
                                <span className="name">歌手: {item.name}</span>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    };
    const renderAlbum = () => {
        let albums = suggestList.playlists;
        if (!albums || !albums.length) return;
        return (
            <List>
                <h1 className="title"> 相关歌单 </h1>
                {
                    albums.map((item, index) => {
                        return (
                            <ListItem key={item.accountId + "" + index} onClick={() => navigate(`/album/${item?.id}`)}>
                                <div className="img_wrapper">
                                    <LazyLoad placeholder={<img width="100%" height="100%" src={require('./music.png')} alt="music" />}>
                                        <img src={item.coverImgUrl} width="100%" height="100%" alt="music" />
                                    </LazyLoad>
                                </div>
                                <span className="name"> 歌单: {item.name}</span>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    };
    const renderSongs = () => {
        return (
            <SongItem style={{ paddingLeft: "20px" }} >
                {
                    songsList.map(item => {
                        return (
                            <li key={item.id} onClick={(e) => selectItem(e, item.id)}>
                                <div className="info">
                                    <span>{item.name}</span>
                                    <span>
                                        {getName(item.artists)} - {item.album.name}
                                    </span>
                                </div>
                            </li>
                        )
                    })
                }
            </SongItem>
        )
    };

    const selectItem = (e, id) => {
        getSongDetailDispatch(id);
        console.log(e);
        musicNoteRef.current.startAnimation({ x: e.nativeEvent.clientX, y: e.nativeEvent.clientY });
    }
    return (
        <CSSTransition
            in={show}
            timeout={300}
            appear={true}
            classNames="fly"
            unmountOnExit
            onExited={() => navigate(-1)}
        >
            <Container play={songsCount}>
                <div className="search_box_wrapper">
                    <SearchBox back={searchBack} newQuery={query} handleQuery={handleQuery}></SearchBox>
                </div>
                {/* 热门列表 */}
                <ShortcutWrapper show={!query}>
                    <Scroll>
                        <div>
                            <HotKey>
                                <h1 className="title"> 热门搜索 </h1>
                                {renderHotKey()}
                            </HotKey>
                        </div>
                    </Scroll>
                </ShortcutWrapper>
                {/* 搜索结果 */}
                <ShortcutWrapper show={query}>
                    <Scroll onScorll={forceCheck}>
                        <div>
                            {renderSingers()}
                            {renderAlbum()}
                            {renderSongs()}
                        </div>
                    </Scroll>
                </ShortcutWrapper>
                {enterLoading ? <Loading></Loading> : null}
                <MusicalNote ref={musicNoteRef}></MusicalNote>
            </Container>
        </CSSTransition>
    )
}

// 映射Redux全局的state到组件的props上
const mapStateToProps = (state) => ({
    hotList: state.getIn(['search', 'hotList']),
    enterLoading: state.getIn(['search', 'enterLoading']),
    suggestList: state.getIn(['search', 'suggestList']),
    songsCount: state.getIn(['player', 'playList']).size,
    songsList: state.getIn(['search', 'songsList'])
});
// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
    return {
        getHotKeyWordsDispatch() {
            dispatch(getHotKeyWords());
        },
        changeEnterLoadingDispatch(data) {
            dispatch(changeEnterLoading(data))
        },
        getSuggestListDispatch(data) {
            dispatch(getSuggestList(data));
        },
        getSongDetailDispatch(id) {
            dispatch(getSongDetail(id));
        }
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Search));