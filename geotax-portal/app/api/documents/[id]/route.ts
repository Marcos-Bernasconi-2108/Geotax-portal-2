import { NextRequest, NextResponse } from 'next/server';
import { validateDocumentAccess } from '@/lib/auth';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
)
) {
  try {
    // 1. OBTENER JWT DEL HEADER
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);

    // 2. VERIFICAR JWT Y OBTENER USER
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user?.id) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // 3. VALIDAR AUTORIZACIÓN
    const { authorized, error } = await validateDocumentAccess(
      user.id,
      params.id
    );

    if (!authorized) {
      // LOG: Intento fallido
      await supabase.from('audit_logs').insert({
        user_id: user.id,
        action: 'download',
        resource_type: 'document',
        resource_id: params.id,
        status: 'failure',
        error_message: error
      });

      return NextResponse.json(
        { error: error || 'Forbidden' },
        { status: 403 }
      );
    }

    // 4. OBTENER DOCUMENTO
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', params.id)
      .single();

    if (docError || !document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    // 5. LOG: Acceso exitoso
    await supabase.from('audit_logs').insert({
      user_id: user.id,
      action: 'download',
      resource_type: 'document',
      resource_id: params.id,
      status: 'success'
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}