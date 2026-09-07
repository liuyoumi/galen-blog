<template>
	<ol class="profile-timeline">
		<li v-for="(item, index) in items" :key="item.time" :class="{ current: index === 0 }">
			<span class="timeline-dot" aria-hidden="true"></span>
			<time>{{ item.time }}</time>
			<div>
				<strong>{{ item.title }}</strong>
				<p>{{ item.description }}</p>
			</div>
		</li>
	</ol>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{ locale?: "zh" | "en" }>(), {
	locale: "zh",
});

const zhItems = [
  {
    "time": "2002",
    "title": "故事开始",
    "description": "来到这个世界，故事从这一页开始。往后的日子，慢慢走，慢慢看。"
  },
  {
    "time": "2021 — 2025",
    "title": "软件工程",
    "description": "用四年认识软件，也认识自己。学着拆解问题，把脑海里的想法一点点写成现实。"
  },
  {
    "time": "2024 — 2025",
    "title": "互联网中厂 · 前端实习",
    "description": "从课堂走进真实业务，在页面、代码与团队协作中，慢慢找到开发者的节奏。"
  },
  {
    "time": "2025 — 至今",
    "title": "互联网中厂 · AI 应用开发工程师",
    "description": "探索 AI 能做些什么，也琢磨怎样让它更好用。在尝试与打磨之间，继续积累自己的答案。"
  }
];

const enItems = [
  {
    "time": "2002",
    "title": "The story begins",
    "description": "A first page in a much longer story. Plenty of time to walk, look around, and discover."
  },
  {
    "time": "2021 — 2025",
    "title": "Software Engineering",
    "description": "Four years of learning about software and myself. Breaking problems down and turning ideas into something real."
  },
  {
    "time": "2024 — 2025",
    "title": "Frontend intern · Mid-sized internet company",
    "description": "From the classroom to real products, finding my rhythm through interfaces, code, and teamwork."
  },
  {
    "time": "2025 — Present",
    "title": "AI application engineer · Mid-sized internet company",
    "description": "Exploring what AI can do and how to make it useful. Learning through experiments, iteration, and everyday work."
  }
];

const items = computed(() => [...(props.locale === "en" ? enItems : zhItems)].reverse());
</script>

<style scoped>
.profile-timeline { list-style: none; padding: 0; margin: 0; }
.profile-timeline li { position: relative; margin: 0; padding: 0 0 30px 28px; border-left: 1px solid var(--vp-c-divider); }
.profile-timeline li:last-child { padding-bottom: 0; border-left-color: transparent; }
.timeline-dot { position: absolute; left: -4px; top: 5px; width: 7px; height: 7px; border: 1px solid var(--vp-c-text-3); border-radius: 50%; background: var(--vp-c-bg); }
.current .timeline-dot { background: var(--vp-c-brand-1); border-color: var(--vp-c-brand-1); box-shadow: 0 0 0 4px var(--vp-c-brand-soft); }
.profile-timeline time { display: block; margin-bottom: 8px; font: 10px var(--vp-font-family-mono); color: var(--vp-c-text-2); }
.current time { color: var(--vp-c-brand-1); }
.profile-timeline strong { font-size: 15px; line-height: 1.6; font-weight: 550; }
.profile-timeline p { margin: 7px 0 0; font-size: 13px; line-height: 1.8; color: var(--vp-c-text-2); }
@media (max-width: 640px) { .profile-timeline li { padding-left: 25px; } }
</style>
