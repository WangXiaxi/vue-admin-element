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
          <h4>管理员注册</h4>
        </div>
        <el-form :model="loginForm" :rules="rules"  ref="loginForm">
          <el-form-item prop="username" class="login-list">
            <span class="iconbox"><em class="base-icon headicon"></em></span>
            <input v-model="loginForm.username" placeholder="姓名">
          </el-form-item>
          <el-form-item>
            <el-select v-model="loginForm.RoleName" @change="handleSelect" class="selectrig">
              <el-option
                v-for="item in selectedCategory"
                :key="item.value"
                :label="item.label"
                :value="item.index">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="Mobile" class="login-list">
            <span class="iconbox"><em class="base-icon rdicon"></em></span>
            <input placeholder="手机号" v-model="loginForm.Mobile">
          </el-form-item>
          <el-form-item class="login-list">
            <el-button type="primary" @click="submitForm('loginForm')" class="submit_btn" >提交</el-button>
          </el-form-item>
          <a class="login-link" @click="changelink">登录</a>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import {AdminLogin,AdminRegister,DropdownRole} from '@/api/getdatas'
  import {baseUrl} from '@/config/env'
  import regExp from '@/config/regExp'
  import axios from 'axios'
    import {mapActions} from 'vuex'
  export default {
    name: 'register',
    components: {
      regExp
    },
    data () {
      return {
        baseUrl,
        isReadOnly: false,
        smscode:true,
        sex:0,
        loginForm: {
          username: '',
          Mobile: '',
          RoleID:'',
          RoleName:'',
        },
        selectedCategory:[],
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          Mobile: [
            { required: true, message: '手机号码不能为空', trigger: 'blur' },
            { pattern: regExp.Phone, message: '手机号码格式不正确', trigger: 'blur' }
          ],

        },
        showLogin: false,
      }
    },
    created() {
      //this.restaurant_id = this.$route.query.restaurant_id;
      this.RoleList();
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
      ...mapActions(['changelogin']),
      //提交
      async submitForm(formName) {
        this.$refs[formName].validate(async (valid,validate) => {
          if (valid) {
            let form = new FormData();
            form.append("Name", this.loginForm.username);
            form.append("Mobile", this.loginForm.Mobile);
            form.append("Sex", this.sex);
            form.append("RoleID", this.loginForm.RoleID);
            const res = await AdminRegister(form)
            if (res.ResultCode == '000000') {
              this.$notify({
                title: '注册成功',
                message: '您的账户密码是'+res.ResultValue+',请联系主管审核',
                type: 'success'
              });
            }else{
              this.$message({
                type: 'error',
                message: res.ResultMessage
              });
            }
          } else {
            this.$notify.error({
              title: '错误',
              message: '请仔细检查您的姓名或手机号是否输入正确',
              offset: 100
            });
            return false;
          }

        });
      },
      //获取管理员角色（编辑操作用到）
      async AdminLogin(formdata){
        const Logininfo = await AdminLogin(formdata);
        if (res.ResultCode == "000000") {
          this.$message({
            type: 'success',
            message: '登录成功'
          });
          this.changelogin({useidinfo: res.ResultValue.LoginID, UseName: res.ResultValue.LoginName, Token: res.ResultValue.Token})
          this.$router.push('/rolelist')
        }else{
          this.$message({
            type: 'error',
            message: res.ResultMessage
          });
        }
      },
      //获取管理员角色（编辑操作用到）
      async RoleList(){
        const RoleLists = await DropdownRole();
        RoleLists.ResultValue.forEach((item, index) => {
          this.selectedCategory.push({
            label: item.RoleName,
            value: item.RoleID,
            index,
          })
        })
        console.log(this.selectedCategory)
        this.handleSelect(0)
      },
      changelink(){
        this.$router.push('/')
      },
      handleSelect(index){
        console.log(index)
        this.loginForm.RoleName = index;
        this.loginForm.RoleID = this.selectedCategory[index].value;
      },
    },
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
  .selectrig{line-height:50px;height:50px;width:100%;}
  .selectrig .el-input__inner{height:48px;font-size:16px;color:#6c6c6c;}
</style>
