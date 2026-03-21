export const testimonial = {
  name: 'testimonial',
  title: 'Testimonials',
  type: 'document',
  fields: [
    { name: 'name', title: 'Person Name', type: 'string' },
    { name: 'role', title: 'Role / Title', type: 'string', description: 'e.g., Collector, Athlete, Curator' },
    { name: 'image', title: 'Photo', type: 'image', options: { hotspot: true } },
    {
      name: 'videoFile',
      title: 'Upload Video Testimonial',
      type: 'file',
      options: { accept: 'video/*' }
    },
    { name: 'quote', title: 'Testimonial Quote', type: 'text' },
    {
      name: 'sportsman',
      title: 'Related Legend (Optional)',
      type: 'reference',
      to: [{ type: 'sportsman' }],
      description: 'If this testimonial is from or about a specific legend.'
    }
  ]
}