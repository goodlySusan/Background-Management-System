<template>
	<el-card class="box-card" style="margin: 10px 0px;">
		<div slot="header" class="clearfix">
			<!--头部左侧内容-->
			<el-tabs class="tab" v-model="activeName">
				<el-tab-pane label="销售额" name="sale"></el-tab-pane>
				<el-tab-pane label="访问量" name="visit"></el-tab-pane>
			</el-tabs>
			<!--头部右侧内容-->
			<div class="right">
				<span @click="setDay">本日</span>
				<span @click="setWeek">本周</span>
				<span @click="setMonth">本月</span>
				<span @click="setYear">本年</span>
				<el-date-picker class="date" v-model="date" type="datetimerange" range-separator="-"
					start-placeholder="开始日期" end-placeholder="结束日期" size="mini">
				</el-date-picker>
			</div>
		</div>
		<div>
			<el-row :gutter="10">
				<el-col :span="19">
					<div class="charts" ref="charts"></div>
				</el-col>
				<el-col :span="5">
					<div class="saleRank">
						<h3>{{title}}排名</h3>
						<ul>
							<li>
								<span class="rindex1">1</span>
								<span>家用电器</span>
								<span class="rvalue">493.72亿</span>
							</li>
							<li>
								<span class="rindex1">2</span>
								<span>手机数码</span>
								<span class="rvalue">464.25亿</span>
							</li>
							<li>
								<span class="rindex1">3</span>
								<span>服装</span>
								<span class="rvalue">428.57亿</span>
							</li>
							<li>
								<span class="rindex2">4</span>
								<span>个护美妆</span>
								<span class="rvalue">410.35亿</span>
							</li>
							<li>
								<span class="rindex2">5</span>
								<span>女鞋/男鞋/箱包</span>
								<span class="rvalue">400.26亿</span>
							</li>
							<li>
								<span class="rindex2">6</span>
								<span>家具建材</span>
								<span class="rvalue">383.42亿</span>
							</li>
							<li>
								<span class="rindex2">7</span>
								<span>电脑办公</span>
								<span class="rvalue">367.79亿</span>
							</li>
						</ul>
					</div>
				</el-col>
			</el-row>
		</div>
	</el-card>
</template>

<script>
	import * as echarts from 'echarts'
	import dayjs from 'dayjs'
	export default {
		name: 'Sale',
		data() {
			return {
				date: [],
				activeName:'sale',
				myCharts:null
			}
		},
		computed:{
			//计算标题
			title(){
				return this.activeName=='sale'?'销售额':'访问量'
			}
		},
		watch:{
			title(){
				this.myCharts.setOption({
					title:{
						text:this.title+'趋势'
					}
				})
			}
		},
		methods:{
			setDay(){
				const day = dayjs().format('YYYY-MM-DD')
				this.date=[day,day]
			},
			setWeek(){
				const start = dayjs().day(1).format('YYYY-MM-DD')
				const end = dayjs().day(7).format('YYYY-MM-DD')
				this.date=[start,end]
			},
			setMonth(){
				const start = dayjs().startOf('month').format('YYYY-MM-DD')
				const end = dayjs().endOf('month').format('YYYY-MM-DD')
				this.date=[start,end]
			},
			setYear(){
				const start = dayjs().startOf('year').format('YYYY-MM-DD')
				const end = dayjs().endOf('year').format('YYYY-MM-DD')
				this.date=[start,end]
			}
		},
		mounted() {
			this.myCharts = echarts.init(this.$refs.charts)
			this.myCharts.setOption({
				title:{
					text:'销售额趋势',
					subtext:'单位：亿'
				},
                tooltip: {
                  trigger: 'axis',
                  axisPointer: {
                    type: 'shadow'
                  }
                },
                grid: {
                  left: '3%',
                  right: '4%',
                  bottom: '3%',
                  containLabel: true
                },
                xAxis: [
                  {
                    type: 'category',
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月','9月','10月','11月','12月'],
                    axisTick: {
                      alignWithLabel: true
                    }
                  }
                ],
                yAxis: [
                  {
                    type: 'value'
                  }
                ],
                series: [
                  {
                    name: 'Direct',
                    type: 'bar',
                    barWidth: '40%',
                    data: [142.30, 224.86, 150.98, 148.33, 256.39, 544.33, 146.22,199.87,324.78,202.35,684.09,487.56]
                  }
                ]
            })
		}
	}
</script>

<style>
	.clearfix {
		display: flex;
		justify-content: space-between;
		position: relative;
	}

	.tab {
		width: 100%;
	}

	.right {
		position: absolute;
		right: 0px;
	}

	.date {
		width: 215px !important;
	}

	.right span {
		margin: 0px 10px;
	}
	.charts{
		width: 100%;
		height: 300px;
	}
	.saleRank{
		height: 300px;
	}
	ul{
		list-style: none;
		width: 100%;
		height: 300px;
		padding: 0px;
	}
	ul li{
		height: 12%;
	}
	
	.rindex1{
		float: left;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: black;
		color: white;
		text-align: center;
		margin-right: 10px;
	}
	.rindex2{
		float: left;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #eee;
		color: black;
		text-align: center;
		margin-right: 10px;
	}
	.rvalue{
		float: right;
	}
</style>
