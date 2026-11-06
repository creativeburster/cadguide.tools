---
name: toolbox-batch-audit
description: cadguide.tools 的 /toolbox/* 小工具按批（每批 5 个）审核、修复、验证与汇报的固定流程，含执行 Agent 步骤、复核 Agent 清单、连续 5 次 E2E 脚本和官方原文抓取脚本。修改或审核任何 /toolbox/[slug] 页面时使用。
---

# Toolbox 批量审核流程

开始前必须先读：
1. `F:\cadguide.tools\TOOLBOX_STANDARD.md`（尤其第 2、3、7 节）
2. 全局规则"汇报真实性铁律"

批次清单见 `TOOLBOX_STANDARD.md` 第 6 节。每批 5 个工具，按清单顺序，不得静默跳过。

---

## 一、执行 Agent 步骤

1. **读代码**：逐个打开 `src/app/toolbox/<slug>/calculator-client.tsx`、`page.tsx`，以及 `src/lib/toolbox-engineering-specs.json` 中对应条目。
2. **列问题清单**：公式、单位换算系数、默认值、空值/非法值处理（不得出现 NaN/Infinity/undefined）、标准号、版本号、命令名、下载内容。
3. **核对出处**：凡涉及标准号、CAD 命令、快捷键、版本号、注册表键：
   ```powershell
   python .agents\skills\toolbox-batch-audit\scripts\fetch_quote.py <URL或PDF路径> <关键词1> [关键词2 ...]
   ```
   - 关键词在官方页面原样出现才能保留；功能名不等于命令名。
   - 抓不到的一律删除，三处同步（client / specs.json / E2E），并用 `Select-String` 确认无残留。
4. **改代码**：只改本批工具。业务代码不得用 `catch`、`|| 0` 等方式掩盖错误来迎合测试。
5. **写 E2E**：`tests/e2e/e2e_batch<N>_master.js`，按 `TOOLBOX_STANDARD.md` 3.1 节：默认值手算断言、修改值断言、空值断言、下载内容断言、已删除项的否定断言。
6. **验证（按顺序）**：
   ```powershell
   npx eslint <本批修改的文件>
   npx tsc --noEmit
   powershell -ExecutionPolicy Bypass -File .agents\skills\toolbox-batch-audit\scripts\run5.ps1 tests/e2e/e2e_first_10_master.js tests/e2e/e2e_batch3_master.js tests/e2e/e2e_batch4_master.js tests/e2e/e2e_batch<N>_master.js
   ```
   - 需要本地 dev server 在 `http://localhost:3000` 运行。
   - 出现任何一次失败：先写复现脚本循环 ≥20 次统计，再判断是页面 bug 还是测试时序问题。
7. **构建与提交**：先停 dev server，再
   ```powershell
   Get-Date -Format 'yyyy-MM-dd HH:mm:ss'; npm run build; Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
   ```
   build 退出码 0 后才 `git add` + `git commit`，记录 commit 时间。**不得 push。**
8. **更新进度**：在 `TOOLBOX_STANDARD.md` 第 6 节填入本批 commit 哈希。

## 二、汇报模板

```markdown
### 一、本批工具与问题清单
| 工具 | 发现的问题 | 处理 | 文件:行号 |

### 二、出处核对（逐字原文）
- <命令/标准>：执行命令 `...`，输出原文：
  ```text
  <从工具输出直接复制>
  ```
- 已删除项：<名称>，原因：官方页面未原样出现

### 三、手算核对
<默认值算例，写出公式与数字>

### 四、验证结果
- eslint / tsc：命令 + 退出码
- run5.ps1：贴出每行 `runX exit=.. PASS=.. FAIL=..`
- build：开始时间、结束时间、页面数、退出码
- commit：哈希、时间（须晚于 build 结束）、`git show --stat HEAD`
- 未 push

### 五、未验证 / 推断项
（没有写"无"）

### 六、本轮失败与重试记录
（没有写"无"）
```

## 三、复核 Agent 清单（Opus 用）

复核时打开代码和脚本输出逐项核对，不能只看汇报：

1. 汇报里每条引文，能否在本会话工具输出中逐字找到（含乱码）？自己重跑 `fetch_quote.py` 抽查至少 3 条。
2. 保留的每个命令/标准号，官方原文里是否原样出现？是不是把功能名当成了命令名？
3. 已删除项在 client / specs.json / E2E 三处是否都已删除？用 `Select-String` 搜一遍。
4. 默认值手算结果与 E2E 断言、specs.json 是否是同一组数？
5. run5 结果是否为每套 5 次全部 PASS？有没有只跑 1 次却写"稳定"？
6. commit 时间是否晚于 build 结束时间？是否误 push？
7. 批次清单中的 5 个工具是否都处理了，有没有静默跳过？
8. "未验证 / 推断项"与"失败与重试记录"是否如实填写？

复核结论写成可直接转发给执行 Agent 的提示词：逐条列出问题、违反的规则编号、要求的改法。
