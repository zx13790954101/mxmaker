<template>
  <div class="shopping-cart">

    <div  class="main">
      <ul>
        <li v-for="(item,index) in goodsList" :key="item.addressId">
          <div class="top-content">
            <p>姓名：{{item.taker}} <span class="phone"> 电话号码：{{item.mobile}}</span></p>
            <p class="address" v-if="item.province==0"><span>地址： </span><span>{{item.city}}</span><span>{{item.area}}{{item.address}}</span></p>
            <p class="address"  v-if="item.province!=0"><span>地址： {{item.province}}</span><span>{{item.city}}</span><span>{{item.area}}{{item.address}}</span></p>
          </div>
          <div class="bottom-content">
            <div class="left">
              <el-checkbox  v-if='index==checkDefalut' class="checkbox checkY"  @change="checkedChangeY(index)" v-model="isIndeterminate"></el-checkbox>
              <el-checkbox  v-if="index!=checkDefalut " class="checkbox"  @change="checkedChangeN(index)" v-model="checkAll" ></el-checkbox>
              <span>设为默认</span>
            </div>
            <div class="right">
              <span @click="edit(index)"><i class="iconfont icon-bianji1"></i>编辑</span>
              <span @click="deleted(index)"><i class="iconfont icon-trashbin"></i>删除</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <footer>
      <div class="buttom-address">
        <el-button @click="toBack" ><i class="iconfont icon-jia"></i>&nbsp;添加地址</el-button>
      </div>
    </footer>
  </div>
</template>


