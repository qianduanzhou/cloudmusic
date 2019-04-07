<template>
  <div class="songDetail">
      <section class="songContainer allCenter">
          <div class="bg"></div>
          <div class="song alignCenter">
              <div class="playDetail">
                  <header class="zheng" :class="{'playActive':playing}">
                  </header>
                  <div class="main">
                      <div class="singPic" :style="{backgroundImage:`url(${currentSong.picUrl})`}" :class="playClass">
                      </div>
                  </div>
                  <footer class="songControl allCenter">
                      <div class="item allCenter"><i class="iconfont icon-xinaixin1"></i><p>喜欢</p></div>
                      <div class="item allCenter"><i class="iconfont icon-shoucanggedan"></i><p>收藏</p></div>
                      <div class="item allCenter"><i class="iconfont icon-xiazai"></i><p>下载</p></div>
                      <div class="item allCenter"><i class="iconfont icon-fenxiang"></i><p>分享</p></div>
                  </footer>
              </div>
              <div class="word">
                  <header class="titleContainer">
                      <div class="alignCenter">
                          <p class="title">{{currentSong.name}}</p>
                          <p class="mv">MV</p>
                          <p class="mv">极高音质</p>
                      </div> 
                      <div class="itemContainer alignCenter">
                          <div class="item alignCenter"><p class="titles">专辑</p><b class="titleDetail">{{currentSong.album}}</b></div>
                          <div class="item alignCenter"><p class="titles">歌手</p><b class="titleDetail">{{currentSong.singer}}</b></div>
                          <div class="item alignCenter"><p class="titles">来源</p><b class="titleDetail">{{currentSong.singer}}</b></div>                      
                      </div>
                  </header>
                  <section class="wordoutside" ref="outsideContainer">
                      <ul class="wordContainer" ref="wordContainer">
                        <li v-for="(item,index) in lyc" :key="index" class="wordItem" :class="{'active':cur == index}" v-html="item"> 
                        </li>
                      </ul>
                  </section>
              </div>
              <div class="otherControl">
                <i class="iconfont icon-xiangshangyuanjiantoushangjiantouxiangshangmianxing prev"></i>
                <i class="iconfont icon-xiangxiayuanjiantouxiajiantouxiangxiamianxing next"></i>
                <i class="iconfont icon-wenhao "></i>
                <i class="iconfont icon-suoxiao"></i>
              </div>
          </div>
      </section>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {bfLyc} from '../common/utils'
import axios from 'axios'

export default {
    data() {
        return {
            deg: 0,
            cur: 0,
            lyc:"",
            currentTime:0
        }
    },
    filters: {
        nothing(value) {
            return ''
        }
    },
    computed: {
        ...mapGetters([
            'currentSong',
            'playing',
            'audio'
        ]),
        playClass() {
            return this.playing ? 'play' : 'pause'
        }
    },
    mounted() {
        this.toWord()
        this.initLyric()
    },
    updated(){
        this.initLyric()
        this.toWordPosition()
    },
    methods: {
        initLyric() {
            axios.get('http://localhost:3000/lyric',{
                params:{
                    id:this.currentSong.mid
                }
            }).then((result) => {
                let res = result.data
                if(res.code === 200) {
                    this.lyc = bfLyc(res.lrc.lyric)
                }
            })
        },
        // 调到指定歌词
        toWord() {
            var _this = this
            this.audio.addEventListener("timeupdate",function(e){
                let currentTime = e.target.currentTime
                for(let key in _this.lyc) {
                    if(key == Math.floor(currentTime)) {
                        if(_this.lyc[key] == "&#8197;") {
                            continue;
                        }
                        _this.cur = key
                    }
                }
            });
        },
        // 调到指定歌词的位置
        toWordPosition() {
            this.$nextTick(() => {
                let lis = this.$refs.wordContainer.children
                setTimeout(() => {
                    for(let i = 0; i < lis.length; i ++) {
                        if(lis[i].classList[1] == "active") {
                            var height = this.$refs.outsideContainer.offsetHeight
                            this.$refs.outsideContainer.scrollTop = `${lis[i].offsetTop-height/2}`
                        }
                    }
                }, 50);
            })
        }
    }
}
</script>

