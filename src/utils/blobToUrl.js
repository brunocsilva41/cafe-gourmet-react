export const blobToUrl = (blobData) => {
  if (!blobData) {
    console.warn('blobData está vazio ou indefinido.');
    return '';
  }
  console.log('Convertendo BLOB para URL:', blobData);

  // Verifica se o blobData é do tipo Buffer
  if (blobData.type === 'Buffer') {
    blobData = new Uint8Array(blobData.data);
  }

  const blob = new Blob([blobData], { type: 'image/jpeg' });
  return URL.createObjectURL(blob);
};
