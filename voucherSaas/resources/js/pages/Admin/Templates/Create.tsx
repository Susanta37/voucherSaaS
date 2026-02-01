import React, { useRef, useState } from "react";
import { Head, useForm, router } from "@inertiajs/react";
import Draggable from "react-draggable";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider"; 
import { Move, Type, Maximize, ImageIcon } from "lucide-react";

export default function Create() {
    const qrRef = useRef(null);
    const textRef = useRef(null);
    const imgRef = useRef<HTMLImageElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        background_image: null as File | null,
        layout: {
            qr_x: 50,
            qr_y: 50,
            qr_size: 150,
            text_x: 50,
            text_y: 250,
        },
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!imgRef.current) return;

        // Calculate the Scale Ratio (Real Image Pixels / UI Pixels)
        const ratioX = imgRef.current.naturalWidth / imgRef.current.clientWidth;
        const ratioY = imgRef.current.naturalHeight / imgRef.current.clientHeight;

        // Create the Absolute Layout (Real Pixels)
        const absoluteLayout = {
            qr_x: Math.round(data.layout.qr_x * ratioX),
            qr_y: Math.round(data.layout.qr_y * ratioY),
            qr_size: Math.round(data.layout.qr_size * ratioX),
            text_x: Math.round(data.layout.text_x * ratioX),
            text_y: Math.round(data.layout.text_y * ratioY),
        };

        // Send the real pixel data to the server
        router.post("/admin/templates", { 
            ...data,
            layout: JSON.stringify(absoluteLayout), // Ensure it goes as a string for safety
            _method: 'POST'
        }, { 
            forceFormData: true,
            onSuccess: () => alert("Template saved with real dimensions!") 
        });
    };

    return (
        <AppLayout>
            <Head title="Create Template" />
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT PANEL */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="p-6 shadow-sm border-border/60">
                            <form onSubmit={submit} className="space-y-5">
                                <h2 className="text-xl font-bold tracking-tight">Template Editor</h2>
                                
                                <div className="space-y-2">
                                    <Label>Template Name</Label>
                                    <Input value={data.name} onChange={e => setData("name", e.target.value)} />
                                </div>

                                <div className="space-y-2">
                                    <Label>Background Design</Label>
                                    <Input type="file" accept="image/*" onChange={e => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setData("background_image", file);
                                            setPreview(URL.createObjectURL(file));
                                        }
                                    }} />
                                </div>

                                <div className="space-y-4">
                                    <Label className="flex items-center gap-2">
                                        <Maximize className="w-4 h-4" /> QR Size: {data.layout.qr_size}px
                                    </Label>
                                    <Slider 
                                        value={[data.layout.qr_size]} 
                                        min={50} max={400} step={5}
                                        onValueChange={(val) => setData("layout", {...data.layout, qr_size: val[0]})}
                                    />
                                </div>

                                <Button disabled={processing || !preview} className="w-full rounded-xl py-6">
                                    Save Template
                                </Button>
                            </form>
                        </Card>
                    </div>

                    {/* INTERACTIVE CANVAS */}
                    <div className="lg:col-span-8">
                        <div className="relative border-2 border-dashed rounded-3xl bg-muted/30 flex items-center justify-center min-h-[600px] p-4">
                            {preview ? (
                                <div className="relative shadow-2xl inline-block" style={{ lineHeight: 0 }}>
                                    <img 
                                        ref={imgRef}
                                        src={preview} 
                                        className="max-w-full h-auto block select-none pointer-events-none" 
                                        alt="Preview" 
                                    />
                                    
                                    <Draggable
                                        nodeRef={qrRef}
                                        bounds="parent"
                                        position={{ x: data.layout.qr_x, y: data.layout.qr_y }}
                                        onStop={(e, d) => setData("layout", { ...data.layout, qr_x: d.x, qr_y: d.y })}
                                    >
                                        <div ref={qrRef} className="absolute top-0 left-0 z-50 cursor-move border-2 border-primary bg-white/70 backdrop-blur-sm flex items-center justify-center"
                                             style={{ width: data.layout.qr_size, height: data.layout.qr_size }}>
                                            <span className="text-[10px] font-bold text-primary uppercase">QR Area</span>
                                        </div>
                                    </Draggable>

                                    <Draggable
                                        nodeRef={textRef}
                                        bounds="parent"
                                        position={{ x: data.layout.text_x, y: data.layout.text_y }}
                                        onStop={(e, d) => setData("layout", { ...data.layout, text_x: d.x, text_y: d.y })}
                                    >
                                        <div ref={textRef} className="absolute top-0 left-0 z-50 cursor-move bg-black text-white px-3 py-1 rounded shadow-lg flex items-center gap-2 whitespace-nowrap">
                                            <Type className="w-4 h-4" />
                                            <span className="font-mono text-xs">PPC-CODE-EXAMPLE</span>
                                        </div>
                                    </Draggable>
                                </div>
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                    <p>Upload image to start</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}