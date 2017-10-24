<template>
  <div class="scheme-add">
    <header>
      <div class="btn_box btn_box_left" @click="toMain">取消</div>
      <div class="btn_box btn_box_right" @click="save">保存</div>

    </header>
    <div class="setting">
      <div class="row bg">
        <div class="col-xs-4">方案名称：</div>
        <div class="col-xs-8">
          <input type="text" class="form-control" @focus="setCurIndex(-1)" v-model="mainName">
        </div>
        <div class="col-xs-12 " style="padding-top:10px;">
          <div class="decoration" :class="curIndex==-1?'active':''">
            <div class="one"></div>
            <div class="two"></div>
          </div>
        </div>
      </div>

      <div class="row ">
        <div class="col-xs-4">户型：</div>
        <div class="col-xs-8">
          <el-select v-model="value1" placeholder="请选择">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="row ">
        <div class="col-xs-4">面积：</div>
        <div class="col-xs-8">
          <el-select v-model="value2" placeholder="请选择">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="row ">
        <div class="col-xs-4">装修风格：</div>
        <div class="col-xs-8">
          <el-select v-model="value3" placeholder="请选择">
            <el-option
              v-for="item in options3"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>

      <div style="text-align: center;padding: 10px;font-size: 1.6rem;color: #999;">设计区域</div>

      <design-area></design-area>

      <div class="price_box">
        <p>参考价格</p>
        <p class="price">￥{{price}}</p>
      </div>

    </div>

    <div class="swiper_box">
      <swiper-ver :headDetail="mainDetail" :headImgList="mainImgList"></swiper-ver>
    </div>
  </div>
</template>

