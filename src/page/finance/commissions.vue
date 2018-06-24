<template>
  <div class="commissions">
    <head-top></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-input v-model="listInfo.MerchantName" placeholder="会员名称关键词" min="100"></el-input>
        <el-cascader
          :options="optionsArea"
          v-model="areaCode"
          :clearable="true"
          change-on-select
          @change="areaChangeAct">
        </el-cascader>
        <el-select v-model="listInfo.MerchantType" placeholder="请选择会员类型" :clearable="true">
          <el-option v-for="(item, index) in optionsSelect" :label="item.label" :value="item.value" :key="index"></el-option>
        </el-select>

        <el-date-picker
          v-model="curDataArr"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          :unlink-panels="true"
          @change="searchTimeChoose"
          end-placeholder="结束日期">
        </el-date-picker>

        <el-button type="primary" @click="getTablePage">搜 索</el-button>
        <div class="el-tips">会员数量：<strong class="red">{{listInfo.TotalRecords}}</strong>&nbsp;&nbsp;&nbsp;&nbsp;佣金收入总额：<strong class="red">{{listInfo.TotalRecords}}</strong></div>
      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="会员名称"
          prop="MercName">
        </el-table-column>
        <el-table-column
          label="会员类型"
          prop="MercType">
        </el-table-column>
        <el-table-column
          label="交易单号"
          prop="Address">
        </el-table-column>
        
        <el-table-column
          label="登陆账号"
          prop="Mobile">
        </el-table-column>
        <el-table-column
          label="登陆账号"
          prop="Balance">
        </el-table-column>
        <el-table-column
          label="佣金金额（元）"
          prop="Balance">
        </el-table-column>
        <el-table-column
          label="提取时间"
          prop="Balance">
        </el-table-column>
      </el-table>
      <!-- 选择页码 -->
      <div class="Pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="listInfo.PageIndex"
          :page-size="listInfo.PageSize"
          layout="total, prev, pager, next"
          :total="listInfo.TotalRecords">
        </el-pagination>
      </div>
      <!-- 选择页码 end -->
    </div>
  </div>
</template>
<script>
  import headTop from '../../components/headTop'
  import address from '../../config/address'
  import { MerchantBalance } from '@/api/getdatas'
  import qs from 'qs'
  export default {
    components: {
      headTop
    },
    data () {
      return {
        loading: false,
        tableData: [],
        optionsSelect: [
          {label: '物流公司', value: 2},
          {label: '个体司机', value: 3}
        ],
        areaCode: [], // 地区code
        optionsArea: address.area,
        listInfo: {
          MerchantName: '',
          MerchantType: 2,
          ProvinceID: '',
          CityID: '',
          CountyID: '',
          PageIndex: 1,
          PageSize: 20,
          TotalRecords: 0
        },
        curDataArr: [] // 时间组件 时间数值
      }
    },
    created () {
      this.getTablePage()
    },
    methods: {
      async getTablePage () { // 获取数据
        this.loading = true
        let qsData = qs.stringify(this.listInfo, {arrayFormat: 'indices'})
        const resData = await MerchantBalance(qsData)
        this.loading = false
        if (resData.ResultCode == "000000") {
          this.tableData = resData.ResultValue
          this.listInfo.TotalRecords = resData.TotalRecords
        }
      },
      areaChangeAct () { // 选中
        this.listInfo.ProvinceID = this.areaCode[0]
        this.listInfo.CityID = this.areaCode[1] ? this.areaCode[1] : ''
        this.listInfo.CountyID = this.areaCode[2] ? this.areaCode[2] : ''
      },
      handleSizeChange (val) {
        console.log(`每页 ${val} 条`)
      },
      handleCurrentChange (val) {
        this.listInfo.PageIndex = val
        this.getTablePage()
      },
      searchTimeChoose () { // 时间改变执行函数
        console.log(this.curDataArr)
      }
    }
  }
</script>
<style lang="less" scoped>
  .el-tips {
    font-size: 15px;
  }
  .red {
    color: red;
  }
</style>