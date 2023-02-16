<template>
	<div>
		<el-form ref="form" label-width="80px" :model="skuInfo">
			<el-form-item label="SPU名称">
				{{spu.spuName}}
			</el-form-item>
			<el-form-item label="SKU名称">
				<el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
			</el-form-item>
			<el-form-item label="价格(元)">
				<el-input placeholder="价格(元)" v-model="skuInfo.price" type="number"></el-input>
			</el-form-item>
			<el-form-item label="重量(千克)">
				<el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
			</el-form-item>
			<el-form-item label="规格描述">
				<el-input type="textarea" placeholder="规格描述" rows="4" v-model="skuInfo.skuDesc"></el-input>
			</el-form-item>
			<el-form-item label="平台属性">
				<el-form :inline="true">
					<el-form-item :label="attr.attrName" v-for="(attr,index) in attrInfoList" :key="attr.id">
						<el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
							<el-option :label="attrValue.valueName" :value="`${attr.id}:${attrValue.id}`"
								v-for="(attrValue,index) in attr.attrValueList" :key="attrValue.id"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</el-form-item>
			<el-form-item label="销售属性">
				<el-form :inline="true">
					<el-form-item :label="saleAttr.saleAttrName" v-for="(saleAttr,index) in spuSaleAttrList"
						:key="saleAttr.id">
						<el-select placeholder="请选择" v-model="saleAttr.saleAttrIdAndAttrValueId">
							<el-option :label="saleAttrValue.saleAttrValueName" :value="`${saleAttr.id}:${saleAttrValue.id}`"
								v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList"
								:key="saleAttrValue.id"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</el-form-item>
			<el-form-item label="图片列表">
				<el-table border style="width: 100%" :data="spuImageList" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55"></el-table-column>
					<el-table-column label="图片" width="width">
						<template slot-scope="{row,$index}">
							<img :src="row.imgUrl" :alt="row.imgName" style="width: 100px; height: 100px;">
						</template>
					</el-table-column>
					<el-table-column label="名称" width="width" prop="imgName"></el-table-column>
					<el-table-column label="操作" width="width">
						<template slot-scope="{row,$index}">
							<el-button type="primary" v-if="row.isDefault==0" @click="changeDefault(row)">设置默认</el-button>
							<el-button v-else>默认</el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="saveSku">保存</el-button>
				<el-button @click="changeScenes">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		name: 'SkuForm',
		data() {
			return {
				attrInfoList: [], //平台属性
				spuImageList: [], //图片列表
				spuSaleAttrList: [], //销售属性
				spu:{},
				skuInfo: {
					category3Id: 0,
					spuId: 0,
					tmId: 0,
					skuName: "",
					price: "",
					weight: "",
					skuDesc: "",
					skuDefaultImg:"",//默认图片
					skuAttrValueList: [
						//{
						//  "attrId": 0,
						//  "valueId": 0
						//}
					],
					skuImageList: [
						//{
						//  "imgName": "string",
						//  "imgUrl": "string",
						//  "isDefault": "string",
						//  "spuImgId": 0
						//}
					],
					skuSaleAttrValueList: [
						//{
						//  "saleAttrId": 0,
						//  "saleAttrValueId": 0
						//}
					],
				},
				//收集选中的图片
				imgList:[]
			}
		},
		methods: {
			//初始化SkuForm数据
			async addNewSku(spu, category1Id, category2Id, category3Id) {
				this.spuName = spu.spuName
				this.skuInfo.spuId=spu.id
				this.skuInfo.tmId= spu.tmId
				this.skuInfo.category3Id = spu.category3Id
				this.spu=spu
				//平台属性
				let attrInfoResult = await this.$API.spu.reqAttrInfo(category1Id, category2Id, category3Id)
				if (attrInfoResult.code == 200) {
					this.attrInfoList = attrInfoResult.data
				}
				//图片列表
				let spuImageResult = await this.$API.spu.reqSpuImage(spu.id)
				if (spuImageResult.code == 200) {
					let list = spuImageResult.data
					list.forEach(item=>{
						item.isDefault=0
					})
					this.spuImageList = list
				}
				//销售属性
				let spuSaleAttrResult = await this.$API.spu.reqSpuSaleAttr(spu.id)
				if (spuSaleAttrResult.code == 200) {
					this.spuSaleAttrList = spuSaleAttrResult.data
				}
			},
			//table表格复选框按钮的事件
			handleSelectionChange(params){
				this.imgList=params
			},
			//设置默认按钮
			changeDefault(row){
				row.isDefault=1
				this.skuInfo.skuDefaultImg=row.imgUrl
			},
			//保存按钮
			async saveSku(){
				const {skuInfo,imgList,attrInfoList,spuSaleAttrList} = this
				let arr = []
				//let arr1 = []
				skuInfo.skuImageList=imgList.map(item=>{
					return {
						imgName:item.imgName,
						imgUrl:item.imgUrl,
						isDefault:item.isDefault,
						spuImgId:item.id
					}
				})
				attrInfoList.forEach(item=>{
					if(item.attrIdAndValueId){
						let [attrId,valueId] = item.attrIdAndValueId.split(':')
						let obj = {attrId,valueId}
						arr.push(obj)
					}
				})
				skuInfo.skuAttrValueList=arr
				//spuSaleAttrList.forEach(item=>{
				//	if(item.saleAttrIdAndAttrValueId){
				//		let [saleId,saleAttrValueId] = item.saleAttrIdAndAttrValueId.split(':')
				//		let obj = {saleId,saleAttrValueId}
				//		arr1.push(obj)
				//	}
				//})
				//skuInfo.skuSaleAttrValueList=arr1
				skuInfo.skuSaleAttrValueList=spuSaleAttrList.reduce((prev,item)=>{
					if(item.saleAttrIdAndAttrValueId){
						let [saleId,saleAttrValueId] = item.saleAttrIdAndAttrValueId.split(':')
						prev.push({saleId,saleAttrValueId})
					}
					return prev
				},[])
				let result = await this.$API.spu.reqSaveSku(skuInfo)
				if(result.code==200){
					this.$emit('changeScenes',0)
					Object.assign(this._data,this.$options.data())
					this.$message({type:'success',message:'添加sku成功'})
				}
			},
			//取消按钮
			changeScenes(){
				this.$emit('changeScenes',0)
				Object.assign(this._data,this.$options.data())
			}
		}
	}
</script>

<style scoped>
</style>
