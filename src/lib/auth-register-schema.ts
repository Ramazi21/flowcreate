import { z } from "zod";

export const loginFieldSchema = z
  .string()
  .trim()
  .min(3, "Логин не короче 3 символов")
  .max(32, "Логин не длиннее 32 символов")
  .regex(/^[a-zA-Z0-9_]+$/, "Логин: латиница, цифры и подчёркивание");

export const registerBodySchema = z
  .object({
    login: loginFieldSchema,
    email: z.string().trim().email("Некорректный email"),
    password: z.string().min(8, "Пароль не короче 8 символов"),
    passwordConfirm: z.string(),
    vkCode: z
      .string()
      .trim()
      .min(6, "Введите код от бота")
      .max(32, "Код слишком длинный"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Пароли не совпадают",
    path: ["passwordConfirm"],
  });

export type RegisterBody = z.infer<typeof registerBodySchema>;
