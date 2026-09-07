---
title: "Stop Deleting ~/.codex Manually: A Local Codex History Cleanup Tool"
date: 2026-06-04
tags:
  - Codex
  - CLI
  - OpenSource
  - SQLite
  - DeveloperTools
source: https://juejin.cn/post/7647239078500499492
---

# Stop Deleting ~/.codex Manually: A Local Codex History Cleanup Tool

> ✨Article Summary (AI Generated)
>
<!-- DESC SEP -->
>
> An introduction to **codex-history** and its inspect, select, confirm, and verify workflow for local Codex history. It covers doctor, list, purge, and purge-orphans, along with supported-data boundaries, active-thread protection, and batch-deletion tradeoffs.
>
<!-- DESC SEP -->

The longer I use Codex, the more local conversation history accumulates. Initially, I only wanted to remove old conversations from a few specific projects. It turned out to be more complicated than making them disappear from a list: some actions behave more like archiving, while other data is scattered across local SQLite databases, JSON, JSONL, and state files.

In other words, “no longer visible” does not necessarily mean “fully removed.” Editing `~/.codex` manually creates two easy mistakes: missing references or accidentally deleting state that is still in use.

I recently open-sourced a small tool called `codex-history`. Its purpose is specific: find, filter, and clean up **supported local Codex data**. It does not delete server-side records or replace official Codex functionality. It turns the process of manually examining local files into a CLI workflow that inspects first, asks for confirmation, and verifies the result afterward.

The immediate motivation was that existing cleanup paths did not fit the task of precisely deleting local history. Archiving in the Codex app is more about organizing the history list, and the Codex CLI currently has no public local-history purge command. Local data can also retain mismatches between conversation records, rollout files, and logs. This is the problem `codex-history` aims to address: providing a clearer engineering workflow for local cleanup, rather than replacing official functionality.

## The goal is more than brute-force deletion

Writing a script that recursively deletes files is not particularly difficult. The difficult part is deciding which data can be safely removed. Codex history is not confined to one directory: conversation metadata, session files, logs, global state, shell snapshots, and input-draft caches may all contain thread IDs or related references.

The tool follows these principles:

1. Refuse to proceed when the data structure is unknown: fail closed.
2. Resolve the targets clearly before deleting anything.
3. Require user confirmation for interactive deletion.
4. Scan supported stores afterward to confirm that known references have been removed.
5. Handle local data only, without promising to delete server-side records, system backups, or copies saved by the user.

The value of `codex-history` is not simply that it can delete data. It makes the deletion process understandable.

## Before deleting, inspect local structures with doctor

Install the tool:

```bash
npm install -g @liuyoumi/codex-history
```

Or run it without installing:

```bash
npx @liuyoumi/codex-history doctor
```

I recommend starting with a structural check:

```bash
codex-history doctor
```

The following screenshots use a temporary demo `--codex-home` and contain no real user data:

![doctor.png](/posts/codex-history/doctor.webp)

`doctor` checks whether this version of the tool supports the current local Codex data structure. If it does not, subsequent deletion commands refuse to run. That may seem conservative, but caution is useful in a cleanup tool: I would rather have a command fail than guess which row to delete in an unfamiliar database.

## Use list to find conversations to clean up

List local conversations:

```bash
codex-history list
```

![list.png](/posts/codex-history/list.webp)

By default, only unarchived conversations are shown. To include archived conversations, add:

```bash
codex-history list --archived
```

If there is a lot of history, filter it by keyword:

```bash
codex-history list --grep "Purge"
```

![list-grep-purge.png](/posts/codex-history/list-grep-purge.webp)

There is a deliberate limitation: `--grep` matches only the displayed title, first user message, and preview. It does not match thread IDs or working directories, and it does not search the full conversation body.

Why not full-text search? This is a cleanup tool rather than a history-retrieval system. Filtering before deletion should be easy to understand. The title, first message, and preview should give users enough information to decide whether a conversation is a target. Adding a conversation to a deletion plan because of an obscure word deep in its context would be more dangerous.

