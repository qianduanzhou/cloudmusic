<template>
  <div class="searchResult" ref="searchResult">
      <header class="srTitle">
        搜索"<b>{{keywords}}</b>",找到{{songCount}}首单曲
      </header>
      <nav class="srNav allCenter">
        <div v-for="(item,index) in navList" :key = "item" @click="cur = index" class="Navitem" :class="{'NavActive':cur == index}">{{item}}</div>
      </nav>
      <div v-if="cur == 0" ref="songs">
        <div class="table alignCenter" v-if="cur == 0">
            <div class="tableItem tControl">操作</div>
            <div class="tableItem tMusicTitle">音乐标题</div>
            <div class="tableItem tSinger">歌手</div>
            <div class="tableItem tAlbum">专辑</div>
            <div class="tableItem tDuration">时长</div>
        </div>
        <album :Songs="songList" :show="cur == 0" :types="1" :width='100' :nameWidth="31" v-if="songList.length > 0" :key="songList[0].id">
        </album>
        <el-pagination
          style="margin:20px 0 50px 50%;transform:translateX(-50%)"
          background
          :page-size = "100"
          layout="prev, pager, next"
          @current-change = "changePage"
          :total="songCount">
        </el-pagination>
      </div>
      <div v-if="cur == 1" ref="singers">
        <ul class="srSingerContainer">
          <li class="srSingerContent alignCenter" v-for="item in singerList" :key="item.id" @click="toSinger(item.id)">
            <img v-lazy="item.img1v1Url" class="srSingerPic">
            <p class="srsinger">{{item.name}}</p>
          </li>
        </ul>
        <el-pagination
          style="margin:20px 0 50px 50%;transform:translateX(-50%)"
          background
          :page-size = "100"
          layout="prev, pager, next"
          @current-change = "changePage2"
          :total="artistCount">
        </el-pagination>
      </div>
      <div v-if="cur == 2" ref="albums">
        <main class="mcAblumContainer">
          <div class="mcAlbumItem alignCenter"  v-for="item in albumList" :key="item.id" @click="toAlbum(item.id)">
            <img v-lazy="item.picUrl" class="mcAlbumPic spc"/>
            <p class="mcAlbumName">{{item.name}}</p>
            <p class="mcAlbumSinger">{{item.artists[0].name}}</p>
            <span>{{item.size}}首</span>
          </div>
          <el-pagination
            style="margin:20px 0 50px 50%;transform:translateX(-50%)"
            background
            :page-size = "100"
            layout="prev, pager, next"
            @current-change = "changePage3"
            :total="albumCount">
          </el-pagination>
        </main>
      </div>
      <div v-if="cur == 3" ref="playList">
        <main class="mcAblumContainer">
          <div class="mcAlbumItem alignCenter"  v-for="item in playList" :key="item.id" @click="toSongList(item.id)">
            <img v-lazy="item.coverImgUrl" class="mcAlbumPic spc"/>
            <p class="mcAlbumName">{{item.name}}</p>
            <p class="mcAlbumSinger">by&nbsp;&nbsp;{{item.creator.nickname}}</p>
            <span>{{item.trackCount}}首</span>
          </div>
          <el-pagination
            style="margin:20px 0 50px 50%;transform:translateX(-50%)"
            background
            :page-size = "100"
            layout="prev, pager, next"
            @current-change = "changePage4"
            :total="albumCount">
          </el-pagination>
        </main>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
import Album from '../base/Album'
import {createSong} from '../common/song'

