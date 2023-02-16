<template>
	<div>
		<el-card style="margin: 20px 0px;">
			<CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable"></CategorySelect>
		</el-card>
		<el-card>
			<div v-show="isShowTable">
				<el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性
				</el-button>
				<!--表格组件
				   data:表格组件将来需要展示的数组-----数组类型
				   border:给表格添加边框
				   column属性
				   label:显示标题
				   width：对应列的宽度
				   align:标题对齐方式
				-->
				<el-table style="width: 100%;" border :data="attrList">
					<el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
					<el-table-column prop="attrName" label="属性名称" width="150px"></el-table-column>
					<el-table-column prop="prop" label="属性值列表" width="width">
						<template slot-scope="{row,$index}">
							<el-tag style="margin: 0 7px;" type="success" v-for="(attrValue,index) in row.attrValueList"
								:key="attrValue.id">{{attrValue.valueName}}</el-tag>
						</template>
					</el-table-column>
					<el-table-column prop="prop" label="操作" width="150px">
						<template slot-scope="{row,$index}">
							<el-button type="warning" size="mini" icon="el-icon-edit" @click="updateAttr(row)">
							</el-button>
							<el-button type="danger" size="mini" icon="el-icon-delete"></el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!--添加属性或修改属性-->
			<div v-show="!isShowTable">
				<el-form :inline="true" ref="form" label-width="80px" :model="attrInfo">
					<el-form-item label="属性名">
						<el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
					</el-form-item>
				</el-form>
				<el-button type="primary" icon="el-icon-plus" @click="addAttrValue" :disabled="!attrInfo.attrName">添加属性值</el-button>
				<el-button @click="isShowTable=true">取消</el-button>
				<el-table style="width: 100%;margin: 20px 0;" border :data="attrInfo.attrValueList">
					<el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
					<el-table-column prop="attrName" label="属性值名称" width="width">
						<template slot-scope="{row,$index}">
							<el-input placeholder="请输入属性值名称" v-model="row.valueName" size="mini" v-if="row.flag" @blur="toLook(row)" @keyup.native.enter="toLook(row)" :ref="$index"></el-input>
							<span v-else @click="toEdit(row,$index)" style="display: block;">{{row.valueName}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="prop" label="操作" width="width">
                        <template slot-scope="{row,$index}">
							<el-popconfirm :title="`确定删除${row.valueName}吗？`" @onConfirm="deleteAttrValue($index)">
							  <el-button slot="reference" type="danger" size="mini" icon="el-icon-delete"></el-button>
							</el-popconfirm>
                        </template>
					</el-table-column>
				</el-table>
				<el-button type="primary" :disabled="attrInfo.attrValueList.length<1" @click="addOrUpdateAttr">保存</el-button>
				<el-button @click="isShowTable=true">取消</el-button>
			</div>
		</el-card>
	</div>
</template>

<script>
	//按需引入lodash中的深拷贝
	import cloneDeep from 'lodash/cloneDeep'
	export default {
		name: 'Attr',
		data() {
			return {
				category1Id: '',
				category2Id: '',
				category3Id: '',
				//平台属性
				attrList: [],
				//是否显示table
				isShowTable: true,
				//收集/修改新增属性
				attrInfo: {
					attrName: "",//属性名
					attrValueList:[],//属性值
					//attrValueList: [{//属性值
					//	attrId: 0,//相应的属性名的id
					//	valueName: ""
					//}],
					categoryId: 0,//三级分类的ID
					categoryLevel: 3,//服务器需要区分几级id
				},
			}
		},
		methods: {
			//自定义事件的回调
			getCategoryId({
				categoryId,
				level
			}) {
				if (level == 1) {
					this.category1Id = categoryId
					this.category2Id = ''
					this.category3Id = ''
				} else if (level == 2) {
					this.category2Id = categoryId
					this.category3Id = ''
				} else {
					this.category3Id = categoryId
					this.getAttrList()
				}
			},
			//获取平台属性的数据
			async getAttrList() {
				const {
					category1Id,
					category2Id,
					category3Id
				} = this
				const result = await this.$API.attr.reqAttrList(category1Id, category2Id, category3Id)
				if (result.code == 200) {
					console.log(result.data)
					this.attrList = result.data
				}
			},
			//添加属性
			addAttr(){
				this.isShowTable=false
				//清除数据，收集三级分类的id
				this.attrInfo={
					attrName: "",//属性名
					attrValueList:[],//属性值
					categoryId: this.category3Id,//三级分类的ID
					categoryLevel: 3,//服务器需要区分几级id
				}
			},
			//修改属性
			updateAttr(row){
				this.isShowTable=false
				this.attrInfo=cloneDeep(row)
				//在修改某一个属性的时候，将相应的属性值元素添加上flag这个标记
				this.attrInfo.attrValueList.forEach(item=>{
					//因为Vue无法探测普通的新增属性，要用$set(某个对象，'添加的响应式属性'，新的属性的属性值),
					this.$set(item,'flag',false)
				})
			},
			//添加属性值
			addAttrValue(){
				//向属性值的数组里面添加元素
				this.attrInfo.attrValueList.push({
					attrId:this.attrInfo.id,//相应的属性名的id
					valueName: "",
					flag:true
				})
				this.$nextTick(()=>{
					//获取相应的表单元素自动聚焦
					this.$refs[this.attrInfo.attrValueList.length-1].focus()
				})
			},
			//切换为查看模式
			toLook(row){
				if(row.valueName.trim()==''){
					this.$message("请输入一个正常的属性值")
					return
				}
				let isRepat = this.attrInfo.attrValueList.some((item)=>{
					if(row!==item){
						return row.valueName==item.valueName
					}
				})
				if(isRepat){
					this.$message("属性值不能重复")
					return
				}
				row.flag=false
			},
			//切换为编辑模式
			toEdit(row,index){
				row.flag=true
				//获取input节点，实现自动聚焦
				//点击span的时候，重绘重排一个input需要耗费时间，我们不可能一点击span立马获取到input
				//$nextTick,当节点渲染完毕了会执行一次
				this.$nextTick(()=>{
					//获取相应的表单元素自动聚焦
					this.$refs[index].focus()
				})
			},
			//删除属性值
			deleteAttrValue(index){
				this.attrInfo.attrValueList.splice(index,1)
			},
			//点击保存按钮
			async addOrUpdateAttr(){
				//整理参数
			    this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter((item)=>{
					if(item.valueName!=''){
						delete item.flag
						return true
					}
				})
				let result = await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo)
				if(result.code==200){
					this.$message({
					  showClose: true,
					  message: '保存成功',
					  type: 'success'
					})
					this.getAttrList()
					this.isShowTable=true
				}else{
					this.$message('保存失败')
				}
			}
		}
	}
</script>

<style scoped>
</style>
