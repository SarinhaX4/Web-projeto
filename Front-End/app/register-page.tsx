"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { register } from "@/lib/api/auth.service"

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [cpf, setCpf] = useState("")
    const [birthDate, setBirthDate] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showSuccess, setShowSuccess] = useState(false)
    const [registerError, setRegisterError] = useState<string | null>(null)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setRegisterError(null)

        if (password !== confirmPassword) {
            setRegisterError("As senhas não coincidem.")
            return
        }

        try {
            await register({
                username: name,
                email: email,
                password: password,
                phone: phone,
                birthDate: birthDate,
                cpf: cpf,
                address: "",
                role: "customer",
            });
            setShowSuccess(true)
            setTimeout(() => {
                router.push("/")
            }, 2000)
        } catch (error: any) {
            console.error("Registration failed:", error)
            setRegisterError(error.response?.data?.message || "Erro no cadastro. Tente novamente.")
        }
    }

    return (
        <div className="min-h-screen bg-[#fbf9f9] flex font-sans">
            <div className="flex-1 relative overflow-hidden bg-[#fbf9f9] flex items-center justify-center">
                <div className="w-full h-full relative">
                    <Image
                        src="/register-illustration.png"
                        alt="Registration illustration with Hello text and person in shopping cart"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md text-center">
                    <h1 className="text-4xl font-bold text-[#032612] mb-12">Cadastrar</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Input
                                type="text"
                                placeholder="Nome completo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="h-12 px-4 bg-white border-0 rounded-full text-[#968e8e] placeholder:text-[#968e8e] focus:ring-2 focus:ring-[#fa6924] focus:ring-offset-0 shadow-sm"
                                required
                                id="fullName"
                                name="fullName"
                            />
                        </div>

                        <div className="space-y-2">
                            <Input
                                type="text"
                                placeholder="CPF"
                                value={cpf}
                                onChange={(e) => setCpf(e.target.value)}
                                className="h-12 px-4 bg-white border-0 rounded-full text-[#968e8e] placeholder:text-[#968e8e] focus:ring-2 focus:ring-[#fa6924] focus:ring-offset-0 shadow-sm"
                                required
                                id="cpf"
                                name="cpf"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1 space-y-2">
                                <Input
                                    type="date"
                                    placeholder="Data de nascimento"
                                    value={birthDate}
                                    onChange={(e) => setBirthDate(e.target.value)}
                                    className="h-12 px-4 bg-white border-0 rounded-full text-[#968e8e] placeholder:text-[#968e8e] focus:ring-2 focus:ring-[#fa6924] focus:ring-offset-0 shadow-sm"
                                    required
                                    id="birthDate"
                                    name="birthDate"
                                />
                            </div>

                            <div className="flex-1 space-y-2">
                                <Input
                                    type="tel"
                                    placeholder="Telefone"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="h-12 px-4 bg-white border-0 rounded-full text-[#968e8e] placeholder:text-[#968e8e] focus:ring-2 focus:ring-[#fa6924] focus:ring-offset-0 shadow-sm"
                                    required
                                    id="phone"
                                    name="phone"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder="Seu email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-12 px-4 bg-white border-0 rounded-full text-[#968e8e] placeholder:text-[#968e8e] focus:ring-2 focus:ring-[#fa6924] focus:ring-offset-0 shadow-sm"
                                required
                                id="email"
                                name="email"
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
                                id="password"
                                name="password"
                            />
                        </div>

                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder="Repita a senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="h-12 px-4 bg-white border-0 rounded-full text-[#968e8e] placeholder:text-[#968e8e] focus:ring-2 focus:ring-[#fa6924] focus:ring-offset-0 shadow-sm"
                                required
                                id="confirmPassword"
                                name="confirmPassword"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-48 h-12 bg-[#fa6924] hover:bg-[#e55a1f] text-white font-semibold rounded-full transition-colors mx-auto block"
                        >
                            Confirmar
                        </Button>
                    </form>

                    {showSuccess && (
                        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-full text-center">
                            <p className="text-green-700 font-medium">✅ Cadastro realizado com sucesso! Redirecionando...</p>
                        </div>
                    )}

                    {registerError && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-full text-center">
                            <p className="text-red-700 font-medium">❌ {registerError}</p>
                        </div>
                    )}

                    <div className="mt-8 text-center">
                        <span className="text-[#968e8e]">Já tem uma conta? </span>
                        <Link href="/" className="text-[#968e8e] hover:text-[#fa6924] font-medium transition-colors">
                            Entrar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
