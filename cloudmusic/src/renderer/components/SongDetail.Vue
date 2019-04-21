<template>
  <transition name="big" mode="out-in">
  <div class="songDetail scrollStyle" ref="container" :key="111">
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
                      <div class="item allCenter" @click="collect(currentSong.mid)">
                          <i class=" iconfont icon-xinaixin1"  v-if="!isCollect(currentSong.mid)" :plain="true"></i>
                          <i class=" iconfont icon-xinaixin" style="color:red;" :plain="true" @click="canCollect(currentSong.mid)" v-if="isCollect(currentSong.mid)"></i>
                          <p>喜欢</p>
                      </div>
                      <div class="item allCenter"><i class="iconfont icon-shoucanggedan"></i><p>收藏</p></div>
                      <div class="item allCenter"><i class="iconfont icon-xiazai"></i><p>下载</p></div>
                      <div class="item allCenter"><i class="iconfont icon-fenxiang"></i><p>分享</p></div>
                  </footer>
              </div>
              <div class="word">
                  <header class="titleContainer">
                      <div class="alignCenter">
                          <p class="title wordNowrap">{{currentSong.name}}</p>
                          <p class="mv">MV</p>
                          <p class="mv">极高音质</p>
                      </div> 
                      <div class="itemContainer alignCenter">
                          <div class="item alignCenter"><p class="titles">专辑:</p><b class="titleDetail">{{currentSong.album}}</b></div>
                          <div class="item alignCenter"><p class="titles">歌手:</p><b class="titleDetail">{{currentSong.singer}}</b></div>
                          <div class="item alignCenter"><p class="titles">来源:</p><b class="titleDetail">{{currentSong.singer}}</b></div>                      
                      </div>
                  </header>
                  <section class="wordoutside scrollStyle" ref="outsideContainer" @mouseenter="mousein = true" @mouseleave="mousein = false">
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
                <i class="iconfont icon-suoxiao" @click="$router.go(-1)"></i>
              </div>
          </div>
      </section>
      <section class="otherThing spCenter">
          <section class="comment">
              <header class="comHeader alignCenter">
                  <p class="title">听友评论</p>
                  <p class="data">(已有{{total}}条评论)</p>
              </header>
              <div class="sendContainer">
                  <input type="text" placeholder="发表评论" class="sendCom">
              </div>
              <div class="comContainer">
                  <p class="comtitle">
                      精彩评论
                  </p>
                  <comment :list="hotComment" type="0" v-if="hotComment.length > 0"></comment>
                  <p class="comtitle" style="margin-top:40px" ref = 'comment'>
                      最新评论({{total}})
                  </p>
                  <comment :list="commentList" type="0" v-if="hotComment.length > 0" :key="commentList[0].user.userId"></comment>
              </div>
              <el-pagination
                style="margin-top:20px;"
                 background
                 :page-size = "20"
                 layout="prev, pager, next"
                 @current-change = "changePage"
                 :total="total">
              </el-pagination>
          </section>
          <div class="same">
              <header class="comHeader alignCenter">
                  <p class="title">包含这首歌的歌单</p>
              </header>
              <same :list="songList" v-slot="items" :songlist="true">播放：{{items.item.playCount | wan}}万</same>
              <header class="comHeader alignCenter"  style="margin-top:50px;">
                  <p class="title">相似歌曲</p>
              </header>
              <same :list="sameSong"  :song="true" v-slot="items">{{items.item.album.artists[0].name}}</same>
              <header class="comHeader alignCenter"  style="margin-top:50px;">
                  <p class="title">喜欢这首歌的人</p>
              </header>
              <ul class="sameperson">
                  <li class="personItem alignCenter" v-for="item in samePerson" :key="item.id">
                      <div class="personPic bgc" :style="{'backgroundImage':`url(${item.avatarUrl})`}"></div>
                      <p class="personName">{{item.nickname}}
                          <i class="iconfont icon-nan" v-if="item.gender == 1"></i>
                          <i class="iconfont icon-nv" v-if="item.gender == 2"></i>
                      </p>
                      <p class="ago">{{item.recommendReason}}</p>
                  </li>
              </ul>
          </div>
      </section>
      <div style="height:120px"></div>
  </div>
  </transition>
