import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'

import { memo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { LoginSchema } from '@/services/auth/auth.dto'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LoginPageSearch, loginSchema } from '@/services/auth/auth.dto'
import { TextInput } from '@/components/text-input'
import { useAuthMutations } from '@/services/auth/mutations'
import { Spinner } from '@/components/ui/spinner'

export const Route = createFileRoute('/__auth/login')({
  validateSearch: (search) => LoginPageSearch.parse(search),
  component: memo(LoginRoute),
})

function LoginRoute() {
  const navigate = useNavigate()
  const search = useSearch({
    from: '/__auth/login',
  })
  // initialize the mutations
  const {
    login: { mutateAsync, isPending },
  } = useAuthMutations()

  // initialize the form
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  // handle the form submission
  const onSubmit = async (data: LoginSchema) => {
    await mutateAsync(data, {
      onSuccess: () => {
        // Decode the redirect URL if it exists, otherwise default to /dashboard
        const redirectPath = search.redirect
          ? decodeURIComponent(search.redirect)
          : '/dashboard'

        navigate({
          to: redirectPath.startsWith('/') ? redirectPath : `/${redirectPath}`,
          replace: true,
        })
      },
    })
  }

  return (
    <div className="flex-1 flex-col flex items-center justify-center p-8">
      <Card className="w-full max-w-md shadow-none border-0">
        {/* Logo */}
        <CardHeader>
          {/* Welcome Text */}
          <div>
            <h1 className="text-[#1d2939] text-3xl font-bold mb-3">
              Welcome back
            </h1>
            <p className="text-[#909090] text-sm leading-relaxed">
              Please enter your username and password to access your account
            </p>
          </div>
        </CardHeader>

        {/* Login Form */}
        <CardContent>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Username Field */}
            <div className="space-y-2">
              <TextInput
                control={form.control}
                name="username"
                label="Email"
                error={form.formState.errors.username?.message}
                type="text"
                placeholder="Enter email"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <TextInput
                control={form.control}
                type="password"
                placeholder="Enter password"
                name="password"
                label="Password"
                error={form.formState.errors.password?.message}
              />
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-12 bg-[#4a1fb8] hover:bg-[#3d1a9a] text-white font-medium text-base rounded-lg"
            >
              Login
              {isPending && <Spinner />}
            </Button>
          </form>
        </CardContent>
      </Card>
      {/* Footer */}
      <div className="mt-16 text-center">
        <p className="text-[#4a1fb8] text-sm">
          Powered by FaithBase Technologies
        </p>
      </div>
    </div>
  )
}
