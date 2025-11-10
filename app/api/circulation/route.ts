import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '@/lib/api-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const customerId = searchParams.get('customerId');
    const type = searchParams.get('type'); // 'current' | 'history'

    let data;
    if (type === 'current') {
      data = await apiService.getCurrentIssues(customerId || undefined);
    } else if (type === 'history') {
      data = await apiService.getHistory(customerId || undefined);
    } else {
      data = await apiService.getCirculationRecords();
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch circulation data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { bookId, customerId } = await request.json();

    if (!bookId || !customerId) {
      return NextResponse.json({ error: 'Book ID and Customer ID are required' }, { status: 400 });
    }

    const newRecord = await apiService.issueBook(bookId, customerId);

    return NextResponse.json(
      { data: newRecord, message: 'Book issued successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to issue book' },
      { status: 400 }
    );
  }
}
