<template>
	<div>
		<el-card style="margin: 20px 0px;">
			<CategorySelect @getCategoryId="getCategoryId" :show="scene!=0"></CategorySelect>
		</el-card>
		<el-card>
			<div v-show="scene==0">
				<el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addSpu">添加Spu
				</el-button>
				<el-table style="width: 100%;" border :data="spuList">
					<el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
					<el-table-column prop="spuName" label="Spu名称" width="width"></el-table-column>
					<el-table-column prop="description" label="Spu描述" width="width"></el-table-column>
					<el-table-column prop="prop" label="操作" width="width">
						<template slot-scope="{row,$index}">
							<hint-button type="success" icon="el-icon-plus" size="mini" title="添加Sku" @click="addSku(row)"></hint-button>
							<hint-button type="warning" size="mini" icon="el-icon-edit" @click="updateSpu(row)" title="修改Spu">
							</hint-button>
							<hint-button type="info" icon="el-icon-info" size="mini" title="查看当前spu全部sku列表" @click="scanAllSku(row)"></hint-button>
							<el-popconfirm title="这是一段内容确定删除吗？" @onConfirm="deleteSpu(row)">
							  <hint-button type="danger" size="mini" icon="el-icon-delete" slot="reference" title="删除Spu"></hint-button>
							</el-popconfirm>
						</template>
					</el-table-column>
				</el-table>
				<el-dialog :title="`${spu.spuName}的sku列表`" :visible.sync="dialogTableVisible" :before-close="close">
				  <el-table :data="skuList" v-loading="loading">
				    <el-table-column property="skuName" label="名称" width="width"></el-table-column>
				    <el-table-column property="price" label="价格" width="width"></el-table-column>
				    <el-table-column property="weight" label="重量" width="width"></el-table-column>
					<el-table-column label="默认图片" width="width">
						<template slot-scope="{row,$index}">
							<img :src="row.skuDefaultImg" alt="" style="width: 100px;height: 100px;">
						</template>
					</el-table-column>
				  </el-table>
				</el-dialog>
				<!--分页器
				  当前第几页，数据总条数,每一页展示条数，连续页码数
				-->
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
			<!--添加/修改spu-->
			<SpuForm v-show="scene==1" @changeScene="changeScene" ref="spu"></SpuForm>
			<!--添加sku-->
			<SkuForm v-show="scene==2" @changeScenes="changeScenes" ref="sku"></SkuForm>
		</el-card>
	</div>
</template>

<script>
	import SpuForm from './SpuForm'
	import SkuForm from './SkuForm'
	//按需引入lodash中的深拷贝
	import cloneDeep from 'lodash/cloneDeep'
	export default {
		name: 'Spu',
		data() {
			return {
				//分页器第几页
				page:1,
				//当前页展示数据条数
				limit:3,
				//数据总条数
				total:0,
				category1Id: '',
				category2Id: '',
				category3Id: '',
				//列表展示的数据
				spuList:[],
				scene:0,//0代表展示spu列表数据，1代表展示添加/修改spu，2代表添加sku
				skuList:[],//当前spu所有sku列表
				dialogTableVisible:false,
				spu:{},
				loading:true
			}
		},
		methods: {
			//自定义事件的回调
			getCategoryId({categoryId,level}) {
				if (level == 1) {
					this.category1Id = categoryId
					this.category2Id = ''
					this.category3Id = ''
				} else if (level == 2) {
					this.category2Id = categoryId
					this.category3Id = ''
				} else {
					this.category3Id = categoryId
					this.getSpuList()
				}
			},
			//获取Spu列表的数据
			async getSpuList(pager) {
				if(pager)
				this.page=pager
				const {page,limit,category3Id} = this
				let result = await this.$API.spu.reqSpuList(page,limit,category3Id)
				if(result.code==200){
					this.total=result.data.total
					this.spuList=result.data.records
				}
			},
			//添加Spu
			addSpu(){
				this.scene=1
				this.$refs.spu.addNewSpu(this.category3Id)
			},
			//修改Spu
			updateSpu(row){
				this.scene=1
				this.$refs.spu.initSpuData(row)
			},
			//删除spu
			async deleteSpu(row){
				let result = await this.$API.spu.reqDeleteSpu(row.id)
				if(result.code==200){
					this.$message({type:'success',message:'删除成功！'})
				}
				this.getSpuList(this.spuList.length>1?this.page:this.page-1)
			},
			//currentPage 改变时会触发
			handleCurrentChange(pager){
				this.page=pager
				this.getSpuList()
			},
			//pageSize 改变时会触发
			handleSizeChange(limit){
				this.limit=limit
				this.getSpuList()
			},
			//查看当前spu全部sku列表
			async scanAllSku(spu){
				this.spu=spu
				this.dialogTableVisible=true
				let result = await this.$API.spu.reqFindBySpuId(spu.id)
				if(result.code==200){
					this.skuList=result.data
					this.loading=false
				}
			},
			//添加Sku
			addSku(row){
				this.scene=2
				const {category1Id,category2Id,category3Id} = this
				this.$refs.sku.addNewSku(row,category1Id,category2Id,category3Id)
			},
			//自定义事件的回调，修改scene
			changeScene({scene,flag}){
				this.scene=scene
				if(flag=='添加'){
					this.page=1
				}
				this.getSpuList()
			},
			//自定义事件的回调，修改scene
			changeScenes(scene){
				this.scene=scene
			},
			//查看sku列表的关闭按钮
			close(done){
				this.loading=true
				this.skuList=[]
				done()
			}
		},
		components:{
			SpuForm,
			SkuForm
		}
	}
</script>

<style scoped>
</style>
