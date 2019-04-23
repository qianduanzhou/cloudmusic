<template>
  <div class="singerRank">
      <p class="srkTitle">云音乐歌手榜</p>
      <smallList :list="singerRank" v-slot="item">
          <p class="mcNum">{{item.index + 1 }}</p>
          <img v-lazy="item.item.img1v1Url" class="mcAlbumPic spc" @click="toSinger(item.item.id)"/>
          <p class="mcAlbumName" @click="toSinger(item.item.id)">{{item.item.name}}</p>
          <p class="mcAlbumSinger">专辑：{{item.item.albumSize}}</p>
          <span>歌曲：{{item.item.musicSize}}</span>
      </smallList>
  </div>
</template>

<script>
import {Axios,singerRank} from '../common/api'
import SmallList from '../base/SmallList'
export default {
    data() {
        return {
            singerRank:[]
        }
    },
    created() {
        this.initSingerRank()
    },
    components: {
        SmallList
    },
    methods: {
        initSingerRank() {
            Axios(singerRank).then((res) => {
                this.singerRank = res.list.artists
            })
        },
        toSinger(id) {
            this.$router.push(`/singerDetail/${id}`)
        },
    }
}
</script>

<style lang='scss'>
@import '../assets/css/base.scss';
.srkTitle {
    width: 100%;
    padding: 50px auto; 
    text-align: center;
    color:blue;
    line-height: 100px;
    font-size: 25px;
    border-bottom: 1px solid $borderColor;
}
</style>