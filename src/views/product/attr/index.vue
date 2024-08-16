<template>
  <div>
    <el-card>
      <!-- 使用全局组件CategorySelect  isShow是为了让选项框实现disable禁选功能 -->
      <CategorySelect @getCategroyId="getCategroyId" :show="!isShow"></CategorySelect>
    </el-card>
    <el-card style="margin: 20px 0">
      <!-- 分类属性列表展示结构 -->
      <div v-show="isShow">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addCategory"
          >添加属性</el-button
        >
        <!-- 列表展示 -->
        <el-table :data="attrList" style="width: 100%; margin-top: 20px" border>
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="prop" label="属性值" width="width">
            <!-- 作用域插槽 -->
            <template slot-scope="{ row, $index }">
              <el-tag
                type="success"
                v-for="t1 in row.attrValueList"
                :key="t1.id"
                style="margin-right: 20px"
                >{{ t1.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <!-- 修改属性按钮 -->
              <el-button
                type="warning"
                icon="el-icon-edit"
                size="mini"
                @click="updateAttr(row)"
              ></el-button>
              <!-- 删除属性按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性或者是修改属性页面 ,这个页面与列表展示页面相反-->
      <div v-show="!isShow">
        <!-- 行内表单 ,收集数据-->
        <el-form :inline="true" ref="form" :model="attrInfo" label-width="80px">
          <el-form-item label="属性名称">
            <el-input
              placeholder="请输入属性名称"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <!-- 添加属性按钮 和取消按钮-->
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addCategoryAttr"
          :disabled="!attrInfo.attrName.trim()"
          >添加属性</el-button
        >
        <el-button @click="isShow = true">取消</el-button>
        <!-- 属性列表,展示列表，并收集数据 -->
        <el-table
          :data="attrInfo.attrValueList"
          style="width: 100%; margin: 20px 0"
        >
          <el-table-column type="index" label="序号" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="属性名称" width="width">
            <!-- 这里是个输入框 ,需要使用作用域插槽-->
            <template slot-scope="{ row, $index }">
              <!-- 需要一个动态属性，用于显示与隐藏元素 ,一但输入框失去鼠标焦点就会切换为展示框-->
              <!-- 输入时，按enter也可以切换为展示框,但是keyup为自定义事件，需要进行native转化为原生事件，并且使用enter -->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值"
                :ref="$index"
                size="mini"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
              ></el-input>
              <!-- 输入框和展示框，不能同时存在，一个显示，另外一个就需要隐藏 ,点击span标签时，需要切换到输入框-->
              <!-- 点击span标签时，需要切换到输入框模式，并且输入框需要获取到鼠标焦点 -->
              <span
                v-else
                @click="spanClick(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <!-- 里面是一个删除按钮 -->
            <template slot-scope="{ row, $index }">
              <!-- 点击删除按钮的时候，删除当前的属性值 -->
              <!-- 点击删除之前，需要先提示一下是否要删除，确定删除再删除 -->
              <!-- 使用气泡弹窗 -->
              <el-popconfirm
                :title="`确定要删除${row.valueName}吗？`"
                @onConfirm="deleteAttrValue($index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 确认保存和取消按钮 -->
         <!-- 保存功能按钮，在attrValueList中没有数据的时候是不能点击的 -->
        <el-button
          type="primary"
          :disabled="attrInfo.attrValueList.length<1"
          @click="saveAttr"
          >保存</el-button
        >
        <el-button @click="isShow = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
// 引入深拷贝方法
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "Attr",
  data() {
    return {
      // 一级分类id
      category1Id: "",
      // 二级分类id
      category2Id: "",
      // 三级分类id
      category3Id: "",
      // 分类属性列表
      attrList: [],
      // 是否显示列表
      isShow: true,
      // 添加或修改分类属性时需要收集的数据
      attrInfo: {
        // 属性名称
        attrName: "",
        // 属性名称所对应的属性值，是个数组
        attrValueList: [
          // 其中的每个对象都是一个属性，一开始其中是没有数据的
          // {
          //   attrId:'',
          //   valueName:'',
          // }
        ],
        // CategoryId，就是要给哪个分类添加属性
        categoryId: 0,
        // CategoryId的级别，就是给几级分类添加属性，我们这边是三级分类，就是3
        categoryLevel: 3,
      },
    };
  },
  methods: {
    getCategroyId(categoryId) {
      // 判断一下是哪个id
      if (categoryId.level == 1) {
        this.category1Id = categoryId.categoryId;
        // 清空其它两个id，2id和3id
        this.category2Id = "";
        this.category3Id = "";
      } else if (categoryId.level == 2) {
        this.category2Id = categoryId.categoryId;
        // 清空3id
        this.category3Id = "";
      } else {
        // 获取三级分类id
        this.category3Id = categoryId.categoryId;
        // 获取三级分类的属性数据
        this.getCategoryAttrList();
      }
    },
    // 发送请求获取三级分类的属性数据
    async getCategoryAttrList() {
      // 解构出需要的三个分类id
      const { category1Id, category2Id, category3Id } = this;
      // 发送请求获取分类属性列表数据
      let result = await this.$API.attr.reqCategoryAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      // 判断一下数据是否请求成功
      if (result.code == 200) {
        // 请求成功
        this.attrList = result.data;
      }
    },
    // 点击添加属性按钮，在收集数据的attrValueList中添加一条数据
    addCategoryAttr() {
      // 在attrInfo中的attrValueList中添加一条数据
      this.attrInfo.attrValueList.push({
        // 属性id，因为是添加属性，所以这个值没有，所以设置为undefined
        // attrId在修改页面中的时候，是有值，在修改页面中的值就是属性的ID
        // 可以通过获取属性的id，如果有就是属性的id，如果没有就是undefined
        attrId: this.attrInfo.id,
        // 属性名称为空，需要收集
        valueName: "",
        // 添加一个属性用于展示与隐藏输入框元素，输入与展示切换
        flag: true,
      });
      // 添加完毕之后，输入框获取鼠标焦点，当前元素就是attrValueList列表中的最后一个元素
      this.$nextTick(() => {
        // 就是获取列表中最后一个元素的坐标，然后使用这个坐标获取元素，并获取鼠标焦点
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    // 点击切换到添加属性页面，并且需要清除之前收集属性数据
    addCategory() {
      // 切换到添加属性页面,隐藏当前页面
      this.isShow = false;
      // 清除之前收集到请求需要的表单数据
      this.attrInfo.attrName = "";
      this.attrInfo.attrValueList = [];
      // 点击添加属性按钮的时候，先将Category3id收集到参数中
      this.attrInfo.categoryId = this.category3Id;
    },
    // 修改属性按钮
    updateAttr(row) {
      // 点击修改属性按钮时，显示修改页面
      this.isShow = false;
      // 将传入的数据row，拷贝到attrInfo中，替代原始数据，因为修改属性页面和添加属性页面时同一个页面
      // 数据双向绑定的是同一个对象，同时不能因为修改数据而影响页面的数据，所以需要进行拷贝，同时因为数据过于复杂，所以需要进行深拷贝，浅拷贝不行
      // 浅拷贝只支持拷贝第一层数据，而多层结构将无能为力，需要深拷贝才行，深拷贝了数据，将不会影响源数据
      // 深拷贝需要使用第三方库lodash中的cloneDeep方法
      this.attrInfo = cloneDeep(row);
      // 在数据进行了深拷贝之后，需要对拷贝到数据进行一下处理，需要给数据中添加flag属性，该属性必须为动态属性
      this.attrInfo.attrValueList.forEach((item) => {
        // 在每个item中添加一个flag属性，用于切换输入框和展示框
        // 不能直接对象item进行修改，应为响应式的问题，直接修改的数据不再是响应式数据，需要使用$set方法才行
        // this.$set(item，attr，attrValue) 第一个参数：在哪个对象中添加属性，第二个参数：添加什么属性，第三个参数：添加的属性值是什么
        this.$set(item, "flag", false);
        // 添加完毕之后，必须返回true，因为forEach函数需要
        return true;
      });
    },
    // 切换展示框和输入框
    toLook(row) {
      // 一旦让用户输入就有各种问题
      // 修改状态之前，需要先进行一下判断，输入框中是否有值，没有值，不允许切换
      if (row.valueName.trim() == "") {
        // 提示用户需要输入属性值
        // this.$message({type:'warning',message:'属性值不能为空，请输入属性值！'})
        return;
      }
      // 判断一下当前输入的值是否与之前输入的属性值相同,some方法会返回一个布尔值
      let res = this.attrInfo.attrValueList.some((item) => {
        // 首先需要先排除当前元素，也就是row，然后再对比其他的元素
        if (row !== item) {
          // 排除了当前元素之后，再次判断一下当前输入的值是否有其他元素中的值相同
          return row.valueName == item.valueName;
        }
      });
      // res为true表示当前输入的值与其他元素中的值相同，提示用户，并且不能切换
      if (res) {
        this.$message({ type: "warning", message: "属性值重复，请重新输入！" });
        return;
      }
      // 修改动态数据flag，切换展示框和输入框
      row.flag = false;
    },
    // 点击sapn标签时，切换到输入框，并且输入框自动获取到鼠标焦点
    spanClick(row, index) {
      // 首先切换到输入框模式
      row.flag = true;
      // 获取输入框元素，并且输入框中获取到鼠标焦点
      // 因为输入框元素还没有渲染完毕，所以无法获取到输入框元素，需要使用$nextTick()方法
      // $nextTick()方法是当循环结束，渲染完毕之后执行一次
      this.$nextTick(() => {
        // 当循环结束，渲染完毕之后，执行一次，输入框获取鼠标焦点
        this.$refs[index].focus();
      });
    },
    // 删除属性值的操作
    deleteAttrValue(index) {
      // 点击删除按钮的时候，删除属性值,这个删除操作不需要发送网络请求
      this.attrInfo.attrValueList.splice(index, 1);
    },
    // 点击保存的时候发送请求，保存数据到服务器上
    async saveAttr(){
      // 首先需要先处理一下数据，将数据中空的数据删除，然后将我们后来添加的flag属性也删除
      // filter会返回一个新的数组
      let attrValueList = this.attrInfo.attrValueList.filter(item=>{
        // 删除我们之前添加的flag属性，这个属性是用于切换输入框和展示框的
        delete item.flag
        // 删除属性值为空的属性，保留有数据的属性
        return item.valueName.trim() !== ''
      })
      // 将处理之后新的数组赋值给attrInfo中的attrValueList
      this.attrInfo.attrValueList = attrValueList
      // 发送请求，保存数据到服务器上
      // 需要获取到成功和失败的信息,使用try...catch方法
      try {
        // 发送请求，保存数据到服务器
        await this.$API.attr.reqAddCategoryAttr(this.attrInfo)
        // 切换到展示列表页面
        this.isShow = true
        // 提示保存数据成功的提示信息
        this.$message({type:'success',message:'保存属性成功'})
      } catch (err) {
        // 失败则提示保存失败
        this.$message({type:'danger',message:'保存失败'})
      }
    }
  },
};
</script>

<style scoped>
</style>
