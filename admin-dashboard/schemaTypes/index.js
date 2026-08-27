export const schemaTypes = [
  {
    name: 'product',
    title: 'Luxury Kidswear',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Product Name',
        type: 'string',
      },
      {
        name: 'price',
        title: 'Price (TZS)',
        type: 'number',
      },
      {
        name: 'clothingImage',
        title: 'Clothing Photo',
        type: 'image',
        options: { hotspot: true } // Lets the owner crop clothing pictures perfectly
      }
    ]
  }
]
