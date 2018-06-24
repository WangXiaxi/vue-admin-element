<template>
  <div>
    <div class="login-page" v-loading="loading">
      <div class="login-pic">
        <img src="../../assets/image/loginbg.jpg" alt="">
      </div>
      <div class="login-box animated fadeIndown">
        <div class="login-logo">
          <img src="../../assets/image/logo.png" alt="">
        </div>
        <div class="login-info">
          <h4>欢迎来到速达汇后台</h4>
          <p>Login in. To see it in action.</p>
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <el-form-item prop="username" class="login-list">
            <span class="iconbox"><em class="base-icon headicon"></em></span>
            <input v-model="loginForm.username" placeholder="手机号">
          </el-form-item>
          <el-form-item prop="password" class="login-list">
            <span class="iconbox"><em class="base-icon lockicon"></em></span>
            <input type="password" placeholder="密码" v-model="loginForm.password">
          </el-form-item>
          <el-form-item class="login-list">
            <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登录</el-button>
          </el-form-item>
          <div class="login-linkbox">
            <a class="login-link" @click="changelink(0)">注册</a>
            <a class="login-link" @click="changelink(1)">找回密码</a>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {AdminLogin} from '@/api/getdatas'
  import {baseUrl} from '@/config/env';
  import {setStore} from '@/config/mUtils';
  import {mapState, mapActions} from 'vuex'
  export default {
    name: 'login',
    data () {
      return {
        baseUrl,
        isReadOnly: false,
        loading: false,
        loginForm: {
          username: '',
          password: '',
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
        },
        showLogin: false,
      }
    },
    created () {
      if (!this.adminInfo || !this.adminName) {
        return false;
      }else{
        this.$router.push('/rolelist')
      }
    },
    computed: {
      ...mapState(['adminInfo', 'adminName']),
    },
    methods: {
      ...mapActions(['changelogin']),
      changelink(index){
        if(index==0){
          this.$router.push('register')
        }else{
          this.$router.push('forget')
        }
      },
      async submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let form = new FormData();
            form.append("LoginCode", this.loginForm.username);
            form.append("LoginPassword", this.loginForm.password);
            this.loading = true;
            const res = await AdminLogin(form);
            setTimeout(() => { // 添加感知
              this.loading = false;
            }, 500)
            if (res.ResultCode == "000000") {
              this.changelogin({useidinfo: res.ResultValue.LoginID, UseName: res.ResultValue.LoginName, Token: res.ResultValue.Token})
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
              message: '请输入正确的用户名密码',
              offset: 100
            });
            return false;
          }

        });
      },
    }
  }
</script>
<style>
  .login-page .el-loading-mask{background-color: rgba(255,255,255,0.1)}
  .base-icon{background: url(../../assets/image/adminicon.png) no-repeat;display:inline-block;vertical-align: middle;}
  .headicon,.lockicon,.rdicon{width:36px;height:36px;background-position:-89px 0;margin: 6px 7px 8px 11px;}
  .lockicon{background-position:-126px 0;}
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
  .login-linkbox{line-height:20px;font-size:12px;margin-top:-10px;}
  .login-link{color:#90C320;cursor: pointer;float:right;}
  .login-linkbox .login-link:first-child{float:left;}
</style>
