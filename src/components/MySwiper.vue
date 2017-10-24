<template>
  <!-- 轮播图 -->
  <div class="my-swiper">
    <!--<p>数组{{bannerList}}</p>-->

    <swiper :options="swiperOption" ref="mySwiper" >
      <!-- slides -->
      <swiper-slide  v-for="item in bannerList" key="item.id">
        <img class="banner_img" v-bind:src="decodeURIComponent(item.imgUrl)" alt="">
      </swiper-slide>
      <!-- Optional controls -->
      <div class="swiper-pagination"  slot="pagination"></div>
      <!--<div class="swiper-button-prev" slot="button-prev"></div>
      <div class="swiper-button-next" slot="button-next"></div>-->
      <!--<div class="swiper-scrollbar"   slot="scrollbar"></div>-->
    </swiper>

  </div>
</template>

<script>
export default {
  name: 'my-swiper',
  props:['bannerList','test'],
  data () {
    return {
        swiperOption: {
          // NotNextTick is a component's own property, and if notNextTick is set to true, the component will not instantiate the swiper through NextTick, which means you can get the swiper object the first time (if you need to use the get swiper object to do what Things, then this property must be true)
          // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
          notNextTick: true,
          // swiper configs 所有的配置同swiper官方api配置
          autoplay: 3000,
          // direction : 'vertical',
          //effect:"coverflow",
          grabCursor : true,
          setWrapperSize :true,
          // autoHeight: true,
          // paginationType:"bullets",
          pagination : '.swiper-pagination',
          paginationClickable :true,
          //prevButton:'.swiper-button-prev',
          //nextButton:'.swiper-button-next',
          // scrollbar:'.swiper-scrollbar',
          mousewheelControl : false,
          observeParents:true,
          // if you need use plugins in the swiper, you can config in here like this
          // 如果自行设计了插件，那么插件的一些配置相关参数，也应该出现在这个对象中，如下debugger
          // debugger: true,
          // swiper callbacks
          // swiper的各种回调函数也可以出现在这个对象中，和swiper官方一样
          // onTransitionStart(swiper){
          //   console.log(swiper)
          // },
          // more Swiper configs and callbacks...
          // ...
        }
      }

  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper
    }
  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .banner_img{
    width:100%;
    height:auto;
  }
  .swiper-slide{
    overflow: hidden;
  }
</style>
