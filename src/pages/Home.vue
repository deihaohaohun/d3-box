<script setup lang="ts">
import { ElMessage, FormInstance, FormRules } from "element-plus";
import { nextTick, onMounted, reactive, ref } from "vue";
import { addEpisode, addVideo, getVideos } from "../apis/video";
import { Edit, Upload } from "@element-plus/icons-vue";
import { Video } from "../schemas";
import copy from "copy-to-clipboard";
import JSONEditor from "jsoneditor";
import "jsoneditor/dist/jsoneditor.min.css";

let videos = ref<Video[]>([]);

onMounted(async () => {
  getWatchingVideo();
});

async function getWatchingVideo() {
  let resp = await getVideos();
  videos.value = resp;
}

const status = (total: any, current: any) => {
  if (total === current) return "标记为看过";
  if (current === 0) return "开始追番";
  if (total > current) return "追一集";
};

const onBtnClicked = async (total: any, current: any, id: any) => {
  if (total > current) {
    await addEpisode(id);
    let v = videos.value.find(v => v.id === id)!;
    v.current = v.current++;
    ElMessage.success("更新成功!");
  }
};

const keyword = ref("");
const newVideoFlag = ref(false);
const videoFormRef = ref<FormInstance>();
let video = reactive({
  title: "",
  cover: "",
  total: 1,
  type: 0,
});
const videoRules = reactive<FormRules>({
  title: [{ required: true, message: "名称不能为空", trigger: "blur" }],
  cover: [{ required: true, message: "封面不能为空", trigger: "blur" }],
  total: [{ required: true, message: "总数不能为空", trigger: "blur" }],
  type: [{ required: true, message: "类型不能为空", trigger: "blur" }],
});
const createVideo = async () => {
  await videoFormRef.value?.validate();
  await addVideo(video);
  ElMessage.success("创建成功!");
  videoFormRef.value?.resetFields();
  newVideoFlag.value = false;
  getWatchingVideo();
};

const scriptFlag = ref(false);
const scriptRef = ref();
let jsoneditor: JSONEditor;
const copyScript = () => {
  copy(`
    let cover = document.querySelector('#media_module img').src
    let title = document.querySelector('a.media-title').innerText
    let total = document.querySelectorAll('#eplist_module .ep-item ').length
    console.log({
      cover,
      title,
      total
    })
  `);
  ElMessage.success("复制脚本成功!");
};
const importScriptData = async () => {
  scriptFlag.value = true;
  await nextTick();
  let text = await navigator.clipboard.readText();

  jsoneditor = new JSONEditor(scriptRef.value);
  try {
    let json = JSON.parse(text);
    jsoneditor.set(json);
  } catch (e) {
    jsoneditor.set({});
  }
};
const cancelScript = async () => {
  scriptFlag.value = false;
  await nextTick();
  jsoneditor.destroy();
};
async function createVideoFromClipboard() {
  let { title, cover, total } = jsoneditor.get();
  video.title = title;
  video.cover = cover;
  video.total = total;
  scriptFlag.value = false;
}
</script>

<template>
  <div class="container toolbar m-auto mt-5 rounded-sm shadow-md"></div>
  <div class="container videos-box m-auto mt-5 p-3 rounded-sm shadow-md">
    <el-space>
      <el-button-group>
        <el-button class="videos-box-tab-btn" color="#5fb5e0">在看</el-button>
        <el-button
          color="#5fb5e0"
          type="primary"
          :icon="Edit"
          @click="newVideoFlag = true"
        />
      </el-button-group>
      <el-button class="videos-box-tab-btn" color="#5fb5e0">已看</el-button>
      <el-button class="videos-box-tab-btn" color="#5fb5e0">未看</el-button>
    </el-space>

    <el-input class="mt-3" v-model="keyword" placeholder="请输入关键字" />

    <div class="videos grid grid-cols-3 gap-3 mt-3">
      <div
        class="video gap-2 rounded-md overflow-hidden p-2"
        v-for="({ id, title, cover, total, current }, index) in videos"
        :key="index"
      >
        <div class="video-cover rounded-md overflow-hidden border">
          <img :src="cover" />
        </div>
        <div class="video-info flex-1">
          <h4 class="video-info-title mb-1">{{ title }}</h4>
          <div class="video-info-detail mb-1">
            <el-tag type="info">番剧</el-tag>
            <el-tag class="ml-2" type="info" v-if="current !== -1"
              >看到第 {{ current }} 话</el-tag
            >
            <el-tag class="ml-2" type="info">全 {{ total }} 话</el-tag>
          </div>
          <el-button
            class="video-info-action mt-4"
            color="#f27199"
            @click="onBtnClicked(total, current, id)"
          >
            {{ status(total, current) }}
          </el-button>
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

  <el-dialog
    v-model="newVideoFlag"
    title="添加视频"
    width="30%"
    :show-close="false"
  >
    <el-form
      ref="videoFormRef"
      :model="video"
      :rules="videoRules"
      label-width="120px"
    >
      <el-form-item label="名称" prop="title">
        <el-input v-model="video.title" />
      </el-form-item>
      <el-form-item label="封面" prop="cover">
        <el-input v-model="video.cover" />
      </el-form-item>
      <el-form-item label="预览">
        <img :src="video.cover" />
      </el-form-item>
      <el-form-item label="总数" prop="total">
        <el-input-number v-model="video.total" :min="1" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-radio-group v-model="video.type" class="ml-4">
          <el-radio :label="0">番剧</el-radio>
          <el-radio :label="1">电影</el-radio>
          <el-radio :label="2">纪录片</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button-group>
        <el-button type="primary" @click="copyScript">复制脚本</el-button>
        <el-tooltip content="导入脚本执行结果" placement="top">
          <el-button type="primary" :icon="Upload" @click="importScriptData" />
        </el-tooltip>
      </el-button-group>
      <el-button class="ml-3" @click="newVideoFlag = false">取消</el-button>
      <el-button type="primary" @click="createVideo()">确认</el-button>
    </template>
  </el-dialog>

  <el-dialog v-model="scriptFlag" width="30%">
    <div ref="scriptRef"></div>

    <template #footer>
      <el-button class="ml-3" @click="cancelScript">取消</el-button>
      <el-button type="primary" @click="createVideoFromClipboard"
        >确认</el-button
      >
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
.container {
  width: 1200px;
}
.toolbar {
  height: 100px;
  background: #fff;
}

.videos-box {
  background: #fff;
  .videos-box-tab-btn {
    color: #fff;
    font-weight: 600;
  }
  .videos {
    grid-auto-rows: 160px;
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

        .video-info-action {
          color: #fff;
          font-weight: 600;
        }
      }
    }
  }
}
</style>
