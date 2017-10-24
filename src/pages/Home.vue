<template>
  <div class="home">
    <!-- 标题 -->
    <div class="header">
      <img src="static/images/extra/home_title_icon.png" alt="" @click="GetPremium">
    </div>
    <!-- banner -->
    <my-swiper v-bind:bannerList="bannerList"></my-swiper>
    <!-- 场景区域 -->
    <div class="row ">
      <div class=" col-xs-3 col-sm-2 col-md-2 col-lg-1 col_reset" v-for="item in regionList" @click="getGoodsList(item.id)">
        <div class="region_box" >
          <img class="region_icon" :src="decodeURIComponent(item.enName)" alt="">
          <span class="region_word">{{decodeURIComponent(item.regionName)}}</span>
        </div>
      </div>
      <div class=" col-xs-3 col-sm-2 col-md-2 col-lg-1 col_reset" @click="setCurIndex(2)">
        <div class="region_box">
          <span class="region_word">更多></span>
        </div>
      </div>
    </div>
    <!-- 商品分类 -->
    <div class="good_list_box">
      <goods-tab ></goods-tab>
      <div class="good_more"@click="setCurIndex(2)">更多</div>
    </div>

    <!-- 分割 -->
<!-- 溢价设置 -->
    <el-dialog
      title="设置溢价"
      :visible.sync="dialogVisible"
      size="tiny"
      :modal="false">
      <div v-if="premium.isPremium=='Y'">
        <span>请输入{{premium.premiumValueMin}}~{{premium.premiumValueMax}}之间的值（现溢价{{premium.premiumValue}}）</span>
        <div class="input_div">
          <input type="text" class="form-control" v-model="inputNum">
        </div>
      </div>
      <div v-if="premium.isPremium=='D'">
        <span>当前统一默认溢价，不允许修改，现溢价{{premium.premiumValue}}。 </span>
      </div>
      <div v-if="premium.isPremium=='N'">
        <span>当前不允许修改溢价，现溢价{{premium.premiumValue}}。 </span>
      </div>
      <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="setPremium">确 定</el-button>
      </span>
        </el-dialog>
      </div>
</template>

<script>
  import MySwiper from '../components/MySwiper.vue'
  import GoodsTab from '../components/GoodsTab.vue'
  import bus from '../assets/bus'
  export default {
    name: 'home',
    components: {MySwiper, GoodsTab},
    data () {
      return {
          clickNum:0,
        bannerList: [],
        regionList: [],
        test: 'hello world',
        dialogVisible:false,
        premium:{
          isPremium:'N',
          premiumValue:0,
          premiumValueMax:0,
          premiumValueMin:0
        },
        inputNum:''
      }
    },
    methods: {
      setPremium(){
        var that = this;
        if(this.premium.isPremium!='Y'){
          that.dialogVisible=false;
          return;
        }
        this.$http.post(globalPath+'/ManagePremium',
          {
            userId: sessionStorage.userId || 0,
            premiumValue:that.inputNum
          },{emulateJSON:true}
        ).then(function (res) {
          if(res.body==1000){
            that.$message({
              message:'设置成功',
              type:'success'
            });
          }else{
            that.$message({
              message:'设置失败',
              type:'error'
            });
          }
        });
        that.dialogVisible=false;
      },
      GetPremium: function () {

        var that = this;
        setTimeout(function () {
          that.clickNum--;
        },2000);
        this.clickNum++;
        if(this.clickNum==3) {
          this.dialogVisible=true;
        }else{
            return;
        }

        this.$http.get(globalPath+'/GetPremium', {
          params: {
            userId: sessionStorage.userId || 0
          }
        }).then(function (res) {
          that.premium=res.body;
          /*if(that.premium.isPremium=='N'){
            that.$message({
              message:'没有权限',
              type:'error'
            });
            return;
          }*/
          that.dialogVisible=true;
        });
      },
        setCurIndex:function(index){
          bus.$emit('curIndex',index);
        },
      getGoodsList: function (id) {
        var that = this;
        this.$http.get(globalPath+'/GetRegionGoods', {
          params: {
            regionId:id,
            pageSize:48,
            pageIndex:0,
            userId:sessionStorage.userId
          }
        }).then(function (res) {
          if (typeof(res.body) != 'object') {
            that.$message.error('没有请求到数据');
            return;
          }

          sessionStorage.setItem('curGoodsList',JSON.stringify(res.body));
          bus.$emit('curIndex',2);
        });
      },
      /*toDetail:function(){
          this.$message('toDetail')
          this.$emit('listenCurPage','good-detail');
      },*/
      getBanner: function () {
        var that = this;
        this.$http.get(globalPath+'/GetBanners', {
          params: {
            userId: sessionStorage.userId || 0
          }
        }).then(function (res) {
          //console.log(res);
          if(res.body==0){
            this.$message.error('暂无轮播图');
            return;
          }
          if (typeof(res.body) != 'object') {
            this.$message.error('请求出错');
            return;
          }

          that.bannerList = res.body;
        });
      },
      getRegions: function () {
        var that = this;
        this.$http.get(globalPath+'/GetRegions', {
          params: {
            userId: sessionStorage.userId || 0
          }
        }).then(function (res) {
          //console.log(res);
          if (typeof(res.body) != 'object') {
            this.$message.error('请求出错');
            return;
          }
          that.regionList = res.body;
        });
      },
    },
    created: function () {
      this.getBanner();
      this.getRegions();
    },
    watch:{
        inputNum(val){
          if(val>this.premium.premiumValueMax){
            this.inputNum=this.premium.premiumValueMax;
          }
          /*if(val<this.premium.premiumValueMin){
            this.inputNum=this.premium.premiumValueMin;
          }*/
        }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .home{
    position: relative;
  }
  .header{
    width:100%;
    height: 60px;
    position: fixed;
    z-index:11;
    top:0px;
    left:0px;
    text-align: center;
    line-height:60px;
    padding-left:117px;
  }
  .header>img{
    height:2.4rem;
    width:auto;
    display: inline;
  }
  .region_box {
    background: #42423c;
    text-align: center;
    height: 50px;
    width:auto;
    line-height: 50px;
    cursor: pointer;
  }

  .region_box:active {
    background: #222;
  }

  .region_icon {
    width: 1.6rem;
    height:auto;
    display: inline-block;
    vertical-align: middle;
  }

  .region_word {
    font-size: 1.2rem;
    color: #ffa538;
    display: inline-block;
    vertical-align: middle;
    padding-left: 5px;
  }

  .col_reset {
    padding: 0;
  }

  .row {
    margin: 0;
  }
  .input_div{
    padding:5px 0;
  }
  .good_list_box{
    position: relative;
  }
  .good_more {
    position: absolute;
    right: 0;
    top: 0;
    display: inline-block;
    padding: 12px;
    color: #ffa538;
    cursor: pointer;
  }
</style>
