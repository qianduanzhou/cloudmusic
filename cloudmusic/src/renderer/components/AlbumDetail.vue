<template>

  <div class="SongListDetail scrollStyle" ref="SongListDetail">
      <header class="SongListDetailHeader">
          <div class="listPic bgc" :style="{backgroundImage:`url(${detail.picUrl})`}"></div>
          <div class="listDetailContainer">
              <div class="titleContainer alignCenter">
                  <span class="SongListsign">专辑</span>
                  <p class="mainTitle">{{detail.name}}</p>
              </div>
              <div class="controlContainer alignCenter">
                  <div class="item alignCenter">
                      <i class="iconfont icon-bofang" @click="playAll"></i><p @click="playAll">播放全部</p><i class="add">+</i>
                  </div>
                  <div class="item alignCenter" :plain="true" @click="collect" v-if="!isCollect">
                      <i class="iconfont icon-shoucanggedan"></i><p>收藏</p>
                  </div>
                  <div class="item alignCenter" :plain="true" v-if="isCollect" @click="canCollect">
                      <i class="iconfont icon-xiangxiayuanjiantouxiajiantouxiangxiamianxing"></i><p>已收藏</p>
                  </div>
                  <div class="item alignCenter">
                       <i class="iconfont icon-fenxiang"></i><p>分享({{detail.info.shareCount}})</p>
                  </div>
                  <div class="item alignCenter">
                        <i class="iconfont icon-xiazai"></i><p>下载全部</p>
                  </div>
              </div>
              <div class="alSingerDetail">
                  <p class="alSinger">歌手：{{detail.artist.name}}</p>
                  <p class="alTime">时间：{{detail.publishTime | middleTime}}</p>
              </div>
          </div>
      </header>
      <main class="songListMain spCenter">
          <nav class="songListNav alignCenter">
              <div v-for="(item,index) in navList" :key = "item" @click="cur = index" class="Navitem" :class="{'NavActive':cur == index}">{{item}}</div>
          </nav>
      </main>
      <div class="table alignCenter" v-if="cur == 0">
          <div class="tableItem tControl">操作</div>
          <div class="tableItem tMusicTitle">音乐标题</div>
          <div class="tableItem tSinger">歌手</div>
          <div class="tableItem tAlbum">专辑</div>
          <div class="tableItem tDuration">时长</div>
      </div>
      
      <album :Songs="songListc" :show="cur == 0" :types="1" :width='100' :nameWidth="32" v-if="songList.length > 0" :key="songListc.length">

      </album>

      <div class="sldCommentContainer" v-if="cur == 1">
          <input class="sldComment" type="text" v-model="commentContent" placeholder="140"/>
          <div class="slcConmentIcon">
              <i class="iconfont icon-xiaolian"></i>
              <i class="iconfont">@</i>
              <i class="iconfont">#</i>
          </div>
          <button class="sendComment" @click="sendComment" :plain="true">评论</button>
      </div>
      
      <div class="comContainer" v-if="cur == 1">
          <p class="comtitle" ref = 'comment'>
              最新评论
          </p>
          <comment :list="commentList" :songListId="parseInt(this.$route.params.id)" @deleteComment="deleteCom" :key="commentList[0].user.userId"></comment>
          <el-pagination
            style="margin:20px 0 50px 50%;transform:translateX(-50%)"
            background
            :page-size = "20"
            layout="prev, pager, next"
            @current-change = "changePage"
            :total="total">
        </el-pagination>
      </div>

      <div class="albumDetail" v-if="cur == 2">
          <p>专辑介绍</p>
          <ul class="detailContainer">
              <li class="detailContent" v-for="(item,index) in description" :key="index">
                  {{item}}
              </li>
          </ul>
      </div>
  </div>
</template>

