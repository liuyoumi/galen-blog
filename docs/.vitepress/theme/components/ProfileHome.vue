<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { withBase } from 'vitepress'
import PaperJourney from './PaperJourney.vue'
import ProfileProjects from './ProfileProjects.vue'
import ProfileTimeline from './ProfileTimeline.vue'
import { site } from '../../config/site'
import { juejinIcon } from '../../config/icons'

const props = withDefaults(defineProps<{ locale?: 'zh' | 'en' }>(), { locale: 'zh' })
const en = computed(() => props.locale === 'en')
const page = ref<HTMLElement>()
const reduced = ref(false)
const motion = computed(() => !reduced.value)
const active = ref('projects')
let media: MediaQueryList | undefined
let revealObserver: IntersectionObserver | undefined
let frame = 0
let hashFrame = 0

const copy = computed(() => en.value ? {
  hello: 'Hi, I’m Galen.', role: 'AI application engineer · Chengdu, China',
  headline: ['Little pieces of', 'work & life.'],
  intro: 'Live slowly. Keep a record.',
  detail: 'A meat-loving vegetarian, with room in the day for the treadmill, the pool, a book, and another game.',
  work: 'Explore my work', blog: 'Read the blog',
  nav: ['Work', 'About', 'Journey', 'Contact'],
  workTitle: 'Made, and imagined.', workIntro: 'Two open-source tools, plus a couple of ideas still on paper.',
  aboutTitle: 'A few pages of everyday life.',
  about: 'An AI application engineer in Chengdu, and a meat-loving vegetarian. Life is full of little contradictions; I like keeping a record of them.',
  aboutMore: 'No rush to get to the last page. There is always something new to notice.',
  photo: 'Just one more chapter', photoBody: 'Lately, I have been a little hooked on Yu Hua. Some pages fly by; others make me stop for a while.',
  sport: 'Moving, at my own pace', sportBody: 'Running, strictly on a treadmill. Staying in one place can still mean getting somewhere.',
  swimming: 'Learning to swim', swimmingBody: 'Still a beginner. Taking it one breath and one kick at a time.',
  gaming: 'One more round', gamingBody: 'A dedicated Eggy Party and Phasmophobia player. There is always room for another round.',
  journeyTitle: 'Still on the way.', journeyIntro: 'A few stops so far, with plenty of blank pages ahead.',
  future: 'The next chapter is still being written.',
  contactTitle: 'Say hello.', contactIntro: 'A question, a book recommendation, or a simple hello — I would love to hear from you.',
  motto: 'A little curiosity for tomorrow.', journal: 'Read blog',
  photography: 'READING', badminton: 'TREADMILL DIARY', top: 'Back to top',
} : {
  hello: 'Hi，我是 Galen。', role: 'AI 应用开发工程师 · 中国成都',
  headline: ['慢慢生活，', '认真记录。'],
  intro: '留一点好奇给明天。',
  detail: '一个爱吃肉的素食主义者。跑步机、泳池、书页和游戏，都是日常的一部分。',
  work: '看看我的作品', blog: '阅读博客',
  nav: ['作品', '关于', '经历', '联系'],
  workTitle: '做成的，和想做的。', workIntro: '两个已经开源的小工具，还有一些暂时写在纸上的想法。',
  aboutTitle: '日常，也值得翻几页。',
  about: '住在成都，做 AI 应用开发。也是一个爱吃肉的素食主义者。生活里有些小矛盾，记录下来还挺有意思。',
  aboutMore: '不急着翻到最后一页，日子里总有新的细节值得留意。',
  photo: '再看一章就好', photoBody: '最近读余华有点上头。有些页一口气翻过，有些句子，想停下来多看一会儿。',
  sport: '动一动，按自己的节奏', sportBody: '跑步，仅限跑步机上。虽然还在原地，今天也算往前跑了一点。',
  swimming: '游泳，还在学习中', swimmingBody: '从换气和打腿慢慢练起，先学会和水好好相处。',
  gaming: '再玩一局', gamingBody: '蛋仔派对和恐鬼症重度爱好者。玩得投入，也玩得开心。',
  journeyTitle: '一路走来，继续向前。', journeyIntro: '记录几个走过的路口，前面还有很多空白页。',
  future: '下一章，还在慢慢写。',
  contactTitle: '打个招呼吧。', contactIntro: '聊聊技术，推荐一本书，或者简单说声你好。很高兴在这里认识你。',
  motto: '留一点好奇给明天。', journal: '阅读博客',
  photography: 'READING / 阅读', badminton: 'TREADMILL / 跑步机', top: '回到顶部',
})
const sections = ['projects', 'about', 'journey', 'contact']
const socialLinks = computed(() => [
  { label: 'GitHub', url: site.github, icon: '' },
  { label: en.value ? 'Juejin' : '掘金', url: site.juejin, icon: juejinIcon },
  { label: en.value ? 'Douyin' : '抖音', url: site.douyin, icon: '' },
])

