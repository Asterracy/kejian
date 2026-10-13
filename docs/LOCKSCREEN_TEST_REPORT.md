# 0.3.0 锁屏课程通知测试报告

2026-10-13；基线为官方仓库 f28bc2f（0.2.1 / 3）。本机独立检出，无改动旧项目。

- 包名 cn.kejian.app，版本 0.3.0 / 4；最低 Android 8，目标 API 35。APK v2/v3 签名校验通过，与原 0.2.1 APK 的证书 SHA-256 一致：97c537e371e113110a69aea8e5118eeba32d3de7d369bafe6c47e19f13ebd5f9。满足覆盖升级的签名及版本条件；没有卸载或清理数据。SharedPreferences 文件名、原课表、提醒与宠物键未改。升级安装是否成功仍待真机验证。
- 30 项生产 CoursePlan JVM 检查：开始/结束边界、相邻课程、空课表、缺地点、缺钟点、下日课程、跨周已展开课程、单层调休、时区及下次调度边界。
- 19 项生产 CourseNotification 调度检查，Android 通知/闹钟/存储及 JSON 解码为测试替身：通知拒绝、渠道关闭、关闭重开、重复启用、单卡片、默认隐私和公开详情、课表更新、损坏状态清除、保存失败、非唤醒 RTC 和十分钟窗口。测试替身不验证 Android 实际通知权限或系统锁屏行为。
- 21 项 jsdom 与原生桥模拟：新菜单启动不索要权限、打开设置；既有导入、调休、提醒、双击防重、持久化模拟与宠物交互回归。
- 47 项通用 Excel、31 项既有 Excel、23 项课程/宠物包、15 项原生时间状态、31 项有界解压回归通过。
- 总计 217 项检查通过。aapt2、javac、D8、zipalign、apksigner 与 ZIP CRC 验证通过；未新增权限，APK 不含签名材料和测试代码。

## 调度和系统限制

锁屏卡片不使用精确闹钟，不额外弹出“闹钟和提醒”授权。系统 setWindow 的十分钟窗口允许切课延迟，休眠/省电/厂商后台限制可能进一步延后；AlarmManager.RTC 不主动唤醒设备。回到应用会立即按当前设备时间重算。重启、包替换、系统时间和时区事件复用原有接收器。通知可以被系统隐藏或移除，不保证常驻或跨厂商布局。详情关闭时主通知和 publicVersion 均为通用提示（不含课程名、日期和地点），避免系统允许敏感内容时泄露；详情开启时选择 PUBLIC；最终受系统锁屏通知设置控制。

## 未验证与真机验收

ADB 初次在沙箱无法启动监听，获准进行只读设备查询后成功，设备列表为空；没有安装新的模拟器或修改安全设置。未完成真机安装、覆盖升级、系统权限弹窗拒绝/允许、锁屏隐私、渠道设置、真实重启、省电延迟、Android 16/MagicOS 10 验收。jsdom 不是布局或系统弹窗视觉验证。建议真机直接覆盖安装后测试：拒绝授权→设置允许；开关关闭重开；导入/调休更新；空课表；课程起止和跨日；隐藏/公开详情；省电、重启及改时区。不要卸载旧版。

复跑：按 README 配置 JDK/SDK，运行 node tools/test.cjs、python3 tools/test_native.py、python3 tools/test_course_notifications.py。仅既有 jsdom 测试依赖，不进入 APK。

官方依据：[系统通知](https://developer.android.com/develop/ui/compose/notifications/create-notification)、[闹钟调度](https://developer.android.com/develop/background-work/services/alarms)、[通知权限](https://developer.android.com/develop/ui/compose/notifications/notification-permission)。
