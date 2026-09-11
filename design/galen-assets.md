# Galen 的纸片生活插画

使用 Codex 内置 imagegen 生成。当前素材：`docs/public/illustrations/galen-hd/`，8 张独立的 1536 × 1024 双姿态场景图。
生成提示词见 [galen-hd-prompts.md](./galen-hd-prompts.md)。各大场景主体有效高度约 900–980 像素，替代原 16 格图集中约 300 像素的主体。
运行时根据素材有效尺寸确定中间画布分辨率，避免再次压缩到固定 512 像素；动画仅保留两个实际姿态，循环通过帧索引复用。
已确认的人物设计稿：`design/galen-character-approved.png`（2026-09-07）。
成熟修长的成人比例、深棕色覆额刘海、雾蓝 T 恤、浅灰直筒休闲裤、米白运动鞋。
保留旧版 `galen-life-atlas.png` 和 `galen-life-atlas-v2.png` 方便回退；页面只引用独立高清素材。
素材使用品红背景，由现有 `keyMagenta` 在浏览器中去除。每图两个姿态，高清版跑步和散步均朝右，无需翻转。
这是一位虚构的纸片角色，不是 Galen 的写实肖像。真实头像来自用户提供的 GitHub 头像。

4 × 4 图集按行排列，每个场景两个姿态：打招呼、写代码、阅读、跑步机跑步、学游泳、散步、喝咖啡聊天、玩游戏。
运行时复用原有纸片分解和滚动动画；历史内部标识 `photo` 对应阅读，`badminton` 对应跑步机，并不表示当前的兴趣。
作品封面是 HTML/CSS 绘制的示意插画，不是软件截图；两张构想卡片没有外链。

## 初版生成提示词（历史记录）

```text
Use case: illustration-story. Asset type: animation sprite atlas for Galen's personal blog, in an existing handmade torn-paper collage website. Create ONE square 2048x2048 or larger image with a STRICT uniform 4-column by 4-row grid, exactly sixteen separate cutout vignettes, one centered within each equal cell. NO visible grid lines. Background must be perfectly flat solid pure magenta #ff00ff for runtime chroma key. Each subject has a warm ivory torn-paper edge, subtle watercolor/gouache grain, elegant editorial illustration, warm cream with restrained cobalt/olive accents. Keep the same friendly young adult character in every cell: short black hair, soft rounded face, simple casual clothes. Not a portrait of a real person. Complete subjects and their props fit comfortably inside each cell with 12% empty magenta margin; never cross cell boundaries. Body proportions, head, illustration style and scale are consistent across paired frames. No text, letters, watermarks, photographs, camera gear or badminton props.
Reading order (row by row):
Row 1: cell 1 standing waving hello with one hand lower; cell 2 same full-body hello pose with hand higher; cell 3 seated working at a compact desk and open laptop, hands typing; cell 4 same desk and character glancing up with a small smile.
Row 2: cell 5 sitting in an armchair reading an open book; cell 6 same character turning a page; cell 7 jogging on a clearly recognizable compact TREADMILL with left foot forward; cell 8 same treadmill jogging with right foot forward.
Row 3: cell 9 learning to swim, holding a kickboard in a small isolated illustrated patch of blue pool water, head above water and goggles; cell 10 same beginner swimming scene gently kicking, water stays inside vignette; cell 11 full-body casual walking with a small shoulder bag, left foot forward; cell 12 same walking right foot forward.
Row 4: cell 13 seated holding a coffee cup with small blank speech bubble; cell 14 same pose lifting cup slightly; cell 15 relaxed seated playing a mobile game with phone in both hands; cell 16 same gamer holding a game controller with a delighted expression.
The sixteen cells are production-ready sprite art, NOT a moodboard or a webpage mockup. Keep ALL backgrounds magenta including between cutout subjects.
```

## v2 场景生成提示词

参考输入为已确认的人物设计稿。首次生成的背景不含 alpha，后续改用品红底适配既有去色逻辑。

