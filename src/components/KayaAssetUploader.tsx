import React, { useState, useEffect } from 'react';
import { UploadCloud, CheckCircle2, Image as ImageIcon, AlertCircle, RefreshCw, X, FolderCheck } from 'lucide-react';
import { KAYA_EXPECTED_ASSETS, fetchUploadedKayaAssets, uploadKayaAssetFile, KayaAssetDefinition } from '../utils/kayaAssets';

interface KayaAssetUploaderProps {
  isOpen: boolean;
  onClose: () => void;
  onAssetsUpdated?: () => void;
}

export const KayaAssetUploader: React.FC<KayaAssetUploaderProps> = ({
  isOpen,
  onClose,
  onAssetsUpdated,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [dragOver, setDragOver] = useState<boolean>(false);

  const refreshAssets = async () => {
    const files = await fetchUploadedKayaAssets();
    setUploadedFiles(files);
  };

  useEffect(() => {
    if (isOpen) {
      refreshAssets();
    }
  }, [isOpen]);

  const handleFiles = async (files: FileList | File[]) => {
    setUploading(true);
    setUploadStatus(`Uploading ${files.length} asset${files.length > 1 ? 's' : ''}...`);

    let successCount = 0;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadStatus(`Uploading (${i + 1}/${files.length}): ${file.name}...`);
      const result = await uploadKayaAssetFile(file);
      if (result.success) {
        successCount++;
      }
    }

    setUploading(false);
    setUploadStatus(`Successfully saved ${successCount} asset${successCount > 1 ? 's' : ''} as-is into the asset directory!`);
    await refreshAssets();
    if (onAssetsUpdated) {
      onAssetsUpdated();
    }
  };

  const isAssetUploaded = (def: KayaAssetDefinition): boolean => {
    return uploadedFiles.some((f) => {
      if (f.toLowerCase() === def.expectedFilename.toLowerCase()) return true;
      if (def.alternateFilenames?.some((alt) => alt.toLowerCase() === f.toLowerCase())) return true;
      return false;
    });
  };

  if (!isOpen) return null;

  const uploadedCount = KAYA_EXPECTED_ASSETS.filter(isAssetUploaded).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold">
              <FolderCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Original Kaya Asset Manager</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-neutral-900 font-display">
              Upload Original Photoshoot Assets
            </h3>
            <p className="text-xs text-neutral-500">
              Upload your raw photoshoot PNGs as-is without modification. They are saved directly into the asset directory.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress status */}
        <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/80 flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-neutral-800">
              Asset Status: {uploadedCount} of {KAYA_EXPECTED_ASSETS.length} original photos detected
            </p>
            <p className="text-[11px] text-neutral-500">
              Pairs on-model photoshoot shots with boutique flatlays.
            </p>
          </div>
          <button
            onClick={refreshAssets}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-neutral-900 bg-white px-3 py-1.5 rounded-xl border border-neutral-200 shadow-2xs transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Check Files</span>
          </button>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              handleFiles(e.dataTransfer.files);
            }
          }}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
            dragOver
              ? 'border-amber-500 bg-amber-50/50'
              : 'border-neutral-300 hover:border-amber-400 bg-neutral-50/50'
          }`}
          onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = true;
            input.accept = 'image/*';
            input.onchange = (e) => {
              const target = e.target as HTMLInputElement;
              if (target.files && target.files.length > 0) {
                handleFiles(target.files);
              }
            };
            input.click();
          }}
        >
          <UploadCloud className="w-10 h-10 text-amber-600 mx-auto mb-2" />
          <p className="text-sm font-bold text-neutral-800">
            Click to choose files or drag & drop here
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Drop Kaya photoshoot files (e.g., Kaya_model.png, Kaya_flatlay.png, etc.)
          </p>
          {uploading && (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-amber-700">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>{uploadStatus}</span>
            </div>
          )}
          {!uploading && uploadStatus && (
            <div className="mt-3 text-xs font-bold text-emerald-700 bg-emerald-50 py-1 px-3 rounded-lg inline-block">
              {uploadStatus}
            </div>
          )}
        </div>

        {/* List of Expected Assets */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
            Expected Kaya Photosheet Pairs:
          </p>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {KAYA_EXPECTED_ASSETS.map((asset) => {
              const uploaded = isAssetUploaded(asset);
              return (
                <div
                  key={asset.id}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                    uploaded
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                      : 'bg-neutral-50 border-neutral-200/80 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                      {uploaded ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <ImageIcon className="w-4 h-4 text-neutral-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold">{asset.expectedFilename}</span>
                        <span className={`px-1.5 py-0.5 rounded-sm text-[10px] uppercase font-extrabold ${
                          asset.type === 'model' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {asset.type === 'model' ? 'Model Shot' : 'Clothing Only (Flatlay)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500">{asset.setName} — {asset.description}</p>
                    </div>
                  </div>

                  <div>
                    {uploaded ? (
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        Available
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-neutral-400">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-2 border-t border-neutral-200 flex items-center justify-between">
          <p className="text-[11px] text-neutral-400">
            Files can also be placed directly in <code>/public/images/kaya/</code> via the code editor.
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
