<template>
  <div class="good-detail">
    <!-- 功能菜单 -->
    <header>
      <div class="bar_left">
        <div class="left_box" @click="setCurPage('main')">
          <i class="iconfont icon-guanbi"></i>
        </div>
      </div>
      <div class="bar_right">
        <div class="img_box" @click="showSelect=true">
          <img src="static/images/extra/go_sence_normal@2x.png" alt="">
        </div>
        <div class="img_box" @click="toShare">
          <img src="static/images/extra/share_normal@2x.png" alt="">
        </div>
        <div class="img_box" @click="collection">
          <img v-if="collectionStatus == false" src="static/images/extra/collect_pressed@2x.png" alt="">
          <img v-if="collectionStatus == true" src="static/images/extra/collect_pressed@2y.png" alt="">
        </div>

        <div class="img_box"  :style="{ 'position' : 'relative' }" @click="toshop">
          <div class="shopcart_num" v-if="shopcartNum>0"></div>
          <img src="static/images/extra/car_normal1@2x.png" alt="">
        </div>
      </div>
    </header>
    <!-- 商品大图 -->
    <div class="good_img_window">
      <img-window :url="goodInfo.mainImage"></img-window>
    </div>
    <!-- 商品详情 -->
    <div class="good_info">
      <div class="row">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col_reset">
          <h4>{{goodInfo.goodName}}</h4>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-3 col_reset">
          <p>价格：</p>
        </div>
        <div class="col-xs-9 col_reset">
          <p class="price">￥{{goodInfo.goodMoney}}</p>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-3 col_reset">
          <p>数量：</p>
        </div>
        <div class="col-xs-9 col_reset">
          <el-input-number size="small" v-model="num1" @change="handleChange" :min="1"
                           class="buy_num"></el-input-number>
          <span v-if="goodInfo.isValid=='Y'">（库存：{{goodInfo.number}}）</span>
          <span  v-if="goodInfo.isValid!='Y'">（已下架）</span>
        </div>
      </div>
      <div class="row" v-if="goodInfo.isValid=='Y'">
        <div class="col-xs-6 col_reset" style="padding-right:10px;">
          <button type="button" class="btn btn-warning btn-block" @click="showCart">加入购物车</button>
        </div>
        <div class="col-xs-6 col_reset" style="padding-left:10px;">
          <button type="button" class="btn btn-warning btn-block" @click="getshow">立即购买</button>
        </div>
      </div>
      <div class="row" v-if="goodInfo.isValid!='Y'">
        <div class="col-xs-6 col_reset" style="padding-right:10px;">
          <button type="button" class="btn btn-warning btn-block" disabled>加入购物车</button>
        </div>
        <div class="col-xs-6 col_reset" style="padding-left:10px;">
          <button type="button" class="btn btn-warning btn-block" disabled>立即购买</button>
        </div>
      </div>
      <!-- 分隔 -->
      <div class="partition"></div>
      <!-- 分隔 -->
      <div class="row top_line">
        <div class="col-xs-3 col_reset">
          <p>相似商品：</p>
        </div>
        <div class="col-xs-9 col_reset good_like_box">
          <div class="good_like_img" v-for="item,index in goodLike" @click="setCurGood(index)">
            <good-img :url="item.thumbImage"></good-img>
          </div>
        </div>
      </div>
      <div class="row top_line">
        <div class="col-xs-3 col_reset">
          <p>物料编号：</p>
        </div>
        <div class="col-xs-9 col_reset">
          <p>{{goodInfo.goodCode}}</p>
        </div>
      </div>
      <div class="row top_line">
        <div class="col-xs-3 col_reset">
          <p>货号：</p>
        </div>
        <div class="col-xs-9 col_reset">
          <p>{{goodInfo.code}}</p>
        </div>
      </div>
      <div class="row top_line">
        <div class="col-xs-3 col_reset">
          <p>尺寸：</p>
        </div>
        <div class="col-xs-9 col_reset" v-for="item in goodInfo.textPropertyList" v-if="item.key=='尺寸'">
          <p>{{item.value}}</p>
        </div>
      </div>
      <div class="row top_line">
        <div class="col-xs-3 col_reset">
          <p>主体颜色：</p>
        </div>
        <div class="col-xs-9 col_reset" v-for="item in goodInfo.textPropertyList" v-if="item.key=='主体颜色'">
          <p>{{item.value}}</p>
        </div>
      </div>
      <div class="row top_line">
        <div class="col-xs-3 col_reset">
          <p>材质：</p>
        </div>
        <div class="col-xs-9 col_reset" v-for="item in goodInfo.textPropertyList" v-if="item.key=='材质'">
          <p>{{item.value}}</p>
        </div>
      </div>
      <div class="row top_line">
        <div class="col-xs-3 col_reset">
          <p>光源/功率：</p>
        </div>
        <div class="col-xs-9 col_reset" v-for="item in goodInfo.textPropertyList" v-if="item.key=='光源/功率'">
          <p>{{item.value}}</p>
        </div>
      </div>
      <div class="row top_line">
        <div class="col-xs-3 col_reset">
          <p>适用区域：</p>
        </div>
        <div class="col-xs-9 col_reset">
          <p>{{goodInfo.areaName}}</p>
        </div>
      </div>
      <div class="row top_line">
        <div class="col-xs-3 col_reset">
          <p>适用面积：</p>
        </div>
        <div class="col-xs-9 col_reset">
          <p>{{goodInfo.mianjiName}}</p>
        </div>
      </div>
      <div class="row top_line">
        <div class="col-xs-3 col_reset">
          <p>适用风格：</p>
        </div>
        <div class="col-xs-9 col_reset">
          <p>{{goodInfo.styleName}}</p>
        </div>
      </div>
      <div class="row top_line">
        <div class="col-xs-3 col_reset">
          <p>特点：</p>
        </div>
        <div class="col-xs-9 col_reset" v-for="item in goodInfo.textPropertyList" v-if="item.key=='特点'">
          <p>{{item.value}}</p>
        </div>
      </div>
      <div class="row top_line">
        <div class="col-xs-3 col_reset">
          <p>装箱数量：</p>
        </div>
        <div class="col-xs-9 col_reset" v-for="item in goodInfo.textPropertyList" v-if="item.key=='装箱数量'">
          <p>{{item.value}}</p>
        </div>
      </div>

      <!--<div class="row" v-for="item in goodInfo.textPropertyList">
        <div class="col-xs-3 col_reset">
          <p>{{item.key}}：</p>
        </div>
        <div class="col-xs-9 col_reset">
          <p>{{item.value}}</p>
        </div>
      </div>-->
    </div>
    <!-- 选择分享渠道 -->
    <share :url="shareUrl" :title="''" :img="''"></share>
    <!-- 选择配灯场景 -->
    <transition name="animate-transition" enter-active-class="animated slideInRight"
                leave-active-class="animated slideOutRight">
    <scence-select v-if="showSelect" @closeSelect="showSelect=false"></scence-select>
    </transition>
  </div>
