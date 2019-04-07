const state = {
    userInfo:{
        userName:'',
        nickName:'',
        avatarUrl:''
    },
    songs:{
        singer: {},
        playing: false,
        fullScreen: false,
        playList: [],
        sequenceList: [],
        mode: 'sequence',
        currentIndex: -1,
        audio:{}
    }
}
export default state