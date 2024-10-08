import { MemoryStoredFile } from 'nestjs-form-data';
import { CreateFile } from '../interfaces/create-file.interface';
import * as dayjs from 'dayjs';
import { generate } from 'randomstring';
import { existsSync, statSync, unlinkSync, writeFileSync } from 'fs';
import * as webp from '@nwrks/webp-converter';
import { fromFile } from 'file-type';
import * as mime from 'mime-types';
import { createHash } from 'crypto';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();

export function getSize(filePath: string) {
  const stats = statSync(filePath);
  const fileSizeInBytes = stats.size;
  return fileSizeInBytes
}

export function getChecksum(filePath: string, algorithm = 'sha256'): Promise<string> {
  return new Promise((resolve, reject) => {
    const hash = createHash(algorithm);
    const stream = fs.createReadStream(filePath);

    stream.on('data', (data) => {
      hash.update(data);
    });

    stream.on('end', () => {
      const checksum = hash.digest('hex');
      resolve(checksum);
    });

    stream.on('error', (err) => {
      reject(err);
    });
  });
}

export async function getMimetype(filePath: string) {
  const file = await  fromFile(filePath)
  return file.mime
}

function deleteFile(path: string): void {
  if (existsSync(path)) unlinkSync(path);
}

export async function createFileFunction(
  file: MemoryStoredFile,
  uploadPath?: string,
): Promise<CreateFile | null> {
  const uploadPathWithPublic = uploadPath
    ? `uploads/${uploadPath}`
    : `uploads/${configService.get('UPLOAD_PATH')}`;
  if (!file) return null;
  const ext = mime.extension(file.mimeType);
  const timestamp = dayjs().valueOf();
  const newFileName = `${timestamp}${generate({
    length: 8,
    charset: 'numeric',
  })}`;
  let filename = `${newFileName}.${ext}`;
  writeFileSync(`${uploadPathWithPublic}/${filename}`, file.buffer);
  // convert to webp
  webp.grant_permission();
  if (existsSync(`${uploadPathWithPublic}/${filename}`)) {
    // compress image if size more than 500KB
    await webp.cwebp(
      `${uploadPathWithPublic}/${filename}`,
      `${uploadPathWithPublic}/${newFileName}.webp`,
      file.size > 1024 * 500 ? `-q 50` : undefined,
    );
    // delete the original file
    if (
      filename != `${newFileName}.webp` &&
      existsSync(`${uploadPathWithPublic}/${filename}`)
    )
      deleteFile(`${uploadPathWithPublic}/${filename}`);
    filename = `${newFileName}.webp`;
  }


  const size = getSize(`${uploadPathWithPublic}/${filename}`)

  const mimetype = await getMimetype(`${uploadPathWithPublic}/${filename}`)

  return {
    path: `${uploadPathWithPublic}/${filename}`,
    filename,
    originalFilename: file.originalName,
    mime: mimetype,
    size,
    checksum: await getChecksum(`${uploadPathWithPublic}/${filename}`),
  };
}
