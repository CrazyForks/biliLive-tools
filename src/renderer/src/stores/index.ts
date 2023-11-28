import { defineStore } from "pinia";
import { DanmuPreset } from "../../../types";

export const useUserInfoStore = defineStore("userInfo", () => {
  const userInfo = ref({
    profile: {
      face: "",
      name: "",
    },
  });

  async function getUserInfo() {
    const hasLogin = await window.api.checkBiliCookie();
    if (hasLogin) {
      const res = await window.biliApi.getMyInfo();
      userInfo.value = res.data as any;
    } else {
      userInfo.value = {
        profile: {
          face: "",
          name: "",
        },
      };
    }
  }

  getUserInfo();

  return { userInfo, getUserInfo };
});

export const useDanmuPreset = defineStore("danmuPreset", () => {
  const danmuPresetId = ref("default");
  const danmuPresets = ref<DanmuPreset[]>([]);
  // @ts-ignore
  const danmuPreset: Ref<DanmuPreset> = ref({
    config: {},
  });

  async function getDanmuPresets() {
    danmuPresets.value = await window.api.danmu.getPresets();
  }
  async function getDanmuPreset() {
    danmuPreset.value = await window.api.danmu.getPreset(danmuPresetId.value);
  }

  const danmuPresetsOptions = computed(() => {
    return danmuPresets.value.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  });

  watch(
    danmuPresetId,
    () => {
      getDanmuPreset();
    },
    { immediate: true },
  );

  getDanmuPresets();

  return {
    danmuPresets,
    getDanmuPresets,
    danmuPresetsOptions,
    danmuPresetId,
    danmuPreset,
    getDanmuPreset,
  };
});

export const useUploadPreset = defineStore("uploadPreset", () => {
  const upladPresetId = ref("default");
  const danmuPresets = ref<DanmuPreset[]>([]);
  // @ts-ignore
  const danmuPreset: Ref<DanmuPreset> = ref({
    config: {},
  });

  async function getDanmuPresets() {
    danmuPresets.value = await window.api.danmu.getPresets();
  }
  async function getDanmuPreset() {
    danmuPreset.value = await window.api.danmu.getPreset(upladPresetId.value);
  }

  const danmuPresetsOptions = computed(() => {
    return danmuPresets.value.map((item) => {
      return {
        label: item.name,
        value: item.id,
      };
    });
  });

  watch(
    upladPresetId,
    () => {
      getDanmuPreset();
    },
    { immediate: true },
  );

  getDanmuPresets();

  return {
    danmuPresets,
    getDanmuPresets,
    danmuPresetsOptions,
    upladPresetId,
    danmuPreset,
    getDanmuPreset,
  };
});
