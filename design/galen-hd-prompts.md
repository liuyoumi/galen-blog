# Galen 高清场景素材

由 Codex 内置 imagegen 逐场景生成，以 `design/galen-character-approved.png` 为唯一人物及风格参考。2026-09-07。
每个文件实际尺寸均为 1536 × 1024，包含两个姿态。使用既有品红去色逻辑，保存原始像素。
页面保留原有动画序列，通过索引复用两个实际姿态，不再为重复帧复制高清画布。
游泳的分界为 x=750，其余均为 x=768；人物与道具按有效边界统一缩放。

## intro

文件：`docs/public/illustrations/galen-hd/intro.png`。

```text
Use case: identity-preserve, high-resolution website animation artwork.
Input image 1 is the approved CHARACTER AND STYLE REFERENCE. Preserve this same refined adult face, natural narrow eyes, dark brown voluminous eyebrow-length forehead-covering fringe, mature small head, tall slim eight-head proportions and long legs. Same blue relaxed crew-neck T-shirt, light gray straight-leg casual pants, ivory lace-up sneakers unless scene specifies swimming. Refined hand-painted editorial illustration, delicately textured clothing, CRISP precise face/eyes/hair/hands/sneakers, sharp clean edges, NO defocus, soft blur, sepia filter or blurry brushwork. Do not change to chibi or cartoon.
Output a LANDSCAPE 1536x1024 image containing ONLY TWO large full scene poses SIDE BY SIDE in equal left and right halves. Each pose fits entirely within its half. Occupy 85-90% of the image height and as much width as natural proportions permit; preserve about 5% outer margin. Full head, shoes and all props visible; no cutoffs. Both poses same scale and SAME fixed props orientation, not mirrored. The background must be perfectly flat solid pure magenta #FF00FF (for existing website chroma key), including negative spaces under furniture/inside arms, with no reflected magenta tint, gradients, checkerboard, shadow backdrop, ground plane, white rectangle, text, watermark or labels.

SCENE: front-facing full-body friendly greeting. Match the approved standing figure closely. LEFT pose: left hand in pants pocket, right hand raised near shoulder gently waving with palm forward. RIGHT pose: exact same stance, face, body and feet at same baseline; right hand slightly higher, still near the head, a subtle variation only. Two full adult figures in separate halves, not a portrait detail or collage.
```

## code

文件：`docs/public/illustrations/galen-hd/code.png`。

```text
Use case: identity-preserve, high-resolution website animation artwork.
Input image 1 is the approved CHARACTER AND STYLE REFERENCE. Preserve this same refined adult face, natural narrow eyes, dark brown voluminous eyebrow-length forehead-covering fringe, mature small head, tall slim eight-head proportions and long legs. Same blue relaxed crew-neck T-shirt, light gray straight-leg casual pants, ivory lace-up sneakers unless scene specifies swimming. Refined hand-painted editorial illustration, delicately textured clothing, CRISP precise face/eyes/hair/hands/sneakers, sharp clean edges, NO defocus, soft blur, sepia filter or blurry brushwork. Do not change to chibi or cartoon.
Output a LANDSCAPE 1536x1024 image containing ONLY TWO large full scene poses SIDE BY SIDE in equal left and right halves. Each pose fits entirely within its half. Occupy 85-90% of the image height and as much width as natural proportions permit; preserve about 5% outer margin. Full head, shoes and all props visible; no cutoffs. Both poses same scale and SAME fixed props orientation, not mirrored. The background must be perfectly flat solid pure magenta #FF00FF (for existing website chroma key), including negative spaces under furniture/inside arms, with no reflected magenta tint, gradients, checkerboard, shadow backdrop, ground plane, white rectangle, text, watermark or labels.
SCENE: seated three-quarter side view working at a compact desk with an open laptop, fully visible chair legs, long legs and sneakers. Character faces RIGHT, laptop on RIGHT and chair on LEFT in BOTH halves; same desk and chair design and positions in both. Left half typing, right half slight glance upward with hands still at keyboard. Neutral pale gray compact desk/chair, refined adult natural expression.
```

## photo

文件：`docs/public/illustrations/galen-hd/photo.png`。

