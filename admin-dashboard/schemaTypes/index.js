export const schemaTypes = [
  {
    name: 'product',
    title: 'Product',
    type: 'document',
    fields: [
      {
        name: 'title',
        title: 'Product Name',
        type: 'string',
        description: 'The name or title of the product (e.g., Butterfly Bloom Palazzo Set, Kaya Resort Duo)',
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'price',
        title: 'Price in TZS',
        type: 'number',
        description: 'Price in Tanzanian Shillings (e.g., 60000). The website dynamically formats this in TZS and converts to international currencies.',
        validation: (Rule) => Rule.required().positive(),
      },
      {
        name: 'category',
        title: 'Category',
        type: 'string',
        description: 'Select the collection or category for this product',
        options: {
          list: [
            { title: 'Moyo Collection', value: 'moyo' },
            { title: 'Kaya Collection', value: 'kaya' },
            { title: 'Gift Bundles', value: 'gift-bundles' },
            { title: 'Accessories', value: 'accessories' },
          ],
          layout: 'dropdown',
        },
        validation: (Rule) => Rule.required(),
      },
      {
        name: 'clothingImages',
        title: 'Clothing Images',
        type: 'array',
        description: 'Upload multiple photos of this garment (first photo is used as the primary card preview)',
        of: [
          {
            type: 'image',
            options: {
              hotspot: true,
            },
          },
        ],
        validation: (Rule) => Rule.required().min(1),
      },
      {
        name: 'productVideo',
        title: 'Product Video',
        type: 'file',
        description: 'Upload a short showcase video (MP4/WebM) that auto-plays on hover on product cards',
        options: {
          accept: 'video/*',
        },
      },
      {
        name: 'tagline',
        title: 'Tagline / Short Subtitle',
        type: 'string',
        description: 'e.g. 100% Breathable Combed Cotton with Handcrafted African Batiks',
      },
      {
        name: 'description',
        title: 'Product Description & Fabric Story',
        type: 'text',
        rows: 4,
        description: 'Tell the story of the garment, tailoring details, fit, and care instructions.',
      },
      {
        name: 'sizes',
        title: 'Available Sizes',
        type: 'array',
        description: 'List available sizes for this garment',
        of: [{ type: 'string' }],
        options: {
          list: [
            { title: '0-3 Months', value: '0-3 Months' },
            { title: '3-6 Months', value: '3-6 Months' },
            { title: '6-12 Months', value: '6-12 Months' },
            { title: '1-2 Years', value: '1-2 Years' },
            { title: '2-3 Years', value: '2-3 Years' },
            { title: '3-4 Years', value: '3-4 Years' },
            { title: '5-6 Years', value: '5-6 Years' },
            { title: '7-8 Years', value: '7-8 Years' },
            { title: '9-10 Years', value: '9-10 Years' },
            { title: 'One Size / Comfort Fit', value: 'One Size' },
          ],
        },
      },
      {
        name: 'inStock',
        title: 'In Stock',
        type: 'boolean',
        initialValue: true,
      },
      {
        name: 'isFeatured',
        title: 'Feature on Home Spotlight',
        type: 'boolean',
        initialValue: true,
      },
      {
        name: 'instagramPostUrl',
        title: 'Instagram Post / Reel URL',
        type: 'url',
        description: 'Direct link to Instagram reel or post',
      },
    ],
  },
];

