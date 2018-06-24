<template>
    <div class="article-list">
      <head-top></head-top>
      <div class="table_container">
        <el-row class="topFS">
          
          <el-input v-model="params.Title" placeholder="文章名称" min="100"></el-input>
          <el-select v-model="params.Status" placeholder="请选择会员类型">
            <el-option v-for="(item, index) in optionsSelect" :label="item.label" :value="item.value" :key="index"></el-option>
          </el-select>
          <el-button type="primary" @click="getArticleListData">搜索</el-button>
          <el-button type="primary" @click="gourl('/article-edit')">添加文章</el-button>
        </el-row>
        <el-table v-loading="loading" :data="articleListData" style="width: 100%">
          <el-table-column
            label="文章标题"
            prop="ArticleTitle">
          </el-table-column>
          <el-table-column
            label="文章分类"
            prop="TypeName">
          </el-table-column>
          <el-table-column
            label="文章标题"
            prop="ArticleTitle">
          </el-table-column>
          <el-table-column
            label="状态"
            prop="StatusName">
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.StatusValue > 0 ? 'primary' : 'success'"
                disable-transitions>{{scope.row.StatusName}}{{scope.row.StatusValue}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            width="400px"
            label="操作">
            <template slot-scope="scope">
              <el-button
                size="small"
                @click="handleLook(scope.$index, scope.row)">查看</el-button>
              <el-button
                size="small"
                type="primary"
                @click="handleSure(scope.$index, scope.row)">审核</el-button>
              <el-button
                size="small"
                type="primary"
                @click="handleStop(scope.$index, scope.row)">是否启用</el-button>
              <el-button
                size="small"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="Pagination">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page="params.PageIndex"
          :page-size="params.PageSize"
          layout="total, prev, pager, next"
          :total="TotalRecords">
        </el-pagination>
      </div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%">
        <span>审核文章是否通过?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleSureAct(false)">拒绝</el-button>
          <el-button type="primary" @click="handleSureAct(true)">通过</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisibleDisable"
        width="30%">
        <span>文章是否启用?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleStopAct(false)">禁用</el-button>
          <el-button type="primary" @click="handleStopAct(true)">启用</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
  import headTop from '../../components/headTop'
  import { ArticleGetPage, ArticleRefuse, ArticlePass, ArticleDisable, ArticleEnable } from '@/api/getdatas'
  import { baseUrl, baseImgPath } from '@/config/env'
  import qs from 'qs'
  import {mapState, mapActions} from 'vuex'

  export default {
    components: {
      headTop
    },
    data () {
      return {
        loading: false,
        loadingmore: false,
        articleListData: [],
        dialogVisible: false,
        dialogVisibleDisable: false,
        TotalRecords: 0,
        params: {
          Title: "",
          Status: 99,
          PageIndex: 1,
          PageSize: 20,
          Status: 99,
          TotalRecords: 0
        },
        optionsSelect: [ // 选则
          {label: '全部', value: 99},
          {label: '待审核', value: 1},
          {label: '已审核', value: 2}
        ],
        curRow: {} // 当前操作
      }
    },
    computed: {
      ...mapState(['adminInfo'])
    },
    created () {
    },
    methods: {
      handleStop (index, val) {
        this.curRow = val;
        this.dialogVisibleDisable = true;
      },
      async handleStopAct (val) {
        let params = {ArticleID: this.curRow.ArticleID, LoginID: this.adminInfo};
        let shData = {};
        if (!val) {
          shData = await ArticleDisable(qs.stringify(params));
        } else {
          shData = await ArticleEnable(qs.stringify(params));
        }
        this.dialogVisibleDisable = false;
        if (shData.ResultCode === '000000') {
          this.$message({
            type: 'success',
            message: shData.ResultMessage
          });
          this.loading = true;
          setTimeout(() => {
            this.getArticleListData();
          }, 1500)
        } else {
          this.$message({
            type: 'error',
            message: shData.ResultMessage
          });
        }
      },
      async handleSureAct (val) { // 确定按钮
        let params = {ArticleID: this.curRow.ArticleID, LoginID: this.adminInfo};
        let shData = {};
        if (!val) {
          console.log(ArticleRefuse)
          shData = await ArticleRefuse(qs.stringify(params));
        } else {
          shData = await ArticlePass(qs.stringify(params));
        }
        this.dialogVisible = false;
        if (shData.ResultCode === '000000') {
          this.$message({
            type: 'success',
            message: shData.ResultMessage
          });
          this.loading = true;
          setTimeout(() => {
            this.getArticleListData();
          }, 1500)
        } else {
          this.$message({
            type: 'error',
            message: shData.ResultMessage
          });
        }
      },
      handleSure (index ,val) { // 审核
        this.curRow = val;
        this.dialogVisible = true;
      },
      handleEdit (index, val) { // 编辑
        this.gourl (`/article-edit?ArticleID=${val.ArticleID}`);
      },
      handleLook (index, val) { // 查看
        if (val.LinkUrl) {
          window.open(val.LinkUrl)
          return;
        }
        window.open(baseImgPath + val.ContentUrl)
      },
      handleCurrentChange(val) {
        this.params.PageIndex = val;
        this.getArticleListData();
      },
      gourl (url) {
        this.$router.push({path: url});
      },
      async getArticleListData(){
        this.loading = true;
        const articleListData = await ArticleGetPage(qs.stringify(this.params));
        if(articleListData.ResultCode === '000000'){
          this.loading = false;
          this.articleListData = articleListData.ResultValue;
          this.TotalRecords = articleListData.TotalRecords;
          this.$message({
            type: 'success',
            message: articleListData.ResultMessage
          });
        } else {
          this.$message({
            type: 'error',
            message: articleListData.ResultMessage
          });
        }
      }
    },
    mounted(){
      this.getArticleListData();
    }

  }
</script>
<style scoped lang="less">
  @import '../../style/mixin';
  .loading-more{
    text-align: center;
    padding: 15px;
    border: 1px solid #909399;
    display: block;
    border-left: none;
    border-right: none;
    cursor: pointer;
  }
</style>
