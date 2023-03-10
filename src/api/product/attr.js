//这个模块主要获取的是平台属性管理的数据的模块
import request from "@/utils/request"
//获取一级分类数据接口
///admin/product/getCategory1
export const reqCategory1List = ()=>request({url:'/admin/product/getCategory1',method:'get'})
//获取二级分类数据接口
///admin/product/getCategory2/{category1Id}
export const reqCategory2List = (category1Id)=>request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'})
//获取三级分类数据接口
///admin/product/getCategory3/{category2Id}
export const reqCategory3List = (category2Id)=>request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'})
//获取平台属性数据的接口
///admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrList = (category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})
//添加属性或属性值的接口
///admin/product/saveAttrInfo
export const reqAddOrUpdateAttr = (data)=>request({url:'/admin/product/saveAttrInfo',method:'post',data})