function readScroll() {
  frame = 0
  if (!page.value) return
  let current = sections[0]
  for (const id of sections) {
    const section = page.value.querySelector(`#${id}`)
    if (section && section.getBoundingClientRect().top < innerHeight * .45) current = id
  }
  active.value = current
}
function scroll() { if (!frame) frame = requestAnimationFrame(readScroll) }
function jumpTo(event: MouseEvent, id: string) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return
  event.preventDefault()
  const target = id === 'profile-top' ? page.value : page.value?.querySelector<HTMLElement>(`#${id}`)
  if (!target) return
  target.scrollIntoView({ behavior: motion.value ? 'smooth' : 'instant', block: 'start' })
  history.replaceState(history.state, '', `#${id}`)
}
function alignHash() {
  cancelAnimationFrame(hashFrame)
  // VitePress uses its blog offset in a capture-phase handler and schedules
  // hash scrolling for the next frame. Align this page's deeper sticky stack
  // after that initial pass, including direct links and browser Back/Forward.
  hashFrame = requestAnimationFrame(() => {
    hashFrame = requestAnimationFrame(() => {
      let id = ''
      try { id = decodeURIComponent(location.hash.slice(1)) } catch { return }
      const target = document.getElementById(id)
      if (target && page.value?.contains(target)) target.scrollIntoView({ behavior: 'instant', block: 'start' })
    })
  })
}
function mediaChanged() { reduced.value = media?.matches ?? false }
onMounted(() => {
  media = matchMedia('(prefers-reduced-motion: reduce)')
  mediaChanged()
  media.addEventListener('change', mediaChanged)
  readScroll()
  addEventListener('scroll', scroll, { passive: true })
  addEventListener('resize', scroll)
  addEventListener('hashchange', alignHash)
  addEventListener('popstate', alignHash)
  alignHash()
  // Content is visible in SSR and without JS. Motion adds only a small entrance.
  revealObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue
      if (motion.value) entry.target.classList.add('has-arrived')
      revealObserver?.unobserve(entry.target)
    }
  }, { threshold: .08 })
  page.value?.querySelectorAll('[data-reveal], .profile-project-card, .profile-timeline li').forEach(el => revealObserver?.observe(el))
})
onUnmounted(() => {
  cancelAnimationFrame(frame)
  cancelAnimationFrame(hashFrame)
  removeEventListener('scroll', scroll)
  removeEventListener('resize', scroll)
  removeEventListener('hashchange', alignHash)
  removeEventListener('popstate', alignHash)
  media?.removeEventListener('change', mediaChanged)
  revealObserver?.disconnect()
})
</script>


