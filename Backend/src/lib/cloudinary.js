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
      transformation: [
        { width: 1000, crop: "limit" },
        { quality: "auto", fetch_format: "auto" }
      ]
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Image upload failed");
  }
}

async function deleteImage(url) {
  if (!url || !url.includes("cloudinary.com")) return;
  try {
    const parts = url.split("/upload/");
    if (parts.length !== 2) return;
    const urlPath = parts[1].split("/");
    if (urlPath[0].match(/^v\d+$/)) {
      urlPath.shift();
    }
    const publicIdWithExt = urlPath.join("/");
    const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf(".")) || publicIdWithExt;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary delete failed:", error);
  }
}

module.exports = { cloudinary, uploadBase64Image, deleteImage };
