import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { FakeUploader } from 'test/storage/fake-uploader';

import { InvalidAttachmentType } from './errors/invalid-attachment-type';
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment';

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let fakeUploader: FakeUploader;
let sut: UploadAndCreateAttachmentUseCase;

describe('Upload and create attachment', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();

    fakeUploader = new FakeUploader();
    sut = new UploadAndCreateAttachmentUseCase(
      inMemoryAttachmentsRepository,
      fakeUploader,
    );
  });

  test('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'simple-upload.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    });

    expect(result.isRight()).toBeTruthy();
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    });
    expect(fakeUploader.uploads[0]).toEqual({
      fileName: 'simple-upload.png',
      url: fakeUploader.uploads[0].url,
    });
  });

  test('should not be able to upload and create an attachment with invalid type', async () => {
    const result = await sut.execute({
      fileName: 'simple-upload.txt',
      fileType: 'text/plain',
      body: Buffer.from(''),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidAttachmentType);
  });
});
