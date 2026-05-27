import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';

export async function POST(request: Request) {
  try {
    const { fileName, clientName, serviceName } = await request.json();

    if (!fileName || !clientName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Extract extension
    const ext = fileName.split('.').pop();
    
    // Format Auto-Rename: [JenisLayanan/NamaSurat]_[NamaKlien].[ekstensi]
    // Clean strings to be URL friendly
    const safeServiceName = (serviceName || 'Document').replace(/[^a-zA-Z0-9]/g, '_');
    const safeClientName = clientName.replace(/[^a-zA-Z0-9]/g, '_');
    const newFileName = `${safeServiceName}_${safeClientName}.${ext}`;
    
    // Path inside bucket: clientName/fileName
    const filePath = `${safeClientName}/${newFileName}`;

    // Create a signed upload URL valid for 10 minutes (600 seconds)
    const { data, error } = await supabaseAdmin
      .storage
      .from('draft-files')
      .createSignedUploadUrl(filePath);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      signedUrl: data.signedUrl,
      path: filePath,
      fileName: newFileName,
    });
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
