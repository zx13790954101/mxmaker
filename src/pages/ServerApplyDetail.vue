<template>
  <div class="server-apply-detail" >
    <div class="row">
      <div class="col-xs-2 col-xs-offset-9">
        <button class="btn btn-warning pull-right" @click="cancelAdd">取消</button>
      </div>
    </div>
    <form action="" class="form_con">
      <div class="row">
        <div class="col-xs-3 col-sm-3 col-md-2 col-lg-2  col_reset ">
          <p class="row_title">
            物料编号：
          </p>
        </div>
        <div class=" col-xs-2 col_reset">
          <p class="">
            {{curApply.code}}
          </p>
        </div>
        <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col_reset ">
          <div v-if="curApply!=''" class="btn btn-warning btn-block" @click="setImgUrl(curApply.strutUrl)">查看结构图</div>
          <div v-if="curApply==''" disabled="" class="btn btn-warning btn-block">查看结构图</div>
        </div>
        <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col_reset ">
          <div v-if="curApply!=''" class="btn btn-warning btn-block" @click="setImgUrl(curApply.detailUrl)">查看说明书</div>
          <div v-if="curApply==''" disabled="" class="btn btn-warning btn-block">查看说明书</div>
        </div>
        <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col_reset ">
          <div v-if="curApply!=''" class="btn btn-warning btn-block" @click="GetGoodById">查看详情</div>
          <div v-if="curApply==''" disabled="" class="btn btn-warning btn-block">查看详情</div>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-3 col-sm-3 col-md-2 col-lg-2 col_reset ">
          <p class="row_title">
            需补配件：
          </p>
        </div>
        <div class=" col-xs-8 col_reset">
          <div class="table_box">
            <table class="table table-striped">
              <thead >
              <tr>
                <th>图号</th>
                <th>配件规格/名称</th>
                <th>补配原因</th>
                <th>数量</th>
              </tr>
              </thead>
              <tbody>
              <tr  valign="middle" v-for="item in curApply.partList">
                <th>{{item.code}}</th>
                <td>{{item.detail}}</td>
                <td>{{item.reason}}</td>
                <td>{{item.number}}</td>
              </tr>
              </tbody>
            </table>
          </div>

        </div>
      </div>
      <div class="row">
        <div class="col-xs-3 col-sm-3 col-md-2 col-lg-2 col_reset ">
          <p class="row_title">
            备注消息：
          </p>
        </div>
        <div class=" col-xs-8 col_reset">
          <p class="">
            {{curApply.reason}}
          </p>
        </div>
      </div>

      <div class="row">
        <div class="col-xs-3 col-sm-3 col-md-2 col-lg-2 col_reset ">
          <p class="row_title">
            附加图片：
          </p>
        </div>
        <div class=" col-xs-8 col_reset">
          <div class="row">
            <div class="col-xs-3 col-sm-3 col-md-4 col-lg-2" v-for="item in curApply.imgList" >
              <img-limit :url="item" key="item"></img-limit>
            </div>
          </div>
        </div>
      </div>

    </form>
  </div>
</template>

<script>
  import bus from '../assets/bus'
  import ImgLimit from '../components/ImgLimit.vue'
  export default {
    name: 'server-apply-detail',
    components: {ImgLimit},
    props:['PartList'],
    data () {
      //console.log(userInfo);
      return {
          curApply:JSON.parse(sessionStorage.curApply),
      }
    },
    mounted:function(){

    },
    methods: {
      cancelAdd(){
        this.$emit('toDetail',true);
      },
      GetGoodById(){
        var that = this;
        this.$http.get(globalPath+'/GetGoodById', {params: {id:that.curApply.goodId,userId:sessionStorage.userId}}).then(function (res) {
          //console.log(res);
          sessionStorage.setItem('curGood', JSON.stringify(res.body));
          bus.$emit('curPage', 'good-detail');
        })
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .col_reset {
    overflow: hidden;
    padding: 10px 0;
  }

  .row_title {
    text-align: right;
    padding-right:10px;
  }
  textarea,input,.el-date-editor{
    margin-top:-5px;
  }
  .el-date-editor{
    width:100%;
  }
  .form_con{
    padding-top:20px;
  }
  .demo-autocomplete{
    width:100%;
    margin-top:-5px;
  }
  .el-autocomplete.inline-input{
    width:100%;
  }
  .col_reset{
    padding:5px;
  }
  .col_reset .btn{
    margin-top:-5px;
  }
  .table_box{
    /*background: #ddd;*/
  }
  .btn.pull-right,.btn.pull-left{
    width:120px;
  }
</style>
<style>
  .el-checkbox__input.is-checked .el-checkbox__inner{
    background-color: #ffa538 !important;
    border-color: #ffa538 !important;
  }
  .el-input-number,.el-select{
    margin-top:-5px;
  }
</style>
