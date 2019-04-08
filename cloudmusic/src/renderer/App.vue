<template>
  <div id="app">
    <music-header></music-header>
    <music-nav></music-nav>
        <router-view></router-view>
    <play-bottom></play-bottom>
  </div>
</template>

<script>
  import MusicHeader from './components/Header'
  import MusicNav from './components/Nav'
  import PlayBottom from './components/playBottom'

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
  }
</script>

<style>
  @import url('./assets/css/reset');
  @import './assets/iconfont/iconfont.css';
  @import url('./assets/css/base');
  
  #app {
    background: #FAFAFA;
    
  }
</style>
