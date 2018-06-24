<template>
  <div class="joinmessage">
    <head-top></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-button type="success" plain @click="changeList(0)" v-show="status!=0">查看未回复</el-button>
        <el-button type="success" plain @click="changeList(1)" v-show="status!=1">查看已回复</el-button>
        <el-button type="success" plain @click="changeList(99)" v-show="status!=99">全部</el-button>
      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="名字">
                <span>{{ props.row.Name }}</span>
              </el-form-item>
              <el-form-item label="联系方式">
                <span>{{ props.row.ContactWay }}</span>
              </el-form-item>
              <el-form-item label="留言">
                <span>{{ props.row.Content }}</span>
              </el-form-item>
              <el-form-item label="回复内容">
                <span>{{ props.row.ReplyContent }}</span>
              </el-form-item>
              <el-form-item label="回复时间">
                <span>{{ props.row.ReplyTime }}</span>
              </el-form-item>
              <el-form-item label="创建时间">
                <span>{{ props.row.CreateTime }}</span>
              </el-form-item>
              <el-form-item label="回复人">
                <span>{{ props.row.Answer }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="名字"
          prop="Name">
        </el-table-column>
        <el-table-column
          label="联系方式"
          prop="ContactWay"
          width="200">
        </el-table-column>
        <el-table-column
          label="留言"
          prop="Content"
          width="200">
          <template slot-scope="scope">
            {{scope.row.Content.slice(0, 5)}}
            {{scope.row.Content.length > 5 ? '...' : ''}}
          </template>
        </el-table-column>
        </el-table-column>
        
        <el-table-column
          label="创建时间"
          prop="CreateTime"
          width="200">
        </el-table-column>
        <el-table-column
          prop="StatusValue"
          label="是否回复"
          width="120">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.StatusValue === 1 ? 'primary' : 'success'"
              disable-transitions>{{scope.row.StatusValue === 1 ? '未回复' : '已回复'}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button
              size="small"
              :type="scope.row.StatusValue === 1 ? 'primary' : 'default'"
              @click="replyAct(scope.$index, scope.row)">回复</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="Pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="count">
        </el-pagination>
      </div>

      <el-dialog title="回复内容" :visible.sync="dialogReplyForm" class="specaildialog" width="500px">
        <el-form :model="dialogReplyFormData" ref="ReplyForm">
          <el-form-item label="回复内容" label-width="100px" prop="Content" :rules="[
                        { required: true, message: '回复内容不能为空', trigger: 'blur' },
                      ]">
            <el-input type="textarea" v-model="dialogReplyFormData.Content"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogReplyForm = false">取 消</el-button>
          <el-button type="primary" @click="submitCreate('ReplyForm')">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
  import headTop from '@/components/headTop'
  import { baseUrl } from '@/config/env'
  import { JoinInGetPage, JoinInReply } from '@/api/getdatas'
  import { getStore } from '@/config/mUtils.js'

  export default {
    components: {
      headTop
    },
    data(){
      return {
        baseUrl,
        dialogReplyForm: false, // 弹出alert
        loading: true,
        tableData: [],
        currentPage: 1, // 每页数据
        status: 99,
        pageSize: 20, // 每页多少条数据
        count: 0, // 数量多少条
        dialogReplyFormData: { // 传递参数
          JoinInID: '',
          Content: '',
          LoginID: ''
        }
      }
    },
    created () {
      this.getListData() // 执行数据获取
    },
    methods: {
      async getListData () { // 获取当前列表数据数据
        let form = new FormData()
        form.append("Status", this.status)
        form.append("PageIndex", this.currentPage)
        form.append("PageSize", this.pageSize)
        form.append("TotalRecords", this.count)
        const JoinInlist = await JoinInGetPage(form)
        if (JoinInlist.ResultCode === "000000") {
          this.tableData = JoinInlist.ResultValue
          this.count = JoinInlist.TotalRecords
        } else {
          this.$message({
            type: 'error',
            message: restaurants.ResultMessage
          })
        }
        this.loading = false
      },
      replyAct (index, cur) {
        if (cur.StatusValue !== 1) {
          this.$message({
            type: 'error',
            message: '该条记录已经回复过'
          })
          return
        }
        this.dialogReplyForm = true
        this.dialogReplyFormData.JoinInID =  cur.JoinInID
        this.dialogReplyFormData.Content = ''
        this.dialogReplyFormData.LoginID = getStore('UseId')
      },
      handleCurrentChange (val) {
        this.currentPage = val
        this.PageIndex = val
        this.getListData()
      },
      submitCreate (formName) { // 确定按钮
        this.$refs[formName].validate( async (valid) => {
          if (valid) {
            let form = new FormData();
            form.append("JoinInID", this.dialogReplyFormData.JoinInID)
            form.append("Content", this.dialogReplyFormData.Content)
            form.append("LoginID", this.dialogReplyFormData.LoginID)
            console.log()
            const JoinInReplyReturn = await JoinInReply(form)
            if (JoinInReplyReturn.ResultCode === "000000") {
              this.$message({
                type: 'success',
                message: JoinInReplyReturn.ResultMessage
              })
              this.dialogReplyForm = false
              this.getListData() // 重置数据
            }
          }
        })
      },
      changeList (status) {
        this.status = status
        this.getListData()
      }
    }
  }
</script>
<style lang="less">
  .joinmessage .demo-table-expand {
    font-size: 0;
    .el-form-item__content {
      max-width: 300px;
      overflow: hidden;
      word-wrap:break-word;
    }
  }
  .joinmessage .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .joinmessage .demo-table-expand .el-form-item {
    margin-right: 0;
    width: 50%;
  }
</style>

<style lang="less">
 
</style>
