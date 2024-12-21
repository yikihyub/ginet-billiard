// Step2.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as z from "zod";

// 폼 유효성 검증 스키마
const signupSchema = z
  .object({
    name: z.string().min(2, "이름을 입력해주세요"),
    email: z.string().email("올바른 이메일을 입력해주세요"),
    password: z.string().min(8, "비밀번호는 8자 이상이어야 합니다"),
    passwordConfirm: z.string(),
    nickname: z.string().min(2, "닉네임을 입력해주세요"),
    phone: z
      .string()
      .regex(
        /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
        "올바른 전화번호를 입력해주세요"
      ),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

// 타입 추론을 위한 타입 정의
type FormValues = z.infer<typeof signupSchema>;

export default function Step4({
  onNext,
}: {
  onNext: (data: FormValues) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      nickname: "",
      phone: "",
    },
  });

  // form의 현재 상태를 부모 컴포넌트로 전달
  const handleNext = async () => {
    const isValid = await form.trigger(); // await 추가
    if (isValid) {
      const values = form.getValues();
      onNext(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleNext)} className="space-y-6">
        <h2 className="text-xl font-bold">회원 정보를 입력해주세요.</h2>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이름</FormLabel>
              <FormControl>
                <Input
                  placeholder="이름을 입력해주세요"
                  className="w-full p-5 h-12 border-none rounded-lg text-base bg-gray-100"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>이메일</FormLabel>
              <FormControl>
                <Input
                  placeholder="이메일을 입력해주세요"
                  type="email"
                  className="w-full p-5 h-12 border-none rounded-lg text-base bg-gray-100"
                  {...field}
                />
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
              <FormLabel>비밀번호</FormLabel>
              <FormControl>
                <Input
                  placeholder="비밀번호를 입력해주세요"
                  type="password"
                  className="w-full p-5 h-12 border-none rounded-lg text-base bg-gray-100"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwordConfirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>비밀번호 확인</FormLabel>
              <FormControl>
                <Input
                  placeholder="비밀번호를 다시 입력해주세요"
                  type="password"
                  className="w-full p-5 h-12 border-none rounded-lg text-base bg-gray-100"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>닉네임</FormLabel>
              <FormControl>
                <Input
                  placeholder="닉네임을 입력해주세요"
                  className="w-full p-5 h-12 border-none rounded-lg text-base bg-gray-100"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>휴대전화</FormLabel>
              <FormControl>
                <Input
                  placeholder="휴대전화 번호를 입력해주세요"
                  type="tel"
                  className="w-full p-5 h-12 border-none rounded-lg text-base bg-gray-100"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}
      </form>
    </Form>
  );
}
