<script setup lang="ts"></script>

<template>
  <div class="container toolbar m-auto mt-5 rounded-xl shadow-md"></div>

  <div
    class="container videos grid grid-cols-3 gap-3 m-auto mt-5 rounded-xl shadow-md p-5"
  >
    <div class="video gap-2">
      <div class="video-cover rounded-md overflow-hidden">
        <img
          src="https://i0.hdslb.com/bfs/bangumi/0e2656a8ba9f754b4ac8de132a13e6c0aa188468.jpg@220w_288h_!web-space-index-bangumi.webp"
        />
      </div>
      <div class="video-info flex-1">
        <h4 class="video-info-title mb-1">圣诞之吻SS+ plus</h4>
        <div class="video-info-detail mb-1">
          <el-tag type="info">番剧</el-tag>
          <el-tag class="ml-2" type="info">看到第 13 话</el-tag>
          <el-tag class="ml-2" type="info">全 13 话</el-tag>
        </div>
        <div class="video-info-btns">
          <el-button size="small" type="info">尚未观看</el-button>
          <el-button size="small" type="primary">追一集</el-button>
          <el-button size="small" type="danger">标记为看过</el-button>
        </div>
      </div>
    </div>
    <div class="video"></div>
    <div class="video"></div>
    <div class="video"></div>
  </div>

  <div class="container m-auto mt-5">
    <el-pagination
      class="justify-end"
      background
      layout="prev, pager, next"
      :total="50"
    />
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 1200px;
}
.toolbar {
  height: 100px;
  background: #fff;
}

.videos {
  grid-auto-rows: 140px;
  background: #fff;
  .video {
    display: flex;
    .video-cover {
      width: 110px;
      height: 140px;

      img {
        width: 100%;
        height: 100%;
      }
    }
    .video-info {
      .video-info-title {
        color: #333;
        line-height: 24px;
        font-size: 18px;
      }
    }
  }
}
</style>
