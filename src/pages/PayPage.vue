<template>
  <div class="shopping-cart">
    <header>
      <div class="toBack" @click="toBack">
        <i class="iconfont icon-fanhui"></i><span>返回主页</span>
      </div>
      <div class="center">去付款</div>
    </header>
    <div  class="main">
      <div class="top">
        <i class="iconfont icon-gougou"></i>
        <div>
         <p>恭喜你，订单已提交成功！</p>
          <span>订单号：{{orderNumber}} &nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #ffa538">订单付款{{moneny}}元</span></span>
          <p>你可以下载以下支付方式进行付款。</p>
        </div>
      </div>
      <div class="content">
          <span class="active" @click="switchNum(1)"><i class="iconfont icon-shouru"></i>现金支付</span>
          <span  @click="switchNum(3)"><i class="iconfont icon-gougou"></i> 微信支付</span>

      </div>
      <div class="content_slide">
        <div class="item" v-if="switchItem==1">
          <p>付款说明:<br>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 尊贵的顾客你好，订单支付成功后,我们将在3个工作日内为您提供送货及安装服务。</p>
        </div>
        <div class="item" v-if="switchItem==3">
          <div class="switch_item2">
          <img src="" id="code2">
          <p>扫描二维码，向我付款</p>
          </div>
          <button  id="buttonCode" @click="chooseImg()">上传二维码</button>
          <!--<input type="file" id="file"  @change="changeCode" value="上传二维码">-->


        </div>
      </div>

    </div>
    <footer>

      <el-button   @click="toBack" >稍后付款</el-button>
      <el-button @click="successPay" >完成付款</el-button>

    </footer>

    <!--图片上传-->
    <pic-upload @url="setUrl"></pic-upload>
  </div>
</template>

