import Vue from 'vue'
import Router from 'vue-router'
import Find from '../components/Find'
import Recommend from '../components/Recommend'
import error from '../base/404'
import Singer from  '../components/Singer'
import SingerDetail from '../components/SingerDetail'
import SongDetail from '../components/SongDetail'
import SongList from '../components/SongList'
import SongListDetail from '../components/SongListDetail'
import DayRecSong from '../components/DayRecSong'
import gSListDetail from '../components/gSListDetail'
import RankingList from '../components/RankingList'
import RankingListDetail from '../components/RankingListDetail'
import MyCreate from '../components/MyCreate'
import AlbumDetail from '../components/AlbumDetail'
import SearchResult from '../components/SearchResult'
import Fm from '../components/Fm'
import SingerRank from '../components/SingerRank'


Router.prototype.goBack = function () {
  this.isBack = true
  window.history.go(-1)
  setTimeout(() => {
    this.isBack = false
  }, 500);
}
Vue.use(Router)
export default new Router({
  routes: [
    {
      name:'root',
      path:'/',
      redirect:'/find/recommend'
    },
    { 
      name:'find',
      path: "/find",
      redirect: "/find/recommend",
      component:Find,
      children: [
        {
          path:'recommend',
          component:Recommend,
          children: [
            {
              path:'dayRecSong',
              component:DayRecSong
            }
          ]
        },
        {
          path:'singer',
          component:Singer,
        },
        {
          path:'songlist',
          component:SongList
        },
        {
          path:'good',
          component:gSListDetail
        },
        {
          path:'rankinglist',
          component:RankingList,
          children: [
            {
              path:':idx/:id',
              component:RankingListDetail
            },
          ]
        },

      ]
    },
    {
      name:'singerDetail',
      path:'/singerDetail/:id',
      component:SingerDetail
    },
    {
      name:'songListDetail',
      path:'/songListDetail/:id',
      component:SongListDetail
    },

    {
      name:'songDetail',
      path:'/songDetail',
      component:SongDetail
    },
    { 
      name:'create',
      path: "/create/:id",
      component:SongListDetail
    },
    {
      name:'myCreate',
      path:'/mycreate',
      component:MyCreate
    },
    {
      name:'album',
      path:'/album/:id',
      component:AlbumDetail
    },
    {
      name:'singerRank',
      path:'/singerrank',
      component:SingerRank
    },
    {
      name:'searchResult',
      path:'/search/:keywords',
      component:SearchResult
    },
    {
      name:'fm',
      path:'/fm',
      component:Fm
    },
    {
      name:'error',
      path:'*',
      component:error
    }
  ]
})