export default {
  props:['root'],
  data() {
    return {
      cur:0,
      songCount:0,
      artistCount:0,
      albumCount:0,
      playlistCount:0,
      navList: [
          '单曲',
          '歌手',
          '专辑',
          '歌单'
      ],
      songList: [],
      singerList: [],
      albumList: [],
      playList: []
    }
  },
  components: {
    Album
  },
  created() {
    this.keywords = this.$route.params.keywords
    this.initSong()
    this.initSinger()
    this.initAlbum()
    this.initPlayList()
  },
  methods: {
    initSong() {
      axios.get('http://localhost:3000/search',{
        params:{
          keywords:this.keywords,
          limit:100
        }
      }).then((result) => {
        let res = result.data
        if(res.code == 200) {
          this.songList = this._normalizeSongList2(res.result.songs)
          this.songCount = res.result.songCount
        }
      })
    },
    initSinger() {
      axios.get('http://localhost:3000/search',{
        params:{
          keywords:this.keywords,
          limit:100,
          type:100
        }
      }).then((result) => {
        let res = result.data
        if(res.code == 200) {
          this.singerList = res.result.artists
          this.artistCount = res.result.artistCount
        }
      })
    },
    initAlbum() {
      axios.get('http://localhost:3000/search',{
        params:{
          keywords:this.keywords,
          limit:100,
          type:10
        }
      }).then((result) => {
        let res = result.data
        if(res.code == 200) {
          this.albumList = res.result.albums
          this.albumCount = res.result.albumCount
        }
      })
    },
    initPlayList() {
      axios.get('http://localhost:3000/search',{
        params:{
          keywords:this.keywords,
          limit:100,
          type:1000
        }
      }).then((result) => {
        let res = result.data
        if(res.code == 200) {
          this.playList = res.result.playlists
          this.playlistCount = res.result.playlistCount
        }
      })
    },
    changePage(index) {
      let offset = (index-1) * 100
      axios.get('http://localhost:3000/search',{
        params:{
          keywords:this.keywords,
          offset:offset,
          limit:100
        }
      }).then((result) => {
        let res = result.data
        if(res.code == 200) {
          this.songList = this._normalizeSongList2(res.result.songs)
          this.songCount = res.result.songCount
          this.root.scrollTop = this.$refs.songs.offsetTop -50
        }
      })
    },
    changePage2(index) {
      let offset = (index-1) * 100
      axios.get('http://localhost:3000/search',{
        params:{
          keywords:this.keywords,
          offset:offset,
          limit:100,
          type:100
        }
      }).then((result) => {
        let res = result.data
        if(res.code == 200) {
          this.singerList = res.result.artists
          this.artistCount = res.result.artistCount
          this.root.scrollTop = this.$refs.singers.offsetTop -50
        }
      })
    },
    changePage3(index) {
      let offset = (index-1) * 100
      axios.get('http://localhost:3000/search',{
        params:{
          keywords:this.keywords,
          offset:offset,
          limit:100,
          type:10
        }
      }).then((result) => {
        let res = result.data
        if(res.code == 200) {
          this.albumList = res.result.albums
          this.albumCount = res.result.albumCount
          this.root.scrollTop = this.$refs.albums.offsetTop -50
        }
      })
    },
    changePage4(index) {
      let offset = (index-1) * 100
      axios.get('http://localhost:3000/search',{
        params:{
          keywords:this.keywords,
          offset:offset,
          limit:100,
          type:1000
        }
      }).then((result) => {
        let res = result.data
        if(res.code == 200) {
          this.playList = res.result.playlists
          this.playlistCount = res.result.playlistCount
          this.root.scrollTop = this.$refs.playList.offsetTop -50
        }
      })
    },
    toSinger(id) {
      this.$router.push(`/find/singer/${id}`)
    },
    toAlbum(id) {
      this.$router.push(`/album/${id}`)
    },
    toSongList(id) {
      this.$router.push(`/find/songlist/${id}`)
    },
    _normalizeSongList2(list) {
      let ret = []
      for(let i = 0; i < list.length; i ++) {
        let id = list[i].artists[0].id
        let mid = list[i].id
        let aid = list[i].album.id
        let singer = list[i].artists[0].name
        let name = list[i].name
        let album = list[i].album.name
        let duration = list[i].duration
        let picUrl = list[i].artists.img1v1Url
        let alia = list[i].alias[0]
        let url = ''
        let pubTime = list[i].album.publishTime
        ret.push(createSong(id,mid,singer,name,album,duration,picUrl,url,alia,pubTime,aid))
      }
          return ret
    },
  }
}
</script>

<style lang='scss'>
.searchResult {
  overflow-x: hidden;
  .srTitle {
    margin: 30px 30px;
    font-size: 13px;
    color:#333333;
    b {
      color:#0C73C2;
    }
  }
  .srNav {
    padding-left: 30px;
    border-bottom: 1px solid #E1E1E2;
    .Navitem {
        position: relative;
        padding: 10px 50px;
        font-size: 14px;
        color:#444444;
        cursor: pointer;
        &:hover{
            color: #111111;
        }
    }
    .NavActive {
        color:#C62F2F;
        &:hover {
            color:#C62F2F;
        }
        &::before{
            content: '';
            width: 40%;
            height: 3px;
            background:#C62F2F;
            position: absolute;
            left: 40px;
            bottom: 0
        }
    }
  }
  .table {
    width: 100%;
    border-top: 1px solid #E1E1E2;
    box-sizing: border-box;
    .tableItem {
        box-sizing: border-box;
        padding: 10px 0 10px 10px;
        font-size: 12px;
        color: #666666;
        border-left: 1px solid #E1E1E2;
    }
    .tControl {
        width: 90px;
    }
    .tMusicTitle {
        width: 33%;
    }
    .tSinger {
        width: 22%;
    }
    .tAlbum {
        width: 22%;
    }
  }
  .srSingerContainer {
    .srSingerContent {
      cursor: pointer;
      padding: 10px 30px;
      &:hover {
        background: #EBECED;
      }
      .srSingerPic {
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }
      .srsinger {
        font-size: 14px;
      }
    }
  }
  .mcAblumContainer {
    font-size: 13px;
    color: #666666;
    .mcAlbumItem {
      padding: 10px 30px;
      &:hover {
        background: #EBECED;
      }
      .mcAlbumPic{
        cursor: pointer;
        width: 40px;
        height: 40px;
      }
      .mcAlbumName {
        cursor: pointer;
        width: 55%;
        text-align: left;
        margin-left: 20px;
        &:hover {
          color:#333;
        }
      }
      .mcAlbumSinger {
        width: 30%;
        cursor: pointer;
        &:hover {
          color:#333;
        }
      }
    }
  }
}
</style>