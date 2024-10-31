import { expect, describe, it } from "vitest";
import { genFfmpegParams, getHardwareAcceleration } from "../src/utils/index";
import { genMergeAssMp4Command, selectScaleMethod, ComplexFilter } from "../src/task/video";
import type { FfmpegOptions, VideoCodec } from "@biliLive-tools/types";

describe.concurrent("通用ffmpeg参数生成", () => {
  it("视频编码器：h264_nvenc", () => {
    const input: FfmpegOptions = {
      encoder: "h264_nvenc",
      bitrateControl: "CQ",
      crf: 34,
      preset: "p4",
      audioCodec: "copy",
      bitrate: 8000,
      decode: true,
      extraOptions: "",
      bit10: false,
      resetResolution: false,
      resolutionWidth: 3840,
      resolutionHeight: 2160,
    };
    const output1 = genFfmpegParams(input);
    expect(output1).toEqual(["-c:v h264_nvenc", "-rc vbr", "-cq 34", "-preset p4", "-c:a copy"]);
  });
  it("有无preset参数", () => {
    const videoEncoders: VideoCodec[] = [
      "libx264",
      "h264_qsv",
      "h264_nvenc",
      "h264_amf",
      "libx265",
      "hevc_qsv",
      "hevc_nvenc",
      "hevc_amf",
      "libsvtav1",
      "av1_qsv",
      "av1_amf",
    ];
    for (const encoder of videoEncoders) {
      const input: FfmpegOptions = {
        encoder: encoder,
        bitrateControl: "CQ",
        crf: 34,
        preset: "p4",
        audioCodec: "copy",
        bitrate: 8000,
        decode: true,
        extraOptions: "",
        bit10: false,
        resetResolution: false,
        resolutionWidth: 3840,
        resolutionHeight: 2160,
      };
      const output = genFfmpegParams(input);
      const result = [`-c:v ${encoder}`, "-rc vbr", "-cq 34"];
      if (["cpu", "qsv", "nvenc"].includes(getHardwareAcceleration(encoder))) {
        result.push("-preset p4");
      }
      result.push("-c:a copy");
      expect(output).toEqual(result);
    }
  });
  it("额外参数", () => {
    const input: FfmpegOptions = {
      encoder: "h264_nvenc",
      bitrateControl: "CQ",
      crf: 34,
      preset: "p4",
      audioCodec: "copy",
      bitrate: 8000,
      decode: true,
      extraOptions: "-extra 00:00:00",
      bit10: false,
      resetResolution: false,
      resolutionWidth: 3840,
      resolutionHeight: 2160,
    };
    const output1 = genFfmpegParams(input);
    expect(output1).toEqual([
      "-c:v h264_nvenc",
      "-rc vbr",
      "-cq 34",
      "-preset p4",
      "-c:a copy",
      "-extra",
      "00:00:00",
    ]);
  });
  it("视频和音频编码器都是copy", () => {
    const input: FfmpegOptions = {
      encoder: "copy",
      bitrateControl: "CRF",
      crf: 28,
      preset: "p4",
      audioCodec: "copy",
      bitrate: 8000,
      decode: false,
      extraOptions: "",
      bit10: false,
      resetResolution: false,
      resolutionWidth: 3840,
      resolutionHeight: 2160,
    };
    const output1 = genFfmpegParams(input);
    expect(output1).toEqual(["-c:v copy", "-c:a copy"]);
  });
  it("音频编码器是flac", () => {
    const input: FfmpegOptions = {
      encoder: "copy",
      bitrateControl: "CRF",
      crf: 28,
      preset: "p4",
      audioCodec: "flac",
      bitrate: 8000,
      decode: false,
      extraOptions: "",
      bit10: false,
      resetResolution: false,
      resolutionWidth: 3840,
      resolutionHeight: 2160,
    };
    const output1 = genFfmpegParams(input);
    expect(output1).toEqual(["-c:v copy", "-c:a flac"]);
  });
  it("视频编码器是libsvtav1且使用10bit", () => {
    const input: FfmpegOptions = {
      encoder: "libsvtav1",
      bitrateControl: "CRF",
      crf: 28,
      preset: "p4",
      audioCodec: "flac",
      bitrate: 8000,
      decode: false,
      extraOptions: "",
      bit10: true,
      resetResolution: false,
      resolutionWidth: 3840,
      resolutionHeight: 2160,
    };
    const output1 = genFfmpegParams(input);
    expect(output1).toEqual([
      "-c:v libsvtav1",
      "-crf 28",
      "-preset p4",
      "-pix_fmt yuv420p10le",
      "-c:a flac",
    ]);
  });
  it("视频编码器是libsvtav1且是CRF模式", () => {
    const input: FfmpegOptions = {
      encoder: "libsvtav1",
      bitrateControl: "CRF",
      crf: 28,
      preset: "p4",
      audioCodec: "flac",
      bitrate: 8000,
      decode: false,
      extraOptions: "",
      bit10: true,
      resetResolution: false,
      resolutionWidth: 3840,
      resolutionHeight: 2160,
    };
    const output1 = genFfmpegParams(input);
    expect(output1).toEqual([
      "-c:v libsvtav1",
      "-crf 28",
      "-preset p4",
      "-pix_fmt yuv420p10le",
      "-c:a flac",
    ]);
  });
  it("视频编码器是libsvtav1且是VBR模式", () => {
    const input: FfmpegOptions = {
      encoder: "libsvtav1",
      bitrateControl: "VBR",
      crf: 28,
      preset: "p4",
      audioCodec: "flac",
      bitrate: 8000,
      decode: false,
      extraOptions: "",
      bit10: true,
      resetResolution: false,
      resolutionWidth: 3840,
      resolutionHeight: 2160,
    };
    const output1 = genFfmpegParams(input);
    expect(output1).toEqual([
      "-c:v libsvtav1",
      "-b:v 8000k",
      "-preset p4",
      "-pix_fmt yuv420p10le",
      "-c:a flac",
    ]);
  });
  it("视频编码器是h264_nvenc且是CQ模式", () => {
    const input: FfmpegOptions = {
      encoder: "h264_nvenc",
      bitrateControl: "CQ",
      crf: 28,
      preset: "p4",
      audioCodec: "flac",
      bitrate: 8000,
      decode: false,
      extraOptions: "",
      bit10: true,
      resetResolution: false,
      resolutionWidth: 3840,
      resolutionHeight: 2160,
    };
    const output1 = genFfmpegParams(input);
    expect(output1).toEqual(["-c:v h264_nvenc", "-rc vbr", "-cq 28", "-preset p4", "-c:a flac"]);
  });
  it("视频编码器是h264_qsv且是ICQ模式", () => {
    const input: FfmpegOptions = {
      encoder: "h264_qsv",
      bitrateControl: "ICQ",
      crf: 28,
      preset: "p4",
      audioCodec: "flac",
      bitrate: 8000,
      decode: false,
      extraOptions: "",
      bit10: true,
      resetResolution: false,
      resolutionWidth: 3840,
      resolutionHeight: 2160,
    };
    const output1 = genFfmpegParams(input);
    expect(output1).toEqual(["-c:v h264_qsv", "-global_quality 28", "-preset p4", "-c:a flac"]);
  });
  it("设置分辨率", () => {
    const input: FfmpegOptions = {
      encoder: "h264_qsv",
      bitrateControl: "ICQ",
      crf: 28,
      preset: "p4",
      audioCodec: "flac",
      bitrate: 8000,
      decode: false,
      extraOptions: "",
      bit10: true,
      resetResolution: true,
      resolutionWidth: 3840,
      resolutionHeight: 2160,
    };
    const output1 = genFfmpegParams(input);
    expect(output1).toEqual(["-c:v h264_qsv", "-global_quality 28", "-preset p4", "-c:a flac"]);
  });
});

