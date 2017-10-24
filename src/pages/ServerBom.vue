<template>
  <div class="server-bom">
    <div class="row box">
      <div class="col-xs-8 col-xs-offset-1">
        <el-row class="demo-autocomplete">
          <el-col>
            <el-autocomplete
              class="inline-input"
              v-model="allCode"
              :fetch-suggestions="querySearch"
              placeholder="物料编号/商品货号"
              @select="handleSelect"
            ></el-autocomplete>
          </el-col>
        </el-row>
      </div>
      <div class="col-xs-2">
        <button type="button" class="btn btn-warning btn-block" @click="GetMaterialPartByCode"><i
          class="iconfont icon-icon"></i>&nbsp;查询
        </button>
      </div>
    </div>
    <div class="row good_box" v-if="curGood!=''" >
      <div class="row">
        <div class="col-xs-3 col-xs-offset-1 col-lg-2" @click="GetGoodById">
          <good-img :url="curGood.thumbUrl" ></good-img>
        </div>
        <div class="col-xs-7 col-lg-8 good_info">
          <p class="word">物料编号：{{curGood.materialCode}}</p>
          <p class="word">货品编号：{{curGood.typeCode}}</p>
          <div class="row">
            <div class="col-xs-12 col-sm-4">
              <button class="btn btn-warning btn-block" @click="GetGoodById">查看详情</button>
            </div>
            <div class="col-xs-12 col-sm-4">
              <button class="btn btn-warning btn-block" @click="setImgUrl(curGood.strutUrl)">查看结构图</button>
            </div>
            <div class="col-xs-12 col-sm-4">
              <button class="btn btn-warning btn-block" @click="setImgUrl(curGood.detailUrl)">查看说明书</button>
            </div>
          </div>

        </div>
      </div>

    </div>
    <div class="good_part_list" v-if="(curGood!='')&&((curGood.partList).length!=[])">
      <table class="table table-striped">
        <thead >
        <tr>
          <th>图号</th>
          <th>配件规格/名称</th>
          <th>材质</th>
          <th>颜色</th>
          <th>数量</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in curGood.partList">
          <th>{{item.code}}</th>
          <td>{{item.detail}}</td>
          <td>{{item.material}}</td>
          <td>{{item.color}}</td>
          <td>{{item.number}}</td>
        </tr>
        </tbody>
      </table>
    </div>



  </div>
</template>

<script>
  import bus from '../assets/bus'
  import GoodImg from '../components/GoodImg.vue'
  import ImgDetail from '../components/ImgDetail.vue'
  export default {
    name: 'server-bom',
    props: ['PartList'],
    components:{GoodImg,ImgDetail},
    data () {
      var userInfo = JSON.parse(sessionStorage.userInfo);
      return {
        params: {
          account: userInfo.name,
          password: userInfo.password,
          userId: userInfo.id,
        },
        allCode: '',
        curGood:'',
        url:''
      }
    },
    mounted: function () {
    },
    methods: {
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        //console.log(item);
      },
      GetMaterialPartByCode(){
        var that = this;
        var userInfo=JSON.parse(sessionStorage.userInfo);
        this.$http.get(globalPath+'/GetMaterialPartByCode', {
          params: {
            code: that.code,
            account: userInfo.name,
            password: userInfo.password,
          }
        }).then(function (res) {
          this.curGood=res.body;
         /* this.curGood.partList=[{
              code:2,
            detail:'大螺丝15mm',
            material:'磨砂',
            color:'银色',
            number:'250'
          },{
              code:2,
            detail:'大螺丝15mm',
            material:'磨砂',
            color:'银色',
            number:'250'
          },{
              code:2,
            detail:'大螺丝15mm',
            material:'磨砂',
            color:'银色',
            number:'250'
          },{
              code:2,
            detail:'大螺丝15mm',
            material:'磨砂',
            color:'银色',
            number:'250'
          },]*/
        })
      },
      GetGoodById(){
        var that = this;
        this.$http.get(globalPath+'/GetGoodById', {params: {id:that.curGood.goodId,userId:sessionStorage.userId}}).then(function (res) {
          //console.log(res);
          sessionStorage.setItem('curGood', JSON.stringify(res.body));
          bus.$emit('curPage', 'good-detail');
        })
      },
      setImgUrl(url){
          sessionStorage.setItem('imgDetailUrl',url);
          bus.$emit('curPage', 'img-detail');
      }
    },
    computed: {
      restaurants(){
        var array = [];
        $(this.PartList).each(function (index, element) {
          var obj = {"value": element.materialCode + ' / ' + element.typeCode, "address": ""};
          array.push(obj);
        });
        return array;
      },
      code(){
        var array = this.allCode.split('/');
        return array[0].trim();
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .demo-autocomplete {
    width: 100%;
  }

  .el-autocomplete.inline-input {
    width: 100%;
  }

  .center-vertical{
    position: relative;
  }
  .word{
    color:#ffa538;
    font-size:1.8rem;
  }
  .row{
    position: relative;
  }
  .box{
    padding-top:10px;
  }
  .good_box{
    padding-top:20px;
  }
  .good_info{
    padding-top:20px;
  }
  .good_box .btn{
    margin:5px 0;
  }
</style>
