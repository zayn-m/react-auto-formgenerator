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
  product: {
    type: 'advanceSelect',
    label: 'Product',
    name: 'product',
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