<style lang='scss' scoped>
.songDetail {
    position: fixed;
    top: 50px;
    width: 100%;
    height: 100%;
    left: 0;
    z-index: 99;
    background: white;
    .songContainer {
        position: relative;
        box-sizing: border-box;
        position: relative;
        width: 100%;
        height: 460px;
        margin: 0 auto;
        .bg {
            position: absolute;
            z-index: -1;
            width: 100%;
            height: 100%;
            background: radial-gradient(rgba(33,33,33,0.7),rgba(33,33,33,0)) no-repeat center / cover;
            filter: blur(50px);
        }
        .song {
            width: 880px;
            height: 100%;
            .playDetail {
                width: 320px;
                height: 100%;
                position: relative;
                .playActive {
                    transform: rotate(40deg);
                    transform-origin: 35px -14px; 
                    transition: transform 0.2s ease-in;
                    z-index: 100;
                }
                .zheng {
                    transition: transform 0.1s ease-in;
                    background: url('/static/zheng.jpg');
                    height: 60px;
                    width: 160px;
                    position: absolute;
                    left: 45%;
                }
                .main {
                    box-sizing: border-box;
                    position: relative;
                    width: 325px;
                    height: 325px;
                    border-radius: 50%;
                    background: url('/static/center.jpg');
                    background-position: center;
                    border: 8px solid #8C8C8D;
                    margin-top: 60px;
                    .singPic {
                        width: 210px;
                        height: 210px;
                        border-radius: 50%;
                        background: red;
                        position: absolute;
                        top: 50px;
                        left: 50px;
                        background-position: center center;
                        background-repeat: no-repeat;
                        background-size: cover;
                    }
                    .play {
                        animation: rotate 30s linear infinite;
                    }
                    .pause {
                        animation-play-state: paused
                    }
                }
                .songControl {
                    margin-top: 45px;
                    justify-content: space-between;
                    .item {
                        width: 18%;
                        border: 1px solid #BEBFC2;
                        padding: 5px;
                        border-radius: 3px;
                        font-size: 10px;
                        .iconfont {
                            font-size: 12px;
                        }
                        .icon-fenxiang ,.icon-xiazai{
                            font-size: 14px;
                        }
                        p {
                            font-size: 12px;
                            padding-left: 5px;
                            color: #333;
                        }
                    }
                }
            }
            .word {
                width: 400px;
                height: 100%;
                margin-left: 120px;
                .titleContainer {
                    width: 100%;
                    height: 60px;
                    margin-top: 40px;
                    .title {
                        font-size: 26px;
                        font-weight: bold;
                    }
                    .mv {
                        height: 15px;
                        border: 1px solid #B82525;
                        font-size: 11px;
                        line-height: 15px;
                        text-align: center;
                        color: #B82525;
                        padding: 0 3px;
                        margin: 0 5px;
                        border-radius: 2px;
                    }
                    .itemContainer {
                        font-size: 12px;
                        margin-top: 15px;
                        .item {
                            margin-right: 5px;
                            p {
                                color: #424343;
                                margin-right: 5px;
                            }
                            b {
                                color:#0849AB;
                            }
                            &:last-child {
                                margin-left: 150px;
                            }
                        }
                    }
                    
                }
                .wordoutside {
                    margin-top: 30px;
                    position: relative;
                    overflow-y: auto;
                    &::-webkit-scrollbar {
                        width: 10px;
                    }
                    &::-webkit-scrollbar-thumb {
                        -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
                        background: #BCBDC1;
                    }
                    &::-webkit-scrollbar-track {
                        border-right:1px solid rgba(100,100,100,.2);
                        border-radius: 10px;
                        background: rgba(188,188,188,.1);
                    }
                    .wordContainer {
                        height: 320px;
                        .wordItem {
                            color:#262627;
                            margin-bottom: 15px;
                            font-size: 14px;
                        }
                        .active {
                            color:rgba(255,255,255,0.8);
                        }
                    }
                }
            }
            .otherControl {
                width: 50px;
                height: 100%;
                position: relative;
                i {
                    color:rgb(170,170,170);
                    font-size: 22px;
                    position: absolute;
                    left: 5px;
                    cursor: pointer;
                    &:hover {
                        color:#9D9DA4;
                    }
                }
                .prev {      
                    top: 130px;
                }
                .next {
                    top: 160px;        
                }
                .icon-wenhao {
                    bottom: 10px;
                } 
                .icon-suoxiao {
                    left:50px;
                    top: 50px;
                    font-size: 35px;
                } 
            }
        } 
    }
    @keyframes rotate {
        0% {
            transform: rotate(0);
        } 
        100%{
            transform: rotate(360deg);
        }    
    }
     
}
</style>