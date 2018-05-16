<template>
  <div class="scheme-edit">
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

      <!--<div style="text-align: center;padding: 10px;font-size: 1.6rem;color: #999;">设计区域</div>

      <design-area></design-area>-->

      <div class="price_box">
        <p>参考价格</p>
        <p class="price">￥{{charge}}</p>
      </div>

    </div>

    <!--<div class="swiper_box">
      <swiper-ver :headDetail="mainDetail" :headImgList="mainImgList"></swiper-ver>
      <h3>方案简介</h3>
    </div>-->
    <div class="con_box">
      <h3>方案简介</h3>
      <img-swiper  :list="mainImgList" @listChange="mainListChange" ></img-swiper>
      <textarea class="form-control" rows="3" style="resize:none" v-model="mainDetail"
                placeholder="方案简介"></textarea>
      <h3>设计区域</h3>
      <div class="design_list">
        <div class="design_item" v-for="(item,index) in planInfoList">

          <!-- 图片 -->
          <img-swiper  :list="item.imgList" @listChange="designListChange($event,index)" key="index"></img-swiper>
          <!-- 商品 -->
          <!--<div class="good_list">

          </div>-->
          <!-- 输入 -->
          <!--<div v-for="item2 in item.goodList">
            <div class="good_box">
              <img-limit :url="item2.thunbImage"></img-limit>
            </div>
          </div>-->
          <div class="input_box">
            <div class="label">
              选择区域
            </div>
            <el-select v-model="item.name" placeholder="请选择">
              <el-option
                v-for="item2 in options4"
                :key="item2.value"
                :label="item2.label"
                :value="item2.value">
              </el-option>
            </el-select>
            <button class="btn btn-warning " @click="siteDelete(index)">删除该区域</button>
          </div>
          <div class="input_box">
            <div class="label">
              搭配产品
            </div>
            <div class="good_list_box">
              <div class="img_box " v-for="(item2,index2) in item.goodList" key="index2" @click="reCount">
                <img-limit :url="item2.thumbImage"></img-limit>
                <!--{{item2.thumbImage}}-->
                <div class="number_box" >
                  <span class="num_reduce" @click="item2.planNum=item2.planNum>1?--item2.planNum:1">-</span>
                  <span class="num_cur" >{{item2.planNum}}</span>
                  <span class="num_add" @click="item2.planNum=++item2.planNum">+</span>
                </div>
                <i class="iconfont icon-trashbin good_delete" @click="goodDelete($event,index,index2)"></i>
              </div>

              <div class="good_add" @click="siteIndex(index)">+</div>

            </div>
          </div>



          <div class="input_box">
            <div class="label">
              搭配技巧
            </div>
            <textarea class="form-control" rows="3" style="resize:none" v-model="item.detail"
                      placeholder="搭配技巧"></textarea>
          </div>
        </div>
      </div>

      <div class="site_add">
        <button class="btn btn-warning" @click="siteAdd">添加区域</button>
      </div>

    </div>

    <!-- 商品选择 -->
    <transition name="animate-transition" enter-active-class="animated slideInLeft" leave-active-class="animated slideOutLeft">
    <div class="good_select_box" v-if="menuIsShow" >
      <div class="close_menu" @click="menuIsShow=!menuIsShow"></div>
      <div class="good_select" @click.prevent="">
        <good-select-once  @curGoodList="setGoodList" ></good-select-once>
      </div>
    </div>
    </transition>

  </div>
</template>

