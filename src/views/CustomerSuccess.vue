<template>
  <div class="customer-success">
    <!-- Dashboard Section -->
    <section class="dashboard">
      <div class="metrics-grid">
        <div
          v-for="(metric, index) in metrics"
          :key="index"
          class="metric-card"
        >
          <div class="metric-icon">
            <Icon :icon="metric.icon" width="24" height="24" />
          </div>
          <div class="metric-content">
            <h3 class="metric-title">{{ metric.title }}</h3>
            <div class="metric-value">{{ metric.value }}</div>
            <div
              class="metric-growth"
              :class="{
                positive: metric.growth > 0,
                negative: metric.growth < 0,
              }"
            >
              {{ metric.growth > 0 ? "+" : "" }}{{ metric.growth }}%
            </div>
            <div class="metric-chart">
              <v-chart
                class="mini-chart"
                :option="metric.chartOption"
                autoresize
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Customer Interaction Section -->
    <section class="interaction-section">
      <div class="customer-list">
        <div class="search-bar">
          <div class="search-input-wrapper">
            <Icon icon="mdi:magnify" class="search-icon" />
            <input
              type="text"
              v-model="searchQuery"
              placeholder="搜索客户..."
            />
          </div>
          <div class="filters">
            <el-button-group>
              <el-button
                size="small"
                :type="activeFilter === 'all' ? 'primary' : 'default'"
                @click="setFilter('all')"
                >全部</el-button
              >
              <el-button
                size="small"
                :type="activeFilter === 'active' ? 'primary' : 'default'"
                @click="setFilter('active')"
                >活跃</el-button
              >
              <el-button
                size="small"
                :type="activeFilter === 'inactive' ? 'primary' : 'default'"
                @click="setFilter('inactive')"
                >非活跃</el-button
              >
            </el-button-group>
          </div>
        </div>
        <div class="customer-items">
          <div
            v-for="customer in filteredCustomers"
            :key="customer.id"
            class="customer-item"
            @click="selectCustomer(customer)"
          >
            <el-avatar
              :src="customer.avatar"
              :alt="customer.name"
              class="customer-avatar"
            />
            <div class="customer-info">
              <h4>{{ customer.name }}</h4>
              <span class="customer-status" :class="customer.status">{{
                customer.statusText
              }}</span>
              <span class="last-interaction">{{
                customer.lastInteraction
              }}</span>
            </div>
            <div class="customer-tags">
              <el-tag
                v-for="tag in customer.tags"
                :key="tag"
                size="small"
                class="tag"
                >{{ tag }}</el-tag
              >
            </div>
          </div>
        </div>
      </div>
      <div class="interaction-details" v-if="selectedCustomer">
        <div class="interaction-header">
          <h3>{{ selectedCustomer.name }} - 互动历史</h3>
        </div>
        <el-timeline class="interaction-timeline">
          <el-timeline-item
            v-for="(activity, index) in selectedCustomer.activities"
            :key="index"
            :timestamp="activity.time"
            :type="activity.type"
          >
            {{ activity.content }}
          </el-timeline-item>
        </el-timeline>
        <div class="quick-reply">
          <el-input
            type="textarea"
            v-model="replyContent"
            rows="3"
            placeholder="输入快速回复..."
          />
          <el-button type="primary" @click="sendReply">发送</el-button>
        </div>
      </div>
    </section>

    <!-- Analytics Section -->
    <section class="analytics-section">
      <div class="chart-grid">
        <div class="chart satisfaction-trend">
          <h3>客户满意度趋势</h3>
          <v-chart
            class="main-chart"
            :option="satisfactionChartOption"
            autoresize
          />
        </div>
        <div class="chart customer-distribution">
          <h3>客户分类分布</h3>
          <v-chart
            class="main-chart"
            :option="distributionChartOption"
            autoresize
          />
        </div>
        <div class="chart interaction-frequency">
          <h3>互动频率统计</h3>
          <v-chart
            class="main-chart"
            :option="frequencyChartOption"
            autoresize
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { Icon } from "@iconify/vue";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, BarChart, PieChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart from "vue-echarts";
import {
  ElButton,
  ElButtonGroup,
  ElTimeline,
  ElTimelineItem,
  ElInput,
  ElTag,
  ElAvatar,
} from "element-plus";

