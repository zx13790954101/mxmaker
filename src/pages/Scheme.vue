<template>
  <div class="scheme">
    <header>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="精选方案" name="first"></el-tab-pane>
        <el-tab-pane label="我的方案" name="second"></el-tab-pane>
        <el-tab-pane label="备忘录" name="third"></el-tab-pane>
      </el-tabs>
      <div class="btn_box" @click="toSchemeAdd" v-if="curIndex==1">
        <btn-icon text="添加方案" icon="icon-tianjia" ></btn-icon>
      </div>
      <div class="search_box" @click="" v-if="curIndex==2">
        <el-input
          placeholder="搜索"
          icon="search"
          v-model="search"
          :on-icon-click="handleIconClick">
        </el-input>
      </div>
    </header>
    <!-- 页面轮换 -->
    <div class="swiper_box">
      <div class="my-swiper">
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide>
            <div class="page_box">
              <scheme-elite></scheme-elite>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="page_box" v-if="isShow">
              <scheme-mine ></scheme-mine>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="page_box" v-if="isShow">
              <scheme-remark :searchWord="search" ></scheme-remark>
            </div>
          </swiper-slide>

          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>

    </div>
  </div>
</template>

<script>
  import bus from '../assets/bus'
  import SwitchItem from '../components/SwitchItem.vue'
  import SchemeElite from '../pages/SchemeElite.vue'
  import SchemeMine from '../pages/SchemeMine.vue'
  import SchemeRemark from '../pages/SchemeRemark.vue'
  import BtnIcon from '../components/BtnIcon.vue'
  export default {
    name: 'scheme',
    components: {SwitchItem,SchemeElite,BtnIcon,SchemeMine,SchemeRemark},
    data () {
      return {
        search:'',
        isShow:true,
        activeName: 'first',
        curIndex: 0,
        /*userpage:'customer-manage'*/
      }
    },
    mounted: function () {
      var that=this;
      $('.page_box').height($(window).height()-65);
      $(window).resize(function(){

        if(!$('.page_box').offset().top){
            $(window).off('resize');
        }
        $('.page_box').height($(window).height()-$('.page_box').offset().top-5);

      });

      bus.$on('curPage',function (page) {
        if(page=='main'){
            that.isShow=false;
            setTimeout(function () {
              that.isShow=true;
            },250);
        }
      });
    },
    methods: {
      handleIconClick(){
        console.log('hello');
      },
      handleClick(tab, event) {
        //console.log(tab, event);
      },
      setCurIndex(index){
        this.curIndex = index;
      },
      toSchemeAdd(){
          var data={
              charge:0,
            house:'',
            id:0,
            imgList:[],
            mainDetail:'',
            mainImg:'',
            mianji:'',
            planInfoList:[],
            style:''
          }
        sessionStorage.setItem('curSite', JSON.stringify(data));
        bus.$emit('curPage', 'scheme-edit')

      }
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      },
      swiperOption(){
          var that=this;
        return {
          // NotNextTick is a component's own property, and if notNextTick is set to true, the component will not instantiate the swiper through NextTick, which means you can get the swiper object the first time (if you need to use the get swiper object to do what Things, then this property must be true)
          // notNextTick是一个组件自有属性，如果notNextTick设置为true，组件则不会通过NextTick来实例化swiper，也就意味着你可以在第一时间获取到swiper对象，假如你需要刚加载遍使用获取swiper对象来做什么事，那么这个属性一定要是true
          notNextTick: true,
          // swiper configs 所有的配置同swiper官方api配置
          // direction : 'vertical',
          grabCursor: true,
          setWrapperSize: true,
          // autoHeight: true,
          // paginationType:"bullets",
          mousewheelControl: false,
          observeParents: true,
          observer: true,
          autoHeight: true,
          initialSlide :that.curIndex,
          // if you need use plugins in the swiper, you can config in here like this
          // 如果自行设计了插件，那么插件的一些配置相关参数，也应该出现在这个对象中，如下debugger
          // debugger: true,
          // swiper callbacks
          // swiper的各种回调函数也可以出现在这个对象中，和swiper官方一样
          onTransitionStart(swiper){
            that.setCurIndex(swiper.activeIndex);
          },
          // more Swiper configs and callbacks...
          // ...
        }
      }
    },
    watch: {
      curIndex(){
        switch (this.curIndex) {
          case 0:
            this.activeName = 'first';
            break;
          case 1:
            this.activeName = 'second';
            break;
          case 2:
            this.activeName = 'third';
            break;
          case 3:
            this.activeName = 'fourth';
            break;
            case 4:
            this.activeName = 'fifth';
            break;
        }
      },
      activeName(){
          if(this.activeName=='first'){
              this.curIndex=0;
          }else if(this.activeName=='second'){
            this.curIndex=1;
          }else if(this.activeName=='third'){
            this.curIndex=2;
          }else if(this.activeName=='fourth'){
            this.curIndex=3;
          }else if(this.activeName=='fifth'){
            this.curIndex=4;
          }
          this.swiper.slideTo(this.curIndex, 300, false);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  header {
    padding-left: 117px;
  }
  .btn_box{
    position: absolute;
    right:0;
    top:0;
  }
  .search_box{
    position: absolute;
    right:10px;
    top:0;
  }
</style>
<style>
  .el-tabs__header {
    border: 0 !important;
  }

  .el-tabs__item:hover {
    color: #8391a5;
  }
  .swiper-slide{
    overflow: hidden;
  }
  .page_box{
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
