<template>
  <div>
    <el-card style="margin: 20px 0px">
      <!-- 使用全局组件CategorySelect  isShow是为了让选项框实现disable禁选功能 -->
      <CategorySelect
        @getCategroyId="getCategroyId"
        :show="sence != 0"
      ></CategorySelect>
    </el-card>
    <el-card>
      <!-- SPU界面有三种页面切换 -->
      <!-- 首先页面 -->
      <div v-show="sence == 0">
        <!-- 添加spu按钮 -->
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSPu"
          >添加SPU</el-button
        >
        <!-- 数据展示列表 -->
        <el-table :data="records" style="width: 100%; margin: 20px 0px" border>
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称" width="width">
          </el-table-column>
          <el-table-column prop="description" label="SPU描述信息" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{ row, $index }">
              <!-- 这里我们使用自己二次封装的el-button的全局组件 -->
              <HantButton
                type="success"
                icon="el-icon-plus"
                size="mini"
                title="添加SKU属性"
                @click="addSku(row)"
              ></HantButton>
              <HantButton
                type="warning"
                icon="el-icon-edit"
                size="mini"
                title="修改SPU"
                @click="updateSpu(row)"
              ></HantButton>
              <HantButton
                type="info"
                icon="el-icon-info"
                size="mini"
                title="查看SPU中的SKU详情"
                @click="handler(row)"
              ></HantButton>
              <!-- 删除spu按钮使用了气泡确认框 -->
              <el-popconfirm
                title="确定要删除当前SPU吗？"
                @onConfirm="deleteSpu(row)"
              >
                <HantButton
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除SPU"
                  slot="reference"
                ></HantButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 
         @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
         -->
        <el-pagination
          style="text-align: center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
        >
        </el-pagination>
      </div>
      <!-- 添加或修改spu页面 -->
      <!-- 给spuForm绑定一个自定义事件 -->
      <SpuForm v-show="sence == 1" ref="spuForm" @setSence="setSence"></SpuForm>
      <!-- 添加sku页面 -->
      <SkuForm
        v-show="sence == 2"
        ref="skuForm"
        @changeSence="changeSence"
      ></SkuForm>
      <!-- dialog对话框展示spu的sku列表 -->
      <el-dialog :title="`${spu.spuName}的SKU列表`" :visible.sync="dialogTableVisible" :before-close="close">
        <!-- sku列表数据展示 -->
         <!-- 对列表使用加载功能指令，让其在请求数据时显示加载，数据请求完毕之后关闭加载，显示数据 -->
         <el-table :data="skuList" style="width: 100%" border v-loading="loading">
             <!-- <el-table-column type="index" label="序号" width="80" align="center">
             </el-table-column> -->
             <el-table-column prop="skuName" label="SKU名称" width="width">
            </el-table-column>
            <el-table-column prop="skuDesc" label="SKU描述" width="width">
            </el-table-column>
            <el-table-column prop="price" label="价格" width="80">
            </el-table-column>
            <el-table-column prop="weight" label="重量" width="80">
            </el-table-column>
            <el-table-column label="默认图片" width="width">
              <template slot-scope="{row,$index}">
                <img :src="row.skuDefaultImg" style="width: 100px;height: 100px;">
              </template>
            </el-table-column>
         </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// 引入两个子组件
