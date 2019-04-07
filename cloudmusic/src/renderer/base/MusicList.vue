<template>
  <div class="musiclist">
      <ul class="musicContainer">
          <li class="music allCenter" v-for="(item,index) in list" :key="item.id">
              <span class="id">{{index + 1 | addZero}}</span>
              <img :src="item.song.album.blurPicUrl" alt="">
              <div class="musicName">
                  <p class="title">{{item.song.name}}</p>
                  <p class="alias"  v-if="item.song.alias.length > 0">({{item.song.alias[0]}})</p>
              </div>
              <i class="sq"></i>
              <i class="play"></i>
              <p class="name">{{item.song.artists[0].name}}</p>
              <div class="musicName">
                  <p class="title">{{item.song.name}}</p>
                  <p class="alias" v-if="item.song.alias.length > 0">({{item.song.alias[0]}})</p>
              </div>
              <span class="duration">{{item.song.duration | time}}</span>
          </li> 
      </ul>
  </div>
</template>

<script>
export default {
    props: {
        list: {
            type: Array,
            default: []
        }
    },
}
</script>

<style lang='scss'>
.musiclist {
    cursor: pointer;
    border: 1px solid #EDEDED;
    .music {
        padding: 10px 0;
        font-size: 13px;
        transition: all .2s ease-in;
        &:hover {
            background: #EBECED;
            transition: all .2s ease-in;
        }
        .id {
            width: 5%;
        }
        img {
            width: 40px;
            height: 40px;
        }
        .musicName {
            width: 30%;
            box-sizing: border-box;
            padding-left: 10px;
            display: flex;
            white-space:nowrap;
            justify-content: flex-start;
            .alias {
                padding-left: 5px;
                font-size: 12px;
                color:#888888;
                overflow:hidden;
                text-overflow:ellipsis;
            }
        }
        .name {
            width: 20%;
            padding-left: 10px;
        }
        .duration {
            color:#888888;
            width: 10%;
        }
    }
}
</style>