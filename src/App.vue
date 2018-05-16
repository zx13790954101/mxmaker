<template>
  <div id="app">
    <!-- 登录页面 -->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <login v-if="curPage=='login'" v-on:listenLogin="setLogin"></login>
    </transition>
    <!-- 主页面 -->
    <transition name="animate-transition" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div v-show="curPage=='main'" v-if="curPage!='login'" class="mian_con">
        <header></header>
        <!-- 侧边栏 -->
        <left-side v-on:menuIndex="listenIndex" @showCart="showCart"></left-side>
        <!-- 店铺首页 -->
        <transition name="animate-transition" enter-active-class="animated fadeIn" leave-active-class="">
          <home v-if="curIndex==0"></home>
        </transition>
        <!-- 全景逛店 -->
        <transition name="animate-transition" enter-active-class="animated fadeIn" leave-active-class="">
          <whole-scene v-if="curIndex==1"></whole-scene>
        </transition>
        <!-- 产品中心 -->
        <transition name="animate-transition" enter-active-class="animated fadeIn" leave-active-class="">
          <store-center v-if="curIndex==2"></store-center>
        </transition>
        <!-- 场景配灯 -->
        <transition name="animate-transition" enter-active-class="animated fadeIn" leave-active-class="">
          <scence v-if="curIndex==3"></scence>
        </transition>
        <!-- 我的方案 -->
        <transition name="animate-transition" enter-active-class="animated fadeIn" leave-active-class="">
          <scheme v-if="curIndex==4"></scheme>
        </transition>
        <!-- 邻居装修 -->
        <transition name="animate-transition" enter-active-class="animated fadeIn" leave-active-class="">
          <renovation v-if="curIndex==5"></renovation>
        </transition>
        <!--  品牌中心
         <transition name="animate-transition" enter-active-class="animated fadeIn" leave-active-class="">
           <brand-center v-if="curIndex==5"></brand-center>
         </transition>-->
        <!-- 服务中心 -->
        <transition name="animate-transition" enter-active-class="animated fadeIn" leave-active-class="">
          <server-center v-if="curIndex==6"></server-center>
        </transition>
        <!-- 个人中心 -->
        <transition name="animate-transition" enter-active-class="animated fadeIn" leave-active-class="">
          <user-center v-if="curIndex==7" v-on:listenLogin="setLogin" :curPage="curPage"></user-center>
        </transition>
        <!--<p>登陆状态{{isLogin}}</p>
        <p>当前菜单{{curIndex}}</p>-->
        <!--<test></test>-->
      </div>
    </transition>

    <!-- 商品详情 -->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <good-detail v-if="curPage=='good-detail'"></good-detail>
    </transition>

    <!-- 邻居装修詳情頁 -->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <renovation-detail-swiper v-if="curPage=='renovation-detail'"></renovation-detail-swiper>
    </transition>

    <!-- 图片详情 -->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <img-detail v-if="curPage=='img-detail'"></img-detail>
    </transition>

    <!-- 购物车 -->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <shopping-cart v-if="curPage=='shopping-cart'" @toBack="setCurPage"></shopping-cart>
    </transition>
    <!--  -->
    <!-- 订单详情 -->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <submit-order v-if="curPage=='submit-order'" @toBack="setCurPage"></submit-order>
    </transition>
    <!--  -->

    <!-- 订单详情 -->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <submit-customer v-if="curPage=='submit-customer'" @toBack="setCurPage"></submit-customer>
    </transition>
    <!--  -->

    <!-- 订单支付-->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <pay-page v-if="curPage=='pay-page'" @toBack="setCurPage"></pay-page>
    </transition>
    <!--  -->

    <!-- 我的订单的订单详情 -->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <order-detail v-if="curPage=='order-detail'" @toBack="setCurPage"></order-detail>
    </transition>
    <!--  -->


    <!-- 模拟配灯 -->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <simulate v-if="curPage=='simulate'" @toBack="setCurPage"></Simulate>
    </transition>
    <!--  -->

    <!-- 备忘录返回配灯 -->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <simulate-re v-if="curPage=='simulate-re'" @toBack="setCurPage"></simulate-re>
    </transition>
    <!--  -->

    <!-- 编辑地址 -->
    <transition name="animate-transition" enter-active-class="animated fadeIn" leave-active-class="">
      <edit-address v-if="curPage=='edit-address'"></edit-address>
    </transition>
    <!--  -->
    <!-- 方案添加 -->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <scheme-add v-if="curPage=='scheme-add'"></scheme-add>
    </transition>
    <!--  -->

    <!-- 方案编辑 -->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <scheme-edit v-if="curPage=='scheme-edit'"></scheme-edit>
    </transition>
    <!--  -->

    <!-- 方案展示 -->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <scheme-show v-if="curPage=='scheme-show'"></scheme-show>
    </transition>
    <!--  -->

    <!-- 装修方案添加 -->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <renovation-add v-if="curPage=='renovation-add'"></renovation-add>
    </transition>
    <!--  -->

    <!-- 方案备注 -->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <remark-add v-if="curPage=='remark-add'"></remark-add>
    </transition>
    <!--  -->

    <!-- 方案备注 -->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
      <remark-show v-if="curPage=='remark-show'"></remark-show>
    </transition>
    <!--  -->



  </div>
