<template>
  <div class="store-center">
    <!-- 顶部菜单 -->
    <my-header>
      <div class="menu_item_box" slot="left">
        <div class="menu_item">
          <type-select @curId="setSearchCarId" :title="'类型'" :selectList="goodCategorysList"></type-select>
        </div>
        <div class="menu_item">
          <type-select @curName="setSearchArea" :title="'区域'" :selectList="goodAreasList"></type-select>
        </div>
        <div class="menu_item">
          <type-select @curName="setSearchStyle" :title="'风格'" :selectList="goodStylesList"></type-select>
        </div>
        <div class="menu_item">
          <type-select @curName="setSearchMianJis" :title="'面积'" :selectList="goodMianJisList"></type-select>
        </div>
        <div class="menu_item">
          <type-select @curId="setSearchSelectType" :title="'标签'" :selectList="selectTypeList"></type-select>
        </div>
      </div>
      <div slot="right">
        <div class="search_bar">
          <el-input
            placeholder="搜索"
            icon="search"
            v-model="searchData.name"
            :on-icon-click="searchKey">
          </el-input>
        </div>
      </div>
    </my-header>
    <!-- 商品列表 -->
    <div class="good_list">
      <div class="row">
        <div class=" col-xs-4 col-sm-4 col-md-3 col-lg-2 col_reset" v-for="(item,index) in goodsList"
             v-on:click="setCurGood(index)">
          <good-img :url="item.thumbImage" :noStock="item.number==0?true:false" :key="item.id"></good-img>
          <!--<i class="iconfont icon-arrDnR-fill" v-if="item.number==0"></i>-->
        </div>
        <p v-if="goodsList.length==0&&!showLoading" class="no_data">该分类暂无商品</p>
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

    <!-- 没有更多商品 -->
    <!--<div v-show="!showLoading">
      <p>商品已全部加载完毕</p>
    </div>-->


  </div>
</template>

