import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function ClaimPPC({ voucherCode, companyName }: { voucherCode: string, companyName: string }) {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        customer_name: '',
        customer_email: '',
        customer_whatsapp: '',
        vehicle_registration: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/claim/${voucherCode}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-bold">Claim Your Offer</CardTitle>
                    <CardDescription>
                        Fill in your details to activate code: <span className="font-mono font-bold text-primary">{voucherCode}</span> at {companyName}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {wasSuccessful ? (
                        <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center font-medium">
                            Thank you! Your offer has been claimed.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" value={data.customer_name} onChange={e => setData('customer_name', e.target.value)} placeholder="John Doe" />
                                {errors.customer_name && <p className="text-red-500 text-sm">{errors.customer_name}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" type="email" value={data.customer_email} onChange={e => setData('customer_email', e.target.value)} placeholder="john@example.com" />
                                {errors.customer_email && <p className="text-red-500 text-sm">{errors.customer_email}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="whatsapp">WhatsApp Number</Label>
                                <Input id="whatsapp" value={data.customer_whatsapp} onChange={e => setData('customer_whatsapp', e.target.value)} placeholder="+91 XXXXX XXXXX" />
                                {errors.customer_whatsapp && <p className="text-red-500 text-sm">{errors.customer_whatsapp}</p>}
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing ? 'Processing...' : 'Claim Voucher'}
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}