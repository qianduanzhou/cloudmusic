export default class Song {
    constructor(id,mid,aid,singer,name,album,duration,picUrl,url,alia,albumPublishTime) {
        this.id = id,
        this.mid = mid,
        this.aid = aid,
        this.singer = singer,
        this.name = name,
        this.album = album,
        this.duration = duration,
        this.picUrl = picUrl,
        this.url = url,
        this.alia = alia,
        this.albumPublishTime = albumPublishTime
    }
}

export function createSong(musicData) {
    let id = musicData.ar ? musicData.ar[0].id : musicData.artists[0].id
    let mid = musicData.id
    let aid = musicData.al? musicData.al.id : musicData.album.id
    let singer =  musicData.ar ? musicData.ar[0].name : musicData.artists[0].name
    let name = musicData.name
    let album = musicData.al ? musicData.al.name : musicData.album.name
    let duration = musicData.dt? musicData.dt : musicData.duration
    let picUrl = musicData.al ? musicData.al.picUrl : musicData.album.picUrl
    let alia = musicData.alia ? musicData.alia[0] : musicData.alias[0]
    let url = ''
    let albumPublishTime = musicData.al ?  musicData.al.publishTime : musicData.album.publishTime
    return new Song(id,mid,aid,singer,name,album,duration,picUrl,url,alia,albumPublishTime)
}

// export function createSong(id,mid,singer,name,album,duration,picUrl,url,alia,albumPublishTime,aid) {
//     return new Song(id,mid,singer,name,album,duration,picUrl,url,alia,albumPublishTime,aid)
// }