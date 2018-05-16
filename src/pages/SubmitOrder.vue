<template>
  <div class="shopping-cart">
    <header>
      <div class="toBack" @click="toBack">
        <i class="iconfont icon-fanhui"></i><span>返回主页</span>
      </div>
      <div class="center">确认订单</div>
    </header>
    <div class="main">
      <div class="address">
        <div class="top"> 收货地址</div>
        <div class="address_main" v-if="addressTip!='暂无设置的默认地址'">
          <span class="left_taker">名字：{{addressInfo.taker}} 地址：{{addressInfo.province}}{{addressInfo.city}}{{addressInfo.area}}{{addressInfo.address}}</span>
          <span class="center_mobile">电话：{{addressInfo.mobile}}</span>
        </div>
        <div class="address_main" v-if="addressTip=='暂无设置的默认地址'">
          <span class="left_taker">{{addressTip}}</span>
        </div>
        <div class="right_icon" @click="toSelectAddress"><i class="iconfont icon-fanhui"></i></div>
      </div>
      <ul>
        <li v-for="(item,index) in goodList" :key="item.id">
          <div>
            <div class="left" id="goodList">
              <div style="width: 70px;">
                <good-img :url="item.thumbImage"></good-img>
              </div>
              <p class="list-name">{{item.goodName}}</p>
            </div>
            <div class="right">
              <p>￥：{{item.goodMoney*item.goodNumer}} </p>

              <p>X{{item.goodNumer}}</p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <footer>
      <div class="left">
        <span>总计<p> ￥{{totalPrice2}}</p></span>
      </div>
      <div class="right" @click="tosumbit">
        <span>折扣<input type="text" value="" id="discount">
          <!--<el-input v-model="discountMoneny" placeholder=""  ></el-input>--></span>
        <span>优惠金额<input type="text" value="" id="reduce">
          <!--<el-input v-model="reduceMoneny" placeholder="请输入优惠金额"></el-input>--></span>
        <el-button @click="toPayPage">提交订单</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
  import bus from '../assets/bus'
  import GoodImg from '../components/GoodImg.vue'
  export default {
    name: 'submit-order',
    components: {GoodImg},
    data () {
      return {
        goodList: [],
        checked: [],
        checkedList: [],
        selectItem: 0,
        Total: 0,
        totalPrice2: 0,
        addressInfo: '',
        addressTip: '',
        selectAddress: '',
        reduceMoneny: 0,
        discountMoneny: 0,
      }
    },
    mounted: function () {
      this.init();
      var that = this;
      $("#discount").keyup(function () {
        console.log('优惠的折扣', $(this).val());
          if(!$(this).val()) return;

        var value = parseFloat($(this).val()).toFixed(2);
     /*   $("#discount").val(value);*/
        var num = that.totalPrice2 * (1 - (value <= 0 ? 10 : value) / 10);

        if (value > 10) {
          $(this).val(0);
        }

        $("#reduce").val(num.toFixed(0));
        that.reduceMoneny=num.toFixed(2);
        if ($("#discount").val() == 0) {
          $("#reduce").val(0);
          that.reduceMoneny=0;
        }

        //that.reduceMoneny = $("#reduce").val();

      });


      $("#reduce").keyup(function () {

        console.log('优惠的价格', $(this).val());
        var num = (1 - ($(this).val() / that.totalPrice2)) * 10;
        $("#discount").val(num.toFixed(2));
        that.reduceMoneny=num.toFixed(2);
        if ($("#reduce").val() == 0) {
          $("#discount").val(0);
        }
        //that.reduceMoneny = $("#reduce").val();
      });
    },
    watch: {
      reduceMoneny(val){
        var that = this;
        if (val > 0) {
          that.discountMoneny = that.totalPrice2 * (1 - (that.reduceMoneny / that.totalPrice2));
        }
      },
      discountMoneny(val){
        var that = this;
        if (val > 0) {
          that.reduceMoneny = that.totalPrice2 * (1 - (that.discountMoneny <= 0 ? 10 : that.discountMoneny) / 10);
        }
      }
    },
    computed: {
      totalPrice: function () {
        var that = this;
        var totalPrice = 0;
        $(that.goodList).each(function (index, element) {
          var id = element.id;
          $(that.checkedList).each(function (index, element2) {
            if (element2.id == id) {
              totalPrice += element.goodNumer * element.goodMoney;
            }
          });
        });
        return totalPrice;
      },

    },
    methods: {
      toBack: function () {
        this.$emit('toBack', 'main')
      },
      handleChange(id) {
      },
      init: function () {
        var that = this;
        that.goodList = (JSON.parse(localStorage.getItem("order_Array"))).body;
        that.totalPrice2 = (JSON.parse(localStorage.getItem("order_Array"))).price;
        console.log('goodssslist', JSON.parse(localStorage.getItem("order_Array")));
        var userInfo = JSON.parse(sessionStorage.userInfo);
        //console.log(JSON.parse(decodeURIComponent(sessionStorage.userInfo.replace(/%0a|%0d/ig,''))));
        that.$http.get(globalPath + '/GetAddressList', {
          params: {
            userId: userInfo.id,
            account: userInfo.name,
            password: userInfo.password
          }
        }).then(function (res) {
          if (typeof(res.body) != 'object') {
            that.addressTip = '暂无设置的默认地址';
          } else {
            that.goodsList = res.body;
            $(that.goodsList).each(function (index, element) {
              if (element.isDefault == 'Y') {
                that.addressInfo = element;
              }
            });
            if (localStorage.selectAddress) {
              that.addressInfo = JSON.parse(localStorage.selectAddress);
            }
            localStorage.removeItem('selectAddress');
            if (that.addressInfo.province == '0') {
              that.addressInfo.province = '';
            }
          }
        });
        $(window).resize(function () {
          var height = $('footer').offset().top - $('.main').offset().top;
          $('.main').height(height);
        });

        var height = $('footer').offset().top - $('.main').offset().top;
        $('.main').height(height);
      },
      toSelectAddress: function () {
        bus.$emit('curPage', 'submit-customer');
      },
      tosumbit: function () {

      },
      toPayPage: function () {
        var that = this;
        var userInfo = JSON.parse(sessionStorage.userInfo);

        var goodList2 = [];
        $(that.goodList).each(function (index, element) {
          var data = {
            "number": element.goodNumer,
            "goodId": element.id,
            "detail": "",
            "id": 0,
            "thumb": encodeURIComponent(element.thumbImage),
            "goodMoney": element.goodMoney,
            "propertyId": 0

          };
          goodList2.push(data);
        })

        that.$http.get(globalPath + '/ManageOrder', {
          params: {
            opt: 0,
            userId: userInfo.id,
            account: userInfo.name,
            password: userInfo.password,
            id: 0,
            code: 0,
            createTime: 0,
            payTime: 0,
            sendTime: 0,
            backTime: 0,
            orderMoney: (that.totalPrice2 - $("#reduce").val()),
            goodMoney: that.totalPrice2,
            fasterMoney: 0,
            cheapMoney: $("#reduce").val(),
            taker: encodeURIComponent(that.addressInfo.taker),
            mobile: that.addressInfo.mobile,
            tel: 0,
            post: 0,
            payType: encodeURIComponent('zhuangzhang'),
            country: 0,
            province: encodeURIComponent(that.addressInfo.province) || 0,
            city: encodeURIComponent(that.addressInfo.city),
            area: encodeURIComponent(that.addressInfo.area),
            street: 0,
            address: encodeURIComponent(that.addressInfo.address),
            message: 0,
            invoice: 0,
            fastCompany: 0,
            fastCode: 0,
            payStatus: 0,
            logStatus: 0,
            status: 0,
            remark: 0,
            goodList: JSON.stringify(goodList2)
          }
        }).then(function (res) {
          if (res => 0) {
            that.goodsList = res;
            var data = {
              id: res.body,
              moneny: (that.totalPrice2 - $("#reduce").val())
            }
            sessionStorage.setItem('payPage', JSON.stringify(data));
            sessionStorage.removeItem('selectAddress');
            localStorage.removeItem('order_Array');
            bus.$emit('curPage', 'pay-page');
          } else {
            that.$message.error('提交失败');
          }

        });
      }


    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .shopping-cart {
    position: fixed;
    z-index: 20;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  input {
    margin: 0 10px;

  }

  .good-img {

  }

  .toBack {
    cursor: pointer;
    height: 60px;
    line-height: 60px;
    padding: 0 10px;
    display: inline-block;
  }

  .toBack:active {
    background: #222;
  }

  .toBack > .iconfont {
    padding-right: 5px;
  }

  header .center {
    text-align: center;
    margin: 0 auto;
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
    -webkit-transform: translateX(-50%);

  }

  .main {
    margin-top: 60px;
    overflow: auto;
  }

  ul {
    padding: 0px;
  }

  .main ul li {
    list-style-type: none;
    height: auto;
    vertical-align: middle;
    box-sizing: border-box;
    padding: 15px 5px 15px 5px;
    /* margin: 15px auto; */
    background-color: #f5f5f5;
    border-bottom: 1px solid #e6e6e6;
  }

  .main ul li > div:first-child {
    /* position: relative;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%); */
  }

  .left {
    display: inline-block;
    width: 60%;
    box-sizing: border-box;
    padding-left: 25px;
  }

  .left > div:first-child {
    width: 60px;
    height: 60px;
    position: relative;
    display: inline-block;
  }

  .right {
    display: inline-block;
    width: 39%;
    vertical-align: middle;
    text-align: right;
    box-sizing: border-box;
    padding-right: 25px;
  }

  .right .el-input {
    width: 150px;
  }

  .right .el-input__inner {
    width: 150px;
  }

  footer .left {
    display: inline-block;
    width: 30%;
    box-sizing: border-box;
    padding-left: 25px;
  }

  footer .left > div:first-child {
    width: 60px;
    height: 60px;
    position: relative;
    display: inline-block;
  }

  footer .right {
    display: inline-block;
    width: 69%;
    vertical-align: middle;
    text-align: right;
    box-sizing: border-box;
    padding-right: 25px;
  }

  footer .right .el-input {
    width: 150px;
    margin: 0 15px;
  }

  footer .right .el-input__inner {
    width: 150px;
  }

  .right p {
    display: inline-block;
    width: 100px;
    margin-bottom: 0px;
    text-align: left;
    padding-left: 15px;
  }

  .left > * {
    display: inline-block;
    vertical-align: middle;
    padding-left: 10px;
    padding-right: 10px;
  }

  footer span p {
    color: #ffa538;
    display: inline-block;
    margin-bottom: 0px;
    padding: 0px 8px 0px 8px !important;
    width: auto !important;
  }

  footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 10px 5px 10px 5px;
    border-top: 1px solid #bdbcbc;
    background-color: whitesmoke;
  }

  .list-name {
    max-width: 900px;
    width: inherit;
    display: inline-block;
    margin-bottom: 0px;
  }

  footer label {
    margin-bottom: 0px;
  }

  .el-button {
    background: #ffa538;
    border: 1px solid #eaeaea;
    color: #ffffff;
    width: 100px;
    border-radius: 8px;
  }

  .left .el-button {
    background: #ffffff;
    border: 1px solid #ffa538;
    color: #ffa538;
    width: 100px;
    border-radius: 0px;
  }

  .el-input-number > .el-input > .el-input__inner {
    border-radius: 0px !important;
  }

  .el-input-number {
    width: 150px;
  }

  .address {
    box-sizing: border-box;
    padding: 15px 15px 15px 15px;
    /* margin: 15px auto; */
    background-color: #f5f5f5;
    border-bottom: 1px solid #e6e6e6;
    margin-bottom: 10px;
    margin-top: 10px;
    position: relative;
  }

  .address .top {
    margin: 10px auto;
  }

  .address_main .left_taker, .address_main .left_city {
    text-align: left;
  }

  .address .right_icon {
    padding: 20px;
    position: absolute;
    top: 50%;
    float: none;
    right: 0;
    transform: translateY(-50%) scaleX(-1);
    -webkit-transform: translateY(-50%) scaleX(-1);
  }


</style>
