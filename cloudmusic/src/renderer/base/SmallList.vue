<template>
  <div>
    <div class="mcAlbumItem alignCenter" v-for="(item,index) in list" :key="item.id">
        <slot :item="item" :index="index">
        </slot>
    </div>
  </div>
</template>

<script>
export default {
  props:['list']
}
</script>

<style lang='scss'>
.mcAlbumItem {
    font-size: 13px;
    color: #666666;
    padding: 10px 30px;
    &:hover {
      background: #EBECED;
    }
    &:nth-child(1),&:nth-child(2),&:nth-child(3){
      .mcNum {
        color:red;
      }
    }
    .mcNum {
      font-size: 16px;
      padding: 0 20px;
    }
    .mcAlbumPic{
      cursor: pointer;
      width: 40px;
      height: 40px;
    }
    .mcAlbumName {
      cursor: pointer;
      width: 52%;
      text-align: left;
      margin-left: 20px;
      &:hover {
        color:#333;
      }
    }
    .mcAlbumSinger {
      width: 25%;
      cursor: pointer;
      &:hover {
        color:#333;
      }
    }
  }
</style>