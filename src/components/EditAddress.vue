<template>
    <div class="edit-address">
        <div class="header"><i class="iconfont icon-fanhui" @click="toBack"></i><span>添加收货地址</span></div>
        <div class="main" v-show="goodsList">
          <div><span class="item">收货人 :</span><el-input type="textarea" autosize placeholder="收货人" v-model="taker"> </el-input></div>
          <div><span class="item">所在地址 :</span>
            <el-cascader :options="options" v-model="selectedOptions" expand-trigger="hover" @change="handleChange"></el-cascader></div>
          <div><span class="item">详细地址 :</span><el-input type="textarea" autosize placeholder="详细地址" v-model="addressItem"> </el-input></div>
          <div><span class="item mobile">手机号码 :</span><el-input type="textarea" autosize placeholder="手机号码" v-model="mobile"> </el-input></div>
        </div>
       <div class="confirm-button"> <el-button @click="confirm" >确认</el-button></div>
    </div>
</template>

<script >
  import bus from '../assets/bus'
  import  CustomerManage from '../components/CustomerManage.vue'
  import address from '../../static/data/address.json'
    export default{
        name: 'edit-address',
        components: {CustomerManage},
        data () {
            return {
              textarea2:'',
              goodsList: [],
              goodInfo: '',
              options: [],
              selectedOptions: [],
              taker: '',
              addressItem: '',
              mobile: '',
              optionAddress: ''
            }
        },
      mounted: function() {
        var that=this;
        var data = sessionStorage.ItemAddress;
        if (data) {
          that.goodsList = JSON.parse(data);
          if(that.goodsList.province=='0'){
              that.goodsList.province=that.goodsList.city;
          }
          that.selectedOptions=[that.goodsList.province,that.goodsList.city,that.goodsList.area];
          console.log("sss",that.goodsList.province,that.goodsList.city,that.goodsList.area);
          that.taker=that.goodsList.taker;
          that.addressItem=that.goodsList.address;
          that.mobile=that.goodsList.mobile;
        }
        that.init();

      },
      methods: {
        toBack: function () {


      /*      bus.$emit('curPage', 'main');*/
      console.log('ediraddress');
          setTimeout(function() {
            bus.$emit('userpage', 'customer-manage')
          },1000);


        },
        handleChange(value) {
          this.goodsList.city='';
          this.goodsList.area='';
          this.optionAddress=value;
        },
        confirm:function () {
          var that=this;
          var index_opt=0;
          if( that.taker && that.mobile && that.addressItem) {
            if (sessionStorage.ItemAddress) {
              index_opt = 1;
            }
            var procince=that.optionAddress[0] || that.goodsList.province;
            var city=that.optionAddress[1] ||that.goodsList.city
            var area=that.optionAddress[2] ||that.goodsList.area

            console.log('procince',procince);
            var userInfo = JSON.parse(sessionStorage.userInfo);
            that.$http.get(globalPath+'/ManageAddress', {
              params: {
                opt: index_opt,
                userId: userInfo.id,
                account: userInfo.name,
                password: userInfo.password,
                addressId: that.goodsList.addressId,
                country: 0,
                province: encodeURIComponent(procince),
                city: encodeURIComponent(city),
                area: encodeURIComponent(area),
                taker: encodeURIComponent(that.taker),
                mobile: that.mobile,
                address: encodeURIComponent(that.addressItem),
                isDefault: 'N',
                tel: 0,
                post: 0,
                street: 0,
              }
            }).then(function (res) {
              if (res.body > 0) {
                that.$message.error('编辑成功');
              }
            });
            that.toBack();
          }else {
            this.$message('你的地址资料还没用填写全，请填写全再提交');
          }
        },
        init: function () {
          $('.mobile .el-textarea__inner').attr('onkeyup',"this.value=this.value.replace(/\\D/g,'')");
          $('.mobile .el-textarea__inner').attr('onafterpaste',"this.value=this.value.replace(/\\D/g,'')");
          var infoArray=[];
          $(address).each(function (index,element) {
            var childrendata=[];
            if(element.city){
              $(element.city).each(function (index, element) {
                var childrendata2 = [];
                if (element.area) {
                  $(element.area).each(function (index, element) {
                    var data3 = {
                      value: element,
                      label: element
                    }
                    childrendata2.push(data3);
                  });
                } else {
                  childrendata2 = null;
                }
                var data2 = {
                  value: element.name,
                  label: element.name,
                  children: childrendata2
                }
                childrendata.push(data2);
              });
            }else {
              childrendata=null;
            }
            var data={
              value: element.name,
              label: element.name,
              children: childrendata
            }
            infoArray.push(data);
          });
          this.options= infoArray;
        }

      }
    }
</script>

<style scoped>

  .header{
    border-bottom:  1px solid rgba(0, 0, 0, 0.22);
  }
  .header i {
    padding: 0px 15px 0px 15px;
    vertical-align: middle;
    display: inline-block;
    width: 50px;
    height: 50px;
    line-height: 50px;
  }
  .header span{
    vertical-align: middle;
    display: inline-block;
  }

  .main{
    display: inline-block;
    width: auto;
    position: relative;
    left: 50%;
    margin-top: 10%;
    transform: translateX(-50%);
  }
  .main div{
    margin: 10px auto;
  }
  .main .item{
    width: 100px;
    padding: 0px 5px 0px 5px;
    text-align: center;
    display: inline-block;
  }
  .el-cascader{
    width: 250px;
  }
  .el-textarea{
    display: inline-block;
    width: 300px;
    vertical-align: middle;
  }
  .confirm-button{
     text-align: center;
  }
  .el-button{
    width: 150px;
    border-radius: 15px;
    background-color: #ffa538;
    color: white;
    font-size: 15px;
    border: 0px;
  }
</style>
