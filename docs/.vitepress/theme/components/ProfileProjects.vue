<template>
	<div class="profile-projects" :class="{ 'is-motion-disabled': !props.motion || reducedMotion }">
		<div class="profile-project-grid">
			<component
        :is="project.url ? 'a' : 'article'"
				v-for="(project, index) in cardProjects"
				:key="project.name"
				class="profile-project-card"
				:href="project.url || undefined"
				target="_blank"
				rel="noopener noreferrer"
			>
				<div class="profile-project-media" @pointermove="handlePointerMove" @pointerleave="resetPointer">
					<div class="project-cover" :class="`cover-${project.id}`" aria-hidden="true">
              <template v-if="project.id === 'history'"><span class="cover-overline">LOCAL HISTORY / CLI</span><div class="mini-terminal"><span class="terminal-dots">● ● ●</span><code>$ codex-history</code><span>› Your conversations, organized.</span><code>LOCAL · SEARCH · CLEAN UP</code><span class="terminal-ok">A little less clutter.</span></div></template>
              <template v-else-if="project.id === 'clipboard'"><span class="cover-overline">macOS / LOCAL FIRST</span><div class="mini-clipboard"><span class="clipboard-search">⌕ &nbsp; {{ props.locale === 'en' ? 'Find something copied…' : '找回刚刚复制的内容…' }}</span><span>✧ &nbsp; {{ props.locale === 'en' ? 'A thought worth keeping' : '一段值得留下的话' }}</span><span>↗ &nbsp; github.com/liuyoumi</span><span class="clipboard-shortcut">⌘ ⇧ V</span></div></template>
              <template v-else-if="project.id === 'reading'"><span class="cover-overline">{{ props.locale === 'en' ? 'ON PAPER / CONCEPT' : '纸上的想法 / 构想中' }}</span><div class="concept-book"><span>“</span><strong>{{ props.locale === 'en' ? 'One more page.' : '读到这里。' }}</strong><i></i><i></i><i></i></div></template>
              <template v-else><span class="cover-overline">{{ props.locale === 'en' ? 'ON PAPER / CONCEPT' : '纸上的想法 / 构想中' }}</span><div class="concept-run"><span>START WHERE YOU ARE.</span><svg viewBox="0 0 240 80"><path d="M6 63h45l19-36 24 45 29-54 25 40 28-21 23 26h35" /></svg><strong>{{ props.locale === 'en' ? 'A little further.' : '原地，也向前。' }}</strong></div></template>
            </div>
				</div>
				<div class="profile-project-copy">
					<div class="profile-project-caption" aria-hidden="true"><span class="profile-project-number">{{ String(index + 1).padStart(2, "0") }}</span><span class="profile-project-domain">{{ project.domain }}</span></div>
					<div class="profile-project-title">
						<strong>{{ project.name }}</strong>
						<span v-if="project.url" aria-hidden="true">↗</span>
					</div>
					<p>{{ project.description }}</p>
				</div>
			</component>
		</div>
		<section v-if="textProjects.length" class="profile-more-projects" aria-labelledby="more-projects-title">
			<h3 id="more-projects-title">{{ props.locale === 'en' ? 'More projects' : '更多项目' }}</h3>
			<ul class="profile-project-list">
				<li v-for="project in textProjects" :key="project.name">
					<a class="profile-project-row" :href="project.url" target="_blank" rel="noopener noreferrer">
						<span class="profile-project-row-copy">
							<span class="profile-project-row-name"><strong>{{ project.name }}</strong><span class="profile-project-row-arrow" aria-hidden="true">↗</span></span>
							<span class="profile-project-row-description">{{ project.description }}</span>
						</span>
					</a>
				</li>
			</ul>
		</section>
	</div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

const props = withDefaults(defineProps<{ locale?: "zh" | "en"; motion?: boolean }>(), {
	locale: "zh",
	motion: true,
});

