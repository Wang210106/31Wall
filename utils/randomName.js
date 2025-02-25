function generateUniqueFileName(extension = '') {
    const timestamp = Date.now();
 
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
 
    const baseName = `file_${timestamp}_${randomNumber}`;
 
    const fileName = extension ? `${baseName}.${extension.replace(/^\./, '')}` : baseName;
 
    return fileName;
}

module.exports = {
    generateUniqueFileName,
}