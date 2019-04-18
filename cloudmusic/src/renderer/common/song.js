export default class Song {
    constructor(id,mid,singer,name,album,duration,picUrl,url,alia,albumPublishTime,aid) {
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

export function createSong(id,mid,singer,name,album,duration,picUrl,url,alia,albumPublishTime,aid) {
    return new Song(id,mid,singer,name,album,duration,picUrl,url,alia,albumPublishTime,aid)
}