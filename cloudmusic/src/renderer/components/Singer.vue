<template>
  <div class="singer"  ref="singer">
    <div class="SingerNavContainer">
       <ul class="SingerNav left">
         <span class="title">语种：</span>
         <li v-for="(item,index) in lanList" :key="item.id" :class="{'active':index == lancur}" @click="lancur = index,offset = 0,initSinger()">
              {{item.name}}
         </li>
       </ul>
       
       <ul class="SingerNav left">
         <span class="title">分类：</span>
         <li v-for="(item,index) in cfList" :key="item.id" :class="{'active':index == cfcur}" @click="cfcur = index,initSinger()">
              {{item.name}}
         </li>
       </ul>
       
       <ul class="SingerNav left">
         <span class="title">筛选：</span>
         <li v-for="(item,index) in filterList" :key="item.id" :class="{'active':index == filtercur}" @click="filtercur = index,offset = 0,initSinger()">
              {{item}}
         </li>
       </ul>
    </div>
    <img-list :list="singList" :listWidth="15" :isSinger="true" ref="list" @getData="getSongList">
      <template v-slot:specail>
        <li style="width:15%;" @click="toSingerRank"><img src="../../../static/singer.jpg"/><p style="font-size:13px;">歌手排行榜</p></li>
      </template>
      <template v-slot:img="imgs">
              <img v-lazy="imgs.imgs.picUrl"/>
      </template>
    </img-list>
    <div v-loading="loading" style="height:100px;" v-if="loading"></div>
    <p style="width:100%;text-align:center;margin-bottom:50px;color:#888888;" v-if="!loading">没有更多歌手了~~~</p>
    <router-view :key="Math.random()"/>
  </div>
</template>

<script>
import ImgList from '../base/ImgList'
import {Axios,getSinger} from '../common/api'
import {setLoading} from '../common/mixin'
export default {
  mixins:[setLoading],
  props:['root'],
  components: {
    ImgList
  },
  data() {
    return {
      lancur: 0,
      cfcur: 0,
      filtercur: 0,
      offset: 0,
      limit: 30,
      singList:[],
      loading: true,
      more:true,
      lanList: [
        {
          id: 1,
          cat: 1000,
          name: '华语'
        },
        {
          id: 2,
          cat: 2000,
          name: '欧美'
        },
        {
          id: 3,
          cat: 6000,
          name: '日本'
        },
        {
          id: 4,
          cat: 7000,
          name: '韩国'
        },
        {
          id: 5,
          cat: 4000,
          name: '其他'
        }
      ],
      cfList:[
        {
          id: 1,
          cat: 1,
          name: '男歌手'
        },
        {
          id: 2,
          cat: 2,
          name: '女歌手'
        },
        {
          id: 3,
          cat: 3,
          name: '乐队组合'
        }
      ],
      filterList:['热门','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','C','Y','Z']
    }
  },
  created() {
    this.initSinger()
    this.moreSinger()
  },
  methods: {
    initSinger() { 
      let cat = this.lanList[this.lancur].cat +  this.cfList[this.cfcur].cat
      let initial = ''
      if(this.filterList[this.filtercur] != '热门') {
        initial = this.filterList[this.filtercur]
      }
      let params = {
        cat: cat,
        initial: initial?initial:'',
        offset: this.offset,
        limit: this.limit
      }
      if(!this.more) {
        return 
      } 
      Axios(getSinger,params).then((res) => {
          this.singList = res.artists
          this.more = res.more
          this.singList.forEach((item) => {
            item.picUrl = item.img1v1Url
          })
          this.loading = false
          this.set_loading(false)
      })
    },
    //  加载更多
    moreSinger() {
      setTimeout(() => {
        this.root.onscroll = () => {
          let cat = this.lanList[this.lancur].cat +  this.cfList[this.cfcur].cat
          let initial = ''
          if(this.filterList[this.filtercur] != '热门') {
            initial = this.filterList[this.filtercur]
          }
          // let height = this.root.offsetHeight
          // var bottomSinger = this.$refs.list.$refs.li[this.$refs.list.$refs.li.length-2]
          var clientHeight = this.root.clientHeight
          var scrollHeight = this.root.scrollHeight
          var scrollTop = this.root.scrollTop
          if(scrollTop + clientHeight >= scrollHeight) {
            
            this.loading = true
            this.offset = this.offset + this.limit ;
            let params = {
              cat: cat,
              initial: initial,
              offset: this.offset,
              limit: this.limit
            }
            if(!this.more) {
              this.loading = false
              return 
            } 
            Axios(getSinger,params).then((res) => {
              this.singList = this.singList.concat(res.artists)
              this.more = res.more
              if(!this.more) {
                this.loading = false
              } 
              this.singList.forEach((item) => {
                item.picUrl = item.img1v1Url
              })
            })
          }
        }
      }, 500);
      
    },
    // 歌曲列表
    getSongList(data) {
      let id = data.id
      this.$router.push({
        path:`/singerDetail/${id}`
      })
    },
    toSingerRank() {
      this.$router.push({
        path:`/singerRank`
      })
    }
  }
}
</script>

<style lang='scss'>
@import '../assets/css/base.scss';
.singer {
  font-size: 13px;
  position:relative;
  .SingerNavContainer {
    padding: 10px 0;
    border-bottom: 1px solid $borderColor;
    .SingerNav {
      flex-wrap: wrap;
      .title {
          display: block;
          margin: 10px 0;
        }
      .active {
        color:white;
        background: #8F9096;
      }
      li {
        cursor: pointer;
        padding: 5px 18px;
        margin: 5px 0;
        border-right: 1px solid #888888;
        color: rgba(0,0,0,0.8);
        &:hover{
          color: rgba(0,0,0,1);
        }
        &:last-child{
          border-right:none;
        }
      }
    }
  }
}
</style>