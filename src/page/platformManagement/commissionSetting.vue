<template>
  <div class="commissions-setting">
    <head-top></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-button type="primary" @click="changeBili">修改比例</el-button>
      </el-row>
      <el-row class="topFS">
        <div class="el-tips">当前佣金比例：<strong class="red">{{RateValue}}%</strong></div>
      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="佣金率"
          prop="RateValue">
        </el-table-column>
        <el-table-column
          label="生效时间"
          prop="StartTime">
        </el-table-column>
        
        <el-table-column
          label="设置时间"
          prop="CreateTime">
        </el-table-column>
        <el-table-column
          label="设置人"
          prop="CreatorName">
        </el-table-column>
      </el-table>
      <!-- 生效时间弹窗 -->
      <el-dialog title="修改佣金比例" :visible.sync="dialogFormVisible" class="specaildialog" width="500px">
        <el-form :model="listInfo" :rules="rules"  ref="editForm">
          <el-form-item label="佣金比例(%)" label-width="110px" prop="RateValue">
            <el-input v-model="listInfo.RateValue" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="生效时间" label-width="110px" prop="StartTime">
            <el-date-picker
              style="width:100%;"
              v-model="listInfo.StartTime"
              type="datetime"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="选择日期时间"
              align="right">
            </el-date-picker>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSure">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 生效时间弹窗 end -->
    </div>
  </div>
</template>
<script>
  import headTop from '../../components/headTop'
  import { BrokerageGet, BrokerageSet } from '@/api/getdatas'
  import qs from 'qs'
  import regExp from '@/config/regExp'

  export default {
    components: {
      headTop
    },
    computed: {
    },
    data () {
      return {
        loading: true,
        tableData: [],
        dialogFormVisible: false,
        RateValue: 0,
        listInfo: {
          RateValue: '',
          StartTime: ''
        },
        rules: {
          RateValue: [
            { required: true, message: '佣金比例不能为空', trigger: 'blur' },
            { pattern: regExp.Decimal, message: "请输入正确格式的佣金比例", trigger: "blur" }
          ],
          StartTime: [
            { required: true, message: '时间不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.getDataPage()
    },
    methods: {
      async handleSure () {
        this.$refs['editForm'].validate( async (valid) => {
          if (valid) {
            let form = qs.stringify(this.listInfo, {arrayFormat: 'indices'})
            const resData = await BrokerageSet(form)
            if (resData.ResultCode === "000000") {
              this.dialogFormVisible = false
              this.$message({
                type: 'success',
                message: resData.ResultMessage
              })
              this.getDataPage()
            } else {
              this.$message({
                type: 'error',
                message: resData.ResultMessage
              })
            }
          }
        })
      },
      async getDataPage () { // 获取列表
        this.loading = true
        const resData = await BrokerageGet()
        if (resData.ResultCode === "000000") {
          this.$message({
            type: 'success',
            message: resData.ResultMessage
          })
          this.tableData = resData.ResultValue
          this.RateValue = resData.RateValue
          this.loading = false
        } else {
          this.$message({
            type: 'error',
            message: resData.ResultMessage
          })
        }
      },
      changeBili () { // 修改比例
        this.dialogFormVisible = true
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