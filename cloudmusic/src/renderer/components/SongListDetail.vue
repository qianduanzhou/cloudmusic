<template>
  <div class="SongListDetail">
      <header class="SongListDetailHeader">
          <div class="listPic bgc" :style="{backgroundImage:`url(${detail.coverImgUrl})`}"></div>
          <div class="listDetailContainer">
              <div class="titleContainer alignCenter">
                  <span class="SongListsign">歌单</span>
                  <p class="mainTitle">{{detail.name}}</p>
                  <div class="numData">
                      <p class="title">歌曲数</p>
                      <p class="num">{{detail.trackCount}}</p>
                  </div>
                  <div class="numData">
                      <p class="title">贝复舒</p>
                      <p class="num">{{detail.playCount | wan}}</p>
                  </div>
              </div>
              <div class="avatar alignCenter">
                  <div class="avaPic bgc" :style="{'backgroundImage':`url(${detail.creator.avatarUrl})`}"></div>
                  <p class="avaName">{{detail.creator.nickname}}</p>
                  <p class="createTime">{{detail.createTime | middleTime}}创建</p>
              </div>
              <div class="controlContainer alignCenter">
                  <div class="item alignCenter">
                      <i class="iconfont icon-bofang"></i><p>播放全部</p><i class="add">+</i>
                  </div>
                  <div class="item alignCenter">
                      <i class="iconfont icon-shoucanggedan"></i><p>收藏({{detail.subscribedCount}})</p>
                  </div>
                  <div class="item alignCenter">
                       <i class="iconfont icon-fenxiang"></i><p>分享({{detail.shareCount}})</p>
                  </div>
                  <div class="item alignCenter">
                        <i class="iconfont icon-xiazai"></i><p>下载全部</p>
                  </div>
              </div>
              <div class="tagcontainer alignCenter">
                  <p class="title">标签</p>
                  <div class="tagcontents">
                    <span class="tagcontent" v-for="item in detail.tags" :key="item"><b class="tag">{{item}}</b>/</span>
                  </div>  
              </div>
              <div class="abstruct spCenter" :class="dropCls">
                    <ul class="abstructContent">
                      简介：<li class="abItem" v-for="(item,index) in description" :key="index" v-html="item">
                      </li>
                    </ul>
                  <i class="iconfont" :class="showCls" @click="wordHide = !wordHide"></i>
              </div>
          </div>
      </header>
      <main class="songListMain spCenter">
          <nav class="songListNav alignCenter">
              <div v-for="(item,index) in navList" :key = "item" @click="cur = index" class="Navitem" :class="{'NavActive':cur == index}">{{item}}</div>
          </nav>
          <div class="searchSong">
              <input type="text" class="searchBox" placeholder="搜索歌单音乐">
              <i class="iconfont icon-sousuo"></i>
          </div>
      </main>
      <div class="table alignCenter">
          <div class="tableItem tControl">操作</div>
          <div class="tableItem tMusicTitle">音乐标题</div>
          <div class="tableItem tSinger">歌手</div>
          <div class="tableItem tAlbum">专辑</div>
          <div class="tableItem tDuration">时长</div>
      </div>
      <album :Songs="songList" :show="cur == 0" :types="1" :width='100' :nameWidth="28" v-if="songList.length > 0">

      </album>
      <div style="margin-bottom: 200px;"></div>
  </div>
</template>

<script>
import axios from 'axios'
import {createSong} from '../common/song'
import Album from '../components/Album'

