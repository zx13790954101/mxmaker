<template>
  <div class="renovation-detail-swiper">
    <header class="detail">
      <div class="toBack" @click="toBack">
        <i class="iconfont icon-guanbi"></i>
      </div>
      <div class="toEdit" @click="toEdit">
        <i class="iconfont icon-bianji"></i>
      </div>
    </header>
    <div>
      <swiper :options="swiperOption" ref="mySwiper" >
        <!-- slides -->
        <swiper-slide  v-for="item,index in list" key="index">
          <div class="swiper_con"  :style="{background:'url('+item.mainImg+')'}"></div>
        </swiper-slide>
        <!-- Optional controls -->
        <!--<div class="swiper-pagination"  slot="pagination"></div>-->
        <!--<div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>-->
        <!--<div class="swiper-scrollbar"   slot="scrollbar"></div>-->
      </swiper>
    </div>


  </div>
</template>

<script>
  import bus from '../assets/bus'
export default {
  name: 'renovation-detail-swiper',
  data () {
      var data=JSON.parse(sessionStorage.renovationData);
      var that=this;
    return {
        list:data.list,
      index:data.index,
      swiperOption: {
        // NotNextTick is a component's own property, and if notNextTick is set to true, the component will not instantiate the swiper through NextTick, which means you can get the swiper object the first time (if you need to use the get swiper object to do what Things, then this property must be true)
        // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
        notNextTick: true,
        // swiper configs 所有的配置同swiper官方api配置
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
        onTransitionStart(swiper){
          that.setCurIndex(swiper.activeIndex);
        },
        initialSlide:data.index,
      }
    }
  },
  methods:{
    toEdit(){
      var curGood = this.list[this.index];
      sessionStorage.setItem('renovation', JSON.stringify(curGood));
      bus.$emit('curPage','renovation-add');
    },
    toBack: function(){
      bus.$emit('curPage','main')
    },
    setCurIndex:function (index) {
      this.index=index;
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  header{
    background: none !important;
  }
  .toBack{
    cursor: pointer;
    height:60px;
    line-height:60px;
    padding:0 10px;
    display: inline-block;
  }
  .toBack:active{
    background: #222;
  }
  .toBack>.iconfont{
    padding-right:5px;
  }
  .toEdit{
    float: right;
    cursor: pointer;
    height:60px;
    line-height:60px;
    padding:0 10px;
    display: inline-block;
  }
  .toEdit:active{
    background: #222;
  }
  .toEdit>.iconfont{
    padding-right:5px;
  }
  .swiper_con{
    width:100%;
    height:100vh;
    background-position: center center !important;
    background-size:auto 100% !important;
    background-color: #42423c !important;
    background-repeat: no-repeat !important;
  }
</style>
