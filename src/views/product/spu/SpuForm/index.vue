<template>
  <div>
    <!-- 添加或修改spu页面 -->
    <!-- 使用的是el-form组件 绑定收集数据对象spu-->
    <el-form ref="form" label-width="80px" :model="spu">
      <el-form-item label="SPU名称">
        <!-- 收集spu名称 -->
        <el-input placeholder="请输入SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <!-- 展示品牌信息，并收集品牌id -->
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述">
        <!-- input的type属性值为textarea时，表示其是一个多行文本输入框 -->
        <!-- rows设置多行文本输入框的行数 -->
        <!-- 展示并收集spu描述信息 -->
        <el-input
          type="textarea"
          placeholder="描述信息"
          rows="4"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="SPU图片">
        <!-- 这其中使用的是el-upload上传组件，上传图片 -->
        <!-- file-list ：设置照片墙的列表展示，其值是个数组，数组中每一组对象都是一张图片，每一组对象中必须有name字段和url字段 -->
        <!-- on-preview：图片展示时触发
         on-remove：删除图片时触发
         on-success: 图片上传成功之后回调
          -->
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="uploadImage"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <!-- 展示该spu中没有的销售属性 -->
        <el-select
          :placeholder="`还有${saleList.length}项没有选取`"
          v-model="saleAttrId"
        >
          <el-option
            :label="sl.name"
            :value="`${sl.id}:${sl.name}`"
            v-for="sl in saleList"
            :key="sl.id"
          ></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" :disabled="!saleAttrId" @click="addSaleAttr">添加销售属性</el-button
        >
        <el-table style="width: 100%" border :data="spu.spuSaleAttrList">
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名" width="150px">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称列表" width="width">
            <!-- 这里面是el-tag标签 -->
            <template slot-scope="{ row, $index }">
              <!-- :disable-transitions="false"
                @close="handleClose(tag)" 表示删除标签的回调
                -->
              <!-- 遍历，并展示tag数据 -->
              <el-tag
                :key="tag.id"
                v-for="(tag,index) in row.spuSaleAttrValueList"
                closable
                @close="handleClose(row,index)"
                :disable-transitions="false"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 
              @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
               -->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                :ref="$index"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row,$index)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150px">
            <template slot-scope="{ row, $index }">
              <!-- 点击当前按钮的时候，删除当前销售属性 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <!-- 保存，取消按钮 -->
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cancal">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SpuForm",
  data() {
    return {
      // 对话框中图片的地址
      dialogImageUrl: "",
      dialogVisible: false,
      // 销售属性id
      saleAttrId: "",
      // 保存spu信息,添加和修改是不同，数据收集到这里
      // 保存数据时，需要发送给服务的参数
      spu: {
        // category3Id
        category3Id: "",
        // 品牌id
        tmId: "",
        // spu描述
        description: "",
        // spu名称
        spuName: "",
        // spu图片列表
        spuImageList: [
          // {imgName:'',imgUrl:'',spuId:'',id:''},
        ],
        // spu的销售属性
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId:'',
          //   id:'',
          //   saleAttrName:'',
          //   spuSaleAttrValueList:[
          //     {
          //       baseSaleAttrId:'',
          //       id:'',
          //       isChecked:'',
          //       saleAttrName:'',
          //       saleAttrValueName:'',
          //       spuId:''
          //     },
          //   ]
          // },
        ],
      },
      // 保存品牌列表信息
      tradeMarkList: [],
      // 保存spu图片列表
      spuImageList: [],
      // 保存平台全部销售属性列表
      saleAttrList: [],
    };
  },
  methods: {
    // 图片被删除时触发回调
    handleRemove(file, fileList) {
      // file：删除的图片信息
      // fileList：删除图片之后，剩余的图片列表
      // 图片删除时，将图片剩余的列表保存起来
      this.spuImageList = fileList
    },
    // 图片预览时触发回调
    handlePictureCardPreview(file) {
      // 修改图片的地址，展示图片
      this.dialogImageUrl = file.url;
      // 修改dialog的显示与隐藏的状态
      this.dialogVisible = true;
    },
    // 图片上传成功之后的回调
    uploadImage(response,file,fileList){
      // responses 是服务器返回的图片信息，包含图片的真实地址
      // file；是服务图片的信息
      // fileList：上传图片完毕之后，所有的图片列表
      // 对图片的信息进行处理，添加imgName字段和imgUrl字段
      file.imgName = file.name
      file.imgUrl = response.data
      // 然后将处理过的数据添加到图片列表中
      this.spuImageList.push(file)
    },
    // 发送请求，获取需要的数据
    async initSpuForm(row) {
      // 发送请求获取数据，并将参数传入
      // 获取某一个spu信息、
      if (row) {
        let spuResult = await this.$API.spu.reqSpu(row.id);
        //判断一下数据是否请求成功
        if (spuResult.code == 200) {
          this.spu = spuResult.data;
        }
      }
      // 获取平台品牌列表数据
      let tradeMark = await this.$API.spu.reqTradeMarkList();
      //判断一下数据是否请求成功
      if (tradeMark.code == 200) {
        this.tradeMarkList = tradeMark.data;
      }
      // 获取spu图片列表信息
      if (row) {
        let imageResult = await this.$API.spu.reqSpuImageList(row.id);
        // 判断一下数据是否请求到
        if (imageResult.code == 200) {
          // 因为该图片列表需要通过照片墙展示，需要配置照片墙的file-list属性
          // 该属性的值是个数组，并且其中每一组对象都是一张图片
          // 每一组对象中必须有name字段和url字段，name图片名称，ulr图片地址
          let imageList = imageResult.data;
          // 遍历imageList，将其中的每一组对象都添加name字段和ulr字段
          imageList.forEach((item) => {
            item.name = item.imgName;
            item.url = item.imgUrl;
          });
          // 然后将处理过的数据保存到data中
          this.spuImageList = imageList;
        }
      }
      // 获取平台全部销售属性列表
      let saleAttrResult = await this.$API.spu.reqSaleAttrList();
      // 判断一下数据是否请求成功
      if (saleAttrResult.code == 200) {
        this.saleAttrList = saleAttrResult.data;
      }
    },
    // tag标签的回调
    // 点击添加属性值回调
    showInput(row,index) {
      // 点击添加到时候，给当前元素中添加两条信息
      // inputVisible 用于控制input输入框的显示和隐藏
      // inputVaule  用于收集输入框输入数据
      this.$set(row,'inputVisible',true)
      this.$set(row,'inputValue','')
      // 当循环结束之后，渲染完毕之后执行一次，获取鼠标焦点，使用$nextTick()
      this.$nextTick(()=>{
        this.$refs[index].focus()
      })
    },
    // 输入框输入的回调
    handleInputConfirm(row) {
      // 从spuSaleAttrValueList中将baseSaleAttrId,inputValue解构出来
      const {baseSaleAttrId,inputValue} = row
      // 判断一下用户输入的inputValue是否为空，为空则不执行以下操作
      if(inputValue.trim() == ''){
        this.$message({type:'error',message:"属性值不能为空"})
        // 结束运行下方代码
        return;
      }
      // 判断一下用户输入的属性值是否已经存在了，不允许重复添加，使用数组的some方法
      let result = row.spuSaleAttrValueList.some(item=>item.saleAttrValueName == inputValue)
      // 如果存在则result为true
      if(result){
        this.$message({type:'error',message:'属性值不能重复'})
        return;
      }
      // 首先需要先切换输入框，隐藏输入框
      row.inputVisible = false
      // 整理输入的数据，将其添加到spuSaleAttrValueList中
      let attrValueObj = {
        baseSaleAttrId,
        saleAttrValueName:inputValue
      }
      // 然后将整理好的对象放到spuSaleAttrValueList中
      row.spuSaleAttrValueList.push(attrValueObj)
    },
    // 点击添加销售属性回调
    addSaleAttr(){
      // 从data中共将saleAttrId进行处理，使用：拆分其为一个数组
      let [baseSaleAttrId,saleAttrName] = this.saleAttrId.split(':')
      // 处理数据，将处理过后的数据添加到spuSaleAttrList中
      let result = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList:[]
      }
      // 将处理后的数据添加到spuSaleAttrList中
      this.spu.spuSaleAttrList.push(result)
      // 然后清空saleAttrId
      this.saleAttrId = ''
    },
    // 删除销售属性值的回调
    handleClose(row,index){
      // 删除属性值列表中指定索引的值
      row.spuSaleAttrValueList.splice(index,1)
    },

    // 点击保存时，保存数据，并将数据发送给服务器
    async addOrUpdateSpu(){
      // 点击保存到时候，将数据进行整理，整理到spu中
      // 首先整理图片，将图片列表放到spu中
      this.spu.spuImageList = this.spuImageList
      // 然后向服务器发送请求，并将spu携带上
      let result = await this.$API.spu.reaAddOrUpdateSpu(this.spu)
    //  判断一下请求是否成功
      if(result.code == 200){
        // 提示保存成功的信息
        this.$message({type:'success',message:'保存成功'})
        // 通知其父元素,使用自定义事件，激活自定义事件切换页面，sence切换为0
        // 使用flag字段区分当前是添加还是修改
        this.$emit('setSence',{sence:0,flag:this.spu.id?"修改":'添加'})
      }
      // 修改数据或添加数据成功之后，需要清空data中所有属性的值
      Object.assign(this._data,this.$options.data())
    },
    // 点击添加spu时触发回调
    async addSpuForm(category3Id){
      // 回调接受category3Id，并将其收集起来
      this.spu.category3Id = category3Id
      // 获取平台品牌列表数据
      let tradeMark = await this.$API.spu.reqTradeMarkList();
      //判断一下数据是否请求成功
      if (tradeMark.code == 200) {
        this.tradeMarkList = tradeMark.data;
      }
      // 获取平台全部销售属性列表
      let saleAttrResult = await this.$API.spu.reqSaleAttrList();
      // 判断一下数据是否请求成功
      if (saleAttrResult.code == 200) {
        this.saleAttrList = saleAttrResult.data;
      }
      
    },
    // 点击取消按钮的回调
    cancal(){
      // 首先需要通过其父组件转变页面状态，回到列表展示页面
      this.$emit('setSence', {sence:0,flag:''})
      // 清空data中的所有属性的数据
      // 使用Object.assign合并方法，合并this._data 和 this.$options.data()
      // this._data是当前实例中data的映射，this.$options.data()是当前实例的配置属性中data函数执行，会返回一个没有数据的空对象，
      // 合并这两个数据，从而实现清空data中所有动态属性的数据功能
      Object.assign(this._data,this.$options.data())
    }
  },
  // 计算属性，需要将平台销售属进行过滤，将当前spu中没有的销售属性过滤出来
  computed: {
    saleList() {
      // 过滤出哪些销售属性不存在与当前spu中
      return this.saleAttrList.filter((item) => {
        // 对比总销售属性和当前spu销售属性的名称，every方法，其会返回一个布尔值
        return this.spu.spuSaleAttrList.every((item1) => {
          // 判断一下销售属性的名称是否不一致，挑选出不一致的保存
          return item.name != item1.saleAttrName;
        });
      });
    },
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>