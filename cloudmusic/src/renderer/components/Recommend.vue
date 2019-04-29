<template>
  <div class="recommend">
      <div v-if="$route.fullPath=='/find/recommend'">
          <swiper :list="bannerList"  v-if="bannerList.length>1"></swiper>
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
      <footer class="edit">
          <p>现在可以根据个人喜好，自由调整首页栏目顺序啦~</p>
          <el-button type="danger" class="btn" plain>调整栏目顺序</el-button>
      </footer>
      <router-view/>
  </div>
</template>

<script>
import {shuffle} from '../common/utils'
import Swiper from '../base/Swiper'
import ImgList from '../base/ImgList'
import MusicList from '../base/MusicList'
import {createSong} from '../common/song'
import {mapActions,mapGetters} from 'vuex'
import {Axios,getBanner,getPersonalized,getPrivatecontent,getRecMv,getNewSong,getSongUrl} from '../common/api'
import {setLoading} from '../common/mixin'

export default {
    mixins:[setLoading],
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
        }
    },
    computed:{
        ...mapGetters([
            'loading'
        ])
    },
    methods: {
        initList() {
            Axios(getBanner).then((res) => {
                this.bannerList = res.banners
                this.set_loading(false)
            })

            Axios(getPersonalized).then((res) => {
                this.recList = shuffle(res.result).slice(0,9)
            })

            Axios(getPrivatecontent).then((res) => {
                this.specialList = shuffle(res.result)
                this.specialList.forEach((item) => {
                    item.picUrl = item.sPicUrl
                })
            })

            Axios(getRecMv).then((res) => {
                this.mvList = shuffle(res.result).slice(0,3)
            })

            Axios(getNewSong).then((res) => {
                this.musicList = res.result
            })
        },
        toSongListDetail(data) {
            this.$router.push(`/songListDetail/${data.id}`)
        },
        moreSongList() {
            this.$router.push('/find/songList')
        },
        toSinger(data) {
            let id = data.song.artists[0].id
            this.$router.push(`/singerDetail/${id}`)
        },
        playMusic(data){
            let song = data.song
            Axios(getSongUrl,{
                id : song.id
            }).then((res) => {
                let url = res.data[0].url
                let Song = createSong(song)
                Song.url = url
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
@import '../assets/css/base.scss';
.recommend {
    width: 100%;
    .head {
        width: 100%;
        padding: 20px 0 10px 0;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid $borderColor;
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
        border-top: 1px solid $borderColor;
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