```text
Use case: identity-preserve, high-resolution website animation artwork.
Input image 1 is the approved CHARACTER AND STYLE REFERENCE. Preserve this same refined adult face, natural narrow eyes, dark brown voluminous eyebrow-length forehead-covering fringe, mature small head, tall slim eight-head proportions and long legs. Same blue relaxed crew-neck T-shirt, light gray straight-leg casual pants, ivory lace-up sneakers unless scene specifies swimming. Refined hand-painted editorial illustration, delicately textured clothing, CRISP precise face/eyes/hair/hands/sneakers, sharp clean edges, NO defocus, soft blur, sepia filter or blurry brushwork. Do not change to chibi or cartoon.
Output a LANDSCAPE 1536x1024 image containing ONLY TWO large full scene poses SIDE BY SIDE in equal left and right halves. Each pose fits entirely within its half. Occupy 85-90% of the image height and as much width as natural proportions permit; preserve about 5% outer margin. Full head, shoes and all props visible; no cutoffs. Both poses same scale and SAME fixed props orientation, not mirrored. The background must be perfectly flat solid pure magenta #FF00FF (for existing website chroma key), including negative spaces under furniture/inside arms, with no reflected magenta tint, gradients, checkerboard, shadow backdrop, ground plane, white rectangle, text, watermark or labels.
SCENE: seated comfortably in a compact pale oatmeal armchair reading an open dark-blue book, elegant relaxed long-legged pose with one leg crossed, entire chair and both sneakers fully visible. LEFT half looking down reading, RIGHT half same posture turning one page. Same face, body pose, legs and chair position across the pair. Detailed visible eyes, hair strands, book pages.
```

## badminton

文件：`docs/public/illustrations/galen-hd/badminton.png`。

```text
Use case: identity-preserve, high-resolution website animation artwork.
Input image 1 is the approved CHARACTER AND STYLE REFERENCE. Preserve this same refined adult face, natural narrow eyes, dark brown voluminous eyebrow-length forehead-covering fringe, mature small head, tall slim eight-head proportions and long legs. Same blue relaxed crew-neck T-shirt, light gray straight-leg casual pants, ivory lace-up sneakers unless scene specifies swimming. Refined hand-painted editorial illustration, delicately textured clothing, CRISP precise face/eyes/hair/hands/sneakers, sharp clean edges, NO defocus, soft blur, sepia filter or blurry brushwork. Do not change to chibi or cartoon.
Output a LANDSCAPE 1536x1024 image containing ONLY TWO large full scene poses SIDE BY SIDE in equal left and right halves. Each pose fits entirely within its half. Occupy 85-90% of the image height and as much width as natural proportions permit; preserve about 5% outer margin. Full head, shoes and all props visible; no cutoffs. Both poses same scale and SAME fixed props orientation, not mirrored. The background must be perfectly flat solid pure magenta #FF00FF (for existing website chroma key), including negative spaces under furniture/inside arms, with no reflected magenta tint, gradients, checkerboard, shadow backdrop, ground plane, white rectangle, text, watermark or labels.
SCENE: adult long-legged character jogging on a compact treadmill with dark gray deck, handrails and console. BOTH halves FACE RIGHT with the treadmill console on the RIGHT and rear end on LEFT. Exact same treadmill silhouette/size/position in both halves. Character upright with elbows bent. Left pose has left leg forward, right pose has right leg forward. Frame differences only in arm/leg gait, never mirror treadmill or turn character. Full treadmill and both feet fit inside each half with empty gap between halves.
```

## swim

文件：`docs/public/illustrations/galen-hd/swim.png`。

```text
Use case: identity-preserve, high-resolution website animation artwork.
Input image 1 is the approved CHARACTER AND STYLE REFERENCE. Preserve this same refined adult face, natural narrow eyes, dark brown voluminous eyebrow-length forehead-covering fringe, mature small head, tall slim eight-head proportions and long legs. Same blue relaxed crew-neck T-shirt, light gray straight-leg casual pants, ivory lace-up sneakers unless scene specifies swimming. Refined hand-painted editorial illustration, delicately textured clothing, CRISP precise face/eyes/hair/hands/sneakers, sharp clean edges, NO defocus, soft blur, sepia filter or blurry brushwork. Do not change to chibi or cartoon.
Output a LANDSCAPE 1536x1024 image containing ONLY TWO large full scene poses SIDE BY SIDE in equal left and right halves. Each pose fits entirely within its half. Occupy 85-90% of the image height and as much width as natural proportions permit; preserve about 5% outer margin. Full head, shoes and all props visible; no cutoffs. Both poses same scale and SAME fixed props orientation, not mirrored. The background must be perfectly flat solid pure magenta #FF00FF (for existing website chroma key), including negative spaces under furniture/inside arms, with no reflected magenta tint, gradients, checkerboard, shadow backdrop, ground plane, white rectangle, text, watermark or labels.
SCENE: beginner learning to swim, goggles over eyes, bare shoulders/arms, same adult face and dark brown fringe slightly damp, holding a blue kickboard with both hands in a small isolated patch of blue pool water. Two matching three-quarter front views: left gently floating, right slight kick splash. Same pose and scale, water fully isolated with crisp splash edges, no pool background, no broad rectangle. This horizontally wide vignette should occupy most of each half's width; no need to stretch its height unnaturally.
```

## walk

文件：`docs/public/illustrations/galen-hd/walk.png`。

