"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { login } from "@/lib/api/auth.service" // Import the login service

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null); // State for login errors
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError(null); // Clear previous errors
    try {
      // Assuming the login function expects username and password
      // And stores the token and user profile in localStorage
      await login(email, password);
      setShowSuccess(true);
      setTimeout(() => {
        router.push("/produtos");
      }, 2000);
    } catch (error: any) {
      console.error("Login failed:", error);
      setLoginError(error.response?.data?.message || "Erro no login. Verifique suas credenciais.");
    }
  }

  return (
    <div className="min-h-screen bg-[#fbf9f9] flex font-sans">
      {/* Left side - Illustration */}
      <div className="flex-1 relative overflow-hidden bg-[#fbf9f9] flex items-center justify-center">
        <div className="w-full h-full relative">
          <Image
            src="/new-login-illustration.png"
            alt="Login illustration with person in shopping cart and location pin"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md text-center">
          <h1 className="text-4xl font-bold text-[#032612] mb-12">Login</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Informe seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 px-4 bg-white border-0 rounded-full text-[#968e8e] placeholder:text-[#968e8e] focus:ring-2 focus:ring-[#fa6924] focus:ring-offset-0 shadow-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 px-4 bg-white border-0 rounded-full text-[#968e8e] placeholder:text-[#968e8e] focus:ring-2 focus:ring-[#fa6924] focus:ring-offset-0 shadow-sm"
                required
              />
            </div>

            <div className="text-left">
              <Link href="/forgot-password" className="text-sm text-[#968e8e] hover:text-[#fa6924] transition-colors">
                Esqueci minha senha
              </Link>
            </div>

            <Button
              type="submit"
              className="w-48 h-12 bg-[#fa6924] hover:bg-[#e55a1f] text-white font-semibold rounded-full transition-colors mx-auto block"
            >
              Entrar
            </Button>
          </form>

          {showSuccess && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-full text-center">
              <p className="text-green-700 font-medium">✅ Login realizado com sucesso! Redirecionando...</p>
            </div>
          )}

          {loginError && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-full text-center">
              <p className="text-red-700 font-medium">❌ {loginError}</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <span className="text-[#968e8e]">Não tem uma conta? </span>
            <Link href="/register" className="text-[#968e8e] hover:text-[#fa6924] font-medium transition-colors">
              Cadastrar
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}