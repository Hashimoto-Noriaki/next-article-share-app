import type { ActionResult } from '@/shared/types/action';
import { ok, validationFail } from '@/shared/lib/action-result';
import { cloudinary } from '@/external/cloudinary';
import { uploadImageSchema } from '@/external/dto/upload';

type UploadedImage = { url: string; publicId: string };

export async function uploadImageHandler({
  userId,
  file,
  folder,
}: {
  userId: string;
  file: unknown;
  folder: unknown;
}): Promise<ActionResult<UploadedImage>> {
  const parsed = uploadImageSchema.safeParse({ file, folder });
  if (!parsed.success) {
    return validationFail(parsed.error);
  }

  const { file: image, folder: baseFolder } = parsed.data;
  const buffer = Buffer.from(await image.arrayBuffer());
  const base64 = `data:${image.type};base64,${buffer.toString('base64')}`;

  // アップロード先はクライアントに決めさせず、許可フォルダ配下のユーザーごとのパスに固定する
  const result = await cloudinary.uploader.upload(base64, {
    folder: `${baseFolder}/${userId}`,
    resource_type: 'image',
  });

  return ok({ url: result.secure_url, publicId: result.public_id });
}
