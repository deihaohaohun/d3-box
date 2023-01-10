<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getVideos } from "../apis/video";

let videos = ref<any[]>([]);

onMounted(async () => {
  let resp = await getVideos();
  videos.value = resp.documents;
});
</script>

<template>
  <div class="container toolbar m-auto mt-5 rounded-xl shadow-md"></div>

  <div
    class="container videos grid grid-cols-3 gap-3 m-auto mt-5 rounded-xl shadow-md p-5"
  >
    <div
      class="video gap-2 rounded-md overflow-hidden p-2"
      v-for="({ title, cover }, index) in videos"
      :key="index"
    >
      <div class="video-cover rounded-md overflow-hidden border">
        <img :src="cover" />
      </div>
      <div class="video-info flex-1">
        <h4 class="video-info-title mb-1">{{ title }}</h4>
        <div class="video-info-detail mb-1">
          <el-tag type="info">番剧</el-tag>
          <el-tag class="ml-2" type="info">看到第 13 话</el-tag>
          <el-tag class="ml-2" type="info">全 13 话</el-tag>
        </div>
        <div class="video-info-btns">
          <el-button color="deeppink">开始追番</el-button>
          <el-button v-show="false" type="primary">追一集</el-button>
          <el-button v-show="false" type="danger">标记为看过</el-button>
        </div>
      </div>
    </div>
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
  grid-auto-rows: 160px;
  background: #fff;
  .video {
    display: flex;
    background: #f9f9f9;
    .video-cover {
      width: 110px;

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