import SkuForm from "./SkuForm";
import SpuForm from "./SpuForm";
export default {
  name: "Spu",
  data() {
    return {
      // 一级分类
      category1Id: "",
      // 二级分类
      category2Id: "",
      // 三级分类
      category3Id: "",
      // 当前页面数
      page: 1,
      // 每页展示几条数据
      limit: 3,
      // 总共有多少条数据
      total: 0,
      //spu数据列表
      records: [],
      // 切换页面显示的控制变量
      // secne的值： 0为数据展示列表，1为添加修改spu，2为添加sku
      sence: 0,
      // 保存对应spu的sku列表
      skuList: [],
      // 用于控制是否展示对话框
      dialogTableVisible:false,
      // 保存当前选中的spu对象
      spu:{},
      // 是否显示加载,默认开启加载动画
      loading:false
    };
  },
  // 注册组件
  components: { SkuForm, SpuForm },
  methods: {
    getCategroyId({ categoryId, level }) {
      // 判断一下level，是哪个分类的id
      if (level == 1) {
        // 表示一级分类
        this.category1Id = categoryId;
        // 并且清除二级分类和三级分类id
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        // 表示二级分类
        this.category2Id = categoryId;
        // 并清楚三级分类id
        this.category3Id = "";
      } else {
        // 表示三级分类
        this.category3Id = categoryId;
        // 当有三级分类id的时候，发送请求，获取spu列表数据
        this.getSpuList();
      }
    },
    // 发送请求，获取数据
    async getSpuList(pages = 1) {
      // 将页面pages赋值给page,如果pages没有赋值，则默认值为1
      this.page = pages;
      //从this中解构出来需要的参数，然后发送请求
      const { category3Id, page, limit } = this;
      // 发送请求获取数据
      let result = await this.$API.spu.reqSpuList(page, limit, category3Id);
      // 判断一下数据是否请求到
      if (result.code == 200) {
        // 请求成功之后，将数据保存起来
        this.records = result.data.records;
        this.total = result.data.total;
      }
    },
    // 修改每页数据展示条数回调
    handleSizeChange(limit) {
      // 将limit赋值给data中的limit
      this.limit = limit;
      // 请求数据发生变化之后，重新发起请求
      this.getSpuList();
    },
    // 点击修改spu按钮的回调
    updateSpu(row) {
      // 首先切换展示页面
      this.sence = 1;
      // 使用$refs获取到其子组件的实例对象，然后调用其子组件的方法，发送请求
      this.$refs.spuForm.initSpuForm(row);
    },
    // spuForm的自定义事件回调
    setSence({ sence, flag }) {
      // 切换页面
      this.sence = sence;
      // 判断一下flag的值，是添加还是修改，这两个显示的页面不同，一个显示当前页数据，一个显示首页数据
      if (flag == "修改") {
        // 并且重新发起请求获取数据,并且停留在当前页面
        this.getSpuList(this.page);
      } else {
        // 添加spu，显示首页
        this.getSpuList();
      }
    },
    // 添加spu回调
    addSPu() {
      // 切换页面
      this.sence = 1;
      // 获取数据
      this.$refs.spuForm.addSpuForm(this.category3Id);
    },
    // 删除当前spu回调
    async deleteSpu(row) {
      // 发送请求删除spu
      let result = await this.$API.spu.reqDeleteSpu(row.id);
      // 判断一下是否删除成功
      if (result.code == 200) {
        // 删除成功后提示信息
        this.$message({ type: "success", message: "删除成功" });
        // 删除成功之后，重新获取数据，需要注意页面数据个数少于1的情况下，要返回到上一页
        this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
      }
    },
    //点击添加sku回调
    addSku(row) {
      // 修改状态，展示页面
      this.sence = 2;
      // 获取子组件实例对象，调用子组件的方法
      this.$refs.skuForm.getSkuData(this.category1Id, this.category2Id, row);
    },
    // skuForm自定义事件，切换页面显示
    changeSence(sence) {
      this.sence = sence;
    },
    // 点击查看sku列表详情回调
    async handler(row) {
      // 将当前选中的spu保存一下
      this.spu = row
      // 显示对话框
      this.dialogTableVisible = true
      // 开启loading加载动画
      this.loading = true
      // 点击该按钮时，发送请求，获取当前spu对应的sku详细列表信息
      let result = await this.$API.spu.reqSkuDescList(row.id);
      // 判断一个数据是否请求到
      if (result.code == 200) {
        // 保存数据
        this.skuList = result.data;
        // 关闭加载动画
        this.loading = false
      }
    },
    // close关闭dialog对话框前的回调
    close(done){
      // 关闭dialog对话框之前，需要先清理skuList数组,避免数据残留
      this.skuList = []
      // 放行函数
      done()  
    }
  },
};
</script>

<style scoped>
</style>
