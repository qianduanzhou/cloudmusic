<template>
  <div class="gSListDetail scrollStyle" ref="gSListDetail">
      <header class="gsdHeader spCenter">
          <p class="gsdTitle">精品歌单</p>
          <p class="gsdAll" @click="showDrop = !showDrop">全部</p>
      </header>
      <main class="gsdMain">
          <ul class="gsdContainer spCenter">
              <li class="gsdContent alignCenter" v-for="item in GSList" :key="item.id">
                  <img v-lazy="item.coverImgUrl" class="gsdPic"  @click="toSongList(item.id)">
                  <i class="iconfont icon-yinle"></i>
                  <span class="gsdNum">{{item.playCount | wan}}</span>
                  <div class="gsdIns">
                      <span class="gsdIcon">{{item.tag}}</span>
                      <p class="gsldTitle" @click="toSongList(item.id)">{{item.name}}</p>
                      <p class="gsldName">by&nbsp;&nbsp;{{item.creator.nickname}}</p>
                      <p class="gsldIns">{{item.copywriter}}</p>
                  </div>
              </li>
          </ul>
      </main>

      <div v-if="showDrop" class="drop">
          <dropList :width="460">
              <template v-slot:header>
                  <p class="dropHeader">
                      选择你喜欢的分类
                  </p>
              </template>
              <div class="allList" :class="{'cateActive': name=='全部歌单'}" @click="name = '全部歌单',initGSLDList() ,showDrop=false">
                  全部歌单
              </div>
              <div class="item">
                  <ul class="cateContainer">
                      <li class="cateContent" :class="{'cateActive': name==item}" v-for="item in navContent" :key="item" @click="select(item)">{{item}}</li>
                  </ul>
              </div>
          </dropList>
    </div>
    <div class="modules" @click="showDrop = false" ref="modules" v-show="showDrop"
    style="position: fixed;
            width: 100%;
            top: 0;
            left: 0;
            z-index: 99;
            height: 630px;"
    ></div>
  </div>
  
</template>

<script>
import DropList from '../base/DropList'
import {Axios,getGSongList} from '../common/api'

export default {
    data() {
        return {
            showDrop:false,
            name:'全部歌单',
            navContent: [
                '华语','欧美','韩语','日语','粤语','小语种','运动','ACG','影视原声','流行','摇滚','后摇','古风','民谣','轻音乐','电子','器乐','说唱','古典','爵士'
            ],
            GSList:[]
        }
    },
    mounted() {
        this.init()
        this.initGSLDList()
    },
    components: {
        DropList
    },
    methods: {
        init() {
            setTimeout(() => {
                this.$refs.gSListDetail.style.width = `${document.documentElement.offsetWidth - 200}px`
                this.$refs.gSListDetail.style.height = `${document.documentElement.clientHeight - 100}px`
                this.$refs.modules.style.height = `${document.documentElement.clientHeight - 50}px`
                window.onresize = () => {
                    this.$refs.gSListDetail.style.width = `${document.documentElement.offsetWidth - 200}px`
                    this.$refs.gSListDetail.style.height = `${document.documentElement.clientHeight - 100}px`
                    this.$refs.modules.style.height = `${document.documentElement.clientHeight - 50}px`
                }
            }, 500); 
        },
        select(tag) {
            this.name = tag
            this.initGSLDList()
            this.showDrop = false
        },
        initGSLDList() {
            let params = {
                cat: this.name
            }
            Axios(getGSongList,params).then((res) => {
                this.GSList = res.playlists
            })
        },
        toSongList(id) {
            this.$router.push(`/find/songlist/${id}`)
        }
    }
}
</script>

