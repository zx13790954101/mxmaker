<template>
  <div class="server-center">
    <header>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="投诉建议" name="first"></el-tab-pane>
        <el-tab-pane label="我的提问" name="second"></el-tab-pane>
        <el-tab-pane label="BOM查询" name="third"></el-tab-pane>
        <el-tab-pane label="配件申请" name="fourth"></el-tab-pane>
      </el-tabs>
    </header>
    <!-- 页面轮换 -->
    <div class="swiper_box">
      <div class="my-swiper">
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide>
            <div class="page_box">
              <server-advice :PartList="PartList"></server-advice>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="page_box">
              <server-question></server-question>
            </div>
          </swiper-slide>
          <swiper-slide>
            <div class="page_box">
              <server-bom :PartList="PartList"></server-bom>
            </div>

          </swiper-slide>
          <swiper-slide>
            <div class="page_box">
              <!-- 申请列表 -->
              <transition name="animate-transition" enter-active-class="animated fadeIn"
                          leave-active-class="">
                <server-apply v-if="!applyAdd&&!applyDetail" @toAdd="applyAdd=!applyAdd" @toDetail="applyDetail=!applyDetail"></server-apply>
              </transition>

              <!-- 申请详情 -->
              <transition name="animate-transition" enter-active-class="animated fadeIn"
                          leave-active-class="">
                <server-apply-detail v-if="applyDetail" @toDetail="applyDetail=!applyDetail"></server-apply-detail>
              </transition>

              <!-- 添加申请 -->
              <transition name="animate-transition" enter-active-class="animated fadeIn"
                          leave-active-class="">
                <server-apply-add v-if="applyAdd" :PartList="PartList" @toAdd="applyAdd=!applyAdd"></server-apply-add>
              </transition>

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
  import ServerAdvice from './ServerAdvice.vue'
  import ServerQuestion from './ServerQuestion.vue'
  import ServerBom from './ServerBom.vue'
  import ServerApply from './ServerApply.vue'
  import ServerApplyAdd from './ServerApplyAdd.vue'
  import ServerApplyDetail from './ServerApplyDetail.vue'
  export default {
    name: 'server-center',
    components: {SwitchItem,ServerAdvice,ServerQuestion,ServerBom,ServerApply,ServerApplyAdd,ServerApplyDetail},
    data () {
      var userInfo=JSON.parse(sessionStorage.userInfo);
      return {
        applyAdd:false,
        applyDetail:false,
        params:{
          account:userInfo.name,
          password:userInfo.password,
          userId:userInfo.id,
        },
        activeName: 'first',
        curIndex: 0,
        PartList:[]
        //swiperHeight:0
      }
    },
    mounted: function () {
        var that=this;
      $('.page_box').height($(window).height()-65);
      //console.log('height',$(window).height()-65);
      $(window).resize(function(){
        //that.swiperHeight=$(window).height()-$('.swiper-slide').offset().top;
        //console.log(that.swiperHeight);
        $('.page_box').height($(window).height()-$('.swiper-slide').offset().top-5);
      });
      this.GetMaterialPartList();
      this.swiper.disableTouchControl();

    },
    methods: {
      handleClick(tab, event) {
        //console.log(tab, event);
      },
      setCurIndex(index){
        this.curIndex = index;
      },
      GetMaterialPartList(){
        var that=this;
        this.$http.get(globalPath+'/GetMaterialPartList',{params:that.params}).then(function (res) {
          console.log(res);
          that.PartList=res.body;
        })
      },
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
          //height:that.swiperHeight,
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

</style>
<style>
  .el-tabs__header {
    border: 0 !important;
  }

  .el-tabs__item:hover {
    color: #8391a5;
  }
  /*.swiper-slide{
    overflow-y: hidden;
    overflow-x: hidden;
  }*/
  .page_box{
    overflow: auto;
    overflow-x: hidden;
  }
</style>
