// import { writeFileSync } from 'fs';
// import { createFileSync } from 'fs-extra';
// import { MemoryStoredFile } from 'nestjs-form-data';
// import { join } from 'path';
// import { ConfigService } from 'src/config/config.service';
// import { FileToSave } from '../types/file-to-save.type';
// import os from 'os';

// // check the available memory
// const homeDir = os.homedir();

// const configService = new ConfigService();

// export const fileToSaveFunction = async (
//   file: MemoryStoredFile,
//   returnPath: string,
// ): Promise<FileToSave> => {
//   const staticPath = join(
//     homeDir,
//     configService.get<string>('STORAGE_FILE_SERVER'),
//   );
//   // console.log(join(staticPath, returnPath));
//   createFileSync(join(staticPath, returnPath));
//   writeFileSync(join(staticPath, returnPath), file.buffer);
//   return {
//     size: file.size,
//     mimeType: file.mimeType,
//   };
// };
