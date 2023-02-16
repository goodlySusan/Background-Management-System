<template>
	<div>
		<el-form ref="form" label-width="80px" :model="spu">
			<el-form-item label="SPU名称">
				<el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
			</el-form-item>
			<el-form-item label="品牌">
			    <el-select placeholder="请选择品牌" v-model="spu.tmId">
			      <el-option :label="tm.tmName" :value="tm.id" v-for="(tm,index) in tradeMarkList" :key="tm.id"></el-option>
			    </el-select>
			</el-form-item>
			<el-form-item label="SPU描述">
			    <el-input type="textarea" placeholder="SPU描述" rows="4" v-model="spu.description"></el-input>
			</el-form-item>
			<el-form-item label="SPU图片">
				<el-upload
				  action="dev-api/admin/product/fileUpload"
				  list-type="picture-card"
				  :on-preview="handlePictureCardPreview"
				  :on-remove="handleRemove"
				  :file-list="spuImageList"
				  :on-success="handlerSuccess">
				  <i class="el-icon-plus"></i>
				</el-upload>
				<el-dialog :visible.sync="dialogVisible">
				  <img width="100%" :src="dialogImageUrl" alt="">
				</el-dialog>
			</el-form-item>
			<el-form-item label="销售属性">
				<el-select :placeholder="`还有${unSelectAttr.length}未选择`" v-model="attrIdAndAttrName">
				  <el-option :label="item.name" :value="`${item.id}:${item.name}`" v-for="(item,index) in unSelectAttr" :key="item.id"></el-option>
				</el-select>
				<el-button type="primary" icon="el-icon-plus" :disabled="!attrIdAndAttrName" @click="addSaleAttr">添加销售属性</el-button>
				<el-table style="width: 100%;" border :data="spu.spuSaleAttrList">
					<el-table-column type="index" label="序号" width="80px" align="center"></el-table-column>
					<el-table-column label="属性名" width="width" prop="saleAttrName"></el-table-column>
					<el-table-column label="属性值名称列表" width="780px">
						<template slot-scope="{row,$index}">
							<el-tag
							  :key="tag.id"
							  v-for="(tag,index) in row.spuSaleAttrValueList"
							  closable
							  :disable-transitions="false"
							  @close="row.spuSaleAttrValueList.splice(index,1)">
							  {{tag.saleAttrValueName}}
							</el-tag>
							<el-input
							  class="input-new-tag"
							  v-if="row.inputVisible"
							  v-model="row.inputValue"
							  ref="saveTagInput"
							  size="small"
							  @keyup.enter.native="handleInputConfirm"
							  @blur="handleInputConfirm(row)"
							>
							</el-input>
							<el-button v-else class="button-new-tag" size="small" @click="showInput(row)">添加</el-button>
						</template>
					</el-table-column>
					<el-table-column prop="prop" label="操作" width="width">
						<template slot-scope="{row,$index}">
							<el-button type="danger" icon="el-icon-delete" size="mini" @click="spu.spuSaleAttrList.splice($index,1)"></el-button>
						</template>
					</el-table-column>
				</el-table>
			</el-form-item>
			<el-form-item>
			    <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
			    <el-button @click="cancelButton">取消</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	export default {
		name:'SpuForm',
		data() {
		  return {
		    dialogImageUrl: '',
		    dialogVisible: false,
			//spu属性初始化的时候是一个空对象，在修改spu的时候，会向服务器发请求，
			//返回spu信息，在修改的时候可以利用服务器返回的这个对象收集最新的数据交给服务器
			//而添加spu的时候没有向服务器发请求，
			spu:{
				//三级分类的id
                category3Id: 0,
				//描述
                description: "",
				//spu名称
				spuName: "",
				//品牌的id
				tmId: "",
				//收集spu图片的信息
                spuImageList: [
                  //{
                    //id: 0,
                    //imgName: "",
                    //imgUrl: string,
                    //spuId: 0
                  //}
                ],
				//平台属性与属性值收集
                spuSaleAttrList: [
                  //{
                    //baseSaleAttrId: 0,
                    //id: 0,
                    //saleAttrName: "",
                    //spuId: 0,
                    //spuSaleAttrValueList: [
                    //  {
                    //    baseSaleAttrId: 0,
                    //    id: 0,
                    //    isChecked: "",
                    //    saleAttrName: "",
                    //    saleAttrValueName: "",
                    //    spuId: 0
                    //  }
                    //]
                  //}
                ],
            },//存储spu信息属性
			tradeMarkList:[],//存储品牌信息
			spuImageList:[],//存储spu图片数据
			baseSaleAttrList:[],//存储平台全部销售属性
			attrIdAndAttrName:'',//收集未选择的平台销售属性id和name
			inputValue: ''
		  };
		},
		computed:{
			unSelectAttr(){
				let result = this.baseSaleAttrList.filter(item=>{
					return this.spu.spuSaleAttrList.every(item1=>{
						return item.name!=item1.saleAttrName
					})
				})
				return result
			}
		},
		methods: {
			//照片墙删除某一个图片的时候会触发
			//file:删除的图片，fileList:剩余的照片
			//对于已有的图片，有name,url字段
			//对于服务器而言，不需要name,url字段，将来对于有的图片的数据在提交给服务器的时候，需要处理
		  handleRemove(file, fileList) {
		    this.spuImageList=fileList
		  },
		  //照片墙图片预览
		  handlePictureCardPreview(file) {
		    this.dialogImageUrl = file.url;
		    this.dialogVisible = true;
		  },
		  //图片上传成功时触发
		  handlerSuccess(response,file,fileList){
		  	this.spuImageList=fileList
		  },
		  //初始化SpuForm数据
		  async initSpuData(spu){
			  //获取spu信息的数据
			  let spuResult = await this.$API.spu.reqSpu(spu.id)
			  if(spuResult.code==200){
				  this.spu=spuResult.data
			  }
			  //获取品牌的信息
			  let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
			  if(tradeMarkResult.code==200){
				  this.tradeMarkList=tradeMarkResult.data
			  }
			  //获取spu图标reqSpuImageList
			  let spuImageResult = await this.$API.spu.reqSpuImageList(spu.id)
			  if(spuImageResult.code==200){
				  let listArr = spuImageResult.data
				  listArr.forEach(item=>{
					  item.name=item.imgName
					  item.url=item.imgUrl
				  })
				  this.spuImageList=listArr
			  }
			  //获取平台全部销售属性
			  let baseSaleAttrListResult = await this.$API.spu.reqBaseSaleAttrList()
			  if(baseSaleAttrListResult.code==200){
				  this.baseSaleAttrList=baseSaleAttrListResult.data
			  }
		  },
		  //添加spu
		  async addNewSpu(category3Id){
			  this.spu.category3Id=category3Id
			  //获取品牌的信息
			  let tradeMarkResult = await this.$API.spu.reqTradeMarkList()
			  if(tradeMarkResult.code==200){
			  	 this.tradeMarkList=tradeMarkResult.data
			  }
			  //获取平台全部销售属性
			  let baseSaleAttrListResult = await this.$API.spu.reqBaseSaleAttrList()
			  if(baseSaleAttrListResult.code==200){
			     this.baseSaleAttrList=baseSaleAttrListResult.data
			  }
		  },
	      //展示输入框
		  showInput(row) {
			this.$set(row,'inputVisible',true)
			this.$set(row,'inputValue','')
		  },
	      //确认输入
		  handleInputConfirm(row) {
			  row.inputVisible=false
			  const {baseSaleAttrId,inputValue} = row
			  if(inputValue.trim()==''){
				  this.$message('属性值不能为空！')
				  return
			  }
			  let result = row.spuSaleAttrValueList.every(item=>item.saleAttrValueName!=inputValue)
			  if(!result){
				  this.$message('属性值不能相同！')
				  return
			  }
			  let newSaleAttrValue = {baseSaleAttrId,saleAttrValueName:inputValue}
			  row.spuSaleAttrValueList.push(newSaleAttrValue)
		  },
		  //添加平台销售属性
		  addSaleAttr(){
			  const [baseSaleAttrId,saleAttrName] = this.attrIdAndAttrName.split(':')
			  let newSaleAttr = {baseSaleAttrId,saleAttrName,spuSaleAttrValueList:[]}
			  this.spu.spuSaleAttrList.push(newSaleAttr)
			  this.attrIdAndAttrName=''
		  },
		  //点击保存按钮
		  async addOrUpdateSpu(){
			  //整理参数
			  this.spu.spuImageList=this.spuImageList.map((item)=>{
				  return {
					  imgName:item.name,
					  imgUrl:(item.response&&item.response.data)||item.url
				  }
			  })
			  let result = await this.$API.spu.reqAddOrUpdateSpu(this.spu)
			  if(result.code==200){
				  this.$message({type:'success',message:'保存成功！'})
				  this.$emit('changeScene',{scene:0,flag:this.spu.id?'修改':'添加'})
			  }
			  //清理数据
			  //Object.assign:合并对象
			  //组件实例this._data,可以操作data当中响应式数据
			  //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
			  Object.assign(this._data,this.$options.data())
		  },
		  //点击取消按钮
		  cancelButton(){
			  this.$emit('changeScene',{scene:0,flag:'取消'})
			  Object.assign(this._data,this.$options.data())
		  }
		}
	}
</script>

<style>
	.el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>