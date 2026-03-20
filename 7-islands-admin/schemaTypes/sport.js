export const sport = {
  name: 'sport',
  title: 'Sport Category',
  type: 'document',
  fields: [
    { name: 'name', title: 'Sport Name', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } },
    { name: 'image', title: 'Category Image', type: 'image' }
  ]
}