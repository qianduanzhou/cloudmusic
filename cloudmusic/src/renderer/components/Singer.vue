<template>
  <div class="singer"  ref="singer">
    <div class="SingerNavContainer">
       <ul class="SingerNav left">
         <span class="title">语种：</span>
         <li v-for="(item,index) in lanList" :key="item.id" :class="{'active':index == lancur}" @click="lancur = index,initSinger()">
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
         <li v-for="(item,index) in filterList" :key="item.id" :class="{'active':index == filtercur}" @click="filtercur = index,initSinger()">
              {{item}}
         </li>
       </ul>
    </div>
    <img-list :list="singList" :listWidth="15" :isSinger="true" ref="list" @getSongList="getSongList"></img-list>
    <div v-loading="loading" style="height:100px;"></div>
    <router-view/>
  </div>
</template>

<script>
import ImgList from '../base/ImgList'
import axios from 'axios'




export default {
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
  beforeRouteUpdate (to,from,next) {
    if(to.fullPath != "/find/singer") {
      this.singList = []
    }else{
      this.initSinger()
    }
		next()
	},
  methods: {
    initSinger() {
      let cat = this.lanList[this.lancur].cat +  this.cfList[this.cfcur].cat
      let initial = ''
      if(this.filterList[this.filtercur] != '热门') {
        initial = this.filterList[this.filtercur]
      }
      axios.get('http://localhost:3000/artist/list',{
        params:{
          cat: cat,
          initial: initial,
          offset: this.offset,
          limit: this.limit
        }
      }).then((result) => {
        let res = result.data
        if(res.code == 200) {
          this.singList = res.artists
          this.singList.forEach((item) => {
                        item.picUrl = item.img1v1Url
                    })
          this.loading = false
        }
      })
    },
    //  加载更多
    moreSinger() {
      window.onscroll = () => {
        if(this.$route.fullPath != '/find/singer') {
          this.singList = []
          return 
        }
        let cat = this.lanList[this.lancur].cat +  this.cfList[this.cfcur].cat
        let initial = ''
        if(this.filterList[this.filtercur] != '热门') {
          initial = this.filterList[this.filtercur]
        }
        // let height = this.$refs.singer.offsetHeight
        // var bottomSinger = this.$refs.list.$refs.li[this.$refs.list.$refs.li.length-2]
        var clientHeight = document.documentElement.clientHeight
        var scrollHeight = document.documentElement.scrollHeight
        var scrollTop = document.documentElement.scrollTop
        if(scrollTop + clientHeight >= scrollHeight) {
          this.loading = true
          this.offset = this.offset + this.limit ;
          axios.get('http://localhost:3000/artist/list',{
            params:{
              cat: cat,
              initial: initial,
              offset: this.offset,
              limit: this.limit
            }
          }).then((result) => {
            let res = result.data
            if(res.code == 200) {
              this.singList = this.singList.concat(res.artists)
              this.singList.forEach((item) => {
                            item.picUrl = item.img1v1Url
                        })
              this.loading = false
            }
          })
        }
    }
    },
    // 歌曲列表
    getSongList(id) {
      this.$router.push({
        path:`/find/singer/${id}`
      })
    }
  }
}
</script>

<style lang='scss'>
.singer {
  font-size: 13px;

  .SingerNavContainer {
    padding: 10px 0;
    border-bottom: 1px solid #E1E1E2;
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