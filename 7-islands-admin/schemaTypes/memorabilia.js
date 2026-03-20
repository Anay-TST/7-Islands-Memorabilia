export const memorabilia = {
  name: 'memorabilia',
  title: 'Memorabilia Vault',
  type: 'document',
  fields: [
    { name: 'title', title: 'Item Title', type: 'string' },
    { name: 'description', title: 'Item Description', type: 'text' }, 
    { name: 'sport', title: 'Sport', type: 'reference', to: [{ type: 'sport' }] },
    { 
      name: 'sportsmen', // Changed to plural
      title: 'Signatures / Athletes', 
      type: 'array', 
      of: [{ type: 'reference', to: [{ type: 'sportsman' }] }] 
    },
    { name: 'image', title: 'Item Image', type: 'image', options: { hotspot: true } },
    { name: 'isLatest', title: 'Show in Latest Arrivals?', type: 'boolean' }
  ]
}