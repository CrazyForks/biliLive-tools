import type { BiliupPreset } from "@biliLive-tools/types";
import { NCheckbox, NButton } from "naive-ui";

export const useConfirm = () => {
  const dialog = useDialog();
  return {
    warning: ({
      title,
      content,
      positiveText,
      negativeText,
      showCheckbox,
      showAgainKey,
      checkboxText,
      checkboxTip,
    }: {
      title?: string;
      content: string;
      positiveText?: string;
      negativeText?: string;
      showCheckbox?: boolean;
      checkboxText?: string;
      showAgainKey?: string;
      checkboxTip?: string;
    }) =>
      new Promise((reslove) => {
        const data = JSON.parse(localStorage.getItem("notShowAgain") || "{}");
        if (showAgainKey && data[showAgainKey] === true) return reslove(true);

        const hasChecked = ref(false);
        const d = dialog.warning({
          title: title || "警告",
          content: content,
          action: () => {
            let checkbox = h("div");
            if (showCheckbox) {
              checkbox = h(
                NCheckbox,
                {
                  // @ts-ignore
                  checked: hasChecked,
                  "onUpdate:checked": (value: boolean) => {
                    hasChecked.value = value;
                  },
                  title: checkboxTip,
                },
                h("span", checkboxText || "不再提示"),
                // checkboxText || "不再提示",
              );
            }
            const btns = h(
              "div",
              {
                style: {
                  display: "inline-flex",
                  gap: "10px",
                },
              },
              [
                h(
                  NButton,
                  {
                    onClick: () => {
                      d.destroy();
                      if (showCheckbox) {
                        reslove([false, hasChecked.value]);
                      } else {
                        reslove(false);
                      }
                    },
                  },
                  negativeText || "取消",
                ),
                h(
                  NButton,
                  {
                    type: "primary",
                    onClick: () => {
                      if (showCheckbox) {
                        if (showAgainKey) {
                          data[showAgainKey] = hasChecked.value;
                          localStorage.setItem("notShowAgain", JSON.stringify(data));
                        }
                        reslove([true, hasChecked.value]);
                      } else {
                        reslove(true);
                      }

                      d.destroy();
                    },
                  },
                  positiveText || "继续",
                ),
              ],
            );
            return h(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                },
              },
              [checkbox, btns],
            );
          },
          positiveText: positiveText || "继续",
          negativeText: negativeText || "取消",
          onPositiveClick: () => {
            reslove(true);
          },
          onNegativeClick: () => {
            reslove(false);
          },
          onClose: () => {
            reslove(false);
          },
          onMaskClick: () => {
            reslove(false);
          },
        });
      }),
  };
};

export const useBili = () => {
  // @ts-ignore
  const presetOptions: Ref<BiliupPreset> = ref({});
  const handlePresetOptions = (preset: BiliupPreset) => {
    presetOptions.value = preset;
  };

  return { handlePresetOptions, presetOptions };
};
