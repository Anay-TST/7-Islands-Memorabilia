export default {
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
      name: 'description',
      title: 'Short Bio/Description',
      type: 'text',
    }
  ]
}