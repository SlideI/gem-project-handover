import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">Welcome to AAMP Plan Builder</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Create and manage your plan with ease
        </p>
        <Button
          size="lg"
          onClick={() => navigate(isAuthenticated ? "/plan" : "/auth")}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;
