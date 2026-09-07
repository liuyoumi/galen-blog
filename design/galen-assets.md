# Galen 的纸片生活插画

使用 Codex 内置 imagegen 生成。素材：`docs/public/illustrations/galen-life-atlas.png`。
这是一位虚构的纸片角色，不是 Galen 的写实肖像。真实头像来自用户提供的 GitHub 头像。

4 × 4 图集按行排列，每个场景两个姿态：打招呼、写代码、阅读、跑步机跑步、学游泳、散步、喝咖啡聊天、玩游戏。
运行时复用原有纸片分解和滚动动画；历史内部标识 `photo` 对应阅读，`badminton` 对应跑步机，并不表示当前的兴趣。
作品封面是 HTML/CSS 绘制的示意插画，不是软件截图；两张构想卡片没有外链。

## 生成提示词

```text
Use case: illustration-story. Asset type: animation sprite atlas for Galen's personal blog, in an existing handmade torn-paper collage website. Create ONE square 2048x2048 or larger image with a STRICT uniform 4-column by 4-row grid, exactly sixteen separate cutout vignettes, one centered within each equal cell. NO visible grid lines. Background must be perfectly flat solid pure magenta #ff00ff for runtime chroma key. Each subject has a warm ivory torn-paper edge, subtle watercolor/gouache grain, elegant editorial illustration, warm cream with restrained cobalt/olive accents. Keep the same friendly young adult character in every cell: short black hair, soft rounded face, simple casual clothes. Not a portrait of a real person. Complete subjects and their props fit comfortably inside each cell with 12% empty magenta margin; never cross cell boundaries. Body proportions, head, illustration style and scale are consistent across paired frames. No text, letters, watermarks, photographs, camera gear or badminton props.
Reading order (row by row):
Row 1: cell 1 standing waving hello with one hand lower; cell 2 same full-body hello pose with hand higher; cell 3 seated working at a compact desk and open laptop, hands typing; cell 4 same desk and character glancing up with a small smile.
Row 2: cell 5 sitting in an armchair reading an open book; cell 6 same character turning a page; cell 7 jogging on a clearly recognizable compact TREADMILL with left foot forward; cell 8 same treadmill jogging with right foot forward.
Row 3: cell 9 learning to swim, holding a kickboard in a small isolated illustrated patch of blue pool water, head above water and goggles; cell 10 same beginner swimming scene gently kicking, water stays inside vignette; cell 11 full-body casual walking with a small shoulder bag, left foot forward; cell 12 same walking right foot forward.
Row 4: cell 13 seated holding a coffee cup with small blank speech bubble; cell 14 same pose lifting cup slightly; cell 15 relaxed seated playing a mobile game with phone in both hands; cell 16 same gamer holding a game controller with a delighted expression.
The sixteen cells are production-ready sprite art, NOT a moodboard or a webpage mockup. Keep ALL backgrounds magenta including between cutout subjects.
```
