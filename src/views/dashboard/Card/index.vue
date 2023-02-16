<template>
	<div>
		<el-row :gutter="10">
			<el-col :span="6">
				<el-card>
					<Detail title="总销售额" count="￥4557.43亿">
						<template slot="charts">
							<span>周同比&nbsp;&nbsp;56.67%&nbsp;&nbsp;<svg t="1675926770900" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5024" width="16" height="16"><path d="M960 704L512 256l-448 448z" fill="#1afa29" p-id="5025"></path></svg></span>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<span>日同比&nbsp;&nbsp;19.93%&nbsp;&nbsp;<svg t="1675926930861" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6038" width="16" height="16"><path d="M64 320l448 448 448-448z" fill="#d81e06" p-id="6039"></path></svg></span>
						</template>
						<template slot="footer">
							<span>日销售额&nbsp;￥4.59亿</span>
						</template>
					</Detail>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card>
					<Detail title="访问量" count="495.63亿">
						<template slot="charts">
							<lineChart></lineChart>
						</template>
						<template slot="footer">
							<span>日访问量&nbsp;1.24亿</span>
						</template>
					</Detail>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card>
					<Detail title="支付笔数" count='8.57亿'>
						<template slot="charts">
							<barChart></barChart>
						</template>
						<template slot="footer">
							<span>转化率&nbsp;65%</span>
						</template>
					</Detail>
				</el-card>
			</el-col>
			<el-col :span="6">
				<el-card>
					<Detail title="运营活动效果" count="78%">
						<template slot="charts">
							<progressChart></progressChart>
						</template>
						<template slot="footer">
							<span>周同比&nbsp;&nbsp;12%&nbsp;&nbsp;<svg t="1675926770900" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5024" width="16" height="16"><path d="M960 704L512 256l-448 448z" fill="#1afa29" p-id="5025"></path></svg></span>
							&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
							<span>日同比&nbsp;&nbsp;11%&nbsp;&nbsp;<svg t="1675926930861" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6038" width="16" height="16"><path d="M64 320l448 448 448-448z" fill="#d81e06" p-id="6039"></path></svg></span>
						</template>
					</Detail>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>
	import Detail from './Detail'
	import lineChart from './lineChart'
	import barChart from './barChart'
	import progressChart from './progressChart'
	export default {
		name:'Card',
		components:{
			Detail,
			lineChart,
			barChart,
			progressChart
		}
	}
</script>

<style>
	
</style>