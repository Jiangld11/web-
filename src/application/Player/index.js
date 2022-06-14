import React, { memo, useRef, useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { getSongUrl, isEmptyObject, shuffle, findIndex } from '../../api/utils';
import { playMode } from '../../api/config';
import Toast from "./../../baseUI/toast/index";
import PlayList from './play-list/index';
import { getLyricRequest } from "../../api/request";
import Lyric from './../../api/lyric-parser';
import {
    changePlayingState,
    changeShowPlayList,
    changeCurrentIndex,
    changeCurrentSong,
    changePlayList,
    changePlayMode,
    changeFullScreen
} from "./store/actionCreators";
import MiniPlayer from './miniPlayer';
import NormalPlayer from './normalPlayer';

function Player(props) {

    //目前播放时间
    const [currentTime, setCurrentTime] = useState(0);
    //歌曲总时长
    const [duration, setDuration] = useState(0);
    //记录当前的歌曲，以便于下次重渲染时比对是否是一首歌
    const [preSong, setPreSong] = useState({});
    //播放模式
    const [modeText, setModeText] = useState("");
    //即时歌词
    const [currentPlayingLyric, setPlayingLyric] = useState("");

    //歌曲播放进度
    let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

    //绑定ref
    const songReady = useRef(true);
    const toastRef = useRef();
    const currentLyric = useRef();
    const audioRef = useRef();
    const currentLineNum = useRef(0);//记录当前行数

    const {
        playing,
        currentSong: immutableCurrentSong,
        currentIndex,
        playList: immutablePlayList,
        mode,//播放模式
        sequencePlayList: immutableSequencePlayList,//顺序列表
        fullScreen
    } = props;
    const {
        togglePlayingDispatch,
        changeCurrentIndexDispatch,
        changeCurrentDispatch,
        changePlayListDispatch,//改变playList
        changeModeDispatch,//改变mode
        toggleFullScreenDispatch,
        togglePlayListDispatch
    } = props;
    const playList = immutablePlayList.toJS();
    const sequencePlayList = immutableSequencePlayList.toJS();
    const currentSong = immutableCurrentSong.toJS();
    useEffect(() => {
        if (
            !playList.length ||
            currentIndex === -1 ||
            !playList[currentIndex] ||
            playList[currentIndex].id === preSong.id ||
            !songReady.current// 播放失败为 false 或者没有单词
        ) {
            //判断当前 播放是否是同一首歌曲
            // console.log(playList[currentIndex]?.id === preSong?.id, '是否播放当前歌曲')
            return;
        }

        let current = playList[currentIndex];
        changeCurrentDispatch(current);//赋值currentSong
        setPreSong(current);//设置前一首播放的歌曲
        //播放源
        audioRef.current.src = getSongUrl(current.id);
        setTimeout(() => {
            audioRef.current.play();
        });
        togglePlayingDispatch(true);//播放状态
        getLyric(current.id);//获取当前歌曲歌词
        setCurrentTime(0);//从头开始播放
        setDuration((current.dt / 1000) | 0);//时长
    }, [playList, currentIndex]);

    useEffect(() => {
        //播放暂停逻辑和audio关联
        playing ? audioRef.current.play() : audioRef.current.pause();
    }, [playing]);

    const handleLyric = ({ lineNum, txt }) => {
        if (!currentLyric.current) return;
        currentLineNum.current = lineNum;
        setPlayingLyric(txt);
    }
    const getLyric = id => {
        let lyric = "";
        if (currentLyric.current) {
            //如果存在当前歌词就暂停歌词
            currentLyric.current.stop();
        }
        getLyricRequest(id)
            .then(data => {
                console.log(data, 'lyric歌词')
                lyric = data.lrc.lyric;
                if (!lyric) {
                    currentLyric.current = null;
                    return;
                }
                currentLyric.current = new Lyric(lyric, handleLyric);
                currentLyric.current.play();
                currentLineNum.current = 0;
                currentLyric.current.seek(0);
            })
            .catch(() => {
                songReady.current = true;
                audioRef.current.play();
            });
    };
    //切换播放模式
    const changeMode = () => {
        let newMode = (mode + 1) % 3;
        if (newMode === 0) {
            //顺序模式
            changePlayListDispatch(sequencePlayList);
            let index = findIndex(currentSong, sequencePlayList);
            changeCurrentIndexDispatch(index);
            setModeText("顺序循环");
        } else if (newMode === 1) {
            //单曲循环
            changePlayListDispatch(sequencePlayList);
            setModeText("单曲循环");
        } else if (newMode === 2) {
            //随机播放
            let newList = shuffle(sequencePlayList);
            let index = findIndex(currentSong, newList);
            changePlayListDispatch(newList);
            changeCurrentIndexDispatch(index);
            setModeText("随机播放");
        }
        changeModeDispatch(newMode);
        toastRef.current.show();
    };
    const clickPlaying = (e, state) => {
        e.stopPropagation();
        togglePlayingDispatch(state);
        //歌曲暂停 - 播放
        if (currentLyric.current) {
            currentLyric.current.togglePlay(currentTime * 1000);
        }
    };
    const updateTime = e => {
        setCurrentTime(e.target.currentTime);
    };
    const onProgressChange = curPercent => {
        const newTime = curPercent * duration;
        setCurrentTime(newTime);
        audioRef.current.currentTime = newTime;
        if (!playing) {
            //非播放 状态 进入播放状态
            togglePlayingDispatch(true);
        }
        //歌曲进度更新-->更新歌词进度
        if (currentLyric.current) {
            currentLyric.current.seek(newTime * 1000);
        }
    };
    //一首歌循环
    const handleLoop = () => {
        audioRef.current.currentTime = 0;
        changePlayingState(true);
        audioRef.current.play();
    };
    //上一曲
    const handlePrev = () => {
        //播放列表只有一首歌时单曲循环
        if (playList.length === 1) {
            handleLoop();
            return;
        }
        let index = currentIndex - 1;
        if (index < 0) index = playList.length - 1;
        if (!playing) togglePlayingDispatch(true);
        changeCurrentIndexDispatch(index);
    };
    //下一曲
    const handleNext = () => {
        //播放列表只有一首歌时单曲循环
        if (playList.length === 1) {
            handleLoop();
            return;
        }
        let index = currentIndex + 1;
        if (index === playList.length) index = 0;
        if (!playing) togglePlayingDispatch(true);
        changeCurrentIndexDispatch(index);
    };
    //播放结束
    const handleEnd = () => {
        if (mode === playMode.loop) {
            handleLoop();
        } else {
            handleNext();
        }
    };
    //切换过快的异常捕获
    const handleError = () => {
        songReady.current = true;
        alert("播放出错");
    };

    return (
        <div>
            {isEmptyObject(currentSong) ? null :
                <MiniPlayer
                    song={currentSong}
                    fullScreen={fullScreen}
                    percent={percent}
                    playing={playing}
                    toggleFullScreen={toggleFullScreenDispatch}
                    clickPlaying={clickPlaying}
                    togglePlayList={togglePlayListDispatch}
                />
            }
            {isEmptyObject(currentSong) ? null :
                <NormalPlayer
                    song={currentSong}
                    fullScreen={fullScreen}
                    playing={playing}
                    duration={duration}//总时长
                    currentTime={currentTime}//播放时间
                    percent={percent}//进度
                    mode={mode}
                    currentLyric={currentLyric.current}
                    currentPlayingLyric={currentPlayingLyric}
                    currentLineNum={currentLineNum.current}
                    changeMode={changeMode}
                    toggleFullScreen={toggleFullScreenDispatch}
                    togglePlayList={togglePlayListDispatch}
                    onProgressChange={onProgressChange}
                    handlePrev={handlePrev}
                    handleNext={handleNext}
                    clickPlaying={clickPlaying}
                />
            }
            <audio
                ref={audioRef}
                onTimeUpdate={updateTime}
                onEnded={handleEnd}
                onError={handleError}
            ></audio>
            <PlayList></PlayList>
            <Toast text={modeText} ref={toastRef}></Toast>
        </div>
    )
}
//映射Redux 全局的state到组件的props上
const mapStateToProps = state => ({
    fullScreen: state.getIn(["player", "fullScreen"]),
    playing: state.getIn(["player", "playing"]),
    currentSong: state.getIn(["player", "currentSong"]),
    showPlayList: state.getIn(["player", "showPlayList"]),
    mode: state.getIn(["player", "mode"]),
    currentIndex: state.getIn(["player", "currentIndex"]),
    playList: state.getIn(["player", "playList"]),
    sequencePlayList: state.getIn(["player", "sequencePlayList"])
})
//映射dispatch到props上
const mapDispatchToProps = dispatch => {
    return {
        togglePlayingDispatch(data) {
            dispatch(changePlayingState(data));
        },
        toggleFullScreenDispatch(data) {
            dispatch(changeFullScreen(data));
        },
        togglePlayListDispatch(data) {
            dispatch(changeShowPlayList(data));
        },
        changeCurrentIndexDispatch(index) {
            dispatch(changeCurrentIndex(index));
        },
        changeCurrentDispatch(data) {
            dispatch(changeCurrentSong(data));
        },
        changeModeDispatch(data) {
            dispatch(changePlayMode(data));
        },
        changePlayListDispatch(data) {
            dispatch(changePlayList(data));
        }
    }
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(memo(Player));
