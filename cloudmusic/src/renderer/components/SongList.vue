<template>
  <div class="songlist">
      <header class="songlistNav allCenter" @click="show = !show">
          {{name}}<i class="iconfont icon-xiasanjiao"></i>
      </header>
      <nav class="hotNav alignCenter">
          <p class="title">热门标签：</p>
          <ul class="navContent alignCenter">
              <li class="content" v-for="item in hotList" :key="item.name" @click="select(item)">{{item.name}}</li>
          </ul>
      </nav>
      <imgList :listWidth="23" :list="songList" @getData="toSonglistDetail">
          <template v-slot:specail>
              <li style="width:23%"><img src="../../../static/songList.jpg"/><p>精品歌单，倾心推荐，给最懂音乐的你</p></li>
          </template>
          <template v-slot:img="imgs">
              <img v-lazy="imgs.imgs.coverImgUrl"/>
              <div class="num">
                <i class="iconfont icon-iconku-zhuanqu-"></i><span>{{imgs.imgs.playCount | wan}}</span>
              </div>
                <i class="iconfont icon-bofang play"></i>
          </template>
      </imgList>
      <el-pagination
        layout="prev, pager, next"
        :total="total"
        :page-size = "99"
        :current-page = "curpage"
        @current-change = "changePage"
        style="margin:20px 0 70px 0;padding:2px 240px;"
        >
        </el-pagination>
      <div v-if="show" class="drop">
          <dropList :width="540">
              <template v-slot:header>
                  <p class="dropHeader">
                      添加标签
                  </p>
              </template>
              <div class="allList" :class="{'cateActive': name=='全部歌单'}" @click="name = '全部歌单' ,show=false">
                  全部歌单
              </div>
              <div class="item">
                  <div class="category spCenter">
                      <i class="iconfont icon-shenjingwangluoshenduxuexi yuzhong"></i>
                      <p>语种</p>
                  </div>
                  <ul class="cateContainer">
                      <li class="cateContent" :class="{'cateActive': name==item.name}" v-for="item in lanList" :key="item.name" @click="select(item)">{{item.name}} <span class="hot" v-if="item.hot">HOT</span></li>
                  </ul>
              </div>
              <div class="item">
                  <div class="category spCenter">
                      <i class="iconfont icon-yifufill fengge"></i>
                      <p>风格</p>
                  </div>
                  <ul class="cateContainer">
                      <li class="cateContent" :class="{'cateActive': name==item.name}" v-for="item in styleList" :key="item.name" @click="select(item)">{{item.name}} <span class="hot" v-if="item.hot">HOT</span></li>
                  </ul>
              </div>
              <div class="item">
                  <div class="category spCenter">
                      <i class="iconfont icon-changjing changjin"></i>
                      <p>场景</p>
                  </div>
                  <ul class="cateContainer">
                      <li class="cateContent" :class="{'cateActive': name==item.name}" v-for="item in placeList" :key="item.name" @click="select(item)">{{item.name}} <span class="hot" v-if="item.hot">HOT</span></li>
                  </ul>
              </div>
              <div class="item">
                  <div class="category spCenter">
                      <i class="iconfont icon-xiaolian smile"></i>
                      <p>情感</p>
                  </div>
                  <ul class="cateContainer">
                      <li class="cateContent" :class="{'cateActive': name==item.name}" v-for="item in feelList" :key="item.name" @click="select(item)">{{item.name}} <span class="hot" v-if="item.hot">HOT</span></li>
                  </ul>
              </div>
              <div class="item">
                  <div class="category spCenter">
                      <i class="iconfont icon-zhuti zhuti"></i>
                      <p>主题</p>
                  </div>
                  <ul class="cateContainer">
                      <li class="cateContent" :class="{'cateActive': name==item.name}" v-for="item in hostList" :key="item.name" @click="select(item)">{{item.name}} <span class="hot" v-if="item.hot">HOT</span></li>
                  </ul>
              </div>
          </dropList>
      </div>
       <div class="modules" @click="show = false" v-if="show"></div>
       <router-view/>
  </div>
</template>

<script>
import DropList from '../base/DropList'
import ImgList from '../base/ImgList'
import axios from 'axios'

