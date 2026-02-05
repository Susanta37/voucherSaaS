import React, { useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Html5Qrcode } from 'html5-qrcode';
import {
    ShieldCheck,
    XCircle,
    RotateCcw,
    Search,
    QrCode,
    User,
    Calendar,
    MapPin,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function Scanner() {
    const qrRef = useRef<Html5Qrcode | null>(null);
    const [cameraId, setCameraId] = useState<string | null>(null);
    const [cameras, setCameras] = useState<any[]>([]);
    const [manualCode, setManualCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        Html5Qrcode.getCameras().then(devices => {
            if (!devices.length) {
                toast.error('No camera found');
                return;
            }
            const back = devices.find(d => d.label.toLowerCase().includes('back')) || devices[0];
            setCameras(devices);
            setCameraId(back.id);
        });
    }, []);

    useEffect(() => {
        if (!cameraId || result) return;

        qrRef.current = new Html5Qrcode('reader');
        qrRef.current.start(
            { deviceId: { exact: cameraId } },
            { fps: 15, qrbox: { width: 250, height: 250 } },
            decoded => {
                const code = extractCode(decoded);
                if (code) {
                    stopScanner();
                    verifyCode(code);
                }
            }
        ).catch(err => console.error("Scanner error", err));

        return () => stopScanner();
    }, [cameraId, result]);

    const stopScanner = async () => {
        if (qrRef.current?.isScanning) {
            await qrRef.current.stop();
        }
    };

    const extractCode = (value: string): string | null => {
        if (value.includes('/claim/')) return value.split('/claim/').pop() ?? null;
        if (value.startsWith('PPC-')) return value;
        return null;
    };

    const verifyCode = async (code: string) => {
        setLoading(true);
        try {
            const res = await axios.post('/branch/vouchers/verify', { code });
            setResult(res.data);
            if (res.data.status === 'claimed') {
                toast.info('Code already registered');
            } else {
                toast.success('Genuine Code Verified');
            }
        } catch (e: any) {
            setResult({
                success: false,
                message: e.response?.data?.message || 'Invalid Privilege Code',
            });
            toast.error('Verification Failed');
        } finally {
            setLoading(false);
        }
    };

    const resetScanner = () => {
        setResult(null);
        setManualCode('');
    };

    return (
        <AppLayout>
            <Head title="PPC Scanner" />

            <div className="max-w-2xl mx-auto p-4 md:p-8 space-y-8">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center space-y-2">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary mb-2">
                        <QrCode size={32} />
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight">PPC Scanner</h1>
                    <p className="text-muted-foreground max-w-xs">
                        Scan the QR code on the customer's voucher to verify authenticity.
                    </p>
                </div>

                {!result ? (
                    <div className="grid gap-6 animate-in zoom-in-95 duration-300">
                        {/* Camera Section */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                            <Card className="relative aspect-square overflow-hidden rounded-[2rem] border-0 bg-black shadow-2xl">
                                <div id="reader" className="w-full h-full" />
                                
                                {/* Scanning Overlay UI */}
                                <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
                                    <div className="w-full h-full border-2 border-white/20 rounded-lg relative">
                                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-md"></div>
                                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-md"></div>
                                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-md"></div>
                                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-md"></div>
                                    </div>
                                </div>

                                {cameras.length > 1 && (
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        onClick={() => setCameraId(cameras.find(c => c.id !== cameraId).id)}
                                        className="absolute bottom-6 right-6 rounded-full shadow-lg bg-white/10 backdrop-blur-md hover:bg-white/20 border-white/10"
                                    >
                                        <RotateCcw size={18} className="text-white" />
                                    </Button>
                                )}
                            </Card>
                        </div>

                        {/* Manual Input */}
                        <Card className="p-1.5 rounded-2xl border-muted/40 shadow-sm overflow-hidden">
                            <div className="flex items-center">
                                <Input
                                    placeholder="Enter Code Manually (e.g. PPC-XXXX)"
                                    value={manualCode}
                                    onChange={e => setManualCode(e.target.value.toUpperCase())}
                                    className="border-0 focus-visible:ring-0 text-lg font-mono placeholder:font-sans"
                                />
                                <Button 
                                    onClick={() => manualCode && verifyCode(manualCode)}
                                    disabled={loading || !manualCode}
                                    className="rounded-xl px-6"
                                >
                                    {loading ? "..." : <Search size={20} />}
                                </Button>
                            </div>
                        </Card>
                    </div>
                ) : (
                    /* Result Section */
                    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                        <Card className={`overflow-hidden border-t-8 shadow-2xl rounded-3xl ${
                            result.success 
                            ? (result.status === 'claimed' ? 'border-amber-500' : 'border-green-500') 
                            : 'border-red-500'
                        }`}>
                            <div className="p-8">
                                <div className="flex flex-col items-center text-center mb-8">
                                    {result.success ? (
                                        result.status === 'claimed' ? (
                                            <div className="bg-amber-100 p-4 rounded-full text-amber-600 mb-4">
                                                <AlertCircle size={48} />
                                            </div>
                                        ) : (
                                            <div className="bg-green-100 p-4 rounded-full text-green-600 mb-4">
                                                <CheckCircle2 size={48} />
                                            </div>
                                        )
                                    ) : (
                                        <div className="bg-red-100 p-4 rounded-full text-red-600 mb-4">
                                            <XCircle size={48} />
                                        </div>
                                    )}
                                    
                                    <h2 className="text-2xl font-bold">{result.message}</h2>
                                    {result.status === 'claimed' && (
                                        <Badge variant="outline" className="mt-2 bg-amber-50 text-amber-700 border-amber-200 uppercase tracking-widest">
                                            Already Registered
                                        </Badge>
                                    )}
                                </div>

                                {result.data && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/30 p-6 rounded-2xl border border-muted/50">
                                        <InfoTile label="Voucher Code" value={result.data.code} icon={<QrCode size={16}/>} mono />
                                        <InfoTile label="Privilege Type" value={result.data.template} icon={<ShieldCheck size={16}/>} />
                                        <InfoTile label="Issuing Branch" value={result.data.branch} icon={<MapPin size={16}/>} />
                                        <InfoTile label="Issued By" value={result.data.created_by} icon={<User size={16}/>} />
                                        <InfoTile label="Issue Date" value={result.data.created_at} icon={<Calendar size={16}/>} />
                                        {result.data.claimed_at && (
                                            <InfoTile label="Claimed On" value={result.data.claimed_at} icon={<CheckCircle2 size={16}/>} highlight />
                                        )}
                                    </div>
                                )}

                                <Button 
                                    className="w-full mt-8 h-14 text-lg rounded-2xl shadow-xl"
                                    onClick={resetScanner}
                                >
                                    Scan Next Voucher
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function InfoTile({ label, value, icon, mono = false, highlight = false }) {
    return (
        <div className={`p-3 rounded-xl flex items-start gap-3 ${highlight ? 'bg-amber-500/10 border border-amber-200' : ''}`}>
            <div className="mt-1 text-muted-foreground">{icon}</div>
            <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">{label}</p>
                <p className={`text-sm font-semibold ${mono ? 'font-mono' : ''} ${highlight ? 'text-amber-700' : ''}`}>
                    {value}
                </p>
            </div>
        </div>
    );
}