---
title: "别手动删 ~/.codex：我做了一个 Codex 本地历史清理工具"
date: 2026-06-04
tags:
  - Codex
  - CLI
  - OpenSource
  - SQLite
  - DeveloperTools
source: https://juejin.cn/post/7647239078500499492
---

# 别手动删 ~/.codex：我做了一个 Codex 本地历史清理工具

> ✨文章摘要（AI生成）
>
<!-- DESC SEP -->
>
> 介绍 **codex-history** 的设计思路和本地历史清理流程：先检查数据结构，再筛选并确认目标，最后验证清理结果。文章覆盖 doctor、list、purge 和 purge-orphans 的用法，以及工具在数据支持范围、当前会话保护和批量删除上的取舍。
>
<!-- DESC SEP -->

Codex 用久以后，本地对话历史会越攒越多。我一开始只是想精确清掉某几个项目里的旧对话，结果发现事情没有“从列表里消失”这么简单：有些入口更像归档，有些数据还散在本地 SQLite、JSON、JSONL 和状态文件里。

也就是说，单纯“看不见”并不等于“删干净”。真要手动改 `~/.codex`，又很容易出现两个问题：漏掉引用，或者误删还在使用的状态。

我最近开源了一个小工具 `codex-history`，定位很明确：查找、筛选并清理**受支持的本地 Codex 数据**。它不是服务端删除工具，也不是替代 Codex 官方能力的工具；它只是把“手动翻本地文件”的过程，变成一个先检查、再确认、执行后验证的 CLI 流程。

我做它的直接原因，是现有清理路径不够适合“精确删除本地历史”这个场景。Codex App 里的 archive 更像整理历史列表，Codex CLI 目前也没有公开的本地历史 purge 命令；而本地数据里还可能存在“会话主记录、rollout 文件、日志记录不同步”的残留形态。这正是 `codex-history` 想解决的问题：不是替代官方能力，而是给本地清理提供一个更明确的工程流程。

## 我想解决的不是“暴力删除”

如果只是写一个递归删除文件的脚本，难点并不大。真正麻烦的地方，是先判断哪些数据可以安全删除。Codex 本地历史不是一个单独目录能概括的东西：对话元信息、会话文件、日志、全局状态、shell snapshot、输入草稿缓存，都可能保存 thread id 或相关引用。

所以这个工具的设计原则是：

1. 遇到未知数据结构时默认拒绝执行，也就是 fail closed。

2. 删除前必须把目标解析清楚。

3. 交互式删除必须让用户确认。

4. 删除后必须扫描受支持的存储，确认已知引用已经移除。

5. 只处理本地数据，不承诺删除服务端记录、系统备份或用户自己保存的副本。

换句话说，`codex-history` 的价值不只是“能删”，而是让删除这件事变得可解释。

## 删除前，先用 doctor 检查本地数据结构

安装：

```bash
npm install -g @liuyoumi/codex-history
```

也可以不安装直接运行：

```bash
npx @liuyoumi/codex-history doctor
```

我建议先跑一次结构检查：

```bash
codex-history doctor
```

下面的示例截图来自临时 demo `--codex-home`，不包含真实用户数据：

![doctor.png](/posts/codex-history/doctor.webp)

`doctor` 会检查当前 Codex 本地数据结构是否被这个版本支持。如果结构不支持，后续删除命令会拒绝执行。这个设计看起来保守，但对清理工具来说，保守是优点：我宁愿让命令失败，也不想在未知数据库结构上猜应该删哪一行。

## 用 list 找到要清理的对话

列出本地对话：

```bash
codex-history list
```

![list.png](/posts/codex-history/list.webp)

默认只显示未归档对话。如果想看已归档对话，可以加：

```bash
codex-history list --archived
```

如果本地历史很多，可以用关键词筛选：

```bash
codex-history list --grep "Purge"
```

![list-grep-purge.png](/posts/codex-history/list-grep-purge.webp)

这里有个刻意限制：`--grep` 只匹配显示标题、首条用户消息和预览，不匹配 thread id、cwd，也不会搜索完整对话正文。

为什么不做全文搜索？因为这是清理工具，不是历史检索系统。删除前的筛选应该足够可解释：用户看到标题、首条消息和预览，就能判断这是不是要删的目标。如果因为完整上下文里某个不起眼的词把一条会话带进删除计划，反而更危险。

