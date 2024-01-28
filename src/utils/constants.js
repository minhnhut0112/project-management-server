import { ObjectId } from 'mongodb'

export const WHITELIST_DOMAINS = ['http://localhost:5173']

export const allowedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
]

export const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/webp']

export const defaultLabels = [
  { _id: new ObjectId(), bgColor: '#baf3db', labelTitle: '' },
  { _id: new ObjectId(), bgColor: '#f5cd47', labelTitle: '' },
  { _id: new ObjectId(), bgColor: '#fedec8', labelTitle: '' },
  { _id: new ObjectId(), bgColor: '#ffd5d2', labelTitle: '' },
  { _id: new ObjectId(), bgColor: '#dfd8fd', labelTitle: '' }
]
