import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Valida que el usuario tiene autorización para acceder a un documento
 */
export async function validateDocumentAccess(
  userId: string,
  documentId: string
) {
  try {
    // 1. Obtener el documento
    const { data: document, error: docError } = await supabase
      .from('documents')
      .select('client_id')
      .eq('id', documentId)
      .single();

    if (docError || !document) {
      return { authorized: false, error: 'Document not found' };
    }

    // 2. Obtener el rol y client_id del usuario
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('role, client_id')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return { authorized: false, error: 'User not found' };
    }

    // 3. Verificar si es admin (puede ver todo) o cliente (solo su datos)
    const isAdmin = user.role === 'admin';
    const isOwner = user.client_id === document.client_id;

    if (!isAdmin && !isOwner) {
      return { authorized: false, error: 'Forbidden' };
    }

    return { authorized: true };
  } catch (error) {
    console.error('Authorization check error:', error);
    return { authorized: false, error: 'Internal error' };
  }
}

/**
 * Extrae el user_id del header Authorization
 */
export function extractUserIdFromHeader(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }
  
  try {
    const token = authHeader.slice(7);
    // Nota: En producción, deberías verificar el JWT correctamente
    // Por ahora, asumimos que Supabase lo valida
    return token;
  } catch {
    return null;
  }
}