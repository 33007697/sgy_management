<template>
  <el-card>
    <!-- 数据展示表格 -->
    <el-table style="width: 100%" border :data="records">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="skuName" label="SKU名称" width="width">
      </el-table-column>
      <el-table-column prop="skuDesc" label="SKU描述" width="width">
      </el-table-column>
      <el-table-column label="默认图片" width="110">
        <template slot-scope="{ row, $index }">
          <img :src="row.skuDefaultImg" style="width: 80px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格" width="80"> </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"> </el-table-column>
      <el-table-column label="操作" width="width">
        <!-- isSale表示sku是否上架，1表示上架了，0表示没有上架 -->
        <template slot-scope="{ row, $index }">
          <el-button
            type="success"
            icon="el-icon-top"
            size="mini"
            title="上架"
            v-if="row.isSale == 0"
            @click="onSale(row)"
          ></el-button>
          <el-button
            type="warning"
            icon="el-icon-bottom"
            size="mini"
            title="下架"
            @click="cancelSale(row)"
            v-else
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            title="修改"
            @click="edit"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            title="查看详情"
            @click="showSku(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            title="删除"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 
     @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    -->
    <el-pagination
      style="text-align: center; margin: 20px 0px"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @current-change="getSkuList"
      @size-change="handleSizeChange"
    >
    </el-pagination>
    <!-- 添加抽屉功能 -->
    <!-- direction：抽屉的打开方向，默认是从右向左打开
      before-close：抽屉关闭之前回调函数
      title:标题
      size：抽屉大小，可以是字符串像素，也可以是百分比
       -->
    <el-drawer :visible.sync="show" :before-close="handleClose" size="50%">
      <!-- 抽屉中使用布局功能 -->
      <el-row :gutter="20">
        <el-col :span="5"
          ><div class="grid-content bg-purple">SKU名称</div></el-col
        >
        <el-col :span="16"
          ><div class="grid-content bg-purple">
            {{ skuInfo.skuName }}
          </div></el-col
        >
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5"
          ><div class="grid-content bg-purple">SKU详情</div></el-col
        >
        <el-col :span="16"
          ><div class="grid-content bg-purple">
            {{ skuInfo.skuDesc }}
          </div></el-col
        >
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5"
          ><div class="grid-content bg-purple">价格</div></el-col
        >
        <el-col :span="16"
          ><div class="grid-content bg-purple">
            {{ skuInfo.price }} 元
          </div></el-col
        >
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5"
          ><div class="grid-content bg-purple">平台属性</div></el-col
        >
        <el-col :span="16"
          ><div class="grid-content bg-purple">
            <el-tag
              type="success"
              v-for="attr in skuInfo.skuAttrValueList"
              :key="attr.id"
              style="margin-left: 10px"
            >
              {{ attr.attrId }} - {{ attr.valueId }}
            </el-tag>
          </div></el-col
        >
      </el-row>
      <el-row :gutter="20">
        <el-col :span="5"
          ><div class="grid-content bg-purple">商品图片</div></el-col
        >
        <el-col :span="16"
          ><div class="grid-content bg-purple">
            
            <!-- 轮播图，走马灯功能 -->
             <!-- loop：是否循环显示  autoplay：是否自动切换  interval：自动切换时间间隔  height：走马灯的高度-->
            <el-carousel height="450px" loop autoplay>
              <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl" style="height: 100%; width: 100%;">
              </el-carousel-item>
            </el-carousel>
          </div></el-col
        >
      </el-row>
    </el-drawer>
  </el-card>
</template>

<script>
export default {
  name: "Sku",
  data() {
    return {
      // 当前页码
      page: 1,
      // 每页展示条数
      limit: 10,
      // 条目总数
      total: 0,
      // 保存的数据列表
      records: [],
      // 控制是否展示抽屉
      show: false,
      // 保存sku详细信息
      skuInfo: {},
    };
  },
  mounted() {
    // 获取sku数据列表展示
    this.getSkuList();
  },
  methods: {
    // 获取sku数据列表
    async getSkuList(pages = 1) {
      // 将数据进行赋值
      this.page = pages;
      // 从data中解构出来page当前页码和limit每页展示数量
      const { page, limit } = this;
      // 发送请求或指定页面数据
      let result = await this.$API.sku.reqSkuList(page, limit);
      // 判断一下数据是否请求成功
      if (result.code == 200) {
        // 请求成功，将数据保存
        this.total = result.data.total;
        this.records = result.data.records;
      }
    },
    // 修改分页器每页展示数量回调
    handleSizeChange(limit) {
      // 修改每页展示数量
      this.limit = limit;
      // 重新获取数据
      this.getSkuList();
    },
    // sku上架操作
    async onSale(sku) {
      // 发送上架请求
      let result = await this.$API.sku.reqOnSale(sku.id);
      // 判断一下请求是否成功
      if (result.code == 200) {
        // 请求成功，提示信息
        this.$message({ type: "success", message: "上架成功" });
        // 上架成功之后，重新发送获取数据请求,并停留在当前页码
        this.getSkuList(this.page);
      }
    },
    // sku下架操作
    async cancelSale(sku) {
      // 发送下架请求
      let result = await this.$API.sku.reqCancelSale(sku.id);
      //  判断一下请求是否发送成功
      if (result.code == 200) {
        // 请求发送成功，提示信息
        this.$message({ type: "success", message: "下架成功" });
        // 下架成功之后，重新获取数据，并停留在当前页码
        this.getSkuList(this.page);
      }
    },
    // 点击修改按钮时提示信息
    edit() {
      this.$message("功能正在开发中...");
    },
    // 抽屉关闭之前回调函数
    handleClose(done) {
      // 关闭抽屉之前，清除当前sku数据
      this.skuInfo = {};
      // 放行函数
      done();
    },
    // 点击查看sku详情按钮回调
    async showSku(sku) {
      // 显示抽屉
      this.show = true;
      // 发送请求获取sku详情数据
      let result = await this.$API.sku.reqSkuDesc(sku.id);
      // 判断一下数据是否请求成功
      if (result.code == 200) {
        // 数据请求成功，保存数据
        this.skuInfo = result.data;
      }
    },
  },
};
</script>
<style>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col-5 {
  font-size: 23px;
  text-align: right;
  line-height: 36px;
}
.el-col-16 {
  line-height: 36px;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: white;
}
.bg-purple {
  background: white;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
  /* 自定义样式，走马灯下方小圆点样式 */
  .el-carousel__button{
    height: 10px;
    width: 10px;
    border-radius: 50%;
    background-color: rgb(255, 255, 255);
    border: 3px solid red;
  }
</style>
