'use client';

import { useState, useRef } from 'react';
import { Evidence } from '../types/work-order.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Camera,
  Upload,
  FileText,
  Image,
  Video,
  X,
  Trash2,
  Download,
  ZoomIn,
  Loader2,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface WorkOrderEvidenceProps {
  evidence: Evidence[];
  isLoading?: boolean;
  onUpload: (file: File, type: Evidence['type'], description?: string) => void;
  onDelete?: (evidenceId: string) => void;
  isPending?: boolean;
  canUpload?: boolean;
}

export function WorkOrderEvidence({
  evidence,
  isLoading,
  onUpload,
  onDelete,
  isPending,
  canUpload = true,
}: WorkOrderEvidenceProps) {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<Evidence['type']>('photo');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [previewImage, setPreviewImage] = useState<Evidence | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile, selectedType, description);
      setSelectedFile(null);
      setDescription('');
      setIsUploadDialogOpen(false);
    }
  };

  const getEvidenceIcon = (type: Evidence['type']) => {
    const icons = {
      photo: <Image className="h-5 w-5" />,
      signature: <FileText className="h-5 w-5" />,
      document: <FileText className="h-5 w-5" />,
      video: <Video className="h-5 w-5" />,
    };
    return icons[type];
  };

  const getTypeLabel = (type: Evidence['type']) => {
    const labels = {
      photo: 'Foto',
      signature: 'Firma',
      document: 'Documento',
      video: 'Video',
    };
    return labels[type];
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const photoEvidence = evidence?.filter((e) => e.type === 'photo') || [];
  const otherEvidence = evidence?.filter((e) => e.type !== 'photo') || [];

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              <CardTitle className="text-base">Evidencia</CardTitle>
              <span className="text-sm text-muted-foreground">
                ({evidence?.length || 0})
              </span>
            </div>
            {canUpload && (
              <Button
                size="sm"
                onClick={() => setIsUploadDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Subir
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <EvidenceSkeleton />
          ) : evidence?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Camera className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">Sin evidencia</p>
              <p className="text-xs">Sube fotos o documentos del servicio</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Photos Grid */}
              {photoEvidence.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 text-muted-foreground">
                    Fotos ({photoEvidence.length})
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {photoEvidence.map((item) => (
                      <div
                        key={item.id}
                        className="relative aspect-square rounded-lg overflow-hidden bg-muted group cursor-pointer"
                        onClick={() => setPreviewImage(item)}
                      >
                        <img
                          src={item.thumbnailUrl || item.url}
                          alt={item.description || 'Evidencia'}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            variant="secondary"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPreviewImage(item);
                            }}
                          >
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                          {onDelete && (
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(item.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other evidence */}
              {otherEvidence.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 text-muted-foreground">
                    Documentos ({otherEvidence.length})
                  </p>
                  <div className="space-y-2">
                    {otherEvidence.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                          {getEvidenceIcon(item.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.filename}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getTypeLabel(item.type)} • {formatDate(item.capturedAt)}
                          </p>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            asChild
                          >
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4" />
                            </a>
                          </Button>
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => onDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Subir Evidencia</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Type selection */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Tipo de evidencia</p>
              <div className="flex gap-2">
                {(['photo', 'signature', 'document'] as const).map((type) => (
                  <Button
                    key={type}
                    variant={selectedType === type ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedType(type)}
                    className="flex-1 gap-2"
                  >
                    {getEvidenceIcon(type)}
                    {getTypeLabel(type)}
                  </Button>
                ))}
              </div>
            </div>

            {/* File input */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Archivo</p>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept={
                  selectedType === 'photo'
                    ? 'image/*'
                    : selectedType === 'video'
                    ? 'video/*'
                    : '*/*'
                }
                className="hidden"
              />
              <div
                className={cn(
                  'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors',
                  selectedFile
                    ? 'border-primary bg-primary/5'
                    : 'border-muted-foreground/25 hover:border-primary/50'
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                {selectedFile ? (
                  <div className="flex items-center gap-3 justify-center">
                    {getEvidenceIcon(selectedType === 'photo' ? 'photo' : 'document')}
                    <span className="text-sm font-medium truncate max-w-[200px]">
                      {selectedFile.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Clic para seleccionar archivo
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Descripción (opcional)</p>
              <Textarea
                placeholder="Describe esta evidencia..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
                rows={2}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsUploadDialogOpen(false);
                  setSelectedFile(null);
                  setDescription('');
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || isPending}
              >
                {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Subir
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0">
          <DialogHeader className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent z-10">
            <DialogTitle className="text-white flex items-center gap-2">
              {previewImage && (
                <>
                  {getEvidenceIcon(previewImage.type)}
                  {previewImage.description || previewImage.filename}
                </>
              )}
            </DialogTitle>
          </DialogHeader>
          {previewImage && (
            <img
              src={previewImage.url}
              alt={previewImage.description || 'Evidencia'}
              className="w-full h-auto max-h-[85vh] object-contain"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
            <p className="text-white text-sm">
              {previewImage && (
                <>
                  Capturado por {previewImage.capturedByName} •{' '}
                  {formatDate(previewImage.capturedAt)}
                </>
              )}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function EvidenceSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="aspect-square rounded-lg" />
      ))}
    </div>
  );
}
