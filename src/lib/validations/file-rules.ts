import { z } from 'zod';

export const MAX_FILE_SIZE_FREE = 15 * 1024 * 1024;
export const MAX_FILE_SIZE_PRO  = 100 * 1024 * 1024;

const isDocument = (mimeType: string) =>
  ['pdf', 'document', 'sheet', 'ms-excel', 'msword', 'csv', 'text'].some(ext =>
    mimeType.includes(ext)
  );
const isImage = (mimeType: string) => mimeType.startsWith('image/');

export const getFileValidator = (isEnterprise: boolean, hasUsedFreeTrial: boolean = false) => {
  const maxSize = isEnterprise ? MAX_FILE_SIZE_PRO : MAX_FILE_SIZE_FREE;
  const sizeLabel = isEnterprise ? '100MB' : '15MB';
  return z
    .any()
    .refine(
      (file) => !!file && typeof file === 'object' && 'size' in file && 'type' in file,
      { message: 'El payload recibido no es un archivo valido.' }
    )
    .refine(
      (file) => file.size <= maxSize,
      { message: 'La matriz excede el limite permitido de ' + sizeLabel + '.' }
    )
    .refine(
      () => !(!isEnterprise && hasUsedFreeTrial),
      { message: 'Auditoria agotada. Adquiera la licencia Enterprise para procesamiento continuo.' }
    )
    .refine(
      (file) => {
        const mimeType = file.type.toLowerCase();
        if (isEnterprise) return isDocument(mimeType) || isImage(mimeType);
        return isDocument(mimeType) && !isImage(mimeType);
      },
      {
        message: isEnterprise
          ? 'Formato de archivo no soportado.'
          : 'Restriccion: El Sandbox acepta unicamente matrices estructuradas.',
      }
    );
};