<script>
  import bus from '../assets/bus'
  export default{
    name: 'customer-manage',
    data () {
      return {
        isIndeterminate: false,
        checkAll: '',
        checked:[],
        checkedList: [],
        selectItem: 0,
        Total: 0,
        goodsList: [],
        checkDefalut: 'N',
        curIndex: 'customer-manage',
      }
    },
    mounted: function () {
      this.init();
      var that=this;
      $('.shopping-cart').height($(window).height()-100);
    },
    methods:{
      toBack:function(){
        bus.$emit('curPage','edit-address')
      },
      handleChange(id) {
        //console.log("value",id);
      },
      init:function(){
        var that=this;
        //console.log("border",$(".el-checkbox__inner").css("border-radius"));
        var time=setInterval(function(){
          if($(".el-checkbox__inner").css("border-radius")=='50%'){
            clearInterval(time);
          }
          $(".el-input-number span:nth-child(1)").css({"left":"0px","border-right":"1px solid #bfcbd9","border-left":"0px solid #bfcbd9"});
          $(".el-input-number .el-input__inner").css({"padding-right":"41px","padding-left":"41px","text-align":"center"});
          $(".el-checkbox__inner").css({"border-radius":"50%"});
          $(".el-input-number__increase:hover").css({"color": "#ffa538"});
          $(" .el-input-number__increase:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled) ").css({"border-color":" #ffa538"});}, 200);
        /*     var height=$('footer').offset().top-$('.main').offset().top;
         $('.main').height(height);*/
        var userInfo=JSON.parse(sessionStorage.userInfo);
        //console.log(JSON.parse(decodeURIComponent(sessionStorage.userInfo.replace(/%0a|%0d/ig,''))));
        that.$http.get(globalPath+'/GetAddressList', {
          params:{
            userId:userInfo.id,
            account:userInfo.name,
            password:userInfo.password
          }
        }).then(function (res) {
          if (typeof(res.body) != 'object') {
            that.$message.error('没有请求到数据');
          }else{
            that.goodsList=res.body;
            $(that.goodsList).each(function (index,element) {
              if(element.isDefault=='Y'){
                that.checkDefalut=index;

                that.isIndeterminate=true;
              }
            });
          }
        });
      },
      edit: function (index) {
        var curGood = this.goodsList[index];
        sessionStorage.setItem('ItemAddress', JSON.stringify(curGood));
        bus.$emit('curPage', 'edit-address');
      },
      deleted: function (index) {
        var that=this;
        var userInfo=JSON.parse(sessionStorage.userInfo);
        this.$confirm('此操作将永久删除该地址, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          that.$http.get(globalPath+'/ManageAddress', {
            params:{
              opt:2,
              userId: userInfo.id,
              account: userInfo.name,
              password: userInfo.password,
              addressId: that.goodsList[index].addressId
            }
          }).then(function (res) {
            if (res.body> 0){
              that.goodsList=res.body;
              that.init();
            }
          });

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      checkedChangeY(index){
        var that=this;
        var goodInfo=that.goodsList[index];
        var Var_isDefault=false;
        if(event.target.checked){
          Var_isDefault=true;
          that.cancelCheckedY(index,Var_isDefault);
        }else {
          that.cancelCheckedY(index,Var_isDefault);
        }

      },
      checkedChangeN(index){
        var that=this;
        var Var_isDefault=false;
        if(event.target.checked){


          //console.log("checkedChangeN",index,that.checkDefalut,that.isIndeterminate);
          if( that.isIndeterminate){
            that.isIndeterminate=false;
            that.cancelCheckedY(that.checkDefalut, false);
          }
          that.cancelCheckedY(index,true);
        }
      },
      cancelCheckedY(index,isDefault){
        var that=this;
        var Var_isDefault='N';
        if(isDefault){
          Var_isDefault='Y';
          that.checkAll=false;
        }
        var goodInfo=that.goodsList[index];
        var userInfo = JSON.parse(sessionStorage.userInfo);
        that.$http.get(globalPath+'/ManageAddress', {
          params: {
            opt: 1,
            userId: userInfo.id,
            account: userInfo.name,
            password: userInfo.password,
            addressId: goodInfo.addressId,
            country: 0,
            procince: goodInfo.province,
            city: goodInfo.city,
            area: goodInfo.area,
            taker: goodInfo.taker,
            mobile: goodInfo.mobile,
            address: goodInfo.addressItem,
            isDefault: Var_isDefault,
            tel:0,
            post:0
          }
        }).then(function (res) {
          if (res.body>0){
            that.$message.error('编辑成功');
            that.init();
          }
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .shopping-cart{
    z-index:20;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
  }
  .main{
    overflow: auto;
  }
  ul{
    padding: 0px;
  }
  .main ul li{
    list-style-type: none;
    height: auto;
    vertical-align: middle;
    box-sizing: border-box;
    padding: 0px 15px 0px 15px;
    /* margin: 15px auto; */
    background-color: #f5f5f5;
    border-bottom: 1px solid #e6e6e6;
    margin: 10px auto;
    border-radius: 5px;
  }
  .main ul li .top-content{
    padding-top: 15px;
    border-bottom: 1px solid rgba(66, 66, 60, 0.17);
  }
  .left{
    display: inline-block;
    width: 64%;
    box-sizing: border-box;
  }
  .right{
    display: inline-block;
    width: 35%;
    vertical-align: middle;
    text-align: right;
    box-sizing: border-box;
  }
  .right span{
    width: 60px;
    text-align: center;
    padding: 5px;
  }
  .left>*{
    display: inline-block;
    vertical-align: middle;
    padding-left: 10px;
    padding-right: 10px;
  }
  footer{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 10px 5px 10px 5px;
    border-top: 1px solid #bdbcbc;
    background-color: whitesmoke;
  }
  footer button{
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
  .list-name{
    max-width: 900px;
    width: inherit;
    display: inline-block;
    margin-bottom: 0px;
  }
  .el-button {
    background: #ffa538;
    border: 1px solid rgb(241, 241, 241);
    color: #ffffff;
    font-size: 16px;
    width: 200px;
    border-radius: 15px;
  }
  .el-input-number {
    width: 150px;
  }
  .el-checkbox__inner{
    border-radius: 50% !important;
  }
  .phone{
    padding-left: 50px;
  }
  #checkbox{
    border-radius: 50% !important;
  }
  .el-checkbox .el-checkbox__input .el-checkbox__inner {
    background-color: #ffa538 !important;
    border-color: #ffa538 !important;
  }
  .el-checkbox .el-checkbox__inner{
    border-radius: 50% !important;
  }
</style>
