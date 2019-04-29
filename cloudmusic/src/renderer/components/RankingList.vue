<template>
  <div class="rankingList">
      <header class="rkTitle">官方榜</header>
      <main class="rkbox" v-if="rankingList1.length>0">
          <rankBox :list="rankingList1" :specailList="specailList" @getData="toDetail"></rankBox>
      </main>
      <div class="rkTitle">全球榜</div>
      <img-list :listWidth="18" :list="rankingList2" @getData="toDetail2">
        <template v-slot:img="imgs">
              <img v-lazy="imgs.imgs.coverImgUrl"/>
              <div class="num">
                <i class="iconfont icon-iconku-zhuanqu-"></i><span>{{imgs.imgs.playCount | wan}}</span>
              </div>
            <i class="iconfont icon-bofang play" style="opacity:1"></i>
        </template>
      </img-list>
      <router-view/>
  </div>
</template>

<script>
import RankBox from '../base/RankBox'
import ImgList from '../base/ImgList'
import {Axios,toplist} from '../common/api'
import {setLoading} from '../common/mixin'

export default {
    mixins:[setLoading],
    data() {
        return {
            rankingList1:[],
            specailList:[],
            rankingList2:[]
        }
    },
    created() {
        this.initRankList()
    },
    components: {
        RankBox,
        ImgList
    },
    methods: {
        initRankList() {
            Axios(toplist).then((res) => {
                let list = res.list
                    for(let i = 0; i < list.length; i ++) {
                        switch (list[i].name) {
                        case '云音乐新歌榜':
                            list[i].idx = 0
                            break;
                        case '云音乐热歌榜':
                            list[i].idx = 1
                            break;
                        case '网易原创歌曲榜':
                            list[i].idx = 2
                            break;
                        case '云音乐飙升榜':
                            list[i].idx = 3
                            break;
                        case '云音乐电音榜':
                            list[i].idx = 4
                            break;
                        case 'UK排行榜周榜':
                            list[i].idx = 5
                            break;
                        case '美国Billboard周榜':
                            list[i].idx = 6
                            break;
                        case 'KTV嗨榜':
                            list[i].idx = 7
                            break;
                        case 'iTunes榜':
                            list[i].idx = 8
                            break;
                        case 'Hit FM Top榜':
                            list[i].idx = 9
                            break;
                        case '日本Oricon周榜':
                            list[i].idx = 10
                            break;
                        case '韩国Melon排行榜周榜':
                            list[i].idx = 11
                            break;
                        case '韩国Mnet排行榜周榜':
                            list[i].idx = 12
                            break;
                        case '韩国Melon原声周榜':
                            list[i].idx = 13
                            break;
                        case '中国TOP排行榜(港台榜)':
                            list[i].idx = 14
                            break;
                        case '中国TOP排行榜(内地榜)':
                            list[i].idx = 15
                            break;
                        case '香港电台中文歌曲龙虎榜':
                            list[i].idx = 16
                            break;
                        case '华语金曲榜':
                            list[i].idx = 17
                            break;
                        case '中国嘻哈榜':
                            list[i].idx = 18
                            break;
                        case '法国 NRJ EuroHot 30周榜':
                            list[i].idx = 19
                            break;
                        case '台湾Hito排行榜':
                            list[i].idx = 20
                            break;
                        case 'Beatport全球电子舞曲榜':
                            list[i].idx = 21
                            break;
                        case '云音乐ACG音乐榜':
                            list[i].idx = 22
                            break;
                        case '云音乐嘻哈榜':
                            list[i].idx = 23
                            break;
                        default:
                            break;
                    }
                    }
                    this.rankingList1 = list.slice(0,4)
                    this.specailList = [res.artistToplist]
                    this.rankingList2 = list.slice(4,list.length)
                    this.set_loading(false)
            })
        },
        toDetail(data) {
            let id = data.id,
            idx = data.idx
            this.$router.push(`/find/rankinglist/${idx}/${id}`)
        },
        toDetail2(data) {
            let idx = data.idx,
            id = data.id
            this.$router.push(`/find/rankinglist/${idx}/${id}`)
        }
    }
}
</script>

<style lang='scss'>
@import '../assets/css/base.scss';
.rankingList {
    position:relative;
    .rkTitle {
        padding: 10px 0;
        margin-top: 20px;
        font-size: 20px;
        border-bottom: 1px solid $borderColor;
    }
    .rkbox {
        margin-top: 20px;
        width: 100%;
        flex-wrap: wrap;
    }
}

</style>