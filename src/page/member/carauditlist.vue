<template>
    <div class="caraudit-list">
      <head-top></head-top>
      <div class="table_container">
        <el-row class="topFS">
          <el-date-picker
            v-model="choosetime"
            type="daterange"
            @change="changetime"
            :unlink-panels="true"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-input v-model="companyname" placeholder="会员商户部分名称" min="100"></el-input>
          <el-button type="primary" @click="TruckGetPage">搜索</el-button>
        </el-row>
        <el-table v-loading="loading" :data="listData" style="width: 100%">
          <!-- <el-table-column
            label="货车编码"
            prop="TruckID">
          </el-table-column> -->
          <el-table-column
            label="会员商户名称"
            prop="MerchantName">
          </el-table-column>
          <el-table-column
            label="已审核条数"
            prop="OnlineCount">
          </el-table-column>
          <el-table-column
            label="车牌号码"
            prop="TruckCode">
          </el-table-column>
          <el-table-column
            label="车型名称"
            prop="ModelName">
          </el-table-column>
          <el-table-column
            label="申请人姓名"
            prop="ApplyName">
          </el-table-column>
          <el-table-column
            label="申请时间"
            width="160px"
            prop="ApplyTime">
          </el-table-column>
          <el-table-column
            label="车长"
            width="100px"
            prop="Long">
          </el-table-column>
          <el-table-column
            label="载重"
            width="100px"
            prop="Load">
          </el-table-column>
          <el-table-column label="审核" width="190px">
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)">审核</el-button>
            </template>
          </el-table-column>
        </el-table>

        <div class="Pagination">
          <el-pagination
            @size-change = "handleSizeChange"
            @current-change = "handleCurrentChange"
            :current-page = "currentPage"
            :page-size = "PageSize"
            layout = "total, prev, pager, next"
            :total = "count">
          </el-pagination>
        </div>
        <el-dialog title="审核" :visible.sync="dialogFormVisible" class="specaildialog" width="500px">
          <el-form :model="tableDatalist" ref="tableDatalist">
            <el-form-item label="会员商户名称" label-width="110px">
              <el-input type="text" v-model="tableDatalist.MerchantName" auto-complete="off" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="拒绝原因" label-width="110px">
              <el-input type="textarea" v-model="refuseContent" auto-complete="off"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="operate(2, 'tableDatalist')">拒 绝</el-button>
            <el-button type="primary" @click="operate(1)">通 过</el-button>
          </div>
        </el-dialog>
      </div>
    </div>
</template>

<script>
  import headTop from '../../components/headTop'
  import { TruckGetPage, TruckPass, TruckRefuse } from '@/api/getdatas'
  import { gettimes } from '@/config/getTimes'
  import { mapState } from 'vuex'

  export default {
    components: {
      headTop
    },
    data () {
      return {
        loading: true,
        listData: [],
        count: 0,
        currentPage: 1,
        choosetime: [new Date().setDate(new Date().getDate() - 7), new Date()],
        companyname: '',
        PageSize: 20,
        TotalRecords: 0,
        dialogFormVisible: false,
        refuseContent: '',
        tableDatalist: {}
      }
    },
    computed: {
      ...mapState(['adminInfo'])
    },
    created () {
      this.TruckGetPage()
    },
    methods: {
      async TruckGetPage () {
        let form = new FormData()
        if (this.companyname) {
          form.append("Name", this.companyname)
        }
        if (this.choosetime) {
          form.append("FromDate", gettimes(this.choosetime[0]))
          form.append("ToDate", gettimes(this.choosetime[1]))
        } else {
          this.$message.error("搜索时间不能为空！")
          return
        }
        this.loading = true
        form.append("PageIndex", this.currentPage)
        form.append("PageSize", this.PageSize)
        form.append("TotalRecords", this.TotalRecords)
        const requestData = await TruckGetPage(form)
        if (requestData.ResultCode == "000000") {
          this.$message({
            type: 'success',
            message: requestData.ResultMessage
          })
          this.count = requestData.TotalRecords
          this.listData = requestData.ResultValue
          this.currentPage = 1
          this.loading = false
        }else{
          this.$message({
            type: 'error',
            message: requestData.ResultMessage
          })
        }
      },
      handleEdit (index, row) {
        this.refuseContent = ''
        this.dialogFormVisible = true
        this.tableDatalist = row
      },
      async operate (type, formname) {
        let form = new FormData()
        form.append('TruckID', this.tableDatalist.TruckID)
        form.append('LoginID', this.adminInfo);
        if (type === 1) {
          this.dialogFormVisible = false
          const requestData = await TruckPass(form)
          if (requestData.ResultCode == "000000") {
            this.TruckGetPage()
          } else {
            this.$message({
              type: 'error',
              message: requestData.ResultMessage
            })
          }
        } else if (type === 2) {
          if (!this.refuseContent) {
            this.$message({
              type: 'error',
              message: '请输入拒绝原因'
            })
            return
          }
          this.dialogFormVisible = false
          form.append('Reason', this.refuseContent)
          const requestData = await TruckRefuse(form)
          if (requestData.ResultCode == "000000") {
            this.TruckGetPage()
          } else {
            this.$message({
              type: 'error',
              message: requestData.ResultMessage
            })
          }
        }
      },
      changetime () {

      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.TruckGetPage()
      },
      gourl (url) {
        this.$router.push({path: url})
      }
    }
  }
</script>
<style scoped lang="less">
  @import '../../style/mixin';
  .topFS .el-input{width:250px;}
</style>