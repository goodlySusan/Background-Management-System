<template>
	<div>
		<el-button type="primary" icon="el-icon-plus" style="marign:10px 0px" @click="showDialog">添加</el-button>
		<!--对话框
		    Form 组件提供了表单验证的功能，只需要通过 rules 属性传入约定的验证规则，并将 Form-Item 的 prop 属性设置为需校验的字段名即可。
		-->
		<el-dialog :title="title" :visible.sync="dialogFormVisible">
			<!--:model属性：将表单的数据收集到一个对象中，将来表单验证需要这个属性-->
		  <el-form style="width: 80%;" :model="tmForm" :rules="rules" ref="ruleForm">
			  <el-form-item label="品牌名称" :label-width="formLabelWidth" prop="tmName">
			    <el-input v-model="tmForm.tmName" autocomplete="off"></el-input>
			  </el-form-item>
			  <el-form-item label="品牌LOGO" :label-width="formLabelWidth" prop="logoUrl"> 
			    <el-upload
			      class="avatar-uploader"
			      action="dev-api/admin/product/fileUpload"
			      :show-file-list="false"
			      :on-success="handleAvatarSuccess"
			      :before-upload="beforeAvatarUpload">
			      <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
			      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
			  	<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
			    </el-upload>
			  </el-form-item>
		  </el-form>
		  <div slot="footer" class="dialog-footer">
		    <el-button @click="dialogFormVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addOrUpdateTradeMark">确 定</el-button>
		  </div>
		</el-dialog>
		<!--表格组件
		   data:表格组件将来需要展示的数组-----数组类型
		   border:给表格添加边框
		   column属性
		   label:显示标题
		   width：对应列的宽度
		   align:标题对齐方式
		-->
		<el-table style="width: 100%;margin-top: 20px;" border :data="list">
			<el-table-column type="index" label="序号" width="80px" align="center" ></el-table-column>
			<el-table-column prop="tmName" label="品牌名称" width="width"></el-table-column>
			<el-table-column prop="prop" label="品牌LOGO" width="width">
				<template slot-scope="{row,$index}">
					<img :src="row.logoUrl" alt="" style="width: 100px; height: 50px;">
				</template>
			</el-table-column>
			<el-table-column prop="prop" label="操作" width="width">
				<template slot-scope="{row,$index}">
					<el-button type="warning" size="mini" icon="el-icon-edit" @click="updateTradeMark(row)">修改</el-button>
					<el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteTradeMark(row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
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
</template>

<script>
	export default {
		name:'trademark',
		//组件挂载完毕，发请求
		data(){
			return {
				//分页器第几页
				page:1,
				//当前页展示数据条数
				limit:3,
				//数据总条数
				total:0,
				//列表展示的数据
				list:[],
				//对话框默认显示与隐藏属性
				dialogFormVisible: false,
				//添加/修改品牌对话框里输入框宽度
                formLabelWidth: '120px',
				//添加/修改品牌对话框标题
				title:'',
				//品牌信息
				tmForm:{
					tmName:'',
					logoUrl:'',
				},
				//表单验证规则
				rules: {
                    tmName: [
                      { required: true, message: '请输入品牌名称', trigger: 'blur' },
                      { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'change' }
                    ],
                    logoUrl: [
                      { required: true, message: '请选择品牌LOGO', trigger: 'change' }
                    ]
                }
			}
		},
		mounted() {
			//获取列表数据方法
			this.getPageList()
		},
		methods:{
			//获取品牌列表的数据
			async getPageList(){
				//解构出参数
				const {page,limit} = this
				let result = await this.$API.tradeMark.reqTradeMarkList(page,limit)
				if(result.code==200){
					this.total=result.data.total
					this.list = result.data.records
				}
			},
			//currentPage 改变时会触发
			handleCurrentChange(pager){
				this.page=pager
				this.getPageList()
			},
			//pageSize 改变时会触发
			handleSizeChange(limit){
				this.limit=limit
				this.getPageList()
			},
			//显示添加品牌的对话框
			showDialog(){
				this.title='添加品牌'
				this.dialogFormVisible=true
				//清除数据
				this.tmForm={tmName:'',logoUrl:''}
			},
			//显示修改品牌的对话框
			updateTradeMark(row){
				this.tmForm={...row}
				this.title='修改品牌'
				this.dialogFormVisible=true
			},
			//检测到图片上传成功时执行一次
			handleAvatarSuccess(res, file) {
				//res:上传成功之后返回给前端数据
				//file:上传成功之后返回给前端数据
				//收集品牌图片数据，将来要带给服务器
              this.tmForm.logoUrl = res.data
            },
			//上传图片之前执行一次
            beforeAvatarUpload(file) {
              const isJPG = file.type === 'image/jpeg';
              const isLt2M = file.size / 1024 / 1024 < 2;         

              if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!');
              }
              if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
              }
              return isJPG && isLt2M;
            },
			//添加或修改品牌
			addOrUpdateTradeMark(){
				this.dialogFormVisible = false
				//当全部验证字段通过，再去书写业务逻辑
				this.$refs.ruleForm.validate(async(success)=>{
					if(success){
						let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.tmForm)
						if(result.code==200){
							this.$message({
							  showClose: true,
							  message: this.tmForm.id?'修改品牌成功':'添加品牌成功',
							  type: 'success'
							})
							this.getPageList()
						}
					}else{
						console.log("error submit!")
						return false
					}
				})
			},
			//删除品牌
			deleteTradeMark(row){
				this.$confirm(`你确定删除${row.tmName}?`, '', {
				  confirmButtonText: '确定',
				  cancelButtonText: '取消',
				  type: 'warning'
				}).then(async() => {
				  this.page = this.list.length>1?this.page:this.page-1
				  let result = await this.$API.tradeMark.reqDeleteTradeMark(row.id)
				  console.log(result)
				  if(result.code==200){
				  	this.$message({
				  	  showClose: true,
				  	  message: '删除品牌成功',
				  	  type: 'success'
				  	})
					this.getPageList()
				  }
				}).catch(() => {
				  this.$message({
				    type: 'info',
				    message: '已取消删除'
				  });          
				});
			}
		}
	}
</script>

<style>
	.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .afterStar1{
	  position: relative;
  }
  .star1{
	  color: red;
	  position: absolute;
	  left: 45px;
	  top: 11px;
  }
  .afterStar2{
  	  position: relative;
  }
  .star2{
  	  color: red;
  	  position: absolute;
  	  left: 32px;
  	  top: 11px;
  }
</style>