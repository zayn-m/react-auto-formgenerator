export const userFields = {
  username: {
    type: 'text',
    label: 'Username',
    name: 'username',
    col: 6,
    className: 'userinput'
  },
  email: {
    type: 'email',
    label: 'Email',
    name: 'email',
    col: 6
  },
  password: {
    type: 'password',
    label: 'Password',
    name: 'password',
    col: 6
  },
  role: {
    type: 'advanceSelect',
    label: 'Role',
    name: 'role',
    options: [
      {
        value: 'admin',
        label: 'Admin'
      },
      {
        value: 'customer',
        label: 'Customer'
      }
    ],
    col: 6
  },
  album: {
    type: 'advanceSelect',
    label: 'Album',
    name: 'album',
    target: 'https://react-auto-formgenerator.herokuapp.com/products',
    optionValue: 'id',
    optionLabel: 'name',
    multi: false,
    col: 6
  },
  file: {
    type: 'file',
    label: 'Image',
    name: 'file',
    col: 6
  },
  active: {
    type: 'switch',
    label: 'Active',
    name: 'active'
  }
}

export const candidateFields = {
  fname: {
    type: 'text',
    label: 'Firstname',
    name: 'fname',
    col: 6,
  },
  lname: {
    type: 'text',
    label: 'Lastname',
    name: 'lname',
    col: 6
  },
  email: {
    type: 'email',
    label: 'Email',
    name: 'email',
    col: 12
  },
  phone: {
    type: 'text',
    label: 'Phone',
    name: 'phone',
    col: 12
  },
  addressSection: {
    label: 'Residence',
    type: 'section',
    name: 'addressSection',
    show: false,
    fields: {
      address: {
        type: 'text',
        label: 'Address',
        name: 'address',
        col: 12,
      },
      address2: {
        type: 'text',
        label: 'Address 2',
        name: 'address2',
        col: 12
      },
      zipcode: {
        type: 'number',
        label: 'Postal Code',
        name: 'zipcode',
        col: 4
      }
    }
  },
  educationSection: {
    label: 'Education',
    type: 'section',
    name: 'educationSection',
    show: false,
    fields: {
      school: {
        type: 'text',
        label: 'Name of School/College',
        name: 'school',
        col: 12
      }
    }
  }
}

export const productFields = {
  name: {
    type: 'text',
    label: 'Name',
    name: 'name',
    col: 6
  },
  sku: {
    type: 'text',
    label: 'SKU',
    name: 'sku',
    col: 6
  },
  name: {
    type: 'text',
    label: 'Name',
    name: 'name',
    col: 6
  },
  color: {
    type: 'advanceSelect',
    label: 'Color',
    name: 'color',
    col: 6,
    options: [
      {
        value: 'red',
        label: 'Red'
      },
      {
        value: 'yellow',
        label: 'Yello'
      },
      {
        value: 'green',
        label: 'Green'
      }
    ]
  },
  size: {
    type: 'advanceSelect',
    label: 'Size',
    name: 'size',
    col: 6,
    options: [
      {
        value: 'S',
        label: 'S'
      },
      {
        value: 'M',
        label: 'M'
      },
      {
        value: 'L',
        label: 'L'
      }
    ]
  },
  productNumber: {
    type: 'text',
    label: 'Product Number',
    name: 'productNumber',
    col: 6
  },
  metaDescriptionSection: {
    label: 'Meta Description',
    type: 'section',
    name: 'metaDescriptionSection',
    fields: {
      title: {
        type: 'text',
        label: 'Meta Title',
        name: 'title',
        col: 12
      },
      keywords: {
        type: 'text',
        label: 'Meta Keywords',
        name: 'keywords',
        col: 12
      },
      description: {
        type: 'text',
        label: 'Meta Description',
        name: 'description',
        col: 12
      }
    }
  },
  priceSection: {
    label: 'Price',
    type: 'section',
    name: 'priceSection',
    fields: {
      price: {
        type: 'number',
        label: 'Price ($)',
        name: 'price',
        col: 4
      },
      cost: {
        type: 'number',
        label: 'Cost ($)',
        name: 'cost',
        col: 4
      },
      specialPrice: {
        type: 'number',
        label: 'Special Price ($)',
        name: 'specialPrice',
        col: 4
      }
    },
  },
  groupPrices: {
    label: 'Group Prices',
    type: 'repeater',
    name: 'groupPrices',
    newBtnLabel: 'Add Group Price',
    fields: {
      group: {
        type: 'advanceSelect',
        placeholder: 'Group',
        name: 'group',
        options: [
          {
            value: 'all',
            label: 'All groups'
          },
          {
            value: 'guest',
            label: 'Guest'
          }
        ],
        col: 4,
      },
      qty: {
        type: 'number',
        placeholder: 'Qty',
        name: 'qty',
        col: 4
      },
      discount: {
        type: 'number',
        placeholder: 'Discount',
        name: 'discount',
        col: 3
      }
    }
  }
}