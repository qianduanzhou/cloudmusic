<template>
  <div class="dayRecSong scrollStyle" ref="dayRecSong">
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
          <album :Songs="drSongList" :show="true" :types="1" :width='100' :nameWidth="32" v-if="drSongList.length > 0">
          </album>
      </main>
  </div>
</template>

<script>
import Album from '../base/Album'
import {createSong} from '../common/song'
import {mapActions} from 'vuex'
import {initPage} from '../common/utils'
import {Axios,getDRSong,getSongUrl} from '../common/api'
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
                let outside = document.documentElement,
                innerside = this.$refs.dayRecSong
                initPage(outside,innerside)
            }, 500); 
        },
        initDRSong() {
            Axios(getDRSong).then((res) => {
                this.drSongList = this._normalizeSongList(res.recommend)
            })
        },
        _normalizeSongList(list) {
            let ret = []
            for(let i = 0; i < list.length; i ++) {
                ret.push(createSong(list[i]))
            }
            return ret
        },
        playAll() {
            /*标记*/
            let url = ''
            let index = Math.ceil(Math.random() * (this.drSongList.length-1))
            let params = {
                id: this.drSongList[index].mid
            }
            Axios(getSongUrl,params).then((res) => {
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
@import '../assets/css/base.scss';
.dayRecSong {
    position: fixed;
    top: 50px;
    left: 200px;
    width: 880px;
    height: 590px;
    background: #FAFAFA;
    overflow-y: scroll;

    .drsHeader {
        width: 100%;
        height: 150px;
        border-bottom: 1px solid $borderColor;
        .drsPic {
            width: 100px;
            height: 100px;
            border: 1px solid $borderColor;
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
            border: 1px solid $borderColor;
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
          border: 1px solid $borderColor;
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