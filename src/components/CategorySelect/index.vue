<template>
	<div>
		<!--inline代表行内元素，代表一行可以放置多个表单元素-->
		<el-form :inline="true" :model="cForm" class="demo-form-inline">
		  <el-form-item label="一级分类">
		    <el-select v-model="cForm.category1Id" placeholder="请选择" @change="handler1" :disabled="show">
		      <el-option :label="c1.name" :value="c1.id" v-for="(c1,index) in list1" :key="c1.id"></el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item label="二级分类">
		    <el-select v-model="cForm.category2Id" placeholder="请选择" @change="handler2" :disabled="show">
		      <el-option :label="c2.name" :value="c2.id" v-for="(c2,index) in list2" :key="c2.id"></el-option>
		    </el-select>
		  </el-form-item>
		  <el-form-item label="三级分类">
		    <el-select v-model="cForm.category3Id" placeholder="请选择" @change="handler3" :disabled="show">
		      <el-option :label="c3.name" :value="c3.id" v-for="(c3,index) in list3" :key="c3.id"></el-option>
		    </el-select>
		  </el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		name:'CategorySelect',
		props:['show'],
		data() {
		    return {
				//一级分类的数据
				list1:[],
				//二级分类的数据
				list2:[],
				//三级分类的数据
				list3:[],
				//收集一级二级三级分类的id
				cForm:{
					category1Id:'',
					category2Id:'',
					category3Id:'',
				},
		    }
		},
		methods: {
		  async getCategory1List(){
			  let result = await this.$API.attr.reqCategory1List()
			  if(result.code==200){
				  this.list1 = result.data
			  }
		  },
		  //一级分类的select事件回调(当一级分类的option发生变化的时候获取相应二级分类的数据)
		  async handler1(){
			  this.list2=[]
			  this.list3=[]
			  this.cForm.category2Id=''
			  this.cForm.category3Id=''
			  this.$emit('getCategoryId',{categoryId:this.cForm.category1Id,level:1})
			  let result = await this.$API.attr.reqCategory2List(this.cForm.category1Id)
			  if(result.code==200){
				  this.list2 = result.data
			  }
		  },
		  //二级分类的select事件回调(当二级分类的option发生变化的时候获取相应三级分类的数据)
		  async handler2(){
			  this.list3=[]
			  this.cForm.category3Id=''
			  this.$emit('getCategoryId',{categoryId:this.cForm.category2Id,level:2})
			  let result = await this.$API.attr.reqCategory3List(this.cForm.category2Id)
			  if(result.code==200){
			  	  this.list3 = result.data
			  }
		  },
		  //三级分类的select事件回调(当三级分类的option发生变化的时候触发)
		  handler3(){
			  this.$emit('getCategoryId',{categoryId:this.cForm.category3Id,level:3})
		  }
		},
		mounted() {
			this.getCategory1List()
		}
	}
</script>

<style scoped>
</style>