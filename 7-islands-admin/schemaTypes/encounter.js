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
      title: 'Photo with Legend', 
      type: 'image', 
      options: { hotspot: true } 
    },
    { 
      name: 'videoUrl', 
      title: 'Video Link (Optional)', 
      type: 'url', 
      description: 'Paste a YouTube or Instagram video link here if you have one.' 
    },
    {
      name: 'sportsman',
      title: 'Tag the Legend',
      type: 'reference',
      to: [{ type: 'sportsman' }],
      description: 'Which athlete is in this picture?'
    },
    { 
      name: 'date', 
      title: 'Date of Encounter', 
      type: 'date' 
    }
  ]
}