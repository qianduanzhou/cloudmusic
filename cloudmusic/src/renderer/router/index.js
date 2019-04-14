import Vue from 'vue'
import Router from 'vue-router'
import Find from '../components/Find'
import Recommend from '../components/Recommend'
import Fm from '../components/Fm'
import error from '../base/404'
import Singer from  '../components/Singer'
import SingerDetail from '../components/SingerDetail'
import SongDetail from '../components/SongDetail'
import SongList from '../components/SongList'
import SongListDetail from '../components/SongListDetail'
import DayRecSong from '../components/DayRecSong'
import gSListDetail from '../components/gSListDetail'


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
          children: [
            {
              path:':id',
              component:SingerDetail
            }
          ]
        },
        {
          path:'songlist',
          component:SongList,
          children: [
            {
              path:':id',
              component:SongListDetail
            },
          ]
        },
        {
          path:'good',
          component:gSListDetail
        }
      ]
    },
    {
      name:'songDetail',
      path:'/songDetail',
      component:SongDetail
    },
    { 
      name:'fm',
      path: "/fm",
      component:Fm
    },
    {
      name:'error',
      path:'*',
      component:error
    }
  ]
})
