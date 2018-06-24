<template>
  <div class="manage_page fillcontain">
    <el-row style="height: 100%;">
      <div class="menu-big-box" :class="{collapse: collapse}">
        <div class="menu-inner">
          <el-menu :default-active="defaultActive" theme="dark" router :unique-opened="true" :collapse="collapse">
            <el-menu-item index="manage">
              <i class="el-icon-menu"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu index="2">
              <template slot="title"><i class="el-icon-document"></i><span slot="title">会员管理</span></template>
              <el-menu-item index="shoplist">正式会员</el-menu-item>
              <!-- <el-menu-item index="shopexamine">待审核会员</el-menu-item> -->
              <el-menu-item index="busManagement">商户管理</el-menu-item>
              <el-menu-item index="railway">专线列表</el-menu-item>
              <el-menu-item index="carauditlist">货车审核列表</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title"><i class="el-icon-star-on"></i><span slot="title">订单管理</span></template>
              <el-menu-item index="waybill">货源订单</el-menu-item>
              <el-menu-item index="cancelled">取消订单</el-menu-item>
              <el-menu-item index="evaluate">运单评价</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title"><i class="el-icon-phone-outline"></i><span slot="title">市场管理</span></template>
              <el-menu-item index="agentlist">市场代理</el-menu-item>
              <!--<el-menu-item index="">速达汇app</el-menu-item>-->
              <!--<el-menu-item index="">资讯编辑</el-menu-item>-->
              <el-menu-item index="joinmessage">加盟留言</el-menu-item>
              <el-menu-item index="mail">站内信</el-menu-item>
              <!-- <el-menu-item index="parameter">参数管理</el-menu-item> -->
              <el-menu-item index="article-list">文章资讯</el-menu-item>
              <el-menu-item index="feedback">意见反馈</el-menu-item>
            </el-submenu>
            <el-submenu index="5">
              <template slot="title"><i class="el-icon-edit"></i><span slot="title">运营管理</span></template>
              <!--<el-menu-item index="">速达汇资讯</el-menu-item>-->
              <el-menu-item index="goodstype">货物类型</el-menu-item>
              <el-menu-item index="carmodel">车型</el-menu-item>
            </el-submenu>
            <el-submenu index="6">
              <template slot="title"><i class="el-icon-plus"></i><span slot="title">财务管理</span></template>
              <el-menu-item index="recharge">充值记录</el-menu-item>
              <el-menu-item index="withdrawals">提现记录</el-menu-item>
              <el-menu-item index="inthepresent">提现管理</el-menu-item>
              <!-- 1.0.5 -->
              <el-menu-item index="membership">会员账户</el-menu-item>
              <!-- <el-menu-item index="bail">保证金</el-menu-item> -->
              <el-menu-item index="commissions">佣金收入</el-menu-item>
              <!-- 1.0.5 -->
            </el-submenu>
            <!--<el-submenu index="7">-->
              <!--<template slot="title"><i class="el-icon-star-on"></i>报表管理</template>-->
              <!--<el-menu-item index="">数据统计</el-menu-item>-->
              <!--<el-menu-item index="">数据导出</el-menu-item>-->
            <!--</el-submenu>-->
            <el-submenu index="9">
              <template slot="title"><i class="el-icon-printer"></i><span slot="title">平台管理</span></template>
              <el-menu-item index="commissionSetting">佣金设置</el-menu-item>
              <el-menu-item index="specialLine">专线限制</el-menu-item>
            </el-submenu>
            <el-submenu index="10">
              <template slot="title"><i class="el-icon-warning"></i><span slot="title">系统管理</span></template>
              <el-menu-item index="adminslist">管理员列表</el-menu-item>
              <el-menu-item index="rolelist">角色等级</el-menu-item>
              <el-menu-item index="module">功能权限</el-menu-item>
              <!--<el-menu-item index="">日志管理</el-menu-item>-->
            </el-submenu>
            <!--<el-submenu index="9">-->
              <!--<template slot="title"><i class="el-icon-edit"></i>信息以及评价</template>-->
              <!--<el-menu-item index="">车主评价</el-menu-item>-->
              <!--<el-menu-item index="">厂家评价</el-menu-item>-->
              <!--<el-menu-item index="">车主投诉</el-menu-item>-->
            <!--</el-submenu>-->
          </el-menu>
        </div>
        <div class="btn-collapse">
          <el-button class="btn" @click="collapse=!collapse"><i class="el-icon-arrow-left" :class="{'el-icon-arrow-right': collapse}"></i></el-button>
        </div>
      </div>
      <div class="content-big-box" :class="{collapse: collapse}">
        <router-view></router-view>
      </div>
    </el-row>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        collapse: false
      }
    },
    computed: {
      defaultActive: function(){
        return this.$route.path.replace('/', '');
      }
    },
  }
</script>
<style lang="less" scoped>
  @import '../style/mixin';
  .manage_page {
    .menu-big-box {
      height: 100%;
      box-sizing: border-box;
      background-color: #fff;
      overflow: hidden;
      width: 190px;
      position: absolute;
      top: 0;
      left: 0;
      transition: all 0.4s;
      .menu-inner {
        overflow-x: hidden;
        height: 100%;
        &>.el-menu {
          padding-bottom: 50px;
          min-height: 100%;
          box-sizing: border-box;
          &:not(.el-menu--collapse) {
            width: 190px;
          }
        }
      }
      &.collapse {
        width: 64px;
      }
      .btn-collapse {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%); 
        z-index: 1;
        text-align: center;
        .btn {
          background: rgba(255, 255, 255, 0.5)
        }
      }
    }
    .content-big-box {
      height: 100%;
      overflow: auto;
      margin-left: 190px;
      box-sizing: border-box;
      transition: all 0.4s;
      &.collapse {
        margin-left: 64px;
      }
    }
  }
</style>
