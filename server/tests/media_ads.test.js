import test from 'node:test'
import assert from 'node:assert/strict'
import { MediaService } from '../src/modules/media/media.service.js'

test('MediaService rejects unsupported MIME type', async () => {
  const service = new MediaService()
  const fakeUser = { userId: '1' }

  await assert.rejects(
    () =>
      service.uploadMedia({
        fileBuffer: Buffer.from('malicious script'),
        originalName: 'exploit.sh',
        mimeType: 'application/x-sh',
        user: fakeUser,
      }),
    {
      statusCode: 400,
      message: /Unsupported media type/,
    },
  )
})

test('MediaService saves valid image buffer and creates media record', async () => {
  let createdAsset = null
  const mockRepo = {
    createMediaAsset: async (data) => {
      createdAsset = data
      return {
        id: 88n,
        filename: data.filename,
        storageKey: data.storageKey,
        mimeType: data.mimeType,
        sizeBytes: data.sizeBytes,
        createdAt: new Date(),
      }
    },
  }

  const service = new MediaService(mockRepo)
  const fakeUser = { userId: '2' }
  const dummyJpg = Buffer.from('fake-image-bytes-jpeg')

  const result = await service.uploadMedia({
    fileBuffer: dummyJpg,
    originalName: 'namma-metro.jpg',
    mimeType: 'image/jpeg',
    altText: 'Namma Metro train entering station',
    caption: 'Bengaluru Metro Phase 3 alignment',
    credit: 'Staff Photographer',
    user: fakeUser,
  })

  assert.equal(result.id, '88')
  assert.equal(result.filename, 'namma-metro.jpg')
  assert.ok(result.cdnUrl.startsWith('/uploads/'))
  assert.equal(createdAsset.mimeType, 'image/jpeg')
  assert.equal(createdAsset.altText, 'Namma Metro train entering station')
})
