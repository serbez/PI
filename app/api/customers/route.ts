import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '@/lib/api-service';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const name = searchParams.get('name');

    const customers = id || name
      ? await apiService.searchCustomers({ id: id || undefined, name: name || undefined })
      : await apiService.getCustomers();

    return NextResponse.json({ data: customers });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const customerData = await request.json();
    const newCustomer = await apiService.createCustomer(customerData);

    return NextResponse.json(
      { data: newCustomer, message: 'Customer created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: 'Invalid customer data' }, { status: 400 });
  }
}