export default {
    data() {
        return {
            description : [],
            songList : [],
            detail: {},
            wordHide: true,
            cur:0,
            navList: [
                '歌曲列表',
                '评论',
                '收藏者'
            ]
       }
    },
    components: {
        Album
    },
    created() {
        this.initSongListDetail()
    },
    computed: {
        showCls() {
            return this.wordHide?'icon-down':'icon-shang'
        },
        dropCls() {
            return this.wordHide?'up':'drop'
        }
    },
    methods: {
        async initSongListDetail() {
            let id = this.$route.params.id
            await axios.get('http://localhost:3000/playlist/detail',{
                params:{
                    id: id
                }
            }).then((result) => {
                let res = result.data
                if(res.code === 200) {
                    this.detail = res.playlist
                    let des = res.playlist.description
                    des = des.split('\n')
                    des.forEach((item,index) => {
                        if(item == '') {
                            des[index] = '&#8197;'
                        }
                    })
                    this.description = des
                    this._normalizeSongList(this.detail.tracks).then((ret) => {
                        this.songList = ret
                    })
                    
                }
            })
        },
        async _normalizeSongList(list) {
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
.SongListDetail {
    position: fixed;
    z-index: 99;
    left: 200px;
    background: #FAFAFA;
    width: 100%;
    height: 100%;
    top: 50px;
    overflow: auto;
    .SongListDetailHeader {
        display: flex;
        margin: 30px;
        .listPic {
            width:200px;
            height: 200px;
            border: 1px solid #ccc;
        }
        .listDetailContainer {
            margin-left: 30px;
            box-sizing: border-box;
            .titleContainer {
                .SongListsign {
                    border:1px solid #E03F40;
                    color:#E03F40;
                    font-size: 13px;
                    padding: 3px 5px;
                }
                .mainTitle {
                    width: 400px;
                    font-size: 25px;
                    margin-left: 5px;
                    font-weight: 600;
                    color:black;
                }
                .numData {
                    font-size: 12px;
                    color: #555555;
                    padding: 0 10px;
                    border-left: 1px solid #E1E1E2;
                    position: absolute;
                    right: 230px;
                    &:nth-of-type(1){
                        border-left:none;
                        right: 290px;
                    }
                    .num {
                        float: right;
                        margin-top: 5px;
                    }
                }
            }
            .avatar {
                margin-top: 15px;
                .avaPic {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    border: 1px solid #ccc;
                }
                .avaName {
                    margin-left: 10px;
                    font-size: 15px;
                    color:#444444;
                }
                .createTime {
                    font-size: 12px;
                    margin-left: 20px;
                    color:#444444;
                }
            }
            .controlContainer {
                margin-top: 20px;
                .item {
                    font-size: 13px;
                    margin-right: 15px;
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
            }
            .tagcontainer {
                font-size: 12px;
                margin-top: 25px;
                .title {
                    color:#555555;
                }
                .tagcontents {
                    margin-left: 10px;
                    .tagcontent {
                        .tag {
                            color:#0A63A8;
                        } 
                    }
                }
            }
            
            .abstruct {
                width: 500px;
                height: 32px;
                margin-top: 10px;
                font-size: 12px;
                color:#333333;
                overflow: hidden;
                .abstructContent {
                    width: 460px;
                    .icon-down {
                        margin-left: 100px;
                    }
                    .abItem{
                        line-height: 17px;
                        &:first-child{
                            display: inline-block;
                        }
                    }
                }
                
            }
            .drop {
                animation: drop .5s linear forwards;
            }
            .up {
                animation: up .5s linear reverse forwards;
            }
            @keyframes drop {
                0% {
                    height: 32px;
                }
                25% {
                    height: 25%;
                }
                50% {
                    height: 50%;
                }
                75% {
                    height: 75%;
                }
                100% {
                    height: 100%;
                }
            }
            @keyframes up {
                0% {
                    height: 32px;
                }
                25% {
                    height: 25%;
                }
                50% {
                    height: 50%;
                }
                75% {
                    height: 75%;
                }
                100% {
                    height: 100%;
                }
            }
        }
    }
    .songListMain {
        margin-top: 50px;
        .songListNav {
            margin-left: 30px;
            .Navitem {
                position: relative;
                padding: 10px 20px;
                font-size: 14px;
                color:#444444;
                cursor: pointer;
                &:hover{
                    color: #111111;
                }
            }
            .NavActive {
                color:#C62F2F;
                &:hover {
                    color:#C62F2F;
                }
                /* position: relative; */
                &::before{
                    content: '';
                    width: 57%;
                    height: 3px;
                    background:#C62F2F;
                    position: absolute;
                    bottom: 0
                }
            }

        }
        .searchSong {
            margin-right: 230px;
            .searchBox {
                width: 170px;
                height: 25px;
                border:1px solid #E1E1E2;
                padding-left: 15px;
                border-radius: 20px;
                box-sizing: border-box;
                font-size: 12px;
                outline: none;
                &::placeholder {
                    font-size: 12px;
                    color:#CCCCCC;
                }
            }
            .icon-sousuo {
                position: relative;
                left: -25px;
                top: 2px;
                color:#CCCCCC;
            }
        }
    }
    .table {
        width: 100%;
        border-top: 1px solid #E1E1E2;
        box-sizing: border-box;
        .tableItem {
            box-sizing: border-box;
            padding: 10px 0 10px 10px;
            font-size: 12px;
            color: #666666;
            border-left: 1px solid #E1E1E2;
        }
        .tControl {
            width: 90px;
        }
        .tMusicTitle {
            width: 29%;
        }
        .tSinger {
            width: 17%;
        }
        .tAlbum {
            width: 17%;
        }
    }
}
</style>