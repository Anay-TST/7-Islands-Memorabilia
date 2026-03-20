export const memorabilia = {
  name: 'memorabilia',
  title: 'Memorabilia Vault',
  type: 'document',
  fields: [
    { name: 'title', title: 'Item Title', type: 'string' },
    { name: 'description', title: 'Item Description', type: 'text' },
    { 
      name: 'sports', // Changed to plural
      title: 'Associated Sports', 
      type: 'array', 
      of: [{ type: 'reference', to: [{ type: 'sport' }] }] 
    },
    { 
      name: 'sportsmen', 
      title: 'Signatures / Athletes', 
      type: 'array', 
      of: [{ type: 'reference', to: [{ type: 'sportsman' }] }] 
    },
    { name: 'image', title: 'Item Image', type: 'image', options: { hotspot: true } },
    { name: 'isLatest', title: 'Show in Latest Arrivals?', type: 'boolean' }
  ]
}