<script>
  import bus from '../assets/bus'
  import SwiperVer from '../components/SwiperVer.vue'
  import DesignArea from '../components/DesignArea.vue'
  import ImgSwiper from '../components/ImgSwiper.vue'
  import ImgLimit from '../components/ImgLimit.vue'
  import GoodSelectOnce from '../components/GoodSelectOnce.vue'
  export default {
    name: 'scheme-editue',
    components: {SwiperVer, DesignArea,ImgSwiper,ImgLimit,GoodSelectOnce},
    data () {
      console.log('当前方案', JSON.parse(sessionStorage.curSite));
      var data=JSON.parse(sessionStorage.curSite);
      return {
          id:0,
        curSite: JSON.parse(sessionStorage.curSite),
        menuIsShow:false,
        mainName:'',
        curSiteIndex:0,
        planInfoList:[],
        mainImgList: [],
        mainDetail: 'hello world',
        selectedSite: [],
        addList:[],
        charge: 0,
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
        value3: '',
        options4: [{
          value: '10',
          label: '客厅'
        }, {
          value: '11',
          label: '餐厅'
        }, {
          value: '12',
          label: '主卧'
        }, {
          value: '13',
          label: '次卧'
        }, {
          value: '14',
          label: '厨房'
        }, {
          value: '15',
          label: '洗手间'
        }, {
          value: '16',
          label: '阳台'
        }, {
          value: '17',
          label: '儿童房'
        }, {
          value: '18',
          label: '书房'
        }, {
          value: '19',
          label: '衣帽间'
        },],
      }
    },
    mounted(){
      this.dataInit();
    },
    methods: {
      siteDelete(index){
        this.planInfoList.splice(index,1);
      },
      siteAdd(){
        this.planInfoList.push({
            goodList:[],
          name:'',
          imgList:[]
        });
      },
        siteIndex(index){
            this.curSiteIndex=index;
          this.menuIsShow=!this.menuIsShow;
        },
      setGoodList(val){
          this.addList=val;
      },
      goodDelete(val,index,index2){
          console.log(index,index2);
          this.planInfoList[index].goodList.splice(index2,1);
          /*var data=this.planInfoList[index];
          data.goodList.splice()*/
      },
      reCount(){
          var charge=0;
          $(this.planInfoList).each(function (index,ele) {
            $(ele.goodList).each(function (index2,ele2) {
              charge+=ele2.goodMoney*ele2.planNum;
            });
          });
        this.charge=charge.toFixed(2);
      },
      mainListChange(val){
        this.mainImgList=val;
      },
      designListChange(data,index){
        //this.planInfoList[index].imgList=data;
        var newData=this.planInfoList[index];
        newData.imgList=data;
        this.$set(this.planInfoList, index, newData);
      },
      detecte(url){
        var mUrl=url;
        var pattern=/http/ig;
        if(!pattern.test(url)){
          mUrl='http://orbi0d8g8.bkt.clouddn.com/'+url;
        }
        return mUrl;
      },
      dataInit(){
          var that=this;
        this.id=this.curSite.id;
        this.value1 = this.curSite.house;
        this.value2 = this.curSite.mianji;
        this.value3 = this.curSite.style;
        this.mainName = this.curSite.name;
        this.charge=this.curSite.charge;
        this.mainDetail=this.curSite.mainDetail;
        var array=[];
        $(this.curSite.imgList).each(function (index,ele) {
          array.push(that.detecte(ele));
        });
        this.mainImgList=array;
        this.planInfoList=this.curSite.planInfoList;
      },
      count(){
        var charge = 0;
        $(this.selectedSite).each(function (index, ele) {
          $(ele.goodList).each(function (index2, ele2) {
            charge += ele2.goodMoney * ele2.needNum;
          })
        });
        this.charge = charge;
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
        var that = this;
        var userInfo = JSON.parse(sessionStorage.userInfo);
        var data = {};
        data.account = userInfo.name;
        data.password = userInfo.password;
        data.opt = this.opt;
        data.userId = userInfo.id;
        var plan = {};
        plan.id=this.id;
        plan.mainDetail = encodeURIComponent(this.mainDetail);
        plan.thumbImg = this.mainImgList[0];
        plan.mainImg = this.mainImgList[0];
        plan.imgList = this.mainImgList;
        plan.style = encodeURIComponent(this.value3);
        plan.mianji = encodeURIComponent(this.value2);
        plan.house = encodeURIComponent(this.value1);
        plan.name=encodeURIComponent(this.mainName);
        plan.charge = this.charge;
        var planInfoList = [];
        $(that.planInfoList).each(function (index, ele) {
          var obj = {};
          var imgList = [];
          $(ele.imgList).each(function (idnex2, ele2) {
            imgList.push(ele2);
          });
          obj.imgList = imgList;
          obj.detail = encodeURIComponent(ele.detail);
          obj.name = encodeURIComponent(ele.name);
          var goodList = [];
          $(ele.goodList).each(function (idnex2, ele2) {
            var obj = {};
            obj.id = ele2.id;
            obj.number = ele2.planNum;
            goodList.push(obj);
          });
          obj.goodList = goodList;
          planInfoList.push(obj);
        });
        plan.planInfoList = planInfoList;
        data.plan = JSON.stringify(plan);
        console.log('提交数据',JSON.parse(decodeURIComponent(JSON.stringify(data))));
        var subData=JSON.parse(decodeURIComponent(JSON.stringify(data)));
        var subPlan=JSON.parse(subData.plan);
        console.log('data',subData);
        console.log('plan',subPlan);

        this.$http.post(globalPath + '/ManagePlan', data, {emulateJSON: true}).then(function (res) {
          console.log(res);
          that.loading = false;
          if (res.body == 1001 || res.body == '') {
            that.$message({
              message: '保存失败',
              type: 'error'
            })
          } else {
            that.$message({
              message: '保存成功',
              type: 'success'
            });
            bus.$emit('curPage','main');
          }
        });

      }
    },
    computed:{
      opt(){
          return this.id>0?1:0;
      }
    },
    watch:{
     /* planInfoList(val){
          this.reCount();
      },*/
      menuIsShow(val){
          var that=this;
          console.log('change');
          if(!this.menuIsShow){
            $(this.addList).each(function (index,ele) {
              that.planInfoList[that.curSiteIndex].goodList.push(ele);
            });
          }
          this.reCount();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .scheme-edit {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 23;
    background: #dfdfdf;
    padding: 70px 10px 10px 350px;
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
  h3{
    color: #ffa538;
  }
  .con_box{
    position: absolute;
    right:0px;
    top: 60px;
    bottom: 0;
    left:340px;
    overflow-y:auto;
    padding:5px;
  }
  .design_item{
    padding-bottom:100px;
  }
  .good_list_box{
    word-break:keep-all;
    white-space:nowrap;
    overflow-x:auto;
    text-overflow:ellipsis;
    background: #fff;
    margin:0 1px 5px;
    border-radius: 5px;
  }
  .good_list_box>div{
    display: inline-block;
    vertical-align: middle;
  }
  .img_box{
    width:120px;
    display: inline-block;
    position: relative;
  }
  .number_box{
    text-align: center;
    border:1px solid #333;
    margin:5px 10px;
    border-radius: 5px;
  }
  .number_box>span{
    display: inline-block;
  }
  .num_add,.num_reduce{
    cursor: pointer;
    text-align: center;
  }
  .num_reduce{
    width:20%;
    border-right:1px solid #333;
  }
  .num_add{
    width:20%;
    border-left:1px solid #333;
  }
  .num_cur{
    width:50%;
  }
  .good_delete{
    position: absolute;
    right: 0;
    top: 0;
    display: inline-block;
    cursor: pointer;
    padding:5px;
    font-size:2rem;
  }
  .good_delete:hover{
    color: #ffa538;
  }
  .good_add {
    background: #ddd;
    text-align: center;
    width: 120px;
    height: 120px;
    line-height: 120px;
    font-size: 3rem;
    color: #fff;
    margin-top: -31px;
    cursor: pointer;
  }
  .input_box{
    position: relative;
    overflow: hidden;
    padding: 5px 0 5px 130px;
  }
  .label{
    position: absolute;
    left:0;
    font-size: 2rem;
    color: #999;
  }
  .site_add{
    text-align: center;
    padding:5px;
  }
  .good_select_box{
    position: fixed;
    /*background: rgba(0, 0, 0, 0.36);*/
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index:40;
  }
  .good_select{
    position: absolute;
    background: #fff;
    top: 0;
    width:340px;
    left: 0;
    bottom: 0;
  }
  .close_menu{
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
  }
</style>
