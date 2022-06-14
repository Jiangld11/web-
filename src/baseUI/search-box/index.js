import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
    useNavigate
} from "react-router-dom";

import { SearchBoxWrapper } from './style.js'
import { debounce } from './../../api/utils';


const SearchBox = (props) => {
    const queryRef = useRef();
    const [query, setQuery] = useState('');
    let navigate = useNavigate();
    // 从父组件热门搜索中拿到的新关键词
    const { newQuery } = props;
    // 父组件针对搜索关键字发请求相关的处理
    const { handleQuery } = props;
    // 根据关键字是否存在决定清空按钮的显示 / 隐藏 
    const displayStyle = query ? { display: 'block' } : { display: 'none' };

    useEffect(() => {
        //进场时input应该出现光标
        queryRef.current.focus();
    }, []);

    const handleChange = (e) => {
        // 搜索框内容改变时的逻辑
        setQuery(e.currentTarget.value);
    };
    //缓存方法
    let handleQueryDebounce = useMemo(() => {
        return debounce(handleQuery, 500)
    }, [handleQuery]);

    useEffect(() => {
        // 注意防抖 远程搜索关键词
        handleQueryDebounce(query);
    }, [query]);

    useEffect(() => {
        //父组件点击了热门搜索的关键字，newQuery 更新:
        if (newQuery !== query) {
            setQuery(newQuery);
        }
    }, [newQuery]);

    const clearQuery = () => {
        // 清空框内容的逻辑
        setQuery('');
        queryRef.current.focus();
    }

    return (
        <SearchBoxWrapper>
            <i className="iconfont icon-back" onClick={() => navigate(-1)}>&#xe655;</i>
            <input ref={queryRef} className="box" placeholder="搜索歌曲、歌手、专辑" value={query} onChange={handleChange} />
            <i className="iconfont icon-delete" onClick={clearQuery} style={displayStyle}>&#xe600;</i>
        </SearchBoxWrapper>
    )
};

export default React.memo(SearchBox)