</template>

<script>
import { mapGetters,mapMutations} from 'vuex'
import {bfLyc} from '../common/utils'
import {run} from '../common/d3'
import Comment from '../base/comment'
import Same from '../base/Same'
import {Axios,getLyric,getSongComment,getSameSongList,getSameSong,getSamePeople,
likeMusic} from '../common/api'

export default {
    data() {
        return {
            deg: 0,
            cur: 0,
            currentTime:0,
            timer:'',
            mousein:false,
            lyc:"",
            total:0,
            limit: 20,
            hotComment:[],
            commentList: [],
            songList: [],
            sameSong: [],
            samePerson: []
        }
    },
    components: {
        Comment,
        Same
    },
    computed: {
        ...mapGetters([
            'currentSong',
            'playing',
            'audio',
            'collectSong'
        ]),
        playClass() {
            return this.playing ? 'play' : 'pause'
        }
    },
    watch: {
        currentSong(newVal) {
            this.id = this.currentSong.mid
            this.initLyric()
            this.initComment()
            this.initSameSongList()
            this.initSameSong()
            this.initSamePersonList()
        }
    },
    created() {
        this.id = parseInt(this.currentSong.mid)
        this.sameParams = {
            id:this.id
        }
        this.toWord()
        this.initLyric()
        this.initComment()
        this.initSameSongList()
        this.initSameSong()
        this.initSamePersonList()
    },
    updated(){
        this.toWordPosition()
    },
    methods: {
        initLyric() {
            Axios(getLyric,this.sameParams).then((res) => {
                this.lyc = bfLyc(res.lrc.lyric)
            })
        },
        initComment() {
            Axios(getSongComment,this.sameParams).then((res) => {
                this.hotComment = res.hotComments
                this.commentList = res.comments
                this.total = res.total
            })
        },
        initSameSongList() {
            Axios(getSameSongList,this.sameParams).then((res) => {
                this.songList = res.playlists
            })
        },

        initSameSong() {
            Axios(getSameSong,this.sameParams).then((res) => {
                this.sameSong = res.songs
            })
        },
        initSamePersonList() {
            Axios(getSamePeople,this.sameParams).then((res) => {
                this.samePerson = res.userprofiles
            })
        },
        isCollect(id) {
            return this.collectSong.includes(id)
        },
        collect(id) {
            let params = {
                like:true,
                id: id,
                timestamp: (new Date()).getTime()
            }
            Axios(likeMusic,params).then((res) => {
                let collectList = this.collectSong.slice(0)
                collectList.push(id)
                this.set_collectSong(collectList)
                this.$message({
                    type:'success',
                    message:'收藏成功',
                    center: true
                });
            })   
        },
        canCollect(id) {
            let params =  {
                    like:false,
                    id: id,
                    timestamp: (new Date()).getTime()
            }
            Axios(likeMusic,params).then((res) => {
                let collectList = this.collectSong.slice(0)
                let index = collectList.findIndex((item) => {
                    return item == id
                })
                collectList.splice(index,1)
                this.set_collectSong(collectList)
                this.$message({
                    type:'success',
                    message:'取消收藏成功',
                    center: true
                });
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
            if(this.mousein) {
                return 
            }
            this.$nextTick(() => {
                let lis = this.$refs.wordContainer.children
                setTimeout(() => {
                    for(let i = 0; i < lis.length; i ++) {
                        if(lis[i].classList[1] == "active") {
                            let prevOffsetTop = lis[i-1].offsetTop ? lis[i-1].offsetTop : '',
                            nowOffsetTop = lis[i].offsetTop ? lis[i].offsetTop : '',
                            diff = nowOffsetTop - prevOffsetTop,
                            t = 0,
                            d = 30,
                            height = this.$refs.outsideContainer.offsetHeight
                            run(this.$refs.outsideContainer,this.timer,t,prevOffsetTop,diff,d,height)
                        }
                    }
                }, 50);
            })
        },
        changePage(index) {
            let offset = (index-1) * this.limit
            let params = {
                id: this.id,
                offset: offset
            }
            Axios(getSongComment,params).then((res) => {
                this.commentList = res.comments
                this.$refs.container.scrollTop = this.$refs.comment.offsetTop - 10
            })
        },
        ...mapMutations({
            set_collectSong:'SET_COLLECTSONG'
        })
    }
}
</script>

<style lang='scss' scoped>
@import '../assets/css/base.scss';
.big-enter-active {
  animation: big-in .2s;
}
.big-leave-active {
  animation:big-in .2s reverse;
}
@keyframes big-in {
    0% {
    transform: scale(0);
    transform-origin: 0 100%;
  }
  25% {
    transform: scale(0.25);
    transform-origin: 0 100%;
  }
  50% {
    transform: scale(0.5);
    transform-origin: 0 100%;
  }
  75% {
    transform: scale(0.75);
    transform-origin: 0 100%;
  }
  100% {
    transform: scale(1);
    transform-origin: 0 100%;
  }
}
.songDetail {
    position: fixed;
    top: 50px;
    width: 100%;
    height: 100%;
    left: 0;
    z-index: 99;
    background: white;
    overflow: auto;
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
                        cursor: pointer;
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
                        width: 280px;
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
                        width: 100%;
                        font-size: 12px;
                        margin-top: 15px;
                        .item {
                            width: 120px;
                            margin-right: 20px;
                            p {
                                width: 40px;
                                color: #424343;
                                margin-right: 5px;
                            }
                            b {
                                color:#0849AB;
                                cursor: pointer;
                                width: 80px;
                                overflow: hidden;
                                text-overflow: ellipsis;
                                white-space: nowrap;
                            }
                            &:last-child {
                                margin-left: 20px;
                            }
                        }
                    }
                    
                }
                .wordoutside {
                    margin-top: 30px;
                    position: relative;
                    overflow-y: auto;
                    .wordContainer {
                        height: 320px;
                        .wordItem {
                            padding: 8px 0;
                            color:#3E3F3F;
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
    .otherThing {
        width: 880px;
        margin: 0 auto;
        margin-top: 60px;;
        .comment {
            width: 550px;
            margin-right: 70px;
            .comHeader {
                width: 100%;
                border-bottom: 1px solid $borderColor;
                padding-bottom: 10px;
                .title {
                    font-size:  19px;

                }
                .data {
                    font-size: 12px;
                    margin-left: 10px;
                    color: #888888;
                }
            }
            .sendContainer {
                width: 530px;
                height: 50px;
                box-sizing: border-box;
                border:1px solid $borderColor;
                margin: 30px auto;
                background: #F0F0F2;
                padding: 10px;
                .sendCom {
                    position: relative;
                    top: -2px;
                    width: 100%;
                    height: 30px;
                    background: #FFFFFF;
                    border: 1px solid $borderColor;
                    &::placeholder {
                        font-size: 14px;
                        padding-left: 20px;
                    }
                }
            }
            .comContainer {
                .comtitle {
                    font-size: 12px;
                    margin-bottom: 10px;
                }
                
            }
        }
        .same {
            width: 240px;
            .comHeader {
                width: 100%;
                border-bottom: 1px solid $borderColor;
                padding-bottom: 10px;
                .title {
                    font-size:  19px;
                }
            }
            .sameperson {
                padding: 5px 0;
                .personItem{
                    height:45px;
                    width: 100%;
                    font-size: 13px;
                    .personPic {
                        width: 30px;
                        height: 30px;
                        border-radius: 50%;
                    }
                    .personName {
                        margin-left: 8px;
                        width: 120px;
                        color: rgba(11,11,11,0.8);
                    }
                    .ago {
                        color:#666666;
                    }
                    .icon-nan {
                        color:#71ABC8;
                        font-size: 16px;
                    } 
                    .icon-nv {
                        color:#E494D2;
                        font-size: 14px;
                    }
                }
            }
        }
    }
}
</style>