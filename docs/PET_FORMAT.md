# 轻量桌宠包 v1

静态图片：PNG ≤2 MB，宽高1–1024 px。建议128×128或256×256透明背景；不透明图片可导入但不会自动抠图。

动画包：ZIP≤5 MB，只包含根目录 `manifest.json`、一张PNG、可选 `LICENSE.txt`。无目录、软链接、脚本、HTML、SVG或外部URL。支持ZIP_STORED和常规Deflate；旧浏览器可使用STORED。解压总量≤8 MB、单项≤4 MB、manifest≤16 KB、许可≤32 KB；路径、CRC、PNG签名/尺寸、网格和帧索引均校验。

每帧32–256 px，网格每边1–16格，总共≤64格，PNG每边≤2048 px；fps为整数1–12。必须有 `idle`，可选 `tap`。格子相同尺寸，索引按从左到右、从上到下排列，从0开始。只支持这两种动作；减少动态时显示idle第一帧。角色中心、脚底基线和留白应一致。

```json
{
  "version": 1,
  "name": "原创小伙伴",
  "image": "sprite.png",
  "frame": { "width": 128, "height": 128, "columns": 4, "rows": 1 },
  "pixelated": false,
  "animations": {
    "idle": { "frames": [0, 1, 2, 3, 2, 1], "fps": 4, "loop": true },
    "tap": { "frames": [0, 2, 0], "fps": 6, "loop": false }
  }
}
```

`image` 必须是根目录英文/数字/下划线/横杠PNG文件名，不含路径、反斜线或 `..`。许可文件用来说明素材来源；应用只把它当数据，不执行内容。

## 让 agent 制作

1. 描述一个原创角色，明确透明PNG、四格128×128图集、仅轻微呼吸/眨眼、不移动基线、不加文字。不要让agent复制未获授权的角色或软件内置素材。
2. 生成或绘制512×128 PNG，检查四格边界、透明度、角色比例、脚底基线、无串格/裁切。AI生成的图集可能错位，视觉检查仍必要。
3. 按上面的格式写 `manifest.json`，将 `name`、图片尺寸和实际帧数同步。静态角色只需PNG，不必制作动画ZIP。
4. 将manifest、PNG和可选许可直接打进ZIP根目录，避免macOS隐藏文件和父目录。可让agent用Python标准库 `zipfile` 的 `ZIP_STORED` 打包；不需要将图片上传任何课表服务。
5. 运行下面的结构校验，再在App预览实际动画。结构通过不代表透明度、基线或循环接缝正确。

```sh
python3 prototype/tools/validate_pet.py your-pet.zip
```

可给agent的任务示例：

> 为课间制作一个原创圆润小云朵伙伴。透明PNG，四格128×128，排为512×128，只做轻微眨眼和呼吸，保持中心和脚底基线一致。使用课间v1 manifest，仅idle和tap，4fps。生成根目录包含manifest.json、sprite.png和原创素材许可说明的STORED ZIP；运行validate_pet.py，并检查每帧像素、边缘和循环。

`prototype/examples/tuantuan*.pet.zip` 是项目原创格式示例；不包含Codex/ChatGPT官方宠物，不需要九动作或十六方向。
