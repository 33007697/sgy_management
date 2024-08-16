// 引入request模块
import request from '@/utils/request'

// 获取平台一级列表数据的接口
// 接口：/admin/product/getCategory1  method：get 参数无
export const reqCategory1List = () => request({url:'/admin/product/getCategory1',method:'get'})

// 获取平台二级列表数据的接口
// 接口：/admin/product/getCategory2/{category1Id}   method:get  参数Category1Id
export const reqCategory2List = (category1Id) => request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'})


// 获取平台三级列表数据的接口
// 接口：/admin/product/getCategory3/{category2Id}  method：get 参数：Category2Id
export const reqCategory3List = (category2Id) => request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'})


// 获取分类属性列表数据
// 接口：/admin/product/attrinfoList/{category1Id}/{category2Id}/{category3Id}  method：get 参数：1id，2id，3id，三个分类的id
export const reqCategoryAttrList = (category1Id,category2Id,category3Id) => request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})


// 添加属性和属性值的接口
// 接口：/admin/product/saveAttrInfo   method：post  
/*
    参数:
    {
        attrName:  属性名称，
        attrValueList：[   属性名所对应的属性值，其值是数组，因为属性值有多组，不是一个
            {
                attrId:   属性名称所对应的id，添加属性时，该值是没有的
                valueName: 当前属性的属性值
            }
        ]，
        categoryId：CategoryId，就是三级分类的Id，是给三级分类添加属性
        categoryLevel:3，代表三级分类，用于服务器区分是几级分类的
    }
*/ 
export const reqAddCategoryAttr = (data) => request({url:'/admin/product/saveAttrInfo',method:'post',data})

// 删除平台属性的接口
// 接口：/admin/product/deleteAttr/{attrId}  method：delete  参数attrId
export const reqDeleteCategoryAttr = (attrId) => request({url:`/admin/product/deleteAttr/${attrId}`,method:'delete'})