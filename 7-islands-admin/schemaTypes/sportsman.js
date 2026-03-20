export const sportsman = {
  name: 'sportsman',
  title: 'Sportsman/Athlete',
  type: 'document',
  fields: [
    { name: 'name', title: 'Athlete Name', type: 'string' },
    {
      name: 'sport',
      title: 'Primary Sport',
      type: 'reference',
      to: [{ type: 'sport' }] // Links the athlete to a Sport
    },
    { name: 'photo', title: 'Athlete Photo', type: 'image' }
  ]
}