</template>

<script>
  import bus from '../assets/bus'
  import GoodImg from '../components/GoodImg.vue'
  import ImgWindow from '../components/ImgWindow.vue'
  import Share from '../components/Share.vue'
  import ScenceSelect from '../pages/ScenceSelect.vue'

  export default {
    name: 'good-detail',
    components: {GoodImg, ImgWindow, Share,ScenceSelect},
    data () {
      return {
        showSelect:false,
        goodInfo: {},
        dialogFormVisible: false,
        goodLike: [],
        num1: 1,
        collectionStatus: false,
        shareUrl: '',
        shareReason: '',
        shopcartNum: 0
      }
    },
    methods: {
      toshop(){
        bus.$emit('curPage', 'shopping-cart');
      },
      toShare(){
        var that = this;
        that.shareUrl='';
        this.$http.post(globalPath + '/ShareGoodById', {
          userId: sessionStorage.userId,
          goodId: that.goodInfo.id,
          reason: that.shareReason
        }, {emulateJSON: true}).then(function (res) {

          if (res.body == 1000) {
            that.$message({
              message: '加载成功',
              type: 'success'
            })
          } else {
            that.$message({
              message: '加载失败',
              type: 'error'
            });
            return;
          }
          that.shareUrl = sharePath + '/shareTemplate/good_' + that.goodInfo.id + '.html';
        });
      },
      setCurGood: function (index) {
        this.goodInfo = this.goodLike[index]
      },
      GetGoodsByCode: function () {
        var that = this;
        this.$http.get(globalPath + '/GetGoodsByCode', {
          params: {
            code: that.goodInfo.code || 0,
            userId: sessionStorage.userId
          }
        }).then(function (res) {
          //console.log('GetGoodsByCode',res);
          if (res.body==0) return;
          if (typeof(res.body) != 'object') {
            this.$message.error('请求出错');
            return;
          }
          that.goodLike = res.body;
        });
      },
      handleChange(value) {
        this.shopcart_number = value;
      },
      setCurPage: function (page) {
        bus.$emit('curPage', page);
      },
      toBack: function () {
        bus.$emit('curPage', 'main');
      },
      showCart: function () {
        if (this.num1 > this.goodInfo.number) {
          this.$message({
            message: '库存不足',
            type: 'error'
          });
          return;
        }

        var that = this;
        var goodList = [];
        var id_like = false;

        that.goodInfo.goodNumer = that.shopcart_number;
        if (that.goodInfo.goodNumer) {
          that.goodInfo.goodNumer = that.shopcart_number;
        } else {
          that.goodInfo.goodNumer = 1;
        }
        var gogal_Array = JSON.parse(localStorage.getItem("addShopcart_Array"));
        if (gogal_Array) {
          $(gogal_Array).each(function (index, element) {
            if (element.id == that.goodInfo.id) {
              goodList.push(that.goodInfo);
              id_like = true;
            } else {
              goodList.push(element);
            }
          });
        }
        if (!id_like) {
          goodList.push(that.goodInfo);
        }
        localStorage.setItem("addShopcart_Array", JSON.stringify(goodList));
        /*    bus.$emit('curPage', 'shopping-cart');*/
        var length = JSON.parse(localStorage.getItem("addShopcart_Array")).length;
        that.shopcartNum = length;
        bus.$emit('shopcartNum', length);

        this.$message({
          message: '加入购物车成功',
          type: 'success'
        });
      },
      getshow: function () {
        if (this.num1 > this.goodInfo.number) {
          this.$message({
            message: '库存不足',
            type: 'error'
          });
          return;
        }

        var that = this;
        var goodList = [];
        var id_like = false;

        that.goodInfo.goodNumer = that.shopcart_number;
        if (that.goodInfo.goodNumer) {
          that.goodInfo.goodNumer = that.shopcart_number;
        } else {
          that.goodInfo.goodNumer = 1;
        }
        goodList.push(that.goodInfo);
        var data = {
          body: goodList,
          price: that.goodInfo.goodMoney * that.goodInfo.goodNumer
        }
        localStorage.setItem("order_Array", JSON.stringify(data));
        bus.$emit('curPage', 'submit-order');

      },
      collection: function () {
        var that = this;
        if (that.collectionStatus) {
          that.collectionStatus = false;
        } else {
          that.collectionStatus = true;
        }
        var collection = JSON.parse(localStorage.getItem('collection'));
        console.log('sss', collection);
        var data = [];
        var curGood = JSON.parse(sessionStorage.curGood);
        if (that.collectionStatus) {

          if (collection.length > 0) {
            collection.unshift(curGood);
            localStorage.setItem('collection', JSON.stringify(collection));
          } else {
            data.push(curGood);
            localStorage.setItem('collection', JSON.stringify(data));
          }
        } else {
          if (collection.length > 0) {
            $(collection).each(function (index, element) {
              if (curGood.goodCode != element.goodCode) {
                data.push(element);
              }
            });
            localStorage.setItem('collection', JSON.stringify(data));
          }
        }


      },
      record2: function () {
        var that = this;
        var record = JSON.parse(localStorage.getItem('record'));
        var data = [];
        var curGood = JSON.parse(sessionStorage.curGood);
        var time = new Date();
        var n = time.getFullYear();
        var y = time.getMonth() + 1;
        var r = time.getDate();
        var h = time.getHours();
        var m = time.getMinutes();
        var s = time.getSeconds();
        var alltime = n + '-' + y + '-' + r + " " + h + ':' + m + ':' + s;
        curGood.time = alltime;
        if (record.length > 0) {
          /*       $(record).each(function (index,element) {
           if(curGood.goodCode!=element.goodCode){
           record.unshift(curGood);
           }
           });*/
          record.unshift(curGood);
          if (record.length > 200) {
            record = record.slice(0, 200);
          }
          localStorage.setItem('record', JSON.stringify(record));
        } else {
          data.push(curGood);
          localStorage.setItem('record', JSON.stringify(data));
        }
      }
    },
    mounted: function () {
      var that = this;
      var data = sessionStorage.curGood;
      if (!data) {
        this.$message({
          message: '没有数据',
          type: 'error',
          showClose: true
        });
      }
      var data = JSON.parse(data);
      //console.log(data)
      this.goodInfo = data;
      this.GetGoodsByCode();

      var record = JSON.parse(localStorage.getItem('record'));
      if (record == null) {
        var array = [];
        localStorage.setItem('record', JSON.stringify(array));
      }
      that.record2();

      var collection = JSON.parse(localStorage.getItem('collection'));
      if (collection == null) {
        var array = [];
        localStorage.setItem('collection', JSON.stringify(array));
      }
      var collection = JSON.parse(localStorage.getItem('collection'));
      if (collection.length > 0) {
        $(collection).each(function (index, element) {
          if (data.goodCode == element.goodCode) {
            that.collectionStatus = true;
          }
        });
      }

      //判断购物车有没有
      var num = JSON.parse(localStorage.getItem("addShopcart_Array"));
      that.shopcartNum = num.length;
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .good-detail {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    background: #fff;
    padding: 65px 5px 5px;
  }

  .bar_left {
    height: 60px;
    line-height: 60px;
    float: left;
  }

  .bar_right {
    height: 60px;
    line-height: 60px;
    float: right;
  }

  .img_box {
    padding: 0 10px;
    cursor: pointer;
    display: inline-block;
  }

  .left_box {
    padding: 0 10px;
    cursor: pointer;
    display: inline-block;
    height: 60px;
  }

  .left_box:active {
    background: #222;
  }

  .img_box:active {
    background: #222;
  }

  .img_box > img {
    width: auto;
    height: 3rem;
  }

  .good_img_window {
    position: absolute;
    left: 0;
    top: 60px;
    bottom: 0;
    right: 400px;
    padding: 5px;
    z-index: 1;
    background: #dfdfdf;
  }

  .good_info {
    position: absolute;
    right: 0;
    top: 60px;
    bottom: 0;
    width: 400px;
    height: auto;
    z-index: 1;
    overflow-y: auto;
    background: #fff;
    padding: 10px;
    box-shadow: 0 0 1px 2px rgba(165, 165, 165, 0.46);
  }

  p {
    padding: 0;
    font-size: 1.6rem;
  }

  .buy_num {
    margin-top: -0.5rem;
  }

  .row {
    margin: 10px 0;
  }

  .col_reset {
    padding: 0;
  }

  .partition {
    height: 30px;
  }

  .good_like_img {
    width: 8rem;
    display: inline-block;
  }

  .good_like_box {
    word-break: keep-all;
    white-space: nowrap;
    overflow-x: auto;
    text-overflow: ellipsis;
  }

  .price {
    font-size: 2rem;
    color: #ffa538;
    font-weight: bold;
    margin-top: -4px;
  }

  .my_row {
    margin: 5px 0;
  }

  .shopcart_num {
    position: absolute;
    display: inline-block;
    width: 8px;
    height: 8px;
    right: 10px;
    top: 15px;
    background-color: #ffa538;
    background-position: 50% 50%;
    line-height: 12px;
    border: 1px solid rgba(255, 255, 255, 0);
    border-radius: 50%;
    color: white;
    font-size: 10px;
    padding-left: 2px;

  }
  .top_line{
    border-top: 1px solid #ddd;
    padding-top: 18px;
  }
</style>