<script>
  import GoodImg from '../components/GoodImg.vue'
  import MyHeader from '../components/MyHeader.vue'
  import TypeSelect from '../components/TypeSelect.vue'
  import bus from '../assets/bus'
  export default {
    name: 'store-center',
    components: {GoodImg, MyHeader, TypeSelect},
    data () {
      return {
        loading: false,
        showLoading: true,
        goodsList: [],
        searchData: {
          userId: sessionStorage.userId || 0,
          pageIndex: 0,
          pageSize: 48,
          catId: '',
          name: '',
          area: '',
          style: '',
          mainji: '',
          selectType: ''
        },
        goodCategorysList: [{
          id: '0',
          count: '',
          name: '全部',
        }],
        goodAreasList: [{
          id: '0',
          count: '',
          name: '全部',
        }],
        goodStylesList: [{
          id: '0',
          count: '',
          name: '全部',
        }],
        goodMianJisList: [{
          id: '0',
          count: '',
          name: '全部',
        }],
        selectTypeList:[{
          id: '0',
          count: '',
          name: '全部',
        },{
          id: 'new',
          count: '',
          name: '新品商品',
        },{
          id: 'hot',
          count: '',
          name: '热销商品',
        },{
          id: 'cheap',
          count: '',
          name: '促销商品',
        },]
      }
    },
    mounted: function () {
        //console.log(sessionStorage.curGoodsList);
        if(sessionStorage.curGoodsList){
          this.goodsList=JSON.parse(sessionStorage.curGoodsList);
          sessionStorage.removeItem('curGoodsList');
          this.showLoading=false;
        }else{
          this.getGoodsList();
        }
      var that = this;
      //滚动看到加载图案是请求数据
      $(window).scroll(function (e) {
          console.log('scroll');
        if(bus.curIndex!=2) return;
        if (!that.showLoading) return;
        if (that.loading) return;
        if (!$('.loader')) return;
        var loadTop = $('.loader').offset().top || 0;
        console.log(loadTop,$(window).scrollTop() + $(window).height());
        if (loadTop) {
          if ($(window).scrollTop() + $(window).height() - loadTop > 0) {
            that.loading = true;
            that.getGoodsList()
          }
        }
      });
      //请求商品类型
      that.GetGoodCategorys();
      //商品区域类型
      that.GetGoodAreas();
      //商品风格类型
      that.GetGoodStyles();
      //请求商品面积类型
      that.GetGoodMianJis();
    },
    methods: {
      searchKey(){
        this.searchReset();
        this.getGoodsList();
      },
      setSearchCarId: function (data) {
        if (data) {
          this.searchData.catId = '(' + data + ')';
        } else {
          this.searchData.catId = '';
        }

        //console.log(this.searchData);

        this.searchReset();
        this.getGoodsList();
      },
      setSearchStyle: function (data) {
        this.searchData.style = data;
        //console.log(this.searchData);

        this.searchReset();
        this.getGoodsList();
      },
      setSearchArea: function (data) {
        this.searchData.area = data;
        //console.log(this.searchData);

        this.searchReset();
        this.getGoodsList();
      },
      setSearchMianJis: function (data) {
        this.searchData.mainji = data;
        //console.log(this.searchData);

        this.searchReset();
        this.getGoodsList();
      },
      setSearchSelectType: function (data) {
        this.searchData.selectType = data;
        //console.log(this.searchData);

        this.searchReset();
        this.getGoodsList();
      },
      GetGoodMianJis: function () {
        var that = this;
        that.$http.get(globalPath+'/GetGoodMianJis', {
          params:{
            userId:sessionStorage.userId || 0
          }
        }).then(function (res) {
          //console.log(res);
          if (typeof(res.body) != 'object') {
            that.$message.error('没有请求到数据');
          }
          $(res.body).each(function (index, element) {
            //console.log(element)
            that.goodMianJisList.push({
              id: element.id,
              count: element.count,
              name: element.mianji
            });
          });
        });
      },
      GetGoodStyles: function () {
        var that = this;
        that.$http.get(globalPath+'/GetGoodStyles', {
          params:{
            userId:sessionStorage.userId || 0
          }
        }).then(function (res) {
          //console.log(res);
          if (typeof(res.body) != 'object') {
            that.$message.error('没有请求到数据');
          }
          $(res.body).each(function (index, element) {
            //console.log(element)
            that.goodStylesList.push({
              id: element.id,
              count: element.count,
              name: element.styleName
            });
          });
        });
      },
      GetGoodAreas: function () {
        var that = this;
        that.$http.get(globalPath+'/GetGoodAreas', {
          params:{
            userId:sessionStorage.userId || 0
          }
        }).then(function (res) {
          //console.log(res);
          if (typeof(res.body) != 'object') {
            that.$message.error('没有请求到数据');
            return;
          }
          $(res.body).each(function (index, element) {
            //console.log(element)
            that.goodAreasList.push({
              id: element.id,
              count: element.count,
              name: element.area
            });
          });
        });
      },
      GetGoodCategorys: function () {
        var that = this;
        that.$http.get(globalPath+'/GetGoodCategorys', {
          params:{
            userId:sessionStorage.userId || 0
          }
        }).then(function (res) {
          //console.log(res);
          if (typeof(res.body) != 'object') {
            that.$message.error('没有请求到数据');
            return;
          }
          $(res.body).each(function (index, element) {
            //console.log(element)
            that.goodCategorysList.push({
              id: element.catId,
              count: element.count,
              name: element.name
            });
          });
        });
      },
      searchReset: function () {
        this.searchData.pageIndex = 0;
        this.goodsList = [];
        this.showLoading = true;
      },
      setCurGood: function (index) {
        var curGood = this.goodsList[index];
        sessionStorage.setItem('curGood', JSON.stringify(curGood));
        bus.$emit('curPage', 'good-detail');
      },
      answer: function () {

      },
      getGoodsList: function () {
        var that = this;
        this.$http.get(globalPath+'/GetGoods', {
          params: that.searchData
        }).then(function (res) {
          //console.log(res);
          if (typeof(res.body) != 'object') {
            //that.$message.error('没有请求到数据');
            this.showLoading = false;
            that.loading = false
            return;
          }
          if (res.body.length < that.searchData.pageSize||res==0) {
            this.showLoading = false;
          }
          //console.log(res.body);
          that.goodsList.push(...res.body);
          that.searchData.pageIndex++;
          that.loading = false
        });
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .good_list {
    overflow: hidden;
  }

  .col_reset {
    padding: 10px;
    position: relative;
  }
  .icon-arrDnR-fill{
    color: #ffa538;
    position: absolute;
    right: 5px;
    font-size: 2rem;
    bottom: 0;
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
</style>
