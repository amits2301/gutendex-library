import { Book } from '../models/book.models';

const VIEW_PRIORITY = ['text/html', 'application/pdf', 'text/plain'];

export function getPreferredBookUrl(book: Book): string | null {
  const formats = book.formats;

  for (const mime of VIEW_PRIORITY) {
    const match = Object.entries(formats).find(
      ([type]) => type.startsWith(mime) && !type.includes('zip'), // exclude zip files (requirement caveat)
    );

    if (match) {
      return match[1];
    }
  }

  return null;
}
