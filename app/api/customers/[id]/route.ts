import { NextRequest, NextResponse } from 'next/server';
import { apiService } from '@/lib/api-service';

interface Params {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const customer = await apiService.getCustomerById(params.id);

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ data: customer });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const updates = await request.json();
    const updatedCustomer = await apiService.updateCustomer(params.id, updates);

    if (!updatedCustomer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ data: updatedCustomer, message: 'Customer updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid customer data' }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const success = await apiService.deleteCustomer(params.id);

    if (!success) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}
