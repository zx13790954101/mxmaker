<template>
  <div class="good-select">
    <!-- 顶部菜单 -->
    <div class="select_type_bar">
      <div class="search_bar">
        <el-input
          placeholder="搜索"
          icon="search"
          v-model="searchData.name"
          :on-icon-click="handleIconClick">
        </el-input>
      </div>
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
    <!-- 商品列表 -->
    <div class="good_list">
      <div class="row">
        <div class=" col-xs-6 col-sm-6 col-md-4 col-lg-4 col_reset" v-for="(item,index) in goodsList"
             v-on:click="selectGood(index)" :class="item.checked?'bg_yellow':''">
          <good-img :url="item.thumbImage" :noStock="item.number==0?true:false" :key="item.id"></good-img>
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
  import bus from '../assets/bus'
  export default {
    name: 'good-select',
    components: {GoodImg, MyHeader, TypeSelect},
    props:['deleteUrl','oldList'],
    data () {
      return {
        searchValue: '',
        loading: false,
        showLoading: true,
        goodsList: [],
        selectList:[],
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
        selectTypeList: [{
          id: '0',
          count: '',
          name: '全部',
        }, {
          id: 'new',
          count: '',
          name: '新品商品',
        }, {
          id: 'hot',
          count: '',
          name: '热销商品',
        }, {
          id: 'cheap',
          count: '',
          name: '促销商品',
        },]
      }
    },
    mounted: function () {
      //console.log(sessionStorage.curGoodsList);
      //初始化选中商品
      if(this.oldList){
        this.selectList=this.oldList;
      }

      if (sessionStorage.curGoodsList) {
        this.goodsList = JSON.parse(sessionStorage.curGoodsList);
        sessionStorage.removeItem('curGoodsList');
        this.showLoading = false;
      } else {
        this.getGoodsList();
      }
      var that = this;
      //滚动看到加载图案是请求数据
      $('.good_list').scroll(function (e) {
         // console.log('sroll');
        if (!that.showLoading) return;
        if (that.loading) return;
        if (!$('.good-select .loader')) return;
        var loadTop = $('.good-select .loader').offset().top || 0;
        //console.log(loadTop,$(window).scrollTop() + $(window).height());
        if (loadTop) {
          if ($(window).scrollTop() + $(window).height() - loadTop > 0) {
            that.loading = true;
            that.getGoodsList();
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
      var that=this;
      bus.$on('clearGoodList',function(flag){
          if(flag){
              $(that.goodsList).each(function(index,element){
                  element.checked=false;
              });
          }
      });
    },
    methods: {
        checkSelect(){ //判断商品列表商品是否选中
          var that=this;
          $(this.goodsList).each(function(index2,ele2){
            var isSame=false;
            $(that.selectList).each(function (index,ele) {
              if(ele2.id==ele.id) isSame=true;
            });
            if(isSame){
              ele2.checked=true;
            }else{
              ele2.checked=false;
            }
          })
        },
        selectGood(index){
            this.goodsList[index].checked=!this.goodsList[index].checked;
            if(this.goodsList[index].checked){
                this.addGood(this.goodsList[index]);
              //this.selectList.push(this.goodsList[index]);
            }else{
                this.reduceGood(this.goodsList[index])
              //if(this.selectList[index].id==this.)
              /*$(this.selectList).each(function (index,ele) {
                if(ele.id==this.goodsList[index].id){
                    this.selectList.splice(index,1);
                }
              });*/
            }
        },
      addGood(val){
           console.log('allGood',val);
           var add=true;
          $(this.selectList).each(function (index,ele) {
            if(ele.id==val.id){
              add=false;
              return false;
            }
          });
          if(add) this.selectList.push(val);

      },
      reduceGood(val){
          console.log('reduceGood',val);
          var reduce=false;
          var deleteIndex=0;
        $(this.selectList).each(function (index,ele) {
          if(ele.id==val.id){
            reduce=true;
            deleteIndex=index;
            return false;
          }
        });
        if(reduce) this.selectList.splice(deleteIndex,1);

      },
      handleIconClick() {
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
          params: {
            userId: sessionStorage.userId || 0
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
          params: {
            userId: sessionStorage.userId || 0
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
          params: {
            userId: sessionStorage.userId || 0
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
          params: {
            userId: sessionStorage.userId || 0
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
      /*setCurGood: function (index) {

        this.goodsList[index].checked = true;

      },*/
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
            that.showLoading = false;
            that.loading = false
            return;
          }
          if (res.body.length < that.searchData.pageSize || res == 0) {
            this.showLoading = false;
          }
          $(res.body).each(function (index, element) {
            element.checked = false;
            element.needNum=1;
          });
          //console.log(res.body);
          that.goodsList.push(...res.body);
          that.searchData.pageIndex++;
          that.loading = false;
          that.checkSelect();

        });
      }
    },
    computed: {
      /*curGoodList: function () {
        var array = [];
        if(this.goodsList.length!=0){
          $(this.goodsList).each(function (index, element) {
            if (element.checked) {
              array.push(element);
            }
          });
        }
        console.log('computed',array);
        this.$emit('curGoodList', array);
        return array;
      }*/
    },
    watch:{
      selectList:function(val){
        this.checkSelect();
        this.$emit('curGoodList',val);
      },
      deleteUrl:function(url){
        var reduce=false;
        var deleteIndex=0;
        $(this.selectList).each(function (index,ele) {
          if(ele.mainImage==url){
            reduce=true;
            deleteIndex=index;
            return false;
          }
        });
        if(reduce) this.selectList.splice(deleteIndex,1);
      },
      oldList(val){
          this.selectList=val;
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .select_type_bar {
    position: absolute;
    left: 0;
    top: 0;
    background: #42423c;
    z-index: 19;
    width: 100%;
  }

  .good_list {
    overflow-y: auto;
    padding: 10px;
    overflow-x: hidden;
    position: absolute;
    right: 0;
    bottom: 0;
    top: 117px;
    width: 100%;
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
    padding: 0 10px 10px;
  }

  .select_type_bar {

  }

  .search_bar {
    padding: 10px;
  }
  .bg_yellow{
    background:#999;
  }
</style>
