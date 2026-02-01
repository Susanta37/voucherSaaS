import React, { useRef, useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import Draggable from "react-draggable";
import AppLayout from "@/layouts/app-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider"; 
import { Move, Type, Maximize, ArrowLeft } from "lucide-react";

export default function Edit({ template }: any) {
    const qrRef = useRef(null);
    const textRef = useRef(null);
    const imgRef = useRef<HTMLImageElement>(null);

    const [preview, setPreview] = useState(`/storage/${template.background_image}`);

    const { data, setData, post, processing } = useForm({
        _method: 'PUT',
        name: template.name,
        background_image: null as File | null,
        layout: template.layout, // Current coordinates (stored as real pixels)
    });

    // To show correctly in the UI, we must convert "Real Pixels" back to "UI Pixels"
    const [uiLayout, setUiLayout] = useState(template.layout);

    useEffect(() => {
        const updateUiLayout = () => {
            if (imgRef.current) {
                const ratio = imgRef.current.clientWidth / imgRef.current.naturalWidth;
                setUiLayout({
                    qr_x: template.layout.qr_x * ratio,
                    qr_y: template.layout.qr_y * ratio,
                    qr_size: template.layout.qr_size * ratio,
                    text_x: template.layout.text_x * ratio,
                    text_y: template.layout.text_y * ratio,
                });
            }
        };
        window.addEventListener('resize', updateUiLayout);
        return () => window.removeEventListener('resize', updateUiLayout);
    }, [template]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (imgRef.current) {
            // Calculate Ratio: Real Pixels / UI Pixels
            const ratio = imgRef.current.naturalWidth / imgRef.current.clientWidth;

            const normalized = {
                qr_x: Math.round(uiLayout.qr_x * ratio),
                qr_y: Math.round(uiLayout.qr_y * ratio),
                qr_size: Math.round(uiLayout.qr_size * ratio),
                text_x: Math.round(uiLayout.text_x * ratio),
                text_y: Math.round(uiLayout.text_y * ratio),
            };

            post(`/admin/templates/${template.id}`, {
                forceFormData: true,
                preserveScroll: true,
                data: { ...data, layout: normalized }
            });
        }
    };

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto p-6 grid grid-cols-12 gap-8">
                <div className="col-span-4 space-y-4">
                    <Card className="p-4 space-y-4">
                        <Label>Template Name</Label>
                        <Input value={data.name} onChange={e => setData('name', e.target.value)} />
                        
                        <Label>QR Size ({Math.round(uiLayout.qr_size)}px)</Label>
                        <Slider 
                            value={[uiLayout.qr_size]} 
                            min={50} max={300} 
                            onValueChange={(val) => setUiLayout({...uiLayout, qr_size: val[0]})} 
                        />
                        
                        <Button onClick={submit} disabled={processing} className="w-full">Update Template</Button>
                    </Card>
                </div>

                <div className="col-span-8 bg-muted rounded-xl p-4 flex justify-center items-start overflow-auto">
                    <div className="relative inline-block border shadow-sm">
                        <img 
                            ref={imgRef}
                            src={preview} 
                            onLoad={() => { /* Initial ratio calculation could trigger here */ }}
                            className="max-w-full h-auto block select-none"
                            onDragStart={e => e.preventDefault()}
                        />

                        <Draggable
                            nodeRef={qrRef}
                            bounds="parent"
                            position={{ x: uiLayout.qr_x, y: uiLayout.qr_y }}
                            onStop={(e, d) => setUiLayout({ ...uiLayout, qr_x: d.x, qr_y: d.y })}
                        >
                            <div ref={qrRef} className="absolute top-0 left-0 border-2 border-primary bg-white/50 flex items-center justify-center cursor-move"
                                 style={{ width: uiLayout.qr_size, height: uiLayout.qr_size }}>
                                <Maximize className="text-primary w-6 h-6" />
                            </div>
                        </Draggable>

                        <Draggable
                            nodeRef={textRef}
                            bounds="parent"
                            position={{ x: uiLayout.text_x, y: uiLayout.text_y }}
                            onStop={(e, d) => setUiLayout({ ...uiLayout, text_x: d.x, text_y: d.y })}
                        >
                            <div ref={textRef} className="absolute top-0 left-0 bg-black text-white px-2 py-1 rounded cursor-move whitespace-nowrap">
                                <Type className="inline w-4 h-4 mr-1" /> PPC-CODE
                            </div>
                        </Draggable>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}