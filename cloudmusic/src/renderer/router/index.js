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
          component:Recommend
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
          component:SongList
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
