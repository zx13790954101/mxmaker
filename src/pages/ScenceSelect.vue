<template>
  <div class="scence-select">
    <!-- 顶部菜单 -->
    <header>
      <div class="menu_item_box" slot="left">
        <div class="to_back" @click="toBack"><btn-icon text="返回" icon="icon-fanhui1"></btn-icon></div>

        <div style="display:inline-block;padding-left: 60px;">
          <div class="menu_item">
            <type-select @curName="setSceneStyles" :title="'风格'"
                         :selectList="sceneStylesList"></type-select>
          </div>
          <div class="menu_item">
            <type-select @curName="setSceneAreas" :title="'区域'"
                         :selectList="SceneAreasList"></type-select>
          </div>
        </div>

      </div>
      <div slot="right">
        <!--loading:{{loading}}-->
      </div>
    </header>

    <div class="allScence" v-show="params.area==''">
      <div class="allScence_item" v-for="(item,index) in allScenceRe" v-if="item.list!=0">
        <div class="item_title">
          <span class="l">{{item.area}}</span><span class="r" @click="setSceneAreas(item.area)">更多</span>
        </div>
        <div class="item_body">
          <div class="row">
            <div class=" col-xs-12 col-sm-4 col-md-4 col-lg-4 col_reset" v-for="(item2,index2) in item.list" @click="toSimulateAll(index,index2)">
              <!--<img :src="item2.thumbImage" :key="item2.thumbImage" alt="">-->
              <img-limit-scence :url="item2.thumbImage" ></img-limit-scence>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="soleScence" v-show="params.area!=''">
      <div class="soleScence_item">
        <div class="item_body">
          <div class="row">
            <div class=" col-xs-12 col-sm-4 col-md-4 col-lg-4 col_reset" v-for="(item,index) in scenceList" @click="toSimulate(index)">
              <!--<img :src="item2.thumbImage" :key="item2.thumbImage" alt="">-->
              <img-limit-scence :url="item.thumbImage" ></img-limit-scence>
            </div>
          </div>
        </div>
      </div>
      <!-- loading动画 -->
      <div class="loader" v-show="showLoading">
        <div class="loader-inner line-scale-pulse-out">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import GoodImg from '../components/GoodImg.vue'
  import MyHeader from '../components/MyHeader.vue'
  import TypeSelect from '../components/TypeSelect.vue'
  import BtnIcon from '../components/BtnIcon.vue'
  import bus from '../assets/bus'
  import ImgLimitScence from '../components/ImgLimitScence.vue'
  export default {
    name: 'scence-select',
    components: {GoodImg, MyHeader, TypeSelect,BtnIcon,ImgLimitScence},
    data () {
      return {
        loading: false,
        showLoading: true,
        scenceList: [],
        SceneAreasList: [{
          id: '0',
          count: '',
          name: '全部',
        }],
        sceneStylesList: [{
          id: '0',
          count: '',
          name: '全部',
        }],
        params: {
          userId: sessionStorage.userId || 0,
          pageIndex: 0,
          pageSize: 9,
          area: '',
          style: '',
        },
        allScence: []

      }
    },
    computed:{
      allScenceRe(){
        var that=this;
        var ary=[];
        $(this.SceneAreasList).each(function (index,ele) {
          $(that.allScence).each(function (index2,ele2) {
            if(ele2.area==ele.name){
              ary.push(ele2);
            }
          });
        });
        return ary;
      }
    },
    mounted: function () {
      //请求产品区域数据接口
      var that=this;
      this.GetSceneAreas();
      this.GetSceneStyles();
      //滚动看到加载图案是请求数据
      $('.scence-select').scroll(function (e) {
          console.log('scroll');
        if (!that.showLoading) return;
        if (that.loading) return;
        if (!$('.scence-select .loader')) return;
        var loadTop = $('.scence-select .loader').offset().top || 0;
        console.log(loadTop,$('.scence-select').scrollTop() + $('.scence-select').height());
        if (loadTop) {
          if ($('.scence-select').scrollTop() + $('.scence-select').height() - loadTop > 0) {
            console.log('loading');
            that.loading = true;
            that.GetScenes();
          }
        }
       /* var $this =$(this),
          viewH =$(this).height(),//可见高度
          contentH =$(this).get(0).scrollHeight,//内容高度
          scrollTop =$(this).scrollTop();//滚动高度
        //if(contentH - viewH - scrollTop <= 100) { //到达底部100px时,加载新内容
        console.log(scrollTop/(contentH -viewH));
        if(scrollTop/(contentH -viewH)>=0.95){ //到达底部100px时,加载新内容
          console.log('loading');
          that.loading = true;
          that.GetScenes();
        }*/
      });
    },
    methods: {
      toBack(){
        this.$emit('closeSelect',true);
      },
      toSimulate:function(index){
          var data={
              index:index,
              list:this.scenceList
          };
          sessionStorage.setItem('bgList',JSON.stringify(data));
        this.$emit('bgListChange',data);
        bus.$emit('curPage','simulate');
      },
      toSimulateAll:function(index,index2){
        var data={
          index:index2,
          list:this.allScenceRe[index].list
        };
        sessionStorage.setItem('bgList',JSON.stringify(data));
        this.$emit('bgListChange',data);
        bus.$emit('curPage','simulate');
      },
      setSceneAreas: function (data) {
        this.params.area = data;
        this.resetParams();
        this.GetScenesBefore();
      },
      setSceneStyles: function (data) {
        this.params.style = data;
        this.resetParams();
        this.GetScenesBefore();
      },
      resetParams:function(){
        this.scenceList=[];
        this.allScence=[];
        this.params.pageIndex=0;
        this.showLoading=true;
      },
      GetSceneStyles: function () {
        var that = this;
        that.$http.get(globalPath+'/GetSceneStyles', {
          params: {
            userId: sessionStorage.userId || 0
          }
        }).then(function (res) {
          //console.log(res);
          if (typeof(res.body) != 'object') {
            that.$message.error('没有请求到数据');
          }
          $(res.body).each(function (index, element) {
            that.sceneStylesList.push({
              id: element.id,
              count: element.count,
              name: element.style
            });
          });
        });
      },
      GetSceneAreas: function () {
        var that = this;
        that.$http.get(globalPath+'/GetSceneAreas', {
          params: {
            userId: sessionStorage.userId || 0
          }
        }).then(function (res) {
          //console.log(res);
          if (typeof(res.body) != 'object') {
            that.$message.error('没有请求到数据');
          }
          $(res.body).each(function (index, element) {
            that.SceneAreasList.push({
              id: element.id,
              count: element.count,
              name: element.area
            });
          });

          that.GetScenesBefore();

        });
      },
      GetScenesBefore: function () {
        var that = this;
        if (this.params.area) {
          that.GetScenes();
        } else {

          for (var i = 0; i < that.SceneAreasList.length; i++) {
            that.GetScenes('', that.SceneAreasList[i].name);
          }

        }

      },
      setAllscence: function (index, area, data) {
        //console.log(index, area, data);
        var data = {
          area: area,
          list: data
        };
        this.allScence.push(data);
        /*this.allScence[index]={
         area:area,
         data:data
         };*/
      },
      GetScenes: function (style, area) {
        //console.log(style,area);
        var that = this;
        that.$http.get(globalPath+'/GetScenes', {
          params: {
            userId: sessionStorage.userId || 0,
            pageSize: 9,
            pageIndex: that.params.pageIndex,
            style: style || that.params.style,
            area: area || that.params.area
          }
        }).then(function (res) {
          //console.log(res);
          if (typeof(res.body) != 'object') {
            //that.$message.error('没有请求到数据');
          }
          if(res.body.length<that.params.pageSize||res==0){
            that.showLoading=false;
          }
          that.scenceList.push(...res.body);

          for (var i = 0; i < that.SceneAreasList.length; i++) {
            //console.log(that.SceneAreasList[i].name,area)
            if (that.SceneAreasList[i].name == area) {
              that.setAllscence(i, area, res.body);
            }
          }
          this.params.pageIndex++;
          that.loading = false;
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .scence-select{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #ffffff;
    z-index:100;
    overflow-y:auto;
    padding:60px 5px 5px;
  }
  .good_list {
    overflow: hidden;
  }


  .col_reset {
    padding: 10px;
  }

  .loader {
    width: 100%;
    text-align: center;
    padding: 20px;
  }

  .loader-inner > div {
    background: #ffa538;
  }

  .menu_item {
    display: inline-block;
    padding: 0 10px;
  }

  .item_title, .item_body {
    overflow: hidden;
  }

  .item_title{
    margin:5px 0px;
  }

  .l {
    float: left;
    padding-left:10px;
    border-left:5px solid #42423c;
    display: inline-block;
  }

  .r {
    float: right;
    cursor: pointer;
  }

  .col_reset {
    padding: 5px;
  }
  .to_back{
    display: inline-block;
    position: absolute;
    top: 0;
    left: 0;
  }

  img {
    width: 100%;
    height: auto;
  }
</style>
