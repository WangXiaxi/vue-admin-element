<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-button type="primary" @click="dialognewform = true">添加货物类型</el-button>

      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%">
        <el-table-column
          label="货物类型名称"
          prop="CargoTypeName">
        </el-table-column>
        <el-table-column
          label="创建者"
          prop="Creator"
          width="200">
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="CreateTime">
        </el-table-column>
        <el-table-column
          label="修改者"
          prop="Modifier">
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="handleEdit(scope.$index, scope.row)">更新</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="修改货物类型信息" :visible.sync="dialogFormVisible" class="specaildialog" width="500px">
        <el-form :model="categoryOptions">
          <el-form-item label="货物类型名称" label-width="100px">
            <el-input v-model="categoryOptions.CargoTypeName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="创建者" label-width="100px">
            <el-input v-model="categoryOptions.Creator" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" label-width="100px">
            <el-input v-model="categoryOptions.CreateTime" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="修改者" label-width="100px">
            <el-input v-model="categoryOptions.Modifier" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="修改时间" label-width="100px">
            <el-input v-model="categoryOptions.ModifyTime" auto-complete="off" :disabled="true"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="CargoTypeUpdate" >修 改</el-button>
        </div>
      </el-dialog>
      <el-dialog title="新加货物类型" :visible.sync="dialognewform" class="specaildialog" width="500px">
        <el-form :model="loginForm" ref="loginForm">
          <el-form-item prop="Name" label="货物类型名称" label-width="120px"
                        :rules="{ required: true, message: '货物类型名称不能为空', trigger: 'blur' }">
            <el-input v-model="loginForm.Name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="货物类型描述" label-width="120px">
            <el-input v-model="loginForm.Describe" auto-complete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialognewform = false">取 消</el-button>
          <el-button type="primary" @click="CargoTypeCreate('loginForm')">确 定</el-button>
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
    import {CargoTypeGetList, CargoTypeCreate, CargoTypeGet, CargoTypeUpdate,CargoTypeDelete} from '@/api/getdatas'
    import {mapState} from 'vuex'
    export default {
      data(){
        return {
          baseUrl,
          loading:true,
          stauts:2,
          count: 40,
          tableData: [],
          CargoTypeID:'',
          PageID:'',
          dialogFormVisible: false,
          dialognewform:false,
          categoryOptions: {},
          selectedCategory: [],
          loginForm: {
            Name: '',
            Describe:'',
          },
          dynamicValidateForm: {
            domains: [{
              value: ''
            }],
            email: ''
          }
        }
      },
      components: {
          headTop,
      },
      created(){
        this.restaurant_id = this.$route.query.restaurant_id;
        this.CargoTypeGetList();
      },
      computed: {
        ...mapState(['adminInfo']),
      },
      methods:{
        //获取货物类型列表
        async CargoTypeGetList(){
          this.loading=true;
          const TypeGetList = await CargoTypeGetList();
          if(TypeGetList.ResultCode=="000000"){
            if(this.tableData==''){
              this.$message({
                type: 'success',
                message: TypeGetList.ResultMessage
              });
            }
            this.tableData=TypeGetList.ResultValue;
            this.loading=false;
          }else{
            this.$message({
              type: 'error',
              message: TypeGetList.ResultMessage
            });
          }
        },
        //获取货物类型单条信息（编辑操作用到）
        async CargoTypeGet(){
            let form = new FormData();
            form.append("CargoTypeID", this.CargoTypeID);
            const TypeGet = await CargoTypeGet(form);
            if(TypeGet.ResultCode=="000000"){
              this.categoryOptions=TypeGet.ResultValue;
              console.log(this.categoryOptions)
            }else{
              this.$message({
                type: 'error',
                message: TypeGet.ResultMessage
              });
            }
        },

        //修改货物类型信息（编辑操作用到）
        async CargoTypeUpdate(){
          let form = new FormData();
          form.append("CargoTypeID", this.categoryOptions.CargoTypeID);
          form.append("Name", this.categoryOptions.CargoTypeName);
          form.append("PageID", this.PageID);
          form.append("LoginID", this.adminInfo);
          const Updates = await CargoTypeUpdate(form);
          if(Updates.ResultCode=="000000"){
            this.$message({
              type: 'success',
              message: Updates.ResultMessage
            });
            this.dialogFormVisible=false;
            this.CargoTypeGetList()
          }else{
            this.$message({
              type: 'error',
              message: Updates.ResultMessage
            });
          }
        },
        //新增货物类型
        CargoTypeCreate(formName){
          this.$refs[formName].validate(async (valid) => {
            console.log(valid)
            if (valid) {
              let form = new FormData();
              form.append("Name", this.loginForm.Name);
              form.append("Describe", this.loginForm.Describe);
              form.append("PageID", this.PageID);
              form.append("LoginID", this.adminInfo);
              const TypeUpdate = await CargoTypeCreate(form);
              if (TypeUpdate.ResultCode == "000000") {
                this.$message({
                  type: 'success',
                  message: TypeUpdate.ResultMessage
                });
                this.dialognewform = false;
                this.CargoTypeGetList()
              } else {
                this.$message({
                  type: 'error',
                  message: TypeUpdate.ResultMessage
                });
              }
            }
          })
        },
        //删除货物类型
        async CargoTypeDelete(){
          let form = new FormData();
          form.append("CargoTypeID", this.CargoTypeID);
          form.append("PageID", this.PageID);
          form.append("LoginID", this.adminInfo);
          const TypeDelete = await CargoTypeDelete(form);
          if(TypeDelete.ResultCode=="000000"){
            this.$message({
              type: 'success',
              message: TypeDelete.ResultMessage
            });
            this.dialognewform=false;
            this.CargoTypeGetList()
          }else{
            this.$message({
              type: 'error',
              message: TypeDelete.ResultMessage
            });
          }
        },
        handleEdit(index, row) {
          console.log(index, row);
          this.CargoTypeID=row.CargoTypeID
          console.log(this.CargoTypeID)
          if(this.CargoTypeID!=''){
            this.CargoTypeGet();
            this.dialogFormVisible=true;
          }
        },
        handleDelete(index,row){
          this.CargoTypeID=row.CargoTypeID
          this.$confirm('此操作将永久删除该货物类型, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.CargoTypeDelete();
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
      }
    }
</script>

<style lang="less">
  .table_container{
    padding: 20px;
  }
  .Pagination{
    display: flex;
    justify-content: flex-start;
    margin-top: 8px;
  }
</style>