按项目路径筛选可以用：

```bash
codex-history list --cwd codex-history --pretty=medium
```

`--cwd` 支持路径片段，可以输入完整路径，也可以输入项目名的一部分。

![list-cwd-medium.png](/posts/codex-history/list-cwd-medium.webp)

## purge：删除前先确认目标

删除单条本地对话：

```bash
codex-history purge 019e6885
```

交互式流程会先展示解析到的目标，并要求输入标准短 id：

![purge-confirmation.png](/posts/codex-history/purge-confirmation.webp)

这个确认不是形式主义，而是为了把“我以为我要删这一条”和“工具实际解析到这一条”对齐。`purge` 是不可恢复的本地删除操作，所以最后一步必须显式确认。

批量删除也支持：

```bash
codex-history purge 019e6885 019e6874
```

也可以按条件选择：

```bash
codex-history purge --cwd /Users/me/Projects/example
codex-history purge --grep "Purge"
codex-history purge --archived
codex-history purge --cwd /Users/me/Projects/example --grep "Purge"
```

过滤条件可以组合，组合后只删除同时满足全部条件的会话。批量和过滤式删除都会展示计划，并要求输入 `purge-selected`。

如果任何目标不存在、不唯一，或者命中当前 active thread，整个批量操作会在修改数据前拒绝执行，不会部分删除。

脚本或非交互场景可以使用 `--force`：

```bash
codex-history purge 019e6885 --force
```

但 `--force` 只跳过交互确认，不会跳过数据结构校验、active thread 保护和删除后的验证。

## purge-orphans：处理本地孤儿数据

除了明确存在的对话，本地还可能出现一些“孤儿数据”：主记录与文件、日志之间不再一致。比如某条记录还指向一个已经不存在的 session 文件，或者日志里还能看到某个 thread id，但线程表里已经没有对应线程。

目前工具支持识别并清理两类残留：

- `state_5.sqlite.threads.rollout_path` 指向的 session 或 archived session 文件已经不存在。

- `logs_2.sqlite.logs` 中还有 thread id，但 `threads` 表中已经没有对应线程。

对应命令是：

```bash
codex-history purge-orphans
```

它会先展示清理计划、受影响的 SQLite 行数、将删除的文件数量，以及估算的本地磁盘空间影响。确认时需要输入：

```text
purge-orphans
```

这里也有一个边界：空间统计只是估算。SQLite 删除记录后，数据库文件不一定立刻变小，可能要等 Codex 或其他 SQLite 维护步骤执行 vacuum。

## 几个工程取舍

第一，不把 `archive` 当成 `purge`。归档适合整理历史列表，但它不等于清理所有受支持的本地引用。

第二，不做模糊删除。短 id 前缀必须解析到唯一目标，否则拒绝执行。

第三，不递归扩大清理范围。比如父子线程关系不会自动扩展为“把相关线程都删掉”。每条会话都必须独立命中清理条件。

第四，删除后做验证。工具会扫描受支持的本地存储，如果目标 thread id 仍有已知引用，命令会用非零退出码报告。

第五，建议重启 Codex Desktop。`purge` 修改的是磁盘上的本地数据，但正在运行的 Codex 进程可能仍然持有内存里的旧状态。如果继续在已经打开的旧会话里聊天，可能会重新写入同一个 thread 的本地数据。

## 适合场景

- 经常使用 Codex Desktop 或 Codex CLI 的用户。

- 想按项目、关键词或归档状态清理本地历史的人。

- 不想手动编辑 `~/.codex` 的人。

- 希望删除前看到明确目标、删除后有验证结果的人。

## 项目地址

GitHub: [https://github.com/liuyoumi/codex-history](https://github.com/liuyoumi/codex-history)

npm: [https://www.npmjs.com/package/@liuyoumi/codex-history](https://www.npmjs.com/package/@liuyoumi/codex-history)

如果你也在用 Codex，并且遇到过本地历史不好清理的问题，可以先跑一次 `doctor` 看看自己的本地结构是否受支持，再决定要不要继续 `list` 或 `purge`。更欢迎提 issue，尤其是不同平台、不同 Codex 版本下的反馈；如果这个方向对你有帮助，也欢迎 Star 支持后续维护。

---

本文由 Galen 创作，原文发布于[掘金](https://juejin.cn/post/7647239078500499492)。
