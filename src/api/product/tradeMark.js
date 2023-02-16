//这个模块主要获取的是品牌管理的数据的模块
//获取品牌列表接口
///admin/product/baseTrademark/{page}/{limit}
import request from "@/utils/request"
export const reqTradeMarkList = (page,limit)=>request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})
//添加品牌的接口
///admin/product/baseTrademark/save  参数：logoUrl,tmName
//export const reqAddTradeMark = (tradeMark)=>request({url:'/admin/product/baseTrademark/save',method:'post',data:tradeMark})
//修改品牌的接口
///admin/product/baseTrademark/update  参数：id,logoUrl,tmName
//export const reqUpdateTradeMark = (tradeMark)=>request({url:'/admin/product/baseTrademark/update',method:'put',data:tradeMark})
//添加或修改品牌的接口
export const reqAddOrUpdateTradeMark  = (tradeMark)=>{
	if(tradeMark.id){
		return request({url:'/admin/product/baseTrademark/update',method:'put',data:tradeMark})
	}else{
		return request({url:'/admin/product/baseTrademark/save',method:'post',data:tradeMark})
	}
}
//删除品牌的接口
///admin/product/baseTrademark/remove/{id}
export const reqDeleteTradeMark = (id)=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})