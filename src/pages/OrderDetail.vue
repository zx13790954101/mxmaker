<template>
    <div class="order-detail">
      <div class="header">
        <div class="toBack" @click="toBack">返回</div>
        <div class="center">订单详情</div>
      </div>

      <div class="main">
        <div class="center">购物清单</div>
        <div class="container-fuild">
          <div class="row">
            <div class="col-sm-4">
             <h4>智维   选灯宝</h4>
            </div>
            <div class="col-sm-4">
              <p>订单编号:   {{goodsList.code}}</p>
              <p>下单时间:   {{goodsList.createTime}}</p>
              <p>订单状态:   {{goodsList.statusCode}}</p>
            </div>
            <div class="col-sm-4">
              <p>客户姓名:  {{goodsList.taker}}</p>
              <p>联系方式:  {{goodsList.mobile}}</p>
              <p>客户地址:  {{goodsList.province=='0'? '':goodsList.province}}{{goodsList.city}}{{goodsList.area}}{{goodsList.address}}</p>
            </div>
          </div>
        </div>
        <div class="container-fuild slide">
          <div class="row">
            <div class="col-sm-3">商品图片</div>
            <div class="col-sm-3">物料编号</div>
            <div class="col-sm-2">数量</div>
            <div class="col-sm-2">单位(元)</div>
            <div class="col-sm-2">小计(元)</div>
          </div>
        </div>
        <div class="container-fuild slide2">

          <div class="row"  v-for="(item,index) in goodsList.goodList" :key="item.id">
            <div class="col-sm-3">
              <img  :src='item.thumb' height="100px">
            </div>
            <div class="col-sm-3"><p>{{item.goodId}}</p></div>
            <div class="col-sm-2"><p>{{item.number}}</p></div>
            <div class="col-sm-2"><p>{{item.goodMoney}}</p></div>
            <div class="col-sm-2"><p>{{item.goodMoney}}</p></div>
          </div>
        </div>
        <div class="right">
          <div>商品金额:￥{{goodsList.goodMoney}}</div>
          <div>优惠金额:￥{{goodsList.cheapMoney}}</div>
          <div>支付总金额:￥{{goodsList.orderMoney}}</div>
        </div>
      </div>
    </div>
</template>


<script>
  import bus from '../assets/bus'
    export default{
        name:'order-detail',
        data () {
            return {
              goodsList:'',
              goodsInfo:'',
              status:'',
            }
        },
      mounted:function () {
        var that=this;
        that.init();
      },
      methods:{
        init:function () {
          var that=this;
          this.goodsList=JSON.parse(sessionStorage.getItem('MyOrderItem'));
          sessionStorage.removeItem('MyOrderItem');
          that.goodsInfo=that.goodsList.goodList[0];
          if( parseInt( that.goodsInfo.status)==5){
            that.goodsInfo.statusCode='已取消'
          }else if( parseInt( that.goodsInfo.payStatus) == 2 || parseInt( that.goodsInfo.logStatus) == 3 || parseInt( that.goodsInfo.status) == 4 && parseInt( that.goodsInfo.status) != 5){
            that.goodsInfo.statusCode='已完成'
          }else  if( parseInt( that.goodsInfo.payStatus) == 0 && parseInt( that.goodsInfo.status) != 5){
            that.goodsInfo.statusCode='待付款'
          }else if( parseInt( that.goodsInfo.payStatus) ==1 && parseInt( that.goodsInfo.logStatus) ==0 && parseInt( that.goodsInfo.status) !=5 ){
            that.goodsInfo.statusCode='已付款'
          }else if ( parseInt( that.goodsInfo.payStatus) ==1 && parseInt( that.goodsInfo.logStatus) >0 && parseInt( that.goodsInfo.status) <4 ){
            that.goodsInfo.statusCode='已发货'
          }

        },
        toBack:function () {
          bus.$emit('curPage' , 'main');
        }
      }
    }
</script>

<style scoped>
  .header{
    background-color: #42423c;
    color: white;
    padding: 10px;
  }
  .header div{
    padding: 8px;
  }
  .main{
    padding: 10px;
  }
  .header .toBack{
    float: left;
  }
  .center{
    text-align: center;
  }
  .main .center{
    font-size: 25px;
    box-sizing: border-box;
    margin: 20px auto;
  }
  .slide {
    background-color: #d0d0d0;
    text-align: center;
    color: white;
    box-sizing: border-box;
    padding:15px 0px 15px 0px;
    margin-top:10px;
  }
  .main h4{
    text-align: center;
    color: #ffb04a;
    font-weight: bold;
    margin: 0 0;
    box-sizing: border-box;
  }
  .slide2{
    vertical-align: middle;
    text-align: center;
    border-bottom: 1px solid #cccccc;
  }
  .slide2 .row div{
    height: 100px;
  }
  .slide2 .row div p{
    margin: 0px;
    position: absolute;
    top: 50%;
    left:50%;
    transform: translate(-50%,-50%);
  }
  .right{
    line-height: 25px;
    margin-top: 20px;
    display: inline-block;
    float: right;
    text-align: right;
  }

  .right div{
    text-align: left;
  }
  .container-fuild .row div{
    line-height: 16px;
  }
  img {
    vertical-align: middle;
    box-sizing: border-box;
    padding: 20px;
  }
</style>
