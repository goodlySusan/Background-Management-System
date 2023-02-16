<template>
	<div class="charts" ref="charts" style="width: 100%;height: 100%;">
		
	</div>
</template>

<script>
	import * as echarts from 'echarts'
	export default {
		name:'progressChart',
		mounted(){
			//初始化eCharts实例
			let progressCharts = echarts.init(this.$refs.charts)
			//配置数据
			progressCharts.setOption({
				xAxis:{
					show:false,
					min:0,
					max:100
				},
				yAxis:{
					show:false,
					type:'category'
				},
				series:[
					{
						type:'bar',
						data:[78],
						barWidth:10,
						color:'yellowgreen',
						showBackground:true,
						label:{
							show:true,
							formatter:'|',
							position:'right'
						}
					}
				],
				//布局调试
				grid:{
					top:0,
					right:0,
					bottom:0,
					left:0
				}
			})
		}
	}
</script>

<style>
	.charts{
		width:100%;
		height: 100%;
	}
</style>