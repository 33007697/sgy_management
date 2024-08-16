<template>
  <el-card>
    <div slot="header" class="header">
      <div class="category-header">
        <span>线上热门搜索</span>
        <!-- 下拉菜单 -->
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>黄金糕</el-dropdown-item>
            <el-dropdown-item>狮子头</el-dropdown-item>
            <el-dropdown-item>螺蛳粉</el-dropdown-item>
            <el-dropdown-item>双皮奶</el-dropdown-item>
            <el-dropdown-item>蚵仔煎</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div>
      <!-- 这里两个图表组件，均分 -->
      <el-row :gutter="10">
        <!-- 均分，一边12格 -->
          <el-col :span="12">
            <!-- 图表组件 -->
            <LineChart/>
          </el-col>
          <el-col :span="12">
            <LineChart/>
          </el-col>
      </el-row>
      <!-- 图表下方表格 -->
       <el-table :data="table" style="width: 100%" border>
           <el-table-column type="index" label="排名" width="80" align="center">
           </el-table-column>
           <el-table-column prop="prop" label="搜索关键字" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="用户数" sortable width="width">
          </el-table-column>
          <el-table-column prop="prop" label="周涨幅" sortable width="width">
          </el-table-column>
       </el-table>
    </div>
  </el-card>
</template>

<script>
// 引入图表组件
import LineChart from './LineChart'
export default {
  name: "Category",
  data(){
    return {
      // 表格数据
      table:[{}]
    }
  },
  components:{LineChart}
};
</script>

<style scoped>
.header {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}
.category-header{
  display: flex;
  justify-content: space-between;
}
</style>