</template>

<script>
  import Hello from './components/Hello'
  import Login from './pages/Login.vue'
  import LeftSide from './components/LeftSide.vue'
  import Home from './pages/Home.vue'
  import MySwiper from './components/MySwiper.vue'
  import Personal from './pages/Personal.vue'
  import Test from './components/Test.vue'
  import GoodDetail from './pages/GoodDetail.vue'
  import StoreCenter from './pages/StoreCenter.vue'
  import ShoppingCart from './pages/ShoppingCart.vue'
  import Scence from './pages/Scence.vue'
  import Simulate from './pages/Simulate.vue'
  import SimulateRe from './pages/SimulateRe.vue'
  import Renovation from './pages/Renovation.vue'
  import RenovationDetail from './pages/RenovationDetail.vue'
  import RenovationDetailSwiper from './pages/RenovationDetailSwiper.vue'
  import ServerCenter from './pages/ServerCenter.vue'
  import UserCenter from './pages/UserCenter.vue'
  import BrandCenter from './pages/BrandCenter.vue'
  import WholeScene from './pages/WholeScene.vue'
  import ImgDetail from './components/ImgDetail.vue'
  import EditAddress from './components/EditAddress.vue'
  import SubmitOrder from './pages/SubmitOrder.vue'
  import SubmitCustomer from './pages/SubmitCustomer.vue'
  import Scheme from './pages/Scheme.vue'
  import SchemeEdit from './pages/SchemeEdit.vue'
  import SchemeShow from './pages/SchemeShow.vue'
  import SchemeAdd from './pages/SchemeAdd.vue'
  import PayPage from './pages/PayPage.vue'

  import RenovationAdd from './pages/RenovationAdd.vue'

  import OrderDetail from './pages/OrderDetail.vue'
  import RemarkAdd from './pages/RemarkAdd.vue'
  import RemarkShow from './pages/RemarkShow.vue'

  import bus from './assets/bus'

  export default {
    name: 'app',
    components: {
      Hello,
      Login,
      LeftSide,
      Home,
      MySwiper,
      Personal,
      Test,
      GoodDetail,
      StoreCenter,
      ShoppingCart,
      Scence,
      Simulate,
      SimulateRe,
      Renovation,
      RenovationDetail,
      RenovationDetailSwiper,
      ServerCenter,
      UserCenter,
      BrandCenter,
      WholeScene,
      ImgDetail,
      EditAddress,
      SubmitOrder,
      SubmitCustomer,
      Scheme,
      SchemeAdd,
      SchemeShow,
      SchemeEdit,
      PayPage,
      RenovationAdd,
      RemarkAdd,
      OrderDetail,
      RemarkShow
    },
    data(){
      return {
        isShow: false,
        isLogin: true,
        curIndex: 0,
        curPage: 'main',
        curCon: 'home'
      }
    },
    created: function () {

    },
    mounted: function () {
      var that = this;
      $('body,html').css('font-family', 'Microsoft YaHei');
      if (!sessionStorage.userId) {
        this.curPage = 'login';
      }
      bus.$on('curPage', function (page) {
        $(window).off('scroll resize');
        that.curPage = page;
        /*that.$notify.info({
         title: '提示',
         message: '切换为' + page,
         });*/
      });
      bus.$on('curIndex', function (page) {
        $(window).off('scroll resize');
        that.curIndex = page;
      });
      //console.log('全局变量',wholeArgs.path);
    },
    methods: {
      showCart: function () {
        this.curPage = 'shopping-cart'
      },
      setCurPage: function (page) {
        $(window).off('scroll');
        this.curPage = page;
      },
      setLogin: function (boo) {
        this.isLogin = boo;
        if (boo) {
          this.curPage = 'main'
        } else {
          this.curPage = 'login'
        }
      },
      listenIndex: function (index) {
        $(window).off('scroll');
        this.curIndex = index;
      }
    },
    watch:{
        curPage(val){
          if(val=='main'){
            console.log('deleteGood');
            sessionStorage.removeItem('curGood');
          }
        }
    }
  }
</script>

<style>
  html, body {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  .mian_con {
    position: absolute;
    top: 65px;;
    left: 122px;;
    bottom: 0px;
    right: 5px;
    z-index: 1;

  }

  header {
    background: #42423c;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 61px;
    z-index: 10;
    line-height: 60px;
    color: #ffa538;
  }

  .no_data {
    text-align: center;
    color: #999;
    padding-top:10px;
  }

  ul, li {
    list-style: none;
    padding: 0;
    margin: 0;
  }



  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #ffa538 !important;
    border-color: #ffa538 !important;
  }
  .el-checkbox__inner:hover {
    border-color: #ffa538;
  }
  .el-input__inner:hover {
    border-color: #ffa538;
  }
  .el-textarea__inner:focus {
    outline: 0;
    border-color: #ffa538;
  }

</style>
