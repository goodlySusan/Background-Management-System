<template>
	<div class="charts" ref="charts" style="width: 100%;height: 100%;">
		
	</div>
</template>

<script>
	import * as echarts from 'echarts'
	export default {
		name:'lineChart',
		mounted(){
			//初始化eCharts实例
			let lineCharts = echarts.init(this.$refs.charts)
			//配置数据
			lineCharts.setOption({
				xAxis:{
					show:false,
					type:'category'
				},
				yAxis:{
					show:false
				},
				series:[
					{
						type:'line',
						data:[800,1008,680,1100,1300,740,1400,1480],
						//拐点样式的设置
						itemStyle:{
							opacity:0
						},
						lineStyle:{
							color:"#b8a6ff"
						},
						areaStyle:{
							color:{
							    type: 'linear',
							    x: 0,
							    y: 0,
							    x2: 0,
							    y2: 1,
							    colorStops: [{
							        offset: 0, color: '#b8a6ff' // 0% 处的颜色
							    }, {
							        offset: 1, color: 'white' // 100% 处的颜色
							    }],
							    global: false // 缺省为 false
							},
						}
					},
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