//这个模块主要获取的是平台属性管理的数据的模块
import request from "@/utils/request"
//获取Spu列表的接口
///admin/product/{page}/{limit}
export const reqSpuList = (page,limit,category3Id)=>request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}})
//获取spu基本信息
///admin/product/getSpuById/{spuId}
export const reqSpu = (spuId)=>request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})
//获取品牌的信息
///admin/product/baseTrademark/getTrademarkList
export const reqTradeMarkList = ()=>request({url:'/admin/product/baseTrademark/getTrademarkList',method:'get'})
//获取spu图标的接口
///admin/product/spuImageList/{spuId}
export const reqSpuImageList = (spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})
//获取平台全部销售属性
///admin/product/baseSaleAttrList
export const reqBaseSaleAttrList = ()=>request({url:'/admin/product/baseSaleAttrList',method:'get'})
//更改spu信息
///admin/product/updateSpuInfo
//添加spu信息
///admin/product/saveSpuInfo
export const reqAddOrUpdateSpu = (spuInfo)=>{
	if(spuInfo.id){
		return request({url:'/admin/product/updateSpuInfo',method:'post',data:spuInfo})
	}else{
		return request({url:'/admin/product/saveSpuInfo',method:'post',data:spuInfo})
	}
}
//删除spu的接口
///admin/product/deleteSpu/{spuId}
export const reqDeleteSpu = (spuId)=>request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})
//平台属性
///admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfo = (category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})
//图片列表
///admin/product/spuImageList/{spuId}
export const reqSpuImage = (spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})
//销售属性
///admin/product/spuSaleAttrList/{spuId}
export const reqSpuSaleAttr = (spuId)=>request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'})
//保存sku信息
///admin/product/saveSkuInfo
export const reqSaveSku = (skuInfo)=>request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo})
//查看当前spu所有sku列表
///admin/product/findBySpuId/{spuId}
export const reqFindBySpuId =(spuId)=>request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'})