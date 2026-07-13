import { NextRequest, NextResponse } from 'next/server';
import { verifyAndConsumeTrial } from '@/app/actions/trial-manager';
import { getFileValidator } from '@/lib/validations/file-rules';

export const runtime = 'nodejs';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type debe ser application/json' },
        { status: 415 }
      );
    }

    const body = await req.json();
    const { size, type, name } = body;

    if (size === undefined || !type || !name) {
      return NextResponse.json(
        { error: 'No se recibio ningun archivo.' },
        { status: 400 }
      );
    }

    const validator = getFileValidator(false, false);
    const validationResult = validator.safeParse({
      size,
      type,
      name,
    });

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 422 }
      );
    }

    const trialStatus = await verifyAndConsumeTrial();
    if (!trialStatus.success) {
      return NextResponse.json(
        { error: trialStatus.error },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error(
      '[PROCESS_DOC_ERROR]:',
      error instanceof Error ? error.message : 'unknown'
    );
    return NextResponse.json(
      { error: 'Error interno. Intente nuevamente.' },
      { status: 500 }
    );
  }
}