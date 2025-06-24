import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

/**
 * Saves a base64-encoded file to disk.
 *
 * @param {string} base64String - Base64 string with data URI prefix.
 * @param {string} uploadDir - Relative or absolute path where to save the file.
 * @returns {Promise<string>} - The saved file name or path.
 */
export async function saveFile(base64String: string, uploadDir: string) {
    const matches = base64String.match(/^data:(.+);base64,(.+)$/);
    if (!matches) {
        throw new Error('Invalid base64 string.');
    }

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    const ext = mimeType.split('/')[1] || 'bin';
    const fileName = `${uuidv4()}.${ext}`;

    const uploadPath = path.resolve(process.cwd(), 'public', uploadDir);
    const filePath = path.join(uploadPath, fileName);

    await fs.mkdir(uploadPath, { recursive: true });
    await fs.writeFile(filePath, buffer);

    return `/${uploadDir}/${fileName}`;
}