<script>
  import GoodImg from '../components/GoodImg.vue'
  import PicUpload from '../components/PicUpload.vue'
  export default {
    name: 'pay-page',
    components: {PicUpload},
    data () {
      return {
        goodList: [],
        payNum:0,
        switchItem:1,
        orderNumber:'',
        moneny: 0
      }
    },
    mounted: function () {
      this.init();
    },
    methods:{

      chooseImg(){
          $('#uploadImg').val('');
          $('#uploadImg').click();
      },


      setUrl(val){
        var that = this;
        console.log('seturl',val);
        localStorage.setItem('payPageUrl',val);
        $("#code2").attr("src", val);
        /*this.userImg = val;
        var img = new Image();
        img.src = val;
        img.onload = function () {
          that.userImgWidth = img.width;
          that.userImgHeight = img.height;
        }*/
      },
      toBack:function(){
        this.$emit('toBack','main')
      },
      handleChange(id) {
      },
      init:function(){
        var that=this;
        if (sessionStorage.getItem('payPage')) {
          that.payNum = JSON.parse(sessionStorage.getItem('payPage')).id;
          that.moneny = JSON.parse(sessionStorage.getItem('payPage')).moneny;
        }

        var height=$('footer').offset().top-$('.main').offset().top;

        var height2=$('footer').offset().top-$('.content_slide').offset().top-150;
        $('.content_slide').height(height2);
        $('.main').height(height);
        //获取订单编号
        var payPageid=JSON.parse(sessionStorage.getItem('payPage')).id;
        that.$http.get(globalPath+'/GetOrderById', {
          params:{
              id:payPageid,
          }
        }).then(function (res) {
            sessionStorage.removeItem('payPage')
            that.orderNumber=res.body.code;
        });


   /*     var imgurl=localStorage.getItem('payPageUrl');
        if(imgurl){
            setTimeout(function () {
              $("#code2").attr("src", imgurl);
            },2000);
        }else {
          $("#code2").attr("src", "../../static/images/light-store/code.png");
        }*/


      },
      changeCode:function () {
        var url;
        if (navigator.userAgent.indexOf("Chrome") > 0) {
          //Chrome
          url = window.URL.createObjectURL(document.getElementById("file").files.item(0));
        } else if (navigator.userAgent.indexOf("MSIE") >= 1 && !(navigator.userAgent.indexOf("MSIE 10.0") > 0)) {
          //IE
          url = document.getElementById("file").value;
        } else if (navigator.userAgent.indexOf("Firefox") > 0) {
          //Firefox
          url = window.URL.createObjectURL(document.getElementById("file").files.item(0));
        }
        $("#code2").attr("src", url);
      },


      switchNum:function(index){
        this.switchItem = index;
        if ($('.content span').eq(0).hasClass('active')) {
          $('.content span').eq(0).removeClass('active');
          $('.content span').eq(1).addClass('active');
        } else {
          $('.content span').eq(1).removeClass('active');
          $('.content span').eq(0).addClass('active');
        }
        var imgurl=localStorage.getItem('payPageUrl');
        if(imgurl){
          setTimeout(function () {
            $("#code2").attr("src", imgurl);
          },100);
        }else {
          setTimeout(function () {
          $("#code2").attr("src", "../../static/images/light-store/code.png");
          },100);
        }

      },
      successPay:function () {
        var that=this;
        var userInfo=JSON.parse(sessionStorage.userInfo);
        //console.log(JSON.parse(decodeURIComponent(sessionStorage.userInfo.replace(/%0a|%0d/ig,''))));
        $('#myLoading').show();
        that.$http.get(globalPath+'/UpPayRecord', {
          params:{
            account:userInfo.name,
            password:userInfo.password,
            payId:that.switchItem,
            money:that.moneny,
            orderId:that.payNum
          }
        }).then(function (res) {
          $('#myLoading').hide();
            if(res.body!=1000){
              that.$message({
                message:'操作失败！',
                type:'error'
              });
              return ;
            }
             this.toBack();

        });
      }

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  span{
    display: inline-block;
  }
  p{
    padding: 0px;
    margin: 0px;
  }
  .shopping-cart{
    position: fixed;
    z-index:20;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .good-img{

  }
  .toBack{
    cursor: pointer;
    height:60px;
    line-height:60px;
    padding:0 10px;
    display: inline-block;
  }
  .toBack:active{
    background: #222;
  }
  .toBack>.iconfont{
    padding-right:5px;
  }
  header .center{
    text-align: center;
    margin: 0 auto;
    position: absolute;
    top: 0px;
    left: 50%;
    transform: translateX(-50%);
    -webkit-transform: translateX(-50%);

  }
  .main{
    margin-top: 60px;
    overflow: auto;
  }
  footer{
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 10px 5px 10px 5px;
    border-top: 1px solid #bdbcbc;
    background-color: whitesmoke;
    text-align: center;
  }
  footer label{
    margin-bottom: 0px;
  }
  .el-button {
    background: #ffa538;
    border: 1px solid #eaeaea;
    color: #ffffff;
    width: 100px;
    border-radius: 8px;
  }
  .el-input-number>.el-input>.el-input__inner{
    border-radius: 0px !important;
  }
  .el-input-number {
    width: 150px;
  }
  .top{
    border-top: 1px solid #bdbcbc;
    background-color: whitesmoke;
    padding: 15px;
    box-sizing: border-box;

  }
  .top>div{
    vertical-align: middle;
    display: inline-block;

  }
  .top>div>span{
     line-height: 25px;
  }
  .top i:nth-of-type(1){
    color: #ffa538;
    font-size: 40px;
    position: relative;
    vertical-align: middle;
    padding: 20px;
  }
  .top>div>p:nth-of-type(1){
    color: #ffa538;
    font-size: 25px;

  }
  .content{
    text-align: center;
    box-sizing: border-box;
    margin: 20px auto;
  }
  .content  span{
    border: 1px solid black;
    padding: 3px 8px 3px 8px;
    vertical-align: middle;
    margin: 5px;
  }
  .content span:nth-of-type(1) i{

    padding-right: 5px;
  }
  .content_slide{
    background-color: whitesmoke;
    padding: 50px;
    box-sizing: border-box;
    font-size: 17px;
    line-height: 25px;
    position: relative;
  }
  .content_slide .switch_item2{
    display: inline-block;
    margin: 0 auto;
    text-align: center;
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    -webkit-transform: translate(-50%,-50%);
  }
  .content_slide p{
    line-height: 35px;
  }
  #buttonCode{
    background-color: white;
    border: 1px solid black;
    padding: 3px 10px 3px 10px;
    position: absolute;
    bottom: 50px;
    right: 50px;
    border-radius: 5px;
  }
  #file{
    background-color: white;
    border: 1px solid black;
    padding: 3px 10px 3px 10px;
    position: absolute;
    bottom: 50px;
    right: 50px;
    border-radius: 2px;
    opacity: 0;
    width: 105px;
  }
  .content_slide div img{
     display: inline-block;
    width: 200px;
    margin: 0 auto;

  }
   .active{
     color: #ffa538;
     border: 1px solid #ffa538 !important;
   }


</style>
