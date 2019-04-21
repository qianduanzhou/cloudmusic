<template>
  <div id="app">
    <music-header></music-header>
    <music-nav :key="uid"></music-nav>
    <div class="RootContainer scrollStyle" ref="RootContainer" 
      style=
      "height: 570px;
      width: 840px;
      margin-top: 50px;
      margin-bottom: 50px;">
        <router-view :root="$refs.RootContainer" :key="Math.random()"></router-view>
    </div>
    <play-bottom></play-bottom>
  </div>
</template>

<script>
  import MusicHeader from './components/Header'
  import MusicNav from './components/Nav'
  import PlayBottom from './components/playBottom'
  import {initPage} from './common/utils'
  export default {
    name: 'cloudmusic',
    data() {
      return {
        transitionName: 'slide-right' 
      }
    },
    components: {
      MusicHeader,
      MusicNav,
      PlayBottom
    },
    created() {
      this.uid = parseInt(localStorage.getItem('userId'))
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        setTimeout(() => {
          let outside = document.documentElement,
          innerside = this.$refs.RootContainer
          initPage(outside,innerside)
        }, 500);
      }
    }
  }
</script>

<style lang="scss">
  @import url('./assets/css/reset');

  @import './assets/iconfont/iconfont.css';

  @import url('./assets/css/base');
  @import './assets/css/base.scss';
  #app {
    background: #FAFAFA;
    
    .RootContainer {
      height: 570px;
      width: 880px;
      margin-top: 50px;
      margin-bottom: 50px; 
      margin-left: 200px;
      overflow: auto;
      border-left: 1px solid $borderColor;
    }
  }
</style>
