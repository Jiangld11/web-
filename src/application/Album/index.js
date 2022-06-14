//src/application/Album/index.js
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useParams } from "react-router-dom";
import { Container, TopDesc, Menu, SongList, SongItem } from './style';
import _ from 'lodash';
import { getCount, getName } from '../../api/utils';
import Loading from '../../baseUI/loading/index';
import { HEADER_HEIGHT } from './../../api/config';
import { connect } from 'react-redux';
import style from "../../assets/global-style";
import MusicNote from "../../baseUI/music-note/index";
import Header from './../../baseUI/header/index';
import Scroll from '../../baseUI/scroll/index';
import SongsList from '../SongsList';
import { changeEnterLoading, getAlbumList } from './store/actionCreators';
import {
    useNavigate
} from "react-router-dom";
import { CSSTransition } from 'react-transition-group';


function Album(props) {
    const [showStatus, setShowStatus] = useState(true);
    const [title, setTitle] = useState("歌单");
    const [isMarquee, setIsMarquee] = useState(false);// 是否跑马灯
    const params = useParams();

    const musicNoteRef = useRef();
    const headerEl = useRef();

    let navigate = useNavigate();
    // 从路由中拿到歌单的 id
    const id = params.id;
    const { currentAlbum: currentAlbumImmutable, enterLoading, songsCount } = props;
    let currentAlbum = !_.isEmpty(currentAlbumImmutable) ? currentAlbumImmutable.toJS() : {};
    const { getAlbumDataDispatch } = props;

    useEffect(() => {
        getAlbumDataDispatch(id);
    }, [getAlbumDataDispatch, id]);

    const handleBack = useCallback(
        () => {
            setShowStatus(false);
        },
        [currentAlbum]
    )

    const handleScroll = useCallback((pos) => {
        let minScrollY = -HEADER_HEIGHT;
        let percent = Math.abs(pos.y / minScrollY);
        let headerDom = headerEl.current;
        // 滑过顶部的高度开始变化
        if (pos.y < minScrollY) {
            headerDom.style.backgroundColor = style["theme-color"];
            headerDom.style.opacity = Math.min(1, (percent - 1) / 2);
            setTitle(currentAlbum.name);
            setIsMarquee(true);
        } else {
            headerDom.style.backgroundColor = "";
            headerDom.style.opacity = 1;
            setTitle("歌单");
            setIsMarquee(false);
        }
    }, [])

    //音符陨落
    const musicAnimation = (x, y) => {
        musicNoteRef.current.startAnimation({ x, y });
    };

    //顶部详情
    const renderTopDesc = () => {
        return (
            <TopDesc background={currentAlbum.coverImgUrl}>
                <div className="background">
                    <div className="filter"></div>
                </div>
                <div className="img_wrapper">
                    <div className="decorate"></div>
                    <img src={currentAlbum.coverImgUrl} alt="" />
                    <div className="play_count">
                        <i className="iconfont play">&#xe885;</i>
                        <span className="count">{Math.floor(currentAlbum.subscribedCount / 1000) / 10} 万 </span>
                    </div>
                </div>
                <div className="desc_wrapper">
                    <div className="title">{currentAlbum.name}</div>
                    <div className="person">
                        <div className="avatar">
                            <img src={currentAlbum.creator.avatarUrl} alt="" />
                        </div>
                        <div className="name">{currentAlbum.creator.nickname}</div>
                    </div>
                </div>
            </TopDesc>
        )
    }
    //菜单渲染
    const renderMenu = () => {
        return (
            <Menu>
                <div>
                    <i className="iconfont">&#xe6ad;</i>
                      评论
          </div>
                <div>
                    <i className="iconfont">&#xe86f;</i>
                      点赞
          </div>
                <div>
                    <i className="iconfont">&#xe62d;</i>
                      收藏
              </div>
                <div>
                    <i className="iconfont">&#xe606;</i>
                      更多
          </div>
            </Menu>
        )
    };

    return (
        <CSSTransition
            in={showStatus}
            timeout={300}
            classNames="fly"
            appear={true}
            unmountOnExit
            onExited={() => navigate(-1)}
        >
            <Container play={songsCount}>
                <Header title={title} ref={headerEl} handleClick={handleBack} isMarquee={isMarquee}></Header>
                {!_.isEmpty(currentAlbum) &&
                    <Scroll bounceTop={false} onScroll={handleScroll}>
                        <div>
                            {renderTopDesc()}
                            {renderMenu()}
                            {/* {renderSongList()} */}
                            <SongsList
                                songs={currentAlbum.tracks}
                                collectCount={currentAlbum.subscribedCount}
                                showCollect={true}
                                showBackground={true}
                                musicAnimation={musicAnimation}
                            ></SongsList>
                        </div>
                    </Scroll>
                }
                <MusicNote ref={musicNoteRef}></MusicNote>
                {enterLoading ? <Loading></Loading> : null}
            </Container>
        </CSSTransition>
    )
}
// 映射 Redux 全局的 state 到组件的 props 上
const mapStateToProps = (state) => ({
    currentAlbum: state.getIn(['album', 'currentAlbum']),
    enterLoading: state.getIn(['album', 'enterLoading']),
    songsCount: state.getIn(['player', 'playList']).size,
});
// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
    return {
        getAlbumDataDispatch(id) {
            dispatch(changeEnterLoading(true));
            dispatch(getAlbumList(id));
        },
    }
};
// 将 ui 组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album));