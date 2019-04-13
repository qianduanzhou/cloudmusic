<template>
  <div class="list">
      <ul class="listContainer">
          <slot name="specail"></slot>      
          <li :style="{width:listWidth + '%','border-radius':borderRadius+'px'}" @click="getData(item)"
          v-for='item in list' :key='item.id'
          >
          <slot name="img" :imgs="item"></slot>
            <p :style="{'font-size':`${fontsize}px`}" v-if="item.name">{{item.name}}</p>
            <p :style="{'font-size':`${fontsize}px`}" v-if="item.nickname">{{item.nickname}}</p>
          </li>
      </ul>
  </div>
</template>

<script>
export default {
  props: {
    listWidth: {
      type: Number,
      default: 18
    },
    fontsize: {
      type: Number,
      default: 13
    },
    list: {
      type: Array,
      default:[]
    },
    borderRadius:{
      type:Number,
      default:20
    }
  },
  data() {
    return {

    }
  },
  methods: {
    getData(data) {
      this.$emit('getData',data)
    },
  }
}
</script>

<style lang='scss'>
  .list {
    width: 100%;
    .listContainer {
      width: 100%;
      margin-top: 10px;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      li {
        cursor: pointer;
        position: relative;
        padding-bottom: 10px;
        margin-bottom: 20px;
        img {
          width: 100%;
          border: 1px solid #E1E1E2;
        }
        .icon-shipin1 {
          font-size: 11px;
          margin-right: 3px;
        }
        p {
          padding: 3px;
          line-height: 20px;
          font-size: 14px;
          text-align: center;
          color:#555555;
          &:hover {
            color:#111111;
          }
        }
        .num {
          position: absolute;
          padding: 5px;
          color:white;
          top:0;
          right: 0;
          span {
            padding-left: 2px;
            font-size: 12px;
          }
          b {
            font-size: 12px;
          }
        }
        .duration {
          position: absolute;
          left: 5px;
          bottom: 42px;
          color: white;
        }
        .play {
          opacity: 0;
          position: absolute;
          bottom: 80px;
          font-size: 26px;
          color: rgba(0,0,0,0.8);
          right: 10px;
          transition: opacity 0.2s ease-in;
        }
        &:hover .play {
          opacity: 1;
          transition: opacity 0.2s ease-in;
        }
        .ins {
          opacity: 0;
          font-size: 12px;
          position: absolute;
          padding: 7px;
          line-height: 20px;
          top: 0;
          background: rgba(0,0,0,0.5);
          color: white;
          overflow:hidden;
          text-overflow: ellipsis;//显示省略号
          display:-webkit-box;
          -webkit-line-clamp:2;//块元素显示的文本行数
          -webkit-box-orient:vertical;
          transition: opacity 0.4s ease-in;
        }
        &:hover .ins {
          opacity: 1;
          transition: opacity 0.4s ease-in;
        }
      }
    }
  }
</style>