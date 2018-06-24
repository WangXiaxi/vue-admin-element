<template>
  <div>
    <div class="login-page">
      <div class="login-pic">
        <img src="../../assets/image/loginbg.jpg" alt="">
      </div>
      <div class="login-box animated fadeIndown">
        <div class="login-logo">
          <img src="../../assets/image/logo.png" alt="">
        </div>
        <div class="login-info">
          <h4>重置密码</h4>
        </div>
        <el-form :model="loginForm" :rules="rules"  ref="loginForm">
          <el-form-item prop="username" class="login-list">
            <span class="iconbox"><em class="base-icon headicon"></em></span>
            <input v-model="loginForm.username" placeholder="手机号">
          </el-form-item>
          <el-form-item prop="password" class="login-list">
            <span class="iconbox"><em class="base-icon lockicon"></em></span>
            <input type="password" placeholder="新密码" v-model="loginForm.password">
          </el-form-item>
          <el-form-item prop="smscode" class="login-list">
            <span class="iconbox"><em class="base-icon rdicon"></em></span>
            <input placeholder="验证码" v-model="loginForm.smscode">
          </el-form-item>
          <el-form-item class="login-list">
            <el-button type="primary" @click="SendCode()" class="submit_btn" v-if="smscode==true">获取验证码</el-button>
            <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn"  v-else>提交</el-button>
          </el-form-item>
          <a class="login-link" @click="changelink">登录</a>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {SmsSdhSendCode,AdminForget,freegeoip,AdminLogin} from '@/api/getdatas'
  import {baseUrl} from '@/config/env';
  import {setStore} from '@/config/mUtils';
  import axios from 'axios';
  export default {
    name: 'register',
    data () {
      return {
        baseUrl,
        isReadOnly: false,
        smscode:true,
        loginForm: {
          username: '',
          password: '',
          smscode:'',
        },
        ipid:'',
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          smscode: [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ],
        },
        showLogin: false,
      }
    },
    created() {
      //this.restaurant_id = this.$route.query.restaurant_id;
      this.getipfunction();
    },
    computed: {
      demo: function(){
        if(this.type){
          return 'readonly';
        }else{
          return "";
        }
      }
    },
    methods: {
      //提交
      async submitForm(formName) {
        this.$refs[formName].validate(async (valid,validate) => {
          if (valid) {
            let form = new FormData();
            form.append("Mobile", this.loginForm.username);
            form.append("NewPWD", this.loginForm.password);
            form.append("SmsCode", this.loginForm.smscode);
            form.append("IP", this.ipid);
            const res = await AdminForget(form)
            if (res.ResultCode == "000000") {
              this.$message({
                type: 'success',
                message: '登录成功'
              });
              setStore("UseId",res.ResultValue.LoginID);              
              this.$router.push('/rolelist')
            }else{
              this.$message({
                type: 'error',
                message: res.ResultMessage
              });
            }
          } else {
            this.$notify.error({
              title: '错误',
              message: '请确认您已输入信息',
              offset: 100
            });
            return false;
          }

        });
      },
      //发送验证码
      async SendCode() {
        let form = new FormData();
        if(this.loginForm.username!=""){
          form.append("Mobile", this.loginForm.username);
        }else{
          this.$message({
            type: 'error',
            message: '请先输入账号手机号码'
          });
          return false;
        }
        const restaurants = await SmsSdhSendCode(form);
        if (restaurants.ResultCode == "000000") {
          this.smscode=false;
          this.$message({
            type: 'success',
            message: restaurants.ResultMessage
          });
        } else {
          this.$message({
            type: 'error',
            message: restaurants.ResultMessage
          });
        }
      },
      getipfunction(){
        let _this=this;
        axios.get('http://freegeoip.net/json/').then((response) => {
          _this.ipid=response.data.ip;
        }).catch((error) => {
          console.error(error);
        });
      },
      changelink(){
        this.$router.push('/')
      },
    },
    watch: {
      smscode: function (val, oldVal) {
        console.log('new: %s, old: %s', val, oldVal)
      },
    }
  }
</script>
<style>
  .base-icon{background: url(../../assets/image/adminicon.png) no-repeat;display:inline-block;vertical-align: middle;}
  .headicon,.lockicon,.rdicon{width:36px;height:36px;background-position:-89px 0;margin: 6px 7px 8px 11px;}
  .lockicon{background-position:-126px 0;}
  .rdicon{background-position:-166px 0;}
  .triggleicon{width:12px;height:6px;background-position:-50px 0;transition: all .5s;margin-left:6px ;}
  .triggleicon.cur{transform: rotate(180deg);}
  .login-page{width:100%;height:100%;overflow: hidden;position: fixed;}
  .login-pic,.login-box{position: absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:100;}
  .login-box{width:300px;height:420px;transform:translate(0,0);margin:-230px auto auto -190px;padding:40px;background: rgba(0,0,0,.2);border-radius: 10px;
    box-shadow:0 0 30px 4px rgba(255,255,255,.2), 0 0 50px 1px rgba(0,0,0,.2) inset;}
  .login-logo{margin-bottom:10px;height:60px;}
  .login-logo img{display: block;margin:0 auto;width:60px;height:60px;}
  .login-info{}
  .login-info h4{text-align: center;color:#90C320;font-size:18px;line-height:250%;}
  .login-info p{font-size:14px;color:#90C320;line-height:250%;text-align: center;}
  .login-list{width:100%;height:50px;line-height:50px;border-radius:4px;overflow: hidden;background: #fff;margin-top:20px;}
  .login-list span.iconbox{display: block;width:54px;height:50px;background:rgba(144,195,32,.8);float:left;}
  .login-list input,.login-list .el-input{width:220px;float:left;line-height:50px;height:50px;padding:0 13px;font-size:16px;color:#6c6c6c;}
  .login-list .submit_btn{display: block;width:100%;height:50px;text-align: center;background:rgba(144,195,32,.8);color:#fff;font-size:18px;cursor: pointer;border:none;}
  .login-list .submit_btn:hover{background:rgba(144,195,32,1);}
  .login-link{color:#90C320;display: block;line-height:20px;text-align: right;font-size:12px;margin-top:-10px;cursor: pointer;}
</style>
