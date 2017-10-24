<template>
  <div class="type-select">
<!--

    <el-dropdown @command="handleCommand" :menu-align="'start'">
      <span class="el-dropdown-link">
        <div class="bar_item">
          <p>{{title}}</p>
          <p class="cur_name">{{curName}}</p>
        </div>
        <i class="iconfont icon-xiala"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="item,index in selectList" :key="item.id" :command="index" >{{item.name}}<span class="count">{{item.count}}</span></el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
-->
   <!-- <div class="bar_item">
      <p>{{title}}</p>
      <p class="cur_name">{{curName}}<i class="iconfont icon-xiala"></i></p>
      <el-select v-model="value" placeholder="请选择" @change="getValue">
        <el-option
          v-for="(item,index) in selectList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>-->

    <div class="bar_item">
      <p>{{title}}</p>
      <p class="cur_name">{{curLabel}}<i class="iconfont icon-xiala"></i></p>
      <template>
        <el-select v-model="value" placeholder="请选择" @change="getValue">
          <el-option
            v-for="item in selectList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px"> {{ item.count }}</span>
          </el-option>
        </el-select>
      </template>
    </div>

  </div>
</template>

<script>
  import bus from '../assets/bus'
  export default {
    name: 'type-select',
    props:['selectList','title'],
    computed:{
        curName:function(){
            if(this.selectList) {
              return this.selectList[this.curIndex].name;
            }else{
              return '';
            }

        }
    },
    data () {
      return {
        cities: [{
          value: 'Beijing',
          label: '北京'
        }, {
          value: 'Shanghai',
          label: '上海'
        }, {
          value: 'Nanjing',
          label: '南京'
        }, {
          value: 'Chengdu',
          label: '成都'
        }, {
          value: 'Shenzhen',
          label: '深圳'
        }, {
          value: 'Guangzhou',
          label: '广州'
        }],
        value6: '',
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: 0,
        curIndex:0,
        curLabel:'全部'
      }
    },
    methods: {
      getValue(value){
          console.log(value);
          var that=this;
          $(this.selectList).each(function (index,ele) {
            if(ele.id==value){
                that.curLabel=ele.name;
                console.log(ele.name);
            }
          });
        if(value==0){
          this.$emit('curName','');
          this.$emit('curId','');
        }else{
          this.$emit('curName',this.value);
          this.$emit('curId',value);
        }
      },
      handleCommand(index) {
        //this.$message('click on item ' + index);
        this.curIndex=index;
        if(index==0){
          this.$emit('curName','');
          this.$emit('curId','');
        }else{
          this.$emit('curName',this.curName);
          this.$emit('curId',this.selectList[this.curIndex].id);
        }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .bar_item {
    position: relative;
    height: 40px;
    line-height: 20px;
    display: inline-block;
    padding-top: 10px;
    color: #ffa538;
  }
  .iconfont{
    color: #ffa538;
  }
  p {
    margin: 0;
    padding: 0;
  }
  .count{
    padding-left:5px;

    color: #999;
  }
  .cur_name{
    font-size: 0.6rem;
  }
</style>
<style>
  .type-select input.el-input__inner {
    position: absolute;
    left: 0;
    top: 0;
    margin-top: -30px;
    width: 50px;

  }
  .type-select .el-input{
    opacity:0;
  }
</style>
