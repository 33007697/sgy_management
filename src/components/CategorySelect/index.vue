<template>
  <div>
    <!-- 行内表单，用于三级联动选项卡
        inline：布尔值，设置表单是否是行内表单

    -->
    <el-form :inline="true" :model="categoryForm" class="demo-form-inline">
        <!-- 一级列表选项卡 -->
      <el-form-item label="一级分类">
        <!-- el-select中的v-modle表示其中选中的选项要收集到哪个值上,,@change事件。表示当选项卡中的值发生改变的时候触发 -->
        <el-select  placeholder="请选择" v-model="categoryForm.category1Id" @change="getCategory2List" :disabled="show">
            <!-- 动态展示一级列表数据选项, el-option中的value表示需要收集的数据 -->
          <el-option :label="c1.name" :value="c1.id" v-for="c1 in list1" :key="c1.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- 二级列表选项卡 -->
      <el-form-item label="二级分类">
        <el-select  placeholder="请选择" v-model="categoryForm.category2Id" @change="getCategory3List" :disabled="show">
            <!-- 动态展示二级列表的数据选项 -->
          <el-option :label="c2.name" :value="c2.id" v-for="c2 in list2" :key="c2.id"></el-option>
        </el-select>
      </el-form-item>
      <!-- 三级列表选项卡 -->
      <el-form-item label="三级分类">
        <el-select  placeholder="请选择" v-model="categoryForm.category3Id" @change="getDataList" :disabled="show">
            <!-- 动态展示三级列表数据选项 -->
          <el-option :label="c3.name" :value="c3.id" v-for="c3 in list3" :key="c3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
    name:'CategorySelect',
    //props功能，show是用于选项框禁选功能的
    props:['show'],
    data(){
        return {
            // 表单数据收集到的对象
            categoryForm:{
                category1Id:'',
                category2Id:'',
                category3Id:'',
            },
            // 一级列表数据
            list1:[],
            // 二级列表数据
            list2:[],
            // 三级列表数据
            list3:[]
        }
    },
    mounted(){
        this.getCategory1List()
    },
    methods:{
        // 请求获取列表数据
        async getCategory1List(){
            // 获取一级列表数据
            let result = await this.$API.attr.reqCategory1List()
            // 判断一下数据是否请求成功
            if(result.code == 200){
                // 请求成功则把数据放到data中
                this.list1 = result.data
            }
        },
        // 当一级列表中选中的选项发生改变的时候，执行，获取二级列表的数据
        async getCategory2List(){
            // 当一级列表发生改变的时候，清理二级列表和三级列表数据以及id
            this.categoryForm.category2Id = ''
            this.categoryForm.category3Id = ''
            this.list2 = []
            this.list3 = []
            // 从data中解构出一级列表中选中项的id
            const {category1Id} = this.categoryForm
            this.$emit('getCategroyId',{categoryId:category1Id,level:1})
            // 发起请求获取二级列表数据
            let result = await this.$API.attr.reqCategory2List(category1Id)
            // 判断一下数据是否请求成功
            if(result.code == 200){
                // 请求成功，则把数据保存
                this.list2 = result.data
            }
        },
        // 当二级列表中选中的选项发生改变的时候执行，获取三级列表的数据
        async getCategory3List(){
            // 当二级列表发生改变时，清理三级列表和id
            this.categoryForm.category3Id = ''
            this.list3 = []
            // 从data中解构出二级列表选中的选项的id
            const {category2Id} = this.categoryForm
            this.$emit('getCategroyId',{categoryId:category2Id,level:2})
            // 发送请求获取三级列表的数据
            let result = await this.$API.attr.reqCategory3List(category2Id)
            // 判断一下数据是否请求到
            if(result.code == 200){
                // 将数据保存
                this.list3 = result.data
            }

        },
        // 当三级列表发生改变的时候，将三级列表id发送给其父组件
        getDataList(){
            const {category3Id} = this.categoryForm
            this.$emit('getCategroyId',{categoryId:category3Id,level:3})
        }
    }
};
</script>

<style>
</style>