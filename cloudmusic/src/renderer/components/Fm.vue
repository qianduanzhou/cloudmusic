<template>
  <div class="fm">
      <section class="fmContainer alignCenter">
          <div class="fmLeft"> 
              <img :src="currentSong.picUrl" class="fmPic bgc"/>
              <img :src="insertPic.picUrl" class="fmPic small bgc"/>
              <div class="fmItemContainer spCenter">
                  <i class="iconfont icon-xinaixin1" v-if="!isCollect()" @click="collect"></i>
                  <i class="iconfont icon-xinaixin" v-if="isCollect()" style="color:red;"  @click="canCollect"></i>
                  <i class="iconfont icon-lajixiang"></i>
                  <i class="iconfont icon-xiayishou1" @click="next"></i>
                  <i class="iconfont icon-shenglvehao"></i>
              </div>
          </div>
          <div class="fmRight">
              <div class="alignCenter">
                  <p class="fmTitle wordNowrap">{{currentSong.name}}</p>
                   <span>标准音质</span>
              </div>
              
              <p class="detail" @click="toAlbum">专辑：<b class="wordNowrap">{{currentSong.album}}</b></p>
              <p class="detail" @click="toSinger">歌手：<b class="wordNowrap">{{currentSong.singer}}</b></p>
              <section class="wordoutside scrollStyle" ref="outsideContainer" @mouseenter="mousein = true" @mouseleave="mousein = false">
                <ul class="wordContainer" ref="wordContainer">
                  <li v-for="(item,index) in lyc" :key="index" class="wordItem" :class="{'active':cur == index}" v-html="item"> 
                  </li>
                </ul>
              </section>
          </div>
      </section>
  </div>
</template>

<script>
import {Axios,getFm,getSongUrl,getLyric,likeMusic} from '../common/api'
import {run} from '../common/d3'
import {createSong} from '../common/song'
import {mapGetters,mapMutations,mapActions} from 'vuex'
import {bfLyc} from '../common/utils'
import {lyricMixin,toSAS,collectMusic,setLoading} from '../common/mixin'
export default {
    name: 'fm',
    mixins:[lyricMixin,toSAS,collectMusic],
    data() {
        return {
            cur: 0,
            currentTime:0,
            mousein:false,
            fmList:[],
            lyc:[],
            timer:''
        }
    },
    computed: {
        ...mapGetters([
            'playList',
            'currentSong',
            'collectSong',
            'currentIndex',
            'audio'
        ]),
        insertPic() {
            if(this.currentIndex > 0) {
                return this.playList[this.currentIndex-1]
            }
            return this.currentSong
        }
    },
    created() {
        this.toWord()
        this.initFm()
    },
    watch: {
        currentSong(newVal) {
            this.id = parseInt(newVal.mid)
            this.toWord()
            this.initLyric(newVal)
        }
    },
    updated(){
        this.toWordPosition()
    },
    methods: {
        initFm() {
            if(this.fmList.length == 0) {
                this.setCurrentIndex(-1)
            }
            Axios(getFm,{
                timestamp: (new Date()).getTime()
            }).then((res) => {
                this._normalizeSongList(res.data).then((ret) => {
                    this.fmList = this.fmList.concat(ret)
                    this.selectPlay({
                       list:this.fmList,
                       index:this.currentIndex+1
                    })
                    this.set_loading(false)
                })
            })
        },
        async _normalizeSongList(list){
            let ret = []
            for(let i = 0; i < list.length; i ++) {
                let song = createSong(list[i])
                await Axios(getSongUrl,{
                    id:song.mid
                }).then((res) => {
                    let url = res.data[0].url
                    song.url = url
                    ret.push(song)
                })
            }
            return ret
        },
        initLyric(song) {
            Axios(getLyric,{
                id:song.mid
            }).then((res) => {
                this.lyc = bfLyc(res.lrc.lyric)
            })
        },
        next() {
            if(this.currentIndex + 1 == this.playList.length) {
                this.initFm()
            }else {
                this.selectPlay({
                    list:this.playList,
                    index:this.currentIndex + 1
                })
            }
        },
        ...mapActions([
            'selectPlay',
        ]),
        ...mapMutations({
            setPlayList:'SET_PLAYLIST',
            setCurrentIndex:'SET_CURRENT_INDEX',
            set_collectSong:'SET_COLLECTSONG'
        })
    }
}
</script>

<style lang='scss'>
@import '../assets/css/base.scss';
    .fm {
        width: 770px;
        margin: 40px auto;
        .fmContainer {
            .fmLeft {
                position: relative;
                margin-left: 60px;
                margin-right: 40px;
                padding-top: 30px;
                .fmPic {
                    position: relative;
                    z-index: 2;
                    width: 300px;
                    height: 300px;
                }
                .small {
                    z-index: 1;
                    position: absolute;
                    top: 60px;
                    left: -35px;
                    width: 240px;
                    height: 240px;
                }
                .fmItemContainer {
                    margin-top: 30px;
                    .iconfont {
                        cursor: pointer;
                        border: 1px solid $borderColor;
                        border-radius: 50%;
                        padding: 10px;
                        font-size: 18px;
                        color:#666;
                        &:hover {
                            font-weight: bold;
                            color: #333;
                        }
                    }
                }
            }
            .fmRight {
                width: 320px;
                .fmTitle {
                    width: 70%;
                    font-size: 23px;
                    font-weight: 580;
                    display: inline-block;
                    margin-bottom: 18px;
                }
                span {
                    position: relative;
                    top: -5px;
                    left: 5px;
                    border: 1px solid #B82525;
                    font-size: 11px;
                    color:#B82525;
                    padding: 1px;
                }
                .detail {
                    cursor: pointer;
                    display: inline-block;
                    width: 140px;
                    font-size: 12px;
                    color:#646464;
                    b {
                        display: inline-block;
                        color:#0C4DAF;
                        position: relative;
                        top: 2px;
                        width: 90px;
                    }
                }
                .wordoutside {
                    margin-top: 30px;
                    position: relative;
                    overflow-y: auto;
                    .wordContainer {
                        height: 320px;
                        .wordItem {
                            padding: 8px;
                            color:#888888;
                            margin-bottom: 15px;
                            font-size: 13px;
                        }
                        .active {
                            color:#0C4DAF;
                            font-size:15px;
                        }
                    }
                }
            }
        }
    }
</style>