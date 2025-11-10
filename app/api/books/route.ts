import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '@/lib/api-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const title = searchParams.get('title');
    const author = searchParams.get('author');

    const books = title || author
      ? await apiService.searchBooks({ title: title || undefined, author: author || undefined })
      : await apiService.getBooks();

    return NextResponse.json({ data: books });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 });
  }
}
