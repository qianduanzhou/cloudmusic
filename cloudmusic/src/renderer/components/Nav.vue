<template>
  <div class="nav scrollStyle" ref="nav" style="height:510px;">
      <ul class="navContainer">
          <li class="navContent">
              <p>推荐</p> 
          </li>
          <li class="navContent">
              <router-link to="/find"><i class="iconfont icon-yinle"></i>发现音乐</router-link>
          </li>
          <li class="navContent" v-show="userName">
              <router-link to="/fm"><i class="iconfont icon-iconku-zhuanqu-"></i>私人FM</router-link>
          </li>
          <!-- <li>
              <router-link to="/video"><i class="iconfont icon-shipin1"></i>视频</router-link>
          </li> -->
          <!-- <li class="navContent">
              <router-link to="/friend"><i class="iconfont icon-pengyou"></i>朋友</router-link>
          </li> -->
          <li class="navContent">
              <p>我的音乐</p> 
          </li>
          <!-- <li>
              <router-link to="/localmusic"><i class="iconfont icon-bendiyinle"></i>本地音乐</router-link>
          </li> -->
          <!-- <li>
              <router-link to="/download"><i class="iconfont icon-xiazai"></i>下载管理</router-link>
          </li> -->
          <!-- <li v-show="userName">
              <router-link to="/cloud"><i class="iconfont icon-yun"></i>我的音乐云盘</router-link>
          </li> -->
          <li v-show="userName" class="navContent">
              <router-link to="/mycreate"><i class="iconfont icon-wodeshoucang"></i>我的收藏</router-link>
          </li>
          <li v-show="userName" class="navContent">
              <a href="javascript:;" @click="showCreate = !showCreate">创建的歌单<span><i class="iconfont icon-plus-"></i><i class="iconfont icon-you" v-if="!showCreate"></i><i class="iconfont icon-down"  v-if="showCreate"></i></span></a>
              <div class="CSContainer" v-if="showCreate && uid">
                  <router-link :to="`/create/${loveId}?me=true`" class="myItem alignCenter">
                      <i class="iconfont icon-xinaixin1"></i>
                      <p class="myTitle">我喜欢的音乐</p>
                  </router-link>
                  <router-link v-for="item in createList" :key="item.id" :to="`/create/${item.id}?me=true`" class="myItem alignCenter">
                      <i class="iconfont icon-gedan"></i>
                      <p class="myTitle">{{item.name}}</p>
                  </router-link>
              </div>
          </li>
          <li v-show="userName" class="navContent">
              <a href="javascript:;"  @click="showCollect = !showCollect">收藏的歌单<i class="iconfont icon-you"  v-if="!showCollect"></i><i class="iconfont icon-down"  v-if="showCollect"></i></a>
                <div class="CSContainer" v-if="showCollect">
                    <router-link v-for="item in collectList" :key="item.id" :to="`/create/${item.id}`" class="myItem alignCenter">
                        <i class="iconfont icon-gedan"></i>
                        <p class="myTitle">{{item.name}}</p>
                    </router-link>
              </div>
          </li>
      </ul>
      <div class="playWindow alignCenter" ref="playWindow" v-if="currentSong.duration">
          <div class="pic" :style="{'backgroundImage': `url(${currentSong.picUrl})`}">
              <i class="iconfont icon-fangda" @click="toSongDetail"></i>
          </div>
          <div class="detail">
              <p class="name">{{currentSong.name}}</p>
              <p class="singer">{{currentSong.singer}}</p>
          </div>
          <i class="love iconfont icon-xinaixin1"  v-if="!isCollect(currentSong.mid)" @click="collect(currentSong.mid)" :plain="true"></i>
          <i class="love iconfont icon-xinaixin" style="color:red; right:0;" :plain="true" @click="canCollect(currentSong.mid)" v-if="isCollect(currentSong.mid)"></i>
          <i class="iconfont icon-fenxiang share"></i>
      </div>
  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import {Axios,getUserSongList,likeMusic} from '../common/api'

