import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Pregunta inválida' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY no configurada');
      return NextResponse.json(
        { error: 'Servidor no configurado correctamente' },
        { status: 500 }
      );
    }

    // Llamar a Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-8',
        max_tokens: 1024,
        system: `Eres un consultor contable experto para el estudio GeoTax SAS (Buenos Aires).
Responde preguntas sobre:
- IVA (Impuesto al Valor Agregado)
- DDJJ (Declaraciones Juradas)
- VEPs (Volantes de Endeudamiento)
- Mensajes ARCA (Administración Federal de Ingresos Públicos)
- Impuestos y obligaciones fiscales en Argentina

Sé preciso, profesional y proporciona respuestas claras en español.
Si no sabes la respuesta, indica que el cliente debe contactar directamente con GeoTax.`,
        messages: [
          {
            role: 'user',
            content: question,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error de Claude API:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      });
      return NextResponse.json(
        {
          error: `Error ${response.status}: ${errorData.error?.message || 'Error al procesar la pregunta'}`,
          details: process.env.NODE_ENV === 'development' ? errorData : undefined
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const reply = data.content[0]?.text || 'Sin respuesta';

    return NextResponse.json({
      response: reply,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error en /api/chat:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
