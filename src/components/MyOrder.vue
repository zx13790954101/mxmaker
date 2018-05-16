<template>
  <div class="main">
    <div class="header">
      <switch-item :list="switchList" @curIndex="setCurIndex"></switch-item>
      <div class="search">
        <el-input placeholder="请输入" v-model="input"></el-input>
 <!--       <el-button @click="searchButton">搜索</el-button>-->
      </div>
    </div>
    <div class="container-fuild slide">
      <div class="row">
        <div class="col-sm-4">订单号</div>
        <div class="col-sm-4">订单金额</div>
        <div class="col-sm-4">操作</div>
      </div>
    </div>
    <div class="list">
      <ul>
        <li v-for="(item,index) in showList" :key="item.id">
          <div class="row">
            <div class="col-sm-4">
              <div class="order">{{item.code}}</div>
            </div>
            <div class="col-sm-4" :style="{ 'text-align' : 'center'}">￥{{item.goodMoney}}</div>
            <div class="col-sm-4" :style="{ 'text-align' : 'right','padding-right':'30px','font-size':'16px'}" @click="toOrderDetail(index)">查看详情 <span
              class="detail-icon"><i class="iconfont icon-fanhui"></i></span></div>
          </div>
          <div class="row">

            <div class="col-sm-6">
              <el-button :plain="true" :disabled="item.statusColor">{{item.statusCode}}</el-button>
              <span class="time">{{item.createTime}}</span></div>
            <div class="col-sm-6 buttom_array" :style="{ 'text-align' : 'right'}" :class="item.statusColor?'active':'disactive'">
              <el-button  @click="cancelOrder(index)">取消订单</el-button>
              <el-button @click="toPayPage(index)">去付款</el-button>
              <el-button @click="toPirint(item.id)">去打印</el-button>
            </div>

          </div>
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
  import bus from '../assets/bus'
  import SwitchItem from '../components/SwitchItem.vue'
  export default{
    name: 'my-order',
    components: {SwitchItem},
    data () {
      return {
        msg: '个人订单中的我的订单',
        goodsList: '',
        showList:'',
        switchList: [{
          id: 1,
          name: '全部订单'
        }, {
          id: 2,
          name: '待付款'
        }, {
          id: 3,
          name: '已付款'
        }, {
          id: 4,
          name: '已发货'
        }, {
          id: 5,
          name: '已完成'
        }, {
          id: 6,
          name: '已取消'
        }],
        curIndex: 0,
        input: '',
      }
    },
    mounted: function () {
      var that = this;
      that.init();
      /*        bus.$off(['switchItem']);
       setTimeout(function () {
       bus.$on('switchItem', function (page) {
       this.curIndex = page;});
       console.log('hello');
       },100);*/
    },
    methods: {
      setCurIndex(index){
        this.curIndex = index;
        this.init();
      },
      init: function () {
        //获取订单的详情
        var that = this;
        that.loading = true;
        var userInfo = JSON.parse(sessionStorage.userInfo);
        that.$http.get(globalPath + '/GetOrderList', {
          params: {
            userId: userInfo.id,
            account: userInfo.name,
            password: userInfo.password,
            pageIndex: 0,
            pageSize: 9999,
          }
        }).then(function (res) {
          var array2 = [];

          $(res.body).each(function (index, element) {
            element.goodMoney = element.goodMoney.toFixed(2);
            if (that.curIndex == 0) {
              if (parseInt(element.status) == 5) {
                element.statusColor = true;
                element.statusCode = '已取消'
              } else if (parseInt(element.payStatus) == 2 || parseInt(element.logStatus) == 3 || parseInt(element.status) == 4 && parseInt(element.status) != 5) {
                element.statusColor = true;
                element.statusCode = '已完成'
              } else if (parseInt(element.payStatus) == 0 && parseInt(element.status) != 5) {

                element.statusCode = '待付款'
              } else if (parseInt(element.payStatus) == 1 && parseInt(element.logStatus) == 0 && parseInt(element.status) != 5) {
                element.statusColor = true;
                element.statusCode = '已付款'
              } else if (parseInt(element.payStatus) == 1 && parseInt(element.logStatus) > 0 && parseInt(element.status) < 4) {
                element.statusColor = true;
                element.statusCode = '已发货'
              }
              array2.push(element);

            } else if (that.curIndex == 1) {
              if (parseInt(element.payStatus) == 0 && parseInt(element.status) != 5) {
                element.statusCode = '待付款';
                array2.push(element);
              }
            } else if (that.curIndex == 2) {
              if (parseInt(element.payStatus) == 1 && parseInt(element.logStatus) == 0 && parseInt(element.status) != 5) {
                element.statusColor = true;
                element.statusCode = '已付款';
                array2.push(element);
              }
            } else if (that.curIndex == 3) {
              if (parseInt(element.payStatus) == 1 && parseInt(element.logStatus) > 0 && parseInt(element.status) < 4) {
                element.statusColor = true;
                element.statusCode = '已发货';
                array2.push(element);
              }
            } else if (that.curIndex == 4) {
              if (parseInt(element.payStatus) == 2 || parseInt(element.logStatus) == 3 || parseInt(element.status) == 4 && parseInt(element.status) != 5) {
                element.statusColor = true;
                element.statusCode = '已完成';
                array2.push(element);
              }
            } else if (that.curIndex == 5) {
              if (parseInt(element.status) == 5) {
                element.statusColor = true;
                element.statusCode = '已取消';
                array2.push(element);
              }
            }
          });
          that.goodsList = array2;
          that.showList=array2;
        });

        var height_window = $(window).height() - $('.header').height() - $('.slide').height();
        $('.list').height(height_window - 140);
        $(window).resize(function () {
          var height_resize = $(window).height() - $('.header').height() - $('.slide').height();
          $('.list').height(height_resize - 140);
        });

      },
      //打印
      toPirint: function (index) {
           window.open(printPath+"/print/web.html?id="+index);
      },
      toOrderDetail: function (index) {
        sessionStorage.setItem('MyOrderItem', JSON.stringify(this.goodsList[index]));
        bus.$emit('curPage', 'order-detail');
      },
      toPayPage: function (index) {
        var that = this;
        that.goodsList[index].id
        var data = {
          id: that.goodsList[index].id,
          moneny: that.goodsList[index].goodMoney - that.goodsList[index].cheapMoney,
          statusCode: that.goodsList[index].statusCode
        }
        sessionStorage.setItem('payPage', JSON.stringify(data));

        bus.$emit('curPage', 'pay-page');
      },
      cancelOrder: function (index) {
        var that = this;
        var userInfo = JSON.parse(sessionStorage.userInfo);
        that.$http.get(globalPath + '/CancelOrder', {
          params: {
            orderId: that.goodsList[index].id,
          }
        }).then(function (res) {
          that.init();

        });
      },
      searchButton: function () {
        /*var that = this;
        var array = [];
        $(that.goodsList).each(function (index, element) {
          if (element.code.indexOf(that.input.toLowerCase()) >= 0) {
            array.push(element);

          }
        })
        that.goodsList = array;
        if (that.goodsList.length > 0) {
          that.init();
        }*/
      }
    },
    watch:{
      input(val){
        var that = this;
        var array = [];
        $(that.goodsList).each(function (index, element) {
          if (element.code.indexOf(that.input.toLowerCase()) >= 0) {
            array.push(element);

          }
        })
        that.showList = array;
        /*if (that.goodsList.length <=0) {
          that.init();
        }*/
      },
    }
  }