const projects = [
  { id: 'history', name: 'codex-history', domain: 'OPEN SOURCE · CLI', url: 'https://github.com/liuyoumi/codex-history', zh: '管理本地 Codex 对话历史的命令行工具，支持查找、筛选与确认后清理，让历史记录更好打理。', en: 'A CLI for local Codex conversation history: find, filter, and clean up selected records after confirmation.' },
  { id: 'clipboard', name: 'Clipboard', domain: 'OPEN SOURCE · macOS', url: 'https://github.com/liuyoumi/Clipboard', zh: '一款 macOS 剪贴板历史工具，记录复制过的文字和图片，支持搜索与固定，数据保存在本机。', en: 'A macOS clipboard history tool for copied text and images, with search, pinned items, and local storage.' },
  { id: 'reading', name: '读到这里', domain: 'CONCEPT', url: '', zh: '构想中：一个轻量阅读手记，收藏句子，也记下合上书时的念头。', en: 'Concept: a small reading journal for favorite passages and thoughts that linger after the last page.' },
  { id: 'running', name: '原地开跑', domain: 'CONCEPT', url: '', zh: '构想中：一本跑步机日记，记录时间、距离和心情，看看原地跑过了多远。', en: 'Concept: a treadmill diary for time, distance, and mood. A record of how far staying in one place can take you.' },
];
const englishNames: Record<string, string> = { reading: 'One More Page', running: 'Run in Place' };
const cardProjects = computed(() => projects.map(project => ({
  ...project,
  name: props.locale === 'en' ? (englishNames[project.id] || project.name) : project.name,
  domain: project.url ? project.domain : (props.locale === 'en' ? 'CONCEPT · NOT RELEASED' : '构想中 · 尚未发布'),
  description: props.locale === 'en' ? project.en : project.zh,
})));
const textProjects = computed(() => [] as typeof cardProjects.value);

const reducedMotion = ref(false);
let motionQuery: MediaQueryList | undefined;

function syncMotionPreference() {
	reducedMotion.value = motionQuery?.matches ?? false;
}

function handlePointerMove(event: PointerEvent) {
	if (!props.motion || reducedMotion.value || (event.pointerType && event.pointerType !== "mouse")) return;
	const media = event.currentTarget as HTMLElement | null;
	if (!media) return;

	const bounds = media.getBoundingClientRect();
	if (!bounds.width || !bounds.height) return;

	const x = Math.max(-0.5, Math.min(0.5, (event.clientX - bounds.left) / bounds.width - 0.5));
	const y = Math.max(-0.5, Math.min(0.5, (event.clientY - bounds.top) / bounds.height - 0.5));
	media.style.setProperty("--project-tilt-x", `${(-y * 6).toFixed(2)}deg`);
	media.style.setProperty("--project-tilt-y", `${(x * 6).toFixed(2)}deg`);
	media.style.setProperty("--project-shift-x", `${(x * 4).toFixed(2)}px`);
	media.style.setProperty("--project-shift-y", `${(y * 4).toFixed(2)}px`);
	media.style.setProperty("--project-scale", "1.018");
}

function resetPointer(event: PointerEvent) {
	const media = event.currentTarget as HTMLElement | null;
	if (!media) return;
	media.style.removeProperty("--project-tilt-x");
	media.style.removeProperty("--project-tilt-y");
	media.style.removeProperty("--project-shift-x");
	media.style.removeProperty("--project-shift-y");
	media.style.removeProperty("--project-scale");
}

onMounted(() => {
	motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
	syncMotionPreference();
	motionQuery.addEventListener("change", syncMotionPreference);
});

onUnmounted(() => {
	motionQuery?.removeEventListener("change", syncMotionPreference);
});
</script>