<template>
  <main ref="page" class="profile-home" :class="{ 'motion-off': !motion, 'is-english': en }" id="profile-top">
    <section class="home-hero" data-paper-section="intro" aria-labelledby="hero-title">
      <span id="关于我" class="anchor-alias"></span><span id="about-me" class="anchor-alias"></span>
      <div class="hero-copy">
        <div class="identity"><img :src="withBase(site.avatar)" alt="" width="42" height="42"><div><p>{{ copy.hello }}</p><span>{{ copy.role }}</span></div></div>
        <p class="hero-kicker">{{ en ? 'A SMALL COLLECTION OF WORK & LIFE' : '一些创造，一些生活，一直保持好奇。' }}</p>
        <h1 id="hero-title"><span class="title-paper">{{ copy.headline[0] }}</span><span class="title-paper hero-accent">{{ copy.headline[1] }}</span></h1>
        <p class="hero-intro">{{ copy.intro }}</p>
        <p class="hero-detail">{{ copy.detail }}</p>
        <div class="hero-links"><a class="primary-link vp-raw" href="#projects" @click="jumpTo($event, 'projects')">{{ copy.work }} <span aria-hidden="true">↘</span></a><a class="text-link" :href="withBase(en ? '/en/blog' : '/blog')">{{ copy.blog }} <span aria-hidden="true">↗</span></a></div>
        <span class="hero-pencil" aria-hidden="true"><svg viewBox="0 0 220 45"><path d="M5 28C54 7 113 38 199 10m-19-2 20 2-13 18"/></svg></span>
      </div>
      <div class="hero-art scene-anchor" data-paper-anchor aria-hidden="true">
        <div class="hero-paper-field"></div>
        <div class="hero-stamp"><span>GALEN</span><span>WORK / LIFE / NOTES</span></div>
        <span class="hero-tape"></span>
        <span class="hero-scribble">hello, world.</span>
      </div>
      <div class="hero-footnote"><span>CREATE. EXPLORE. REPEAT.</span><span>{{ copy.motto }}</span></div>
    </section>

    <nav class="section-nav" :aria-label="en ? 'On this page' : '页面章节'">
      <span class="chapter-caption" aria-hidden="true"><span class="chapter-cut">▰</span>{{ en ? 'SCENE SELECT' : '故事分镜' }}</span>
      <div class="section-links vp-raw"><a v-for="(id, i) in sections" :key="id" :href="`#${id}`" :aria-current="active === id ? 'location' : undefined" @click="jumpTo($event, id)"><span class="nav-number">0{{ i + 1 }}</span>{{ copy.nav[i] }}</a></div>
      <a class="journal-link" :href="withBase(en ? '/en/blog' : '/blog')">{{ copy.journal }} <span aria-hidden="true">↗</span></a>
    </nav>

    <section id="projects" class="home-section story-spread art-left projects-section" data-paper-section="code" aria-labelledby="projects-title">
      <div class="scene-visual" aria-hidden="true"><div class="scene-anchor" data-paper-anchor><PaperJourney inline-scene="code" :motion="motion" :locale="locale" /></div></div>
      <div class="spread-copy">
        <header class="section-heading" data-reveal><p class="eyebrow">01 / SELECTED WORK</p><h2 id="projects-title">{{ copy.workTitle }}</h2><p class="section-description">{{ copy.workIntro }}</p></header>
        <ProfileProjects :locale="locale" :motion="motion" />
      </div>
    </section>

    <section id="about" class="home-section story-spread art-right about-section" data-paper-section="photo" aria-labelledby="about-title">
      <span id="生活之外" class="anchor-alias"></span><span id="beyond-work" class="anchor-alias"></span>
      <div class="scene-visual" aria-hidden="true"><div class="scene-anchor" data-paper-anchor><PaperJourney inline-scene="photo" :motion="motion" :locale="locale" /></div></div>
      <div class="spread-copy">
        <header class="section-heading" data-reveal><p class="eyebrow">02 / OFF THE SCREEN</p><h2 id="about-title">{{ copy.aboutTitle }}</h2><p class="section-description">{{ copy.about }}</p></header>
        <article class="life-card reading-card" data-reveal>
          <div class="reading-print" aria-hidden="true"><span class="book-spine"></span><span class="book-lines"></span><span class="book-caption">ONE MORE CHAPTER.</span></div>
          <p class="eyebrow">{{ copy.photography }}</p><h3>{{ copy.photo }}</h3><p class="life-description">{{ copy.photoBody }}</p>
        </article>
        <p class="margin-note">{{ copy.aboutMore }}</p>
      </div>
    </section>

    <section id="play" class="home-section story-spread art-left play-section" data-paper-section="badminton" aria-labelledby="play-title">
      <div class="scene-visual" aria-hidden="true"><div class="scene-anchor" data-paper-anchor><PaperJourney inline-scene="badminton" :motion="motion" :locale="locale" /></div></div>
      <div class="spread-copy badminton-card">
        <p class="eyebrow">02 / A DIFFERENT RHYTHM</p>
        <h2 id="play-title">{{ copy.sport }}</h2>
        <p class="section-description">{{ copy.sportBody }}</p>
        <div class="life-extras">
          <article class="life-extra">
            <div class="life-sticker"><PaperJourney inline-scene="swim" vignette :motion="motion" :locale="locale" /></div>
            <h3>{{ copy.swimming }}</h3><p>{{ copy.swimmingBody }}</p>
          </article>
          <article class="life-extra">
            <div class="life-sticker"><PaperJourney inline-scene="game" vignette :motion="motion" :locale="locale" /></div>
            <h3>{{ copy.gaming }}</h3><p>{{ copy.gamingBody }}</p>
          </article>
        </div>
      </div>
    </section>

    <section id="journey" class="home-section story-spread art-right journey-section" data-paper-section="walk" aria-labelledby="journey-title">
      <span id="经历" class="anchor-alias"></span><span id="experience" class="anchor-alias"></span>
      <div class="scene-visual" aria-hidden="true"><div class="scene-anchor" data-paper-anchor><PaperJourney inline-scene="walk" :motion="motion" :locale="locale" /></div></div>
      <div class="spread-copy">
        <header class="section-heading" data-reveal><p class="eyebrow">03 / THE JOURNEY</p><h2 id="journey-title">{{ copy.journeyTitle }}</h2><p class="section-description">{{ copy.journeyIntro }}</p></header>
        <ProfileTimeline :locale="locale" /><p class="future-note">{{ copy.future }}</p>
      </div>
    </section>

    <section id="contact" class="home-section story-spread art-left contact-section" data-paper-section="chat" aria-labelledby="contact-title">
      <span id="联系我" class="anchor-alias"></span><span id="contact-me" class="anchor-alias"></span>
      <div class="scene-visual" aria-hidden="true"><div class="scene-anchor" data-paper-anchor><PaperJourney inline-scene="chat" :motion="motion" :locale="locale" /></div></div>
      <div class="spread-copy contact-letter">
        <span class="letter-corner" aria-hidden="true">↗</span>
        <p class="eyebrow">04 / SAY HELLO</p><h2 id="contact-title">{{ copy.contactTitle }}</h2><p class="contact-intro">{{ copy.contactIntro }}</p>
        <a class="email-link" :href="`mailto:${site.email}`">{{ site.email }} <span aria-hidden="true">↗</span></a>
        <div class="social-links"><a v-for="social in socialLinks" :key="social.url" :href="social.url" target="_blank" rel="noopener noreferrer"><span v-if="social.icon" class="social-icon" aria-hidden="true" v-html="social.icon"></span>{{ social.label }} <span aria-hidden="true">↗</span></a></div>
        <p class="letter-signature">See you around,<br><span>Galen</span></p>
      </div>
    </section>

    <footer class="home-footer"><span>Galen <span class="footer-dot">·</span> {{ copy.motto }}</span><a class="vp-raw" href="#profile-top" @click="jumpTo($event, 'profile-top')">{{ copy.top }} ↑</a></footer>
    <PaperJourney :motion="motion" :locale="locale" />
  </main>
