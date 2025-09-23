import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { login } from '@/lib/auth';
import { AlertCircle, GraduationCap } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const user = await login(email, password); // mock or real login API

    if (user) {
      // Save user in localStorage
      localStorage.setItem("currentUser", JSON.stringify(user));

      if (user.role === "student") {
        try {
          //  Check if this student already has a profile in DB
          const res = await fetch(`http://localhost:5000/students/${user.id}`);
          
          if (res.status === 404) {
            //  No profile → redirect to profile completion
            navigate("/student/profile");
          } else {
            //  Profile exists → go to dashboard
            navigate("/student");
          }
        } catch (err) {
          console.error("Error checking student profile:", err);
          // fallback: ask them to complete profile
          navigate("/student/profile");
        }
      } else {
        // Roles other than student → direct to their dashboards
        switch (user.role) {
          case "registrar":
            navigate("/staff/registrar");
            break;
          case "cashier":
            navigate("/staff/cashier");
            break;
          case "admin":
            navigate("/admin");
            break;
          default:
            navigate("/");
        }
      }
    } else {
      setError("Invalid email or password");
    }
  } catch (err) {
    console.error(err);
    setError("Login failed. Please try again.");
  } finally {
    setLoading(false);
  }
};



  const quickLogin = (role: string, email: string) => {
    setEmail(email);
    setPassword('password123');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 relative"
      style={{ backgroundImage: "url('/ptcfront.png')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative w-full max-w-md space-y-6 z-10">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="flex justify-center">
              <img
                src="/ptclogo.png"
                alt="PTC Logo"
                className="h-20 w-20 rounded-full shadow-lg object-contain bg-white p-1"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            PTC Queue System
          </h1>
          <p className="text-muted-foreground">Sign in to access your dashboard</p>
        </div>

        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle>Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="text-sm">Demo Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => quickLogin('student', 'juan.santos@ptc.edu.ph')}
            >
              Student: juan.santos@ptc.edu.ph
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => quickLogin('registrar', 'e.rodriguez@ptc.edu.ph')}
            >
              Registrar: e.rodriguez@ptc.edu.ph
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => quickLogin('cashier', 'c.mendoza@ptc.edu.ph')}
            >
              Cashier: c.mendoza@ptc.edu.ph
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-start"
              onClick={() => quickLogin('admin', 'p.santos@ptc.edu.ph')}
            >
              Admin: p.santos@ptc.edu.ph
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              Password for all demo accounts: password123
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