export default {
    components: {
        DropList,
        ImgList
    },
    data() {
        return {
            show: false,
            limit:99,
            curpage:1,
            total:0,
            name:'全部歌单',
            lanList:[],
            styleList:[],
            placeList:[],
            feelList:[],
            hostList:[],
            hotList:[],
            songList:[],
            
        }
    },
    computed: {
    },
    created() {
        this.initSongListNav()
        this.initSongList()
    },
    beforeRouteUpdate (to,from,next) {
    if(to.fullPath != "/find/songlist") {
      this.songList = []
    }else{
      this.initSongList()
    }
		next()
	},
    methods: {
        initSongListNav() {
            axios.get('http://localhost:3000/playlist/catlist').then((result) => {
                let res= result.data
                if(res.code === 200) {
                    res.sub.forEach((item) => {
                        switch (item.category) {
                            case 0:
                                this.lanList = this.lanList.concat(item)
                                break;
                            case 1:
                                this.styleList =  this.styleList.concat(item)
                                break;
                            case 2:
                                this.placeList =  this.placeList.concat(item)
                                break;
                            case 3:
                                this.feelList = this.feelList.concat(item)
                                break;
                            case 4:
                                this.hostList = this.hostList.concat(item)
                                break;
                            default:
                                break;
                        }
                    })
                }
            })
            axios.get('http://localhost:3000/playlist/hot').then((result) => {
                let res= result.data
                if(res.code === 200) {
                    this.hotList = res.tags
                }
            })
        },
        initSongList() {
            window.onscroll = () => {
                if(this.$route.fullPath!="/find/songlist") {
                        this.songList = []
                        return 
                    }
            }
            
            axios.get('http://localhost:3000/top/playlist',{
                params: {
                    cat:this.name,
                    limit:this.limit
                }
            }).then((result) => {
                let res= result.data
                if(res.code === 200) {
                    this.songList = res.playlists
                    this.total = res.total
                }
            })
        },
        select(item) {
            this.name = item.name
            this.show = false
            this.curpage = 1
            this.initSongList()
        },
        changePage(index) {
            let offset = (index-1) * this.limit
            axios.get('http://localhost:3000/top/playlist',{
                params:{
                    offset: offset,
                    cat:this.name,
                    limit:this.limit
                }
            }).then((result) => {
                let res = result.data
                if(res.code == 200) {
                    this.songList = res.playlists
                    document.documentElement.scrollTop = 0
                }
            })
        },
        toSonglistDetail(data) {
            let id = data.id
            this.$router.push({
                path: `/find/songlist/${id}`,    
            })
        }
    }
}
</script>

<style lang='scss' scoped>
.songlist {
    .modules {
            position: fixed;
            width: 100%;
            top: 0;
            left: 0;
            height: 1000%;
        }
    .songlistNav {
        cursor: pointer;
        width: 80px;
        height: 27px;
        margin-top: 20px;
        font-size: 13px;
        color: #333333;
        border: 1px solid #E1E1E2;
    }
    .hotNav {
        margin-top: 10px;
        margin-bottom: 20px;
        font-size: 13px;
        .navContent {
            .content {
                padding: 0 19px;
                color: #555555;
                cursor: pointer;
                &:hover{
                    color:#333333;
                }
            }
            .content + .content {
                border-left: 1px solid #D4CCD4;
            }
        }
    }
    
    .drop {
        position: absolute;
        top: 104px;
        &::before {
            content:'';
            background: #FAFAFA;
            height: 15px;
            width: 15px;
            position: absolute;
            top: -7px;
            left: 40px;
            z-index: 201;
            transform: rotate(135deg);
        }
        .dropHeader {
            width: 100%;
            box-sizing: border-box;
            height: 50px;
            border-bottom: 1px solid #E1E1E2;
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
            border: 1px solid #E1E1E2;
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
            .category {
                margin-right: 20px;
                width: 80px;
                i {
                    font-size: 35px;
                    color:#C62F2F;
                    margin-right: 5px;
                }
                .fengge {
                    font-size: 24px;
                    padding-top: 5px;
                    position: relative;
                    left: 5px;
                    
                }
                .smile {
                    font-size: 26px;
                    padding-top: 5px;
                    position: relative;
                    left: 5px;
                }
                p{
                    line-height: 35px;
                    font-size: 14px;
                    color:#C62F2F;
                }
            }
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
                    border-left: 1px solid #E1E1E2;
                    border-bottom: 1px solid #E1E1E2;
                    height: 35px;
                    text-align: center;
                    line-height: 35px;
                    &:last-child {
                        border-right: 1px solid #E1E1E2;
                    }
                    &:nth-of-type(5n) {
                        border-right: 1px solid #E1E1E2;
                    }
                    &:nth-of-type(1),&:nth-of-type(2),&:nth-of-type(3),&:nth-of-type(4),&:nth-of-type(5) {
                        border-top: 1px solid #E1E1E2;
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
</style>