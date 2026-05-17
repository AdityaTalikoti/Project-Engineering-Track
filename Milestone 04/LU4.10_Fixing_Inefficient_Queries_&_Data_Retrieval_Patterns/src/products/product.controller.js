import { getProducts, getProductById } from './product.service.js';

export async function listProducts(req, res) {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc', fields } = req.query;

    const parsedPage = parseInt(page, 10) || 1;
    let parsedLimit = parseInt(limit, 10) || 10;
    
    if (parsedLimit > 100) parsedLimit = 100;

    const allowedSortFields = ['id', 'name', 'price', 'createdAt', 'updatedAt'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 'asc' : 'desc';

    const allowedFields = ['id', 'name', 'description', 'price', 'category', 'stock', 'imageUrl', 'isActive', 'createdAt', 'updatedAt'];
    let selectFields = undefined;
    
    if (fields) {
      const requestedFields = fields.split(',').map(f => f.trim());
      const invalidFields = requestedFields.filter(f => !allowedFields.includes(f));
      
      if (invalidFields.length > 0) {
        return res.status(400).json({ error: `Invalid field requested: ${invalidFields[0]}` });
      }
      
      selectFields = requestedFields.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {});
    }

    const result = await getProducts({
      page: parsedPage,
      limit: parsedLimit,
      sortBy: sortField,
      order: sortOrder,
      selectFields
    });
    
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getProduct(req, res) {
  try {
    const id = parseInt(req.params.id);
    const product = await getProductById(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}