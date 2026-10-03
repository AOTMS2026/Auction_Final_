//#region node_modules/.nitro/vite/services/ssr/assets/image-DJ08YD9d.js
var IMAGE_PRESETS = {
	cover: {
		maxDimension: 1280,
		quality: .82
	},
	avatar: {
		maxDimension: 480,
		quality: .85
	}
};
function readAsDataUrl(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = () => reject(reader.error ?? /* @__PURE__ */ new Error("Failed to read file"));
		reader.readAsDataURL(file);
	});
}
function loadImage(src) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(/* @__PURE__ */ new Error("Failed to load image"));
		img.src = src;
	});
}
async function fileToCompressedDataUrl(file, options) {
	const original = await readAsDataUrl(file);
	const img = await loadImage(original);
	const scale = Math.min(1, options.maxDimension / Math.max(img.width, img.height));
	const width = Math.max(1, Math.round(img.width * scale));
	const height = Math.max(1, Math.round(img.height * scale));
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) return original;
	ctx.drawImage(img, 0, 0, width, height);
	return canvas.toDataURL("image/jpeg", options.quality ?? .85);
}
//#endregion
export { fileToCompressedDataUrl as n, IMAGE_PRESETS as t };
