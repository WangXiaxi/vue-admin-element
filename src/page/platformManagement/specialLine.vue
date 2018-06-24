<template>
  <div class="commissions-setting">
    <head-top></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-button type="primary" @click="handleAdd">专线添加</el-button>
      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="专线名称"
          prop="RuleNumber">
        </el-table-column>
        <el-table-column
          label="保证金"
          prop="Amount">
        </el-table-column>
        <el-table-column
          label="状态"
          prop="StatusName">
        </el-table-column>
        <el-table-column
          label="设置时间"
          prop="CreateTime">
        </el-table-column>
        <el-table-column
          label="创建人"
          prop="CreatorName">
        </el-table-column>
        <el-table-column
          label="审核时间"
          prop="AuditTime">
        </el-table-column>
        <el-table-column
          label="审核人"
          prop="AuditorName">
        </el-table-column>
        <el-table-column
          width="300px"
          label="操作">
          <template slot-scope="scope">
            <el-button
                size="small"
                type="primary"
                @click="handleSure(scope.$index, scope.row)">审核</el-button>
              <el-button
                size="small"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)">更新</el-button>
              <el-button
                size="small"
                type="danger"
                v-if="scope.$index === tableData.length - 1"
                @click="handleDele(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 专线添加 -->
      <el-dialog title="专线添加" :visible.sync="dialogFormAddVisible" class="specaildialog" width="500px">
        <el-form :model="listInfo" :rules="rules" ref="editForm">
          <el-form-item label="保证金金额" label-width="110px" prop="Amount">
            <el-input v-model="listInfo.Amount" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item v-if="ifAddOrEdit" label="专线名称" label-width="110px" prop="RuleNumber">
            <el-input v-model="listInfo.RuleNumber" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormAddVisible = false">取 消</el-button>
          <el-button type="primary" v-if="ifAddOrEdit" @click="handleAddAct">确 定</el-button>
          <el-button type="primary" v-else @click="handleEditAct">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 专线添加 end -->

    </div>
  </div>
</template>
<script>
  import headTop from '../../components/headTop'
  import { RuleGetList, RuleCreate, RuleAudit, RuleUpdate, RuleDelete } from '@/api/getdatas'
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
        listInfo: {
          Amount: '',
          RuleID: '',
          RuleNumber: ''
        },
        rules: {
          Amount: [
            { required: true, message: '保证金不能为空', trigger: 'blur' },
            { pattern: regExp.Decimal18, message: "请输入正确格式保证金", trigger: "blur" }
          ]
        },
        dialogFormAddVisible: false, // 添加专线
        ifAddOrEdit: false
      }
    },
    created () {
      this.getDataPage()
    },
    methods: {
      handleAdd () { // 添加操作
        this.dialogFormAddVisible = true
        this.ifAddOrEdit = false // 新增
      },
      async handleAddAct () { // 确认添加
        this.$refs['editForm'].validate( async (valid) => {
          if (valid) {
            let form = qs.stringify(this.listInfo, {arrayFormat: 'indices'})
            const resData = await RuleCreate(form)
            if (resData.ResultCode === "000000") {
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
      handleSure (index, val) { // 审核操作
        this.resetRequest() // 重置
        this.listInfo.RuleID = val.RuleID
        this.$confirm('确定审核当前专线吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let form = qs.stringify(this.listInfo, {arrayFormat: 'indices'})
          const resData = await RuleAudit(form)
          if (resData.ResultCode === "000000") {
            this.$message({
              type: 'success',
              message: resData.ResultMessage
            });
          } else {
            this.$message({
              type: 'error',
              message: resData.ResultMessage
            });
          }
        }).catch(() => {      
        });
      },
      handleEdit (index, val) { // 编辑操作
        this.ifAddOrEdit = true // 编辑
        this.dialogFormAddVisible = true
        this.listInfo.RuleID = val.RuleID
        this.listInfo.Amount = val.Amount
        this.listInfo.RuleNumber = val.RuleNumber
      },
      async handleEditAct () { // 确认编辑
        this.$refs['editForm'].validate( async (valid) => {
          if (valid) {
            let form = qs.stringify(this.listInfo, {arrayFormat: 'indices'})
            const resData = await RuleUpdate(form)
            if (resData.ResultCode === "000000") {
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
      handleDele (index, val) { // 删除操作
        this.resetRequest() // 重置
        this.listInfo.RuleID = val.RuleID
        this.$confirm('确定删除当前专线吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let form = qs.stringify(this.listInfo, {arrayFormat: 'indices'})
          const resData = await RuleDelete(form)
          if (resData.ResultCode === "000000") {
            this.$message({
              type: 'success',
              message: resData.ResultMessage
            });
          } else {
            this.$message({
              type: 'error',
              message: resData.ResultMessage
            });
          }
        }).catch(() => {      
        });
      },
      async getDataPage () { // 获取列表
        this.loading = true
        const resData = await RuleGetList()
        if (resData.ResultCode !== "000000") {
          this.$message({
            type: 'success',
            message: resData.ResultMessage
          })
          this.tableData = resData.ResultValue
          this.loading = false
        } else {
          this.$message({
            type: 'error',
            message: resData.ResultMessage
          })
        }
      },
      resetRequest () { // 重置数据
        delete this.listInfo.Amount
        delete this.listInfo.RuleID
        delete this.listInfo.RuleNumber
      }
    },
    watch: {
      dialogFormAddVisible (n) {
        if (!n) { // 清空数据
          this.resetRequest()
        }
      }
    }
  }
</script>