<script>
  import bus from '../assets/bus'
  import SwiperVer from '../components/SwiperVer.vue'
  import DesignArea from '../components/DesignArea.vue'
  export default {
    name: 'scheme-add',
    components: {SwiperVer, DesignArea},
    data () {
      return {
        mainName:'',
        mainImgList:[{
            url:'http://7xo8yg.com1.z0.glb.clouddn.com/temp136789525111505480985385.jpg'
        }],
          mainDetail:'hello world',
          selectedSite:[],
        price:0,
        curIndex: 0,
        options1: [{
          value: '小户型',
          label: '小户型'
        }, {
          value: '大户型',
          label: '大户型'
        }, {
          value: '普通户型',
          label: '普通户型'
        }, {
          value: '别墅',
          label: '别墅'
        },],
        value1: '',
        options2: [{
          value: '50m²以下',
          label: '50m²以下'
        }, {
          value: '50-88m²',
          label: '50-88m²'
        }, {
          value: '88-100m²',
          label: '88-100m²'
        }, {
          value: '110-150m²',
          label: '110-150m²'
        }, {
          value: '150-200m²',
          label: '150-200m²'
        }, {
          value: '200m²以上',
          label: '200m²以上'
        }],
        value2: '',
        options3: [{
          value: '简约风格',
          label: '简约风格'
        }, {
          value: '欧式风格',
          label: '欧式风格'
        }, {
          value: '美式风格',
          label: '美式风格'
        }, {
          value: '地中海风格',
          label: '地中海风格'
        }, {
          value: '中式风格',
          label: '中式风格'
        }],
        value3: ''
      }
    },
    mounted(){
      var that = this;
      bus.$off(['curSiteIndex']);
      setTimeout(function () {
        bus.$on('curSiteIndex', function (val) {
          that.curIndex = val;
        });
      },100);
      bus.$off(['selectedSite']);
      setTimeout(function () {
        bus.$on('selectedSite', function (val) {
          that.selectedSite = val;
        });
      },100);
      bus.$off(['count']);
      setTimeout(function () {
        bus.$on('count', function (val) {
          that.count();
        });
      },100);
      bus.$off(['siteMainDetail']);
      setTimeout(function () {
        bus.$on('siteMainDetail', function (val) {
          that.mainDetail=val;
        });
      },100);
      bus.$off(['mainImgList']);
      setTimeout(function () {
        bus.$on('mainImgList', function (val) {
          that.mainImgList=val;
        });
      },100);

    },
    methods: {
        count(){
          var price=0;
          $(this.selectedSite).each(function (index,ele) {
            $(ele.goodList).each(function (index2,ele2) {
              price+=ele2.goodMoney*ele2.needNum;
            })
          });
          this.price=price;
        },
      toMain(){
        bus.$emit('curPage', 'main');
      },
      setCurIndex(val){
        this.curIndex = val;
        bus.$emit('curSiteIndex', val);
      },
      save(){
          console.log('save');
        /*  var that=this;
          var userInfo=JSON.parse(sessionStorage.userInfo);
          var data={};
          data.account=userInfo.name;
          data.password=userInfo.password;
          data.opt=0;
          var plan={};
          plan.style=this.value1;
          plan.mainji=this.value2;
          plan.house=this.value3;
          plan.charge=this.price;
          var planInfoList=[];
          $(that.selectedSite).each(function (index,ele) {
              var obj={};
              var imgList=[];
              $(ele.imgList).each(function (idnex2,ele2) {
                imgList.push(ele2.url);
              });
              obj.imgList=imgList;
              obj.detail=ele.input;
              obj.name=ele.value;
              var goodList=[];
              $(ele.goodList).each(function (idnex2,ele2) {
                var obj={};
                obj.id=ele2.id;
                obj.number=ele2.needNum;
                goodList.push(obj);
              });
              obj.goodList=goodList;
              planInfoList.push(obj);
          });
          plan.planInfoList=planInfoList;
           data.plan=plan;*/
        var that=this;
        var userInfo=JSON.parse(sessionStorage.userInfo);
        var data={};
        data.account=userInfo.name;
        data.password=userInfo.password;
        data.opt=0;
        data.userId=userInfo.id;
        data.name=this.mainName;
        var plan={};
        plan.mainDetail=encodeURIComponent(this.mainDetail);
        plan.thumbImg=this.mainImgList[0].url;
        plan.mainImg=this.mainImgList[0].url;
        plan.imgList=this.mainImgList;
        plan.style=encodeURIComponent(this.value1);
        plan.mainji=encodeURIComponent(this.value2);
        plan.house=encodeURIComponent(this.value3);
        plan.charge=this.price;
        var planInfoList=[];
        $(that.selectedSite).each(function (index,ele) {
          var obj={};
          var imgList=[];
          $(ele.imgList).each(function (idnex2,ele2) {
            imgList.push(ele2.url);
          });
          obj.imgList=imgList;
          obj.detail=encodeURIComponent(ele.input);
          obj.name=encodeURIComponent(ele.value);
          var goodList=[];
          $(ele.goodList).each(function (idnex2,ele2) {
            var obj={};
            obj.id=ele2.id;
            obj.number=ele2.needNum;
            goodList.push(obj);
          });
          obj.goodList=goodList;
          planInfoList.push(obj);
        });
        plan.planInfoList=planInfoList;
        data.plan=JSON.stringify(plan);
        console.log(data);

        this.$http.post(globalPath+'/ManagePlan',data,{emulateJSON:true}).then(function (res) {
          console.log(res);
          that.loading=false;
          if(res.body==1001||res==''){
            that.$message({
              message:'提交失败',
              type:'error'
            })
          }else{
            that.$message({
              message:'提交成功',
              type:'success'
            })
          }
        });

      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .scheme-add {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 23;
    background: #dfdfdf;
    padding: 60px 0 0 340px;
  }

  .btn_box {
    cursor: pointer;
  }

  .btn_box:active {
    color: #ffb874;
  }

  .btn_box_left {
    position: absolute;
    left: 10px;
  }

  .btn_box_right {
    position: absolute;
    top: 0;
    right: 10px;
  }

  .setting {
    position: absolute;
    left: 0;
    top: 60px;
    bottom: 0;
    width: 340px;
    background: #fff;
    padding: 20px;
    overflow-y: auto;
    padding-bottom: 120px;
  }

  .price_box {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px 20px;
  }

  .price {
    font-size: 3rem;
    color: #ffa538;
  }

  .row {
    line-height: 32px;
    margin-top: 10px;
  }

  .decoration {
    text-align: center;
    font-size: 0;
    line-height: 0px;
  }

  .decoration > div {
    display: inline-block;
    height: 5px;
    background: #999;
  }

  .decoration .one {
    width: 40%;
  }

  .decoration .two {
    height: 2px;
    width: 100%;
    margin-top: -16px;
  }

  .row_center {
    text-align: center;
    color: #ffa538;
  }

  .row_center .iconfont {
    cursor: pointer;
  }

  .row_center > div {
    display: inline-block;
  }

  .row_center .iconfont:active {
    color: #ffbf8b;
  }

  .active .one {
    background: #ffa538;
  }

  .active .two {
    background: #ffa538;
  }
</style>
