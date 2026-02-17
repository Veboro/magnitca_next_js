import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (authLoading) return;
    
    if (!user) {
      setIsAdmin(false);
      return;
    }

    const checkAdmin = async () => {
      const { data, error } = await supabase.rpc("has_role" as any, {
        _user_id: user.id,
        _role: "admin",
      });
      setIsAdmin(!error && data === true);
    };

    checkAdmin();
  }, [user, authLoading]);

  if (authLoading || isAdmin === null) {
    return (
      <main className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Завантаження...</div>
      </main>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
