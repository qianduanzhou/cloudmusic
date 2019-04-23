<template>
  <ul class="same">
      <li class="alignCenter sameitem" v-for="item in list" :key="item.id" @click="getData(item)">
          <div class="samePic bgc" :style="{backgroundImage:`url(${item.coverImgUrl})`}" v-if="songlist"></div>
          <div class="samePic bgc" :style="{backgroundImage:`url(${item.album.blurPicUrl})`}" v-if="song"></div>
          <div class="sameDetail">
              <p class="sametitle">{{item.name}}</p>
              <p class="detail"> 
                  <slot :item = "item"></slot>
              </p>
          </div>
      </li>
  </ul>
</template>

<script>
export default {
    props: {
        list:{
            type:Array,
            default:[]
        },
        song:{
            type:Boolean,
            default:false
        },
        songlist:{
            type:Boolean,
            default:false
        }
    },
    methods: {
        getData(data) {
            this.$emit('getData',data)
        }
    }
}
</script>

<style lang='scss'>
.same {
    width: 240px;
    .sameitem {
        cursor: pointer;
        padding: 10px 0;
        &:hover {
            background: #ECEDEE;
        }
        .samePic {
            width: 40px;
            height: 40px;
        }
        .sameDetail {
            margin-left: 10px; 
            width: 180px;
            p {
                padding: 3px;
            }
            font-size: 13px;
            .sametitle {
                overflow: hidden;
                white-space: nowrap;
                text-overflow:ellipsis;
                color: #111111;
            }
            .detail {
                color:#8E8E8E;
            }
    }
    }
    
}
</style>