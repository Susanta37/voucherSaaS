import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Gift, Lock } from 'lucide-react';

export default function ClaimPPC({
    voucherCode,
    companyName,
}: {
    voucherCode: string;
    companyName: string;
}) {
    const { data, setData, post, processing, errors, wasSuccessful } =
        useForm({
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <Card className="w-full max-w-md shadow-2xl rounded-3xl border-border/50">
                {/* Header */}
                <CardHeader className="text-center space-y-2">
                    <div className="flex justify-center">
                        <ShieldCheck className="h-10 w-10 text-primary" />
                    </div>

                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Register Your Premsons Privilege
                    </CardTitle>

                    <CardDescription className="text-sm text-muted-foreground">
                        This official privilege entitles you to
                        <span className="font-semibold text-foreground">
                            {' '}
                            exclusive benefits and discounts
                        </span>{' '}
                        on your next car purchase at{' '}
                        <span className="font-semibold text-foreground">
                            {companyName}
                        </span>
                        .
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Voucher info */}
                    <div className="rounded-xl bg-muted/40 p-4 text-center">
                        <p className="text-xs text-muted-foreground uppercase tracking-wider">
                            Your Privilege Code
                        </p>
                        <p className="font-mono text-lg font-bold text-primary mt-1">
                            {voucherCode}
                        </p>
                    </div>

                    {/* Success */}
                    {wasSuccessful ? (
                        <div className="rounded-xl bg-green-50 border border-green-200 p-4 text-center space-y-2">
                            <Gift className="h-6 w-6 text-green-600 mx-auto" />
                            <p className="font-semibold text-green-800">
                                Privilege Registered Successfully
                            </p>
                            <p className="text-sm text-green-700">
                                Our team will contact you when exclusive offers
                                or discounts are available on your next vehicle
                                purchase.
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Why we ask */}
                            <div className="text-sm text-muted-foreground bg-background rounded-xl p-4 border border-border/50">
                                <div className="flex gap-2 items-start">
                                    <Lock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                    <p>
                                        Your details are collected only to
                                        verify this privilege and to inform you
                                        about eligible discounts. We do not
                                        share your information with third
                                        parties.
                                    </p>
                                </div>
                            </div>

                            {/* Form */}
                            <form
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={data.customer_name}
                                        onChange={(e) =>
                                            setData(
                                                'customer_name',
                                                e.target.value
                                            )
                                        }
                                        placeholder="Enter your full name"
                                    />
                                    {errors.customer_name && (
                                        <p className="text-red-500 text-sm">
                                            {errors.customer_name}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        Email Address (optional)
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.customer_email}
                                        onChange={(e) =>
                                            setData(
                                                'customer_email',
                                                e.target.value
                                            )
                                        }
                                        placeholder="you@example.com"
                                    />
                                    {errors.customer_email && (
                                        <p className="text-red-500 text-sm">
                                            {errors.customer_email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp">
                                        WhatsApp / Mobile Number
                                    </Label>
                                    <Input
                                        id="whatsapp"
                                        value={data.customer_whatsapp}
                                        onChange={(e) =>
                                            setData(
                                                'customer_whatsapp',
                                                e.target.value
                                            )
                                        }
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                    {errors.customer_whatsapp && (
                                        <p className="text-red-500 text-sm">
                                            {errors.customer_whatsapp}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="vehicle">
                                        Current Vehicle (optional)
                                    </Label>
                                    <Input
                                        id="vehicle"
                                        value={data.vehicle_registration}
                                        onChange={(e) =>
                                            setData(
                                                'vehicle_registration',
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. Swift / Baleno / Alto"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full text-base rounded-xl"
                                    disabled={processing}
                                >
                                    {processing
                                        ? 'Registering...'
                                        : 'Register My Privilege'}
                                </Button>
                            </form>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
