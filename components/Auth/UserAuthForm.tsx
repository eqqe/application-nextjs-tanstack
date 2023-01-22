'use client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { testUser } from '@/lib/demo/testUser';

let formSchema = z.object({
    email: z.string().email({ message: 'Enter a valid email address' }),
});
type UserFormValue = z.infer<typeof formSchema>;

export function UserAuthForm() {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') ?? '/';

    const [loading, setLoading] = useState(false);
    const form = useForm<UserFormValue>({
        resolver: zodResolver(formSchema),
    });

    const signInEmail = useCallback(
        async ({ email }: { email: string }) => {
            await signIn('email', {
                email,
                callbackUrl,
            });
        },
        [callbackUrl]
    );

    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            signIn('credentials', {
                email: testUser.email,
                callbackUrl,
            });
        }
    }, [callbackUrl]);

    const onSubmit = async (data: UserFormValue) => {
        setLoading(true);
        await signInEmail({ email: data.email });
    };

    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="Enter your email..."
                                        disabled={loading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button disabled={loading} className="ml-auto w-full" type="submit">
                        Continue with email
                    </Button>
                </form>
            </Form>
        </>
    );
}
