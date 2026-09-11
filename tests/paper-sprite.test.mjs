import assert from 'node:assert/strict'
import test from 'node:test'
import { keyMagenta, spriteCellSize } from '../docs/.vitepress/theme/components/paperSprite.ts'

test('HD poses retain native detail through the 90% fit instead of shrinking to 512px', () => {
  for (const side of [720, 980, 1024, 1536]) {
    const cell = spriteCellSize(side)
    assert.ok(cell * 0.9 >= side)
    assert.ok(cell * 0.9 < side + 1)
  }
})

test('sprite cells have bounded memory and safe dimensions for unusable or oversized input', () => {
  for (const side of [0, -10, NaN, Infinity, 100]) assert.equal(spriteCellSize(side), 512)
  assert.equal(spriteCellSize(10000), 2048)
})

test('pure magenta is made fully transparent', () => {
  const pixels = new Uint8ClampedArray([
    255, 0, 255, 255,
    255, 0, 255, 120,
  ])

  keyMagenta(pixels)

  assert.deepEqual([...pixels], [0, 0, 0, 0, 0, 0, 0, 0])
})

test('pink antialiasing is removed without leaving a strong fringe', () => {
  const pixels = new Uint8ClampedArray([
    255, 112, 255, 255,
    255, 192, 255, 255,
  ])

  keyMagenta(pixels)

  assert.equal(pixels[3], 0)
  assert.ok(pixels[4 + 3] < 255)
  assert.ok(pixels[4] < 255)
  assert.ok(pixels[4 + 2] < 255)
})

test('warm paper, blue, yellow and skin colours keep their RGB and alpha', () => {
  const pixels = new Uint8ClampedArray([
    246, 237, 220, 255,
    44, 112, 210, 220,
    246, 198, 44, 180,
    224, 148, 118, 200,
    180, 80, 220, 0,
  ])
  const expected = [...pixels]

  keyMagenta(pixels)

  assert.deepEqual([...pixels], expected)
})

test('dark paper-edge shadows do not retain a magenta cast', () => {
  const pixels = new Uint8ClampedArray([130, 40, 132, 255, 95, 55, 100, 190])
  keyMagenta(pixels)
  for (let i = 0; i < pixels.length; i += 4) {
    assert.ok(pixels[i] <= pixels[i + 1] + 5)
    assert.ok(pixels[i + 2] <= pixels[i + 1] + 5)
    assert.ok(pixels[i + 3] > 0 && pixels[i + 3] < 190)
  }
})
