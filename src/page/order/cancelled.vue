<template>
  <div class="fillcontain">
    <head-top></head-top>
    <div class="table_container">
      <el-row class="topFS">
        <el-date-picker
          v-model="choosetime"
          type="daterange"
          @change="changetime"
          range-separator="至"
          start-placeholder="开始日期"
          :unlink-panels="true"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-input v-model="listinfo.Name" placeholder="请输入物流公司关键词" min="100"></el-input>
        <el-input v-model="OrderCode" placeholder="请输入订单号关键词" min="100"></el-input>
        <el-button type="primary" @click="CancelGetPage">搜 索</el-button>
      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props" >
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="订单号">
                <span>{{ props.row.OrdeCode }}</span>
              </el-form-item>
              <el-form-item label="出发地">
                <span>{{ props.row.FromCity }}</span>
              </el-form-item>
              <el-form-item label="目的地">
                <span>{{ props.row.ToCity }}</span>
              </el-form-item>
              <el-form-item label="发货者">
                <span>{{ props.row.Owner}}</span>
              </el-form-item>
              <el-form-item label="指定承运">
                <span>{{ props.row.Way}}</span>
              </el-form-item>
              <el-form-item label="出发地">
                <span>{{ props.row.FromCity}}</span>
              </el-form-item>
              <el-form-item label="目的地">
                <span>{{ props.row.ToCity}}</span>
              </el-form-item>
              <el-form-item label="车型">
                <span>{{ props.row.Model}}</span>
              </el-form-item>
              <el-form-item label="车长">
                <span>{{ props.row.Long}}</span>
              </el-form-item>
              <el-form-item label="体积">
                <span>{{ props.row.Volume}}</span>
              </el-form-item>
              <el-form-item label="重量">
                <span>{{ props.row.Weight}}</span>
              </el-form-item>
              <el-form-item label="货物类型">
                <span>{{ props.row.ClassifyName}}</span>
              </el-form-item>
              <el-form-item label="装货时间">
                <span>{{ props.row.LoadTime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="货主名称"
          prop="MerchantName">
        </el-table-column>
        <el-table-column
          label="货物名称"
          prop="CargoName">
        </el-table-column>
        <el-table-column
          label="物值"
          prop="Money">
        </el-table-column>
        <el-table-column
          label="发布时间"
          prop="PublishTime"
          width="200">
        </el-table-column>
        <el-table-column
          label="状态名称"
          prop="StatusName">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.StatusValue <= 0 ? 'primary' : 'success'"
              disable-transitions>{{scope.row.StatusName}}</el-tag>
          </template>
        </el-table-column>
        <!--<el-table-column label="操作" width="140">-->
          <!--<template slot-scope="scope">-->
            <!--<el-button-->
              <!--size="small"-->
              <!--type="primary"-->
              <!--@click="handleEdit(scope.$index, scope.row)">编辑</el-button>-->
            <!--<el-button-->
              <!--size="small"-->
              <!--type="danger"-->
              <!--plain-->
              <!--@click="handleDelete(scope.$index, scope.row)">注销</el-button>-->
          <!--</template>-->
        <!--</el-table-column>-->
      </el-table>
      <div class="Pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="20"
          layout="total, prev, pager, next"
          :total="count">
        </el-pagination>
      </div>


    </div>
  </div>
</template>

<script>
    // export default {
    //     name: "adminlist"
    // }

    import headTop from '@/components/headTop'
    import {baseUrl} from '@/config/env'
    import {OrderCancelGetPage} from '@/api/getdatas'
    import {OrderGetPage} from '@/api/getdatas'
    import {mapState} from 'vuex'
    import { gettimes } from '@/config/getTimes'
    export default {
      data(){
        return {
          baseUrl,
          loading:true,
          tableData: [],
          currentPage: 1,
          dialogFormVisible: false,
          categoryOptions: {},
          selectedCategory: [],
          choosetime: [new Date().setDate(new Date().getDate() - 7), new Date()],
          OrderCode:'',
          count:0,
          listinfo:{
            Owner:'99',
            Status:'99',
            Name:'',
            FromDate:'',
            ToDate:'',
            PageIndex:'1',
            PageSize: 20,
            TotalRecords:'0'
          },
        }
      },
      components: {
          headTop,
      },
      created(){
        this.listinfo.FromDate = gettimes(new Date().setDate(new Date().getDate() - 7));
        this.listinfo.ToDate = gettimes();
        this.CancelGetPage();
      },
      computed: {
        ...mapState(['adminInfo']),
      },
      methods:{
        //获取管理员列表
        async CancelGetPage(){
          this.loading=true;
          let form = new FormData();
          if(this.listinfo.Name){
            form.append("Name", this.listinfo.Name);
          }
          if(this.OrderCode){
            form.append("OrderCode", this.OrderCode);
          }
          form.append("Owner", this.listinfo.Owner);
          form.append("Status", this.listinfo.Status);
          form.append("FromDate", this.listinfo.FromDate);
          form.append("ToDate", this.listinfo.ToDate);
          form.append("PageIndex", this.listinfo.PageIndex);
          form.append("PageSize", this.listinfo.PageSize);
          form.append("TotalRecords", this.listinfo.TotalRecords);
          const restaurants = await OrderCancelGetPage(form);
          if(restaurants.ResultCode=="000000"){
            this.count=restaurants.TotalRecords;
            if(this.tableData==''){
              this.$message({
                type: 'success',
                message: restaurants.ResultMessage
              });
            }
            this.tableData=restaurants.ResultValue;

            this.loading=false;
          }else{
            this.$message({
              type: 'error',
              message: restaurants.ResultMessage
            });
          }
        },
        changetime(){
          if(this.choosetime){
            this.listinfo.FromDate=gettimes(this.choosetime[0]);
            this.listinfo.ToDate=gettimes(this.choosetime[1]);
          }else{
            this.listinfo.FromDate=gettimes(new Date().setDate(new Date().getDate() - 1));
            this.listinfo.ToDate=gettimes();
          }
        },
        handleSizeChange(val) {
          console.log(`每页 ${val} 条`);
        },
        handleCurrentChange(val) {
          this.currentPage = val;
          this.listinfo.PageIndex = val;
          //this.PageIndex = (val - 1)*this.PageSize;
          this.CancelGetPage()
        },
      }
    }
</script>

<style lang="less">

</style>
