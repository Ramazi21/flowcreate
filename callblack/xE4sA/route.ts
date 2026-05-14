import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // 1. Подтверждение сервера для ВК
        // 'confirmation' — это тип запроса, который ВК присылает для проверки адреса
        if (data.type === 'confirmation' && data.group_id === 238613145) {
            // Возвращаем строку подтверждения из твоего скриншота
            return new NextResponse('be51d80c');
        }

        // 2. Обработка других событий (например, новых сообщений)
        // ВК требует, чтобы на любой запрос сервер отвечал строкой "ok"
        return new NextResponse('ok');

    } catch (error) {
        console.error('Ошибка в ВК Callback:', error);
        return new NextResponse('error', { status: 500 });
    }
}