</template>

<style scoped>
.social-icon { display: inline-block; width: 15px; height: 14px; margin: 0 6px 0 0 !important; vertical-align: -2px; opacity: 1 !important; }
.social-icon :deep(svg) { display: block; width: 100%; height: 100%; }
.reading-print { position: relative; height: 138px; margin-bottom: 24px; border: 1px solid var(--vp-c-divider); background: var(--paper-sheet); border-radius: 4px 16px 16px 4px; transform: rotate(-2deg); overflow: hidden; }
.book-spine { position: absolute; inset: 0 auto 0 18px; border-right: 1px solid var(--vp-c-divider); }
.book-lines { position: absolute; inset: 28px 36px 45px 48px; background: repeating-linear-gradient(transparent 0 14px, var(--vp-c-divider) 14px 15px); }
.book-caption { position: absolute; bottom: 15px; left: 48px; font: 9px var(--vp-font-family-mono); color: var(--vp-c-text-2); letter-spacing: .08em; }
.life-extras { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; margin-top: 28px; }
.life-extra { min-width: 0; padding-top: 12px; border-top: 1px solid var(--vp-c-divider); }
.life-sticker { height: 150px; max-width: 170px; margin: 0 auto 12px; }
.life-extra h3 { font-size: 14px; margin-bottom: 8px; }
.life-extra p { color: var(--vp-c-text-2); font-size: 12px; line-height: 1.9; }
@media (max-width: 380px) { .life-extras { grid-template-columns: 1fr; } }

