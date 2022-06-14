
import { axiosInstance } from './config';

//获取轮播图列表
export const getBannerRequest = () => {
    return axiosInstance.get('/banner');
}

//获取推荐列表
export const getRecommendListRequest = () => {
    return axiosInstance.get("/personalized");
}
//获取热门歌手分类列表
export const getHotSingerListRequest = (count) => {
    return axiosInstance.get(`/top/artists?offset=${count}`);
}
//获取歌手列表
export const getSingerListRequest = (category, alpha, count) => {
    return axiosInstance.get(`/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`);
}
//排行榜单列表
export const getRankListRequest = () => {
    return axiosInstance.get(`/toplist/detail`);
};
//获取歌单详情
export const getAlbumDetailRequest = id => {
    return axiosInstance.get(`/playlist/detail?id=${id}`);
};
//获取歌手详情
export const getSingerInfoRequest = id => {
    return axiosInstance.get(`/artists?id=${id}`);
};
//获取歌词列表
export const getLyricRequest = id => {
    return axiosInstance.get(`/lyric?id=${id}`);
};
export const getHotKeyWordsRequest = () => {
    return axiosInstance.get(`/search/hot`);
};

export const getSuggestListRequest = query => {
    return axiosInstance.get(`/search/suggest?keywords=${query}`);
};

export const getResultSongsListRequest = query => {
    return axiosInstance.get(`/search?keywords=${query}`);
};
export const getSongDetailRequest = id => {
    //请求单曲接口数据
    return axiosInstance.get(`/song/detail?ids=${id}`);
};