export default {
    computed: {
        ...mapGetters([
            'userName',
            'userId',
            'currentSong',
            'collectSong'
        ])
    },
    data() {
        return {
            showCreate: false,
            showCollect: false,
            loveId:'',
            createList:[],
            collectList:[]
        }
    },
    watch: {
        userId() {
            this.uid = this.userId
            this.initCreate()
        }
    },
    updated() {
        if(this.$refs.playWindow) {
                this.$refs.nav.style.height = `${document.documentElement.clientHeight - this.$refs.playWindow.offsetHeight -100}px`
        }else {
           this.$refs.nav.style.height = `${document.documentElement.clientHeight - 100}px`
        }
    },
    methods: {
        isCollect(id) {
            return this.collectSong.includes(id)
        },
        toSongDetail() {
            this.$router.push({
                name:'songDetail',
                params:this.currentSong.mid
            })
        },
        initCreate() {
            Axios(getUserSongList,{
                uid:this.uid
            }).then((res) => {
                let list = res.playlist
                list.forEach((item) => {
                    if(item.userId === this.uid) {
                        this.createList.push(item)
                    }else {
                        this.collectList.push(item)
                    }
                })
                this.loveId = this.createList[0].id
                this.createList = this.createList.slice(1,this.createList.length)
            })
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
                    message:'喜欢该音乐成功',
                    center: true
                });
            })        
        },
        canCollect(id) {
            let params = {
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
                    message:'取消喜欢音乐成功',
                    center: true
                });
            })       
        },
        ...mapMutations({
            set_collectSong:'SET_COLLECTSONG'
        })
    }
}
</script>

<style lang='scss'>
@import '../assets/css/base.scss';
.nav {
    position: fixed;
    z-index: 1;
    box-sizing: border-box;
    width: 200px;
    height: 600px;
    overflow-y: scroll;
    .navContainer {
         .navContent {
            font-size: 13px;
            p {
                padding: 10px 0 10px 20px;
                color:#7D7D7D;
            }
            .icon-shipin1 {
                font-size: 11px;
            }
            a {
                display: block;
                position: relative;
                padding: 10px 0 10px 20px;
                text-decoration: none;
                color: rgba(0,0,0,0.7);
                &:hover{
                    color: rgb(0,0,0);
                    transition: color .2s ease-in;
                }
                i {
                    margin-right: 15px;
                }
                &.router-link-active {
                    background: #E6E7EA;
                }
                &.router-link-active:before {
                    content:'';
                    width: 3px;
                    height: 100%;
                    background: #C62F2F;
                    position: absolute;
                    left: 0;
                    top: 0;
                }
            }
            &:nth-last-of-type(2) a,&:nth-last-child(1) a{
                display: flex;
                justify-content: space-between;
                color:#7D7D7D;
                span {
                    .iconfont {
                        font-size: 13px;
                    }
                    .icon-plus-{
                        position: absolute;
                        right: 15px;
                    }
                }
                &:hover{
                    color: rgb(0,0,0);
                    transition: color .2s ease-in;
                }
            }
            &:nth-last-child(1) a{
                .iconfont {
                        font-size: 13px;
                    }
            }
            .CSContainer {
                .myItem {
                    margin: 0;
                    padding: 0;
                    justify-content: flex-start;
                    .iconfont {
                        font-size: 13px;
                        margin-left: 20px;
                    }
                    .myTitle {
                        padding-left: 0;
                        color: rgba(0,0,0,0.7);
                        width: 140px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                    &:hover{
                        color: rgb(0,0,0);
                        transition: color .2s ease-in;
                    }
                }
            }
        }
    }
    .playWindow {
        position: fixed;
        bottom: 50px;
        width: 200px;
        height: 60px;
        z-index: 999;
        border-top: 1px solid $borderColor;
        .pic {
            cursor: pointer;
            position: relative;
            width: 45px;
            height: 45px;
            box-sizing: border-box;
            padding: 5px;
            background-position: center;
            background-size: 45px 45px;
            &:hover {
                background-color: rgba(0,0,0,0.3);
            }
            margin: 10px;
            i {
                opacity: 0;
                font-size: 40px;
                left: 2px;
                top: 4px;
                color: rgba(255,255,255,0.5);
                background-color: rgba(0,0,0,0.3);
                transition: opacity .1s ease-in;
                &:hover {
                    opacity: 1;
                    transition: opacity .1s ease-in;
                }
            }
        }
        .detail {
            width: 50%;
            .name {
                cursor: pointer;
                font-size: 12px;
                padding-bottom: 7px;
                width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .singer {
                cursor: pointer;
                font-size: 12px;
                color: #7D7D7D;
                &:hover{
                   color: #333; 
                }
            }
        }
        i {
            cursor: pointer;
            position: absolute;
            right: 5px;
            font-size: 13px;
        }
        .love {
            font-size: 12px;
            top: 14px;
        }
        .share {
            bottom: 14px;
        }
    }
}
</style>