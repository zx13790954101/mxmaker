<template>
  <div class="server-apply-add" v-loading="loading" element-loading-text="数据提交中">
    <div class="row">
      <div class="col-xs-2 col-xs-offset-9">
        <button class="btn btn-warning pull-right"  @click="cancelAdd">取消</button>
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
          <el-row class="demo-autocomplete">
            <el-col >
              <el-autocomplete
                class="inline-input"
                v-model="code"
                :fetch-suggestions="querySearch"
                placeholder=""
                @select="handleSelect"
              ></el-autocomplete>
            </el-col>
          </el-row>
        </div>
        <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col_reset ">
          <div v-if="curGood!=''" class="btn btn-warning btn-block" @click="setImgUrl(curGood.strutUrl)">查看结构图</div>
          <div v-if="curGood==''" disabled="" class="btn btn-warning btn-block">查看结构图</div>
        </div>
        <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col_reset ">
          <div v-if="curGood!=''" class="btn btn-warning btn-block" @click="setImgUrl(curGood.detailUrl)">查看说明书</div>
          <div v-if="curGood==''" disabled="" class="btn btn-warning btn-block">查看说明书</div>
        </div>
        <div class="col-xs-2 col-sm-2 col-md-2 col-lg-2 col_reset ">
          <div v-if="curGood!=''" class="btn btn-warning btn-block" @click="GetGoodById">查看详情</div>
          <div v-if="curGood==''" disabled="" class="btn btn-warning btn-block">查看详情</div>
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
                <th>选择</th>
              </tr>
              </thead>
              <tbody>
              <tr  valign="middle" v-for="item in curGood.partList">
                <th>{{item.code}}</th>
                <td>{{item.detail}}</td>
                <td><el-select v-model="item.reason" placeholder="请选择" size="small">
                  <el-option
                    v-for="item2 in options"
                    :key="item2.value"
                    :label="item2.label"
                    :value="item2.value">
                  </el-option>
                </el-select></td>
                <td><el-input-number size="small" v-model="item.needNum" :min="0"></el-input-number></td>
                <td><el-checkbox v-model="item.checked"></el-checkbox></td>
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
          <textarea class="form-control" rows="3" style="resize:none" v-model="remark"></textarea>
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
    name: 'server-apply-add',
    components: {SwitchItem,ImgUpload},
    props:['PartList'],
    data () {
      var userInfo=JSON.parse(sessionStorage.userInfo);
      //console.log(userInfo);
      return {
          loading:false,
        remark:'',
        state1: '',
        curGood:'',
        reset:false,
        imgList:[],
        curImg:'',
        options:[{
          value: '破损',
          label: '破损'
        },{
          value: '开裂',
          label: '开裂'
        },{
          value: '氧化',
          label: '氧化'
        },{
          value: '生锈',
          label: '生锈'
        },{
          value: '掉漆',
          label: '掉漆'
        },{
          value: '色差',
          label: '色差'
        },{
          value: '原包装少',
          label: '原包装少'
        },{
          value: '原包装错',
          label: '原包装错'
        },{
          value: '不亮',
          label: '不亮'
        },{
          value: '污渍',
          label: '污渍'
        },{
          value: '掉落',
          label: '掉落'
        },{
          value: '无孔',
          label: '无孔'
        },{
          value: '尺寸大',
          label: '尺寸大'
        },{
          value: '尺寸小',
          label: '尺寸小'
        },{
          value: '滑牙',
          label: '滑牙'
        },{
          value: '开焊',
          label: '开焊'
        },{
          value: '变形',
          label: '变形'
        },{
          value: '订购',
          label: '订购'
        }],
        params:{
          account:userInfo.name,
          password:userInfo.password,
          userId:userInfo.id,
        },
        code:'',
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

    },
    methods: {
      cancelAdd(){
        this.$emit('toAdd',true);
      },
      dateChange(data){
        this.form.makeDate=data;
      },
      setImgUrl(url){
          if(!url){
              this.$message({
                  message:'请填入物料编号',
                  type:'error'
              })
          }
        sessionStorage.setItem('imgDetailUrl',url);
        bus.$emit('curPage', 'img-detail');
      },
      submit(){
        //console.log('hello')
        var userInfo=JSON.parse(sessionStorage.userInfo);
        var that=this;
        var reason=encodeURIComponent(that.remark);
        //var partList=encodeURIComponent(that.remark);
        if(that.imgList.length==0){
            this.$message.error('请上传图片！');
            return;
        }
        if(that.remark==''){
          this.$message.error('请填写备注消息！');
          return;
        }
        if(that.curGood==''){
          this.$message.error('请选择商品！');
          return;
        }
        /*if(that.applyList.length==0){
          this.$message.error('没有选择配件！');
          return;
        }*/
        var apply=JSON.stringify({
          goodId:that.curGood.goodId||'',
          reason:reason,
          strutUrl:that.curGood.strutUrl||'',
          imgList:that.curImg,
          code:that.code,
          detailUrl:that.curGood.detailUrl||'',
          partList:that.applyList,
          applyId:'0',
          typeCode:that.typeCode,
        });
        var data={
          account:userInfo.name,
          password:userInfo.password,
          userId:userInfo.id,
          apply:apply
        };
        console.log(data);
        that.loading=true;
        this.$http.post(globalPath+'/UpPartApply',data,{emulateJSON:true}).then(function (res) {
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
            });
            that.cancelAdd();
          }

        })
      },
      setCurIndex(index){
        this.curIndex = index;
        this.form.type=index
      },
      setImgKeys(data){
        //console.log(data);
        this.curImg=data;
        this.imgList.push(data);
      },
      GetGoodById(){
        var that = this;
        this.$http.get(globalPath+'/GetGoodById', {params: {id:that.curGood.goodId,userId:sessionStorage.userId}}).then(function (res) {
          //console.log(res);
          sessionStorage.setItem('curGood', JSON.stringify(res.body));
          bus.$emit('curPage', 'good-detail');
        })
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
        //console.log(item.value);
        this.code=item.value;
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
          $(res.body.partList).each(function (index,element) {
            element.checked=false;
            element.needNum=0;
          });
          that.curGood=res.body;

         /* that.curGood.partList=[{
            code:2,
            detail:'大螺丝15mm',
            material:'磨砂',
            color:'银色',
            number:'250',
            checked:false,
            needNum:0,
            reason:'',
          },{
            code:2,
            detail:'大螺丝15mm',
            material:'磨砂',
            color:'银色',
            number:'250',
            checked:false,
            needNum:0,
            reason:'',
          },{
            code:2,
            detail:'大螺丝15mm',
            material:'磨砂',
            color:'银色',
            number:'250',
            checked:false,
            needNum:0,
            reason:'',
          }];*/
          console.log(res);
        })
      },
      formReset(){
        var userInfo=JSON.parse(sessionStorage.userInfo);
        this.form={
          account:userInfo.name,
          password:userInfo.password,
          userId:userInfo.id,
          apply:{
            goodId:'',
            reason:'',
            strutUrl:'',
            imgList:[],
            code:'',
            detailUrl:'',
            partList:[],
            applyId:'',
            typeCode:'',
          }
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
      },
      typeCode(){
          var code='';
          var that=this;
          $(this.PartList).each(function(index,element){
            if(that.code==element.materialCode) code=element.typeCode;
          });
          return code;
      },
      applyList(){
          var array=[];
        $(this.curGood.partList).each(function (index,element) {
          if(element.checked){
              array.push({
                 code:element.code,
                detail:element.detail,
                number:element.needNum,
                reason:element.reason
              });
          }
        });
        return array;
      }
    },
    watch:{
        code(){
          this.GetMaterialPartByCode();
        },

      /*curGood(){
              var array=[];
              $(this.curGood.partList).each(function (index,element) {
                if(element.checked){
                    array
                }
              });
      }*/
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

</style>
<style>
  .el-checkbox__input.is-checked .el-checkbox__inner{
    background-color: #ffa538 !important;
    border-color: #ffa538 !important;
  }
  .el-input-number,.el-select{
    margin-top:-5px;
  }
  .btn.pull-right,.btn.pull-left{
    width:120px;
  }
</style>
