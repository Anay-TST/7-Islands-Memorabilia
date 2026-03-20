export const encounter = {
  name: 'encounter',
  title: 'Personal Encounters',
  type: 'document',
  fields: [
    { 
      name: 'title', 
      title: 'Caption / Title', 
      type: 'string', 
      description: 'e.g., Meeting Sachin Tendulkar in Mumbai' 
    },
    { 
      name: 'image', 
      title: 'Cover Photo', 
      type: 'image', 
      options: { hotspot: true } 
    },
    {
      name: 'videoFile',
      title: 'Upload Video File',
      type: 'file',
      options: { accept: 'video/*' },
      description: 'Upload a video file directly from your device (.mp4, .mov, etc).'
    },
    { 
      name: 'videoUrl', 
      title: 'Or Video Link', 
      type: 'url', 
      description: 'Paste a YouTube or Instagram link here if the file is too large.' 
    },
    {
      name: 'sportsman',
      title: 'Tag the Legend',
      type: 'reference',
      to: [{ type: 'sportsman' }]
    },
    {
      name: 'sport',
      title: 'Associated Sport',
      type: 'reference',
      to: [{ type: 'sport' }]
    },
    { 
      name: 'date', 
      title: 'Date of Encounter', 
      type: 'date' 
    },
    {
      name: 'description',
      title: 'The Story / Description',
      type: 'text'
    }
  ]
}