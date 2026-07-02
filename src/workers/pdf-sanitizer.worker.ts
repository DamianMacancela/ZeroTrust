self.onmessage = async function(e) {
  var fileData = e.data.fileData;
  try {
    self.postMessage({ status: 'init_ai', message: 'Iniciando...' });
    self.postMessage({ status: 'processing', message: 'Procesando...', pageProgress: 50 });
    await new Promise(function(r) { setTimeout(r, 800); });
    self.postMessage({ status: 'done', success: true, data: fileData });
  } catch (err) {
    self.postMessage({ status: 'error', error: err.message || 'Error en worker' });
  }
};
