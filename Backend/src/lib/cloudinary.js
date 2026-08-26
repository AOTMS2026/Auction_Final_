const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function uploadBase64Image(base64Str, folder = "pitchbid") {
  if (!base64Str) return null;
  // If it's already a URL (e.g. updating a player but not changing their photo), just return it
  if (base64Str.startsWith("http")) return base64Str;
  
  try {
    const result = await cloudinary.uploader.upload(base64Str, {
      folder,
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Image upload failed");
  }
}

module.exports = { cloudinary, uploadBase64Image };
