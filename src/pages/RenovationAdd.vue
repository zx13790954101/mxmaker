<template>
  <div class="renovation-add">
    <header>
      <div class="pull-left" @click="toBack">
        <btn-icon text="返回" icon="icon-fanhui1"></btn-icon>
      </div>
      <div class="pull-right" @click="save">
        <btn-icon text="保存" icon="icon-baocun"></btn-icon>
      </div>

    </header>
    <div class="left_bar">
      <div class="row ">
        <div class="col-xs-4">案例名称：</div>
        <div class="col-xs-8">
          <el-input v-model="name" placeholder="请输入"></el-input>
        </div>
      </div>
      <div class="row ">
        <div class="col-xs-4">区域：</div>
        <div class="col-xs-8">
          <el-select v-model="value1" placeholder="请选择">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="row ">
        <div class="col-xs-4">风格：</div>
        <div class="col-xs-8">
          <el-select v-model="value2" placeholder="请选择">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="row ">
        <div class="col-xs-4">地区：</div>
        <div class="col-xs-8">
          <el-select v-model="value3" placeholder="请选择">
            <el-option
              v-for="item in options3"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="row" style="text-align: center">
        <button class="btn btn-warning " @click="chooseImg">上传案例图片</button>
      </div>
    </div>
    <div class="con">
      <img :src="url" alt="" style="width: 100%;" v-if="url!=''">
    </div>
    <pic-upload @url="setUrl"></pic-upload>
  </div>
</template>

<script>
  import bus from '../assets/bus'
  import MyHeader from '../components/MyHeader.vue'
  import BtnIcon from '../components/BtnIcon.vue'
  import PicUpload from '../components/PicUpload.vue'
  export default {
    name: 'renovation-add',
    components: {MyHeader, BtnIcon, PicUpload},
    data () {
        var renovation=JSON.parse(sessionStorage.renovation);
      return {
        id: renovation.id,
        url: renovation.mainImg,
        smallUrl:renovation.thumbImg,
        name: renovation.name,
        value1: renovation.area,
        options1: [],
        value2: renovation.style,
        options2: [],
        value3: renovation.place,
        options3: [],
      }
    },
    mounted(){
      this.GetCaseAreas();
      this.GetCaseStyles();
      this.GetCasePlaces();
    },
    methods: {
      chooseImg(){
        $('#uploadImg').click();
      },
      setUrl(val){
        //console.log(val);
        this.url = val;
      },
      save(){
        var userInfo = JSON.parse(sessionStorage.userInfo);
        var data = {};
        data.account = encodeURIComponent(userInfo.name);
        data.password = userInfo.password;
        data.userId = userInfo.id;
        var content = {
          area: encodeURIComponent(this.value1),
          style: encodeURIComponent(this.value2),
          place: encodeURIComponent(this.value3),
          thumbImg: this.url,
          mainImg: this.url,
          id: this.id,
          name: encodeURIComponent(this.name),
          imgList: [],
        };
        data.content = JSON.stringify(content);
        this.$http.post(globalPath + '/SaveCase', data, {emulateJSON: true}).then(function (res) {
          console.log(res);
          if(res.body!=1000){
              this.$message({
                  message:'保存失败！',
                type:'error'
              });
              return;
          }
          this.$message({
            message:'保存成功！',
            type:'error'
          });
          bus.$emit('curPage','main');
        });
      },
      toBack(){
        bus.$emit('curPage', 'main');
      },
      GetCaseAreas(){
        var that = this;
        this.$http.get(globalPath + '/GetCaseAreas').then(function (res) {
          console.log(res);
          if (res.body == '') {
            $.message({
              message: '获取数据出错，请检查网络！',
              type: 'error'
            });
            return;
          }
          $(res.body).each(function (index, ele) {
            that.options1.push({
              value: ele.area,
              label: ele.area
            });
          })
        });
      },
      GetCaseStyles(){
        var that = this;
        this.$http.get(globalPath + '/GetCaseStyles').then(function (res) {
          console.log(res);
          if (res.body == '') {
            $.message({
              message: '获取数据出错，请检查网络！',
              type: 'error'
            });
            return;
          }
          $(res.body).each(function (index, ele) {
            that.options2.push({
              value: ele.style,
              label: ele.style
            });
          })
        });
      },
      GetCasePlaces(){
        var that = this;
        this.$http.get(globalPath + '/GetCasePlaces').then(function (res) {
          console.log(res);
          if (res.body == '') {
            $.message({
              message: '获取数据出错，请检查网络！',
              type: 'error'
            });
            return;
          }
          $(res.body).each(function (index, ele) {
            that.options3.push({
              value: ele.place,
              label: ele.place
            });
          })
        });
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .renovation-add {
    position: fixed;
    z-index: 20;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .left_bar {
    position: absolute;
    top: 60px;
    z-index: 10;
    left: 0;
    width: 340px;
    bottom: 0;
    background: #fff;
    padding: 10px 20px;
  }

  .con {
    position: absolute;
    top: 60px;
    z-index: 10;
    left: 340px;
    right: 0;
    bottom: 0;
    background: #ddd;
    overflow-y: auto;
  }

  .row {
    line-height: 32px;
    margin-top: 10px;
  }
</style>
