const state = {
    userInfo:{
        userName:'',
        userId:'',
        nickName:'',
        password:'',
        avatarUrl:'',
        collectSongList:[],
        collectSong:[],
        collectSinger:[],
        collectAlbum:[]
    },
    songs:{
        singer: {},
        playing: false,
        fullScreen: false,
        playList: [],
        sequenceList: [],
        playHistoryList: [],
        mode: 'sequence',
        currentIndex: -1,
        audio:{}
    },
}
export default state