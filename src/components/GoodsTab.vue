<template>
  <!-- 首页商品列表 -->
  <div class="goods-tab">
    <switch-item :list="switchList" @curIndex="setCurIndex"></switch-item>
    <div class="row good_list">
      <div class=" col-xs-4 col-sm-3 col-md-2 col-lg-2 col_reset"   v-for="(item,index) in goodsList" :key="item.id" v-on:click="setCurGood(index)">
        <!--<img :src="decodeURIComponent(item.thumbImage)" class="goodImg" alt="">-->
        <good-img :url="item.thumbImage" :noStock="item.number==0?true:false"></good-img>
      </div>
      <p class="no_data" v-if="goodsList.length==0">暂无数据</p>
    </div>

  </div>
</template>

<script>
  import GoodImg from './GoodImg.vue'
  import bus from '../assets/bus'
  import SwitchItem from './SwitchItem.vue'
  export default {
    name: 'goods-tab',
    components:{GoodImg,SwitchItem},
    data () {
      return {
        switchList:[{
          id:1,
          name:'推荐商品'
        },{
          id:2,
          name:'新品商品'
        },{
          id:3,
          name:'热销商品'
        },{
          id:4,
          name:'促销商品'
        },],
        goodsList:[]
      }
    },
    created:function(){

    },
    mounted:function(){
      this.goodsList=JSON.parse(localStorage.collection);
    },
    methods: {
      setCurGood:function(index){
        var curGood=this.goodsList[index];
        sessionStorage.setItem('curGood',JSON.stringify(curGood));
        bus.$emit('curPage', 'good-detail');
      },
      setCurIndex(index){
        this.goodsList=[];
          switch (index){
            case 0:
              this.goodsList=JSON.parse(localStorage.collection);
                break;
            case 1:
                this.getGoodsByNew();
                break;
            case 2:
                this.getGoodsByHot();
                break;
            case 3:
                this.getGoodsByCheap();
                break;

          }
      },
      getGoodsByCheap:function(){
        var that = this;
        this.$http.get(globalPath+'/GetGoodsByCheap', {
          params: {
            userId: sessionStorage.userId || 0
          }
        }).then(function (res) {
          console.log(res);
          if (typeof(res.body) != 'object') {
            this.$message.error('请求出错');
            return;
          }
          that.goodsList = res.body;
        });
      },
      getGoodsByHot:function(){
        var that = this;
        this.$http.get(globalPath+'/GetGoodsByHot', {
          params: {
            userId: sessionStorage.userId || 0
          }
        }).then(function (res) {
          console.log(res);
          if (typeof(res.body) != 'object') {
            this.$message.error('请求出错');
            return;
          }
          that.goodsList = res.body;
        });
      },
      getGoodsByNew: function () {
        var that = this;
        this.$http.get(globalPath+'/GetGoodsByNew', {
          params: {
            userId: sessionStorage.userId || 0
          }
        }).then(function (res) {
          console.log(res);
          if (typeof(res.body) != 'object') {
            this.$message.error('请求出错');
            return;
          }
          that.goodsList = res.body;
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .goodImg{
    width:100%;
  }
  .swiper-pagination-bullet-active{
    background: #ffa538;
  }
  .el-tabs__item.is-active{
    color: #ffa538 !important;
  }
  .row{
    padding:0 5px;
  }
  .col_reset{
    padding:10px;
  }
</style>
<style>
  .swiper-pagination-bullet-active{
    background: #ffa538 !important;
  }
  .el-tabs__item.is-active{
    color: #ffa538 !important;
  }
  .el-tabs__active-bar{
    background-color: #ffa538 !important;
  }
  .row.good_list{
    padding-top:10px;
  }
</style>
