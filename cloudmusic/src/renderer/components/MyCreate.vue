<template>
  <div class="myCreate">
      <nav class="mcNav alignCenter">
        <div class="mcItem" :class="{'mcActive':mcCur === 'album'}" @click="mcCur = 'album'">
          专辑
        </div>
        <div class="mcItem" :class="{'mcActive':mcCur === 'singer'}" @click="mcCur = 'singer'">
          歌手 
        </div>
      </nav>
      <div v-if="mcCur == 'album'">
        <div class="mcTitle">
          收藏的专辑
          <span>（{{albumList.length}}）</span>
        </div>
        <main class="mcAblumContainer">
          <div class="mcAlbumItem alignCenter"  v-for="item in albumList" :key="item.id" @click="toAlbum(item.id)">
            <img v-lazy="item.picUrl" class="mcAlbumPic spc"/>
            <p class="mcAlbumName">{{item.name}}</p>
            <p class="mcAlbumSinger">{{item.artists[0].name}}</p>
            <span>{{item.size}}首</span>
          </div>
        </main>
      </div>
      <div v-if="mcCur == 'singer'">
        <div class="mcTitle">
          收藏的歌手
          <span>（{{singerList.length}}）</span>
        </div>
        <main class="mcAblumContainer">
          <div class="mcAlbumItem alignCenter" v-for="item in singerList" :key="item.id" @click="toSinger(item.id)">
            <img v-lazy="item.img1v1Url" class="mcAlbumPic spc"/>
            <p class="mcAlbumName">{{item.name}}</p>
            <p class="mcAlbumSinger">专辑：{{item.albumSize}}</p>
            <span>MV：{{item.mvSize}}</span>
          </div>
        </main>
      </div>
      
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      mcCur:'album',
      singerList:[],
      albumList:[]
    }
  },
  created() {
    this.uid = localStorage.getItem('userId')
    this.initSinger()
    this.initAlbum()
  },
  methods: {
    initSinger() {
      axios.get('http://localhost:3000/artist/sublist',{
        params:{
          uid:this.uid
        }
      }).then((result) => {
        let res = result.data
        if(res.code === 200) {
          this.singerList = res.data
        }
      })
    },
    initAlbum() {
      axios.get('http://localhost:3000/album/sublist',{
        params:{
          uid:this.uid
        }
      }).then((result) => {
        let res = result.data
        if(res.code === 200) {
          this.albumList = res.data
        }
      })
    },
    toSinger(id) {
      this.$router.push(`/find/singer/${id}`)
    },
    toAlbum(id) {
      // console.log(id)
      this.$router.push(`/album/${id}`)
    }
  }
}
</script>

<style lang='scss'>
.mcNav {
  width: 220px;
  margin: 20px auto;
  border: 1px solid #E1E1E2;
  border-radius: 3px;
  .mcItem {
    cursor: pointer;
    padding: 7px;
    width: 50%;
    text-align: center;
    font-size: 13px;
    color: #666666;
    &:hover{
      color: #333;
    }
  }
  .mcActive {
    background: #7C7D85;
    color:#FAFAFA;
    &:hover{
      color: #FAFAFA;
    }
  }
}
.mcTitle {
  font-size: 20px;
  padding-left: 30px;
  padding-bottom: 10px;
  border-bottom: 1px solid #E1E1E2;
  span {
    font-size: 12px;
  }
}
.mcAblumContainer {
  font-size: 13px;
  color: #666666;
  .mcAlbumItem {
    padding: 10px 30px;
    &:hover {
      background: #EBECED;
    }
    .mcAlbumPic{
      cursor: pointer;
      width: 40px;
      height: 40px;
    }
    .mcAlbumName {
      cursor: pointer;
      width: 55%;
      text-align: left;
      margin-left: 20px;
      &:hover {
        color:#333;
      }
    }
    .mcAlbumSinger {
      width: 30%;
      cursor: pointer;
      &:hover {
        color:#333;
      }
    }
  }
}
</style>