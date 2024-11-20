export const blobToUrl = (blobData) => {
  if (!blobData) {
    console.warn('blobData está vazio ou indefinido.');
    return '';
  }

  // Verifica se o blobData é do tipo Buffer
  if (blobData.type === 'Buffer') {
    blobData = new Uint8Array(blobData.data);
  }

  // Determina o tipo de imagem com base na extensão do arquivo ou tipo MIME
  const mimeType = blobData.type || 'image/jpeg'; // Ajuste o tipo conforme necessário
  const blob = new Blob([blobData], { type: mimeType });
  return URL.createObjectURL(blob);
};