// Register ECharts components
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
]);

// Metrics data with mini charts
const metrics = ref([
  {
    title: "活跃客户",
    value: "2,847",
    growth: 12.5,
    icon: "mdi:account-group",
    chartOption: {
      xAxis: {
        show: false,
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: { show: false },
      series: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: "line",
          smooth: true,
          showSymbol: false,
          lineStyle: { color: "#1890FF" },
          areaStyle: { color: "rgba(24,144,255,0.1)" },
        },
      ],
      grid: { top: 0, right: 0, bottom: 0, left: 0 },
    },
  },
  {
    title: "客户满意度",
    value: "94.2%",
    growth: 3.2,
    icon: "mdi:emoticon-happy",
    chartOption: {
      xAxis: {
        show: false,
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: { show: false },
      series: [
        {
          data: [90, 93, 92, 94, 95, 94, 94],
          type: "line",
          smooth: true,
          showSymbol: false,
          lineStyle: { color: "#52C41A" },
          areaStyle: { color: "rgba(82,196,26,0.1)" },
        },
      ],
      grid: { top: 0, right: 0, bottom: 0, left: 0 },
    },
  },
  {
    title: "响应时间",
    value: "2.3h",
    growth: -15.4,
    icon: "mdi:clock",
    chartOption: {
      xAxis: {
        show: false,
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: { show: false },
      series: [
        {
          data: [3.2, 2.8, 2.5, 2.3, 2.1, 2.3, 2.3],
          type: "line",
          smooth: true,
          showSymbol: false,
          lineStyle: { color: "#FF4D4F" },
          areaStyle: { color: "rgba(255,77,79,0.1)" },
        },
      ],
      grid: { top: 0, right: 0, bottom: 0, left: 0 },
    },
  },
  {
    title: "解决率",
    value: "89.7%",
    growth: 5.8,
    icon: "mdi:check-circle",
    chartOption: {
      xAxis: {
        show: false,
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      },
      yAxis: { show: false },
      series: [
        {
          data: [85, 86, 87, 88, 89, 89, 90],
          type: "line",
          smooth: true,
          showSymbol: false,
          lineStyle: { color: "#1890FF" },
          areaStyle: { color: "rgba(24,144,255,0.1)" },
        },
      ],
      grid: { top: 0, right: 0, bottom: 0, left: 0 },
    },
  },
]);

// Customer data
const activeFilter = ref("all");
const searchQuery = ref("");
const selectedCustomer = ref(null);
const replyContent = ref("");

const customers = ref([
  {
    id: 1,
    name: "科技公司A",
    status: "active",
    statusText: "活跃",
    avatar: "/avatars/company-a.png",
    lastInteraction: "10分钟前",
    tags: ["VIP", "技术支持"],
    activities: [
      {
        time: "2024-02-20 14:30",
        type: "primary",
        content: "提交技术支持请求",
      },
      {
        time: "2024-02-20 14:35",
        type: "success",
        content: "客服回复并解决问题",
      },
      { time: "2024-02-20 15:00", type: "info", content: "客户确认问题已解决" },
    ],
  },
  {
    id: 2,
    name: "制造企业B",
    status: "inactive",
    statusText: "非活跃",
    avatar: "/avatars/company-b.png",
    lastInteraction: "2天前",
    tags: ["标准客户", "生产支持"],
    activities: [
      {
        time: "2024-02-18 09:30",
        type: "warning",
        content: "反馈系统使用问题",
      },
      {
        time: "2024-02-18 10:00",
        type: "success",
        content: "远程协助解决问题",
      },
    ],
  },
]);

const filteredCustomers = computed(() => {
  return customers.value.filter((customer) => {
    const matchesSearch = customer.name
      .toLowerCase()
      .includes(searchQuery.value.toLowerCase());
    const matchesFilter =
      activeFilter.value === "all" || customer.status === activeFilter.value;
    return matchesSearch && matchesFilter;
  });
});

// Chart options
const satisfactionChartOption = ref({
  tooltip: { trigger: "axis" },
  xAxis: { type: "category", data: ["1月", "2月", "3月", "4月", "5月", "6月"] },
  yAxis: { type: "value", min: 80 },
  series: [
    {
      name: "满意度",
      type: "line",
      smooth: true,
      data: [85, 87, 90, 93, 92, 94],
      lineStyle: { color: "#1890FF" },
      areaStyle: { color: "rgba(24,144,255,0.1)" },
    },
  ],
});

const distributionChartOption = ref({
  tooltip: { trigger: "item" },
  legend: { orient: "vertical", left: "left" },
  series: [
    {
      type: "pie",
      radius: ["50%", "70%"],
      data: [
        { value: 45, name: "VIP客户" },
        { value: 25, name: "重点客户" },
        { value: 30, name: "标准客户" },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
});

const frequencyChartOption = ref({
  tooltip: { trigger: "axis" },
  xAxis: {
    type: "category",
    data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
  },
  yAxis: { type: "value" },
  series: [
    {
      type: "bar",
      data: [120, 200, 150, 80, 70, 110, 130],
      itemStyle: { color: "#1890FF" },
    },
  ],
});

// Methods
const setFilter = (filter) => {
  activeFilter.value = filter;
};

const selectCustomer = (customer) => {
  selectedCustomer.value = customer;
};

const sendReply = () => {
  if (!replyContent.value.trim()) return;

  if (selectedCustomer.value) {
    selectedCustomer.value.activities.unshift({
      time: new Date().toLocaleString(),
      type: "primary",
      content: replyContent.value,
    });
    replyContent.value = "";
  }
};
</script>

<style scoped>
.customer-success {
  padding: 24px;
  background: linear-gradient(to bottom right, #f0f2f5, #ffffff);
  min-height: 100vh;
}

/* Dashboard Section */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.metric-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.metric-title {
  color: #8c8c8c;
  font-size: 14px;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: bold;
  color: #262626;
  margin-bottom: 4px;
}

.metric-growth {
  font-size: 12px;
}

.metric-growth.positive {
  color: #52c41a;
}

.metric-growth.negative {
  color: #ff4d4f;
}

/* Customer Interaction Section */
.interaction-section {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 24px;
  margin-bottom: 32px;
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.customer-list {
  border-right: 1px solid #f0f2f5;
}

.search-bar {
  margin-bottom: 16px;
}

.search-input-wrapper {
  position: relative;
  margin-bottom: 12px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #8c8c8c;
}

.search-bar input {
  padding-left: 36px;
}

.filters {
  margin-bottom: 16px;
}

.customer-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f0f2f5;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.customer-item:hover {
  background-color: #f5f5f5;
}

.customer-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
}

.customer-info {
  flex: 1;
}

.customer-info h4 {
  margin: 0;
  font-size: 14px;
  color: #262626;
}

.customer-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  margin-right: 8px;
}

.customer-status.active {
  background-color: #e6f7ff;
  color: #1890ff;
}

.tag {
  font-size: 12px;
  padding: 2px 8px;
  background: #f5f5f5;
  border-radius: 10px;
  margin-right: 4px;
  color: #8c8c8c;
}

/* Analytics Section */
.chart-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.chart {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  min-height: 300px;
}

.main-chart {
  height: 300px;
  width: 100%;
}

.interaction-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f2f5;
}

.interaction-timeline {
  margin: 20px 0;
  height: 400px;
  overflow-y: auto;
}

.quick-reply {
  margin-top: 20px;
}

.quick-reply .el-button {
  margin-top: 12px;
}

.chart h3 {
  margin-bottom: 16px;
  font-size: 16px;
  color: #262626;
}

/* Responsive Design */
@media (max-width: 1440px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .chart-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 1024px) {
  .interaction-section {
    grid-template-columns: 1fr;
  }

  .customer-list {
    border-right: none;
    border-bottom: 1px solid #f0f2f5;
  }

  .chart-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }
}
</style>
