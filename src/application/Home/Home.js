import React from 'react'
import { Outlet } from 'react-router'
import Player from '../Player';
import {
    Top,
    Tab,
    TabItem
} from './style';
import {
    useNavigate
} from "react-router-dom";
import { NavLink } from 'react-router-dom';// 利用 NavLink 组件进行路由跳转

function Home(props) {
    let navigate = useNavigate();
    return (
        <div>
            <Top>
                <span className="iconfont menu">&#xe65c;</span>
                <span className="title">桂花鸭</span>
                <span className="iconfont search" onClick={() => navigate('/search')}>&#xe62b;</span>
            </Top>
            <Tab>
                <NavLink to="/recommend" className={({ isActive }) =>
                    isActive ? 'selected' : undefined
                }><TabItem><span > 推荐 </span></TabItem></NavLink>
                <NavLink to="/singers" className={({ isActive }) =>
                    isActive ? 'selected' : undefined
                }><TabItem><span > 歌手 </span></TabItem></NavLink>
                <NavLink to="/rank" className={({ isActive }) =>
                    isActive ? 'selected' : undefined
                }><TabItem><span > 排行榜 </span></TabItem></NavLink>
            </Tab>
            <Player></Player>
            <Outlet />
        </div>
    )
}


export default React.memo(Home);

