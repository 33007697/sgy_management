<template>
  <div>
    <el-form ref="form" label-width="80px">
        <!-- 展示spu名称 -->
      <el-form-item label="SPU名称"> {{spu.spuName}}</el-form-item>
      <el-form-item label="SKU名称">
        <!-- 收集sku名称 -->
        <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <!-- 收集价格，价格是数字 -->
        <el-input placeholder="价格(元)" type="number" v-model="skuInfo.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(千克)">
        <!-- 收集重量 -->
        <el-input placeholder="重量(千克)" v-model="skuInfo.weigth"></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <!-- 收集规格描述 -->
        <el-input type="textarea" placeholder="规格描述" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true" label-width="80px">
          <!-- 展示平台属性列表数据 -->
          <el-form-item
            :label="attr.attrName"
            v-for="attr in skuAttrList"
            :key="attr.id"
          >
          <!-- 把数据收集到当前对象的一个属性上 -->
            <el-select placeholder="请选择" v-model="attr.attrAndAttrValueId">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <!-- 展示销售属性列表 -->
      <el-form-item label="销售属性">
        <el-form :inline="true" label-width="80px">
          <el-form-item :label="saleAttr.saleAttrName" v-for="saleAttr in skuSaleAttrList" :key="saleAttr.id">
            <!-- 收集数据到当前对象的一个属性上 -->
            <el-select placeholder="请选择" v-model="saleAttr.saleAndsaleValueId">
              <el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`" v-for="saleAttrValue in saleAttr.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <!-- 展示图片列表数据，并收集数据 -->
         <!-- @selection-change="handleSelectionChange"  是表格选项框被选中回调 -->
        <el-table style="width: 100%" border :data="skuImageList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="80" align="center">
          </el-table-column>
          <el-table-column prop="prop" label="图片" width="width">
            <template slot-scope="{row,$index}">
                <img :src="row.imgUrl" style="width: 100px;height: 100px;">
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称" width="width">
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="{row,$index}">
                <!-- 默认和设为默认二选一 -->
                <el-button type="primary" size="mini" v-if="row.isDefault == 0" @click="setDefult(row)">设为默认</el-button>
                <el-tag type="success" v-else>默认</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSku">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "SkuForm",
  data() {
    return {
      // 保存平台属性列表
      skuAttrList: [],
      //保存销售属性列表
      skuSaleAttrList: [],
      // 保存图片列表
      skuImageList: [],
      // 收集sku的数据，通过数据的双向绑定v-modle
      skuInfo: {
        // 第一部分，由其父组件传递过来的数据
        category3Id: "",
        spuId: "",
        tmId: "",
        // 第二部分：通过数据双向绑定收集到的数据
        skuName: "",
        price: "",
        weigth: "",
        skuDesc: "",
        // 第三部分：需要自己书写代码搜集的数据
        skuDefaultImg: "", //默认图片地址
        skuImageList: [], //收集sku图片
        skuAttrValueList: [], //收集平台属性
        skuSaleAttrValueList: [], //收集销售属性
      },
      //   spu对象
      spu: {},
      //   收集图片选中的对象列表
      imageList: [],
    };
  },
  methods: {
    async getSkuData(category1Id, category2Id, spu) {
        // 将父组件传递过来的数据收集一下
        this.spu = spu
        this.skuInfo.category3Id = spu.category3Id
        this.skuInfo.spuId = spu.id
        this.skuInfo.tmId = spu.tmId
      // 发送请求获取平台属性列表数据
      let result = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (result.code == 200) {
        // 判断一下数据是否请求成功，请求成功后，保存数据
        this.skuAttrList = result.data;
      }
      //发送请求，获取平台销售属性列表数据
      let result1 = await this.$API.spu.reqSkuSaleAttrList(spu.id);
      if (result1.code == 200) {
        // 判断一下数据是否请求成功，请求成功后，保存数据
        this.skuSaleAttrList = result1.data;
      }
      // 发送请求获取sku图片列表数据
      let result2 = await this.$API.spu.reqSkuImageList(spu.id);
      // 判断一下数据是否请求成功
      if (result2.code == 200) {
        // 保存数据之前，需要对服务器返回来的数据进行一下处理，添加一个isDefault属性，用于控制其是否为默认图片
        let list = result2.data
        // 遍历数组，将其中的每个对象都添加一个isDefault属性
        list.forEach(item => {
            item.isDefault = 0
        })
        // 然后将处理过后的数组保存起来
        this.skuImageList = list
      }
    },
    // 表格选项框被选中回调
    handleSelectionChange(selection){
        // 其被选中时，将选中的列表数据，保存到data中
        this.imageList = selection
    },
    // 设置默认图片回调
    setDefult(row){
        // 首先将图片列表中所有的对象中的isDefault的值全部设置为0
        this.skuImageList.forEach(item=>{
            item.isDefault = 0
        })
        // 然后将当前选中的对象中的isDefault设置为1
        row.isDefault = 1
        // 最后默认图片地址收集到data中的skuInfo中
        this.skuInfo.skuDefaultImg = row.imgUrl
    },
    // 点击取消按钮时，提醒其父元素，需要切换显示页面
    cancel(){
        // 提醒其父组件要切换页面
        this.$emit('changeSence',0)
        // 清理之前是数据
        Object.assign(this._data,this.$options.data())
    },
    // 点击保存时，发送请求，保存sku数据
    async saveSku(){
        // 处理发送请求时需要携带的参数
        // 解构出需要是参数
        const {skuInfo,skuSaleAttrList,skuAttrList,imageList} = this
        // 首先处理skuAttrValueList平台属性,使用reduce方法,初始值为空数组
        skuInfo.skuAttrValueList =  skuAttrList.reduce((prev,item)=>{
            // 判断一下是否有这个值，如果有才处理数据
            if(item.attrAndAttrValueId){
                // 先结构数据
                const [attrId,valueId] = item.attrAndAttrValueId.split(':')
                // 将处理后的数据放到prev中
                prev.push({attrId,valueId})
            }
            // reduce需要返回prev，prev就是初始的数组
            return prev
        },[])
        // 然后处理skuSaleAttrList销售属性数据
        skuInfo.skuSaleAttrValueList = skuSaleAttrList.reduce((prev,item)=>{
            // 判断一下对象中是否有这个值，如果有才进行处理
            if(item.saleAndsaleValueId){
                // 先将数据源进行拆分，然后解构赋值
                const [saleAttrId,saleAttrValueId] = item.saleAndsaleValueId.split(':')
                // 然后将数据放到prev中
                prev.push({saleAttrId,saleAttrValueId})
            }
            // reduce中必须返回prev3
            return prev
        },[])
        // 处理imageList图片列表中的数据进行处理，然后将数据放到data中
        skuInfo.skuImageList = imageList.map(item=>{
            return {
                imgName:item.imgName,
                imgUrl:item.imgUrl,
                isDefault:item.isDefault,
                spuImgId:item.id
            }
        })
        // 数据都处理完毕之后，发送请求，保存数据到服务器中
        let result = await this.$API.spu.reqSaveSkuInfo(skuInfo)
        // 判断一下是否保存成功
        if(result.code == 200){
            // 保存成功之后，提示信息
            this.$message({type:'success',message:'保存SKU成功'})
            // 激活自定义事件，通过其父组件切换页面
            this.$emit('changeSence',0)
            // 清除skuInfo中数据
            Object.assign(this._data,this.$options.data())
        }    
    }
  },
};
</script>

<style>
</style>