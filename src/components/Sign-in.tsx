"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const SignInButton = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const signInwithGoogle = async () => {
    setLoading(true);

    try {
      await signIn("google");
    } catch (error) {
      toast({
        title: "Error signing in ",
        description: "Please try again after a moment.",
        variant: "destructive",
      });
    }
  };
  return (
    <Button variant="outline" onClick={signInwithGoogle}>
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      SignIn
    </Button>
  );
};

export default SignInButton;
