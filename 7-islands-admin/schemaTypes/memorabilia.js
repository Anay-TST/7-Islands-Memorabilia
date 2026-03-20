export const memorabilia = {
  name: 'memorabilia',
  title: 'Memorabilia Vault',
  type: 'document',
  fields: [
    { name: 'title', title: 'Item Title', type: 'string' },
    { 
      name: 'itemType', 
      title: 'Memorabilia Type', 
      type: 'reference', 
      to: [{ type: 'itemType' }] 
    },
    { name: 'year', title: 'Year of Origin', type: 'string', description: 'e.g., 2011' },
    { 
      name: 'venue', 
      title: 'Venue / Stadium', 
      type: 'reference', // CHANGED FROM 'string' TO 'reference'
      to: [{ type: 'venue' }] 
    },
    { 
      name: 'isMatchWorn', 
      title: 'Match Worn / Match Used?', 
      type: 'boolean',
      initialValue: false 
    },
    { name: 'coaProvider', title: 'Authenticated By', type: 'string', description: 'e.g., JSA, PSA, 7 Islands' },
    { name: 'serialNumber', title: 'COA Serial Number', type: 'string' },
    { name: 'description', title: 'Item Description', type: 'text' },
    { 
      name: 'sports', 
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
    { 
      name: 'teams', 
      title: 'Associated Teams', 
      type: 'array', 
      of: [{ type: 'reference', to: [{ type: 'team' }] }] 
    },
    { name: 'image', title: 'Item Image', type: 'image', options: { hotspot: true } },
    { name: 'isLatest', title: 'Show in Latest Arrivals?', type: 'boolean' }
  ]
}