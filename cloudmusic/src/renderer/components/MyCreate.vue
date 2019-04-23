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
          <smallList :list="albumList" v-slot="item">
            <img v-lazy="item.item.picUrl" class="mcAlbumPic spc" @click.stop="toAlbum(item.item.id)"/>
            <p class="mcAlbumName"  @click.stop="toAlbum(item.item.id)">{{item.item.name}}</p>
            <p class="mcAlbumSinger" @click.stop="toSingera(item.item.artists[0].id)">{{item.item.artists[0].name}}</p>
            <span>{{item.item.size}}首</span>
          </smallList>
        </main>
      </div>
      <div v-if="mcCur == 'singer'">
        <div class="mcTitle">
          收藏的歌手
          <span>（{{singerList.length}}）</span>
        </div>
        <main class="mcAblumContainer">
          <smallList :list="singerList" v-slot="item">
            <img v-lazy="item.item.img1v1Url" class="mcAlbumPic spc" @click="toSinger(item.item.id)"/>
            <p class="mcAlbumName" @click="toSinger(item.item.id)">{{item.item.name}}</p>
            <p class="mcAlbumSinger">专辑：{{item.item.albumSize}}</p>
            <span>MV：{{item.item.mvSize}}</span>
          </smallList>
        </main>
      </div>
      
  </div>
</template>

<script>
import axios from 'axios'
import {Axios,getUserCollectSinger,getCollectAlbum} from '../common/api'
import SmallList from '../base/SmallList'
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
  components: {
    SmallList
  },
  methods: {
    initSinger() {
      Axios(getUserCollectSinger,{
        uid:this.uid
      }).then((res) => {
        this.singerList = res.data
      })
    },
    initAlbum() {
      Axios(getCollectAlbum,{
        uid:this.uid
      }).then((res) => {
        this.albumList = res.data
      })
    },
    toSinger(id) {
      this.$router.push(`/singerDetail/${id}`)
    },
    toSingera(id) {
      this.$router.push(`/singerDetail/${id}`)
    },
    toAlbum(id,item) {
      this.$router.push(`/album/${id}`)
    }
  }
}
</script>

<style lang='scss'>
@import '../assets/css/base.scss';
.mcNav {
  width: 220px;
  margin: 20px auto;
  border: 1px solid $borderColor;
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
  border-bottom: 1px solid $borderColor;
  span {
    font-size: 12px;
  }
}
.mcAblumContainer {
  
  .mcAlbumItem {
    font-size: 13px;
    color: #666666;
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