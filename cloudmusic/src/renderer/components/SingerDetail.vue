<template>
  <div class="singerDetail" ref="singerDetail" style="width: 100%;height: 100%;">
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
          <span class="collectSinger"><i class="iconfont icon-shoucanggedan"></i>收藏</span>
      </header>
      <ul class="singerNav">
          <li v-for="(item,index) in navList" :key = "item" @click="cur = index" :class="{'active':cur == index}">{{item}}</li>
      </ul>
      <div class="album">
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
      <div class="album" v-for="item in album" :key="item.id">
          <album :Songs="item" :show="cur == 0" v-if="item.length != 0"  :types = "5" :width="70">
            <template v-slot:pic>
                <div class="albumPic bgc"  :style="{backgroundImage: `url(${item[0].picUrl})`}"></div>
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
</template>

<script>
import axios from 'axios'
import Album from '../components/Album'
import {createSong} from '../common/song'
import { resolve } from 'url';

export default {
    data() {
        return {
             singerDetail:{},
             hotSongs:[],
             album:[],
             test:'2',
             navList:[
                 '专辑','MV','歌手详情','相似歌手'
             ],
             cur: 0,
        }
    },
    components: {
        Album
    },
    created() {
        this.initSingerDetail()
        this.initAlbum()
        this.pushTime = 0
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            setTimeout(() => {
                this.$refs.singerDetail.style.width = `${document.documentElement.offsetWidth - 200}px`
                this.$refs.singerDetail.style.height = `${document.documentElement.clientHeight - 100}px`
                window.onresize = () => {
                    this.$refs.singerDetail.style.width = `${document.documentElement.offsetWidth - 200}px`
                    this.$refs.singerDetail.style.height = `${document.documentElement.clientHeight - 100}px`
                }
            }, 500); 
        },
        initSingerDetail (){
            axios.get('http://localhost:3000/artists',
            {
                params:{
                    id:this.$route.params.id
                }
            }).then((result) => {
                let res = result.data
                this.singerDetail = res
                this._normalizeSongs(this.singerDetail.hotSongs).then((ret) => {
                   this.hotSongs = ret
                })
            })
        },
         async _normalizeSongs(list,pushTime) {
            let ret = []
            for(let i = 0; i < list.length; i ++) {
                let id = list[i].ar[0].id
                let mid = list[i].id
                let singer = list[i].ar[0].name
                let name = list[i].name
                let album = list[i].al.name
                let duration = list[i].dt
                let picUrl = list[i].al.picUrl
                let alia = list[i].alia[0]
                let albumPublishTime = pushTime
                let url = ''
                ret.push(createSong(id,mid,singer,name,album,duration,picUrl,url,alia,albumPublishTime))
            }
            return ret
        },
        initAlbum() {
            axios.get('http://localhost:3000/artist/album',{
                params:{
                    id:this.$route.params.id
                }
            }).then((result) => {
                let res = result.data
                if(res.code === 200) {
                    for(let i = 0; i < res.hotAlbums.length; i ++) {
                        this.initAlbumDetail(res.hotAlbums[i].id,res.hotAlbums[i].publishTime)
                    }
                }
            })
        },
        async initAlbumDetail(id,pushTime) {
            await axios.get('http://localhost:3000/album',{
                params:{
                    id:id
                }
            }).then((result) => {
                let res = result.data
                if(res.code === 200) {
                    this._normalizeSongs(res.songs,pushTime).then((ret) => {
                        this.album.push(ret)
                        console.log(this.album)
                    })
                }
            })
        }
    }
}
</script>

<style lang='scss'>
.singerDetail {
    position: fixed;
    background: #FAFAFA;
    z-index: 99;
    top: 50px;
    left: 200px;
    overflow: hidden;
    overflow-y: scroll;
    &::-webkit-scrollbar {
        width: 10px;
    }
    &::-webkit-scrollbar-thumb {
        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
        border-radius: 10px;
        background: rgba(236,236,236,1);
        &:hover {
          background: #CFCFD1;
        }
    }
    &::-webkit-scrollbar-track {
        border-right:1px solid rgba(100,100,100,.2);
        background: rgba(188,188,188,.1);
    }
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
            text-align: center;
            line-height: 23px;
            border: 1px solid #E1E1E2;
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
        border-bottom: 1px solid #E1E1E2;
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
}
</style>