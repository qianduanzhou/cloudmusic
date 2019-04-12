export default class Song {
    constructor(id,mid,singer,name,album,duration,picUrl,url,alia,albumPublishTime) {
        this.id = id,
        this.mid = mid,
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

export function createSong(id,mid,singer,name,album,duration,picUrl,url,alia,albumPublishTime) {
    return new Song(id,mid,singer,name,album,duration,picUrl,url,alia,albumPublishTime)
}