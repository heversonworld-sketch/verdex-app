import React, { useState, useRef, useCallback } from 'react';
import { identifyPlant } from '../services/api.js';

export default function Scanner({ onScanResult }) {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const videoRef = useRef();
  const canvasRef = useRef();

  const startScan = useCallback(async () => {
    setIsScanning(true);
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    videoRef.current.srcObject = stream;

    // Scan 3s → backend
    setTimeout(capturePlant, 3000);
  }, []);

  const capturePlant = async () => {
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    canvasRef.current.getContext('2d').drawImage(videoRef.current, 0, 0);

    const imageBlob = await new Promise(resolve => {
      canvasRef.current.toBlob(resolve, 'image/jpeg', 0.8);
    });

    const result = await identifyPlant(imageBlob);
    setScanResult(result);
    onScanResult?.(result);

    videoRef.current.srcObject.getTracks()[0].stop();
    setIsScanning(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)' }}>
      <div style={{ width: 300, height: 300, border: '3px solid #10B981', margin: '20px auto' }}>
        <video ref={videoRef} style={{ width: '100%', height: '100%' }} autoPlay />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {!isScanning && <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ color: 'white', textAlign: 'center' }}>👆 Toque para escanear</div>
        </div>}
      </div>

      <div style={{ textAlign: 'center', color: 'white', marginBottom: 40 }}>
        <h2 style={{ fontSize: 28, margin: '0 0 12px 0' }}>VERDEX SCANNER</h2>
        <p style={{ fontSize: 16, opacity: 0.9, margin: 0 }}>Apontar para planta (3s)</p>
      </div>

      <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
        <button onClick={() => setIsScanning(false)} style={{ padding: '16px 32px', background: '#EF4444', color: 'white', border: 'none', borderRadius: 8, fontSize: 16 }}>Cancelar</button>
        <button onClick={startScan} style={{ padding: '16px 32px', background: '#10B981', color: 'white', border: 'none', borderRadius: 8, fontSize: 16 }} disabled={isScanning}>
          {isScanning ? 'Escaneando...' : 'Escanear Planta'}
        </button>
      </div>

      {scanResult && (
        <div style={{ position: 'absolute', bottom: 60, left: 20, right: 20, background: 'rgba(0,0,0,0.8)', color: 'white', padding: 20, borderRadius: 12 }}>
          <strong>{scanResult.name || scanResult.plant?.species?.scientificNameWithoutAuthor || 'Planta identificada'}</strong><br/>
          Confiança: {scanResult.confidence || Math.round((scanResult.plant?.score || 0) * 100)}% | XP: +{scanResult.xp || 0}
        </div>
      )}
    </div>
  );
}
