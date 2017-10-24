// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import ShoppingCart from './pages/ShoppingCart.vue'
import VueResource from 'vue-resource'
import $ from 'jquery'
//引入weui
/*import './assets/jquery-weui/dist/lib/weui.min.css'
import './assets/jquery-weui/dist/css/jquery-weui.min.css'
import './assets/jquery-weui/dist/js/jquery-weui.min'*/
//引入bootstrap
import './assets/bootstrap/dist/css/bootstrap.min.css'
import './assets/bootstrap/dist/js/bootstrap.min'
//引入md5加密
import md5 from 'js-md5'
//引入element-ui
import Element from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
//引入swiper
/*import 'vue-awesome-swiper/dist/'*/
import VueAwesomeSwiper from 'vue-awesome-swiper'
import bus from './assets/bus'
import './assets/form'
/*import  './assets/html2canvas/dist/html2canvas.min'
import  './assets/html2canvas/dist/html2canvas.svg.min'*/

Vue.use(VueRouter);
Vue.use(VueAwesomeSwiper);
Vue.use(Element);
Vue.use(VueResource);

Vue.config.productionTip = false
const  routes=[
  {path: '/ShoppingCart', component:ShoppingCart}
]
const router = new VueRouter({
  mode: 'history',
  routes:routes
})
Vue.http.interceptors.push((request, next) => {
  var that=this
  //console.log(this)//此处this为请求所在页面的Vue实例
  // modify request
  //request.method = 'POST';//在请求之前可以进行一些预处理和配置

  // continue to next interceptor
//console.log('request',request);
  next((response) => {//在响应之后传给then之前对response进行修改和逻辑判断。对于token时候已过期的判断，就添加在此处，页面中任何一次http请求都会先调用此处方法
    //console.log('response',response)
    switch (response.status){
      case 403:
        bus.$message({
          showClose: true,
          message: '您没有权限访问',
          type: 'error'
        });
        break;
      case 404:
        bus.$message({
          showClose: true,
          message: '接口不存在',
          type: 'error'
        });
        break;
      case 500:
        bus.$message({
          showClose: true,
          message: '服务器异常或者无法连接致网络',
          type: 'error'
        });
        break;
      case 504:
        bus.$message({
          showClose: true,
          message: '网关超时',
          type: 'error'
        });
        break;
    }
    //console.log(response)
    var pattern=/Login|UpQuestion|ManagePlan|GetQiNiuToken/i;
    if(!pattern.test(response.url)){
      response.body=JSON.parse(decodeURIComponent(response.bodyText.replace(/%5c/ig,"%2F").replace(/%0A/ig,"")));
      //response.body=JSON.parse(decodeURIComponent(response.bodyText));
    }

    //response.body=JSON.parse(decodeURIComponent(JSON.stringify(response.body)))
    return response;

  });

});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  router
});