</script>
<style scoped>
  .my-header {
    color: #fff;
    position: fixed;
    top: 0;
    left: 117px;
    right: 0;
    height: 60px;
    z-index: 12;
    padding: 0 5px;
  }

  .header {
    margin: 10px auto;
    position: relative;
  }

  .left {
    float: left;
    height: 60px;
    line-height: 60px;

  }

  .right {
    float: right;
    height: 60px;
    line-height: 60px;
  }

  .list {
    overflow: auto;
    padding: 0 10px;
    margin-top: 15px;
  }

  .list ul li {
    background-color: #eaeaea;
    padding: 25px 30px 25px 20px;
    position: relative;
    box-sizing: border-box;
    margin: 10px auto;
  }

  .list ul li .row:nth-of-type(1) {
    padding: 0px 0px 15px 0px;
  }

  .list ul li .print {
    text-align: right;
  }

  .slide {
    background-color: #bdbcbc;
    text-align: center;
    color: white;
    box-sizing: border-box;
    padding: 8px;
  }

  .el-button {
    padding: 10px 50px 10px 50px;
  }

  .list span {
    margin: 0 15px;
    font-size: 14px;
  }

  .search {
    display: inline-block;
    position: absolute;
    right: 0px;
    top: 0px;
  }

  .search .el-button {
    border-radius: 0px;
    box-sizing: border-box;
    border-left: 0px;
  }

  .search .el-input {
    display: inline-block;
    width: 150px;
  }

  .el-input__inner {
    border-radius: 0px;
  }

  .el-button {
    padding: 10px 20px 10px 20px;
  }

  .detail-icon {
    position: absolute;
    margin: 0px 5px !important;
    transform: scaleX(-1);
    -webkit-transform: scaleX(-1);
  }

  .detail-icon .iconfont {

  }

  .active {
    display: none;
  }

  .disactive {

  }
  .buttom_array button:nth-of-type(1) {
    background: #bdbcbc;
    color: white;
  }
  .buttom_array button:nth-of-type(2) {
    background: #ffa538;
    color: white;
    border: 1px solid #ffa538;
  }

  .iconfont {
    font-size: 15px;
    line-height: 25px;
  }
</style>
<style>
  .el-input__inner {
    border-radius: 0px;
    border: 1px solid #c4c4c4;
  }
</style>
