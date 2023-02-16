import request from "@/utils/request"
//sku列表数据
///admin/product/list/{page}/{limit}
export const reqSkuList = (page,limit)=>request({url:`/admin/product/list/${page}/${limit}`,method:'get'})
//sku上架
///admin/product/onSale/{skuId}
export const reqOnSale = (skuId)=>request({url:`/admin/product/onSale/${skuId}`,method:'get'})
//sku下架
///admin/product/cancelSale/{skuId}
export const reqCancelSale = (skuId)=>request({url:`/admin/product/cancelSale/${skuId}`,method:'get'})
//展示sku详情
///admin/product/getSkuById/{skuId}
export const reqGetSku = (skuId)=>request({url:`/admin/product/getSkuById/${skuId}`,method:'get'})
//删除一个sku
///admin/product/deleteSku/{skuId}
export const reqDeleteSku = (skuId)=>request({url:`/admin/product/deleteSku/${skuId}`,method:'delete'})