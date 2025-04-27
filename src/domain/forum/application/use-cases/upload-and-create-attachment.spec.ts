import { makeAttachment } from 'test/factories/make-attachment';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { FakeUploader } from 'test/storage/fake-uploader';

import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment';

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeUploader: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase; // system under test

describe('Upload and create attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();

    fakeUploader = new FakeUploader();
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    );
  });

  test('should be able to create and upload an attachment', async () => {
    const file = Buffer.from('fake file content');

    const result = await sut.execute({
      fileName: 'simple-upload.png',
      fileType: 'image/png',
      body: file,
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      attachment: {
        title: 'simple-upload.png',
        url: expect.any(String),
      },
    });
  });
});
