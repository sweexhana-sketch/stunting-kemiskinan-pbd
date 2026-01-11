import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LogIn, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { toast } = useToast();

    const from = (location.state as any)?.from?.pathname || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const success = await login({ username, password });

            if (success) {
                toast({
                    title: 'Login Berhasil',
                    description: `Selamat datang, ${username}!`,
                });
                navigate(from, { replace: true });
            } else {
                setError('Username atau password salah');
            }
        } catch (err) {
            setError('Terjadi kesalahan saat login');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-4 text-center">
                    <div className="mx-auto flex items-center justify-center gap-4">
                        <img src="/images/logo-pbd.png" alt="Logo Papua Barat Daya" className="h-20 w-auto object-contain" />
                        <img src="/images/logo-pupr.png" alt="Logo PUPR" className="h-20 w-auto object-contain" />
                    </div>
                    <div>
                        <CardTitle className="text-xl leading-relaxed">
                            SIGAP-DINAS PEKERJAAN UMUM DAN PERUMAHAN RAKYAT<br />PROVINSI PAPUA BARAT DAYA
                        </CardTitle>
                        <CardDescription className="mt-2">
                            Sistem Informasi Geospasial Analisis Stunting dan Kemiskinan
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Masukkan username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Masukkan password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            <LogIn className="mr-2 h-4 w-4" />
                            {isLoading ? 'Memproses...' : 'Login'}
                        </Button>

                        <div className="rounded-lg bg-muted p-4 text-sm">
                            <p className="mb-2 font-semibold">Akun Demo:</p>
                            <div className="space-y-1 text-muted-foreground">
                                <p>Admin: <code className="rounded bg-background px-1">admin</code> / <code className="rounded bg-background px-1">admin123</code></p>
                                <p>Data Entry: <code className="rounded bg-background px-1">dataentry</code> / <code className="rounded bg-background px-1">entry123</code></p>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