<style lang='scss'>
@import '../assets/css/base.scss';
@media screen and (min-width:670px){
.gSListDetail {
    position: fixed;
    z-index: 99;
    width: 880px;
    height: 570px;
    left: 200px;
    box-sizing: border-box;
    padding: 30px 25px;
    background: #FAFAFA;
    top: 100px;
    overflow-y: scroll;
    border-left: 1px solid $borderColor;
    .gsdHeader {
        border-bottom: 1px solid $borderColor;
        padding-bottom: 10px;
        .gsdTitle {
            font-size: 20px;
        }
        .gsdAll {
            cursor: pointer;
            font-size: 14px;
            color: #555555;
        }
    }
    .gsdMain {
        margin-bottom: 50px;
        .gsdContainer {
            flex-wrap: wrap;
            position: relative;
            width: 100%;
            .gsdContent {
                position: relative;
                box-sizing: border-box;
                width: 360px;
                margin: 20px 0;
                .gsdPic {
                    cursor: pointer;
                    width: 100px;
                    height: 100px;
                }
                .icon-yinle,.gsdNum{
                    position: absolute;
                    font-size: 12px;
                    top: 5px;
                    left:40px;
                    color:#E6EBEF;
                }
                .gsdNum {
                    top: 6px;
                    left:60px;
                }
                .gsdIns {
                    margin-left: 10px;
                    .gsdIcon {
                        display: inline-block;
                        font-size: 13px;
                        padding: 2px 3px;
                        border: 1px solid #C62F2F;
                        color: #C62F2F;
                        line-height: 13px;
                        border-radius: 3px;
                        margin-right: 5px;
                    }
                    .gsldTitle {
                        cursor: pointer;
                        display: inline-block;
                        position: relative;
                        top: 2px;
                        width: 180px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        color: #333333;
                        font-size: 13px;
                    }
                    .gsldName {
                        cursor: pointer;
                        color: #555555;
                        margin: 10px 0 20px 0;
                        font-size: 12px;
                    }
                    .gsldIns {
                        color: #555555;
                        width: 240px;
                        font-size: 13px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                    }
                }
            }
        }
    }
    .drop {
        position: absolute;
        top: 60px;
        right: 470px;
        height: 300px;
        &::before {
            content:'';
            background: #FAFAFA;
            height: 15px;
            width: 15px;
            position: absolute;
            top: -7px;
            left: 420px;
            z-index: 201;
            transform: rotate(135deg);
        }
        .dropHeader {
            width: 100%;
            box-sizing: border-box;
            height: 50px;
            border-bottom: 1px solid $borderColor;
            line-height: 50px;
            padding-left: 20px;
        }
        .allList {
            position: relative;
            width: 92%;
            height: 35px;
            box-sizing: border-box;
            margin: 10px auto;
            text-align: center;
            line-height: 35px;
            border: 1px solid $borderColor;
            font-size: 13px;
            color: #555555;
            cursor: pointer;
            &:hover{
                color: #333333;
            }
        }
        .item {
            width: 92%;
            margin: 10px auto;
            box-sizing: border-box;
            display: flex;
            .cateContainer {              
                display: flex;
                flex-wrap: wrap;
                width: 420px;
                box-sizing: border-box;
                .cateContent {
                    cursor: pointer;
                    position: relative;
                    box-sizing: border-box;
                    width: 20%;
                    font-size: 13px;
                    color:#555555;
                    border-left: 1px solid $borderColor;
                    border-bottom: 1px solid $borderColor;
                    height: 35px;
                    text-align: center;
                    line-height: 35px;
                    &:last-child {
                        border-right: 1px solid $borderColor;
                    }
                    &:nth-of-type(5n) {
                        border-right: 1px solid $borderColor;
                    }
                    &:nth-of-type(1),&:nth-of-type(2),&:nth-of-type(3),&:nth-of-type(4),&:nth-of-type(5) {
                        border-top: 1px solid $borderColor;
                    }
                    .hot {
                        position: absolute;
                        font-size: 8px;
                        color: #C62F2F;
                        font-weight: bold;
                        right: 2px;
                        top: -12px;
                    }
                }
            }
        }
    .cateActive {
        border: none;
        /* border: 1px solid #C62F2F; */
        color: #333333;
        &::before {
            content:'';
            position: absolute;
            left: 0;
            top: 0;
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            border: 1px solid #C62F2F;
        }
    }
    }
}
}
@media screen and (min-width:1400px){
    .gSListDetail {
        .gsdMain {
            .gsdContainer {
                .gsdContent {
                    width: 520px;
                    .gsdIns {
                        .gsldTitle {
                        width: 270px;
                        }
                        .gsldIns {
                            width: 430px;
                        }
                    } 
                }
            }
        }    
    }    
}
</style>