<script>
import {createSong} from '../common/song'
import {initPage} from '../common/utils'
import {mapGetters,mapActions,mapMutations} from 'vuex'
import {Axios,getAlbumDetail,getAlbumComment,getSongUrl,sendComment} from '../common/api'
import Album from '../base/Album'
import Comment from '../base/comment'
import ImaList from '../base/ImgList'
export default {
    data() {
        return {
            description : [],
            songList : [],
            songListc : [],
            commentList:[],
            detail: {},
            collectNum:0,
            limit:20,
            total:0,
            offset:0,
            loading: true,
            moreColl:true,
            searchContent:'',
            commentContent:'',
            wordHide: true,
            cur:0,
            navList: [
                '歌曲列表',
                '评论',
                '专辑详情'
            ]
       }
    },
    components: {
        Album,
        Comment,
        ImaList
    },
    created() {
        this.id = parseInt(this.$route.params.id)
        this.params = {
            id: this.id
        }
        this.initSongListDetail()
        this.initCommentList()
    },
    mounted() {
        this.init()

    },
    computed: {
        ...mapGetters([
           'collectSongList',
           'collectAlbum'
        ]),
        showCls() {
            return this.wordHide?'icon-down':'icon-shang'
        },
        dropCls() {
            return this.wordHide?'up':'drop'
        },
        isCollect() {
            let id = parseInt(this.$route.params.id)
            return this.collectAlbum.includes(id)
        }
    },
    methods: {
        
        init() {
            setTimeout(() => {
                let outside = document.documentElement,
                innerside = this.$refs.SongListDetail
                initPage(outside,innerside)
            }, 500); 
        },
        initSongListDetail() {
            Axios(getAlbumDetail,this.params).then((res) => {
                this.detail = res.album
                let des = res.album.description
                des = des.split('\n')
                des.forEach((item,index) => {
                    if(item == ' ') {
                        des[index] = '&#8197;'
                    }
                })
                this.description = des
                this.songList = this._normalizeSongList(res.songs)
                this.songListc = this._normalizeSongList(res.songs)    
            })         
        },
        initCommentList() {
            Axios(getAlbumComment,this.params).then((res) => {
                this.commentList = res.comments
                this.total = res.total
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
            let index = Math.ceil(Math.random() * (this.songList.length-1))
            let params = {
                id: this.songListc[index].mid
            }
            Axios(getSongUrl,params).then((res) => {
                url = res.data[0].url
                this.songListc[index].url = url
                this.selectPlay({
                   list:this.songListc,
                   index:index
                })
            })
        },
        collect() {
            let collectAlbum = this.collectAlbum.slice(0)
            collectAlbum.push(this.id)
            this.setCollectAlbum(collectAlbum)
            this.$message({
                type:'success',
                message:'收藏成功',
                center: true
            });
        },
        canCollect() {
            let collectAlbum = this.collectAlbum.slice(0)
            let index = collectAlbum.findIndex((item) => {
                return item == this.id
            })
            collectAlbum.splice(index,1)
            this.setCollectAlbum(collectAlbum)

            this.$message({
                type:'success',
                message:'取消收藏成功',
                center: true
            });
        },

        changePage(index) {
            let offset = (index-1) * this.limit
            let params = {
                id: this.id,
                offset: offset
            }
            Axios(getAlbumComment,params).then((res) => {
                this.commentList = res.comments
                this.$refs.SongListDetail.scrollTop = this.$refs.comment.offsetTop - 10
            })
        },
        sendComment() {
            let params = {
                t: 1,
                type: 3,
                id: this.id,
                content: this.commentContent,
                timestamp: (new Date()).getTime()
            }
            Axios(sendComment,params).then((res) => {
                this.$message({
                    type:'success',
                    message: '发送成功',
                    center: true
                });
                this.commentContent = ''
                this.commentList.unshift(res.comment)
            }).catch((e) => {
                this.$message({
                    type:'info',
                    message: '版权方要求，当前专辑需单独付费，购买数字专辑即可无限畅享',
                    center: true
                });
            })
        },
        deleteCom(id) {
            let index = this.commentList.findIndex((item) => {
                return item.commentId == id
            })
            this.commentList.splice(index,1)
        },
        ...mapActions([
            'selectPlay'
        ]),
        ...mapMutations({
           setCollectAlbum:'SET_COLLECTALBUM'
        })
    }
}
</script>

<style lang='scss'>
@import '../assets/css/base.scss';
.SongListDetail {
    position: fixed;
    z-index: 99;
    left: 200px;
    width: 880px;
    height:570px;
    background: #FAFAFA;
    top: 50px;
    overflow: hidden;
    overflow-y: scroll;
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
            }
            .controlContainer {
                margin-top: 20px;
                .item {
                    font-size: 13px;
                    margin-right: 15px;
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
            .alSingerDetail {
                margin-top: 25px;
                font-size: 13px;
                color:#333;
                .alSinger {
                    margin: 10px 0;
                }
            }
        }
    }
    .songListMain {
        .songListNav {
            margin-left: 30px;
            border-bottom: 1px solid $borderColor;
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
    }
    .table {
        width: 100%;
        border-top: 1px solid $borderColor;
        box-sizing: border-box;
        .tableItem {
            box-sizing: border-box;
            padding: 10px 0 10px 10px;
            font-size: 12px;
            color: #666666;
            border-left: 1px solid $borderColor;
        }
        .tControl {
            width: 90px;
        }
        .tMusicTitle {
            width: 33%;
        }
        .tSinger {
            width: 22%;
        }
        .tAlbum {
            width: 22%;
        }
    }
    .sldCommentContainer {
        margin: 20px 30px 40px 30px;
        background: #F0F0F2;
        width: 100%;
        height: 110px;
        .sldComment {
            width: 93.5%;
            background: #FFFFFF;
            margin: 10px;
            border: 1px solid $borderColor;
            height: 50px;
            outline: none;
            &::placeholder {
                font-size: 14px;
                padding-left: 95%;
            }
        }
        .slcConmentIcon {
            display: inline-block;
            i {
                margin-left: 10px;
                &:nth-child(2) {
                    font-size: 18px;
                    position: relative;
                    top: -1px;
                }
                &:nth-child(3) {
                    font-size: 20px;
                    position: relative;
                    top: 1px;
                }
            }
        }
        .sendComment {
            display: inline-block;
            float: right;
            margin-right: 45px;
            background: white;
            border: 1px solid #ccc;
            padding: 5px 8px;
            font-size: 14px;
            border-radius: 5px;
        }
    }
    .comContainer {
        margin-left: 30px;
        .comtitle {
            font-size: 12px;
            margin-bottom: 10px;
        }
        
    }
    .albumDetail {
        margin: 30px 0 0 30px;
        p {
            margin-bottom: 10px;
            color:black;
            font-weight: bold;
        }
        .detailContainer {
            margin-left: 30px;
            .detailContent {
                line-height: 30px;
                font-size: 15px;
                color:#666666;
            }
        }
    }
}
</style>