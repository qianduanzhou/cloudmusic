<template>

  <div class="singerDetail scrollStyle" ref="singerDetail">
      <header class="singeheader left">
          <div class="pic" :style ='{ backgroundImage: `url(${singerDetail.artist.img1v1Url})`}'></div>
          <div class="singInfo">
              <span class="job">歌手</span>
              <p class="name">{{singerDetail.artist.name}}</p>
              <div class="item">
                  <i class="iconfont icon-yinle"></i> 
                  <p>单曲数：{{singerDetail.artist.musicSize}}</p>
              </div>
              <div class="item">
                  <i class="iconfont icon-zhuanji"></i> 
                  <p>专辑数：{{singerDetail.artist.albumSize}}</p>
              </div>
              <div class="item">
                  <i class="iconfont icon-mv"></i> 
                  <p>MV数：{{singerDetail.artist.mvSize}}</p>
              </div>
          </div>
          <span class="collectSinger" v-if="!isCollect" :plain="true" @click="collect"><i class="iconfont icon-shoucanggedan"></i>收藏</span>
          <span class="collectSinger" v-if="isCollect" :plain="true" @click="canCollect"><i class="iconfont icon-xiangxiayuanjiantouxiajiantouxiangxiamianxing"></i>已收藏</span>
      </header>
      <ul class="singerNav">
          <li v-for="(item,index) in navList" :key = "item" @click="cur = index" :class="{'active':cur == index}">{{item}}</li>
      </ul>
      <div class="album" v-if="cur == 0">
          <album :Songs="hotSongs" :show="cur == 0" v-if="hotSongs.length != 0" :width="70">
            <template v-slot:pic>
                <div class="albumPic bgc"  style="background: url('/static/hotsong.jpg')"></div>
            </template>
            <template v-slot:header>
                <div class="Navheader">
                        <p class="title">热门50首</p>
                        <div class="i">
                            <i class="iconfont icon-shoucanggedan"></i>
                            <i class="iconfont icon-bofang"></i>
                        </div>
                </div>
            </template>
        </album>
      </div>
      <div  v-if="cur == 0">
          <div class="album" v-for="item in album" :key="item.id">
            <album :Songs="item" :show="cur == 0" v-if="item.length != 0"  :types = "5" :width="70">
                <template v-slot:pic>
                    <div class="albumPic bgc"  :style="{backgroundImage: `url(${item[0].picUrl})`}" @click="toAlbum(item)"></div>
                </template>
                <template v-slot:header>
                    <div class="Navheader">
                            <p class="title">{{item[0].album}}</p>
                            <div class="i">
                                <i class="iconfont icon-shoucanggedan"></i>
                                <i class="iconfont icon-bofang"></i>
                            </div>
                    </div>
                </template>
            </album>
        </div>
      </div>
      
      <div class="singerMV" v-if="cur == 1" style="margin:10px 25px">
          <imgList :listWidth="22" :list="mvList">
            <template v-slot:img="imgs">
               <img v-lazy="imgs.imgs.imgurl16v9"/>
               <div class="num">
                <i class="iconfont icon-shipin1"></i><span>{{imgs.imgs.playCount | wan}}</span>
               </div>
               <span class="duration">{{imgs.imgs.duration | time}}</span>
            </template>
          </imgList>
          <div v-loading="loading"></div>
          <p style="width:100%;text-align:center;margin-bottom:50px;color:#888888;" v-if="!loading">没有更多MV了~~~</p>
      </div>

      <div class="singerDesc" v-if="cur == 2">
          <div class="descItem" v-for="item in introduction" :key="item.ti">
              <h1 v-html="item.ti"></h1>
              <li v-for="(item2,index) in item.txt" :key="index" v-html="item2">
              </li>
          </div>
      </div>

      <div class="sameSinger" v-if="cur == 3">
          <imgList :listWidth="20" :list="sameSingerList" @getData="toSinger">
            <template v-slot:img="imgs">
               <img v-lazy="imgs.imgs.img1v1Url" style="width:70%;display:block;margin:0 auto;"/>
            </template>
          </imgList>
      </div>
  </div>
