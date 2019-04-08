<template>
  <div class="singerDetail">
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
      <album :hotSongs="hotSongs" :show="cur == 0" v-if="hotSongs.length != 0"></album>
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
    },
    methods: {
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
         async _normalizeSongs(list) {
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
                let url = ''
                ret.push(createSong(id,mid,singer,name,album,duration,picUrl,url,alia))
            }
            return ret
        }
    }
}
</script>

<style lang='scss'>
.singerDetail {
    position: fixed;
    width: 100%;
    height: 100%;
    background: #FAFAFA;
    z-index: 99;
    top:50px;
    left: 200px;
    overflow-y: scroll;
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
            right: 230px;
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
}
</style>