```text
Use case: identity-preserve / animation sprite atlas.
Input image 1 is the APPROVED CHARACTER REFERENCE. Preserve its same adult face identity, dark brown voluminous eyebrow-length forehead-covering fringe, realistic adult small head, tall slender eight-head proportions and very long legs, refined calm masculine face. Use the SAME fine hand-painted gouache/watercolor editorial art style and consistent clothes: misty blue crew-neck relaxed T-shirt, light cool gray straight-leg casual pants, ivory lace-up sneakers. Not cute, chibi, teenage, big-eyed, cartoon, or shortened limbs.
Create ONE square 2048x2048 or larger PRODUCTION SPRITE ATLAS with STRICT UNIFORM 4 COLUMNS x 4 ROWS (16 equal square cells, each exactly 25% width and height). NO grid lines, text, labels, numbers. Genuine TRANSPARENT BACKGROUND, not white paper rectangle. Each isolated character and props completely inside its own cell, centered, 10% empty margin on all four sides; NO overlap/crossing cell boundaries. Each pair same scale and same prop layout, same face and clothing. Paper texture lives only within the figure and props; no large background paper patches.
EXACT row-major contents:
ROW1: cell1 front-facing full-body standing, one hand gently waving at shoulder height and other hand in pocket, matching approved standing design closely; cell2 same front full-body standing wave with hand a little higher; cell3 seated side-three-quarter view working at compact desk and open laptop, typing; cell4 exact same desk scene, glancing up gently.
ROW2: cell5 seated comfortably in compact pale armchair reading open book; cell6 identical armchair and posture turning one page; cell7 long-legged character jogging on recognisable treadmill with deck, handrails and console, left foot forward; cell8 same treadmill jogging right foot forward. Treadmill fully contained.
ROW3: cell9 beginner swimming, goggles, bare shoulders and arms, holding blue kickboard in small isolated water patch, head above water, same hairstyle and adult face; cell10 matching beginner swim with small kick splash, water stays inside cell; cell11 full-body walking wearing approved blue tee/gray trousers/ivory sneakers plus small navy shoulder bag, left foot forward; cell12 same walking right foot forward.
ROW4: cell13 seated on simple stool holding coffee mug at chest height, same casual clothes; cell14 same pose slightly lifting mug; cell15 seated on simple stool playing mobile game holding phone with both hands; cell16 same posture holding game controller, restrained pleased adult expression.
The overall background and all gutters must be truly transparent alpha. Preserve clear faces and clean silhouette for display on white and charcoal web backgrounds. Full bodies/feet and all scene props visible. Keep all 16 vignettes entirely within their respective equal square cells. No large portrait study, no sheet title, no new accessories other than specified scene props.
```

## v2 修订提示词

参考输入为首次生成的 16 格场景图。模型未完全遵守朝向及等分约束，最终通过上文的裁切和显示适配处理。

```text
Edit input image 1, the 16-frame character sprite atlas. Keep the same 16 scenes, exact adult character face, mature tall slender long-leg proportions, hairstyle, blue T-shirt/gray trousers/ivory sneakers, poses and detailed watercolor painting style. CRITICAL CHANGES:
1. Replace ALL gray-and-white checkerboard background with PERFECTLY FLAT SOLID PURE MAGENTA #FF00FF, including gaps inside limbs, beneath chairs and between props. NO checkerboard, no transparent simulation, no gradients, no white backdrop. Magenta is a technical chroma key removed in the website. Preserve fine natural edges of figure, hair, clothing and props. No magenta reflected tint.
2. Row2 column4 (second treadmill frame) must face RIGHT, exactly as row2 column3: console at RIGHT, same treadmill fixed position. Change only leg gait phase for second frame, not overall orientation. Both treadmill frames same scale and treadmill silhouette.
3. Row3 column4 (second walking frame) must also face RIGHT just like row3 column3, alternating leg gait but never turning body around.
4. Make all 16 cells strictly equal 4x4 square grid. Keep every entire vignette WITHIN its quarter-width and quarter-height cell, with at least 8% empty magenta margin on all sides. Slightly scale down figures if necessary. The full head, waving hand, shoes, chairs, desk, treadmill, water must all fit completely inside their respective cells. No drawn grid or labels.
Keep all other details unchanged. Row1 wave,wave,desk,desk. Row2 reading,reading,treadmill,treadmill. Row3 swim,swim,walk,walk. Row4 coffee,coffee,phonegaming,controllergaming.
Output ONE high-resolution square production atlas. Solid #ff00ff background is essential.
```