.profile-home {
  --home-accent: var(--vp-c-brand-1);
  --paper-sheet: color-mix(in srgb, var(--vp-c-bg) 94%, var(--vp-c-brand-1) 6%);
  --paper-ink: var(--vp-c-text-1);
  --paper-button-edge: polygon(0 7%,8% 1%,19% 5%,32% 0,46% 4%,62% 1%,77% 5%,91% 0,100% 5%,98% 31%,100% 55%,98% 77%,100% 95%,87% 100%,72% 96%,57% 100%,43% 95%,29% 100%,15% 96%,1% 100%,2% 74%,0 50%,2% 27%);
  --scene-size: min(560px, calc((100vw - 176px) / 2));
  --chapter-padding: 230px;
  --chapter-scroll-offset: calc(max(144px, calc(50vh - var(--scene-size) / 2 + 15px)) - var(--chapter-padding));
  width: min(calc(var(--vp-layout-max-width) - 64px), calc(100% - 64px)); margin: 0 auto; color: var(--paper-ink); scroll-margin-top: var(--vp-nav-height);
}
.profile-home *, .profile-home *::before, .profile-home *::after { box-sizing: border-box; }
.profile-home a { color: inherit; text-decoration: none; }
.profile-home a:focus-visible, .profile-home button:focus-visible { outline: 2px solid var(--home-accent); outline-offset: 5px; }
.profile-home p, .profile-home h1, .profile-home h2, .profile-home h3 { margin: 0; }
.home-hero { position: relative; display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 80px; min-height: 770px; padding: 64px 0 124px; }
.hero-copy { position: relative; z-index: 1; padding-left: 14px; }
.identity { display: flex; align-items: center; gap: 13px; margin-bottom: 40px; }
.identity img { border-radius: 50%; object-fit: cover; }
.identity p { font-size: 14px; font-weight: 550; }.identity span { display: block; margin-top: 3px; color: var(--vp-c-text-2); font-size: 11px; }
.hero-kicker { color: var(--vp-c-text-2); font: 11px var(--vp-font-family-mono); letter-spacing: .05em; margin-bottom: 20px !important; }
.hero-copy h1 { font-size: clamp(48px, 5.7vw, 86px); line-height: 1.22; font-weight: 600; letter-spacing: -.065em; }
.title-paper { display: table; position: relative; padding: 1px 13px 8px; margin-left: -13px; transform: rotate(-1.3deg); background: var(--vp-c-bg-soft); clip-path: polygon(0 3%,16% 0,31% 2%,47% 0,67% 3%,85% 0,100% 2%,99% 97%,78% 100%,59% 97%,42% 100%,22% 97%,0 99%); }
.hero-accent { color: var(--home-accent); background: color-mix(in srgb, var(--home-accent) 11%, var(--vp-c-bg)); transform: rotate(1deg); margin-top: 5px; }
.hero-copy .hero-intro { margin-top: 30px; font-size: 18px; font-weight: 550; letter-spacing: -.02em; }
.hero-copy .hero-detail { margin-top: 13px; max-width: 420px; font-size: 14px; line-height: 1.95; color: var(--vp-c-text-2); }
.hero-links { display: flex; gap: 28px; align-items: center; margin-top: 28px; font-size: 13px; }
.hero-links a { position: relative; isolation: isolate; display: inline-flex; align-items: center; white-space: nowrap; transition: transform .2s ease; }
.hero-links a::before { content: ''; position: absolute; inset: 0; z-index: -1; pointer-events: none; clip-path: var(--paper-button-edge); background: var(--button-paper); transition: background-color .2s ease; }
.primary-link { --button-paper: var(--home-accent); gap: 27px; padding: 14px 22px; color: var(--vp-c-bg) !important; transform: rotate(-1.2deg); filter: drop-shadow(1px 3px 0 color-mix(in srgb, var(--home-accent) 18%, transparent)); }
.primary-link:hover { --button-paper: var(--vp-c-brand-2); transform: translateY(-2px) rotate(0); }
.text-link { --button-paper: color-mix(in srgb, var(--home-accent) 7%, var(--vp-c-bg-soft)); padding: 13px 18px; transform: rotate(1.2deg); filter: drop-shadow(1px 3px 0 color-mix(in srgb, var(--vp-c-divider) 50%, transparent)); }
.text-link:hover { color: var(--home-accent); transform: translateY(-2px) rotate(0); }
.hero-links a:active { transform: translateY(1px) rotate(0); }
.text-link span { margin-left: 6px; }
.hero-pencil { display: block; width: 185px; height: 40px; margin: 21px 0 -45px 145px; color: var(--home-accent); opacity: .55; }
.hero-pencil svg { width: 100%; fill: none; stroke: currentColor; stroke-width: 1.4; stroke-linecap: round; }
.hero-art { position: relative; justify-self: center; isolation: isolate; }
.scene-anchor { width: var(--scene-size); aspect-ratio: 1; margin-inline: auto; }
.hero-paper-field { position: absolute; inset: 9% 10% 9% 10%; transform: rotate(7deg); background: repeating-linear-gradient(0deg, transparent 0 29px, color-mix(in srgb, var(--home-accent) 7%, transparent) 29px 30px), var(--paper-sheet); clip-path: polygon(1% 0,13% 2%,25% 0,39% 1%,52% 0,66% 2%,78% 0,91% 2%,100% 0,98% 24%,100% 45%,98% 62%,100% 78%,99% 100%,85% 98%,74% 100%,60% 99%,47% 100%,34% 98%,20% 100%,0 99%,2% 80%,0 64%,2% 42%,0 24%); }
.hero-tape { position: absolute; top: 8%; left: 40%; width: 25%; height: 31px; background: color-mix(in srgb, var(--home-accent) 14%, var(--vp-c-bg)); opacity: .65; transform: rotate(-9deg); clip-path: polygon(2% 0,100% 3%,97% 22%,100% 40%,97% 60%,100% 80%,98% 100%,0 97%,3% 80%,0 60%,3% 40%,0 20%); }
.hero-stamp { position: absolute; right: 0; top: 5%; display: grid; gap: 5px; padding: 12px; border: 1px solid var(--home-accent); color: var(--home-accent); transform: rotate(10deg); opacity: .6; font: 9px var(--vp-font-family-mono); }
.hero-stamp span:first-child { letter-spacing: .2em; }.hero-stamp span:last-child { font-size: 7px; }
.hero-scribble { position: absolute; left: 0; bottom: 4%; color: var(--home-accent); font: italic 20px Georgia, serif; transform: rotate(-7deg); }
.hero-footnote { position: absolute; left: 0; right: 0; bottom: 27px; display: flex; justify-content: space-between; font-size: 10px; color: var(--vp-c-text-2); }.hero-footnote span:first-child { font-family: var(--vp-font-family-mono); letter-spacing: .1em; }
.section-nav { position: sticky; top: var(--vp-nav-height); z-index: 20; display: grid; grid-template-columns: 1fr auto 1fr; gap: 24px; align-items: center; min-height: 64px; padding-block: 8px; isolation: isolate; }
/* Extend the opaque navigation paper without widening its content or scroll area. */
.section-nav::before { content: ''; position: absolute; inset: 0; z-index: -1; background: var(--vp-c-bg); box-shadow: 0 0 0 100vmax var(--vp-c-bg); clip-path: inset(0 -100vmax); pointer-events: none; }
.chapter-caption { display: flex; align-items: center; gap: 10px; color: var(--vp-c-text-3); font: 10px var(--vp-font-family-mono); letter-spacing: .12em; }
.chapter-cut { width: 19px; height: 14px; font-size: 0; border: 1px solid currentColor; position: relative; transform: rotate(-7deg); }
.chapter-cut::before { content: ''; position: absolute; left: -1px; right: -1px; top: -5px; height: 4px; border: 1px solid currentColor; background: repeating-linear-gradient(115deg, currentColor 0 3px, transparent 3px 7px); transform: rotate(-10deg); transform-origin: left bottom; }
.section-links { display: flex; align-items: center; gap: 12px; }
.section-links a { display: flex; align-items: center; gap: 9px; font-size: 12px; color: var(--vp-c-text-2); padding: 8px 13px; white-space: nowrap; border-radius: 2px; transition: color .2s, background-color .2s; }
.section-links a[aria-current] { color: var(--home-accent); background: color-mix(in srgb, var(--home-accent) 9%, var(--vp-c-bg)); clip-path: polygon(0 3%,22% 0,45% 3%,69% 0,100% 3%,99% 97%,77% 100%,52% 97%,28% 100%,0 97%); }
.section-links a:focus-visible { clip-path: none; }
.section-links a:hover { color: var(--home-accent); background-color: var(--vp-c-bg-soft); }
.nav-number { display: grid; place-items: center; width: 25px; height: 27px; border-inline: 1px solid currentColor; background: repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 6px) left top / 100% 2px repeat-x, repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 6px) left bottom / 100% 2px repeat-x; font: 9px var(--vp-font-family-mono); opacity: .65; }
.journal-link { justify-self: end; display: flex; align-items: center; gap: 7px; font-size: 11px; color: var(--vp-c-text-2); padding: 10px 0 10px 10px; white-space: nowrap; }.journal-link:hover { color: var(--home-accent); }.journal-link span { font-size: 12px; }
.home-section { position: relative; padding: var(--chapter-padding) 0; scroll-margin-top: var(--chapter-scroll-offset); }
.home-section + .home-section::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: var(--vp-c-divider); transform: rotate(-.4deg); opacity: .7; }
.story-spread { display: grid; grid-template-columns: minmax(0, var(--scene-size)) minmax(0, 1fr); gap: 32px; min-height: 880px; align-items: start; }
.scene-visual { position: sticky; top: max(144px, calc(50vh - var(--scene-size) / 2 + 15px)); align-self: start; height: calc(var(--scene-size) + 76px); }
.art-left .scene-visual { grid-column: 1; grid-row: 1; }.art-left .spread-copy { grid-column: 2; grid-row: 1; }
.art-right { grid-template-columns: minmax(0, 1fr) minmax(0, var(--scene-size)); }
.art-right .scene-visual { grid-column: 2; grid-row: 1; }.art-right .spread-copy { grid-column: 1; grid-row: 1; }
.spread-copy { min-width: 0; position: relative; }
.profile-home .eyebrow { margin-bottom: 18px; color: var(--home-accent); font: 10px var(--vp-font-family-mono); letter-spacing: .09em; }
.profile-home h2 { font-size: clamp(28px, 3vw, 43px); letter-spacing: -.04em; line-height: 1.4; font-weight: 550; }
.section-heading { margin-bottom: 35px; }.section-description { max-width: 520px; font-size: 15px; line-height: 1.95; color: var(--vp-c-text-2); margin-top: 21px !important; }
.life-card { position: relative; background: var(--vp-c-bg-soft); border: 1px solid var(--vp-c-divider); padding: 18px 22px 27px; transform: rotate(-1.2deg); box-shadow: 2px 6px 0 color-mix(in srgb, var(--vp-c-divider) 28%, transparent); }
.landscape-print { position: relative; margin-bottom: 25px; padding-bottom: 11px; background: var(--vp-c-bg); border: 1px solid var(--vp-c-divider); }
.landscape-print svg { display: block; width: 100%; }.landscape-print .sky { fill: color-mix(in srgb, var(--home-accent) 5%, var(--vp-c-bg)); }.landscape-print circle { fill: color-mix(in srgb, var(--home-accent) 32%, var(--vp-c-bg)); }.mountain-back { fill: color-mix(in srgb, var(--home-accent) 12%, var(--vp-c-bg)); }.mountain-front { fill: color-mix(in srgb, var(--home-accent) 22%, var(--vp-c-bg)); }.landscape-line { stroke: var(--vp-c-bg); opacity: .7; }
.landscape-print > span { display: block; padding: 10px 12px 0; color: var(--vp-c-text-3); font: 8px var(--vp-font-family-mono); letter-spacing: .08em; }
.life-card .eyebrow { margin-bottom: 9px; }.life-card h3 { font-size: 25px; line-height: 1.5; font-weight: 550; letter-spacing: -.03em; }.life-description { margin-top: 12px !important; font-size: 14px; line-height: 1.9; color: var(--vp-c-text-2); }
.margin-note { margin: 32px 14px 0 !important; font-size: 13px; line-height: 1.9; color: var(--vp-c-text-2); }
.play-section .spread-copy { padding-top: 42px; }
.court-note { position: relative; margin-top: 42px; padding: 30px 30px 25px; background: var(--paper-sheet); transform: rotate(1.5deg); clip-path: polygon(0 1%,20% 0,37% 1%,58% 0,79% 2%,100% 0,99% 100%,80% 98%,59% 100%,39% 98%,18% 100%,0 99%); }
.court-sketch { width: 100%; max-height: 180px; stroke: var(--home-accent); stroke-width: 1; opacity: .5; }.court-flight { stroke-width: 2; stroke-dasharray: 6 6; }
.court-note p { font-size: 16px; margin-top: 15px; line-height: 1.6; }.court-note > span:last-child { font-size: 12px; color: var(--vp-c-text-2); line-height: 2; }.note-pin { position: absolute; width: 60px; height: 20px; background: color-mix(in srgb, var(--home-accent) 15%, var(--vp-c-bg)); top: 0; left: 38%; transform: rotate(-8deg); }
.future-note { font-size: 12px; line-height: 1.9; color: var(--vp-c-text-2); margin-top: 32px !important; }
.contact-section { min-height: 900px; }
.contact-letter { padding: 45px 34px 32px; background: var(--paper-sheet); border: 1px solid var(--vp-c-divider); box-shadow: 5px 6px 0 color-mix(in srgb, var(--vp-c-divider) 22%, transparent); }
.letter-corner { position: absolute; right: 23px; top: 17px; color: var(--home-accent); font: 24px Georgia,serif; opacity: .5; }.contact-section h2 { font-size: clamp(29px, 3vw, 43px); }
.contact-intro { font-size: 14px; line-height: 1.9; color: var(--vp-c-text-2); margin-top: 21px !important; }
.email-link { display: inline-flex; align-items: center; gap: 16px; font-size: clamp(22px, 2.6vw, 38px); letter-spacing: -.055em; margin-top: 28px; border-bottom: 1px solid var(--vp-c-divider); padding-bottom: 8px; white-space: nowrap; }.email-link:hover { color: var(--home-accent); }.email-link span { font-size: .8em; }
.social-links { display: flex; flex-wrap: wrap; gap: 17px 20px; margin-top: 25px; font-size: 12px; color: var(--vp-c-text-2); }.social-links a { position: relative; isolation: isolate; padding: 7px 10px; }.social-links a::before { content: ''; position: absolute; inset: 0; z-index: -1; background: var(--vp-c-bg); clip-path: var(--paper-button-edge); pointer-events: none; }.social-links a:nth-child(2n) { transform: rotate(1deg); }.social-links a:hover { color: var(--home-accent); }.social-links span { margin-left: 3px; opacity: .6; }
.letter-signature { font: italic 14px/1.8 Georgia,serif; margin-top: 38px !important; color: var(--vp-c-text-2); }.letter-signature span { font-family: "Niconne", cursive; font-size: 32px; color: var(--home-accent); }
.home-footer { display: flex; justify-content: space-between; gap: 20px; border-top: 1px solid var(--vp-c-divider); padding: 26px 0 35px; font-size: 10px; color: var(--vp-c-text-2); }.home-footer a:hover { color: var(--home-accent); }.footer-dot { padding: 0 7px; }.anchor-alias { position: absolute; top: 0; scroll-margin-top: var(--chapter-scroll-offset); }.home-hero .anchor-alias { scroll-margin-top: var(--vp-nav-height); }
.profile-home :deep(.has-arrived) { animation: home-arrive .7s cubic-bezier(.2,.7,.2,1) both; }@keyframes home-arrive { from { opacity: .35; translate: 0 20px; } to { opacity: 1; translate: 0 0; } }
.motion-off :deep(*), .motion-off :deep(*::before), .motion-off :deep(*::after) { animation: none !important; transition: none !important; }
.is-english .hero-copy h1 { font-size: clamp(40px, 5vw, 72px); }
/* Short text and narrow portraits compose as one centered spread. */
@media (min-width: 1100px) {
  .home-hero, .journey-section { grid-template-columns: minmax(0, 520px) var(--scene-size); justify-content: center; column-gap: 40px; }
  .home-hero .hero-copy { padding-left: 0; }
}
@media (max-width: 1099px) and (min-width: 860px) {
  .profile-home { width: calc(100% - 64px); --scene-size: calc((100vw - 104px) / 2); --chapter-padding: 180px; }.home-hero { gap: 40px; }.story-spread { gap: 24px; }.home-hero { min-height: 680px; padding-top: 44px; padding-bottom: 110px; }.hero-copy { padding-left: 0; }.hero-copy h1 { font-size: 51px; }.is-english .hero-copy h1 { font-size: 43px; }.hero-kicker { font-size: 10px; }.hero-copy .hero-intro { font-size: 16px; }.story-spread { min-height: 760px; }.profile-home h2 { font-size: 30px; }.section-description { font-size: 14px; }.contact-letter { padding: 36px 23px 28px; }.email-link { font-size: 25px; gap: 10px; }.hero-stamp { right: -5px; font-size: 8px; }
}
@media (max-width: 859px) {
  .profile-home { width: calc(100% - 40px); --scene-size: min(440px, calc(100vw - 40px)); }.home-hero { display: flex; flex-direction: column; align-items: stretch; padding: 34px 0 52px; gap: 0; min-height: 0; }.hero-copy { padding-left: 7px; }.identity { margin-bottom: 28px; }.hero-kicker { font-size: 9px; margin-bottom: 17px !important; }.hero-copy h1 { font-size: clamp(47px, 10vw, 72px); }.is-english .hero-copy h1 { font-size: clamp(40px, 8.7vw, 62px); }.hero-copy .hero-intro { margin-top: 25px; font-size: 16px; }.hero-copy .hero-detail { max-width: 430px; font-size: 13px; }.hero-links { margin-top: 22px; gap: 18px; }.hero-links .text-link { padding-inline: 10px; }.hero-pencil { display: none; }.hero-art { margin: 28px auto 85px; flex-shrink: 0; }.hero-stamp { right: 6px; }.hero-scribble { left: 8px; font-size: 17px; }.hero-footnote { bottom: 19px; font-size: 8px; gap: 18px; }.hero-footnote span:last-child { text-align: right; }.hero-footnote span:first-child { letter-spacing: 0; }.hero-tape { height: 24px; }
  .section-nav { min-height: 53px; grid-template-columns: minmax(0, 1fr) auto; gap: 12px; }.chapter-caption { display: none; }.section-links { gap: 6px; justify-content: space-between; }.section-links a { font-size: 11px; padding: 8px 7px; }.nav-number { display: none; }.journal-link { font-size: 10px; gap: 5px; }
  .story-spread { display: flex; flex-direction: column; min-height: 0; gap: 0; }.story-spread > .spread-copy { width: 100%; }.scene-visual { display: block; position: relative; top: auto; order: 1; width: 100%; height: auto; margin-top: 28px; }.scene-visual .scene-anchor { width: min(100%, 440px); height: auto; margin-inline: auto; }.home-section { padding: 66px 0; scroll-margin-top: 132px; }.anchor-alias { scroll-margin-top: 132px; }.profile-home h2 { font-size: 28px; }.section-heading { margin-bottom: 27px; }.section-description { font-size: 14px; margin-top: 18px !important; max-width: 600px; }.profile-home .eyebrow { font-size: 9px; margin-bottom: 15px; }.life-card { max-width: 560px; padding: 14px 17px 22px; margin: 0 auto; }.life-card h3 { font-size: 23px; }.landscape-print { margin-bottom: 19px; }.margin-note { margin-top: 26px !important; }.play-section .spread-copy { padding-top: 0; }.court-note { padding: 24px 22px; margin-top: 30px; }.contact-letter { padding: 32px 23px 27px; }.contact-section h2 { font-size: 28px; }.email-link { font-size: clamp(21px, 6.5vw, 34px); gap: 12px; }.home-footer { font-size: 9px; }.footer-dot { padding: 0 3px; }
}
@media (max-width: 380px) { .section-links { gap: 2px; }.section-links a { padding-inline: 6px; }.journal-link { font-size: 9px; white-space: nowrap; }.hero-copy h1 { font-size: 43px; }.is-english .hero-copy h1 { font-size: 37px; }.hero-kicker { font-size: 8px; }.hero-copy .hero-intro { font-size: 14px; }.primary-link { padding: 12px 14px; gap: 16px; }.hero-links { gap: 10px; font-size: 12px; }.hero-links .text-link { padding-inline: 8px; }.hero-links a { white-space: nowrap; }.hero-stamp { font-size: 7px; }.hero-stamp span:last-child { font-size: 6px; }.contact-letter { padding-inline: 16px; }.email-link { font-size: 21px; } }
@media (prefers-reduced-motion: reduce) { .profile-home :deep(*), .profile-home :deep(*::before), .profile-home :deep(*::after) { animation: none !important; transition: none !important; } }
</style>
<style>
.portfolio-page .VPLocalNav { display: none; }
@media (max-width: 959px) { .portfolio-page .VPNav { position: sticky; top: 0; } }
</style>