describe.concurrent("genMergeAssMp4Command", () => {
  it("压制参数：视频，高能进度条，弹幕", async () => {
    const files = {
      videoFilePath: "/path/to/video.mp4",
      assFilePath: "/path/to/subtitle.ass",
      outputPath: "/path/to/output.mp4",
      hotProgressFilePath: "/path/to/hotprogress.txt",
    };

    const ffmpegOptions: FfmpegOptions = {
      encoder: "libx264",
      audioCodec: "copy",
    };

    const command = await genMergeAssMp4Command(files, ffmpegOptions);
    const args = command._getArguments();
    expect(args).toEqual([
      "-i",
      "/path/to/video.mp4",
      "-i",
      "/path/to/hotprogress.txt",
      "-y",
      "-filter_complex",
      "[0:v]subtitles=/path/to/subtitle.ass[0:video];[1]colorkey=black:0.1:0.1[1:video];[0:video][1:video]overlay=W-w-0:H-h-0[2:video]",
      "-map",
      "[2:video]",
      "-map",
      "0:a",
      "-c:v",
      "libx264",
      "-c:a",
      "copy",
      "/path/to/output.mp4",
    ]);
  });
  it("压制参数：视频，弹幕，无高能弹幕", async () => {
    const files = {
      videoFilePath: "/path/to/video.mp4",
      assFilePath: "/path/to/subtitle.ass",
      outputPath: "/path/to/output.mp4",
      hotProgressFilePath: undefined,
    };

    const ffmpegOptions: FfmpegOptions = {
      encoder: "libx264",
      audioCodec: "copy",
    };

    const command = await genMergeAssMp4Command(files, ffmpegOptions);
    const args = command._getArguments();
    expect(args).toEqual([
      "-i",
      "/path/to/video.mp4",
      "-y",
      "-filter_complex",
      "[0:v]subtitles=/path/to/subtitle.ass[0:video]",
      "-map",
      "[0:video]",
      "-map",
      "0:a",
      "-c:v",
      "libx264",
      "-c:a",
      "copy",
      "/path/to/output.mp4",
    ]);
  });
  it("压制参数：视频，无弹幕，无高能弹幕", async () => {
    const files = {
      videoFilePath: "/path/to/video.mp4",
      assFilePath: undefined,
      outputPath: "/path/to/output.mp4",
      hotProgressFilePath: undefined,
    };

    const ffmpegOptions: FfmpegOptions = {
      encoder: "libx264",
      audioCodec: "copy",
    };

    const command = await genMergeAssMp4Command(files, ffmpegOptions);
    const args = command._getArguments();
    expect(args).toEqual([
      "-i",
      "/path/to/video.mp4",
      "-y",
      "-c:v",
      "libx264",
      "-c:a",
      "copy",
      "/path/to/output.mp4",
    ]);
  });
  it("压制参数：视频，有弹幕，无高能弹幕，有切割参数", async () => {
    const files = {
      videoFilePath: "/path/to/video.mp4",
      assFilePath: "/path/to/subtitle.ass",
      outputPath: "/path/to/output.mp4",
      hotProgressFilePath: undefined,
    };

    const ffmpegOptions: FfmpegOptions = {
      encoder: "libx264",
      audioCodec: "copy",
      ss: "00:00:00",
      to: "00:00:10",
    };

    const command = await genMergeAssMp4Command(files, ffmpegOptions);
    const args = command._getArguments();
    expect(args).toEqual([
      "-ss",
      "00:00:00",
      "-copyts",
      "-to",
      "00:00:10",
      "-i",
      "/path/to/video.mp4",
      "-y",
      "-filter_complex",
      "[0:v]subtitles=/path/to/subtitle.ass[0:video]",
      "-map",
      "[0:video]",
      "-map",
      "0:a",
      "-c:v",
      "libx264",
      "-ss",
      "00:00:00",
      "-c:a",
      "copy",
      "/path/to/output.mp4",
    ]);
  });
  it("压制参数：hevc硬件解码", async () => {
    const files = {
      videoFilePath: "/path/to/video.mp4",
      assFilePath: undefined,
      outputPath: "/path/to/output.mp4",
      hotProgressFilePath: undefined,
    };

    const ffmpegOptions: FfmpegOptions[] = [
      {
        encoder: "h264_nvenc",
        audioCodec: "copy",
        decode: true,
      },
      {
        encoder: "hevc_nvenc",
        audioCodec: "copy",
        decode: true,
      },
      {
        encoder: "av1_nvenc",
        audioCodec: "copy",
        decode: true,
      },
    ];
    for (const option of ffmpegOptions) {
      const command = await genMergeAssMp4Command(files, option);
      const args = command._getArguments();
      expect(args).toEqual([
        "-hwaccel",
        "cuda",
        "-hwaccel_output_format",
        "cuda",
        "-extra_hw_frames",
        "10",
        "-i",
        "/path/to/video.mp4",
        "-y",
        "-c:v",
        option.encoder,
        "-c:a",
        "copy",
        "/path/to/output.mp4",
      ]);
    }
  });
  it("压制参数：视频，弹幕，先缩放", async () => {
    const files = {
      videoFilePath: "/path/to/video.mp4",
      assFilePath: "/path/to/subtitle.ass",
      outputPath: "/path/to/output.mp4",
      hotProgressFilePath: undefined,
    };

    const ffmpegOptions: FfmpegOptions = {
      encoder: "libx264",
      audioCodec: "copy",
      resetResolution: true,
      resolutionWidth: 1920,
      resolutionHeight: 1080,
      scaleMethod: "before",
    };

    const command = await genMergeAssMp4Command(files, ffmpegOptions);
    const args = command._getArguments();
    expect(args).toEqual([
      "-i",
      "/path/to/video.mp4",
      "-y",
      "-filter_complex",
      "[0:v]scale=1920:1080[0:video];[0:video]subtitles=/path/to/subtitle.ass[1:video]",
      "-map",
      "[1:video]",
      "-map",
      "0:a",
      "-c:v",
      "libx264",
      "-c:a",
      "copy",
      "/path/to/output.mp4",
    ]);
  });
  it("压制参数：弹幕+后缩放", async () => {
    const files = {
      videoFilePath: "/path/to/video.mp4",
      assFilePath: "/path/to/subtitle.ass",
      outputPath: "/path/to/output.mp4",
      hotProgressFilePath: undefined,
    };

    const ffmpegOptions: FfmpegOptions = {
      encoder: "libx264",
      audioCodec: "copy",
      resetResolution: true,
      resolutionWidth: 1920,
      resolutionHeight: 1080,
      scaleMethod: "after",
    };

    const command = await genMergeAssMp4Command(files, ffmpegOptions);
    const args = command._getArguments();
    expect(args).toEqual([
      "-i",
      "/path/to/video.mp4",
      "-y",
      "-filter_complex",
      "[0:v]subtitles=/path/to/subtitle.ass[0:video];[0:video]scale=1920:1080[1:video]",
      "-map",
      "[1:video]",
      "-map",
      "0:a",
      "-c:v",
      "libx264",
      "-c:a",
      "copy",
      "/path/to/output.mp4",
    ]);
  });
  it("压制参数：弹幕+时间戳", async () => {
    const files = {
      videoFilePath: "/path/to/video.mp4",
      assFilePath: "/path/to/subtitle.ass",
      outputPath: "/path/to/output.mp4",
      hotProgressFilePath: undefined,
    };

    const ffmpegOptions: FfmpegOptions = {
      encoder: "libx264",
      audioCodec: "copy",
      addTimestamp: true,
    };

    const command = await genMergeAssMp4Command(files, ffmpegOptions, {
      startTimestamp: 1633831810,
    });
    const args = command._getArguments();
    console.log(args);
    expect(args).toEqual([
      "-i",
      "/path/to/video.mp4",
      "-y",
      "-filter_complex",
      "[0:v]subtitles=/path/to/subtitle.ass[0:video];[0:video]drawtext=text='%{pts\\:localtime\\:1633831810\\:%Y-%m-%d %T}':fontcolor=white:fontsize=24:x=10:y=10[1:video]",
      "-map",
      "[1:video]",
      "-map",
      "0:a",
      "-c:v",
      "libx264",
      "-c:a",
      "copy",
      "/path/to/output.mp4",
    ]);
  });
});

