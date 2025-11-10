import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import api from './api-service';
import type { Book, Customer, CirculationRecord } from '../hooks/types/api';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function enrichCirculationRecords(
  records: CirculationRecord[]
): Promise<CirculationRecord[]> {
  if (!Array.isArray(records) || records.length === 0) return records;
  const cache = new Map<string, any>();

  const fetchBook = async (id: string) => {
    if (!id) return null;
    if (cache.has(`book:${id}`)) return cache.get(`book:${id}`);
    try {
      const book = await api.books.getById(id);
      cache.set(`book:${id}`, book);
      return book;
    } catch (e) {
      console.warn('Failed to fetch book:', id, e);
      cache.set(`book:${id}`, null);
      return null;
    }
  };

  const fetchCustomer = async (id: string) => {
    if (!id) return null;
    if (cache.has(`customer:${id}`)) return cache.get(`customer:${id}`);
    try {
      const customer = await api.customers.getById(id);
      cache.set(`customer:${id}`, customer);
      return customer;
    } catch (e) {
      console.warn('Failed to fetch customer:', id, e);
      cache.set(`customer:${id}`, null);
      return null;
    }
  };

  return Promise.all(
    records.map(async (record) => {
      let enriched = { ...record };

      // Обогащаем данные о книге если нужно
      if (record.bookId && (!record.book || !record.book.title)) {
        const book = await fetchBook(record.bookId);
        if (book) {
          enriched.book = book;
        }
      }

      // Обогащаем данные о клиенте если нужно
      if (record.customerId && (!record.customer || !record.customer.name)) {
        const customer = await fetchCustomer(record.customerId);
        if (customer) {
          enriched.customer = customer;
        }
      }

      return enriched;
    })
  );
}

export default {
  enrichCirculationRecords,
};
