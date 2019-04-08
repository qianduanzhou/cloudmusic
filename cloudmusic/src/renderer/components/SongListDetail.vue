<template>
  <div class="SongListDetail">
      <header class="SongListDetailHeader">
          <div class="listPic bgc"></div>
          <div class="listDetailContainer">
              <div class="titleContainer alignCenter">
                  <span class="SongListsign">歌单</span>
                  <p class="mainTitle">一周日语1新歌推荐(3/30~04/05)</p>
                  <div class="numData">
                      <p class="title">歌曲数</p>
                      <p class="num">40</p>
                  </div>
                  <div class="numData">
                      <p class="title">贝复舒</p>
                      <p class="num">102万</p>
                  </div>
              </div>
              <div class="avatar alignCenter">
                  <div class="avaPic"></div>
                  <p class="avaName">云音乐樱花江</p>
                  <p class="createTime">2019-04-04创建</p>
              </div>
              <div class="controlContainer alignCenter">
                  <div class="item alignCenter">
                      <i class="iconfont icon-bofang"></i><p>播放全部</p><i class="add">+</i>
                  </div>
                  <div class="item alignCenter">
                      <i class="iconfont icon-shoucanggedan"></i><p>收藏(13223)</p>
                  </div>
                  <div class="item alignCenter">
                       <i class="iconfont icon-fenxiang"></i><p>分享(89)</p>
                  </div>
                  <div class="item alignCenter">
                        <i class="iconfont icon-xiazai"></i><p>下载全部</p>
                  </div>
              </div>
              <div class="tagcontainer alignCenter">
                  <p class="title">标签</p>
                  <div class="tagcontents">
                    <span class="tagcontent"><b class="tag">日语</b>/</span>
                    <span class="tagcontent"><b class="tag">流行</b>/</span>
                    <span class="tagcontent"><b class="tag">榜单</b>/</span>
                  </div>  
              </div>
              <div class="abstruct spCenter" :class="{'showMore':wordHide}">
                    <ul class="abstructContent">
                      简介：<li class="abItem" v-for="(item,index) in description" :key="index" v-html="item">
                      </li>
                    </ul>
                  <i class="iconfont" :class="showCls" @click="wordHide = !wordHide"></i>
              </div>
          </div>
      </header>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            description : [],
            wordHide: true
       }
    },
    created() {
        this.initSongListDetail()
    },
    computed: {
        showCls() {
            return this.wordHide?'icon-down':'icon-shang'
        }
    },
    methods: {
        initSongListDetail() {
            let id = this.$route.params.id
            axios.get('http://localhost:3000/playlist/detail',{
                params:{
                    id: id
                }
            }).then((result) => {
                let res = result.data
                if(res.code === 200) {
                    let des = res.playlist.description
                    des = des.split('\n')
                    des.forEach((item,index) => {
                        if(item == '') {
                            des[index] = '&#8197;'
                        }
                    })
                    this.description = des
                }
            })
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
                    width: 360px;
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
                margin-top: 10px;
                font-size: 12px;
                color:#333333;
                animation: drop;
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
            .showMore {
                height: 32px;
                overflow: hidden;
            }
            @keyframes drop {
                0% {
                    height: 32px;
                }
                50% {
                    height: 50%;
                }
                100% {
                    height: 100%;
                }
            }
        }
    }
}
</style>