describe.concurrent("selectScaleMethod", () => {
  it("should return 'none' if resetResolution is false", () => {
    const ffmpegOptions: FfmpegOptions = {
      encoder: "libx264",
      audioCodec: "copy",
      resetResolution: false,
    };
    const result = selectScaleMethod(ffmpegOptions);
    expect(result).toBe("none");
  });

  it("should return 'none' if resetResolution is true but resolutionWidth and resolutionHeight are not set", () => {
    const ffmpegOptions: FfmpegOptions = {
      encoder: "libx264",
      audioCodec: "copy",
      resetResolution: true,
    };
    const result = selectScaleMethod(ffmpegOptions);
    expect(result).toBe("none");
  });

  it("should return 'auto' if resetResolution is true and resolutionWidth and resolutionHeight are set but scaleMethod is not set", () => {
    const ffmpegOptions: FfmpegOptions = {
      encoder: "libx264",
      audioCodec: "copy",
      resetResolution: true,
      resolutionWidth: 1920,
      resolutionHeight: 1080,
    };
    const result = selectScaleMethod(ffmpegOptions);
    expect(result).toBe("auto");
  });

  it("should return the value of scaleMethod if resetResolution is true and resolutionWidth and resolutionHeight are set", () => {
    const ffmpegOptions: FfmpegOptions = {
      encoder: "libx264",
      audioCodec: "copy",
      resetResolution: true,
      resolutionWidth: 1920,
      resolutionHeight: 1080,
      scaleMethod: "before",
    };
    const result = selectScaleMethod(ffmpegOptions);
    expect(result).toBe("before");
  });
});

