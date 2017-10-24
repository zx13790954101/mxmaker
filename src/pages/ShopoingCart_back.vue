<template>
  <div class="shopping-cart">
    <header>
      <div class="toBack" @click="toBack">
        <i class="iconfont icon-fanhui"></i><span>返回</span>
      </div>
    </header>
    <div  class="main">
      <ul>
        <li v-for="(item,index) in goodList" :key="item.id">
          <div>
            <div class="left" id="goodList">
              <el-checkbox  class="checkbox"  @change="checkedChange(index,item.id)"></el-checkbox>
              <div style="width: 70px;">
                <good-img :url="item.thumbImage"></good-img>
              </div>
              <p class="list-name">{{item.goodName}}</p>
            </div>
            <div class="right">
              <el-input-number v-model="item.goodNumer" @change="handleChange(item.id)" :min="1" :max="50" class="buy_num"></el-input-number>
              <p >￥：{{item.goodMoney*item.goodNumer}} </p>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <footer>
      <div class="left">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <span>已选<p>{{selectItem}}</p>件</span>
        <el-button @click="deleteAll">清空</el-button>
      </div>
      <div class="right">
        <span>总计<p> ￥{{totalPrice}}</p></span>
        <el-button  @click="settlement">结算</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
  import bus from '../assets/bus'
  import GoodImg from '../components/GoodImg.vue'
  export default {
    name: 'shopping-cart',
    components: {GoodImg},
    data () {
      return {
        goodList: [],
        isIndeterminate: false,
        checkAll: false,
        checked:[],
        checkedList: [],
        selectItem: 0,
        Total: 0
      }
    },
    mounted: function () {
      this.init();
    },
    computed:{
      totalPrice:function(){
        var that=this;
        var totalPrice=0;
        $(that.goodList).each(function(index,element){
          var id=element.id;
          $(that.checkedList).each(function(index,element2){
            if(element2.id==id){
              totalPrice+=element.goodNumer*element.goodMoney;
            }
          });
        });
        return totalPrice;
      }
    },
    methods:{
      toBack:function(){
        this.$emit('toBack','main')
      },
      handleChange(id) {
        console.log("value",id);
      },
      init:function(){
        var that=this;
        that.goodList=JSON.parse(localStorage.getItem("addShopcart_Array"));
        setTimeout(function(){
          $(".el-input-number span:nth-child(1)").css({"left":"0px","border-right":"1px solid #bfcbd9","border-left":"0px solid #bfcbd9"});
          $(".el-input-number .el-input__inner").css({"padding-right":"41px","padding-left":"41px","text-align":"center"});
          $(".el-checkbox__inner").css({"border-radius":"50%"});
          $(".el-input-number__increase:hover").css({"color": "#ffa538"});
          $(" .el-input-number__increase:hover:not(.is-disabled)~.el-input .el-input__inner:not(.is-disabled) ").css({"border-color":" #ffa538"});}, 100);
        var height=$('footer').offset().top-$('.main').offset().top;
        $('.main').height(height);
      },
      checkedChange(index,id){
        var data={
          index: index,
          id: id,
          type: event.target.checked
        }
        var goodList=[];
        var that=this;
        var addlike=false;
        if(that.checkedList.length>0){
          $(that.checkedList).each(function(index,element){
            if(element.id==data.id){
              if(data.type){
                goodList.push(data);
                addlike=true;
              }
            }else{
              goodList.push(element);
            }
          });
          if(!addlike){
            if(data.type){
              goodList.push(data);
            }
          }
        }else if(data.type){
          goodList.push(data);
        }
        that.checkedList=goodList;
        //已经选择的件数
        that.selectItem=that.checkedList.length;
        if(that.goodList.length==that.checkedList.length){
          that.checkAll=true;
        }else{
          that.checkAll=false;
        }

      },
      handleCheckAllChange(event) {
        var that=this;
        if(event.target.checked){
          that.selectItem=that.goodList.length;
          that.checkedList=JSON.parse(localStorage.getItem("addShopcart_Array"));
          that.checkAll=true;
          $("#goodList  .el-checkbox__input").addClass("is-checked");
        }else{
          that.checkedList=[];
          this.selectItem=0;
          $("#goodList  .el-checkbox__input").removeClass("is-checked");
        }

      },
      selectALL: function(){

      },
      deleteAll: function(){
        var that=this;
        that.checkAll=false;
        $(that.checkedList).each(function(index,element){
          that.deleteItem(element.id);
        });
        that.goodList=JSON.parse(localStorage.getItem("addShopcart_Array"));

      },
      deleteItem: function(delete_id){
        var array=JSON.parse(localStorage.getItem("addShopcart_Array"));
        var id=delete_id;
        var list=[];
        $(array).each(function(index,element){
          if(element.id != id){
            list.push(element);
          }
        });
        localStorage.setItem('addShopcart_Array',JSON.stringify(list));
      },
      settlement: function(){
        bus.$emit('curPage','submit-order');
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .shopping-cart{
    position: fixed;
    z-index:20;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
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
  .main{
    margin-top: 60px;
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
    padding: 15px 5px 15px 5px;
    /* margin: 15px auto; */
    background-color: #f5f5f5;
    border-bottom: 1px solid #e6e6e6;
  }
  .main ul li>div:first-child{
    /* position: relative;
    top: 50%;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%); */
  }
  .left{
    display: inline-block;
    width: 64%;
    box-sizing: border-box;
    padding-left: 25px;
  }
  .left>div:first-child{
    width: 60px;
    height: 60px;
    position: relative;
    display: inline-block;
  }
  .right{
    display: inline-block;
    width: 35%;
    vertical-align: middle;
    text-align: right;
    box-sizing: border-box;
    padding-right: 25px;
  }
  .right p{ display: inline-block; width: 100px; margin-bottom: 0px; text-align: left;  padding-left: 15px;}
  .left>*{
    display: inline-block;
    vertical-align: middle;
    padding-left: 10px;
    padding-right: 10px;
  }
  footer span p{ color: #ffa538;  display: inline-block; margin-bottom: 0px; padding:0px 8px 0px 8px !important; width: auto !important;}
  footer{
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 10px 5px 10px 5px;
    border-top: 1px solid #bdbcbc;
    background-color: whitesmoke;
  }
  .list-name{
    max-width: 900px;
    width: inherit;
    display: inline-block;
    margin-bottom: 0px;
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
  .left .el-button {
    background: #ffffff;
    border: 1px solid #ffa538;
    color: #ffa538;
    width: 100px;
    border-radius: 0px;
  }
  .el-input-number>.el-input>.el-input__inner{
    border-radius: 0px !important;
  }
  .el-input-number {
    width: 150px;
  }

</style>
