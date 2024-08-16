<template>
  <div>
    <!-- 分为左右两侧组件，均分 -->
     <el-row :gutter="10">
      <!-- 均分，各站12格,总计24格 -->
         <el-col :span="12">
          <Category />
         </el-col>
         <el-col :span="12">
          <Search />
         </el-col>
     </el-row>
  </div>
</template>

<script>
// 引入组件
import Category from './Categroy'
import Search from './Search'
export default {
    name:'Footer',
    components:{Category,Search}
}
</script>

<style>

</style>