import axios from 'axios'

export const url = "http://localhost:3000"

//  手机号登录
export const cellLogin = "/login/cellphone"
//  退出登录
export const Logout = "/logout"
//  获取用户歌单列表
export const getUserSongList = "/user/playlist"
//  获取用户收藏歌手列表
export const getUserCollectSinger = "/artist/sublist"
//  获取用户喜欢音乐
export const getUserLikeMusic = "/likelist"
//  获取用户播放历史（一周）
export const getUserPlayHistory = "/user/record"


//  获取热搜
export const getHotSearch = "/search/hot"
//  获取建议热搜内容
export const adviseSearch = "/search/suggest"
//  获取搜索内容
export const getSearchContent = "/search"




//  获取轮播图数据
export const getBanner = "/banner"
//  获取推荐歌单
export const getPersonalized = "/personalized"
//  获取独家放送
export const getPrivatecontent = "/personalized/privatecontent"
//  获取推荐MV
export const getRecMv = "/personalized/mv"
//  获取最新音乐
export const getNewSong = "/personalized/newsong"




//  获取歌单导航栏
export const getSongListNav = "/playlist/catlist"
//  获取歌单热门标签
export const getSongListHotNav = "/playlist/hot"
//  获取歌单列表
export const getSongList = "/top/playlist"
//  获取歌单详情
export const getSongListDetail = "/playlist/detail"
//  获取歌单评论内容
export const getComment = "/comment/playlist"
//  获取歌单收藏者
export const getSLCollecter = "/playlist/subscribers"
//  收藏/取消收藏歌单
export const collectSongList = "/playlist/subscribe"
//  获取精品歌单
export const getGSongList = "/top/playlist/highquality"



//  获取歌手列表
export const getSinger = "/artist/list"
//  获取歌手详情
export const getSingerDetail = "/artists"
//  获取歌手专辑
export const getSingerAlbum = "/artist/album"
//  获取歌手MV
export const getSingerMv = "/artist/mv"
//  获取歌手介绍
export const getSingerDesc = "/artist/desc"
//  获取相似歌手
export const getSameSinger = "/simi/artist"
//  收藏歌手
export const collectSinger = "/artist/sub"


//  获取歌曲歌词
export const getLyric = "/lyric"
//  初始化歌曲评论
export const getSongComment = "/comment/music"
//  获取相似歌单
export const getSameSongList = "/simi/playlist"
//  获取相似歌曲
export const getSameSong = "/simi/song"
//  获取最近听过的用户
export const getSamePeople = "/simi/user"
//  喜欢音乐
export const likeMusic = "/like"


//  获取每日推荐歌曲
export const getDRSong = "/recommend/songs"


//  获取排行榜列表
export const toplist = "/toplist"
//  获取排行榜内容
export const toplistDetail = "/top/list"
//  获取排行榜歌手榜
export const singerRank = "/toplist/artist"



//  获取专辑详情
export const getAlbumDetail = '/album'
//  获取专辑评论
export const getAlbumComment = "/comment/album"
//  获取已收藏的专辑
export const getCollectAlbum = "/album/sublist"


//  获取私人FM
export const getFm = '/personal_fm'

//  获取音乐url
export const getSongUrl = "/song/url"


//  发送评论
export const sendComment = "/comment"


export function Axios(api,params) {
    return new Promise((resolve,reject) => {
        axios.get(url+api,{
            params: params ? params : {}
        }).then((result) => {
            let res = result.data
            if(res.code === 200) {
                resolve(res)
            }
        }).catch((e) => {
            reject(e)
        })
    })   
}