To filter by project path:

```bash
codex-history list --cwd codex-history --pretty=medium
```

`--cwd` supports path fragments. You can enter a full path or part of a project name.

![list-cwd-medium.png](/posts/codex-history/list-cwd-medium.webp)

## purge: confirm the targets first

Delete a single local conversation:

```bash
codex-history purge 019e6885
```

The interactive flow shows the resolved target and asks you to enter its standard short ID:

![purge-confirmation.png](/posts/codex-history/purge-confirmation.webp)

This confirmation is not a formality. It aligns “the conversation I think I am deleting” with “the conversation the tool actually resolved.” `purge` is an irreversible local deletion operation, so its final step requires explicit confirmation.

Batch deletion is also supported:

```bash
codex-history purge 019e6885 019e6874
```

You can select targets using filters as well:

```bash
codex-history purge --cwd /Users/me/Projects/example
codex-history purge --grep "Purge"
codex-history purge --archived
codex-history purge --cwd /Users/me/Projects/example --grep "Purge"
```

Filters can be combined. Only conversations matching all supplied conditions are deleted. Both batch deletion and filtered deletion display a plan and require you to enter `purge-selected`.

If any target is missing, ambiguous, or the currently active thread, the entire batch is rejected before any data is modified. The tool does not partially delete the batch.

For scripts or noninteractive use, you can specify `--force`:

```bash
codex-history purge 019e6885 --force
```

However, `--force` only skips interactive confirmation. It does not skip structural validation, active-thread protection, or verification after deletion.

## purge-orphans: clean up local orphaned data

Alongside existing conversations, local stores may contain orphaned data: primary records, files, and logs that are no longer consistent. For example, a record may point to a session file that no longer exists, or logs may contain a thread ID that is absent from the thread table.

The tool currently recognizes and cleans up two types of residue:

- A `state_5.sqlite.threads.rollout_path` pointing to a missing session or archived-session file.
- A thread ID in `logs_2.sqlite.logs` that no longer has a corresponding record in the `threads` table.

Use this command:

```bash
codex-history purge-orphans
```

It first displays the cleanup plan, the number of affected SQLite rows, the number of files to remove, and an estimate of the local disk-space impact. To confirm, enter:

```text
purge-orphans
```

The disk-space figure is only an estimate. Deleting SQLite records does not necessarily shrink a database file immediately; that may require Codex or another SQLite maintenance process to run vacuum later.

## A few engineering tradeoffs

First, `archive` is not treated as `purge`. Archiving helps organize the history list, but it does not remove all supported local references.

Second, deletion is not fuzzy. A short ID prefix must resolve to exactly one target; otherwise, the operation is rejected.

Third, the cleanup scope does not expand recursively. For example, parent-child thread relationships do not automatically mean deleting all related threads. Every conversation must independently match the cleanup criteria.

Fourth, deletion is verified. The tool scans supported local stores and reports a nonzero exit code if known references to a target thread ID remain.

Fifth, restarting Codex Desktop is recommended. `purge` modifies local data on disk, but a running Codex process may still retain old state in memory. Continuing a conversation that was already open can write local data for that same thread again.

## Who it is for

- Frequent users of Codex Desktop or Codex CLI.
- People who want to clean up local history by project, keyword, or archive status.
- People who do not want to edit `~/.codex` manually.
- People who want clear targets before deletion and verified results afterward.

## Project links

GitHub: [https://github.com/liuyoumi/codex-history](https://github.com/liuyoumi/codex-history)

npm: [https://www.npmjs.com/package/@liuyoumi/codex-history](https://www.npmjs.com/package/@liuyoumi/codex-history)

If you use Codex and have struggled to clean up local history, start with `doctor` to see whether your local structure is supported, then decide whether to continue with `list` or `purge`. Issues are welcome, especially reports from different platforms and Codex versions. If this direction is useful to you, a star is also a welcome way to support continued maintenance.

---

Written by Galen. Originally published in Chinese on [Juejin](https://juejin.cn/post/7647239078500499492).
