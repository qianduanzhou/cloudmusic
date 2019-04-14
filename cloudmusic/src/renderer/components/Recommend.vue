<template>
  <div class="recommend"  v-loading="loading">
      <div v-if="$route.fullPath=='/find/recommend'">
          <swiper :list="bannerList"></swiper>
      </div>
      <div class="head">
          <p class="title">推荐歌单</p>
          <div class="more" @click="moreSongList">
              <b>更多</b><span class="iconfont icon-you"></span>
          </div>
      </div>
      <img-list :listWidth="18" :list="recList" :isRec="true" @getData="toSongListDetail">
        <template v-slot:specail>
            <li style="width:18%" @click="toDayRec"><img src="../../../static/logo.jpg"/><p style="font-size:13px;">每日歌曲推荐</p></li>
        </template>
        <template v-slot:img="imgs">
              <img v-lazy="imgs.imgs.picUrl"/>
              <div class="num">
                <i class="iconfont icon-iconku-zhuanqu-"></i><span>{{imgs.imgs.playCount | wan}}</span>
              </div>
            <span class="ins">{{imgs.imgs.copywriter}}</span><i class="iconfont icon-bofang play"></i>
        </template>
      </img-list> 
      <div class="head">
          <p class="title">独家放送</p>
          <div class="more">
              <b>更多</b><span class="iconfont icon-you"></span>
          </div>
      </div>
      <img-list :listWidth="32" :list="specialList">
        <template v-slot:img="imgs">
              <img v-lazy="imgs.imgs.picUrl"/>
        </template>
      </img-list>
      <div class="head">
          <p class="title">最新音乐</p>
          <div class="more">
              <b>更多</b><span class="iconfont icon-you"></span>
          </div>
      </div>
      <music-list :list="musicList" @getData='toSinger' @getDatas='playMusic'>
      </music-list>

      <div class="head">
          <p class="title">推荐MV</p>
          <div class="more">
              <b>更多</b><span class="iconfont icon-you"></span>
          </div>
      </div>
      <img-list :listWidth="32" :list="mvList">
        <template v-slot:img="imgs">
              <img v-lazy="imgs.imgs.picUrl"/>
        </template>
      </img-list>
      <div v-loading="loading" style="height:100px;"></div>
      <footer class="edit">
          <p>现在可以根据个人喜好，自由调整首页栏目顺序啦~</p>
          <el-button type="danger" class="btn" plain>调整栏目顺序</el-button>
      </footer>
      <router-view/>
  </div>
</template>

<script>
import axios from 'axios'
import {shuffle} from '../common/utils'


import Swiper from '../base/Swiper'
import ImgList from '../base/ImgList'
import MusicList from '../base/MusicList'
import {createSong} from '../common/song'
import {mapActions} from 'vuex'

export default {

    components:{
        ImgList,
        Swiper,
        MusicList
    },
    created() {
        this.initList()
    },
    data() {
        return {
            bannerList:[],
            recList: [],
            specialList: [],
            mvList:[],
            musicList:[],
            loading: true
        }
    },
    methods: {
        initList() {
            axios.get('http://localhost:3000/banner').then((result) => {
                let res = result.data
                if(res.code == 200) {
                    this.bannerList = res.banners
                }
            })


            axios.get('http://localhost:3000/personalized').then((result) => {
                var res = result.data
                if(res.code == 200) {
                    this.recList = shuffle(res.result).slice(0,9)
                    this.loading = false
                }
            })
            axios.get('http://localhost:3000/personalized/privatecontent').then((result) => {
                var res = result.data
                if(res.code == 200) {
                    this.specialList = shuffle(res.result)
                    this.specialList.forEach((item) => {
                        item.picUrl = item.sPicUrl
                    })
                    this.loading = false
                }
            })
            axios.get('http://localhost:3000/personalized/mv').then((result) => {
                var res = result.data
                if(res.code == 200) {
                    this.mvList = shuffle(res.result).slice(0,3)
                    this.loading = false
                }
            })
            axios.get('http://localhost:3000/personalized/newsong').then((result) => {
                var res = result.data
                if(res.code == 200) {
                    this.musicList = res.result
                    this.loading = false
                }
            })
        },
        toSongListDetail(data) {
            this.$router.push(`/find/songList/${data.id}`)
        },
        moreSongList() {
            this.$router.push('/find/songList')
        },
        toSinger(data) {
            let id = data.song.artists[0].id
            this.$router.push(`/find/singer/${id}`)
        },
        playMusic(data){
            let song = data.song
            let id = song.artists[0].id
            let mid = song.id
            let singer = song.artists[0].name
            let name = song.name
            let album = song.album.name
            let duration = song.duration
            let picUrl = song.album.picUrl
            let alia = song.alias[0]
            let url = ''
            axios.get('http://localhost:3000/song/url',{
                    params: {
                        id: mid
                    }
                }).then((result) => {
                    let res = result.data
                    url = res.data[0].url
                    let Song = createSong(id,mid,singer,name,album,duration,picUrl,url,alia)
                    this.insertSong(Song)
                })
        },
        toDayRec() {
            this.$router.push('/find/recommend/dayRecSong')
        },
        ...mapActions([
            'insertSong'
        ])
    }
}
</script>

<style lang='scss'>
.recommend {
    width: 100%;
    .head {
        width: 100%;
        padding: 20px 0 10px 0;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #E1E1E2;
        .title {
            font-size: 20px;
            color: #333;
        }
        .more{
            color: #333;
            b {
                font-size: 12px;
            }
            .iconfont{
                font-size: 12px;
            }
            &:hover{
                color: #000;
                cursor: pointer;
            }
        }
    }
    .edit {
        margin-bottom: 80px;
        border-top: 1px solid #E1E1E2;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        p {
            width:100%;
            text-align: center;
            margin: 20px 0 15px 0;
            font-size: 12px;
            color: #888888;
        }
        .btn {
            width: 15%;
            height: 30px;
            line-height: 5px;
        }
    }
}
</style>