<template>
    <div class="header_container">

		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/manage' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item v-for="(item, index) in $route.meta.titArr" :key="index">{{item}}</el-breadcrumb-item>
		</el-breadcrumb>
		<el-dropdown @command="handleCommand" menu-align='start'>
      <span class="point-hover">
  			<img src="../assets/avator.jpg" class="avator">
        <span>{{adminName}}</span>
      </span>
			<el-dropdown-menu slot="dropdown">
				<!--<el-dropdown-item command="home">首页</el-dropdown-item>-->
				<el-dropdown-item command="singout">退出</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
    </div>
</template>

<script>
	//import {signout} from '@/api/getdatas'
	import {baseImgPath} from '@/config/env'
  import {removeStore, getStore} from '@/config/mUtils'
    import {mapState, mapActions} from 'vuex'
    export default {
    	data(){
    		return {
    		}
    	},
    	created(){
    	},
    	computed: {
    		...mapState(['adminInfo', 'adminName'])
    	},
      methods: {
        ...mapActions(['changelogin']),
        handleCommand(command) {
          if(command == 'singout'){
            this.changelogin({useidinfo: '', UseName: '', Token: ''})
            this.$message({
              type: 'success',
              message: '您已成功退出登录'
            });
            this.$router.push('/')
          }
        }
      }
    }
</script>

<style lang="less">
	@import '../style/mixin';
	.header_container{
		background-color: #EFF2F7;
		height: 60px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-left: 20px;
	}
  .point-hover {
    cursor: pointer;
    margin-right: 23px;
  }
	.avator{
		.wh(36px, 36px);
		border-radius: 50%;
		margin-right: 10px;
    vertical-align: middle;
	}
  .avator + span {
    vertical-align: middle;
  }
	.el-dropdown-menu__item{
    text-align: center;
  }
</style>
