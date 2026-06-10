export async function POST(req: NextRequest) {
  try {
    // Obtener token del header
    const authHeader = req.headers.get('authorization');
    let userId = 'user-123'; // Default si no hay token

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      // Aquí validarías el token si es necesario
      // Por ahora usamos el token como está
    }

    const { question } = await req.json();

    if (!question) {
      return NextResponse.json(
        { error: 'Missing question' },
        { status: 400 }
      );
    }

    const message = await client.messages.create({
      // ... resto del código igual
    });

    const response = (message.content[0] as { type: string; text: string }).text;

    const { error: dbError } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        question,
        response,
      });

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}