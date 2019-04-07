<template>
  <div class="nav">
      <ul class="navContainer">
          <li>
              <p>推荐</p> 
          </li>
          <li>
              <router-link to="/find"><i class="iconfont icon-yinle"></i>发现音乐</router-link>
          </li>
          <li>
              <router-link to="/fm"><i class="iconfont icon-iconku-zhuanqu-"></i>私人FM</router-link>
          </li>
          <li>
              <router-link to="/video"><i class="iconfont icon-shipin"></i>视频</router-link>
          </li>
          <li>
              <router-link to="/friend"><i class="iconfont icon-pengyou"></i>朋友</router-link>
          </li>
          <li>
              <p>舞蹈音乐</p> 
          </li>
          <li>
              <router-link to="/localmusic"><i class="iconfont icon-bendiyinle"></i>本地音乐</router-link>
          </li>
          <li>
              <router-link to="/download"><i class="iconfont icon-xiazai"></i>下载管理</router-link>
          </li>
          <li v-show="userName">
              <router-link to="/cloud"><i class="iconfont icon-yun"></i>我的音乐云盘</router-link>
          </li>
          <li v-show="userName">
              <router-link to="/collection"><i class="iconfont icon-wodeshoucang"></i>我的收藏</router-link>
          </li>
          <li>
              <router-link to="/createdSongList">创建的歌单<span><i class="iconfont icon-plus-"></i><i class="iconfont icon-you"></i></span></router-link>
          </li>
          <li v-show="userName">
              <router-link to="/collectionSongList">收藏的歌单<i class="iconfont icon-you"></i></router-link>
          </li>
      </ul>
      <div class="playWindow alignCenter" v-if="currentSong.duration">
          <div class="pic" :style="{'backgroundImage': `url(${currentSong.picUrl})`}">
              <i class="iconfont icon-fangda" @click="toSongDetail"></i>
          </div>
          <div class="detail">
              <p class="name">{{currentSong.name}}</p>
              <p class="singer">{{currentSong.singer}}</p>
          </div>
          <i class="iconfont icon-xinaixin1 love"></i>
          <i class="iconfont icon-fenxiang share"></i>
      </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'


export default {
    computed: {
        ...mapGetters([
            'userName',
            'currentSong'
        ])
    },
    methods: {
        toSongDetail() {
            this.$router.push({
                name:'songDetail',
                params:this.currentSong.mid
            })
        }
    }
}
</script>

<style lang='scss'>
.nav {
    position: fixed;
    z-index: 1;
    box-sizing: border-box;
    width: 200px;
    height: 100%;
    border-right: 1px solid #E1E1E2;
    .navContainer {
        li {
            font-size: 13px;
            p {
                padding: 10px 0 10px 20px;
                color:#7D7D7D;
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
        }
    }
    .playWindow {
        position: fixed;
        bottom: 50px;
        width: 200px;
        height: 60px;
        z-index: 55;
        border-top: 1px solid #E1E1E2;
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
            .name {
                cursor: pointer;
                font-size: 12px;
                padding-bottom: 7px;
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