</template>

<script>
import Album from '../base/Album'
import ImgList from '../base/ImgList'
import {createSong} from '../common/song'
import { resolve } from 'url';
import {initPage} from '../common/utils'
import {mapMutations,mapGetters,mapState} from 'vuex'
import {Axios,getSingerDetail,getSingerAlbum,
getAlbumDetail,getSingerMv,getSingerDesc,
getSameSinger,collectSinger} from '../common/api'

export default {
    data() {
        return {
             singerDetail: {},
             hotSongs: [],
             album: [],
             introduction: [],
             mvList: [],
             sameSingerList:[],
             offset:0,
             loading: true,
             hasMoreMv: true,
             test: '2',
             navList: [
                 '专辑','MV','歌手详情','相似歌手'
             ],
             cur: 0,
        }
    },
    computed: {
        ...mapGetters([
           'collectSinger' 
        ]),
        isCollect() {
            let id = parseInt(this.$route.params.id)
            return this.collectSinger.includes(id)
        }
    },
    components: {
        Album,
        ImgList
    },
    created() {
        this.id = parseInt(this.$route.params.id)
        this.initSingerDetail()
        this.initAlbum()
        this.initMv()
        this.initDesc()
        this.initSameSinger()
    },
    mounted() {
        this.init()
        this.moreMv()
    },
    methods: {
        init() {

            setTimeout(() => {
                let outside = document.documentElement,
                innerside = this.$refs.singerDetail
                initPage(outside,innerside)
            }, 500); 
        },
        initSingerDetail (){
            let params = {
                id: this.id
            }
            Axios(getSingerDetail,params).then((res) => {
                this.singerDetail = res
                this.hotSongs = this._normalizeSongs(this.singerDetail.hotSongs)
            })
        },
         _normalizeSongs(list,pushTime) {
            let ret = []
            for(let i = 0; i < list.length; i ++) {
                ret.push(createSong(list[i]))
            }
            return ret
        },
        initAlbum() {
            let params = {
                id: this.id
            }
            Axios(getSingerAlbum,params).then((res) => {
                for(let i = 0; i < res.hotAlbums.length; i ++) {
                    this.initAlbumDetail(res.hotAlbums[i].id,res.hotAlbums[i].publishTime)
                }
            })
        },
        initAlbumDetail(id,pushTime) {
            let params = {
                id:id
            }
            Axios(getAlbumDetail,params).then((res) => {
                this.album.push(this._normalizeSongs(res.songs,pushTime))
            })
        },
        initMv() {
            let id = this.$route.params.id
            let params = {
                id: this.id,
                limit: 20
            }
            Axios(getSingerMv,params).then((res) => {
                this.mvList = res.mvs
            })
        },
        moreMv() {
            setTimeout(() => {
                this.$refs.singerDetail.onscroll = () => {
                    let clientHeight = this.$refs.singerDetail.clientHeight,
                    scrollTop = this.$refs.singerDetail.scrollTop,
                    scrollHeight = this.$refs.singerDetail.scrollHeight
                    if(clientHeight + scrollTop >= scrollHeight && this.cur == 1 && this.hasMoreMv) {
                        this.offset += 20
                        let params = {
                            id: this.id,
                            offset: this.offset
                        }
                        Axios(getSingerMv,params).then((res) => {
                            this.hasMoreMv = res.hasMore
                            
                            if(!this.hasMoreMv) {
                                return this.loading = false
                            }
                            this.mvList = this.mvList.concat(res.mvs)
                        })
                    }
                } 
            }, 500);           
        },
        initDesc() {
            let params = {
                id: this.id
            }
            Axios(getSingerDesc,params).then((res) => {
                let introduction = res.introduction
                this.introduction = introduction.filter((item) => {
                    item.txt = item.txt.split('\n')
                    
                    let item2 = item.txt.map((item) => {
                         return `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${item}`
                    })
                    item.txt = item2
                    return item
                })
            })
        },
        initSameSinger() {
            let id = this.$route.params.id
            let params = {
                id: this.id
            }
            Axios(getSameSinger,params).then((res) => {
                this.sameSingerList = res.artists
            })
        },
        toSinger(data) {
            let id = data.id
            this.$router.push(`/find/singer/${id}`)  
        },
        collect() {
            let params = {
                t: 1,
                id: this.id,
                timestamp: (new Date()).getTime()
            }
            Axios(collectSinger,params).then((res) => {
                let collectList = this.collectSinger.slice(0)
                collectList.push(this.id)
                this.set_collectSinger(collectList)
                this.collectNum += 1
                this.$message({
                    type:'success',
                    message:'收藏成功',
                    center: true
                });
            })         
        },
        canCollect() {
            let params = {
                t: 2,
                id: this.id,
                timestamp: (new Date()).getTime()
            }
            Axios(collectSinger,params).then((res) => {
                let collectList = this.collectSinger.slice(0)
                let index = collectList.findIndex((item) => {
                    return item == this.id
                })
                collectList.splice(index,1)
                this.set_collectSinger(collectList)
                this.collectNum -= 1
                this.$message({
                    type:'success',
                    message:'取消收藏成功',
                    center: true
                });
            }) 
        },
        toAlbum(album) {
            let id = album[0].aid
            this.$router.push(`/album/${id}`)
        },
        ...mapMutations({
           set_collectSinger:'SET_COLLECTSINGER'
        })
    }
}
</script>

