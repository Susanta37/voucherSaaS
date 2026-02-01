import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Camera, ShieldCheck, XCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

export default function Scanner() {
    const [verificationResult, setVerificationResult] = useState<any>(null);
    const [isScanning, setIsScanning] = useState(true);

    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            fps: 10,
            qrbox: { width: 250, height: 250 },
        }, false);

        scanner.render(onScanSuccess, onScanFailure);

        function onScanSuccess(decodedText: string) {
            // Stop scanner after success to process
            scanner.clear();
            setIsScanning(false);
            verifyCode(decodedText);
        }

        function onScanFailure(error: any) {
            // Silent error for continuous scanning
        }

        return () => scanner.clear();
    }, []);

    const verifyCode = async (code: string) => {
        try {
            const response = await axios.post('/branch/vouchers/verify', { code });
            setVerificationResult({ success: true, ...response.data });
            toast.success("Voucher Verified!");
        } catch (error: any) {
            setVerificationResult({ 
                success: false, 
                message: error.response?.data?.message || "Verification Failed" 
            });
            toast.error("Invalid Code");
        }
    };

    return (
        <AppLayout>
            <Head title="Scan Privilege Code" />
            <div className="max-w-xl mx-auto p-6 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl font-bold">PPC Scanner</h1>
                    <p className="text-muted-foreground">Scan a customer's QR code to verify their privilege status.</p>
                </div>

                <Card className="overflow-hidden border-2 border-primary/20 rounded-3xl bg-black">
                    <div id="reader" className="w-full"></div>
                </Card>

                {verificationResult && (
                    <Card className={`p-6 border-2 animate-in fade-in zoom-in duration-300 ${
                        verificationResult.success ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'
                    }`}>
                        <div className="flex items-center gap-4">
                            {verificationResult.success ? (
                                <ShieldCheck className="text-green-500 h-10 w-10" />
                            ) : (
                                <XCircle className="text-red-500 h-10 w-10" />
                            )}
                            <div>
                                <h3 className="font-bold text-lg">{verificationResult.message}</h3>
                                {verificationResult.data && (
                                    <p className="text-sm opacity-80 font-mono">CODE: {verificationResult.data.code}</p>
                                )}
                            </div>
                        </div>
                        <Button 
                            className="w-full mt-4" 
                            variant="outline"
                            onClick={() => window.location.reload()}
                        >
                            Scan Next
                        </Button>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}