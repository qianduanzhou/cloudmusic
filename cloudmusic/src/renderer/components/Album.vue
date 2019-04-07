<template>
  <div class="album" v-if="show">
      <!-- <div class="albumPic" :style = '{ "backgroundImage" : "url("+singerDetail.artist.img1v1Url+")" }'></div> -->
      <div class="albumPic"></div>
      <div class="songContainer allCenter">
          <div class="Navheader">
              <p class="title">热门50首</p>
              <div class="i">
                  <i class="iconfont icon-shoucanggedan"></i>
                  <i class="iconfont icon-bofang"></i>
              </div>
          </div>
          <ul class="songs">
              <li class="songDetail left alignCenter" v-for="(item,index) in hotSongsc" 
              :key="index" @dblclick="playsong(index)" @click="songcur = index" :class="{'songActive' : songcur === index || playSongCur === index}">
                  <span class="index">{{index+1 | addZero}}</span>
                  <i class="love iconfont icon-xinaixin1"></i>
                  <i class="down iconfont icon-xiazai"></i>
                  <div class="nameContainer left alignCenter">
                      <p class="songName">{{item.name}}</p>
                      <p class="songIns" v-if="item.alia">({{item.alia}})</p>
                      <i class="sq iconfont icon-sq"></i>
                      <i class="play iconfont icon-mv"></i>
                  </div>
                  <span class="duration">{{item.duration | time}}</span>
              </li>
          </ul>
          <p class="all" @click.stop="more" v-if="all">查看全部50首></p>
      </div>
  </div>
</template>

<script>
import { create } from 'domain';
import axios from 'axios'
import {mapGetters,mapMutations,mapActions} from 'vuex'
export default {
    props: {
        hotSongs: {
            type: Array,
            default: []
        },
        show: {
            type: Boolean,
            default: false,
        },
        test: {
            type: String,
            default:''
        }
    },
    computed: {
        ...mapGetters([
            'playList'
        ])
    },
    data() {
        return {
            all: true,
            songcur: '',
            playSongCur: ''
        }
    },
    created() {
        this.hotSongsc = this.hotSongs.slice(0,10)
    },
    methods: {
        more() {
            this.hotSongsc = this.hotSongs.slice(0,50)
            this.all = false;
        },
        playsong(index) {
            /*标记*/
            this.playSongCur = index
            let url = ''
            axios.get('http://localhost:3000/song/url',{
                    params: {
                        id: this.hotSongsc[index].mid
                    }
                }).then((result) => {
                    let res = result.data
                    url = res.data[0].url
                    console.log(1)
                    this.hotSongsc[index].url = url
                    console.log(2)
                    this.selectPlay({
                       list:this.hotSongsc,
                       index:index
                    })
                })
        },
        ...mapActions([
            'selectPlay'
        ]),
        ...mapMutations({
            setPlayList:'SET_PLAYLIST'
        })
    }
}
</script>

<style lang='scss'>
    .album {
        display: flex;
        margin: 20px 30px 150px 30px;
        width: 90%;
        .albumPic {
            width: 150px;
            height: 150px;
            background: url('/static/hotsong.jpg')
        }
        .songContainer {
            margin-left: 60px;
            display: inline-block;
            width: 60%;
            .Navheader {
                display: flex;
                justify-content: space-between;
                .title {
                    margin-bottom: 10px;
                }
                i {
                    color: #999999;
                    cursor: pointer;
                    padding-right: 10px;
                    &:first-child {
                        padding-right: 15px;
                    }
                    &:hover {
                        color:#333;
                    }
                }
            }
            .songs {
                border: 1px solid #E1E1E2;
                width: 100%;
                .songActive{
                    background: #EBECED;
                }
                .songDetail {
                    color:#777;
                    padding: 7px 0;
                    width: 100%;
                    &:hover {
                        background: #EBECED;
                    }
                    i {
                        font-size: 13px;
                        cursor: pointer;
                    }
                    .index {
                        width: 25px;
                        padding-left: 20px;
                    }
                    .love {
                        width: 30px;
                        &:hover {
                            color:#000;
                        }
                    }
                    .down {
                        width: 30px;
                        &:hover {
                            color:#000;
                        }
                    }
                    .nameContainer {
                        width: 70%;
                        .songName {
                            color:#333; 
                        }
                        .sq {
                            font-size: 18px;
                            color:#FE672E;
                            padding: 0 5px;
                            position: relative;
                            top:4px;
                        }
                        .play {
                            font-size: 18px;
                            color:#D65151;
                            padding: 0 5px;
                            line-height: 15px;
                        }
                    }
                }
            }
            .all {
                margin: 15px 0 0 15px;
                color: #777;
                cursor: pointer;
                width: 100px;
                transition: color 0.1s ease-in-out;
                &:hover{
                    color:#333;
                    transition: color 0.1s ease-in-out;
                }
            }
        }
    } 
</style>