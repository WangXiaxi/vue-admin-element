<template>
    <div class="home">
      <head-top></head-top>
  		<section class="data-section" v-loading="loading">
  			<header class="section-title">数据统计</header>
        <div class="el-tips">待审核申请</div>
        <el-row :gutter="12">
          <el-col :sm="12" :md="6">
            <div class="num-box">
              <p class="t">
                待审核会员：
              </p>
              <p class="v">
                {{allData.PendingApplication.PendingMerchantQuantity}}
              </p>
            </div>
          </el-col>
          <el-col :sm="12" :md="6">
            <div class="num-box">
              <p class="t">
                待审核专线：
              </p>
              <p class="v">
                {{allData.PendingApplication.PendingDDNQuantity}}
              </p>
            </div>
          </el-col>
          <el-col :sm="12" :md="6">
            <div class="num-box">
              <p class="t">
                待审核车辆：
              </p>
              <p class="v">
                {{allData.PendingApplication.PendingVehicleQuantity}}
              </p>
            </div>
          </el-col>
          <el-col :sm="12" :md="6">
            <div class="num-box">
              <p class="t">
                待审核提现申请：
              </p>
              <p class="v">
                {{allData.PendingApplication.PendingWithdrawalQuantity}}
              </p>
            </div>
          </el-col>
        </el-row>
        <div class="el-tips">会员数据</div>
        <el-row :gutter="12">
          <el-col :sm="12" :md="6">
            <div class="num-box">
              <p class="t">
                正式会员：
              </p>
              <p class="v">
                {{allData.MemberDemographics.FullMembershipQuantity}}
              </p>
            </div>
          </el-col>
        </el-row>
        <div class="el-tips">订单数据</div>
        <el-row :gutter="12">
          <el-col :sm="12" :md="6">
            <div class="num-box">
              <p class="t">
                昨日货源订单：
              </p>
              <p class="v">
                {{allData.OrderModifiers.Y_OrderQuantity}}
              </p>
            </div>
          </el-col>
          <el-col :sm="12" :md="6">
            <div class="num-box">
              <p class="t">
                昨日违约订单：
              </p>
              <p class="v">
                {{allData.OrderModifiers.Y_OrderRenegeQuantity}}
              </p>
            </div>
          </el-col>
        </el-row>
        <div class="el-tips">市场管理</div>
        <el-row :gutter="12">
          <el-col :sm="12" :md="6">
            <div class="num-box">
              <p class="t">
                代理商：
              </p>
              <p class="v">
                {{allData.MarketRegulation.AgentsQuantity}}
              </p>
            </div>
          </el-col>
        </el-row>
        <div class="el-tips">公司财务</div>
        <el-row :gutter="12">
          <el-col :sm="12" :md="6">
            <div class="num-box">
              <p class="t">
                公司账户：
              </p>
              <p class="v">
                {{numToW(allData.CorporateFinance.CompanyAccount)}}
              </p>
            </div>
          </el-col>
          <el-col :sm="12" :md="6">
            <div class="num-box">
              <p class="t">
                会员账户：
              </p>
              <p class="v">
                {{numToW(allData.CorporateFinance.MerchantAccount)}}
              </p>
            </div>
          </el-col>
          <el-col :sm="12" :md="6">
            <div class="num-box">
              <p class="t">
                保证金：
              </p>
              <p class="v">
                {{numToW(allData.CorporateFinance.BailAccount)}}
              </p>
            </div>
          </el-col>
          <el-col :sm="12" :md="6">
            <div class="num-box">
              <p class="t">
                平台佣金：
              </p>
              <p class="v">
                {{numToW(allData.CorporateFinance.PlatformCommission)}}
              </p>
            </div>
          </el-col>
        </el-row>
  		</section>
    </div>
</template>

<script>
	import headTop from '../components/headTop'
	import dtime from 'time-formater'
	import { GetIndex } from '@/api/getdatas'
  import { gettimes } from '@/config/getTimes'
  import qs from 'qs'
  export default {
    components: {
      headTop
    },
    data () {
      return {
        loading: true,
        allData: {
          PendingApplication: { PendingMerchantQuantity: 0, PendingDDNQuantity: 0, PendingVehicleQuantity: 0, PendingWithdrawalQuantity: 0 },
          MemberDemographics: { FullMembershipQuantity: 0 }, 
          OrderModifiers: { Y_OrderQuantity: 0, Y_OrderRenegeQuantity: 0 },
          MarketRegulation: { AgentsQuantity: 0 },
          CorporateFinance: { CompanyAccount: 0, MerchantAccount: 0, BailAccount: 0, PlatformCommission: 0 }
        }
      }
    },
    created () {
      this.getAllData()
    },
    computed: {
    },
    methods: {
      async getAllData () { // 获取所有数据
        const res = await GetIndex()
        console.log(JSON.stringify(res.ResultValue))
        if (res.ResultCode === '000000') {
          this.allData = res.ResultValue
        }
        this.loading = false
      },
      numToW (n) { // 显示万 并四舍五入
        let num = Number(n)
        return num > 9999 ? (Math.floor(num/1000)/10) + '万' : num
      }
    }
  }
</script>
<style scoped lang="less">
  @import '../style/mixin';
  .home {
    min-height: 100%;
    width: 100%;
    background: #fdfdfd;
    .data-section {
      position: relative;
      padding: 0 20px 30px;
      .section-title {
        text-align: left;
        font-size: 20px;
        line-height: 1;
        padding: 20px 0 10px;
        margin-bottom: 10px;
      }
      .num-box {
        cursor: pointer;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 2px 3px hsla(0,0%,4%,.1), 0 0 0 1px hsla(0,0%,4%,.1);
        padding: 20px;
        overflow: hidden;
        margin-bottom: 10px;
        .t {
          font-size: 16px;
          white-space: nowrap;
          margin-bottom: 12px;
        }
        .V {
          font-size: 24px;
        }
      }
    }
  }
</style>