<style lang='scss'>
@import '../assets/css/base.scss';
.singerDetail {
    position: fixed;
    background: #FAFAFA;
    z-index: 99;
    top: 50px;
    left: 200px;
    width: 880px;
    height: 570px;
    overflow: hidden;
    overflow-y: scroll;
    border-left: 1px solid $borderColor;
    .singeheader {
        margin: 33px;
        .pic {
            width: 200px;
            height: 200px;
            border: 1px solid #ccc;
            background-position: center;
            background-size: 200px 200px;
        }
        .singInfo {
            padding-left: 30px;
            .job {
                width: 40px;
                height: 23px;
                background: #C62F2F;
                color: white;
                border-radius: 2px;
                text-align: center;
                line-height: 23px;
                margin-top: 4px;
                display: inline-block;
                margin-bottom: 30px;
            }
            .name {
                position: relative;
                top: 2px;
                display: inline-block;
                font-size: 23px;
                padding-left: 5px
            }
            .item {
                margin: 6px 0;
                color: #666666;
                i{
                    display: inline-block;
                    padding-right: 3px;
                }
                p{
                    display: inline-block;
                }
            }
        }
        .collectSinger {
            width: 60px;
            height: 23px;
            cursor: pointer;
            text-align: center;
            line-height: 23px;
            border: 1px solid $borderColor;
            color:#666666;
            position: absolute;
            border-radius: 2px;
            right: 30px;
            i{
                padding-right: 5px;
            }
        }
    }
    .singerNav {
        cursor: pointer;
        border-bottom: 1px solid $borderColor;
        display: flex;
        padding: 0 30px;
        .active {
            color:#C62F2F;
            position: relative;
            &::before{
                content: '';
                width: 35%;
                height: 3px;
                background:#C62F2F;
                position: absolute;
                bottom: 0
            }
        }
        li {
            padding: 10px 30px;
            font-size: 15px;
            color: #333;
        }
    }
    .album {
        margin: 0 30px 20px 15px;
        &:nth-of-type(1) {
            margin-top: 15px;
        }
        &:last-child {
            margin-bottom: 60px;
        }
    }
    .singerDesc {
        margin: 30px 25px;
        .descItem {
            margin-bottom: 50px;
            h1 {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            li {
                list-style: none;
                font-size: 14px;
                line-height: 28px;
                color: #666666;
            }
        }
        
    }
}
</style>