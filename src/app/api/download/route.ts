import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase/admin';
import JSZip from 'jszip';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId'); 

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    // List all files in the order's folder
    const { data: files, error: listError } = await supabaseAdmin
      .storage
      .from('draft-files')
      .list(orderId);

    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    if (!files || files.length === 0) {
      return new NextResponse("Tidak ada dokumen yang diunggah untuk pesanan ini.", { status: 404 });
    }

    const zip = new JSZip();

    // Download each file and add to zip
    for (const file of files) {
      // Skip folders
      if (!file.name || file.name === '.emptyFolderPlaceholder') continue;

      const { data: fileData, error: downloadError } = await supabaseAdmin
        .storage
        .from('draft-files')
        .download(`${orderId}/${file.name}`);

      if (downloadError) {
        console.error(`Failed to download ${file.name}:`, downloadError);
        continue;
      }

      const arrayBuffer = await fileData.arrayBuffer();
      zip.file(file.name, arrayBuffer);
    }

    // Generate zip buffer
    const zipBlob = await zip.generateAsync({ type: 'blob' });

    return new NextResponse(zipBlob, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="dokumen_klien_${orderId}.zip"`,
      },
    });
  } catch (error) {
    console.error('Error generating zip:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
