<template>
  <div class="dayRecSong scrollStyle" ref="dayRecSong" style="height:100%;width:100%;">
      <header class="drsHeader spCenter">
          <div class="alignCenter">
              <img src="/static/logo.jpg" class="drsPic">
              <div class="drsTitleContainer">
                  <p class="drsTitle">每日歌曲推荐</p>
                  <div class="drsDesc alignCenter">
                      <i class="iconfont icon-yinle"></i>
                      <p class="drsIns">根据你的音乐口味生成，每天6:00更新</p>
                  </div>
              </div>
          </div>   
          <div class="drsbac">
          </div>
      </header>
      <main class="drsMain">
          <div class="spCenter" style="margin-bottom:20px;">
              <div class="item alignCenter">
                <i class="iconfont icon-bofang" @click="playAll"></i><p  @click="playAll">播放全部</p><i class="add">+</i>
              </div>
              <div class="bCollection alignCenter">
                    <i class="iconfont icon-shoucanggedan"></i>
                    <span class="bcol">收藏全部</span>
              </div>
          </div>
          <album :Songs="drSongList" :show="true" :types="1" :width='100' :nameWidth="31" v-if="drSongList.length > 0">
          </album>
      </main>
  </div>
</template>

<script>
import axios from 'axios'
import Album from '../base/Album'
import {createSong} from '../common/song'
import {mapActions} from 'vuex'
export default {
    data() {
        return {
            drSongList:[]
        }
    },
    components: {
        Album
    },
    mounted() {
        this.init()
        this.initDRSong()
    },
    methods: {
        init() {
            setTimeout(() => {
                this.$refs.dayRecSong.style.width = `${document.documentElement.offsetWidth - 200}px`
                this.$refs.dayRecSong.style.height = `${document.documentElement.clientHeight - 100}px`
                window.onresize = () => {
                    this.$refs.dayRecSong.style.width = `${document.documentElement.offsetWidth - 200}px`
                    this.$refs.dayRecSong.style.height = `${document.documentElement.clientHeight - 100}px`
                }
            }, 500); 
        },
        initDRSong() {
            axios.get('http://localhost:3000/recommend/songs').then((result) => {
                let res = result.data
                if(res.code == 200) {
                    this._normalizeSongList(res.recommend).then((ret) => {
                        this.drSongList = ret
                    })
                }
            })
        },
        async _normalizeSongList(list) {
            let ret = []
            for(let i = 0; i < list.length; i ++) {
                let id = list[i].artists[0].id
                let mid = list[i].id
                let singer = list[i].artists[0].name
                let name = list[i].name
                let album = list[i].album.name
                let duration = list[i].duration
                let picUrl = list[i].album.picUrl
                let alia = list[i].alias[0]
                let url = ''
                ret.push(createSong(id,mid,singer,name,album,duration,picUrl,url,alia))
            }
            return ret
        },
        playAll() {
            /*标记*/
            let url = ''
            let index = Math.ceil(Math.random() * (this.drSongList.length-1))
            axios.get('http://localhost:3000/song/url',{
                    params: {
                        id: this.drSongList[index].mid
                    }
                }).then((result) => {
                    let res = result.data
                    url = res.data[0].url
                    this.drSongList[index].url = url
                    this.selectPlay({
                       list:this.drSongList,
                       index:index
                    })
            })
        },
        ...mapActions([
            'selectPlay'
        ]),
    }
}
</script>

<style lang='scss'>
.dayRecSong {
    position: fixed;
    top: 50px;
    left: 200px;
    background: #FAFAFA;
    overflow-y: scroll;

    .drsHeader {
        width: 100%;
        height: 150px;
        border-bottom: 1px solid #E1E1E2;
        .drsPic {
            width: 100px;
            height: 100px;
            border: 1px solid #E1E1E2;
            margin: 20px 22px 0 22px;
        }
        .drsTitleContainer {
            .drsTitle {
                font-size: 25px;
                color: black;
                font-weight: bold;
                margin-bottom: 20px;
            }
            .drsDesc {
                font-size: 12px;
                color: #666666;
                .icon-yinle {
                    font-size: 10px;
                    margin-right: 10px;
                }
            }
        }
        .drsbac {
            position: relative;
            width: 450px;
            height: 150px;
            background-image: url('/static/tea.PNG');
            background-size: 100% 150px;
            &::after{
                content:'';
                position:absolute;
                width:100%;
                height:100%;
                top:0;
                left:0;
                box-shadow:0 0 30px 10px rgba(255,255,255,.7) inset;
            }
        }
    }
    .drsMain {
        margin: 10px 22px;
        .item {
            font-size: 13px;
            margin-right: 15px;
            width: 120px;
            border: 1px solid #E1E1E2;
            padding: 5px 10px;
            border-radius: 4px;
            color:#555555;
            &:hover {
                color:#333333;
            }
            cursor: pointer;
            i {
                margin-right: 5px;
            }
            &:nth-of-type(1) {
                background: rgb(222,35,35);
                color: white;
                padding-right: 5px;
                .add {
                    font-size: 20px;
                    margin-left: 20px;
                }
                &:hover {
                    background: #B12323;
                }
            }
        }
        .bCollection {
          border: 1px solid #E1E1E2;
          border-radius: 3px;
          padding: 0 5px;
          font-size: 13px;
          .icon-shoucanggedan {
            font-size: 15px;
            margin-right: 5px;
          }
        }
    }
}
</style>