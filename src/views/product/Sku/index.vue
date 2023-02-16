<template>
	<div>
		<el-table style="width: 100%;" border :data="records">
			<el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
			<el-table-column label="名称" width="width" prop="skuName"></el-table-column>
			<el-table-column label="描述" width="width" prop="skuDesc"></el-table-column>
			<el-table-column label="默认图片" width="160px">
				<template slot-scope="{row,$index}">
					<img :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px;">
				</template>
			</el-table-column>
			<el-table-column label="重量(KG)" width="80px" prop="weight"></el-table-column>
			<el-table-column label="价格(元)" width="120px" prop="price"></el-table-column>
			<el-table-column label="操作" width="width" align="center" prop="">
				<template slot-scope="{row,$index}">
					<el-button type="success" icon="el-icon-sort-down" size="mini" v-if="row.isSale==0" @click="cancelSale(row)"></el-button>
					<el-button type="success" icon="el-icon-sort-up" size="mini" v-else @click="onSale(row)"></el-button>
					<el-button type="primary" icon="el-icon-edit" size="mini" @click="edit"></el-button>
					<el-button type="info" icon="el-icon-info" size="mini" @click="info(row)"></el-button>
					<el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteSku(row)"></el-button>
				</template>
			</el-table-column>
		</el-table>
		<el-drawer :visible.sync="drawer" :show-close="false" size="50%">
		  <el-row>
		    <el-col :span="5">名称</el-col>
		    <el-col :span="16">{{skuInfo.skuName}}</el-col>
		  </el-row>
		  <el-row>
		    <el-col :span="5">描述</el-col>
		    <el-col :span="16">{{skuInfo.skuDesc}}</el-col>
		  </el-row>
		  <el-row>
		    <el-col :span="5">价格</el-col>
		    <el-col :span="16">{{skuInfo.price}}</el-col>
		  </el-row>
		  <el-row>
		    <el-col :span="5">平台属性</el-col>
		    <el-col :span="16">
				<el-tag type="success" v-for="(tag,index) in skuInfo.skuAttrValueList" :key="tag.id" style="margin-right: 10px;">{{tag.attrId}}-{{tag.valueId}}</el-tag>
			</el-col>
		  </el-row>
		  <el-row>
		    <el-col :span="5">商品图片</el-col>
		    <el-col :span="16">
				<el-carousel height="490px">
				  <el-carousel-item v-for="(item,index) in skuInfo.skuImageList" :key="item.id">
				    <img :src="item.imgUrl" :alt="item.imgName" style="width: 100%;">
				  </el-carousel-item>
				</el-carousel>
			</el-col>
		  </el-row>
		</el-drawer>
		<el-pagination
		    background
		    style="margin-top: 20px;text-align: center;" 
			:current-page="page" 
			:total="total" 
			:page-size="limit" 
			:page-count="5"
			:page-sizes="[3,5,10]" layout="prev,pager,next,jumper,->,sizes,total"
			@current-change="handleCurrentChange"
			@size-change="handleSizeChange">
		</el-pagination>
	</div>
</template>

<script>
	export default {
		name:'Sku',
		data(){
			return {
				page:1,
				total:0,
				limit:3,
				records:[],
				drawer: false,
				skuInfo:{}
			}
		},
		methods:{
			//currentPage 改变时会触发
			handleCurrentChange(pager){
				this.page=pager
				this.getSkuList()
			},
			//pageSize 改变时会触发
			handleSizeChange(limit){
				this.limit=limit
				this.getSkuList()
			},
			//请求sku列表数据
			async getSkuList(pager){
				if(pager)
				this.page=pager
				const {page,limit} = this
				let result= await this.$API.sku.reqSkuList(page,limit)
				if(result.code==200){
					this.total=result.data.total
					this.records=result.data.records
				}
			},
			//sku下架 isSale==1说明要上架
			async cancelSale(sku){
				let result = await this.$API.sku.reqCancelSale(sku.id)
				if(result.code==200){
					this.$message({type:'success',message:'下架成功'})
					sku.isSale=1
				}
			},
			//sku上架
			async onSale(sku){
				let result = await this.$API.sku.reqOnSale(sku.id)
				if(result.code==200){
					this.$message({type:'success',message:'上架成功'})
					sku.isSale=0
				}
			},
			//编辑按钮
			edit(){
				this.$message('正在开发中')
			},
			//展示sku详情按钮
			async info(sku){
				this.drawer = true
				let result = await this.$API.sku.reqGetSku(sku.id)
				this.skuInfo = result.data
			},
			//删除一个sku
			async deleteSku(sku){
				let result = await this.$API.sku.reqDeleteSku(sku.id)
				if(result.code==200){
					this.getSkuList(this.records.length>1?this.page:this.page-1)
					this.$message({type:'success',message:'删除成功'})
				}
			}
		},
		mounted() {
			this.getSkuList()
		}
	}
</script>

<style>
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }
  .el-carousel__button{
	  width: 10px;
	  height: 10px;
	  background: red;
	  border-radius: 50px;
  }
</style>
<style scoped>
	.el-row .el-col-5 {
		font-size: 18px;
		text-align: right;
	}
	.el-col {
		margin: 10px 10px;
	}
</style>