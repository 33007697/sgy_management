// 引入request
import request from '@/utils/request'


// 请求SPU数据列表接口
// 接口：/admin/product/{page}/{limit}  method：get  参数：page哪一页，limit每页显示条数，params参数：category3Id

export const reqSpuList = (page,limit,category3Id) => request({url:`/admin/product/${page}/${limit}`,method:"get",params:{category3Id}})


// 通过spuid获取指定的spu信息
// 接口：/admin/product/getSpuById/{spuId}  method:get  参数spuId
export const reqSpu = (spuId) => request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})

// 通过spuId获取指定的spu的图片列表
// 接口：/admin/product/spuImageList/{spuId}  method:get 参数spuId
export const reqSpuImageList = (spuId) => request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

// 获取平台全部的销售属性列表，总共就三个
//接口：/admin/product/baseSaleAttrList  method:get 
export const reqSaleAttrList = () => request({url:'/admin/product/baseSaleAttrList',method:'get'})


//获取平台上的品牌信息列表
// 接口：/admin/product/baseTrademark/getTrademarkList   method：get
export const reqTradeMarkList = () => request({url:'/admin/product/baseTrademark/getTrademarkList',method:'get'})

// 添加或修改SPU接口
// 接口：/admin/product/saveSpuInfo  和 /admin/product/updateSpuInfo  method:post  参数就是spu对象
// 判断是使用那个接口是判断一下其是否有id
export const reaAddOrUpdateSpu = (spuInfo) => {
    // 判断其是否有id
    if(spuInfo.id){
        // 有id，表示其是修改功能
        return request({url:'/admin/product/updateSpuInfo',method:'post',data:spuInfo})
    }else{
        // 没有id，表示其是添加功能
        return request({url:"/admin/product/saveSpuInfo",method:'post',data:spuInfo})
    }
}

// 删除spu接口
// 接口：/admin/product/deletespu/{spuId}  method:delete  参数：spuId
export const reqDeleteSpu = (spuId) => request({url:`/admin/product/deletespu/${spuId}`,method:'delete'})


// 点击添加sku页面接口
// 获取sku图片列表数据
// 接口：/admin/product/spuImageList/{spuId}  method:get
export const reqSkuImageList = (spuId) => request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})


// 获取sku平台属性列表数据
// 接口：/admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}  method:get
export const reqAttrInfoList = (category1Id,category2Id,category3Id) => request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

// 获取sku销售属性列表数据
// 接口：/admin/product/spuSaleAttrList/{spuId}  method:get
export const reqSkuSaleAttrList = (spuId) => request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'})


// 保存sku数据请求接口
// 接口：/admin/product/saveSkuInfo   method：post   参数skuInfo对象
export const reqSaveSkuInfo = (data) => request({url:'/admin/product/saveSkuInfo',method:'post',data})


// 查看sku详情列表接口
// 接口：/admin/product/findBySpuId/{spuId}  method:get
export const reqSkuDescList = (spuId) => request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'})
