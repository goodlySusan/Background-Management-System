<template>
	<div class="charts" ref="charts" style="width: 100%;height: 100%;">
		
	</div>
</template>

<script>
	import * as echarts from 'echarts'
	export default {
		name:'barChart',
		mounted(){
			//初始化eCharts实例
			let barCharts = echarts.init(this.$refs.charts)
			//配置数据
			barCharts.setOption({
				xAxis:{
					show:false,
					type:'category'
				},
				yAxis:{
					show:false
				},
				series:[
					{
						type:'bar',
						data:[700,1008,680,1000,1400,740,1100,1480,1000,800,900,600],
					}
				],
				//布局调试
				grid:{
					top:0,
					right:0,
					bottom:0,
					left:0
				},
				tooltip:{
					show:true
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