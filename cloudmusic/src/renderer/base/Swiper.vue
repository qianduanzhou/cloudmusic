<template>
  <div>
       <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="item in listc"  :key="item.id">
                    <img :src="item.prev" class="imgPrev">
                    <img :src="item.now" class="imgNow">
                    <img :src="item.next" class="imgNext">
                    <div class="imgPrev module"></div>
                    <div class="imgNext module"></div>
                    <span class="title" :style="{'background':item.titleColor}">{{item.typeTitle}}</span> 
                </div>  
            </div>
            <div class="swiper-pagination"></div>
            <div class="swiper-button-prev show"></div><!--左箭头-->
            <div class="swiper-button-next show"></div><!--右箭头-->  
        </div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.css'
export default {
    props:{
        list: {
            type: Array,
            default: []
        }
    },
    created() {
        this.listc = []
        let ret = [],
        prevRet = [],
        nextRet = []
        this.list.forEach((item) => {
            ret.push(item.imageUrl)
        })
        prevRet = ret.slice(0,ret.length-1)
        prevRet.unshift(ret[ret.length-1])
        nextRet = ret.slice(1,ret.length)
        nextRet.push(ret[0])
        this.list.forEach((item,index) => {
            this.listc.push({
                'prev':prevRet[index],
                'now':ret[index],
                'next':nextRet[index]
            })
        })
    },
    mounted() {
    var mySwiper = new Swiper ('.swiper-container', {
        initialSlide :0,
        observer:true,//修改swiper自己或子元素时，自动初始化swiper
        observeParents:true,
        autoplay: {
            delay: 3000
        },
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            dynamicBullets: true,
            dynamicMainBullets: 2
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    })          
    }
}
</script>

<style lang='scss'>
    .swiper-container {
        position: relative;
        width: 100%;
        margin: 20px auto;
        img {
            width:80%;
            height:200px; 
            margin:0 auto; 
            display:block;
        }
        .imgPrev,.imgNext {
            position: absolute;
            height: 190px;
            top: 10px;
            z-index: -1;
        }
        .module {
            width:80%;
            margin:0 auto; 
            display:block;
            background: rgba(0,0,0,0.5);
        }
        .imgNext {
            left: 200px;
        }
        .title {
            padding: 3px;
            color: white;
            border-top-left-radius:10px;
            border-bottom-left-radius: 10px;
            font-size: 13px;
            position: absolute;
            right: 75px;
            bottom: 10px;
        }
        .show {
            transition: opacity .2s ease-in;
            opacity: 0;
            &:hover{
                opacity: 1;
                transition: opacity .2s ease-in;
            }
        }
        .blue{
            background: blue; 
        }
    }

</style>