```text
Use case: identity-preserve, high-resolution website animation artwork.
Input image 1 is the approved CHARACTER AND STYLE REFERENCE. Preserve this same refined adult face, natural narrow eyes, dark brown voluminous eyebrow-length forehead-covering fringe, mature small head, tall slim eight-head proportions and long legs. Same blue relaxed crew-neck T-shirt, light gray straight-leg casual pants, ivory lace-up sneakers unless scene specifies swimming. Refined hand-painted editorial illustration, delicately textured clothing, CRISP precise face/eyes/hair/hands/sneakers, sharp clean edges, NO defocus, soft blur, sepia filter or blurry brushwork. Do not change to chibi or cartoon.
Output a LANDSCAPE 1536x1024 image containing ONLY TWO large full scene poses SIDE BY SIDE in equal left and right halves. Each pose fits entirely within its half. Occupy 85-90% of the image height and as much width as natural proportions permit; preserve about 5% outer margin. Full head, shoes and all props visible; no cutoffs. Both poses same scale and SAME fixed props orientation, not mirrored. The background must be perfectly flat solid pure magenta #FF00FF (for existing website chroma key), including negative spaces under furniture/inside arms, with no reflected magenta tint, gradients, checkerboard, shadow backdrop, ground plane, white rectangle, text, watermark or labels.
SCENE: full-body relaxed walking, wearing navy small shoulder bag on left shoulder, hand holding strap. BOTH figures have three-quarter side view facing RIGHT, nose points RIGHT. Left half left foot forward and right foot behind; right half right foot forward and left foot behind, keep shoulders and bag consistent. Same level baseline, full body and shoes. Natural subtle gait, not a reversed/mirrored duplicate.
```

## chat

文件：`docs/public/illustrations/galen-hd/chat.png`。

```text
Use case: identity-preserve, high-resolution website animation artwork.
Input image 1 is the approved CHARACTER AND STYLE REFERENCE. Preserve this same refined adult face, natural narrow eyes, dark brown voluminous eyebrow-length forehead-covering fringe, mature small head, tall slim eight-head proportions and long legs. Same blue relaxed crew-neck T-shirt, light gray straight-leg casual pants, ivory lace-up sneakers unless scene specifies swimming. Refined hand-painted editorial illustration, delicately textured clothing, CRISP precise face/eyes/hair/hands/sneakers, sharp clean edges, NO defocus, soft blur, sepia filter or blurry brushwork. Do not change to chibi or cartoon.
Output a LANDSCAPE 1536x1024 image containing ONLY TWO large full scene poses SIDE BY SIDE in equal left and right halves. Each pose fits entirely within its half. Occupy 85-90% of the image height and as much width as natural proportions permit; preserve about 5% outer margin. Full head, shoes and all props visible; no cutoffs. Both poses same scale and SAME fixed props orientation, not mirrored. The background must be perfectly flat solid pure magenta #FF00FF (for existing website chroma key), including negative spaces under furniture/inside arms, with no reflected magenta tint, gradients, checkerboard, shadow backdrop, ground plane, white rectangle, text, watermark or labels.
SCENE: seated front-facing on a simple wooden stool, long legs in relaxed pose, holding a plain ivory coffee mug, approved casual clothes. Left half holding mug at chest height and free hand on knee; right half same posture lifting mug near lips. Same stool scale, legs and head position, both shoes and stool feet visible. No speech bubble or text.
```

## game

文件：`docs/public/illustrations/galen-hd/game.png`。

```text
Use case: identity-preserve, high-resolution website animation artwork.
Input image 1 is the approved CHARACTER AND STYLE REFERENCE. Preserve this same refined adult face, natural narrow eyes, dark brown voluminous eyebrow-length forehead-covering fringe, mature small head, tall slim eight-head proportions and long legs. Same blue relaxed crew-neck T-shirt, light gray straight-leg casual pants, ivory lace-up sneakers unless scene specifies swimming. Refined hand-painted editorial illustration, delicately textured clothing, CRISP precise face/eyes/hair/hands/sneakers, sharp clean edges, NO defocus, soft blur, sepia filter or blurry brushwork. Do not change to chibi or cartoon.
Output a LANDSCAPE 1536x1024 image containing ONLY TWO large full scene poses SIDE BY SIDE in equal left and right halves. Each pose fits entirely within its half. Occupy 85-90% of the image height and as much width as natural proportions permit; preserve about 5% outer margin. Full head, shoes and all props visible; no cutoffs. Both poses same scale and SAME fixed props orientation, not mirrored. The background must be perfectly flat solid pure magenta #FF00FF (for existing website chroma key), including negative spaces under furniture/inside arms, with no reflected magenta tint, gradients, checkerboard, shadow backdrop, ground plane, white rectangle, text, watermark or labels.
SCENE: adult seated on simple wooden stool playing a game, both feet visible. LEFT half holding a phone horizontally in both hands, looking down engaged; RIGHT half holding a dark game controller with restrained pleased expression. Same blue tee, gray casual trousers, ivory sneakers, same stool, same long-legged sitting pose and same scale. No giant smile, no text, no devices beyond the handheld objects.
```

