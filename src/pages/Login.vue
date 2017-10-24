<template>
  <div class="login" :style="{'background-image':'url('+bgImg.url+')'}">
    <!--<button v-on:click="login">Login</button>
    <button v-on:click="getData">getData</button>
    <button v-on:click="test">test</button>
    <p>账户{{account}}</p>
    <p>密码{{password}}</p>
    <p>密码md5{{passwordMD5}}</p>
    <p>窗口width{{window.width}}</p>
    <p>窗口height{{window.height}}</p>
    <p>图片width{{bgImg.width}}</p>
    <p>图片height{{bgImg.height}}</p>-->
    <!--<img src="/static/images/light-store/loginVCicon/login_bg@2x.png" alt="" >-->
    <div class="main">
      <div>
        <img class="logo" src="static/images/light-store/loginVCicon/logo.png" alt="">
      </div>
    <form>
      <div class="row input_box_group">
        <div class=" col-xs-12 col-sm-12 col-md-12 input_box">
            <input type="text" class="form-control input" id="username" placeholder="帐号" v-model="account">
            <i class="iconfont icon-yonghu"></i>
        </div>
        <div class=" col-xs-12 col-sm-12 col-md-12 input_box">
          <input type="password" class="form-control input" id="password" placeholder="密码" v-model="password">
          <i class="iconfont icon-suo"></i>
        </div>
        <div class=" col-xs-12 col-sm-12 col-md-12 input_box">
          <input type="submit" v-on:click.prevent="login" class="form-control submit" id="exampleInputEmail1" value="登录">
        </div>
      </div>
    </form>
      <div class="under_form">
        <!--<span>记住密码</span>
        <el-switch class="switch"
        v-model="value2"
        on-color="#ffa538"
        off-color="#42423c">
      </el-switch>-->
        <span v-on:click="toMain">返回首页</span>
      </div>
    </div>
  </div>

</template>

<script>
  import md5 from 'js-md5'
  import bus from '../assets/bus'
  export default {
    name: 'login',
    data () {
      return {
        value2: true,
        msg: 'this is login',
        account:'',
        password:'',
        bgImg: {
          width: '',
          height: '',
          url: 'static/images/light-store/loginVCicon/login_bg@2x.png'
        },
        window: {
          width: '',
          height: ''
        }
      }
    },
    mounted: function () {

      this.window.width = $(window).width();
      this.window.height = $(window).height();
      var that = this;
      var bgImg = new Image();
      bgImg.src = that.bgImg.url;
      bgImg.onload = function () {
        that.bgImg.width = bgImg.width;
        that.bgImg.height = bgImg.height;
        //consolelog('bgImg', that.bgImg);
        setBG(this);
      };
      $(window).resize(function () {
        setBG(this);
      });
      //根据图片比例与窗口比例调整显示模式
      function setBG(obj) {
        that.window.width = $(window).width();
        that.window.height = $(window).height();
        if (that.bgImg.width / that.bgImg.height - that.window.width / that.window.height > 0) {
          $('.login').css({'background-size': 'auto 100% '});
        } else {
          $('.login').css({'background-size': '100% auto'});
        }
      }
    },
    computed:{
      passwordMD5:function(){
          return md5(this.password);
      }
    },
    methods: {
      test: function () {
        $.showLoading()
      },
      getData: function () {
        var that = this;
        this.$http.get('http://localhost:8080/wechat/user/tasteArticle?page=1&rows=15').then(function (response) {
          console.log(response);
          that.msg = response.data;
          sessionStorage.setItem('goodsData', response.data);
          localStorage.setItem('goodsData', response.data);
        });
      },
      toMain:function(){
          if(sessionStorage.userId){
            bus.$emit('curPage','main');
          }else{
              this.$message({
                 message:'请登陆！',
                type:'warning'
              });
          }

      },
      login: function () {
        var that = this;
        this.$http.get(globalPath+'/Login', {params:{
          account: that.account,
          password: that.passwordMD5
        }}).then(function (res) {
          //console.log(res.body);
          if(typeof(res.body)!='object'){
            //$.toast('账号不存在！','cancel');
            this.$message.error('用户名或者密码错误');
            return;
          }
          //$.toast('登陆成功！');
          this.$message({
            message: '登录成功！',
            type: 'success'
          });
          //保存userId到本地
          sessionStorage.setItem('userId',res.body.id);
          sessionStorage.setItem('userInfo',JSON.stringify(res.body));
          console.log(res.body);
          that.$emit('listenLogin',true);
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .login {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-repeat: no-repeat;
    background-position: 50% 50%;
    background-size: 100% auto;
    color: #fff;
    z-index:1000;
  }
  .logo{
    margin-left:0px;
    padding:10px 0;
    width:300px;
  }
  .input_box_group{
    background: #ffa538;
    padding:5px;
    -webkit-border-radius:5px;
    -moz-border-radius:5px;
    border-radius:5px;
  }
  .input_box{
    position: relative;
    padding: 5px 5px;
  }
  .input{
    padding-left: 38px;
  }
  .submit{
    color: #ffa538;
  }
  .input_box>.iconfont{
    position: absolute;
    left:14px;
    padding-right: 5px;
    border-right:1px solid #999;
    top:50%;
    -webkit-transform: translateY(-50%);
    -moz-transform: translateY(-50%);
    -ms-transform: translateY(-50%);
    -o-transform: translateY(-50%);
    transform: translateY(-50%);
    color: #666666;
  }
  .under_form{
    text-align: right;
    color: #ffa538;
    line-height:40px;
  }
  .under_form>span{
    vertical-align: middle;
    display: inline-block;
    padding:5px;
    cursor: pointer;
  }
  .switch{
    display: inline-block;
    vertical-align: middle;
    margin:0;
    cursor: pointer;
  }
  .switch:checked{
    background-color: #ffa538;
    border-color: #ffa538;
  }
  .main{
    width:310px;
    position: fixed;
    top:50%;
    left:50%;
    -webkit-transform: translate(-50%,-50%);
    -moz-transform: translate(-50%,-50%);
    -ms-transform: translate(-50%,-50%);
    -o-transform: translate(-50%,-50%);
    transform: translate(-50%,-50%);
  }
</style>
