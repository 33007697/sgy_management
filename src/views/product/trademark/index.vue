<template>
  <div>
    <!-- 搭建品牌管理页面 -->
    <!-- 添加品牌按钮 -->
    <el-button type="primary" icon="el-icon-plus" @click="showDialog"
      >添加</el-button
    >
    <!-- 添加表格
      :data="data" 表示表格要展示的数据，其值必须是数组
      table表格是以列为主的，每一列就是一个el-table-column
      border：设置是否需要显示边框
      column中
          prop：表示要展示数据的字段
          label：表示表格当前列的标题
          width：表示表格的宽度
          align：设置表格当前列的位置，left、right、center
          type：对应列的类型，如index、selection多选框等
      -->
    <el-table :data="data" style="width: 100%; margin-top: 20px" border>
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="品牌名称" width="width">
      </el-table-column>
      <el-table-column prop="logoUrl" label="品牌LoGo" width="width">
        <!-- 品牌logo需要使用作用域插槽的方式，设置成图片，由当前组件定义格式 -->
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="prop" label="操作" width="width">
        <!-- 作用域插槽，slot-scope的值是个对象，其中固定属性是row和$index，没有其他的属性 -->
        <template slot-scope="{ row, $index }">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加分页器 
      current-page:当前显示的是第几页
      total：总共有多少条数据
      page-size：每页显示多少条数据
      page-sizes：设置每页显示多个条件数据
      layout：设置分页器各个子模块显示的位置，组件布局
          ->:表示此箭头后方发子模块靠箭头方向那一侧贴边
      current-change：当前页面改变时触发
      size-change：当前页面显示条目数量发生改变时触发
      background：配置是否显示背景颜色
      pager-count:配置页码按钮显示数量
      
      
     -->
    <el-pagination
      style="text-align: center; margin-top: 20px"
      background
      @current-change="getDataList"
      @size-change="handleSizeChange"
      :current-page="pageNum"
      :page-sizes="[3, 5, 10]"
      :page-size="pageSize"
      layout=" prev, pager, next, jumper,->,total, sizes"
      :total="total"
    >
    </el-pagination>
    <!-- 添加对话框，显示添加修改功能,title是对话框名称 -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <!-- form表单，modle表示表单数据要收集到哪个对象中，一般配合form-item使用  -->
      <!-- form表单验证：el-form组件提供了表单验证功能，只需要通过rules属性传入约定的验证规则，并将el-form-item组件的
       prop属性的值设置为需要校验的字段名称即可 
        rules的校验规则写在data中
       -->
      <el-form :model="form" style="width: 80%" :rules="rules" ref="tmfrom">
        <!-- 在el-form-item中的prop属性中设置校验字段 -->
        <el-form-item label="品牌名称" label-width="80px" prop="tmName">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 添加上传图片功能 -->
        <el-form-item label="品牌LoGo" prop="logoUrl">
          <!-- 图片上传地址：/dev-api/admin/product/fileUpload
           action：图片上传地址
           on-success：图片上传成功回调
           before-upload：图片上传之前回调
          -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <!-- 上传图片提示信息 -->
            <div slot="tip" class="el-upload__tip" style="padding-left: 70px">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "TradeMark",
  data() {
    // 自定义校验规则，重点
    /*
      rule：校验规则
      value：用户输入的数据
      callback：放行函数,如果有错，可以在其中传入错误信息
    */
    var validateTmName = (rule, value, callback) => {
      // 判断用户输入,范围2~10个字符
      if (value.length < 2 || value.length > 10) {
        // 不符合规则,放行报错
        callback(new Error("品牌名称在2~10个字之间"));
      } else {
        // 符合规则，直接放行
        callback();
      }
    };
    return {
      // 当前显示页
      pageNum: 1,
      // 每一页显示条数
      pageSize: 3,
      // 总条目数
      total: 0,
      // 品牌数据
      data: [],
      // 是否显示对话框
      dialogFormVisible: false,
      // 收集表单数据
      form: {
        id: "",
        tmName: "",
        logoUrl: "",
      },
      // 表单校验规则rules
      rules: {
        // 表单验证的字段，其值为数组，数组中每个对象都是具体的验证规则
        tmName: [
          // 具体的验证规则，required：表示必须写，message：提示信息，trigger：用户行为，blur或change
          { required: true, message: "请输入品牌名称", trigger: "blur" },
          // min最小字符数，max最大字符数
          // { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "change" },
          // 还可以设置自定义校验规则，validatePass就是规则的函数，这个名字可以随便，这个函数写在data中
          { validator: validateTmName, trigger: "change" },
        ],
        logoUrl: [
          // logo是图片，所以不需要用户行为
          { required: true, message: "请选择品牌LoGo" },
        ],
      },
    };
  },
  // 页面加载后发送请求，获取数据
  mounted() {
    // 获取品牌列表数据
    this.getDataList();
  },
  methods: {
    // 获取品牌列表数据,pageNum设置一个默认值
    async getDataList(page = 1) {
      // 将默认值赋值给data中的pageNum,有传入则使用传入的值，没传入则使用默认值
      this.pageNum = page;
      // 从data中解构出请求需要的参数
      const { pageNum, pageSize } = this;
      // 发送请求,并传入参数
      let result = await this.$API.trademark.reqTradeMarkList(
        pageNum,
        pageSize
      );
      // 如果请求发送成功，则将数据取出来
      if (result.code === 200) {
        // 请求成功
        //将数据总数量保存下来
        this.total = result.data.total;
        // 将品牌数据列表保存
        this.data = result.data.records;
      }
    },
    // 修改每页显示条目数量
    handleSizeChange(size) {
      // 将条目数更新到data中
      this.pageSize = size;
      // 更新data后，重新获取数据列表
      this.getDataList();
    },
    // 点击显示对话框
    showDialog() {
      this.dialogFormVisible = true;
      // 点击时，清空form中的内容
      this.form.logoUrl = "";
      this.form.tmName = "";
    },
    // 上传图片相关回调，图片上传地址：/dev-api/admin/product/fileUpload
    // 图片上传成功回调
    handleAvatarSuccess(res, file) {
      // 返回的res中有实际图片地址
      this.form.logoUrl = res.data;
    },
    // 上传图片之前回调，限制图片的格式和大小
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 点击确定时，添加或修改品牌数据
    addOrUpdateTradeMark() {
      // 首先进行表单验证
      this.$refs.tmfrom.validate(async (valid) => {
        // 判断一下表单验证是否都通过
        if (valid) {
          // 验证通过
          // 首先需要关闭对话框
          this.dialogFormVisible = false;
          // 发送请求，添加或修改品牌数据
          let result = await this.$API.trademark.reqAddOrUpdateTradeMark(
            this.form
          );
          // 判断一下数据是否添加成功
          if (result.code == 200) {
            // 表示添加成功，需要有添加或修改成功的提示信息
            this.$message({
              message: this.form.id ? "修改品牌成功" : "添加品牌成功",
              type: "success",
            });
            // 添加或修改成功之后，重新获取品牌数据列表
            // 重新获取数据时，需要判断一下this.form中是否存在id，存在则停留在当前页面，不存在则停在首页
            this.getDataList(this.form.id ? this.pageNum : 1);
          } else {
            // 添加失败，报出错误信息
            this.$message.error(result.message);
          }
        } else {
          // 验证不通过
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 修改品牌数据
    updateTradeMark(row) {
      // 首先显示dialog对话框
      this.dialogFormVisible = true;
      // 然后将row数据浅拷贝到form中，因为不能直接赋值，否则会改变页面中的数据显示
      // 因为页面中的数据使用了v-modle双向绑定，绑定的就是form中数据，如果直接赋值的话会导致form中的数据发生改变，
      // 从而导致页面中的数据也发生改变，所以需要使用浅拷贝
      this.form = { ...row }; //{...row}浅拷贝
    },
    // 删除品牌
    deleteTradeMark(row) {
      // 显示消息盒子
      this.$confirm(`是否删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          // 点击确定按钮，发送删除品牌请求
          let result = await this.$API.trademark.reqDeleteTradeMark(row.id);
          // 判断一下品牌是否删除成功
          if (result.code == 200) {
            // 删除成功
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            // 删除成功之后，需要重新获取品牌数据列表
            // 重新获取品牌数据的时候，需要进行之前数据列表的数量的判断，数量大于1则显示当前页的数据，数量小于等于1，则返回上一页
            this.getDataList(this.data.length > 1? this.pageNum:this.pageNum - 1)
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style>
/* 上传功能需要样式，样式要一起复制 */
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>