<template>
    <div class="store-center">
       <my-header>
         <div class="menu_item_box" slot="left">
           <div class="menu_item">
             <type-select @curName="setSearchStyles" :title="'风格'" :selectList="goodCaseStyles"></type-select>
           </div>
             <div class="menu_item">
             <type-select @curName="setSearchAreas" :title="'区域'" :selectList="goodCaseAreas"></type-select>
             </div>
               <div class="menu_item">
             <type-select  @curName="setSearchPlaces" :title="'地区'" :selectList="goodCasePlaces"></type-select>
           </div>
         </div>


         <div class="btn_box" @click="addRenovation" slot="right" >
           <btn-icon text="添加方案" icon="icon-tianjia" ></btn-icon>
         </div>

       </my-header>
      <!-- 商品列表 -->
      <div class="good_list">
        <div class="row">
          <div class=" col-xs-4 col-sm-4 col-md-3 col-lg-3 col_reset" v-for="(item,index) in goodsList"
               v-on:click="setCurGood(index)">
            <good-img-limit :url="item.mainImg" :key="item.id">
              <div class="" slot="explain">
                <p>{{item.name}}</p>
                <div class="left"><i class="iconfont icon-biaoqian"></i>{{item.style}}</div>
              </div>
            </good-img-limit>
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

      <!-- 没有更多商品 -->
      <!--<div v-show="!showLoading">
        <p>商品已全部加载完毕</p>
      </div>-->

    </div>
</template>



<script>
    import GoodImgLimit from '../components/GoodImgLImit.vue'
    import TypeSelect from '../components/TypeSelect.vue'
    import MyHeader from '../components/MyHeader.vue'
    import bus from '../assets/bus'
    import BtnIcon from '../components/BtnIcon.vue'
    export default{
        name: 'renovation',
        components: {TypeSelect,MyHeader,GoodImgLimit,BtnIcon},
        data () {
            return {
                loading: false,
                showLoading: true,
                goodsList: [],
                searchData: {
                  userId: sessionStorage.userId || 0,
                  opt: 0,
                  pageIndex: 0,
                  pageSize: 48,
                  style: '',
                  area: '',
                  place: '',
                },
                goodCaseStyles: [{
                  id: '0',
                  name: '全部',
                }],
                goodCaseAreas: [{
                  id: '0',
                  name: '全部',
                }],
                goodCasePlaces: [{
                  id: '0',
                  name: '全部',
                }]
            }
        },
        mounted: function() {
          var that=this;
          $(window).scroll(function (e) {
            if (bus.curIndex!=5) return;
            if (!that.showLoading) return;
            if (that.loading) return;
            if (!$('.loader')) return;
            var loadTop =$('.loader').offset().top || 0;
            if (loadTop) {
              if ($(window).scrollTop() + $(window).height() - loadTop > 0) {
                that.loading = true;
                that.getGoodsList()
              }
            }
          });

          this.GetCaseStyles();
          this.GetCaseAreas();
          this.GetCasePlaces();

          this.getGoodsList();
        },
        methods: {
          addRenovation(){
              sessionStorage.setItem('renovation',JSON.stringify({
                  area:'',
                id:0,
                mainImg:'',
                place:'',
                style:'',
                text:'',
                thumbImg:'',
                building:''
              }));
            bus.$emit('curPage','renovation-add');
          },
          setSearchStyles: function (data) {
            this.searchData.style = data;
            this.searchReset();
            this.getGoodsList();
          },
          setSearchAreas: function (data) {
            this.searchData.area = data;
            this.searchReset();
            this.getGoodsList();
          },
          setSearchPlaces: function (data) {
            this.searchData.place = data;
            this.searchReset();
            this.getGoodsList();
          },
          searchReset: function () {
            this.searchData.pageIndex = 0;
            this.goodsList = [];
            this.showLoading = true;
          },
          GetCaseStyles: function () {
            var that=this;
            that.$http.get(globalPath+'/GetCaseStyles').then(function (res) {
               if (typeof (res.body) != 'object') {
                  that.$message.error('没有请求到数据');
                  return;
               }
               $(res.body).each(function (index,element) {
                 that.goodCaseStyles.push({
                     id: element.id,
                     name: element.style
                 })
               })
            });
          },
          GetCaseAreas: function () {
            var that=this;
            that.$http.get(globalPath+'/GetCaseAreas').then(function (res) {
              if (typeof (res.body) != 'object') {
                that.$message.error('没有请求到数据');
                return;
              }
              $(res.body).each(function (index,element) {
                that.goodCaseAreas.push({
                  id: element.id,
                  name: element.area
                })
              })
            });
          },
          GetCasePlaces: function () {
            var that=this;
            that.$http.get(globalPath+'/GetCasePlaces').then(function (res) {
              if (typeof (res.body) != 'object') {
                that.$message.error('没有请求到数据');
                return;
              }
              $(res.body).each(function (index,element) {
                that.goodCasePlaces.push({
                  id: element.id,
                  name: element.place
                })
              })
            });
          },
          setCurGood: function (index) {
            var curGood = this.goodsList[index];
            sessionStorage.setItem('renovation', JSON.stringify(curGood));
            sessionStorage.setItem('renovationData', JSON.stringify({
                list:this.goodsList,
                index:index
            }));
            bus.$emit('curPage', 'renovation-detail');
          },
           getGoodsList: function () {
              var that = this;
              this.$http.get(globalPath+'/GetCases',{
                  params: that.searchData
              }).then(function (res) {
                  if (typeof (res.body) != 'object') {
                      this.showLoading = false;
                      that.loading = false;
                      return;
                  }
                  if (res.body.length < that.searchData.pageSize||res==0) {
                    this.showLoading = false;
                  }
                  that.goodsList.push(...res.body);
                  that.searchData.pageIndex++;
                  that.loading = false;
              })

           }
        }
    }
</script>

<style scoped>
  .good_list {
    box-sizing: border-box;
    padding: 0px 5px 0px 5px;
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
  .good_list .left{
       text-align: left;
  }
  .good_list .left i{
    padding-right: 5px;
    color: #ffa538;
    font-size: 14px;
  }
  .good_list p{
    margin: 0px;
  }
  .explain>div:first-child{
    position: relative;
    top:50%;
    transform: translateY(-50%);
    box-sizing: border-box;
    padding:0px 5px 0px 5px;
  }
  .btn_box{
    position: absolute;
    right:0;
    top:0;
  }
</style>
