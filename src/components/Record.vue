<template>
  <div class="main">
    <div class="list">
      <ul class="collection">
        <li v-for="(item,index) in goodsList" :key="item.addressId">
          <div class="container-fluid">
            <div class="col-sm-2" >
              <img :src="item.mainImage" :style="{ 'height' : '80px' }">
            </div>
            <div class="col-sm-7" >
              {{item.goodName}}
              <div>￥{{item.goodMoney}}</div>
            </div>
            <div class="col-sm-3">
              {{item.time}}
              <el-button  :style="{ 'text-align' : 'left'}"  @click="toGoodDeatil(index)">查看详情</el-button>
            </div>
          </div>

        </li>
      </ul>
    </div>
  </div>
</template>


<script>
  import bus from '../assets/bus'
  export default{
    name: 'record',
    data () {
      return {
        goodsList:'',}
    },
    mounted: function () {
      var that=this;
      that.goodsList=JSON.parse(localStorage.getItem('record'));
      var height_window = $(window).height();
      $('.list').height(height_window-80);
      $(window).resize(function () {
        var height_window = $(window).height()
        $('.list').height(height_window-80);
      });
    },
    methods: {
      toGoodDeatil: function(index){
        var that=this;
        sessionStorage.setItem('curGood', JSON.stringify(that.goodsList[index]));
        bus.$emit('curPage', 'good-detail');
      }
    }
  }
</script>

<style scoped>
  .collection li{
    background: #ececec;
    padding: 10px;
    margin: 10px auto;
  }
  .list{
    overflow: auto;
  }
  .list li img{
    position: relative;
    left: 50%;
    -webkit-transform: translateX(-50%);
  }
  .list li .col-sm-8{
    transform: translateY(20%);
  }
  .list li .col-sm-2{
    height: 80px;
  }


</style>