<style scoped>
.project-cover { height: 100%; min-height: 160px; padding: 18px; display: flex; flex-direction: column; justify-content: center; gap: 12px; overflow: hidden; background: #eee9df; color: #31352e; }
.cover-overline { font: 8px var(--vp-font-family-mono); letter-spacing: .1em; opacity: .7; }
.cover-history { background: #e4e9e2; }
.cover-clipboard { background: #e4eaf4; }
.cover-reading { background: #f1e9d9; }
.cover-running { background: #e5ebe3; }
.mini-terminal { display: grid; gap: 6px; padding: 12px; background: #25312e; color: #dce5d5; border-radius: 7px; box-shadow: 0 8px 18px #1e292c25; font: 8px/1.5 var(--vp-font-family-mono); }
.mini-terminal code { background: transparent; padding: 0; color: #eff5e9; font-size: inherit; }
.terminal-dots { color: #c6a976; letter-spacing: 3px; font-size: 6px; }
.terminal-ok { color: #b5c4a3; }
.mini-clipboard { display: grid; gap: 8px; padding: 14px; border-radius: 8px; background: #ffffffdc; box-shadow: 0 8px 18px #263b5720; font-size: 9px; }
.clipboard-search { padding-bottom: 8px; border-bottom: 1px solid #d9dee7; opacity: .65; }
.clipboard-shortcut { text-align: right; opacity: .6; }
.concept-book { position: relative; display: grid; gap: 10px; padding: 16px 22px; background: #fffaf0; border-left: 5px solid #bdb295; transform: rotate(-3deg); box-shadow: 4px 6px 0 #ddd1bc; }
.concept-book > span { position: absolute; right: 10px; top: 0; font: 65px Georgia,serif; opacity: .15; }
.concept-book strong { font: 18px Georgia,serif; }
.concept-book i { display: block; height: 1px; background: #ded4c5; }
.concept-run { display: grid; gap: 6px; padding: 12px 4px; }
.concept-run > span { font: 8px var(--vp-font-family-mono); opacity: .65; }
.concept-run svg { width: 100%; height: 65px; fill: none; stroke: #65836a; stroke-width: 2; }
.concept-run strong { font-size: 14px; font-weight: 500; }

.profile-projects {
  width: 100%; max-width: 720px; margin: 36px auto 40px;
}
.profile-project-grid {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 30px 24px;
}
.profile-more-projects { margin: 42px 6px 0; }
.profile-more-projects h3 {
  position: relative; display: inline-block; margin: 0 0 24px; padding: 0 2px 7px;
  color: var(--vp-c-text-1); font-size: 18px; font-weight: 550; line-height: 1.5; letter-spacing: -.02em;
}
.profile-more-projects h3::after {
  content: ''; position: absolute; left: 0; right: -5px; bottom: 2px; height: 5px;
  border-bottom: 2px solid color-mix(in srgb, var(--vp-c-brand-1) 45%, transparent);
  border-radius: 0 0 50% 35%; transform: rotate(-2deg);
}
.profile-project-list { display: grid; gap: 15px; list-style: none; margin: 0; padding: 0; }
.profile-project-list > li { margin: 0; padding: 0; }
.profile-project-row {
  display: grid; grid-template-columns: 12px minmax(0, 1fr); gap: 12px; align-items: baseline;
  padding: 3px 0; color: var(--vp-c-text-1); text-decoration: none !important;
}
.profile-project-row::before {
  content: ''; width: 10px; height: 5px; align-self: start; margin-top: 10px;
  border-top: 1px solid var(--vp-c-text-3); border-radius: 50%; transform: rotate(-12deg);
}
.profile-project-row-copy { min-width: 0; font-size: 13px; line-height: 1.95; }
.profile-project-row-name { display: inline-flex; align-items: baseline; gap: 6px; margin-right: 12px; }
.profile-project-row strong {
  font-size: 14px; font-weight: 550; line-height: 1.65;
  text-decoration: underline; text-decoration-style: dashed;
  text-decoration-color: color-mix(in srgb, var(--vp-c-text-3) 50%, transparent); text-underline-offset: 5px;
}
.profile-project-row-description { color: var(--vp-c-text-2); }
.profile-project-row-arrow { font-size: 12px; color: var(--vp-c-brand-1); }
.profile-project-row:hover strong, .profile-project-row:hover .profile-project-row-arrow { color: var(--vp-c-brand-1); }
.profile-project-row:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 3px; }
.profile-project-card {
  --card-angle: -1deg;
  --card-paper: color-mix(in srgb, var(--vp-c-bg-soft) 92%, var(--vp-c-text-1) 8%);
  position: relative; isolation: isolate; display: flex; flex-direction: column; min-width: 0;
  padding: 13px 13px 8px; color: var(--vp-c-text-1); cursor: pointer; text-decoration: none !important;
  transform: rotate(var(--card-angle));
  filter: drop-shadow(1px 3px 1px color-mix(in srgb, var(--vp-c-text-1) 12%, transparent));
  transition: transform .22s ease, filter .22s ease;
}
.profile-project-card:nth-child(2n) { --card-angle: 1deg; }
.profile-project-card:nth-child(3n) { --card-angle: -.55deg; }
.profile-project-card::before {
  content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none;
  background: repeating-linear-gradient(0deg, transparent 0 3px, color-mix(in srgb, var(--vp-c-text-1) 2%, transparent) 3px 4px), var(--card-paper);
  clip-path: polygon(0 2px,7% 0,15% 3px,24% 1px,34% 3px,43% 0,54% 2px,66% 0,77% 3px,88% 1px,100% 3px,calc(100% - 2px) 17%,100% 31%,calc(100% - 3px) 46%,100% 61%,calc(100% - 2px) 79%,100% calc(100% - 3px),91% 100%,82% calc(100% - 4px),71% 100%,60% calc(100% - 2px),49% 100%,38% calc(100% - 4px),27% 100%,16% calc(100% - 2px),7% 100%,0 calc(100% - 3px),2px 83%,0 66%,3px 49%,0 34%,2px 18%);
}
.profile-project-card::after {
  content: ''; position: absolute; top: -9px; left: 34%; width: 66px; height: 23px; z-index: 2; pointer-events: none;
  background: color-mix(in srgb, var(--vp-c-brand-1) 18%, var(--vp-c-bg-soft));
  opacity: .88; transform: rotate(-7deg);
  clip-path: polygon(3% 0,98% 2%,96% 18%,100% 35%,97% 52%,100% 72%,97% 100%,0 97%,3% 78%,0 58%,3% 38%,0 17%);
}
.profile-project-card:nth-child(2n)::after { left: 49%; transform: rotate(8deg); }
.profile-project-card:hover { transform: translateY(-4px) rotate(0); filter: drop-shadow(2px 6px 2px color-mix(in srgb, var(--vp-c-text-1) 15%, transparent)); }
.profile-project-card:active { transform: translateY(-1px) rotate(0); }
.profile-project-card:focus-visible { outline: 2px solid var(--vp-c-brand-1); outline-offset: 5px; }
.profile-project-media {
  position: relative; overflow: hidden; background: var(--vp-c-bg);
  --project-tilt-x: 0deg; --project-tilt-y: 0deg; --project-shift-x: 0px; --project-shift-y: 0px; --project-scale: 1;
}
.profile-project-media > img {
  display: block; width: 100%; aspect-ratio: 16 / 9; margin: 0; border: 0; border-radius: 0; object-fit: cover; cursor: inherit;
  transform: perspective(900px) rotateX(var(--project-tilt-x)) rotateY(var(--project-tilt-y)) translate3d(var(--project-shift-x), var(--project-shift-y), 0) scale(var(--project-scale));
  transform-origin: center; transition: transform 240ms cubic-bezier(.22,1,.36,1);
}
.profile-project-copy { display: flex; flex: 1; flex-direction: column; padding: 16px 6px 17px; }
.profile-project-caption { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; color: var(--vp-c-text-2); font: 10px/1.4 var(--vp-font-family-mono); letter-spacing: .02em; }
.profile-project-number { flex: 0 0 auto; color: var(--vp-c-brand-1); font-variant-numeric: tabular-nums; border-right: 1px solid var(--vp-c-divider); padding-right: 8px; }
.profile-project-domain { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.profile-project-title { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
.profile-project-title strong { font-size: 15px; font-weight: 600; line-height: 1.4; overflow-wrap: anywhere; }
.profile-project-title span { flex: 0 0 auto; font-size: 16px; color: var(--vp-c-brand-1); }
.profile-project-card:hover .profile-project-title strong { color: var(--vp-c-brand-1); }
.profile-project-copy p { margin: 9px 0 0; font-size: 13px; line-height: 1.75; color: var(--vp-c-text-2); }
.profile-projects.is-motion-disabled .profile-project-media > img { transform: none; transition: none; }
.profile-projects.is-motion-disabled .profile-project-card { transition: none; }
@media (prefers-reduced-motion: reduce) { .profile-project-media > img { transform: none; transition: none; }.profile-project-card { transition: none; } }
@media (max-width: 640px) {
  .profile-projects { max-width: none; }
  .profile-project-grid { grid-template-columns: 1fr; gap: 29px; }
  .profile-more-projects { margin: 34px 4px 0; }
  .profile-more-projects h3 { margin-bottom: 20px; font-size: 17px; }
  .profile-project-row { gap: 10px; }
  .profile-project-row-description { display: block; margin-top: 4px; }
  .profile-project-card { --card-angle: -.5deg; }
  .profile-project-card:nth-child(2n) { --card-angle: .5deg; }
  .profile-project-copy { padding: 16px 8px 18px; }
}
</style>
