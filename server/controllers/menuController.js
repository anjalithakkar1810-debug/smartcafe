import MenuItem from '../models/MenuItem.js';

export const getMenuItems = async (req, res) => {
    try {
        const menuItems = await MenuItem.find({});
        res.json(menuItems);
    } catch (error) {
        res.status(500).json({
            message: 'Server error: ' + error.message
        });
    }
};
export const createMenuItem = async (req, res) => {
    const {
        name,
        description,
        price,
        category,
        imageUrl,
        isAvailable
    } = req.body;

    try {
        const menuItem = new MenuItem({
            name,
            description,
            price,
            category,
            imageUrl: imageUrl || '',
            isAvailable:
                isAvailable !== undefined
                    ? isAvailable
                    : true
        });

        const createdMenuItem =
            await menuItem.save();

        res.status(201).json(
            createdMenuItem
        );
    } catch (error) {
        res.status(400).json({
            message:
                'Invalid menu item data: ' +
                error.message
        });
    }
};
export const updateMenuItem = async (req, res) => {
    const {
        name,
        description,
        price,
        category,
        imageUrl,
        isAvailable
    } = req.body;

    try {
        const menuItem = await MenuItem.findById(req.params.id);

        if (!menuItem) {
            return res.status(404).json({
                message: 'Menu item not found'
            });
        }

        if (name !== undefined) menuItem.name = name;
        if (description !== undefined) menuItem.description = description;
        if (price !== undefined) menuItem.price = price;
        if (category !== undefined) menuItem.category = category;
        if (imageUrl !== undefined) menuItem.imageUrl = imageUrl;
        if (isAvailable !== undefined) menuItem.isAvailable = isAvailable;

        const updatedMenuItem = await menuItem.save();

        res.json(updatedMenuItem);

    } catch (error) {
        res.status(400).json({
            message:
                'Error updating menu item: ' +
                error.message
        });
    }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        message: 'Menu item not found'
      });
    }

    await menuItem.deleteOne();

    res.json({
      message: 'Menu item removed'
    });

  } catch (error) {
    res.status(500).json({
      message:
        'Error deleting menu item: ' +
        error.message
    });
  }
};