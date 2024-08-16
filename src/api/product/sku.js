import request from '@/utils/request'

// 获取sku列表数据接口
// 接口：/admin/product/list/{page}/{limit}  method:get  参数page，limit
export const reqSkuList = (page,limit) => request({url:`/admin/product/list/${page}/${limit}`,method:'get'})

// sku上架请求
// 接口：/admin/product/onSale/{skuId}  get
export const reqOnSale = (skuId) => request({url:`/admin/product/onSale/${skuId}`,method:'get'})

// sku下架请求、
// 接口：/admin/product/cancelSale/{skuId}  get
export const reqCancelSale = (skuId) => request({url:`/admin/product/cancelSale/${skuId}`,method:'get'})

// 获取sku的详情数据
// 接口：/admin/product/getSkuById/{skuId} get
export const reqSkuDesc = (skuId) => request({url:`/admin/product/getSkuById/${skuId}`,method:'get'})
