<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="参数名称"
          prop="ImportantName">
        </el-table-column>
        <el-table-column
          label="参数值"
          prop="ImportantValue">
        </el-table-column>
        <el-table-column
          label="创建者姓名"
          prop="CreateName"
          width="200">
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="CreateTime"
          width="200">
        </el-table-column>
        <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <!--<el-button-->
              <!--size="small"-->
              <!--type="danger"-->
              <!--@click="handleDelete(scope.$index, scope.row)">注销</el-button>-->
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="修改参数数据" :visible.sync="dialogFormVisible" class="specaildialog" width="500px">
        <el-form :model="categoryOptions">
          <el-form-item label="参数名称" label-width="100px">
            <el-input v-model="categoryOptions.ImportantName" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="参数值" label-width="100px">
            <el-input v-model="categoryOptions.ImportantValue" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="ImportantUpdate" >提 交</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
    // export default {
    //     name: "adminlist"
    // }

    import headTop from '@/components/headTop'
    import {baseUrl} from '@/config/env'
    import {ImportantGetList, ImportantUpdate} from '@/api/getdatas'
    import {mapState} from 'vuex'
    export default {
      data(){
        return {
          baseUrl,
          loading:true,
          tableData: [],
          dialogFormVisible:false,
          categoryOptions:{},
          oldvalue:'',
        }
      },
      components: {
          headTop,
      },
      created(){
        this.restaurant_id = this.$route.query.restaurant_id;
        this.ImportantGetList();
      },
      computed: {
        ...mapState(['adminInfo']),
      },
      methods:{
        //获取管理员列表
        async ImportantGetList(){
          this.loading=true;
          const restaurants = await ImportantGetList();
          if(restaurants.ResultCode=="000000"){
            if(this.tableData==''){
              this.$message({
                type: 'success',
                message: restaurants.ResultMessage
              });
            }
            this.count=restaurants.TotalRecords;
            this.tableData=restaurants.ResultValue;
            this.loading=false;
          }else{
            this.$message({
              type: 'error',
              message: restaurants.ResultMessage
            });
          }
        },
        //修改管理员信息（编辑操作用到）
        async ImportantUpdate(){
          let form = new FormData();
          if(this.oldvalue==this.categoryOptions.ImportantValue){
            this.$message({
              type: 'error',
              message: '参数未改变'
            });
            return false;
          }
          form.append("ImportantID", this.categoryOptions.ImportantID);
          form.append("LoginID", this.adminInfo);
          form.append("Value", this.categoryOptions.ImportantValue);

          const ImportantUpdates = await ImportantUpdate(form);
          if(ImportantUpdates.ResultCode=="000000"){
            this.$message({
              type: 'success',
              message: ImportantUpdates.ResultMessage
            });
            this.dialogFormVisible=false;
            this.ImportantGetList()
          }else{
            this.$message({
              type: 'error',
              message: ImportantUpdates.ResultMessage
            });
          }
        },
        handleEdit(index, row) {
          this.categoryOptions.ImportantID=row.ImportantID;
          this.categoryOptions.ImportantName=row.ImportantName;
          this.categoryOptions.ImportantValue=row.ImportantValue;
          this.oldvalue=row.ImportantValue;
          this.dialogFormVisible=true;
        },

      }
    }
</script>

<style lang="less">

</style>
