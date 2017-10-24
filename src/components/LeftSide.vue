<template>
  <!-- 左侧菜单栏 -->
  <div class="left-side">
    <ul>
      <li class="menu_item" v-for="(item,index) in list" v-on:click="switchMenu(index)" v-bind:class="{active:(curMenuItem==index)}">
        <img class="menu_item_icon" v-bind:src="item.icon" alt=""><span class="menu_item_word">{{item.word}}</span>
      </li>
      <div class="shopping_car_box" @click="showCart">
        <div class="shopping_car">
          <div class="shopcart_num" v-if="shopcartNum>0">{{shopcartNum}}</div>
          <i class="iconfont icon-gouwuche"></i>
        </div>
      </div>
    </ul>
  </div>
</template>
<script>
  import bus from '../assets/bus'
export default {
  name: 'left-side',
  data () {
    return {
        shopcartNum:0,
        curMenuItem:'',
      list:[
        {
          icon:'static/images/light-store/Maintabaricon/home_highlight@2x.png',
          word:'店铺首页'
        },
        {
          icon:'static/images/light-store/Maintabaricon/view.png',
          word:'全景逛店'
        },
        {
          icon:'static/images/light-store/Maintabaricon/product_icon_highlight@2x.png',
          word:'产品中心'
        },
        {
          icon:'static/images/light-store/Maintabaricon/peideng_highlight@2x.png',
          word:'场景配灯'
        },
        {
          icon:'static/images/light-store/Maintabaricon/plan_highlight@2x.png',
          word:'我的方案'
        },
        {
          icon:'static/images/light-store/Maintabaricon/case_highlight@2x.png',
          word:'邻居装修'
        },
        {
          icon:'static/images/light-store/Maintabaricon/service_center_highlight@2x.png',
          word:'服务中心'
        },
        {
          icon:'static/images/light-store/Maintabaricon/my_center_highlight@2x.png',
          word:'个人中心'
        },
      ]
    }
  },
  mounted:function(){
      var that=this;
    bus.$on('curIndex',function(index){
      that.curMenuItem=index;
    });
    var num=JSON.parse(localStorage.getItem("addShopcart_Array"));
    that.shopcartNum=num.length;
    bus.$on('shopcartNum',function(num){
      that.shopcartNum=num;
    });

  },
  methods:{
      showCart:function(){
        this.$emit('showCart','shopping-cart');
      },
      switchMenu:function(index){
          this.curMenuItem=index;
          bus.curIndex=index;
          this.$emit('menuIndex',index);
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  ul{
    position: fixed;
    left:0;
    top:0;
    bottom:0;
    background: #42423c;
    margin:0;
    list-style: none;
    padding:0;
    z-index: 20;
  }
  li{
    cursor: pointer;
    padding:0 20px;
    line-height: 60px;
    hegiht:60px;
  }
  li.active{
    background:#222;
  }
.menu_item_word{
  color:#ffa538;
  font-size:1.2rem;
  display: inline-block;
  vertical-align: middle;
  padding-left: 10px;
}
.menu_item_icon{
  height:1.6rem;
  display: inline-block;
  vertical-align: middle;
}
  .shopping_car_box{
    position: absolute;
    bottom:20px;
    width:100%;
    text-align: center;
    cursor: pointer;
  }
  .shopping_car{
    display: inline-block;
    margin:0 auto;
    width:6rem;
    height:6rem;
    line-height:6rem;
    color: #ffa538;
    background: #222;
    -webkit-border-radius:50%;
    -moz-border-radius:50%;
    border-radius:50%;
  }
  .shopping_car>.iconfont{
    font-size: 2.4rem;
  }
  .shopcart_num{

    position: absolute;
    display: inline-block;
    width: 20px;
    height: 20px;
    right: 20px;
    top:5px;
    background-color: #ffa538;
    background-position: 50% 50%;
    line-height: 20px;
    border: 1px solid rgba(255, 255, 255, 0);
    border-radius: 50%;
    color: white;
  }
</style>
