<template>
  <div class="server-advice">
    <form action="" class="form_con" v-if="!reset">
      <div class="row">
        <div class="col-xs-3 col-sm-3 col-md-2 col-lg-2 col_reset ">
          <p class="row_title">
            问题分类：
          </p>
        </div>
        <div class=" col-xs-8 col_reset" style="margin-top:-10px">
          <switch-item  :list="switchList" @curIndex="setCurIndex"></switch-item>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-3 col-sm-3 col-md-2 col-lg-2 col_reset ">
          <p class="row_title">
            客户要求：
          </p>
        </div>
        <div class=" col-xs-8 col_reset">
          <textarea class="form-control" rows="3" style="resize:none" v-model="form.customerRequest"></textarea>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-3 col-sm-3 col-md-2 col-lg-2 col_reset ">
          <p class="row_title">
            异常描述：
          </p>
        </div>
        <div class=" col-xs-8 col_reset">
          <textarea class="form-control" rows="1" style="resize:none" v-model="form.content"></textarea>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-3 col-sm-3 col-md-2 col-lg-2 col_reset ">
          <p class="row_title">
            物料编号：
          </p>
        </div>
        <div class=" col-xs-3 col_reset">
          <el-row class="demo-autocomplete">
            <el-col >
              <el-autocomplete
                class="inline-input"
                v-model="form.materialCode"
                :fetch-suggestions="querySearch"
                placeholder=""
                @select="handleSelect"
              ></el-autocomplete>
            </el-col>
          </el-row>
        </div>
        <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col_reset ">
          <p class="row_title">
            不良数量：
          </p>
        </div>
        <div class=" col-xs-3 col_reset">
          <input type="text" class="form-control"  placeholder="" v-model="form.num">
        </div>
      </div>
      <div class="row">
        <div class="col-xs-3 col-sm-3 col-md-2 col-lg-2 col_reset ">
          <p class="row_title">
            订单编号：
          </p>
        </div>
        <div class=" col-xs-3 col_reset">
          <input type="text" class="form-control"  placeholder="" v-model="form.orderCode">
        </div>
        <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col_reset ">
          <p class="row_title">
            生产日期：
          </p>
        </div>
        <div class=" col-xs-3 col_reset">
            <el-date-picker
              v-model="date"
              type="date"
              placeholder="选择日期"
              :picker-options="pickerOptions0"
            @change="dateChange">
            </el-date-picker>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-3 col-sm-3 col-md-2 col-lg-2 col_reset ">
          <p class="row_title">
            附加图片：
          </p>
        </div>
        <div class=" col-xs-8 col_reset">
          <img-upload @imgKeys="setImgKeys"></img-upload>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-3 col-xs-offset-3">
          <button type="button" class="btn btn-warning pull-right" @click="formReset">重置</button>
        </div>
        <div class="col-xs-3 ">
          <button type="button" class="btn btn-warning pull-left" @click="submit">提交</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
  import bus from '../assets/bus'
  import SwitchItem from '../components/SwitchItem.vue'
  import ImgUpload from '../components/ImgUpload.vue'
  export default {
    name: 'server-advice',
    components: {SwitchItem,ImgUpload},
    props:['PartList'],
    data () {
        var userInfo=JSON.parse(sessionStorage.userInfo);
        //console.log(userInfo);
      return {
        state1: '',
        reset:false,
        imgList:[],
        params:{
          account:userInfo.name,
          password:userInfo.password,
          userId:userInfo.id,
        },
        form:{
          account:userInfo.name,
          password:userInfo.password,
          userId:userInfo.id,
          type:0,
          content:'',
          materialCode:'',
          num:'',
          imgList:'',
          orderCode:'',
          makeDate:'',
          customerRequest:''
        },
          date:'',
        pickerOptions0: {
          disabledDate(time) {
            //return time.getTime() < Date.now() - 8.64e7;
            return false;
          }
        },
        switchList: [{
          id: 1,
          name: '投诉类'
        }, {
          id: 2,
          name: '建议类'
        }, {
          id: 3,
          name: '资讯类'
        },],
        curIndex: 0
      }
    },
    mounted:function(){
      this.GetMaterialPartList();
    },
    methods: {
      dateChange(data){
        this.form.makeDate=data;
      },
      submit(){
          //console.log('hello')
        var that=this;
        that.loading=true;

        /*this.form={
          account:userInfo.name,
          password:userInfo.password,
          userId:userInfo.id,
          type:0,
          content:'',
          materialCode:'',
          num:'',
          imgList:'',
          orderCode:'',
          makeDate:'',
          customerRequest:''
        };*/
        var obj=this.form;
        var props = "";
        // 开始遍历
        for(var p in obj){

          if(obj[p]===''){
              this.$message({
                  message:'请填全信息！',
                type:'error'
              });
              console.log(p+obj[p]);
              return;
          }
        }

         this.$http.get(globalPath+'/UpQuestion',{params:that.form}).then(function (res) {
           console.log(res);
           that.loading=false;
           if(res==1001){
             that.$message({
               message:'提交失败',
               type:'error'
             })
           }else{
             that.$message({
               message:'提交成功',
               type:'success'
             })
           }

         })
      },
      setCurIndex(index){
        this.curIndex = index;
        this.form.type=['投诉类','建议类','资讯类'][index];
      },
      setImgKeys(data){
        //console.log(data);
          this.imgList=data;
          this.form.imgList=data.join(",")
      },
      GetMaterialPartList(){

      },
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
      formReset(){
        var userInfo=JSON.parse(sessionStorage.userInfo);
        this.form={
          account:userInfo.name,
            password:userInfo.password,
            userId:userInfo.id,
            type:0,
            content:'',
            materialCode:'',
            num:'',
            imgList:'',
            orderCode:'',
            makeDate:'',
            customerRequest:''
        };
        this.date='';
        this.reset=true;
        var that=this;
        setTimeout(function () {
          that.reset=false;
        },100);
      }
    },
    computed:{
      restaurants(){
        var array=[];
        $(this.PartList).each(function(index,element){
          var obj={ "value": element.materialCode, "address": "" };
          array.push(obj);
        });
        return array;
      }
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
.btn{
  width:120px;
}
</style>
