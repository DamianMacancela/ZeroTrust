self.onmessage = async function(e) {
  const fileData = e.data.fileData;
  try {
    self.postMessage({ status: 'init_ai', message: 'Iniciando...' });
    self.postMessage({ status: 'processing', message: 'Procesando...', pageProgress: 50 });
    self.postMessage({ status: 'done', success: true, data: fileData });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error en worker';
    self.postMessage({ status: 'error', error: msg });
  }
};

