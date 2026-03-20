export const sportsman = {
  name: 'sportsman',
  title: 'Sportsmen / Celebrities',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Full Name',
      type: 'string',
    },
    {
      name: 'image',
      title: 'Athlete Portrait',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'sport',
      title: 'Primary Sport',
      type: 'reference',
      to: [{ type: 'sport' }], // Links this athlete to your Sports list
    },
    {
      name: 'description',
      title: 'Short Bio/Description',
      type: 'text',
    }
  ]
}