describe.concurrent("ComplexFilter", () => {
  it("should initialize with default input stream", () => {
    const filter = new ComplexFilter();
    expect(filter.getLatestOutputStream()).toBe("0:v");
  });

  it("should add a filter and update the latest output stream", () => {
    const filter = new ComplexFilter();
    const outputStream = filter.addFilter("scale", "1920:1080");
    expect(outputStream).toBe("0:video");
    expect(filter.getLatestOutputStream()).toBe("0:video");
    expect(filter.getFilters()).toEqual([
      {
        filter: "scale",
        options: "1920:1080",
        inputs: ["0:v"],
        outputs: "0:video",
      },
    ]);
  });

  it("should add a scale filter", () => {
    const filter = new ComplexFilter();
    const outputStream = filter.addScaleFilter(1920, 1080, "bicubic");
    expect(outputStream).toBe("0:video");
    expect(filter.getLatestOutputStream()).toBe("0:video");
    expect(filter.getFilters()).toEqual([
      {
        filter: "scale",
        options: "1920:1080:flags=bicubic",
        inputs: ["0:v"],
        outputs: "0:video",
      },
    ]);
  });

  it("should add a subtitle filter", () => {
    const filter = new ComplexFilter();
    const outputStream = filter.addSubtitleFilter("/path/to/subtitle.ass");
    expect(outputStream).toBe("0:video");
    expect(filter.getLatestOutputStream()).toBe("0:video");
    expect(filter.getFilters()).toEqual([
      {
        filter: "subtitles",
        options: "/path/to/subtitle.ass",
        inputs: ["0:v"],
        outputs: "0:video",
      },
    ]);
  });

  it("should add a colorkey filter", () => {
    const filter = new ComplexFilter();
    const outputStream = filter.addColorkeyFilter();
    expect(outputStream).toBe("0:video");
    expect(filter.getLatestOutputStream()).toBe("0:video");
    expect(filter.getFilters()).toEqual([
      {
        filter: "colorkey",
        options: "black:0.1:0.1",
        inputs: ["0:v"],
        outputs: "0:video",
      },
    ]);
  });

  it("should add an overlay filter", () => {
    const filter = new ComplexFilter();
    const outputStream = filter.addOverlayFilter(["0:v", "1:v"]);
    expect(outputStream).toBe("0:video");
    expect(filter.getLatestOutputStream()).toBe("0:video");
    expect(filter.getFilters()).toEqual([
      {
        filter: "overlay",
        options: "W-w-0:H-h-0",
        inputs: ["0:v", "1:v"],
        outputs: "0:video",
      },
    ]);
  });

  it("should add a drawtext filter", () => {
    const filter = new ComplexFilter();
    const outputStream = filter.addDrawtextFilter(1633831810, "white", 24, 10, 10);
    expect(outputStream).toBe("0:video");
    expect(filter.getLatestOutputStream()).toBe("0:video");
    expect(filter.getFilters()).toEqual([
      {
        filter: "drawtext",
        options:
          "text='%{pts\\:localtime\\:1633831810\\:%Y-%m-%d %T}':fontcolor=white:fontsize=24:x=10:y=10",
        inputs: ["0:v"],
        outputs: "0:video",
      },
    ]);
  });
});
