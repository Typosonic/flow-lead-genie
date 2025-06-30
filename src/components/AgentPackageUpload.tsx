
import { useState, useCallback } from 'react';
import { Upload, File, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAgentPackages } from '@/hooks/useAgentPackages';

const AgentPackageUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [packageName, setPackageName] = useState('');
  const [packageDescription, setPackageDescription] = useState('');
  const { uploadPackage, isUploading } = useAgentPackages();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
        setSelectedFile(file);
        setPackageName(file.name.replace('.zip', ''));
      }
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
        setSelectedFile(file);
        setPackageName(file.name.replace('.zip', ''));
      }
    }
  };

  const handleUpload = () => {
    if (selectedFile && packageName) {
      uploadPackage.mutate({
        file: selectedFile,
        name: packageName,
        description: packageDescription
      }, {
        onSuccess: () => {
          setSelectedFile(null);
          setPackageName('');
          setPackageDescription('');
        }
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="glass-morphism border-border/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Agent Package
        </CardTitle>
        <CardDescription>
          Upload a ZIP file containing n8n agent workflows to add them to your agent library
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!selectedFile ? (
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-brand-500 bg-brand-500/10' 
                : 'border-border/40 hover:border-border/60'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Drop your ZIP file here</p>
            <p className="text-muted-foreground mb-4">or click to browse</p>
            <input
              type="file"
              accept=".zip"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer" asChild>
                <span>Browse Files</span>
              </Button>
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
              <div className="flex items-center gap-3">
                <File className="h-8 w-8 text-brand-500" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedFile(null)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-3">
              <div>
                <label htmlFor="package-name" className="block text-sm font-medium mb-1">
                  Package Name
                </label>
                <input
                  id="package-name"
                  type="text"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  placeholder="Enter package name"
                />
              </div>
              
              <div>
                <label htmlFor="package-description" className="block text-sm font-medium mb-1">
                  Description (optional)
                </label>
                <textarea
                  id="package-description"
                  value={packageDescription}
                  onChange={(e) => setPackageDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                  placeholder="Describe what this package contains"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleUpload}
                disabled={isUploading || !packageName}
                className="flex-1"
              >
                {isUploading ? 'Uploading...' : 'Upload Package'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSelectedFile(null)}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgentPackageUpload;
