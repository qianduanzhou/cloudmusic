export const userName = state => state.userInfo.userName
export const nickName = state => state.userInfo.nickName
export const userId = state => state.userInfo.userId
export const avatarUrl = state => state.userInfo.avatarUrl
export const password = state => state.userInfo.password
export const collectSongList = state => state.userInfo.collectSongList
export const collectSong = state => state.userInfo.collectSong
export const collectSinger = state => state.userInfo.collectSinger
export const collectAlbum = state => state.userInfo.collectAlbum


export const singer = state => state.songs.singer
export const playing = state => state.songs.playing
export const fullScreen = state => state.songs.fullScreen
export const playList = state => state.songs.playList
export const sequenceList = state => state.songs.sequenceList
export const mode = state => state.songs.mode
export const currentIndex = state => state.songs.currentIndex
export const audio = state => state.songs.audio
export const playHistoryList = state => state.songs.playHistoryList

export const currentSong = (state) => {
    return state.songs.playList[state.songs.currentIndex] || {}
}

export const loading = state => state.loading
