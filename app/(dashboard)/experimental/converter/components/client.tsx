"use client"

import * as React from "react"
import { Check, Upload, X } from 'lucide-react'
import { useDropzone } from "react-dropzone"
import axios from "axios"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function ExperimentalClient() {
    const [files, setFiles] = React.useState<File[]>([])
    const [progress, setProgress] = React.useState(0)
    const [uploading, setUploading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const maxFiles = 6  // Limit to 6 files
    const maxSize = 5242880 // 5MB

    const { toast } = useToast();

    const onDrop = React.useCallback((acceptedFiles: File[]) => {
        setError(null)
        if (acceptedFiles.length > maxFiles) {
            setError(`Solo se pueden subir un máximo de ${maxFiles} archivos.`)
        } else {
            setFiles(acceptedFiles)
        }
    }, [maxFiles])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/json': ['.json']  // Accept only JSON files
        },
        maxFiles,
        maxSize,
    })

    const handleUpload = async () => {
        try {
            setUploading(true)
            setProgress(0)

            // Simulate upload progress
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 95) {
                        clearInterval(interval)
                        return prev
                    }
                    return prev + 5
                })
            }, 100)


            // Process each file and send its data as JSON
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                let apiUrl = '';

                // Assign the API URL based on the file name
                // if (file.name.startsWith('1_inventario')) apiUrl = '/api/import/inventario'; // Inventory
                if (file.name.startsWith('2_compras')) apiUrl = '/api/import/experimental/compras/batches'; // Purchases
                // if (file.name.startsWith('3_compras_items')) apiUrl = '/api/import/compras/purchaseItems'; // Purchases
                // if (file.name.startsWith('4_ventas')) apiUrl = '/api/import/ventas'; // Sales
                // if (file.name.startsWith('5_ventas_items')) apiUrl = '/api/import/ventas/saleItems'; // Sales
                // if (file.name.startsWith('6_negocio')) apiUrl = '/api/import/negocio'; // Business

                if (!apiUrl) {
                    console.error(`Archivo ${file.name} no tiene un nombre válido para asignar una URL`);
                    toast({
                        title: `Archivo ${file.name} no tiene un nombre válido para asignar una URL.`,
                        description: `${file.name}`,
                        variant: "destructive",
                    })
                    continue;
                }

                try {
                    // Read and parse the file content
                    const fileContent = await new Promise<string>((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            if (typeof reader.result === 'string') {
                                resolve(reader.result);
                            } else {
                                reject(new Error('El contenido del archivo no es un string.'));
                            }
                        };
                        reader.onerror = () => reject(new Error('Error leyendo el archivo'));
                        reader.readAsText(file);
                    });

                    // Parse the file content into a JavaScript object
                    const jsonData = JSON.parse(fileContent);

                    if (!Array.isArray(jsonData) && !file.name.startsWith('5_negocio')) {
                        console.error(`Archivo ${file.name} tiene un formato inválido, se esperaba un array.`);
                        toast({
                            title: `Archivo ${file.name} tiene un formato inválido, se esperaba un array.`,
                            description: `${file.name}`,
                            variant: "destructive",
                        })
                        continue;
                    }

                    // Send the parsed data to the appropriate API
                    await axios.post(apiUrl, { data: jsonData }, {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });

                } catch (err: any) {
                    console.error(`Error al procesar o enviar archivo ${file.name}:`, err.stack)
                    toast({
                        title: "Error al procesar o enviar archivo",
                        description: `${file.name}`,
                        variant: "destructive",
                    })
                }
            }

            clearInterval(interval)
            setProgress(100)

            // Reset after successful upload
            setTimeout(() => {
                setFiles([])
                setProgress(0)
                setUploading(false)
                toast({
                    title: <div className="flex items-center text-green-500">
                        <Check className="h-4 w-4 mr-2" />
                        Datos actualizados
                    </div>
                })
            }, 1000)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error enviando los archivos')
            setUploading(false)
            setProgress(0)
        }
    }

    const removeFile = (index: number) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
        setError(null)
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader className="text-center">
                <CardTitle>Importar compras con formato desactualizado</CardTitle>
                {/* <CardDescription>
                    Arrastra y suelta tus archivos aquí o haz clic para seleccionarlos
                    <br />
                    (Máximo 6 archivos)
                </CardDescription> */}
            </CardHeader>
            <CardContent className="space-y-4">
                <div
                    {...getRootProps()}
                    className={cn(
                        "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:bg-muted-foreground/10",
                        isDragActive ? "border-primary bg-muted-foreground/10" : "",
                        error && "border-destructive"
                    )}
                >
                    <input {...getInputProps()} />
                    <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        {isDragActive
                            ? "Suelta los archivos aquí"
                            : "Arrastra los archivos aquí o haz clic para seleccionarlos"
                        }
                    </p>
                    <p className={`text-sm font-bold text-muted-foreground ${isDragActive ? "opacity-0" : ""}`}>
                        Sólo se permiten archivos en formato .JSON
                    </p>
                </div>

                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}

                {files.length > 0 && (
                    <div className="space-y-2">
                        {files.map((file, index) => (
                            <div
                                key={file.name}
                                className="flex items-center justify-between p-2 border rounded"
                            >
                                <span className="text-sm truncate">{file.name}</span>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeFile(index)}
                                    disabled={uploading}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                )}

                {progress > 0 && (
                    <Progress value={progress} className="h-2" />
                )}

                {files.length > 0 &&
                    <Button
                        onClick={handleUpload}
                        disabled={files.length === 0 || uploading}
                        className="w-full"
                    >
                        {uploading ? 'Subiendo...' : 'Subir archivos'}
                    </Button>
                }
            </CardContent>
        </Card>
    )
}
