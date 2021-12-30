const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

const pathToTitle = (path) => path.replaceAll("/", "").replaceAll("-", " ").replace(/\b\w/g, l => l.toUpperCase())

export { toBase64, pathToTitle }
