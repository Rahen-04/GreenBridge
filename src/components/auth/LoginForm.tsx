import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

// Form validation schema
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().default(false),
  isFarmer: z.boolean().default(false),
  aadhaarNumber: z.string().optional().refine(
    (val) => {
      if (!val) return true;
      return /^\d{12}$/.test(val);
    },
    { message: "Aadhaar number must be 12 digits" }
  ),
});

type FormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onLoginSuccess?: (isFarmer: boolean, email: string, aadhaarNumber?: string) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
      isFarmer: false,
      aadhaarNumber: "",
    },
  });

  // Watch isFarmer value to conditionally show Aadhaar field
  const isFarmer = form.watch("isFarmer");

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    console.log(data);
    
    // Mock authentication success
    toast({
      title: isSignup ? "Account Created" : "Login Successful",
      description: `Welcome ${isSignup ? "to AgroCraft" : "back"}, ${data.isFarmer ? "Farmer" : "Customer"}!`,
    });
    
    // Call the callback if provided
    if (onLoginSuccess) {
      onLoginSuccess(data.isFarmer, data.email, data.aadhaarNumber);
    }
  };

  return (
    <div className="w-full max-w-md">
      <Card className="border-green-100 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isSignup ? "Create an Account" : "Welcome Back"}
          </CardTitle>
          <CardDescription className="text-center">
            {isSignup ? "Sign up to start selling or buying organic products" : "Sign in to your account to continue"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {isSignup && (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="John Doe"
                      className="pl-10"
                    />
                  </div>
                </FormItem>
              )}
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="email@example.com"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {showPassword ? "Hide password" : "Show password"}
                          </span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {!isSignup && (
                <div className="flex justify-between items-center">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="text-sm cursor-pointer">Remember me</FormLabel>
                      </FormItem>
                    )}
                  />
                  
                  <a href="#" className="text-sm text-green-600 hover:underline">
                    Forgot password?
                  </a>
                </div>
              )}

              <FormField
                control={form.control}
                name="isFarmer"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Farmer Account</FormLabel>
                      <FormDescription className="text-xs">
                        {isSignup 
                          ? "Switch on if you want to sell products as a farmer" 
                          : "Switch on if you're a farmer selling products"}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {isSignup && isFarmer && (
                <FormField
                  control={form.control}
                  name="aadhaarNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aadhaar Number</FormLabel>
                      <FormDescription className="text-xs">
                        Required for farmer verification. Enter your 12-digit Aadhaar number.
                      </FormDescription>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            maxLength={12}
                            placeholder="123456789012"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                {isSignup ? "Create Account" : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-muted-foreground/20" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <Button variant="outline" className="w-full">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M12 2C6.477 2 2 6.477 2 12C2 16.991 5.657 21.128 10.438 21.879V14.89H7.898V12H10.438V9.797C10.438 7.291 11.93 5.907 14.215 5.907C15.309 5.907 16.453 6.102 16.453 6.102V8.562H15.193C13.95 8.562 13.563 9.333 13.563 10.124V12H16.336L15.893 14.89H13.563V21.879C18.343 21.129 22 16.99 22 12C22 6.477 17.523 2 12 2Z"
                  fill="currentColor"
                />
              </svg>
              Facebook
            </Button>
            <Button variant="outline" className="w-full">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12 4C16.418 4 20 7.582 20 12C20 16.418 16.418 20 12 20C7.582 20 4 16.418 4 12C4 7.582 7.582 4 12 4Z"
                  fill="currentColor"
                />
                <path
                  d="M6.023 12.341L10.023 8.341C10.414 7.95 11.048 7.95 11.439 8.341C11.83 8.732 11.83 9.366 11.439 9.757L8.878 12.317H17C17.552 12.317 18 12.765 18 13.317C18 13.869 17.552 14.317 17 14.317H8.878L11.439 16.878C11.83 17.269 11.83 17.903 11.439 18.294C11.048 18.684 10.414 18.684 10.023 18.294L6.023 14.294C5.633 13.903 5.633 13.269 6.023 12.878L6.023 12.341Z"
                  fill="currentColor"
                />
              </svg>
              Google
            </Button>
          </div>

          <div className="text-center text-sm">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <Button 
              variant="link" 
              className="p-0 h-auto text-green-600"
              onClick={() => setIsSignup(!isSignup)}
            >
              {isSignup ? "Sign in" : "Sign up"}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
