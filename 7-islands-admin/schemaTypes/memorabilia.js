export const memorabilia = {
  name: 'memorabilia',
  title: 'Memorabilia Vault',
  type: 'document',
  fields: [
    { name: 'title', title: 'Item Title', type: 'string' },
    { 
      name: 'itemType', 
      title: 'Memorabilia Type', 
      type: 'string',
      options: {
        list: [
          {title: 'Signed Bat', value: 'Signed Bat'},
          {title: 'Signed Ball', value: 'Signed Ball'},
          {title: 'Match-Worn Jersey', value: 'Match-Worn Jersey'},
          {title: 'Helmet', value: 'Helmet'},
          {title: 'Autograph Card', value: 'Autograph Card'},
          {title: 'Photograph', value: 'Photograph'},
          {title: 'Equipment', value: 'Equipment'},
          {title: 'Other', value: 'Other'}
        ]
      }
    },
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
    { name: 'image', title: 'Item Image', type: 'image', options: { hotspot: true } },
    { name: 'isLatest', title: 'Show in Latest Arrivals?', type: 'boolean' }
  ]
}