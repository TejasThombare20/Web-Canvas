"use client"
import { useState } from "react";
import { useToast } from "./ui/use-toast";
import {signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";


const SignOutButton = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { toast } = useToast();
  
    const signOutwithGoogle = async () => {
      setLoading(true);
  
      try {
        await signOut();
      } catch (error) {
        toast({
          title: "Error signing in ",
          description: "Please try again after a moment.",
          variant: "destructive",
        });
      }
    };
    return (
      <Button 
      variant="outline"
      onClick={signOutwithGoogle}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        SignOut
      </Button>
    );
}

export default SignOutButton