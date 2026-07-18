import "server-only";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("O Cloudinary ainda não foi configurado.");
  }

  return { cloudName, apiKey, apiSecret };
}

export async function uploadGiftImage(file: File) {
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("A imagem deve ter no máximo 5 MB.");
  }
  if (!allowedTypes.has(file.type)) {
    throw new Error("Envie uma imagem JPG, PNG, WebP ou AVIF.");
  }

  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("asset_folder", "site-casamento/presentes");
  formData.append("use_filename", "true");
  formData.append("unique_filename", "true");

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString("base64")}`,
      },
      body: formData,
      cache: "no-store",
    },
  );

  const result = await response.json() as {
    secure_url?: string;
    error?: { message?: string };
  };
  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message ?? "Não foi possível enviar a imagem ao Cloudinary.");
  }

  return result.secure_url;
}
