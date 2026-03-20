export const memorabilia = {
  name: 'memorabilia',
  title: 'Memorabilia Vault',
  type: 'document',
  fields: [
    { 
      name: 'title', 
      title: 'Item Title', 
      type: 'string' 
    },
    {
      name: 'sport',
      title: 'Sport',
      type: 'reference',
      to: [{ type: 'sport' }] 
    },
    {
      name: 'sportsman',
      title: 'Sportsman',
      type: 'reference',
      to: [{ type: 'sportsman' }]
    },
    { 
      name: 'image', 
      title: 'Item Image', 
      type: 'image', 
      options: { hotspot: true } 
    },
    { 
      name: 'isLatest', 
      title: 'Show in Latest Arrivals?', 
      type: 'boolean' 
    } // Ensure there's no trailing comma here if it's the last item
  ]
}