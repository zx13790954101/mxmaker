<template>
  <div class="server-question-detail">
    <div class="con">
      <div class="action_bar">
        <button class="btn btn-warning " style="width: 120px;" @click="solve">已解决</button>
        <button class="btn btn-warning " @click="closeDetail" style="width: 120px;">关闭</button>
      </div>
      <div class="question_info">
        <p>[用户名称] {{userInfo.name}}</p>
        <p>[联系电话] {{userInfo.phoneNum}}</p>
        <p>[用户账号] {{userInfo.name}}</p>
        <p>[物料编号] {{curQuestion.materialCode}}</p>
        <p>[产品型号] {{curQuestion.modelCode}}</p>
        <p>[生产日期] {{curQuestion.makeDate}}</p>
        <p>[订单编号] {{curQuestion.orderCode}}</p>
        <p>[不良数量] {{curQuestion.num}}</p>
        <img-limit v-for="item in imgList" :url="item" key="item"></img-limit>
      </div>
      <div class="conversation">
        <talk  :data="talkData"></talk>
        <talk v-for="(item,index) in talkList" :data="item" key="index"></talk>
      </div>
      <div class="my_input">
        <div class="input_box">
          <textarea class="form-control" rows="3" style="resize:none" v-model="myInput"
                    placeholder="请输入提问内容"></textarea>
        </div>
        <div class="input_btn" @click="ask">
          继续提问
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import bus from '../assets/bus'
  import ImgLimit from '../components/ImgLimit.vue'
  import Talk from '../components/Talk.vue'
  import {formatDate} from '../assets/date'
  export default {
    name: 'server-question-detail',
    components: {ImgLimit, Talk},
    data () {
      var userInfo=JSON.parse(sessionStorage.userInfo);
      var curQuestion = JSON.parse(sessionStorage.curQuestion);
      var talkCon = '<span style="color:#ffa538;display: block;">异常描述：' + curQuestion.content + '</span>' +
        '<span style="color:#ffa538;display: block;">客户要求：' + curQuestion.customerRequest + '</span>';
      return {
        myInput: '',
        talkData: {
          time: curQuestion.issueTime,
          name: userInfo.name,
          con: talkCon,
          float:'left'
        },
        userInfo: userInfo,
        curQuestion: curQuestion
      }
    },
    methods: {
      closeDetail(){
        this.$emit('setShow', true);
      },
      solve(){
        var that = this;
        this.$http.get(globalPath+'/EndQuestion', {
          params: {
            account: this.userInfo.name,
            password: this.userInfo.password,
            questionId: this.curQuestion.issueId
          }
        }).then(function (res) {
          console.log(res);
          if (res.body != 1000) {
            that.$message({
              message: '操作失败',
              type: 'error'
            });
            return false;
          }
          that.$message({
            message: '操作成功',
            type: 'success'
          });
          this.$emit('setShow', true);
        });



      },
      ask(){
        var that = this;
        this.$http.get(globalPath+'/UpReply', {
          params: {
            account: this.userInfo.name,
            password: this.userInfo.password,
            content: this.myInput,
            questionId: this.curQuestion.issueId
          }
        }).then(function (res) {
          console.log(res);
          if (res.body != 1000) {
            that.$message({
              message: '提问失败',
              type: 'error'
            });
            return false;
          }
          var data={
            content:that.myInput,
            replyTime:that.curTime(),
            type:0
          }
          that.curQuestion.replyList.push(data);
        });
      },
      curTime(){
          var now=new Date();
          var   year=now.getFullYear();
          var   month=now.getMonth()+1;
          var   date=now.getDate();
          var   hour=now.getHours();
          var   minute=now.getMinutes();
          var   second=now.getSeconds();
          return   year+"-"+month+"-"+date+" "+hour+":"+minute+':'+second;
      }
    },
    mounted(){

    },
    filters:{
      formatDate(time){

          return ;
      }
    },
    computed: {
      imgList(){
          var array=[];
          if(this.curQuestion.imgList){
            array=this.curQuestion.imgList.split(',');
          }
        return array;
      },
      talkList:function(){
        var array=[];
        var that=this;
        $(this.curQuestion.replyList).each(function (index,ele) {
          array.push({
            con:ele.content,
            time:ele.replyTime,
            name:that.userInfo.name,
            float:ele.type==0?'left':'right'
          });
        });
        return array;
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .action_bar {
    padding-right: 10px;
    overflow: hidden;
    position: absolute;
    right: 0px;
    top: 0;
  }

  .action_bar .btn {
    margin: 0 5px;
  }

  .server-question-detail {

  }

  .con {
  }

  .question_info {
    width: 300px;
    padding: 10px;
    position: absolute;
    right: 0;
    top: 60px;
    bottom: 0;
    overflow-y: auto;
  }

  .my_input {
    right: 300px;
    left: 0;
    bottom: 0;
    position: absolute;
  }

  .input_box {
    padding-right: 110px;
  }

  .input_btn {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100px;
    background: #ffa538;
    color: #fff;
    margin: 0 5px;
    line-height: 72px;
    text-align: center;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    cursor: pointer;
  }

  .input_btn:hover {
    background: #b36d17;
  }

  .img-limit {
    margin: 10px 5px;
  }

  .conversation {
    background: #ddd;
    position: absolute;
    left: 0;
    top: 0;
    right: 305px;
    bottom: 80px;
    -webkit-border-radius:5px;
    -moz-border-radius:5px;
    border-radius: 5px;
    overflow-y: auto;
    padding:5px;
  }
</style>
